class FlashcardManager {
    constructor() {
        this.cards = [];
        this.currentIndex = 0;
        this.level = 'beginner';
        this.category = 'citizenship';
        this.isFlipped = false;
        
        // DOM elements
        this.flashcardElement = document.querySelector('.flashcard');
        this.wordElement = document.querySelector('.word');
        this.phoneticElement = document.querySelector('.phonetic');
        this.translationElement = document.querySelector('.translation');
        this.usageElement = document.querySelector('.usage');
        this.englishUsageElement = document.querySelector('.english-usage');
        this.currentCardElement = document.getElementById('current-card');
        this.totalCardsElement = document.getElementById('total-cards');
        
        // Buttons
        this.prevButton = document.getElementById('prev-card');
        this.nextButton = document.getElementById('next-card');
        this.flipButton = document.getElementById('flip-card');
        
        // Level and category selectors
        this.levelButtons = document.querySelectorAll('#flashcards .level-btn');
        this.categoryButtons = document.querySelectorAll('.category-btn');
    }
    
    init() {
        this.loadCards();
        this.renderCard();
        this.attachEventListeners();
    }
    
    loadCards() {
        // Reset cards array
        this.cards = [];
        
        // Check if vocabulary data exists
        if (!vocabularyData) {
            console.error('Vocabulary data not found');
            return;
        }
        
        // Get cards based on category and level
        if (this.category === 'citizenship' && vocabularyData.citizenship) {
            if (this.level === 'beginner' && vocabularyData.citizenship.basic) {
                this.cards = vocabularyData.citizenship.basic;
            } else if (this.level === 'advanced' && vocabularyData.citizenship.advanced) {
                this.cards = vocabularyData.citizenship.advanced;
            }
        } else if (this.category === 'daily_life' && vocabularyData.daily_life) {
            this.cards = vocabularyData.daily_life;
        } else if (this.category === 'transportation' && vocabularyData.transportation) {
            this.cards = vocabularyData.transportation;
        } else if (this.category === 'food' && vocabularyData.food) {
            this.cards = vocabularyData.food;
        }
        
        // If no cards found, use fallback data
        if (this.cards.length === 0) {
            this.cards = [
                {
                    word: 'cidadania',
                    translation: 'citizenship',
                    usage: 'Preciso de obter a cidadania portuguesa.',
                    audio: 'cidadania.mp3',
                    category: 'citizenship'
                },
                {
                    word: 'passaporte',
                    translation: 'passport',
                    usage: 'O meu passaporte está válido por mais cinco anos.',
                    audio: 'passaporte.mp3',
                    category: 'citizenship'
                },
                {
                    word: 'residência',
                    translation: 'residence',
                    usage: 'Tenho autorização de residência em Portugal.',
                    audio: 'residencia.mp3',
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
            return;
        }
        
        const card = this.cards[this.currentIndex];
        
        // Update card content
        if (this.wordElement) {
            this.wordElement.textContent = card.word || card.portuguese || '';
        }
        
        if (this.phoneticElement) {
            // Simple phonetic representation (could be improved with actual phonetic data)
            this.phoneticElement.textContent = `[${(card.word || card.portuguese || '').split('').join('-')}]`;
        }
        
        if (this.translationElement) {
            this.translationElement.textContent = card.translation || '';
        }
        
        if (this.usageElement) {
            this.usageElement.textContent = card.usage || '';
        }
        
        if (this.englishUsageElement) {
            this.englishUsageElement.textContent = card.englishUsage || '';
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
    
    flipCard() {
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
        if (this.currentIndex < this.cards.length - 1) {
            this.currentIndex++;
        } else {
            this.currentIndex = 0; // Loop back to the first card
        }
        this.renderCard();
    }
    
    prevCard() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
        } else {
            this.currentIndex = this.cards.length - 1; // Loop to the last card
        }
        this.renderCard();
    }
    
    setLevel(level) {
        this.level = level;
        this.currentIndex = 0;
        this.loadCards();
        this.renderCard();
    }
    
    setCategory(category) {
        this.category = category;
        this.currentIndex = 0;
        this.loadCards();
        this.renderCard();
    }
    
    attachEventListeners() {
        // Flip card
        if (this.flipButton) {
            this.flipButton.addEventListener('click', () => this.flipCard());
        }
        
        // Next card
        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => this.nextCard());
        }
        
        // Previous card
        if (this.prevButton) {
            this.prevButton.addEventListener('click', () => this.prevCard());
        }
        
        // Level selection
        this.levelButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const level = btn.getAttribute('data-level');
                this.setLevel(level);
                
                // Update active button
                this.levelButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
        
        // Category selection
        this.categoryButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.getAttribute('data-category');
                this.setCategory(category);
                
                // Update active button
                this.categoryButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
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
        });
    }
}
