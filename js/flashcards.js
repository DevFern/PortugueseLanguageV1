class FlashcardManager {
  constructor() {
    this.cards = [];
    this.allCards = []; // Store all cards for filtering
    this.currentIndex = 0;
    this.category = 'all';
    this.level = localStorage.getItem('userLevel') || 'beginner';
    this.favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    this.showingFavorites = false;
    
    // DOM elements
    this.flashcardElement = document.querySelector('.flashcard');
    this.flipButton = document.querySelector('.flip-btn');
    this.nextButton = document.getElementById('next-card');
    this.prevButton = document.getElementById('prev-card');
    this.categoryButtons = document.querySelectorAll('.category-btn');
    this.levelButtons = document.querySelectorAll('#flashcards .level-btn');
    this.progressElement = document.querySelector('.flashcard-progress');
    this.searchInput = null;
    this.favoritesBtn = null;
  }
  
  init() {
    console.log('Initializing FlashcardManager');
    
    // Add search and favorites UI
    this.addSearchAndFavoritesUI();
    
    // Load cards based on initial category and level
    this.loadCards();
    
    // Attach event listeners
    this.attachEventListeners();
  }
  
  addSearchAndFavoritesUI() {
    // Create search container
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
      <input type="text" id="flashcard-search" placeholder="Search words...">
      <button id="show-favorites" class="toggle-btn">
        <i class="far fa-star"></i> Favorites
      </button>
    `;
    
    // Add to DOM before flashcard container
    const container = document.querySelector('.flashcard-container');
    if (container && container.parentNode) {
      container.parentNode.insertBefore(searchContainer, container);
    }
    
    // Store references
    this.searchInput = document.querySelector('#flashcard-search');
    this.favoritesBtn = document.querySelector('#show-favorites');
  }
  
  attachEventListeners() {
    // Flip card
    if (this.flipButton) {
      this.flipButton.addEventListener('click', () => {
        this.flipCard();
      });
    }
    
    // Click on card to flip
    if (this.flashcardElement) {
      this.flashcardElement.addEventListener('click', (e) => {
        // Don't flip if clicking on favorite button
        if (e.target.closest('.favorite-btn')) return;
        this.flipCard();
      });
    }
    
    // Next card
    if (this.nextButton) {
      this.nextButton.addEventListener('click', () => {
        this.nextCard();
      });
    }
    
    // Previous card
    if (this.prevButton) {
      this.prevButton.addEventListener('click', () => {
        this.prevCard();
      });
    }
    
    // Category selection
    if (this.categoryButtons) {
      this.categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          this.categoryButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          
          const category = btn.getAttribute('data-category');
          if (category) {
            this.category = category;
            this.loadCards();
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
            this.loadCards();
          }
        });
      });
    }
    
    // Search functionality
    if (this.searchInput) {
      this.searchInput.addEventListener('input', () => {
        this.filterCards(this.searchInput.value);
      });
    }
    
    // Favorites toggle
    if (this.favoritesBtn) {
      this.favoritesBtn.addEventListener('click', () => {
        this.toggleFavorites();
      });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (document.querySelector('#flashcards.active')) {
        if (e.key === 'ArrowRight') this.nextCard();
        if (e.key === 'ArrowLeft') this.prevCard();
        if (e.key === ' ' || e.key === 'Enter') this.flipCard();
      }
    });
  }
  
  loadCards() {
    this.currentIndex = 0;
    this.cards = [];
    
    // Try to use vocabulary data if available
    if (typeof vocabularyData !== 'undefined') {
      try {
        if (this.category === 'all') {
          // Load cards from all categories
          Object.keys(vocabularyData).forEach(category => {
            this.addCardsFromCategory(category);
          });
        } else {
          // Load cards from specific category
          this.addCardsFromCategory(this.category);
        }
      } catch (e) {
        console.error('Error loading vocabulary data:', e);
      }
    }
    
    // If no cards loaded, use fallback
    if (this.cards.length === 0) {
      this.cards = [
        {
          word: 'cidadania',
          translation: 'citizenship',
          example: 'Eu quero obter a cidadania portuguesa.',
          audio: 'audio/cidadania.mp3'
        },
        {
          word: 'passaporte',
          translation: 'passport',
          example: 'Preciso renovar o meu passaporte.',
          audio: 'audio/passaporte.mp3'
        },
        {
          word: 'residência',
          translation: 'residence',
          example: 'A minha residência é em Lisboa.',
          audio: 'audio/residencia.mp3'
        }
      ];
    }
    
    // Store all cards for filtering
    this.allCards = [...this.cards];
    
    // Render first card
    this.renderCard();
  }
  
  addCardsFromCategory(category) {
    if (vocabularyData[category]) {
      let levelData;
      
      if (this.level === 'beginner' && vocabularyData[category].basic) {
        levelData = vocabularyData[category].basic;
      } else if (this.level === 'intermediate' && vocabularyData[category].intermediate) {
        levelData = vocabularyData[category].intermediate;
      } else if (this.level === 'advanced' && vocabularyData[category].advanced) {
        levelData = vocabularyData[category].advanced;
      }
      
      if (levelData && Array.isArray(levelData)) {
        this.cards = [...this.cards, ...levelData];
      }
    }
  }
  
  renderCard() {
    if (!this.flashcardElement || this.cards.length === 0) {
      return;
    }
    
    // Reset card flip state
    this.flashcardElement.classList.remove('flipped');
    
    const card = this.cards[this.currentIndex];
    
    // Check if this card is a favorite
    const isFavorite = this.favorites.includes(card.word);
    const favoriteClass = isFavorite ? 'fas fa-star' : 'far fa-star';
    
    // Update card content
    this.flashcardElement.innerHTML = `
      <div class="flashcard-inner">
        <div class="flashcard-front">
          <button class="favorite-btn">
            <i class="${favoriteClass}"></i>
          </button>
          <h3>${card.word}</h3>
          <button class="play-audio-btn">
            <i class="fas fa-volume-up"></i>
          </button>
        </div>
        <div class="flashcard-back">
          <h3>${card.translation}</h3>
          <p class="example">${card.example || ''}</p>
        </div>
      </div>
    `;
    
    // Update progress indicator
    if (this.progressElement) {
      this.progressElement.textContent = `${this.currentIndex + 1} / ${this.cards.length}`;
    }
    
    // Add event listener to favorite button
    const favoriteBtn = this.flashcardElement.querySelector('.favorite-btn');
    if (favoriteBtn) {
      favoriteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleFavorite(this.currentIndex);
      });
    }
    
    // Add event listener to audio button
    const audioBtn = this.flashcardElement.querySelector('.play-audio-btn');
    if (audioBtn) {
      audioBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.playAudio(card.audio);
      });
    }
    
    // Track progress if progress tracker exists
    if (window.progressTracker) {
      window.progressTracker.updateFlashcardProgress(this.category, this.currentIndex, this.cards.length);
    }
  }
  
  flipCard() {
    if (this.flashcardElement) {
      this.flashcardElement.classList.toggle('flipped');
      
      // Track progress when card is flipped
      if (window.progressTracker && this.flashcardElement.classList.contains('flipped')) {
        window.progressTracker.updateFlashcardProgress(this.category, this.currentIndex, this.cards.length);
      }
    }
  }
  
  nextCard() {
    if (this.currentIndex < this.cards.length - 1) {
      this.currentIndex++;
      this.renderCard();
    } else {
      // Loop back to first card
      this.currentIndex = 0;
      this.renderCard();
    }
  }
  
  prevCard() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.renderCard();
    } else {
      // Loop to last card
      this.currentIndex = this.cards.length - 1;
      this.renderCard();
    }
  }
  
  playAudio(audioSrc) {
    if (!audioSrc) {
      alert('Audio will be available in a future update.');
      return;
    }
    
    // Create audio element
    const audio = new Audio(audioSrc);
    
    // Add error handler
    audio.onerror = () => {
      alert('Audio will be available in a future update.');
    };
    
    // Try to play
    audio.play().catch(error => {
      console.error('Error playing audio:', error);
      alert('Audio will be available in a future update.');
    });
  }
  
  filterCards(query) {
    if (!query) {
      // Reset to original cards
      this.cards = [...this.allCards];
      this.currentIndex = 0;
      this.renderCard();
      return;
    }
    
    query = query.toLowerCase();
    
    const filteredCards = this.allCards.filter(card => 
      card.word.toLowerCase().includes(query) || 
      card.translation.toLowerCase().includes(query) ||
      (card.example && card.example.toLowerCase().includes(query))
    );
    
    this.cards = filteredCards;
    this.currentIndex = 0;
    
    if (this.cards.length > 0) {
      this.renderCard();
    } else {
      // No results
      this.flashcardElement.innerHTML = `
        <div class="flashcard-inner">
          <div class="flashcard-front">
            <h3>No results found</h3>
            <p>Try a different search term</p>
          </div>
        </div>
      `;
      
      if (this.progressElement) {
        this.progressElement.textContent = `0 / 0`;
      }
    }
  }
  
  toggleFavorite(index) {
    const card = this.cards[index];
    const cardId = card.word;
    const favoriteBtn = this.flashcardElement.querySelector('.favorite-btn i');
    
    if (this.favorites.includes(cardId)) {
      // Remove from favorites
      this.favorites = this.favorites.filter(id => id !== cardId);
      if (favoriteBtn) favoriteBtn.className = 'far fa-star';
    } else {
      // Add to favorites
      this.favorites.push(cardId);
      if (favoriteBtn) favoriteBtn.className = 'fas fa-star';
    }
    
    // Save to localStorage
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
    
    // If showing favorites, refresh the list
    if (this.showingFavorites) {
      this.toggleFavorites();
    }
  }
  
  toggleFavorites() {
    if (this.showingFavorites) {
      // Switch back to all cards
      this.cards = [...this.allCards];
      this.currentIndex = 0;
      this.renderCard();
      
      if (this.favoritesBtn) {
        this.favoritesBtn.innerHTML = '<i class="far fa-star"></i> Favorites';
      }
      
      this.showingFavorites = false;
    } else {
      // Show only favorites
      const favoriteCards = this.allCards.filter(card => 
        this.favorites.includes(card.word)
      );
      
      if (favoriteCards.length > 0) {
        this.cards = favoriteCards;
        this.currentIndex = 0;
        this.renderCard();
      } else {
        // No favorites
        this.flashcardElement.innerHTML = `
          <div class="flashcard-inner">
            <div class="flashcard-front">
              <h3>No favorites yet</h3>
              <p>Click the star icon on cards to add them to favorites</p>
            </div>
          </div>
        `;
        
        if (this.progressElement) {
          this.progressElement.textContent = `0 / 0`;
        }
      }
      
      if (this.favoritesBtn) {
        this.favoritesBtn.innerHTML = '<i class="fas fa-star"></i> Show All';
      }
      
      this.showingFavorites = true;
    }
  }
}
