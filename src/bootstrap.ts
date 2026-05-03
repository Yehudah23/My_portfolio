// Import Bootstrap JavaScript
import { Tooltip, Popover } from 'bootstrap';

// Initialize Bootstrap components
document.addEventListener('DOMContentLoaded', () => {
  try {
    // Initialize tooltips
    const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(tooltipTriggerEl => {
      new Tooltip(tooltipTriggerEl);
    });

    // Initialize popovers
    const popoverTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.forEach(popoverTriggerEl => {
      new Popover(popoverTriggerEl);
    });

    console.log('Bootstrap components initialized successfully');
  } catch (error) {
    console.error('Error initializing Bootstrap components:', error);
  }
});