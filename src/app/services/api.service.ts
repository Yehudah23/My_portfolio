import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { from, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { Auth, User, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { addDoc, collection, deleteDoc, doc, Firestore, getDoc, getDocs, getFirestore, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import type { FirebaseStorage } from 'firebase/storage';
import { firebaseConfig, isFirebaseConfigured } from '../firebase.config';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly projectsCacheKey = 'portfolio.projects.cache.v1';
  private readonly app: FirebaseApp | null;
  private readonly auth: Auth | null;
  private readonly firestore: Firestore | null;
  private readonly storage: FirebaseStorage | null;

  constructor() {
    if (this.isBrowser() && isFirebaseConfigured) {
      this.app = getApps().length ? getApp() : initializeApp(firebaseConfig);
      this.auth = getAuth(this.app);
      this.firestore = getFirestore(this.app);
      this.storage = getStorage(this.app);
    } else {
      this.app = null;
      this.auth = null;
      this.firestore = null;
      this.storage = null;
    }
  }

  submitContact(data: { name: string; email: string; subject: string; message: string }): Observable<any> {
    if (!this.firestore) return this.firebaseNotConfigured();
    return from(addDoc(collection(this.firestore, 'contacts'), { ...data, createdAt: serverTimestamp() })).pipe(
      map(reference => ({ success: true, id: reference.id })), catchError(this.handleError)
    );
  }

  subscribeNewsletter(email: string): Observable<any> {
    if (!this.firestore) return this.firebaseNotConfigured();
    return from(addDoc(collection(this.firestore, 'newsletter'), { email, createdAt: serverTimestamp() })).pipe(
      map(reference => ({ success: true, id: reference.id })), catchError(this.handleError)
    );
  }

  getProjects(bypassCache = false): Observable<any> {
    if (!bypassCache) {
      const cached = this.getProjectsCache();
      if (cached.length > 0) return of({ data: cached, cached: true });
    }
    if (!this.firestore) return this.firebaseNotConfigured();
    return from(getDocs(collection(this.firestore, 'projects'))).pipe(
      map(snapshot => snapshot.docs.map(project => ({ id: project.id, ...project.data() }))),
      tap(projects => this.setProjectsCache(projects)),
      map(data => ({ data, cached: false })), catchError(this.handleError)
    );
  }

  setProjectsCache(projects: any[]): void {
    if (!this.isBrowser()) return;
    try { window.localStorage.setItem(this.projectsCacheKey, JSON.stringify(projects)); } catch { /* Storage may be unavailable. */ }
  }

  getProjectsCache(): any[] {
    if (!this.isBrowser()) return [];
    try {
      const cached = window.localStorage.getItem(this.projectsCacheKey);
      const parsed = cached ? JSON.parse(cached) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  }

  clearProjectsCache(): void {
    if (this.isBrowser()) window.localStorage.removeItem(this.projectsCacheKey);
  }

  adminLogin(email: string, password: string): Observable<any> {
    if (!this.auth) return this.firebaseNotConfigured();
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      map(credential => ({ success: true, user: credential.user })), catchError(this.handleError)
    );
  }

  adminLogout(): Observable<any> {
    if (!this.auth) return of({ success: true });
    return from(signOut(this.auth)).pipe(map(() => ({ success: true })), catchError(this.handleError));
  }

  checkAuth(): Observable<any> {
    if (!this.auth) return of({ authenticated: false });
    return new Observable<User | null>(subscriber => onAuthStateChanged(this.auth!, subscriber)).pipe(
      map(user => ({ authenticated: !!user, user })), catchError(this.handleError)
    );
  }

  createProject(project: any): Observable<any> {
    if (!this.firestore) return this.firebaseNotConfigured();
    return from(this.prepareProject(project)).pipe(
      switchMap(data => from(addDoc(collection(this.firestore!, 'projects'), {
        ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp()
      }))),
      map(reference => ({ success: true, id: reference.id })), catchError(this.handleError)
    );
  }

  updateProject(project: any): Observable<any> {
    if (!this.firestore || project.id === undefined) return this.firebaseNotConfigured();
    const { id, ...projectData } = project;
    return from(this.prepareProject(projectData)).pipe(
      switchMap(data => from(updateDoc(doc(this.firestore!, 'projects', String(id)), {
        ...data, updatedAt: serverTimestamp()
      }))),
      map(() => ({ success: true })), catchError(this.handleError)
    );
  }

  deleteProject(id: string | number): Observable<any> {
    if (!this.firestore) return this.firebaseNotConfigured();
    return from(deleteDoc(doc(this.firestore, 'projects', String(id)))).pipe(
      map(() => ({ success: true })), catchError(this.handleError)
    );
  }

  getBaseUrl(): string { return ''; }
  getSkills(): Observable<any> { return this.getCollection('skills'); }
  getTestimonials(): Observable<any> { return this.getCollection('testimonials'); }

  getUserPreferences(): Observable<any> {
    if (!this.firestore || !this.auth?.currentUser) return this.firebaseNotConfigured();
    return from(getDoc(doc(this.firestore, 'preferences', this.auth.currentUser.uid))).pipe(
      map(snapshot => snapshot.exists() ? snapshot.data() : {}), catchError(this.handleError)
    );
  }

  updateUserPreferences(preferences: { darkMode: boolean }): Observable<any> {
    if (!this.firestore || !this.auth?.currentUser) return this.firebaseNotConfigured();
    return from(setDoc(doc(this.firestore, 'preferences', this.auth.currentUser.uid), preferences, { merge: true })).pipe(
      map(() => ({ success: true })), catchError(this.handleError)
    );
  }

  private getCollection(name: string): Observable<any> {
    if (!this.firestore) return this.firebaseNotConfigured();
    return from(getDocs(collection(this.firestore, name))).pipe(
      map(snapshot => ({ data: snapshot.docs.map(item => ({ id: item.id, ...item.data() })) })), catchError(this.handleError)
    );
  }

  private async prepareProject(project: any): Promise<any> {
    const data = { ...project };
    delete data.id;
    if (data.image?.startsWith('data:') && this.storage) {
      const imageBlob = await (await fetch(data.image)).blob();
      const imageReference = ref(this.storage, `projects/${crypto.randomUUID()}`);
      await uploadBytes(imageReference, imageBlob);
      data.image = await getDownloadURL(imageReference);
    }
    return data;
  }

  private firebaseNotConfigured(): Observable<never> {
    return throwError(() => new Error('Firebase is not configured. Add your Firebase web app values in src/app/firebase.config.ts.'));
  }

  private handleError(error: any) {
    const message = error?.code === 'auth/operation-not-allowed'
      ? 'Email/password sign-in is disabled in Firebase. Enable Email/Password under Authentication > Sign-in method.'
      : error?.code === 'auth/invalid-credential'
        ? 'Invalid email or password.'
        : error?.message || 'Firebase request failed. Check your configuration and security rules.';
    return throwError(() => new Error(message));
  }

  private isBrowser(): boolean { return isPlatformBrowser(this.platformId); }
}
