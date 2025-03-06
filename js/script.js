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
  
  // Initialize modules
  const authManager = new AuthManager();
  window.authManager = authManager;
  
  // Initialize other components
  let flashcardManager = null;
  let pronunciationTrainer = null;
  let quizManager = null;
  let a2TestModule = null;
  let progressTracker = null;
  
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
    
    console.log('App initialized');
  }
  
  function showSection(sectionId) {
    console.log('Showing section:', sectionId);
    
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
    
    // Initialize progress tracker
    if (typeof ProgressTracker !== 'undefined') {
      progressTracker = new ProgressTracker();
      progressTracker.init(authManager);
      window.progressTracker = progressTracker;
    }
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
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        
        // Update icon
        this.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        
        // Save preference
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
      });
    }
    
    // Get started button
    if (getStartedBtn) {
      getStartedBtn.addEventListener('click', function() {
        showSection('flashcards');
      });
    }
    
    // Learn more button
    if (learnMoreBtn) {
      learnMoreBtn.addEventListener('click', function() {
        showSection('about');
      });
    }
    
    // Login/Signup buttons
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const loginModal = document.getElementById('login-modal');
    const signupModal = document.getElementById('signup-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const showSignupBtn = document.getElementById('show-signup');
    const showLoginBtn = document.getElementById('show-login');
    const userProfileSection = document.getElementById('user-profile');
    const userNameDisplay = document.getElementById('user-name');
    const logoutBtn = document.getElementById('logout-btn');
    
    // Auth state change listener
    authManager.onAuthStateChanged(user => {
      if (user) {
        // User is signed in
        if (loginBtn) loginBtn.classList.add('hidden');
        if (signupBtn) signupBtn.classList.add('hidden');
        if (userProfileSection) {
          userProfileSection.classList.remove('hidden');
          if (userNameDisplay) userNameDisplay.textContent = user.displayName || user.email;
        }
        
        // Show dashboard if it exists
        const dashboard = document.getElementById('dashboard');
        if (dashboard) dashboard.classList.remove('hidden');
      } else {
        // User is signed out
        if (loginBtn) loginBtn.classList.remove('hidden');
        if (signupBtn) signupBtn.classList.remove('hidden');
        if (userProfileSection) userProfileSection.classList.add('hidden');
        
        // Hide dashboard if it exists
        const dashboard = document.getElementById('dashboard');
        if (dashboard) dashboard.classList.add('hidden');
      }
    });
    
    // Login button
    if (loginBtn && loginModal) {
      loginBtn.addEventListener('click', function() {
        loginModal.style.display = 'block';
      });
    }
    
    // Signup button
    if (signupBtn && signupModal) {
      signupBtn.addEventListener('click', function() {
        signupModal.style.display = 'block';
      });
    }
    
    // Close modal buttons
    if (closeModalBtns) {
      closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
          if (loginModal) loginModal.style.display = 'none';
          if (signupModal) signupModal.style.display = 'none';
        });
      });
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
      if (loginModal && e.target === loginModal) {
        loginModal.style.display = 'none';
      }
      if (signupModal && e.target === signupModal) {
        signupModal.style.display = 'none';
      }
    });
    
    // Show signup from login
    if (showSignupBtn && loginModal && signupModal) {
      showSignupBtn.addEventListener('click', function(e) {
        e.preventDefault();
        loginModal.style.display = 'none';
        signupModal.style.display = 'block';
      });
    }
    
    // Show login from signup
    if (showLoginBtn && loginModal && signupModal) {
      showLoginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        signupModal.style.display = 'none';
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
  }

  // Initialize the app
  init();
});
