import { CommonModule, NgFor, NgIf, NgClass } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';

export interface Project {
  id?: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  category: string;
  featured?: boolean;
  githubUrl?: string;
  liveUrl?: string;
}

@Component({
  standalone: true,
  selector: 'app-projects',
  imports: [FormsModule, CommonModule, NgFor, NgIf, NgClass, ReactiveFormsModule],
  templateUrl: './projects.html',
  styleUrls: ['./projects.css']
})
export class Projects implements OnInit {
  private apiService = inject(ApiService);
  
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  activeFilter: string = 'all';
  isDarkMode: boolean = false;
  showAllProjects: boolean = false;
  loading: boolean = true;
  
  ngOnInit(): void {
    this.addProjectStyles();
    this.loadProjects();
    
    // Check if dark mode is enabled
    this.isDarkMode = document.body.classList.contains('dark-mode');
    
    // Listen for dark mode changes
    document.addEventListener('darkModeChange', (e: any) => {
      this.isDarkMode = e.detail.isDarkMode;
    });
    
    // Listen for project updates from admin panel
    window.addEventListener('projectsUpdated', () => {
      console.log('Projects updated event received, reloading...');
      this.loadProjects();
    });
  }
  
  loadProjects(): void {
    this.loading = true;
    this.apiService.getProjects().subscribe({
      next: (response) => {
        // Ensure technologies is always an array
        const normalizedProjects = (response.data || []).map((project: any) => ({
          ...project,
          technologies: Array.isArray(project.technologies) 
            ? project.technologies 
            : (typeof project.technologies === 'string' 
              ? (project.technologies ? project.technologies.split(',').map((t: string) => t.trim()) : [])
              : [])
        }));

        this.projects = normalizedProjects.length > 0
          ? normalizedProjects
          : this.getBestAvailableProjects();

        if (this.projects.length > 0) {
          this.apiService.setProjectsCache(this.projects);
        }

        this.filterProjects();
        this.loading = false;
      },
      error: () => {
        // Use local cache first so the page still loads without backend.
        this.projects = this.getBestAvailableProjects();
        this.filterProjects();
        this.loading = false;
      }
    });
  }

  private getBestAvailableProjects(): Project[] {
    const cachedProjects = this.apiService.getProjectsCache();
    if (cachedProjects.length > 0) {
      return cachedProjects;
    }

    const defaults = this.getDefaultProjects();
    this.apiService.setProjectsCache(defaults);
    return defaults;
  }
  
  getDefaultProjects(): Project[] {
    return [
      {
        id: 1,
        title: 'E-Commerce Platform',
        description: 'A full-featured online shopping platform with payment integration.',
        image: 'https://via.placeholder.com/400x300',
        technologies: ['Angular', 'Node.js', 'MongoDB', 'Stripe'],
        category: 'Web App',
        featured: true,
        githubUrl: 'https://github.com/example/ecommerce',
        liveUrl: 'https://example.com'
      },
      {
        id: 2,
        title: 'Task Management App',
        description: 'A collaborative task management tool for teams.',
        image: 'https://via.placeholder.com/400x300',
        technologies: ['React', 'Firebase', 'Material-UI'],
        category: 'Web App',
        featured: true,
        githubUrl: 'https://github.com/example/taskapp',
        liveUrl: 'https://example.com'
      },
      {
        id: 3,
        title: 'Weather Dashboard',
        description: 'Real-time weather information with interactive maps.',
        image: 'https://via.placeholder.com/400x300',
        technologies: ['Vue.js', 'OpenWeather API', 'Chart.js'],
        category: 'Web App',
        featured: false,
        githubUrl: 'https://github.com/example/weather',
        liveUrl: 'https://example.com'
      }
    ];
  }
  
  setFilter(filter: string): void {
    this.activeFilter = filter;
    this.filterProjects();
  }
  
  filterProjects(): void {
    if (this.activeFilter === 'all') {
      this.filteredProjects = this.showAllProjects 
        ? [...this.projects]
        : this.projects.slice(0, 6); // Show first 6 projects initially
    } else {
      const filtered = this.projects.filter(project => project.category === this.activeFilter);
      this.filteredProjects = this.showAllProjects 
        ? filtered
        : filtered.slice(0, 6); // Show first 6 filtered projects initially
    }
  }
  
  getUniqueFilters(): string[] {
    const categories = this.projects.map(project => project.category);
    return [...new Set(categories)];
  }
  
  toggleShowAllProjects(): void {
    this.showAllProjects = !this.showAllProjects;
    this.filterProjects();
  }

  // Cap AOS stagger delay to avoid very long cumulative delays when there are many items
  getAosDelay(index: number): number {
    return Math.min(index * 100, 300);
  }
  
  private addProjectStyles(): void {
    const style = document.createElement('style');
    style.innerHTML = `
      .project-card {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        border-radius: 12px;
        overflow: hidden;
      }
      
      .project-card:hover {
        transform: translateY(-10px);
        box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important;
      }
      
      .project-image-container {
        position: relative;
      }
      
      .project-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      
      .project-card:hover .project-overlay {
        opacity: 1;
      }
      
      .btn-group .btn {
        border-radius: 30px;
        padding: 0.5rem 1.5rem;
        margin: 0 0.25rem;
        transition: all 0.3s ease;
      }
      
      .animate__animated {
        animation-duration: 1s;
      }
      
      .animate__fadeIn {
        animation-name: fadeIn;
      }
      
      .animate__fadeInUp {
        animation-name: fadeInUp;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translate3d(0, 40px, 0);
        }
        to {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }
      }
    `;
    document.head.appendChild(style);
  }
}
