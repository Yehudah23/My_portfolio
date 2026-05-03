import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ApiService {
	public readonly http = inject(HttpClient);
	private readonly platformId = inject(PLATFORM_ID);
	public readonly baseUrl = '/api';
	private readonly projectsCacheKey = 'portfolio.projects.cache.v1';

	/**
	 * Submit contact form
	 */
	submitContact(data: {
		name: string;
		email: string;
		subject: string;
		message: string;
	}): Observable<any> {
		return this.http.post(`${this.baseUrl}/contact.php`, data).pipe(
			catchError(this.handleError)
		);
	}

	/**
	 * Subscribe to newsletter
	 */
	subscribeNewsletter(email: string): Observable<any> {
		return this.http.post(`${this.baseUrl}/newsletter.php`, { email }).pipe(
			catchError(this.handleError)
		);
	}

	/**
	 * Get projects from API
	 */
	getProjects(bypassCache: boolean = false): Observable<any> {
		// Check cache first to speed up page loads
		if (!bypassCache) {
			const cached = this.getProjectsCache();
			if (cached.length > 0) {
				// Return cached data immediately
				return new Observable(observer => {
					observer.next({ data: cached, cached: true });
					observer.complete();
				});
			}
		}

		// Fetch from API if no cache or bypass requested
		// Use standard Cache-Control to allow browser caching for 1 hour
		return this.http.get(`${this.baseUrl}/projects.php`, {
			headers: {
				'Cache-Control': 'max-age=3600'
			}
		}).pipe(
			tap((response: any) => {
				const data = Array.isArray(response?.data) ? response.data : [];
				if (data.length > 0) {
					this.setProjectsCache(data);
				}
			}),
			catchError(this.handleError)
		);
	}

	setProjectsCache(projects: any[]): void {
		if (!this.isBrowser()) {
			return;
		}

		try {
			window.localStorage.setItem(this.projectsCacheKey, JSON.stringify(projects));
		} catch {
			// Ignore storage errors (quota/private mode restrictions)
		}
	}

	getProjectsCache(): any[] {
		if (!this.isBrowser()) {
			return [];
		}

		try {
			const cached = window.localStorage.getItem(this.projectsCacheKey);
			if (!cached) {
				return [];
			}

			const parsed = JSON.parse(cached);
			return Array.isArray(parsed) ? parsed : [];
		} catch {
			return [];
		}
	}

	clearProjectsCache(): void {
		if (!this.isBrowser()) {
			return;
		}

		window.localStorage.removeItem(this.projectsCacheKey);
	}

	/**
	 * Admin Authentication
	 */
	adminLogin(username: string, password: string): Observable<any> {
		// Send credentials (cookies) so PHP session cookie is set/used by the browser
		return this.http.post(`${this.baseUrl}/auth.php?action=login`, { username, password }, { withCredentials: true }).pipe(
			catchError(this.handleError)
		);
	}

	adminLogout(): Observable<any> {
		return this.http.get(`${this.baseUrl}/auth.php?action=logout`, { withCredentials: true }).pipe(
			catchError(this.handleError)
		);
	}

	checkAuth(): Observable<any> {
		return this.http.get(`${this.baseUrl}/auth.php?action=check`, { withCredentials: true }).pipe(
			catchError(this.handleError)
		);
	}

	/**
	 * Admin Project Management
	 */
	createProject(project: any): Observable<any> {
		return this.http.post(`${this.baseUrl}/projects.php`, project, { withCredentials: true }).pipe(
			catchError(this.handleError)
		);
	}

	updateProject(project: any): Observable<any> {
		return this.http.put(`${this.baseUrl}/projects.php`, project, { withCredentials: true }).pipe(
			catchError(this.handleError)
		);
	}

	deleteProject(id: number): Observable<any> {
		return this.http.delete(`${this.baseUrl}/projects.php?id=${id}`, { withCredentials: true }).pipe(
			catchError(this.handleError)
		);
	}

	/**
	 * Expose base URL for other components that need to build full URLs (e.g. unload beacon)
	 */
	getBaseUrl(): string {
		return this.baseUrl;
	}

	/**
	 * Get skills from API
	 */
	getSkills(): Observable<any> {
		return this.http.get(`${this.baseUrl}/api.php?resource=skills`).pipe(
			catchError(this.handleError)
		);
	}

	/**
	 * Get testimonials from API
	 */
	getTestimonials(): Observable<any> {
		return this.http.get(`${this.baseUrl}/api.php?resource=testimonials`).pipe(
			catchError(this.handleError)
		);
	}

	/**
	 * Get user preferences from database
	 */
	getUserPreferences(): Observable<any> {
		return this.http.get(`${this.baseUrl}/preferences.php`, { withCredentials: true }).pipe(
			catchError(this.handleError)
		);
	}

	/**
	 * Update user preferences in database
	 */
	updateUserPreferences(preferences: { darkMode: boolean }): Observable<any> {
		return this.http.post(`${this.baseUrl}/preferences.php`, preferences, { withCredentials: true }).pipe(
			catchError(this.handleError)
		);
	}

	/**
	 * Handle HTTP errors
	 */
	private handleError(error: HttpErrorResponse) {
		let errorMessage = 'An error occurred. Please try again later.';
		
		if (error.error instanceof ErrorEvent) {
			// Client-side error
			errorMessage = `Error: ${error.error.message}`;
		} else {
			if (typeof error.error === 'string') {
				if (error.error.includes('Data too long for column') && error.error.includes("'image'")) {
					errorMessage = 'Image data is too large for backend storage. Choose a smaller image or increase the database image column size.';
				} else {
					errorMessage = `Server Error: ${error.status}`;
				}
			} else {
			if (error.error && error.error.error) {
				errorMessage = error.error.error;
			} else if (error.error && error.error.errors) {
				errorMessage = error.error.errors.join(', ');
			} else {
				errorMessage = `Server Error: ${error.status} - ${error.message}`;
			}
			}
		}
		
		return throwError(() => new Error(errorMessage));
	}

	private isBrowser(): boolean {
		return isPlatformBrowser(this.platformId);
	}
} 