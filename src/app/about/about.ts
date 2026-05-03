import { CommonModule, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-about',
  imports: [FormsModule, CommonModule, NgClass],
  templateUrl: './about.html',
  styleUrls: ['./about.css']
})
export class About implements OnInit {
  skills = [
    { title: 'Frontend Development', technologies: 'Vue.js, Angular, TypeScript, HTML5, CSS3' },
    { title: 'Backend Development', technologies: 'PHP, Laravel, RESTful APIs, Microservices' },
    { title: 'Database Design', technologies: 'MySQL, Database Architecture, Query Optimization' },
    { title: 'DevOps & Deployment', technologies: 'Docker, CI/CD, Cloud Platforms, Git' }
  ];

  badges = ['Problem Solver', 'Team Player', 'Continuous Learner', 'Open Source Contributor'];

  ngOnInit(): void {
    // Add animation styles
    this.addAnimationStyles();
  }

  getIconForSkill(skillTitle: string): string {
    const iconMap: {[key: string]: string} = {
      'Frontend Development': 'bi-laptop',
      'Backend Development': 'bi-server',
      'Database Design': 'bi-database',
      'DevOps & Deployment': 'bi-gear'
    };
    
    return iconMap[skillTitle] || 'bi-code-slash';
  }

  scrollTo(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  private addAnimationStyles(): void {
    // Add hover effect styles
    const style = document.createElement('style');
    style.innerHTML = `
      .hover-card {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      
      .hover-card:hover {
        transform: translateY(-10px);
        box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
      }
      
      .animate__animated {
        animation-duration: 1s;
      }
      
      .animate__fadeIn {
        animation-name: fadeIn;
      }
      
      .animate__fadeInLeft {
        animation-name: fadeInLeft;
      }
      
      .animate__fadeInRight {
        animation-name: fadeInRight;
      }
      
      .animate__fadeInUp {
        animation-name: fadeInUp;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes fadeInLeft {
        from {
          opacity: 0;
          transform: translate3d(-100px, 0, 0);
        }
        to {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }
      }
      
      @keyframes fadeInRight {
        from {
          opacity: 0;
          transform: translate3d(100px, 0, 0);
        }
        to {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }
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
