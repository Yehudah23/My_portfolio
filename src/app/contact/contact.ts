import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';

export interface ContactInfo {
  email?: string;
  phone?: string;
  location?: string;
}

@Component({
  standalone: true,
  selector: 'app-contact',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css']
})
export class Contact implements OnInit {
  @Input() contactInfo: ContactInfo = {};
  
  contactForm!: FormGroup;
  submitted = false;
  loading = false;
  success = false;
  error = '';
  isDarkMode = false;
  
  constructor(
    public formBuilder: FormBuilder,
    public apiService: ApiService
  ) {}
  
  ngOnInit(): void {
    this.initForm();
    
    // Check if dark mode is enabled
    this.isDarkMode = document.body.classList.contains('dark-mode');
    
    // Listen for dark mode changes
    document.addEventListener('darkModeChange', (e: any) => {
      this.isDarkMode = e.detail.isDarkMode;
    });
  }
  
  initForm(): void {
    this.contactForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(5000)]]
    });
  }
  
  // Convenience getter for easy access to form fields
  get f() { return this.contactForm.controls; }
  
  onSubmit(): void {
    this.submitted = true;
    this.error = '';
    this.success = false;
    
    // Stop here if form is invalid
    if (this.contactForm.invalid) {
      return;
    }
    
    this.loading = true;
    
    // Submit to PHP backend
    this.apiService.submitContact(this.contactForm.value).subscribe({
      next: (response) => {
        this.loading = false;
        
        if (response.success) {
          this.success = true;
          this.contactForm.reset();
          this.submitted = false;
          
          // Hide success message after 5 seconds
          setTimeout(() => {
            this.success = false;
          }, 5000);
        } else {
          this.error = response.error || 'Failed to send message. Please try again.';
        }
      },
      error: (error) => {
        this.loading = false;
        this.error = error.message || 'Failed to send message. Please try again later.';
        console.error('Contact form error:', error);
      }
    });
  }
}
