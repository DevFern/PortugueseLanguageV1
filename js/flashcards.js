class FlashcardManager {
    constructor() {
        this.cards = [];
        this.currentIndex = 0;
        this.level = localStorage.getItem('userLevel') || 'beginner';
        this.category = 'citizenship';
        this.isFlipped = false;
        
        // DOM elements
        this.flashcardContainer = document.querySelector('.flashcard-container');
        this.flashcardElement = document.querySelector('.flashcard');
        this.wordElement = document.querySelector('.word');
        this.phoneticElement = document.querySelector('.phonetic');
        this.translationElement = document.querySelector('.translation');
        this.usageElement = document.querySelector('.usage');
        this.englishUsageElement = document.querySelector('.english-usage');
        this.currentCardElement = document.getElementById('current-card');
        this.totalCardsElement = document.getElementById('total-cards');
        
        // Create audio button if it doesn't exist
        this.audioButton = document.querySelector('.audio-btn') || document.createElement('button');
        if (!document.querySelector('.audio-btn')) {
            this.audioButton.className = 'audio-btn';
            this.audioButton.innerHTML = '<i class="fas fa-volume-up"></i> Listen';
        }
        
        // Buttons
        this.prevButton = document.getElementById('prev-card');
        this.nextButton = document.getElementById('next-card');
        this.flipButton = document.getElementById('flip-card');
        
        // Level and category selectors
        this.levelButtons = document.querySelectorAll('.level-btn');
        this.categoryButtons = document.querySelectorAll('.category-btn');
    }
    
    init() {
        console.log('Initializing FlashcardManager');
        
        // Check if we have the necessary elements
        if (!this.flashcardElement) {
            console.error('Flashcard element not found');
            return;
        }
        
        this.loadCards();
        this.renderCard();
        this.attachEventListeners();
        
        // Log initialization success
        console.log('FlashcardManager initialized with', this.cards.length, 'cards');
    }
    
    loadCards() {
        console.log('Loading cards for category:', this.category, 'and level:', this.level);
        
        // Reset cards array
        this.cards = [];
        
        // Check if vocabulary data exists
        if (typeof vocabularyData === 'undefined') {
            console.error('Vocabulary data not found');
            return;
        }
        
        // Map level names to data structure names
        const levelMap = {
            'beginner': 'basic',
            'intermediate': 'intermediate',
            'advanced': 'advanced'
        };
        
        const dataLevel = levelMap[this.level] || 'basic';
        
        // Get cards based on category and level
        if (vocabularyData[this.category] && vocabularyData[this.category][dataLevel]) {
            this.cards = vocabularyData[this.category][dataLevel];
            console.log(`Loaded ${this.cards.length} cards from vocabulary data`);
        }
        
        // If no cards found, use fallback data
        if (this.cards.length === 0) {
            console.warn('No cards found for the selected category and level, using fallback data');
            this.cards = [
                {
                    word: 'cidadania',
                    translation: 'citizenship',
                    usage: 'Preciso de obter a cidadania portuguesa.',
                    englishUsage: 'I need to obtain Portuguese citizenship.',
                    audio: 'assets/audio/eu-falo.mp3',
                    category: 'citizenship'
                },
                {
                    word: 'passaporte',
                    translation: 'passport',
                    usage: 'O meu passaporte está válido por mais cinco anos.',
                    englishUsage: 'My passport is valid for five more years.',
                    audio: 'assets/audio/tu-falas.mp3',
                    category: 'citizenship'
                },
                {
                    word: 'residência',
                    translation: 'residence',
                    usage: 'Tenho autorização de residência em Portugal.',
                    englishUsage: 'I have residence authorization in Portugal.',
                    audio: 'assets/audio/ele-fala.mp3',
                    category: 'citizenship'
                }
            ];
        }
        
        // Update total cards count
        if (this.totalCardsElement) {
            this.totalCardsElement.textContent = this.cards.length;
        }
    }
    
    renderCard() {
        if (this.cards.length === 0) {
            console.error('No cards available');
            if (this.flashcardContainer) {
                this.flashcardContainer.innerHTML = '<p>No cards available for this category and level.</p>';
            }
            return;
        }
        
        const card = this.cards[this.currentIndex];
        console.log('Rendering card:', card);
        
        // Update card content
        if (this.wordElement) {
            this.wordElement.textContent = card.word || card.portuguese || '';
        }
        
        if (this.phoneticElement) {
            // Simple phonetic representation (could be improved with actual phonetic data)
            if (card.phonetic) {
                this.phoneticElement.textContent = card.phonetic;
            } else {
                const word = card.word || card.portuguese || '';
                this.phoneticElement.textContent = `[${word.split('').join('-')}]`;
            }
        }
        
        if (this.translationElement) {
            this.translationElement.textContent = card.translation || card.english || '';
        }
        
        if (this.usageElement) {
            this.usageElement.textContent = card.usage || '';
        }
        
        if (this.englishUsageElement) {
            this.englishUsageElement.textContent = card.englishUsage || '';
        }
        
        // Add audio button if card has audio
        if (card.audio) {
            const audioContainer = document.querySelector('.flashcard-front');
            if (audioContainer && !audioContainer.querySelector('.audio-btn')) {
                audioContainer.appendChild(this.audioButton);
            }
            
            this.audioButton.onclick = () => {
                this.playAudio(card.audio);
            };
        }
        
        // Update current card number
        if (this.currentCardElement) {
            this.currentCardElement.textContent = this.currentIndex + 1;
        }
        
        // Reset flip state
        this.isFlipped = false;
        if (this.flashcardElement) {
            this.flashcardElement.classList.remove('flipped');
        }
        
        // Update progress if progress tracker exists
        if (window.progressTracker) {
            window.progressTracker.updateFlashcardProgress(this.category, this.currentIndex, this.cards.length);
        }
    }
    
    playAudio(audioSrc) {
        console.log('Playing audio:', audioSrc);
        const audio = new Audio(audioSrc);
        audio.play().catch(error => {
            console.error('Error playing audio:', error);
            alert('Could not play audio. Make sure audio files are available.');
        });
    }
    
    flipCard() {
        console.log('Flipping card');
        this.isFlipped = !this.isFlipped;
        if (this.flashcardElement) {
            if (this.isFlipped) {
                this.flashcardElement.classList.add('flipped');
            } else {
                this.flashcardElement.classList.remove('flipped');
            }
        }
    }
    
    nextCard() {
        console.log('Next card');
        if (this.currentIndex < this.cards.length - 1) {
            this.currentIndex++;
        } else {
            this.currentIndex = 0; // Loop back to the first card
        }
        this.renderCard();
    }
    
    prevCard() {
        console.log('Previous card');
        if (this.currentIndex > 0) {
            this.currentIndex--;
        } else {
            this.currentIndex = this.cards.length - 1; // Loop to the last card
        }
        this.renderCard();
    }
    
    setLevel(level) {
        console.log('Setting level to:', level);
        this.level = level;
        this.currentIndex = 0;
        this.loadCards();
        this.renderCard();
    }
    
    setCategory(category) {
        console.log('Setting category to:', category);
        this.category = category;
        this.currentIndex = 0;
        this.loadCards();
        this.renderCard();
    }
    
    attachEventListeners() {
        console.log('Attaching flashcard event listeners');
        
        // Flip card
        if (this.flipButton) {
            console.log('Attaching flip button listener');
            // Remove any existing listeners
            this.flipButton.removeEventListener('click', this.flipCard.bind(this));
            // Add new listener
            this.flipButton.addEventListener('click', () => {
                console.log('Flip button clicked');
                this.flipCard();
            });
        } else {
            console.warn('Flip button not found');
        }
        
        // Next card
        if (this.nextButton) {
            console.log('Attaching next button listener');
            // Remove any existing listeners
            this.nextButton.removeEventListener('click', this.nextCard.bind(this));
            // Add new listener
            this.nextButton.addEventListener('click', () => {
                console.log('Next button clicked');
                this.nextCard();
            });
        } else {
            console.warn('Next button not found');
        }
        
        // Previous card
        if (this.prevButton) {
            console.log('Attaching previous button listener');
            // Remove any existing listeners
            this.prevButton.removeEventListener('click', this.prevCard.bind(this));
            // Add new listener
            this.prevButton.addEventListener('click', () => {
                console.log('Previous button clicked');
                this.prevCard();
            });
        } else {
            console.warn('Previous button not found');
        }
        
        // Level selection
        if (this.levelButtons && this.levelButtons.length > 0) {
            console.log('Attaching level button listeners');
            this.levelButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const level = btn.getAttribute('data-level');
                    if (level) {
                        this.setLevel(level);
                        
                        // Update active button
                        this.levelButtons.forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                    }
                });
            });
        } else {
            console.warn('Level buttons not found');
        }
        
        // Category selection
        if (this.categoryButtons && this.categoryButtons.length > 0) {
            console.log('Attaching category button listeners');
            this.categoryButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const category = btn.getAttribute('data-category');
                    if (category) {
                        this.setCategory(category);
                        
                        // Update active button
                        this.categoryButtons.forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                    }
                });
            });
        } else {
            console.warn('Category buttons not found');
        }
        
        // Keyboard navigation
        document.removeEventListener('keydown', this.handleKeyDown);
        this.handleKeyDown = (e) => {
            if (document.querySelector('#flashcards.active')) {
                if (e.key === 'ArrowRight') {
                    this.nextCard();
                } else if (e.key === 'ArrowLeft') {
                    this.prevCard();
                } else if (e.key === ' ' || e.key === 'Spacebar') {
                    this.flipCard();
                    e.preventDefault(); // Prevent scrolling with spacebar
                }
            }
        };
        document.addEventListener('keydown', this.handleKeyDown);
        
        console.log('All flashcard event listeners attached');
    }
    
    // Helper method to shuffle array
    shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
}
