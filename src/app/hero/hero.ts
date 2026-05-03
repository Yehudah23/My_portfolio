import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { Skills } from '../skills/skills';
import { Projects } from '../projects/projects';
import { About } from '../about/about';

@Component({
  standalone: true,
  selector: 'app-hero',
  imports: [CommonModule, Skills, Projects, About],
  templateUrl: './hero.html',
  styleUrls: ['./hero.css']
})
export class Hero implements OnInit, AfterViewInit {
  @Input() name: string = 'King Judah';
  @Input() title: string = 'Software Engineer/Full Stack Developer';
  @Input() bio: string = 'Passionate developer with expertise in Angular, Vue.js, Javascript, Laravel and PHP. I create responsive and user-friendly web applications.';
  @Input() githubUrl: string = 'https://github.com/Yehudah23';
  @Input() linkedinUrl: string = 'https://www.linkedin.com/in/king-judah-oluwakorede-a30259279';
  @Input() email: string = 'judahk065@gmail.com';
  @Input() imageUrl: string = '/my_picture-removebg-preview.png';
  @Input() skills: string[] = ['Angular', 'Vue.js', 'PHP', 'Laravel', 'Bootstrap', 'Responsive Design', 'Javascript'];

  constructor(public elementRef: ElementRef) {}

  ngOnInit(): void {
    // Add animation classes when component initializes
    document.body.classList.add('hero-loaded');
  }

  ngAfterViewInit(): void {
    // Initialize any JavaScript animations or effects here
    this.addAnimationStyles();
  }

  get nameInitial(): string {
    return this.name ? this.name.charAt(0).toUpperCase() : '';
  }

  public addAnimationStyles(): void {
    // Add animation styles dynamically
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes float {
        0% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(5deg); }
        100% { transform: translateY(0px) rotate(0deg); }
      }
      
      .animated-bg-circle {
        position: absolute;
        border-radius: 50%;
        opacity: 0.5;
      }
      
      .bounce-animation {
        animation: bounce 2s infinite;
      }
      
      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-20px); }
        60% { transform: translateY(-10px); }
      }
      
      .typed-text::after {
        content: '|';
        animation: blink 1s infinite;
      }
      
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
}
