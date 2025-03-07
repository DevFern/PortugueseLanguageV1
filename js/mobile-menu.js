class MobileMenu {
  constructor() {
    this.menuButton = document.getElementById('mobile-menu-btn');
    this.mobileNav = document.querySelector('.nav-links');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.overlay = document.createElement('div');
    this.overlay.className = 'mobile-menu-overlay';
    this.isOpen = false;
    
    // Create mobile menu button if it doesn't exist
    if (!this.menuButton) {
      this.createMenuButton();
    }
  }
  
  init() {
    this.attachEventListeners();
    this.setupResponsiveLayout();
    
    // Add overlay to body
    document.body.appendChild(this.overlay);
    
    // Listen for window resize
    window.addEventListener('resize', () => {
      this.setupResponsiveLayout();
    });
  }
  
  createMenuButton() {
    const navContainer = document.querySelector('.nav-container');
    if (!navContainer) return;
    
    this.menuButton = document.createElement('button');
    this.menuButton.id = 'mobile-menu-btn';
    this.menuButton.className = 'mobile-menu-btn';
    this.menuButton.setAttribute('aria-label', 'Toggle navigation menu');
    this.menuButton.innerHTML = '<i class="fas fa-bars"></i>';
    
    // Insert before the first child of nav-container
    navContainer.insertBefore(this.menuButton, navContainer.firstChild);
  }
  
  attachEventListeners() {
    if (this.menuButton) {
      this.menuButton.addEventListener('click', () => {
        this.toggleMenu();
      });
    }
    
    // Close menu when clicking on a link
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          this.closeMenu();
        }
      });
    });
    
    // Close menu when clicking on overlay
    this.overlay.addEventListener('click', () => {
      this.closeMenu();
    });
    
    // Close menu with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeMenu();
      }
    });
  }
  
  setupResponsiveLayout() {
    const isMobile = window.innerWidth <= 768;
    
    // Show/hide menu button based on screen size
    if (this.menuButton) {
      this.menuButton.style.display = isMobile ? 'block' : 'none';
    }
    
    // Reset menu state on desktop
    if (!isMobile && this.isOpen) {
      this.mobileNav.classList.remove('open');
      this.menuButton.classList.remove('open');
      this.overlay.classList.remove('active');
      document.body.classList.remove('menu-open');
      this.isOpen = false;
    }
  }
  
  toggleMenu() {
    if (this.isOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }
  
  openMenu() {
    this.mobileNav.classList.add('open');
    this.menuButton.classList.add('open');
    this.menuButton.innerHTML = '<i class="fas fa-times"></i>';
    this.overlay.classList.add('active');
    document.body.classList.add('menu-open');
    this.isOpen = true;
    
    // Set focus to the first nav link for accessibility
    setTimeout(() => {
      this.navLinks[0].focus();
    }, 100);
  }
  
  closeMenu() {
    this.mobileNav.classList.remove('open');
    this.menuButton.classList.remove('open');
    this.menuButton.innerHTML = '<i class="fas fa-bars"></i>';
    this.overlay.classList.remove('active');
    document.body.classList.remove('menu-open');
    this.isOpen = false;
    
    // Return focus to menu button
    this.menuButton.focus();
  }
}
