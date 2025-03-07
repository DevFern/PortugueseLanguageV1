/**
 * Mobile Menu Handler
 * Adds mobile menu toggle functionality
 */
class MobileMenuHandler {
  constructor() {
    this.navLinks = document.querySelector('.nav-links');
    this.mobileMenuToggle = null;
    
    this.init();
  }
  
  init() {
    // Create mobile menu toggle button
    this.createMobileMenuToggle();
    
    // Add event listener to toggle button
    this.addToggleEventListener();
    
    // Close menu when clicking outside
    this.addOutsideClickListener();
    
    // Close menu when window is resized to desktop size
    this.addResizeListener();
  }
  
  createMobileMenuToggle() {
    // Create toggle button if it doesn't exist
    if (!document.querySelector('.mobile-menu-toggle')) {
      const toggle = document.createElement('button');
      toggle.className = 'mobile-menu-toggle';
      toggle.innerHTML = '<i class="fas fa-bars"></i>';
      
      const nav = document.querySelector('nav');
      if (nav) {
        nav.insertBefore(toggle, this.navLinks);
        this.mobileMenuToggle = toggle;
      }
    } else {
      this.mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    }
  }
  
  addToggleEventListener() {
    if (this.mobileMenuToggle) {
      this.mobileMenuToggle.addEventListener('click', () => {
        this.toggleMenu();
      });
    }
  }
  
  toggleMenu() {
    if (this.navLinks) {
      this.navLinks.classList.toggle('active');
      
      // Change icon based on menu state
      if (this.mobileMenuToggle) {
        const icon = this.mobileMenuToggle.querySelector('i');
        if (icon) {
          if (this.navLinks.classList.contains('active')) {
            icon.className = 'fas fa-times';
          } else {
            icon.className = 'fas fa-bars';
          }
        }
      }
    }
  }
  
  addOutsideClickListener() {
    document.addEventListener('click', (e) => {
      // Check if menu is active and click is outside nav
      if (
        this.navLinks && 
        this.navLinks.classList.contains('active') && 
        !e.target.closest('nav')
      ) {
        this.navLinks.classList.remove('active');
        
        // Reset icon
        if (this.mobileMenuToggle) {
          const icon = this.mobileMenuToggle.querySelector('i');
          if (icon) {
            icon.className = 'fas fa-bars';
          }
        }
      }
    });
  }
  
  addResizeListener() {
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && this.navLinks && this.navLinks.classList.contains('active')) {
        this.navLinks.classList.remove('active');
        
        // Reset icon
        if (this.mobileMenuToggle) {
          const icon = this.mobileMenuToggle.querySelector('i');
          if (icon) {
            icon.className = 'fas fa-bars';
          }
        }
      }
    });
  }
}
