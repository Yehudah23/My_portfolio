import { CommonModule, NgFor, NgClass } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

export interface Skill {
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
}

export interface SkillCategory {
  category: string;
  description: string;
  skills: Skill[];
}

@Component({
  standalone: true,
  selector: 'app-skills',
  imports: [CommonModule, NgFor, NgClass, ReactiveFormsModule, FormsModule],
  templateUrl: './skills.html',
  styleUrls: ['./skills.css']
})
export class Skills implements OnInit {
  @Input() skillCategories: SkillCategory[] = [
    {
      category: 'Frontend',
      description: 'Building responsive and interactive user interfaces with modern frameworks and libraries.',
      skills: [
        { name: 'Angular', level: 'Expert' },
       
        { name: 'JavaScript', level: 'Expert' },
        { name: 'HTML5', level: 'Expert' },
        { name: 'CSS3/SCSS', level: 'Advanced' },
        { name: 'Vue.js', level: 'Intermediate' },
        
      ]
    },
    {
      category: 'Backend',
      description: 'Developing robust server-side applications and APIs with various technologies.',
      skills: [
        { name: 'PHP', level: 'Expert' },
        { name: 'Laravel', level: 'Advanced' },
       
      ]
    },
    {
      category: 'Database',
      description: 'Designing and optimizing database structures for efficient data storage and retrieval.',
      skills: [
        { name: 'MySQL', level: 'Expert' },
      
      ]
    },
    {
      category: 'DevOps',
      description: 'Implementing continuous integration and deployment pipelines for efficient software delivery.',
      skills: [
        { name: 'Git', level: 'Expert' },
        { name: 'Docker', level: 'Intermediate' },
       
      ]
    }
  ];
  
  activeTabIndex: number = 0;
  isDarkMode: boolean = false;
  
  get activeCategory(): SkillCategory | undefined {
    return this.skillCategories[this.activeTabIndex];
  }
  
  ngOnInit(): void {
    this.addSkillStyles();
    
    // Check if dark mode is enabled
    this.isDarkMode = document.body.classList.contains('dark-mode');
    
    // Listen for dark mode changes
    document.addEventListener('darkModeChange', (e: any) => {
      this.isDarkMode = e.detail.isDarkMode;
    });
  }
  
  setActiveTab(index: number): void {
    this.activeTabIndex = index;
  }
  
  getProgressPercentage(level: string): number {
    const percentages: {[key: string]: number} = {
      'Beginner': 25,
      'Intermediate': 50,
      'Advanced': 75,
      'Expert': 100
    };
    
    return percentages[level] || 0;
  }
  
  getLevelBadgeClass(level: string): string {
    const classes: {[key: string]: string} = {
      'Beginner': 'bg-secondary',
      'Intermediate': 'bg-info',
      'Advanced': 'bg-primary',
      'Expert': 'bg-success'
    };
    
    return classes[level] || 'bg-secondary';
  }
  
  getLevelProgressClass(level: string): string {
    const classes: {[key: string]: string} = {
      'Beginner': 'bg-secondary',
      'Intermediate': 'bg-info',
      'Advanced': 'bg-primary',
      'Expert': 'bg-success'
    };
    
    return classes[level] || 'bg-secondary';
  }
  
  getSkillTagClass(level: string): string {
    const classes: {[key: string]: string} = {
      'Beginner': 'skill-tag-beginner',
      'Intermediate': 'skill-tag-intermediate',
      'Advanced': 'skill-tag-advanced',
      'Expert': 'skill-tag-expert'
    };
    
    return classes[level] || 'skill-tag-beginner';
  }
  
  getIconForCategory(category: string): string {
    const iconMap: {[key: string]: string} = {
      'Frontend': 'bi-laptop',
      'Backend': 'bi-server',
      'Database': 'bi-database',
      'DevOps': 'bi-gear'
    };
    
    return iconMap[category] || 'bi-code-slash';
  }
  
  getAllSkills(): Skill[] {
    return this.skillCategories.flatMap(category => category.skills);
  }
  
  private addSkillStyles(): void {
    const style = document.createElement('style');
    style.innerHTML = `
      .skill-progress-container {
        transition: all 0.3s ease;
      }
      
      .progress {
        background-color: rgba(0,0,0,0.1);
        border-radius: 30px;
        overflow: hidden;
      }
      
      .progress-bar {
        transition: width 1.5s ease-in-out;
        border-radius: 30px;
      }
      
      .skill-cloud {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 10px;
      }
      
      .skill-tag {
        padding: 8px 16px;
        border-radius: 30px;
        display: inline-block;
        margin: 5px;
        font-weight: 500;
        animation: fadeInScale 0.5s forwards;
        opacity: 0;
        transform: scale(0.8);
      }
      
      .skill-tag-beginner {
        background-color: rgba(108, 117, 125, 0.15);
        color: #6c757d;
      }
      
      .skill-tag-intermediate {
        background-color: rgba(13, 202, 240, 0.15);
        color: #0dcaf0;
      }
      
      .skill-tag-advanced {
        background-color: rgba(13, 110, 253, 0.15);
        color: #0d6efd;
      }
      
      .skill-tag-expert {
        background-color: rgba(25, 135, 84, 0.15);
        color: #198754;
      }
      
      @keyframes fadeInScale {
        from {
          opacity: 0;
          transform: scale(0.8);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
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
    `;
    document.head.appendChild(style);
  }
}
