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

    // DOM elements
    const navLinks = document.querySelectorAll('nav a');
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
    const startLearningBtn = document.getElementById('start-learning');
    const scoreElement = document.getElementById('quiz-score');
    const userProfileSection = document.getElementById('user-profile');
    const userNameDisplay = document.getElementById('user-name');
    const logoutBtn = document.getElementById('logout-btn');
    
    // A2-level content structured by difficulty
    const lessonContent = {
        beginner: [
            {
                type: 'vocab',
                word: 'restaurante',
                portuguese: 'restaurante',
                translation: 'restaurant',
                usage: 'Vamos ao restaurante?',
                englishUsage: 'Shall we go to the restaurant?',
                category: 'daily life'
            },
            {
                type: 'phrase',
                portuguese: 'Quanto custa isto?',
                translation: 'How much is this?',
                usage: 'Shopping and prices',
                audioUrl: 'assets/audio/quanto-custa.mp3'
            },
            {
                type: 'vocab',
                portuguese: 'comboio',
                translation: 'train',
                usage: 'European Portuguese uses "comboio" instead of "trem"',
                category: 'transportation'
            },
            {
                type: 'phrase',
                portuguese: 'Bom dia, tudo bem?',
                translation: 'Good morning, how are you?',
                usage: 'Common morning greeting',
                audioUrl: 'assets/audio/bom-dia.mp3'
            }
        ],
        intermediate: [
            {
                type: 'dialogue',
                portuguese: 'Poderia me dizer onde fica a estação de comboio?',
                translation: 'Could you tell me where the train station is?',
                usage: 'Asking for directions',
                alternatives: ['Como chego à estação?', 'Onde é a estação?']
            },
            {
                type: 'grammar',
                portuguese: 'Estou a aprender português',
                translation: 'I am learning Portuguese',
                usage: 'Present Continuous - Use "estar a + infinitive" for ongoing actions'
            },
            {
                type: 'dialogue',
                portuguese: 'Gostaria de reservar uma mesa para dois, por favor.',
                translation: 'I would like to book a table for two, please.',
                usage: 'At a restaurant',
                alternatives: ['Tem mesa para dois?', 'Podemos sentar-nos?']
            }
        ],
        advanced: [
            {
                type: 'situation',
                portuguese: 'Tenho dores de cabeça há três dias',
                translation: 'I've had headaches for three days',
                usage: 'At the doctor's office',
                vocabulary: ['dores', 'sintomas', 'medicação']
            },
            {
                type: 'expression',
                portuguese: 'Dar com a língua nos dentes',
                translation: 'To let the cat out of the bag (to reveal a secret)',
                usage: 'Common idiomatic expression',
                vocabulary: ['expressão', 'segredo', 'revelar']
            },
            {
                type: 'formal',
                portuguese: 'Venho por este meio solicitar a vossa colaboração',
                translation: 'I hereby request your collaboration',
                usage: 'Formal letter or email',
                vocabulary: ['formal', 'solicitar', 'colaboração']
            }
        ]
    };

    // Initialize modules
    const authManager = new AuthManager();
    const flashcardManager = new FlashcardManager(vocabularyData, lessonContent);
    const quizManager = new QuizManager(a2TestPrep);
    const pronunciationTrainer = new PronunciationTrainer();
    const progressTracker = new ProgressTracker();

    // Initialize the app
    function init() {
        // Load user preferences from localStorage
        loadUserPreferences();
        
        // Initialize UI based on state
        updateUI();
        
        // Attach event listeners
        attachEventListeners();
        
        // Initialize modules
        flashcardManager.init();
        quizManager.init();
        pronunciationTrainer.init();
        progressTracker.init();
    }

    // Load user preferences from localStorage
    function loadUserPreferences() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            state.theme = savedTheme;
            if (savedTheme === 'dark') {
                document.body.classList.add('dark-theme');
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            }
        }
        
        const savedLevel = localStorage.getItem('level');
        if (savedLevel) {
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
        sections.forEach(section => {
            if (section.id === state.currentSection) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
        
        // Update navigation
        navLinks.forEach(link => {
            const sectionId = link.getAttribute('href').substring(1);
            if (sectionId === state.currentSection) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // Update auth UI
        updateAuthUI();
        
        // Update level buttons
        levelBtns.forEach(btn => {
            if (btn.getAttribute('data-level') === state.level) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    // Update authentication UI
    function updateAuthUI() {
        if (state.isLoggedIn && state.user) {
            loginBtn.classList.add('hidden');
            signupBtn.classList.add('hidden');
            userProfileSection.classList.remove('hidden');
            userNameDisplay.textContent = state.user.displayName || state.user.email;
            
            // Show dashboard if logged in
            document.querySelector('.dashboard').classList.remove('hidden');
        } else {
            loginBtn.classList.remove('hidden');
            signupBtn.classList.remove('hidden');
            userProfileSection.classList.add('hidden');
            
            // Hide dashboard if not logged in
            document.querySelector('.dashboard').classList.add('hidden');
        }
    }

    // Attach event listeners
    function attachEventListeners() {
        // Navigation
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const sectionId = this.getAttribute('href').substring(1);
                state.currentSection = sectionId;
                updateUI();
            });
        });
        
        // Level selection
        levelBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                levelBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                state.level = this.getAttribute('data-level');
                localStorage.setItem('level', state.level);
                
                // Update content based on level
                flashcardManager.setLevel(state.level);
                quizManager.setLevel(state.level);
                pronunciationTrainer.setLevel(state.level);
            });
        });
        
        // Theme toggle
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
        
        // Start learning button
        startLearningBtn.addEventListener('click', function() {
            state.currentSection = 'flashcards';
            updateUI();
        });
        
        // Authentication
        loginBtn.addEventListener('click', function() {
            loginModal.classList.add('active');
        });
        
        signupBtn.addEventListener('click', function() {
            signupModal.classList.add('active');
        });
        
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                loginModal.classList.remove('active');
                signupModal.classList.remove('active');
            });
        });
        
        showSignupBtn.addEventListener('click', function(e) {
            e.preventDefault();
            loginModal.classList.remove('active');
            signupModal.classList.add('active');
        });
        
        showLoginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            signupModal.classList.remove('active');
            loginModal.classList.add('active');
        });
        
        logoutBtn.addEventListener('click', function() {
            authManager.signOut().then(() => {
                state.isLoggedIn = false;
                state.user = null;
                localStorage.removeItem('user');
                updateAuthUI();
            });
        });
        
        // Login form submission
        document.getElementById('login-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            authManager.signIn(email, password).then(user => {
                if (user) {
                    state.isLoggedIn = true;
                    state.user = user;
                    localStorage.setItem('user', JSON.stringify(user));
                    loginModal.classList.remove('active');
                    updateAuthUI();
                }
            });
        });
        
        // Signup form submission
        document.getElementById('signup-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            
            authManager.signUp(email, password, name).then(user => {
                if (user) {
                    state.isLoggedIn = true;
                    state.user = user;
                    localStorage.setItem('user', JSON.stringify(user));
                    signupModal.classList.remove('active');
                    updateAuthUI();
                }
            });
        });
        
        // Close modals when clicking outside
        window.addEventListener('click', function(e) {
            if (e.target === loginModal) {
                loginModal.classList.remove('active');
            }
            if (e.target === signupModal) {
                signupModal.classList.remove('active');
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
            document.getElementById('total-cards').textContent = cards.length;
        }
        
        function renderCard() {
            if (cards.length === 0) {
                flashcardContainer.innerHTML = '<p>No cards available for this category and level.</p>';
                return;
            }
            
            const card = cards[currentCardIndex];
            const cardWord = card.word || card.portuguese;
            const cardTranslation = card.translation;
            const cardUsage = card.usage;
            
            // Update current card number
            document.getElementById('current-card').textContent = currentCardIndex + 1;
            
            // Update progress bar
            const progressPercentage = ((currentCardIndex + 1) / cards.length) * 100;
            document.querySelector('.progress').style.width = `${progressPercentage}%`;
            
            // Create flashcard HTML
            const flashcard = document.querySelector('.flashcard');
            const flashcardInner = flashcard.querySelector('.flashcard-inner');
            
            // Update front of card
            const frontWord = flashcardInner.querySelector('.word');
            frontWord.textContent = cardWord;
            
            // Update back of card
            const backTranslation = flashcardInner.querySelector('.translation');
            backTranslation.textContent = cardTranslation;
            
            const backUsage = flashcardInner.querySelector('.usage');
            if (backUsage) {
                backUsage.textContent = cardUsage;
            }
            
            // Reset card flip
            flashcard.classList.remove('flipped');
            
            // Update audio button if available
            const audioBtn = flashcardInner.querySelector('.audio-btn');
            if (audioBtn) {
                audioBtn.onclick = function() {
                    if (card.audio) {
                        pronunciationTrainer.playAudio(card.audio);
                    }
                };
            }
        }
        
        function attachFlashcardEvents() {
            // Category selection
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
            
            // Flip card
            document.getElementById('flip-card').addEventListener('click', function() {
                const flashcard = document.querySelector('.flashcard');
                flashcard.classList.toggle('flipped');
            });
            
            // Navigate cards
            document.getElementById('prev-card').addEventListener('click', function() {
                if (currentCardIndex > 0) {
                    currentCardIndex--;
                    renderCard();
                }
            });
            
            document.getElementById('next-card').addEventListener('click', function() {
                if (currentCardIndex < cards.length - 1) {
                    currentCardIndex++;
                    renderCard();
                    
                    // Track progress
                    if (state.isLoggedIn) {
                        progressTracker.updateFlashcardProgress(currentCategory, currentCardIndex);
                    }
                }
            });
        }
    }

    // Start the app
    init();
});

// Class definitions for other modules are in their respective files
