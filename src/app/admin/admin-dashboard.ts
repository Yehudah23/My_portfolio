import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

interface Project {
  id?: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  category: string;
  featured: boolean;
  githubUrl?: string;
  liveUrl?: string;
}

@Component({
  standalone: true,
  selector: 'app-admin-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboard implements OnInit, OnDestroy {
  private apiService = inject(ApiService);
  private router = inject(Router);
  
  projects: Project[] = [];
  loading = false;
  showForm = false;
  editMode = false;
  
  currentProject: Project = this.getEmptyProject();
  
  techInput = '';
  
  ngOnInit() {
    // Load projects immediately while checking auth in parallel
    this.loadProjects();
    this.checkAuth();
    
    // Ensure we log out server-side when the admin refreshes or closes the page
    window.addEventListener('beforeunload', this.handleBeforeUnload);
  }

  ngOnDestroy() {
    try { window.removeEventListener('beforeunload', this.handleBeforeUnload); } catch(e) {}
  }

  // Use navigator.sendBeacon if available, otherwise use fetch with keepalive
  handleBeforeUnload = (event: BeforeUnloadEvent) => {
    try {
      const base = this.apiService.getBaseUrl ? this.apiService.getBaseUrl() : 'http://localhost/myportfolio';
      const url = base.replace(/\/$/, '') + '/auth.php?action=logout';
      const payload = new Blob([], { type: 'application/x-www-form-urlencoded' });
      if (navigator && typeof navigator['sendBeacon'] === 'function') {
        navigator['sendBeacon'](url, payload);
      } else {
        // Best-effort: synchronous fetch is deprecated, use keepalive if available
        try {
          fetch(url, { method: 'GET', keepalive: true });
        } catch (e) {
          // nothing we can do on unload
        }
      }
    } catch (e) {
      // swallow errors during unload
    }
  }
  
  checkAuth() {
    this.apiService.checkAuth().subscribe({
      error: () => {
        // Not authenticated -> redirect to login
        this.router.navigate(['/admin/login']);
      }
    });
  }
  
  loadProjects(bypassCache: boolean = false, notifyUpdated: boolean = false) {
    const startTime = performance.now();
    console.log('Loading projects from API...');
    this.loading = true;

    this.apiService.getProjects(bypassCache).subscribe({
      next: (response) => {
        const loadTime = (performance.now() - startTime).toFixed(0);
        console.log(`Projects loaded in ${loadTime}ms:`, response.data);
        
        // Ensure technologies is always an array
        this.projects = (response.data || []).map((project: any) => ({
          ...project,
          technologies: Array.isArray(project.technologies) 
            ? project.technologies 
            : (typeof project.technologies === 'string' 
              ? (project.technologies ? project.technologies.split(',').map((t: string) => t.trim()) : [])
              : [])
        }));

        if (this.projects.length > 0) {
          this.apiService.setProjectsCache(this.projects);
        }
        
        console.log('Projects after processing:', this.projects);
        this.loading = false;

        if (notifyUpdated) {
          window.dispatchEvent(new CustomEvent('projectsUpdated'));
        }
      },
      error: (err) => {
        const loadTime = (performance.now() - startTime).toFixed(0);
        console.error(`Failed to load projects after ${loadTime}ms:`, err);

        const cachedProjects = this.apiService.getProjectsCache();
        if (cachedProjects.length > 0) {
          this.projects = cachedProjects;
          alert('⚠️ Backend unavailable. Showing cached projects.');
        } else {
          alert('❌ Failed to load projects. Please check your connection.');
        }

        this.loading = false;

        if (notifyUpdated) {
          window.dispatchEvent(new CustomEvent('projectsUpdated'));
        }
      }
    });
  }

  // trackBy to speed up ngFor rendering on updates
  trackByProject(index: number, project: any) {
    return project.id || index;
  }
  
  getEmptyProject(): Project {
    return {
      title: '',
      description: '',
      image: '',
      technologies: [],
      category: 'Web App',
      featured: false,
      githubUrl: '',
      liveUrl: ''
    };
  }
  
  openAddForm() {
    this.currentProject = this.getEmptyProject();
    this.editMode = false;
    this.showForm = true;
  }
  
  editProject(project: Project) {
    // Deep copy to ensure all fields are preserved including image
    this.currentProject = { 
      id: project.id,
      title: project.title,
      description: project.description,
      image: project.image || '',
      technologies: [...(project.technologies || [])],
      category: project.category,
      featured: project.featured || false,
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || ''
    };
    console.log('=== EDIT PROJECT CLICKED ===');
    console.log('Original project from list:', project);
    console.log('Current project for editing:', this.currentProject);
    console.log('Image URL:', this.currentProject.image);
    console.log('===============================');
    this.editMode = true;
    this.showForm = true;
  }
  
  cancelForm() {
    this.showForm = false;
    this.currentProject = this.getEmptyProject();
  }
  
  addTechnology() {
    if (this.techInput.trim()) {
      this.currentProject.technologies.push(this.techInput.trim());
      this.techInput = '';
    }
  }
  
  removeTechnology(index: number) {
    this.currentProject.technologies.splice(index, 1);
  }
  
  onImageSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }
      
      // Convert to base64
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.currentProject.image = String(e.target.result || '');
      };
      reader.readAsDataURL(file);
    }
  }
  
  saveProject() {
    if (!this.currentProject.title || !this.currentProject.description) {
      alert('Title and description are required');
      return;
    }
    
    // Ensure image is not undefined
    if (!this.currentProject.image) {
      this.currentProject.image = '';
    }
    
    console.log('=== SAVING PROJECT ===');
    console.log('Edit Mode:', this.editMode);
    console.log('Project ID:', this.currentProject.id);
    console.log('Image URL being sent:', this.currentProject.image);
    console.log('Full project data:', JSON.stringify(this.currentProject, null, 2));
    console.log('======================');
    
    this.loading = true;
    
    const observable = this.editMode
      ? this.apiService.updateProject(this.currentProject)
      : this.apiService.createProject(this.currentProject);
    
    observable.subscribe({
      next: (response) => {
        console.log('=== SAVE RESPONSE ===');
        console.log('Response:', response);
        console.log('=====================');
        
        // Clear projects array first to force a fresh load
        this.projects = [];
        
        // Clear browser cache for this endpoint
        this.clearProjectsCache();
        
        // Wait longer to ensure DB write is complete
        setTimeout(() => {
          this.loading = false;
          this.cancelForm();
          this.loadProjects(true, true); // Bypass cache and notify after fresh data loads
          alert(this.editMode ? '✅ Project updated successfully! Check console for details.' : '✅ Project created successfully!');
        }, 1000);
      },
      error: (error) => {
        console.error('=== SAVE FAILED ===');
        console.error('Error:', error);
        console.error('===================');
        this.loading = false;
        alert('❌ Error: ' + error.message);
      }
    });
  }
  
  deleteProject(id: number) {
    if (!confirm('Are you sure you want to delete this project?')) {
      return;
    }
    
    this.loading = true;
    this.apiService.deleteProject(id).subscribe({
      next: () => {
        this.clearProjectsCache();
        this.loadProjects(true, true); // Bypass cache and notify after fresh data loads
        alert('Project deleted successfully!');
      },
      error: (error) => {
        this.loading = false;
        alert('Error: ' + error.message);
      }
    });
  }
  
  clearProjectsCache() {
    this.apiService.clearProjectsCache();
  }
  
  logout() {
    this.apiService.adminLogout().subscribe({
      next: () => {
        this.router.navigate(['/admin/login']);
      },
      error: () => {
        // navigate back to login even if logout failed
        this.router.navigate(['/admin/login']);
      }
    });
  }
}
