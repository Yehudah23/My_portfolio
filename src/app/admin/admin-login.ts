import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  standalone: true,
  selector: 'app-admin-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-login.html',
  styleUrls: ['./admin-login.css']
})
export class AdminLogin implements OnInit {
  private apiService = inject(ApiService);
  private router = inject(Router);
  
  username = '';
  password = '';
  loading = false;
  error = '';
  
  ngOnInit() {
    // Check if already authenticated
    this.apiService.checkAuth().subscribe({
      next: (response) => {
        if (response.authenticated) {
          this.router.navigate(['/admin/dashboard']);
        }
      },
      error: () => {
        // Not authenticated, stay on login page
      }
    });
  }
  
  onSubmit() {
    if (!this.username || !this.password) {
      this.error = 'Username and password are required';
      return;
    }
    
    this.loading = true;
    this.error = '';
    
    this.apiService.adminLogin(this.username, this.password).subscribe({
      next: (response) => {
        if (response.success) {
          this.router.navigate(['/admin/dashboard']);
        }
      },
      error: (error) => {
        this.loading = false;
        this.error = error.message || 'Login failed. Please try again.';
      }
    });
  }
}
