import { Component, OnInit, HostListener, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private apiService = inject(ApiService);
  darkMode = false;
  isScrolled = false;
  isMenuOpen = false;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    // Load dark mode preference from database
    this.loadPreferences();
  }

  private loadPreferences(): void {
    this.apiService.getUserPreferences().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.darkMode = response.data.darkMode;
          if (this.darkMode) {
            this.applyDarkMode();
          }
        }
      },
      error: () => {
        // Fallback to system preference if API fails
        const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.darkMode = prefersDarkMode;
        if (this.darkMode) {
          this.applyDarkMode();
        }
      }
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.isScrolled = window.scrollY > 50;
  }

  toggleDarkMode(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    this.darkMode = !this.darkMode;
    
    // Save preference to database
    this.apiService.updateUserPreferences({ darkMode: this.darkMode }).subscribe({
      next: () => {
        // Preference saved successfully
      },
      error: (err) => {
        console.error('Failed to save dark mode preference:', err);
      }
    });
    
    if (this.darkMode) {
      this.applyDarkMode();
    } else {
      this.removeDarkMode();
    }
    
    // Dispatch event for other components
    document.dispatchEvent(new CustomEvent('darkModeChange', { 
      detail: { isDarkMode: this.darkMode } 
    }));
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  scrollTo(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      
      // Close mobile menu after clicking a link
      this.isMenuOpen = false;
    }
  }
  
  private applyDarkMode(): void {
    document.body.classList.add('dark-mode');
    document.documentElement.setAttribute('data-bs-theme', 'dark');
  }
  
  private removeDarkMode(): void {
    document.body.classList.remove('dark-mode');
    document.documentElement.setAttribute('data-bs-theme', 'light');
  }
}
