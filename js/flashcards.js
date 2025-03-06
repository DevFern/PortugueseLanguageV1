class FlashcardManager {
  constructor() {
    this.cards = [];
    this.currentIndex = 0;
    this.level = localStorage.getItem('userLevel') || 'beginner';
    this.category = 'citizenship';
    
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
    
    // Buttons
    this.prevButton = document.getElementById('prev-card');
    this.nextButton = document.getElementById('next-card');
    this.flipButton = document.getElementById('flip-card');
    this.audioButton = document.querySelector('.audio-btn');
    
    // Category and level selectors
    this.categoryButtons = document.querySelectorAll('.category-btn');
    this.levelButtons = document.querySelectorAll('#flashcards .level-btn');
  }
  
  init() {
    console.log('Initializing FlashcardManager');
    
    if (!this.flashcardElement) {
      console.error('Flashcard element not found');
      return;
    }
    
    this.loadCards();
    this.renderCard();
    this.attachEventListeners();
  }
  
  loadCards() {
    // Reset cards array
    this.cards = [];
    
    // Check if vocabulary data exists
    if (typeof vocabularyData !== 'undefined') {
      try {
        // Get level data
        let levelData;
        if (this.level === 'beginner') {
          levelData = 'basic';
        } else if (this.level === 'intermediate') {
          levelData = 'intermediate';
        } else if (this.level === 'advanced') {
          levelData = 'advanced';
        } else {
          levelData = 'basic';
        }
        
        // If category is 'all', combine all categories
        if (this.category === 'all') {
          Object.keys(vocabularyData).forEach(category => {
            if (vocabularyData[category] && vocabularyData[category][levelData]) {
              this.cards = [...this.cards, ...vocabularyData[category][levelData]];
            }
          });
        } else if (vocabularyData[this.category] && vocabularyData[this.category][levelData]) {
          this.cards = vocabularyData[this.category][levelData];
        }
      } catch (e) {
        console.error('Error loading vocabulary data:', e);
      }
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
          audio: 'audio/cidadania.mp3'
        },
        {
          word: 'passaporte',
          translation: 'passport',
          usage: 'O meu passaporte está válido por mais cinco anos.',
          englishUsage: 'My passport is valid for five more years.',
          audio: 'audio/passaporte.mp3'
        },
        {
          word: 'residência',
          translation: 'residence',
          usage: 'Tenho autorização de residência em Portugal.',
          englishUsage: 'I have residence authorization in Portugal.',
          audio: 'audio/residencia.mp3'
        },
        {
          word: 'obrigado',
          translation: 'thank you',
          usage: 'Obrigado pela sua ajuda.',
          englishUsage: 'Thank you for your help.',
          audio: 'audio/obrigado.mp3'
        },
        {
          word: 'por favor',
          translation: 'please',
          usage: 'Por favor, pode repetir?',
          englishUsage: 'Please, can you repeat?',
          audio: 'audio/por-favor.mp3'
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
    
    // Update front of card
    if (this.wordElement) {
      this.wordElement.textContent = card.word || card.portuguese || '';
    }
    
    if (this.phoneticElement) {
      this.phoneticElement.textContent = card.phonetic ? `[${card.phonetic}]` : '';
    }
    
    // Update back of card
    if (this.translationElement) {
      this.translationElement.textContent = card.translation || '';
    }
    
    if (this.usageElement) {
      this.usageElement.textContent = card.usage || '';
    }
    
    if (this.englishUsageElement) {
      this.englishUsageElement.textContent = card.englishUsage || '';
    }
    
    // Update card counter
    if (this.currentCardElement) {
      this.currentCardElement.textContent = this.currentIndex + 1;
    }
    
    // Reset card flip
    if (this.flashcardElement) {
      this.flashcardElement.classList.remove('flipped');
    }
    
    // Update navigation buttons
    if (this.prevButton) {
      this.prevButton.disabled = this.currentIndex === 0;
    }
    
    if (this.nextButton) {
      this.nextButton.disabled = this.currentIndex === this.cards.length - 1;
    }
  }
  
  attachEventListeners() {
    // Category selection
    if (this.categoryButtons) {
      this.categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          this.categoryButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          
          const category = btn.getAttribute('data-category');
          if (category) {
            this.category = category;
            this.currentIndex = 0;
            this.loadCards();
            this.renderCard();
          }
        });
      });
    }
    
    // Level selection
    if (this.levelButtons) {
      this.levelButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          this.levelButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          
          const level = btn.getAttribute('data-level');
          if (level) {
            this.level = level;
            localStorage.setItem('userLevel', level);
            this.currentIndex = 0;
            this.loadCards();
            this.renderCard();
          }
        });
      });
    }
    
    // Flip card
    if (this.flipButton) {
      this.flipButton.addEventListener('click', () => {
        if (this.flashcardElement) {
          this.flashcardElement.classList.toggle('flipped');
        }
      });
    }
    
    // Audio button
    if (this.audioButton) {
      this.audioButton.addEventListener('click', () => {
        alert('Audio files will be available in a future update.');
      });
    }
    
    // Navigate cards
    if (this.prevButton) {
      this.prevButton.addEventListener('click', () => {
        if (this.currentIndex > 0) {
          this.currentIndex--;
          this.renderCard();
        }
      });
    }
    
    if (this.nextButton) {
      this.nextButton.addEventListener('click', () => {
        if (this.currentIndex < this.cards.length - 1) {
          this.currentIndex++;
          this.renderCard();
          
          // Track progress
          if (window.progressTracker) {
            window.progressTracker.updateFlashcardProgress(this.category, this.currentIndex, this.cards.length);
          }
        }
      });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      // Only handle keys if flashcards section is active
      if (document.querySelector('#flashcards.active')) {
        if (e.key === 'ArrowRight') {
          if (this.currentIndex < this.cards.length - 1) {
            this.currentIndex++;
            this.renderCard();
          }
        } else if (e.key === 'ArrowLeft') {
          if (this.currentIndex > 0) {
            this.currentIndex--;
            this.renderCard();
          }
        } else if (e.key === ' ' || e.key === 'Spacebar') {
          // Flip card on spacebar
          if (this.flashcardElement) {
            this.flashcardElement.classList.toggle('flipped');
          }
          e.preventDefault(); // Prevent scrolling with spacebar
        }
      }
    });
  }
  
  setLevel(level) {
    this.level = level;
    localStorage.setItem('userLevel', level);
    this.currentIndex = 0;
    this.loadCards();
    this.renderCard();
  }
}
