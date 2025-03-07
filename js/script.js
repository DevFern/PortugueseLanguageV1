/**
 * Main script for the Portuguese A2 Learning App
 * Initializes all components and manages app state
 */

document.addEventListener('DOMContentLoaded', function() {
  // App state
  const appState = {
    currentSection: window.location.hash.substring(1) || 'home',
    userLevel: localStorage.getItem('userLevel') || 'beginner',
    theme: localStorage.getItem('theme') || 'light'
  };
  
  // DOM elements
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section');
  const themeToggle = document.getElementById('theme-toggle');
  const getStartedBtn = document.getElementById('get-started-btn');
  const learnMoreBtn = document.getElementById('learn-more-btn');
  const loginBtn = document.getElementById('login-btn');
  const signupBtn = document.getElementById('signup-btn');
  const userProfile = document.getElementById('user-profile');
  const userName = document.getElementById('user-name');
  const logoutBtn = document.getElementById('logout-btn');
  const dashboard = document.getElementById('dashboard');
  const mobileMenuToggle = document.createElement('button');
  
  // Initialize modules
  const authManager = new AuthManager();
  window.authManager = authManager;
  
  const dataManager = new DataManager();
  window.dataManager = dataManager;
  dataManager.init();
  
  // Initialize other components
  let flashcardManager = null;
  let pronunciationTrainer = null;
  let quizManager = null;
  let a2TestModule = null;
  let progressTracker = null;
  let mobileMenu = null;
  let onboardingManager = null;
  
  function init() {
    console.log('Initializing app...');
    
    // Apply saved theme
    if (appState.theme === 'dark') {
      document.body.classList.add('dark-theme');
      if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Show initial section
    showSection(appState.currentSection);
    
    // Initialize components
    initializeComponents();
    
    // Attach event listeners
    attachEventListeners();
    
    // Set up auth state listener
    authManager.onAuthStateChanged(handleAuthStateChanged);
    
    // Initialize mobile menu
    initializeMobileMenu();
    
    console.log('App initialized');
  }
  
  function handleAuthStateChanged(user) {
    if (user) {
      // User is signed in
      console.log('User signed in:', user.email);
      
      if (loginBtn) loginBtn.classList.add('hidden');
      if (signupBtn) signupBtn.classList.add('hidden');
      if (userProfile) {
        userProfile.classList.remove('hidden');
        if (userName) userName.textContent = user.displayName || user.email;
      }
      
      // Show dashboard
      if (dashboard) dashboard.classList.remove('hidden');
      
      // Initialize progress tracker if not already initialized
      if (!progressTracker && typeof ProgressTracker !== 'undefined') {
        progressTracker = new ProgressTracker();
        progressTracker.init(authManager);
        window.progressTracker = progressTracker;
      }
    } else {
      // User is signed out
      console.log('User signed out');
      
      if (loginBtn) loginBtn.classList.remove('hidden');
      if (signupBtn) signupBtn.classList.remove('hidden');
      if (userProfile) userProfile.classList.add('hidden');
      
      // Hide dashboard
      if (dashboard) dashboard.classList.add('hidden');
    }
  }
  
  function showSection(sectionId) {
    // Default to home if section doesn't exist
    if (!document.getElementById(sectionId)) {
      sectionId = 'home';
    }
    
    // Update active section
    sections.forEach(section => {
      if (section.id === sectionId) {
        section.classList.add('active');
      } else {
        section.classList.remove('active');
      }
    });
    
    // Update navigation
    navLinks.forEach(link => {
      const linkSectionId = link.getAttribute('data-section');
      if (linkSectionId === sectionId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
    
    // Update app state
    appState.currentSection = sectionId;
    window.location.hash = sectionId;
    
    // Close mobile menu if open
    if (mobileMenu && window.innerWidth <= 768) {
      mobileMenu.closeMenu();
    }
    
    // Show onboarding tips for new users
    if (onboardingManager) {
      onboardingManager.showTipsForSection(sectionId);
    }
  }
  
  function initializeComponents() {
    // Initialize flashcards
    if (typeof FlashcardManager !== 'undefined') {
      flashcardManager = new FlashcardManager();
      flashcardManager.init();
      window.flashcardManager = flashcardManager;
    }
    
    // Initialize pronunciation trainer
    if (typeof PronunciationTrainer !== 'undefined') {
      pronunciationTrainer = new PronunciationTrainer();
      pronunciationTrainer.init();
      window.pronunciationTrainer = pronunciationTrainer;
    }
    
    // Initialize quiz manager
    if (typeof QuizManager !== 'undefined') {
      quizManager = new QuizManager();
      quizManager.init();
      window.quizManager = quizManager;
    }
    
    // Initialize A2 test module
    if (typeof A2TestPreparation !== 'undefined') {
      a2TestModule = new A2TestPreparation();
      a2TestModule.init();
      window.a2TestModule = a2TestModule;
    }
    
    // Initialize progress tracker (only if user is logged in)
    if (typeof ProgressTracker !== 'undefined' && authManager.getCurrentUser()) {
      progressTracker = new ProgressTracker();
      progressTracker.init(authManager);
      window.progressTracker = progressTracker;
    }
    
    // Initialize onboarding manager
    if (typeof OnboardingManager !== 'undefined') {
      onboardingManager = new OnboardingManager();
      onboardingManager.init();
      window.onboardingManager = onboardingManager;
    }
  }
  
  function initializeMobileMenu() {
    if (typeof MobileMenuHandler !== 'undefined') {
      mobileMenu = new MobileMenuHandler();
      mobileMenu.init();
      window.mobileMenu = mobileMenu;
    } else {
      console.warn('MobileMenuHandler not found');
    }
    
    // Add CSS for mobile menu toggle
    const mobileMenuStyle = document.createElement('style');
    mobileMenuStyle.textContent = `
      .mobile-menu-toggle {
        display: none;
        background: none;
        border: none;
        color: var(--text-color);
        font-size: 24px;
        cursor: pointer;
        padding: 5px;
      }
      
      @media (max-width: 768px) {
        .mobile-menu-toggle {
          display: block;
        }
        
        .nav-links {
          display: none;
          flex-direction: column;
          position: absolute;
          top: 60px;
          left: 0;
          right: 0;
          background-color: var(--background-color);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          z-index: 100;
          padding: 10px 0;
        }
        
        .nav-links.open {
          display: flex;
        }
        
        .nav-link {
          padding: 12px 20px;
          width: 100%;
          text-align: left;
        }
      }
    `;
    document.head.appendChild(mobileMenuStyle);
  }
  
  function attachEventListeners() {
    // Navigation
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const sectionId = this.getAttribute('data-section');
        if (sectionId) {
          showSection(sectionId);
        }
      });
    });
    
    // Theme toggle
    if (themeToggle) {
      themeToggle.addEventListener('click', function() {
        if (appState.theme === 'light') {
          document.body.classList.add('dark-theme');
          this.innerHTML = '<i class="fas fa-sun"></i>';
          appState.theme = 'dark';
        } else {
          document.body.classList.remove('dark-theme');
          this.innerHTML = '<i class="fas fa-moon"></i>';
          appState.theme = 'light';
        }
        localStorage.setItem('theme', appState.theme);
      });
    }
    
    // Get Started button
    if (getStartedBtn) {
      getStartedBtn.addEventListener('click', function() {
        showSection('flashcards');
      });
    }
    
    // Learn More button
    if (learnMoreBtn) {
      learnMoreBtn.addEventListener('click', function() {
        showSection('about');
      });
    }
    
    // Login button
    if (loginBtn) {
      loginBtn.addEventListener('click', function() {
        const loginModal = document.getElementById('login-modal');
        if (loginModal) {
          loginModal.classList.remove('hidden');
          loginModal.style.display = 'block';
        }
      });
    }
    
    // Signup button
    if (signupBtn) {
      signupBtn.addEventListener('click', function() {
        const signupModal = document.getElementById('signup-modal');
        if (signupModal) {
          signupModal.classList.remove('hidden');
          signupModal.style.display = 'block';
        }
      });
    }
    
    // Close modal buttons
    const closeModalBtns = document.querySelectorAll('.close-modal');
    if (closeModalBtns) {
      closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
          const modal = this.closest('.modal');
          if (modal) {
            modal.classList.add('hidden');
            modal.style.display = 'none';
          }
        });
      });
    }
    
    // Modal switch links
    const showSignupBtn = document.getElementById('show-signup');
    const showLoginBtn = document.getElementById('show-login');
    const loginModal = document.getElementById('login-modal');
    const signupModal = document.getElementById('signup-modal');
    
    if (showSignupBtn && loginModal && signupModal) {
      showSignupBtn.addEventListener('click', function(e) {
        e.preventDefault();
        loginModal.classList.add('hidden');
        loginModal.style.display = 'none';
        signupModal.classList.remove('hidden');
        signupModal.style.display = 'block';
      });
    }
    
    if (showLoginBtn && loginModal && signupModal) {
      showLoginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        signupModal.classList.add('hidden');
        signupModal.style.display = 'none';
        loginModal.classList.remove('hidden');
        loginModal.style.display = 'block';
      });
    }
    
    // Logout button
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function() {
        authManager.signOut();
      });
    }
    
    // Login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        try {
          await authManager.signIn(email, password);
          
          // Close modal
          if (loginModal) {
            loginModal.classList.add('hidden');
            loginModal.style.display = 'none';
          }
          
          // Reset form
          loginForm.reset();
        } catch (error) {
          console.error('Login error:', error);
          alert('Login failed: ' + error.message);
        }
      });
    }
    
    // Signup form submission
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
      signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        
        try {
          await authManager.signUp(email, password, name);
          
          // Close modal
          if (signupModal) {
            signupModal.classList.add('hidden');
            signupModal.style.display = 'none';
          }
          
          // Reset form
          signupForm.reset();
        } catch (error) {
          console.error('Signup error:', error);
          alert('Signup failed: ' + error.message);
        }
      });
    }
    
    // Window click to close modals
    window.addEventListener('click', function(e) {
      if (e.target.classList.contains('modal')) {
        e.target.classList.add('hidden');
        e.target.style.display = 'none';
      }
    });
    
    // Add keyboard shortcuts for navigation
    document.addEventListener('keydown', (e) => {
      // Global section navigation shortcuts (Alt + number)
      if (e.altKey) {
        if (e.key === '1') showSection('home');
        if (e.key === '2') showSection('flashcards');
        if (e.key === '3') showSection('pronunciation');
        if (e.key === '4') showSection('quiz');
        if (e.key === '5') showSection('a2test');
        if (e.key === '6') showSection('progress');
        if (e.key === '7') showSection('about');
      }
    });
  }
  
  // Initialize the app
  init();
});
