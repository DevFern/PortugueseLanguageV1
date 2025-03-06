/**
 * Authentication Manager for Portuguese A2 Learning App
 * Simplified version using localStorage instead of Firebase
 */

class AuthManager {
  constructor() {
    this.currentUser = null;
    this.isInitialized = false;
    this.listeners = [];
    
    // Check if user is already logged in from localStorage
    this.init();
  }
  
  init() {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        this.currentUser = JSON.parse(savedUser);
        this.isInitialized = true;
        
        // Notify any listeners
        this.notifyAuthStateChanged();
      } catch (e) {
        console.error('Error parsing saved user:', e);
        localStorage.removeItem('user');
      }
    }
  }
  
  getCurrentUser() {
    return this.currentUser;
  }
  
  isLoggedIn() {
    return !!this.currentUser;
  }
  
  async signIn(email, password) {
    // Simple validation
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    // In a real app, you would validate against a server
    // For now, we'll just simulate a successful login
    this.currentUser = {
      email: email,
      displayName: email.split('@')[0],
      uid: 'local-' + Date.now()
    };
    
    // Save to localStorage
    localStorage.setItem('user', JSON.stringify(this.currentUser));
    
    // Notify listeners
    this.notifyAuthStateChanged();
    
    return this.currentUser;
  }
  
  async signUp(email, password, displayName) {
    // Simple validation
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    // Create a new user
    this.currentUser = {
      email: email,
      displayName: displayName || email.split('@')[0],
      uid: 'local-' + Date.now()
    };
    
    // Save to localStorage
    localStorage.setItem('user', JSON.stringify(this.currentUser));
    
    // Initialize empty progress
    const emptyProgress = {
      vocabulary: 0,
      grammar: 0,
      listening: 0,
      quizzes: [],
      lastActivity: null,
      totalLessonsCompleted: 0,
      streak: 0,
      lastLogin: new Date().toISOString()
    };
    
    localStorage.setItem('progress', JSON.stringify(emptyProgress));
    
    // Notify listeners
    this.notifyAuthStateChanged();
    
    return this.currentUser;
  }
  
  async signOut() {
    this.currentUser = null;
    localStorage.removeItem('user');
    
    // Notify listeners
    this.notifyAuthStateChanged();
  }
  
  onAuthStateChanged(callback) {
    if (typeof callback === 'function') {
      this.listeners.push(callback);
      
      // Call immediately with current state
      callback(this.currentUser);
    }
    
    return () => {
      // Return function to unsubscribe
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }
  
  notifyAuthStateChanged() {
    this.listeners.forEach(callback => {
      try {
        callback(this.currentUser);
      } catch (e) {
        console.error('Error in auth state change listener:', e);
      }
    });
  }
  
  // Progress management methods
  async getProgress() {
    if (!this.currentUser) {
      return null;
    }
    
    const savedProgress = localStorage.getItem('progress');
    if (savedProgress) {
      try {
        return JSON.parse(savedProgress);
      } catch (e) {
        console.error('Error parsing progress:', e);
        return null;
      }
    }
    
    // Return default progress if none exists
    const defaultProgress = {
      vocabulary: 0,
      grammar: 0,
      listening: 0,
      quizzes: [],
      lastActivity: null,
      totalLessonsCompleted: 0,
      streak: 0,
      lastLogin: new Date().toISOString()
    };
    
    localStorage.setItem('progress', JSON.stringify(defaultProgress));
    return defaultProgress;
  }
  
  async saveProgress(progress) {
    if (!this.currentUser) {
      return false;
    }
    
    localStorage.setItem('progress', JSON.stringify(progress));
    return true;
  }
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // App state
  const state = {
    currentSection: 'welcome',
    level: 'beginner',
    theme: 'light',
    isLoggedIn: false,
    user: null,
    lessonIndex: 0,
    score: 0,
    showTranslation: false
  };

  // DOM elements - check if they exist before using
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section');
  const levelBtns = document.querySelectorAll('.level-btn');
  const themeToggle = document.getElementById('theme-toggle');
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
  
  // Get the start learning button if it exists
  const startLearningBtn = document.getElementById('get-started-btn');
  
  // Initialize modules
  const authManager = new AuthManager();
  window.authManager = authManager; // Make it globally accessible
  
  // Initialize other modules if they exist
  let flashcardManager = null;
  let quizManager = null;
  let pronunciationTrainer = null;
  let progressTracker = null;
  
  // Initialize the app
  function init() {
    // Load user preferences from localStorage
    loadUserPreferences();
    
    // Check if user is logged in
    authManager.onAuthStateChanged(user => {
      if (user) {
        handleUserLoggedIn(user);
      } else {
        handleUserLoggedOut();
      }
    });
    
    // Initialize UI based on state
    updateUI();
    
    // Attach event listeners
    attachEventListeners();
    
    // Initialize modules if their classes exist
    if (typeof FlashcardManager !== 'undefined') {
      flashcardManager = new FlashcardManager();
      flashcardManager.init();
      window.flashcardManager = flashcardManager;
    }
    
    if (typeof QuizManager !== 'undefined') {
      quizManager = new QuizManager();
      quizManager.init();
      window.quizManager = quizManager;
    }
    
    if (typeof PronunciationTrainer !== 'undefined') {
      pronunciationTrainer = new PronunciationTrainer();
      pronunciationTrainer.init();
      window.pronunciationTrainer = pronunciationTrainer;
    }
    
    if (typeof ProgressTracker !== 'undefined') {
      progressTracker = new ProgressTracker();
      progressTracker.init(authManager);
      window.progressTracker = progressTracker;
    }
  }

  // Load user preferences from localStorage
  function loadUserPreferences() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      state.theme = savedTheme;
      if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
      }
    }
    
    const savedLevel = localStorage.getItem('userLevel');
    if (savedLevel && levelBtns) {
      state.level = savedLevel;
      levelBtns.forEach(btn => {
        if (btn.getAttribute('data-level') === savedLevel) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }
  }

  // Handle user logged in
  function handleUserLoggedIn(user) {
    state.isLoggedIn = true;
    state.user = user;
    updateAuthUI();
  }
  
  // Handle user logged out
  function handleUserLoggedOut() {
    state.isLoggedIn = false;
    state.user = null;
    updateAuthUI();
  }

  // Update UI based on current state
  function updateUI() {
    // Update active section
    if (sections) {
      sections.forEach(section => {
        if (section.id === state.currentSection) {
          section.classList.add('active');
        } else {
          section.classList.remove('active');
        }
      });
    }
    
    // Update navigation
    if (navLinks) {
      navLinks.forEach(link => {
        const sectionId = link.getAttribute('data-section');
        if (sectionId === state.currentSection) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
    
    // Update auth UI
    updateAuthUI();
    
    // Update level buttons
    if (levelBtns) {
      levelBtns.forEach(btn => {
        if (btn.getAttribute('data-level') === state.level) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }
  }
  
  // Update authentication UI
  function updateAuthUI() {
    if (!loginBtn || !signupBtn || !userProfileSection) return;
    
    if (state.isLoggedIn && state.user) {
      loginBtn.classList.add('hidden');
      signupBtn.classList.add('hidden');
      userProfileSection.classList.remove('hidden');
      if (userNameDisplay) {
        userNameDisplay.textContent = state.user.displayName || state.user.email;
      }
      
      // Show dashboard if it exists
      const dashboard = document.querySelector('.dashboard');
      if (dashboard) dashboard.classList.remove('hidden');
    } else {
      loginBtn.classList.remove('hidden');
      signupBtn.classList.remove('hidden');
      userProfileSection.classList.add('hidden');
      
      // Hide dashboard if it exists
      const dashboard = document.querySelector('.dashboard');
      if (dashboard) dashboard.classList.add('hidden');
    }
  }

  // Attach event listeners
  function attachEventListeners() {
    // Navigation
    if (navLinks) {
      navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          const sectionId = this.getAttribute('data-section');
          if (sectionId) {
            state.currentSection = sectionId;
            updateUI();
          }
        });
      });
    }
    
    // Level selection
    if (levelBtns) {
      levelBtns.forEach(btn => {
        btn.addEventListener('click', function() {
          levelBtns.forEach(b => b.classList.remove('active'));
          this.classList.add('active');
          state.level = this.getAttribute('data-level');
          localStorage.setItem('userLevel', state.level);
          
          // Update content based on level
          if (flashcardManager) flashcardManager.setLevel(state.level);
          if (quizManager) quizManager.setLevel(state.level);
          if (pronunciationTrainer) pronunciationTrainer.setLevel(state.level);
        });
      });
    }
    
    // Theme toggle
    if (themeToggle) {
      themeToggle.addEventListener('click', function() {
        if (state.theme === 'light') {
          document.body.classList.add('dark-theme');
          this.innerHTML = '<i class="fas fa-sun"></i>';
          state.theme = 'dark';
        } else {
          document.body.classList.remove('dark-theme');
          this.innerHTML = '<i class="fas fa-moon"></i>';
          state.theme = 'light';
        }
        localStorage.setItem('theme', state.theme);
      });
    }
    
    // Start learning button
    if (startLearningBtn) {
      startLearningBtn.addEventListener('click', function() {
        state.currentSection = 'flashcards';
        updateUI();
      });
    }
    
    // Authentication
    if (loginBtn && loginModal) {
      loginBtn.addEventListener('click', function() {
        loginModal.classList.remove('hidden');
        loginModal.style.display = 'block';
      });
    }
    
    if (signupBtn && signupModal) {
      signupBtn.addEventListener('click', function() {
        signupModal.classList.remove('hidden');
        signupModal.style.display = 'block';
      });
    }
    
    if (closeModalBtns) {
      closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
          if (loginModal) {
            loginModal.classList.add('hidden');
            loginModal.style.display = 'none';
          }
          if (signupModal) {
            signupModal.classList.add('hidden');
            signupModal.style.display = 'none';
          }
        });
      });
    }
    
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
  }

  // Initialize the app
  init();
});
