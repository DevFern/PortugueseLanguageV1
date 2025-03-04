/**
 * Portuguese A2 Learning App - Main Script
 * This script initializes and manages the core functionality of the application
 */

document.addEventListener('DOMContentLoaded', function() {
    // App state
    const appState = {
        currentSection: window.location.hash.substring(1) || 'hero',
        userLevel: localStorage.getItem('userLevel') || 'beginner',
        theme: localStorage.getItem('theme') || 'light',
        isLoggedIn: false,
        showTranslation: false
    };
    
    // DOM elements - Navigation and UI
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const dashboard = document.getElementById('dashboard');
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const userProfile = document.getElementById('user-profile');
    const userName = document.getElementById('user-name');
    const logoutBtn = document.getElementById('logout-btn');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;
    const getStartedBtn = document.getElementById('get-started-btn');
    const learnMoreBtn = document.getElementById('learn-more-btn');
    const levelButtons = document.querySelectorAll('.level-btn');
    
    // Modals
    const loginModal = document.getElementById('login-modal');
    const signupModal = document.getElementById('signup-modal');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const showSignupLink = document.getElementById('show-signup');
    const showLoginLink = document.getElementById('show-login');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    
    // Initialize modules
    let authManager, flashcardManager, pronunciationTrainer, quizManager, progressTracker;
    
    // Initialize the app
    function init() {
        console.log('Initializing Portuguese A2 Learning App...');
        
        // Initialize Firebase Auth Manager
        if (typeof AuthManager !== 'undefined') {
            authManager = new AuthManager();
            window.authManager = authManager; // Make it globally accessible
            
            // Check if user is logged in
            authManager.onAuthStateChanged(user => {
                if (user) {
                    handleUserLoggedIn(user);
                } else {
                    handleUserLoggedOut();
                }
            });
        } else {
            console.warn('AuthManager not found. Authentication features will be disabled.');
        }
        
        // Apply saved theme
        if (appState.theme === 'dark') {
            document.body.classList.add('dark-theme');
            if (themeIcon) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
        }
        
        // Initialize feature modules if their elements and classes exist
        if (document.querySelector('.flashcard') && typeof FlashcardManager !== 'undefined') {
            flashcardManager = new FlashcardManager();
            flashcardManager.init();
            window.flashcardManager = flashcardManager;
        }
        
        if (document.querySelector('.pronunciation-container') && typeof PronunciationTrainer !== 'undefined') {
            pronunciationTrainer = new PronunciationTrainer();
            pronunciationTrainer.init();
            window.pronunciationTrainer = pronunciationTrainer;
        }
        
        if (document.querySelector('.quiz-container') && typeof QuizManager !== 'undefined') {
            quizManager = new QuizManager();
            quizManager.init();
            window.quizManager = quizManager;
        }
        
        // Initialize progress tracker
        if (typeof ProgressTracker !== 'undefined') {
            progressTracker = new ProgressTracker();
            window.progressTracker = progressTracker; // Make it globally accessible
            progressTracker.init(authManager);
        } else {
            console.warn('ProgressTracker not found. Progress tracking features will be disabled.');
        }
        
        // Show initial section based on hash or default
        showSection(appState.currentSection);
        
        // Set active level buttons based on saved level
        setActiveLevel(appState.userLevel);
        
        // Attach event listeners
        attachEventListeners();
        
        console.log('App initialization complete');
    }
    
    // Handle user logged in state
    function handleUserLoggedIn(user) {
        console.log('User logged in:', user.email);
        appState.isLoggedIn = true;
        
        if (userProfile) userProfile.classList.remove('hidden');
        if (loginBtn) loginBtn.classList.add('hidden');
        if (signupBtn) signupBtn.classList.add('hidden');
        if (userName) userName.textContent = user.displayName || user.email;
        if (dashboard) dashboard.classList.remove('hidden');
        
        // Initialize progress tracker with auth manager
        if (progressTracker) progressTracker.init(authManager);
    }
    
    // Handle user logged out state
    function handleUserLoggedOut() {
        console.log('User logged out');
        appState.isLoggedIn = false;
        
        if (userProfile) userProfile.classList.add('hidden');
        if (loginBtn) loginBtn.classList.remove('hidden');
        if (signupBtn) signupBtn.classList.remove('hidden');
        if (dashboard) dashboard.classList.add('hidden');
        
        // Initialize progress tracker without auth (will use localStorage)
        if (progressTracker) progressTracker.init(null);
    }
    
    // Show a specific section
    function showSection(sectionId) {
        console.log('Showing section:', sectionId);
        
        // If section doesn't exist, default to hero or first available section
        const sectionElement = document.getElementById(sectionId);
        if (!sectionElement) {
            sectionId = document.getElementById('hero') ? 'hero' : 
                       (sections.length > 0 ? sections[0].id : 'flashcards');
        }
        
        // Hide all sections
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Show the selected section
        const selectedSection = document.getElementById(sectionId);
        if (selectedSection) {
            selectedSection.classList.add('active');
            appState.currentSection = sectionId;
            
            // Update active nav link
            navLinks.forEach(link => {
                link.classList.remove('active');
                const linkSection = link.getAttribute('data-section') || 
                                   (link.getAttribute('href') ? link.getAttribute('href').substring(1) : '');
                if (linkSection === sectionId) {
                    link.classList.add('active');
                }
            });
            
            // Update URL hash without scrolling
            const scrollPosition = window.scrollY;
            window.location.hash = sectionId;
            window.scrollTo(0, scrollPosition);
        }
    }
    
    // Set active level
    function setActiveLevel(level) {
        appState.userLevel = level;
        localStorage.setItem('userLevel', level);
        
        // Update UI
        levelButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-level') === level) {
                btn.classList.add('active');
            }
        });
        
        // Update modules with new level
        if (flashcardManager) flashcardManager.setLevel(level);
        if (pronunciationTrainer) pronunciationTrainer.setLevel(level);
        if (quizManager) quizManager.setLevel(level);
    }
    
    // Toggle theme
    function toggleTheme() {
        if (appState.theme === 'light') {
            appState.theme = 'dark';
            document.body.classList.add('dark-theme');
            if (themeIcon) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
        } else {
            appState.theme = 'light';
            document.body.classList.remove('dark-theme');
            if (themeIcon) {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
        }
        
        // Save theme preference
        localStorage.setItem('theme', appState.theme);
    }
    
    // Show modal
    function showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
        }
    }
    
    // Hide modal
    function hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
        }
    }
    
    // Handle login form submission
    async function handleLogin(e) {
        e.preventDefault();
        
        if (!authManager) {
            console.error('Authentication manager not initialized');
            alert('Authentication system is not available');
            return;
        }
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        try {
            await authManager.signIn(email, password);
            hideModal('login-modal');
            document.getElementById('login-form').reset();
        } catch (error) {
            console.error('Login error:', error);
            // Show error message to user
            alert('Login failed: ' + (error.message || 'Unknown error'));
        }
    }
    
    // Handle signup form submission
    async function handleSignup(e) {
        e.preventDefault();
        
        if (!authManager) {
            console.error('Authentication manager not initialized');
            alert('Authentication system is not available');
            return;
        }
        
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        
        try {
            await authManager.signUp(email, password, name);
            hideModal('signup-modal');
            document.getElementById('signup-form').reset();
        } catch (error) {
            console.error('Signup error:', error);
            // Show error message to user
            alert('Signup failed: ' + (error.message || 'Unknown error'));
        }
    }
    
    // Handle logout
    async function handleLogout() {
        if (!authManager) {
            console.error('Authentication manager not initialized');
            return;
        }
        
        try {
            await authManager.signOut();
        } catch (error) {
            console.error('Logout error:', error);
            alert('Logout failed: ' + (error.message || 'Unknown error'));
        }
    }
    
    // Attach event listeners
    function attachEventListeners() {
        // Navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section') || 
                               (link.getAttribute('href') ? link.getAttribute('href').substring(1) : '');
                if (section) {
                    showSection(section);
                }
            });
        });
        
        // Theme toggle
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }
        
        // Get Started button
        if (getStartedBtn) {
            getStartedBtn.addEventListener('click', () => {
                showSection('flashcards');
            });
        }
        
        // Learn More button
        if (learnMoreBtn) {
            learnMoreBtn.addEventListener('click', () => {
                showSection('about');
            });
        }
        
        // Level buttons
        levelButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const level = btn.getAttribute('data-level');
                if (level) {
                    setActiveLevel(level);
                }
            });
        });
        
        // Auth buttons
        if (loginBtn) {
            loginBtn.addEventListener('click', () => showModal('login-modal'));
        }
        
        if (signupBtn) {
            signupBtn.addEventListener('click', () => showModal('signup-modal'));
        }
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        }
        
        // Modal close buttons
        closeModalButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const modal = btn.closest('.modal');
                if (modal) {
                    modal.classList.remove('active');
                }
            });
        });
        
        // Modal background click to close
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });
        
        // Switch between login and signup
        if (showSignupLink) {
            showSignupLink.addEventListener('click', (e) => {
                e.preventDefault();
                hideModal('login-modal');
                showModal('signup-modal');
            });
        }
        
        if (showLoginLink) {
            showLoginLink.addEventListener('click', (e) => {
                e.preventDefault();
                hideModal('signup-modal');
                showModal('login-modal');
            });
        }
        
        // Form submissions
        if (loginForm) {
            loginForm.addEventListener('submit', handleLogin);
        }
        
        if (signupForm) {
            signupForm.addEventListener('submit', handleSignup);
        }
        
        // Handle hash changes
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.substring(1);
            if (hash) {
                showSection(hash);
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Escape key closes modals
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal.active').forEach(modal => {
                    modal.classList.remove('active');
                });
            }
            
            // Navigation with arrow keys when in flashcard section
            if (appState.currentSection === 'flashcards' && flashcardManager) {
                if (e.key === 'ArrowRight') {
                    flashcardManager.nextCard();
                } else if (e.key === 'ArrowLeft') {
                    flashcardManager.prevCard();
                } else if (e.key === ' ' || e.key === 'Spacebar') {
                    flashcardManager.flipCard();
                    e.preventDefault(); // Prevent scrolling with spacebar
                }
            }
        });
    }
    
    // Start the app
    init();
});

/**
 * Utility Functions
 */

// Format date to readable string
function formatDate(date) {
    if (!date) return '';
    
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    
    return new Date(date).toLocaleDateString(undefined, options);
}

// Generate a random ID
function generateId() {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
}

// Shuffle array (Fisher-Yates algorithm)
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Debounce function to limit how often a function can be called
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// Save data to localStorage with expiration
function setWithExpiry(key, value, ttl) {
    const now = new Date();
    const item = {
        value: value,
        expiry: now.getTime() + ttl,
    };
    localStorage.setItem(key, JSON.stringify(item));
}

// Get data from localStorage with expiration check
function getWithExpiry(key) {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;
    
    try {
        const item = JSON.parse(itemStr);
        const now = new Date();
        
        if (now.getTime() > item.expiry) {
            localStorage.removeItem(key);
            return null;
        }
        
        return item.value;
    } catch (e) {
        console.error('Error parsing stored item:', e);
        localStorage.removeItem(key);
        return null;
    }
}
