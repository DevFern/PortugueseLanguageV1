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
    
    // Initialize flashcard manager only if vocabularyData exists
    let flashcardManager = null;
    if (typeof vocabularyData !== 'undefined' && typeof lessonContent !== 'undefined') {
        flashcardManager = new FlashcardManager(vocabularyData, lessonContent);
    } else {
        console.warn('Vocabulary data or lesson content not found');
    }
    
    // Initialize quiz manager only if a2TestPrep exists
    let quizManager = null;
    if (typeof a2TestPrep !== 'undefined') {
        quizManager = new QuizManager(a2TestPrep);
    } else {
        console.warn('Quiz data not found');
    }
    
    // Initialize other modules
    let pronunciationTrainer = new PronunciationTrainer();
    let progressTracker = new ProgressTracker();

    // Initialize the app
    function init() {
        // Load user preferences from localStorage
        loadUserPreferences();
        
        // Initialize UI based on state
        updateUI();
        
        // Attach event listeners
        attachEventListeners();
        
        // Initialize modules if they exist
        if (flashcardManager) flashcardManager.init();
        if (quizManager) quizManager.init();
        if (pronunciationTrainer) pronunciationTrainer.init();
        if (progressTracker) progressTracker.init();
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
        
        const savedLevel = localStorage.getItem('level');
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
        
        // Check if user is logged in
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                state.user = JSON.parse(userData);
                state.isLoggedIn = true;
                updateAuthUI();
            } catch (e) {
                console.error('Error parsing user data:', e);
                localStorage.removeItem('user');
            }
        }
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
                    localStorage.setItem('level', state.level);
                    
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
                authManager.signOut().then(() => {
                    state.isLoggedIn = false;
                    state.user = null;
                    localStorage.removeItem('user');
                    updateAuthUI();
                });
            });
        }
        
        // Login form submission
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = document.getElementById('login-email').value;
                const password = document.getElementById('login-password').value;
                
                authManager.signIn(email, password).then(user => {
                    if (user) {
                        state.isLoggedIn = true;
                        state.user = user;
                        localStorage.setItem('user', JSON.stringify(user));
                        if (loginModal) {
                            loginModal.classList.add('hidden');
                            loginModal.style.display = 'none';
                        }
                        updateAuthUI();
                    }
                });
            });
        }
        
        // Signup form submission
        const signupForm = document.getElementById('signup-form');
        if (signupForm) {
            signupForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const name = document.getElementById('signup-name').value;
                const email = document.getElementById('signup-email').value;
                const password = document.getElementById('signup-password').value;
                
                authManager.signUp(email, password, name).then(user => {
                    if (user) {
                        state.isLoggedIn = true;
                        state.user = user;
                        localStorage.setItem('user', JSON.stringify(user));
                        if (signupModal) {
                            signupModal.classList.add('hidden');
                            signupModal.style.display = 'none';
                        }
                        updateAuthUI();
                    }
                });
            });
        }
        
        // Close modals when clicking outside
        window.addEventListener('click', function(e) {
            if (loginModal && e.target === loginModal) {
                loginModal.classList.add('hidden');
                loginModal.style.display = 'none';
            }
            if (signupModal && e.target === signupModal) {
                signupModal.classList.add('hidden');
                signupModal.style.display = 'none';
            }
        });
    }

    // FlashcardManager class
    function FlashcardManager(vocabularyData, lessonContent) {
        const flashcardContainer = document.querySelector('.flashcard-container');
        const categoryBtns = document.querySelectorAll('.category-btn');
        let currentCategory = 'citizenship';
        let currentCardIndex = 0;
        let cards = [];
        
        this.init = function() {
            if (!flashcardContainer) {
                console.warn('Flashcard container not found');
                return;
            }
            
            loadCards();
            renderCard();
            attachFlashcardEvents();
        };
        
        this.setLevel = function(level) {
            // Filter cards based on level
            loadCards();
            currentCardIndex = 0;
            renderCard();
        };
        
        function loadCards() {
            if (!vocabularyData) {
                console.warn('Vocabulary data not found');
                return;
            }
            
            // Load cards from vocabulary data based on current category and level
            if (vocabularyData && vocabularyData[currentCategory]) {
                if (state.level === 'beginner' && vocabularyData[currentCategory].basic) {
                    cards = vocabularyData[currentCategory].basic;
                } else if (state.level === 'advanced' && vocabularyData[currentCategory].advanced) {
                    cards = vocabularyData[currentCategory].advanced;
                } else {
                    // Fallback to lesson content
                    cards = lessonContent[state.level].filter(item => 
                        item.type === 'vocab' || item.type === 'phrase'
                    );
                }
            } else {
                // Fallback to lesson content
                cards = lessonContent[state.level].filter(item => 
                    item.type === 'vocab' || item.type === 'phrase'
                );
            }
            
            // Update total cards count
            const totalCardsElement = document.getElementById('total-cards');
            if (totalCardsElement) {
                totalCardsElement.textContent = cards.length;
            }
        }
        
        function renderCard() {
            if (!flashcardContainer) return;
            
            if (cards.length === 0) {
                flashcardContainer.innerHTML = '<p>No cards available for this category and level.</p>';
                return;
            }
            
            const card = cards[currentCardIndex];
            const cardWord = card.word || card.portuguese;
            const cardTranslation = card.translation;
            const cardUsage = card.usage;
            
            // Update current card number
            const currentCardElement = document.getElementById('current-card');
            if (currentCardElement) {
                currentCardElement.textContent = currentCardIndex + 1;
            }
            
            // Update progress bar
            const progressElement = document.querySelector('.progress');
            if (progressElement) {
                const progressPercentage = ((currentCardIndex + 1) / cards.length) * 100;
                progressElement.style.width = `${progressPercentage}%`;
            }
            
            // Create flashcard HTML
            const flashcard = document.querySelector('.flashcard');
            if (!flashcard) return;
            
            const flashcardInner = flashcard.querySelector('.flashcard-inner');
            if (!flashcardInner) return;
            
            // Update front of card
            const frontWord = flashcardInner.querySelector('.word');
            if (frontWord) {
                frontWord.textContent = cardWord;
            }
            
            // Update back of card
            const backTranslation = flashcardInner.querySelector('.translation');
            if (backTranslation) {
                backTranslation.textContent = cardTranslation;
            }
            
            const backUsage = flashcardInner.querySelector('.usage');
            if (backUsage) {
                backUsage.textContent = cardUsage;
            }
            
            // Reset card flip
            flashcard.classList.remove('flipped');
            
            // Update audio button if available
            const audioBtn = flashcardInner.querySelector('.audio-btn');
            if (audioBtn && pronunciationTrainer) {
                audioBtn.onclick = function() {
                    if (card.audio) {
                        pronunciationTrainer.playAudio(card.audio);
                    }
                };
            }
        }
        
        function attachFlashcardEvents() {
            // Category selection
            if (categoryBtns) {
                categoryBtns.forEach(btn => {
                    btn.addEventListener('click', function() {
                        categoryBtns.forEach(b => b.classList.remove('active'));
                        this.classList.add('active');
                        currentCategory = this.getAttribute('data-category');
                        currentCardIndex = 0;
                        loadCards();
                        renderCard();
                    });
                });
            }
            
            // Flip card
            const flipCardBtn = document.getElementById('flip-card');
            if (flipCardBtn) {
                flipCardBtn.addEventListener('click', function() {
                    const flashcard = document.querySelector('.flashcard');
                    if (flashcard) {
                        flashcard.classList.toggle('flipped');
                    }
                });
            }
            
            // Navigate cards
            const prevCardBtn = document.getElementById('prev-card');
            if (prevCardBtn) {
                prevCardBtn.addEventListener('click', function() {
                    if (currentCardIndex > 0) {
                        currentCardIndex--;
                        renderCard();
                    }
                });
            }
            
            const nextCardBtn = document.getElementById('next-card');
            if (nextCardBtn) {
                nextCardBtn.addEventListener('click', function() {
                    if (currentCardIndex < cards.length - 1) {
                        currentCardIndex++;
                        renderCard();
                        
                        // Track progress
                        if (state.isLoggedIn && progressTracker) {
                            progressTracker.updateFlashcardProgress(currentCategory, currentCardIndex);
                        }
                    }
                });
            }
        }
    }

    // Define a simple ProgressTracker class if it doesn't exist
    function ProgressTracker() {
        this.init = function() {
            console.log('Progress tracker initialized');
        };
        
        this.updateFlashcardProgress = function(category, index) {
            console.log(`Updated flashcard progress: ${category}, card ${index + 1}`);
            // Implement actual progress tracking here
        };
    }

    // Start the app
    init();
});
