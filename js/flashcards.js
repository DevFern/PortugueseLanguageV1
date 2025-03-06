// flashcards.js - Updated implementation
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
    this.translationElement = document.querySelector('.translation');
    this.usageElement = document.querySelector('.usage');
    this.englishUsageElement = document.querySelector('.english-usage');
    this.currentCardElement = document.getElementById('current-card');
    this.totalCardsElement = document.getElementById('total-cards');
    
    // Buttons
    this.prevButton = document.getElementById('prev-card');
    this.nextButton = document.getElementById('next-card');
    this.flipButton = document.getElementById('flip-card');
    
    // Category and level selectors
    this.categoryButtons = document.querySelectorAll('.category-btn');
    this.levelButtons = document.querySelectorAll('.level-btn');
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
    if (typeof vocabularyData === 'undefined') {
      console.warn('Vocabulary data not found, using fallback data');
      
      // Use fallback data
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
        }
      ];
      
      return;
    }
    
    // Get cards based on category and level
    const levelMap = {
      'beginner': 'basic',
      'intermediate': 'intermediate',
      'advanced': 'advanced'
    };
    
    const dataLevel = levelMap[this.level] || 'basic';
    
    // Load cards from all categories if category is 'all'
    if (this.category === 'all') {
      Object.keys(vocabularyData).forEach(category => {
        if (vocabularyData[category] && vocabularyData[category][dataLevel]) {
          this.cards = [...this.cards, ...vocabularyData[category][dataLevel]];
        }
      });
    } else if (vocabularyData[this.category] && vocabularyData[this.category][dataLevel]) {
      // Load cards from specific category
      this.cards = vocabularyData[this.category][dataLevel];
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
        }
      ];
    }
    
    console.log(`Loaded ${this.cards.length} cards for category: ${this.category}, level: ${this.level}`);
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
    
    // Reset card flip
    if (this.flashcardElement) {
      this.flashcardElement.classList.remove('flipped');
    }
    
    // Update card counter
    if (this.currentCardElement) {
      this.currentCardElement.textContent = this.currentIndex + 1;
    }
    
    if (this.totalCardsElement) {
      this.totalCardsElement.textContent = this.cards.length;
    }
    
    // Update audio button if available
    const audioBtn = document.querySelector('.audio-btn');
    if (audioBtn) {
      audioBtn.onclick = () => {
        if (card.audio) {
          const audio = new Audio(`assets/${card.audio}`);
          audio.play().catch(error => {
            console.error('Error playing audio:', error);
            alert('Audio file not found. Please try another card.');
          });
        } else {
          alert('No audio available for this card.');
        }
      };
    }
  }
  
  attachEventListeners() {
    // Category selection
    if (this.categoryButtons) {
      this.categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          this.categoryButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.category = btn.getAttribute('data-category');
          this.currentIndex = 0;
          this.loadCards();
          this.renderCard();
        });
      });
    }
    
    // Level selection
    if (this.levelButtons) {
      this.levelButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          this.levelButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.level = btn.getAttribute('data-level');
          localStorage.setItem('userLevel', this.level);
          this.currentIndex = 0;
          this.loadCards();
          this.renderCard();
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

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  if (document.querySelector('#flashcards')) {
    const flashcardManager = new FlashcardManager();
    flashcardManager.init();
    
    // Make it globally accessible
    window.flashcardManager = flashcardManager;
  }
});
