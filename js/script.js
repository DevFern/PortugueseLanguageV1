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
  }
  
  // Initialize the app
  init();
});
