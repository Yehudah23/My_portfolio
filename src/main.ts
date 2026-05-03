import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
// Bootstrap icons imported in angular.json
// Import AOS styles
import 'aos/dist/aos.css';

// Import AOS for scroll animations
import * as AOS from 'aos';

// Import Bootstrap initialization
import './bootstrap';

bootstrapApplication(App, appConfig)
  .then(() => {
    try {
      // Initialize AOS after the app has bootstrapped
      // once: true -> animate only once when scrolling down
      AOS.init({
        duration: 700,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      });
    } catch (e) {
      console.warn('AOS initialization failed:', e);
    }
  })
  .catch((err) => console.error(err));
