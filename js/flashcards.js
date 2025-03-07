class FlashcardManager {
  constructor() {
    this.flashcards = [];
    this.currentIndex = 0;
    this.currentCategory = 'citizenship';
    this.currentLevel = localStorage.getItem('userLevel') || 'beginner';
    this.isFlipped = false;
    this.searchTerm = '';
    this.showingFavorites = false;
    this.favorites = [];
    
    // DOM elements
    this.flashcardContainer = document.querySelector('.flashcard-container');
    this.flashcard = document.querySelector('.flashcard');
    this.prevButton = document.getElementById('prev-card');
    this.nextButton = document.getElementById('next-card');
    this.flipButton = document.getElementById('flip-card');
    this.currentCardElement = document.getElementById('current-card');
    this.totalCardsElement = document.getElementById('total-cards');
    this.categoryButtons = document.querySelectorAll('.category-btn');
    this.levelButtons = document.querySelectorAll('#flashcards .level-btn');
  }
  
  init() {
    console.log('Initializing FlashcardManager');
    this.loadFlashcards();
    this.attachEventListeners();
    this.initSearch();
    this.initFavorites();
  }
  
  loadFlashcards() {
    // Reset current index
    this.currentIndex = 0;
    this.isFlipped = false;
    
    // Try to use vocabulary data if available
    if (typeof vocabularyData !== 'undefined') {
      try {
        // Get words based on category and level
        let words = [];
        
        if (this.currentCategory === 'all') {
          // Get words from all categories
          Object.keys(vocabularyData).forEach(category => {
            if (vocabularyData[category]) {
              let levelData;
              
              if (this.currentLevel === 'beginner' && vocabularyData[category].basic) {
                levelData = vocabularyData[category].basic;
              } else if (this.currentLevel === 'intermediate' && vocabularyData[category].intermediate) {
                levelData = vocabularyData[category].intermediate;
              } else if (this.currentLevel === 'advanced' && vocabularyData[category].advanced) {
                levelData = vocabularyData[category].advanced;
              }
              
              if (levelData && Array.isArray(levelData)) {
                words = [...words, ...levelData];
              }
            }
          });
        } else if (vocabularyData[this.currentCategory]) {
          // Get words from specific category
          let levelData;
          
          if (this.currentLevel === 'beginner' && vocabularyData[this.currentCategory].basic) {
            levelData = vocabularyData[this.currentCategory].basic;
          } else if (this.currentLevel === 'intermediate' && vocabularyData[this.currentCategory].intermediate) {
            levelData = vocabularyData[this.currentCategory].intermediate;
          } else if (this.currentLevel === 'advanced' && vocabularyData[this.currentCategory].advanced) {
            levelData = vocabularyData[this.currentCategory].advanced;
          }
          
          if (levelData && Array.isArray(levelData)) {
            words = levelData;
          }
        }
        
        // Apply filters (search and favorites)
        words = this.filterWords(words);
        
        if (words.length > 0) {
          this.flashcards = words;
          this.renderFlashcard();
          return;
        }
      } catch (e) {
        console.error('Error loading vocabulary data:', e);
      }
    }
    
    // Fallback if no data available
    this.flashcards = [
      {
        word: 'cidadania',
        translation: 'citizenship',
        phonetic: '[si-da-da-ni-a]',
        usage: 'Preciso de obter a cidadania portuguesa.',
        english_usage: 'I need to obtain Portuguese citizenship.'
      },
      {
        word: 'passaporte',
        translation: 'passport',
        phonetic: '[pa-sa-por-te]',
        usage: 'O meu passaporte é válido por dez anos.',
        english_usage: 'My passport is valid for ten years.'
      },
      {
        word: 'residência',
        translation: 'residence',
        phonetic: '[re-zi-den-si-a]',
        usage: 'Tenho autorização de residência permanente.',
        english_usage: 'I have permanent residence authorization.'
      }
    ];
    
    this.renderFlashcard();
  }
  
  filterWords(words) {
    let filteredWords = [...words];
    
    // Apply search filter if there's a search term
    if (this.searchTerm) {
      filteredWords = filteredWords.filter(word => {
        const portuguese = (word.word || word.portuguese || '').toLowerCase();
        const english = (word.translation || '').toLowerCase();
        return portuguese.includes(this.searchTerm) || english.includes(this.searchTerm);
      });
    }
    
    // Apply favorites filter if showing favorites
    if (this.showingFavorites) {
      const favoriteWords = this.favorites.map(fav => fav.word);
      filteredWords = filteredWords.filter(word => 
        favoriteWords.includes(word.word) || favoriteWords.includes(word.portuguese)
      );
    }
    
    return filteredWords;
  }
  
  renderFlashcard() {
    if (this.flashcards.length === 0) {
      // No flashcards available
      if (this.flashcard) {
        this.flashcard.innerHTML = `
          <div class="flashcard-inner">
            <div class="flashcard-front">
              <h3 class="no-results">No flashcards found</h3>
              <p>Try changing your filters or search term</p>
            </div>
          </div>
        `;
      }
      
      // Update counter
      if (this.currentCardElement) this.currentCardElement.textContent = '0';
      if (this.totalCardsElement) this.totalCardsElement.textContent = '0';
      
      // Disable navigation buttons
      if (this.prevButton) this.prevButton.disabled = true;
      if (this.nextButton) this.nextButton.disabled = true;
      if (this.flipButton) this.flipButton.disabled = true;
      
      return;
    }
    
    // Get current word
    this.currentWord = this.flashcards[this.currentIndex];
    
    // Update flashcard content
    if (this.flashcard) {
      // Create favorite button
      const favoriteBtn = document.createElement('button');
      favoriteBtn.className = 'favorite-btn';
      favoriteBtn.innerHTML = '<i class="far fa-star"></i>';
      
      // Create flashcard inner structure
      const flashcardInner = document.createElement('div');
      flashcardInner.className = 'flashcard-inner';
      
      if (this.isFlipped) {
        flashcardInner.classList.add('flipped');
      }
      
      // Front side
      const frontSide = document.createElement('div');
      frontSide.className = 'flashcard-front';
      frontSide.innerHTML = `
        <h3 class="word">${this.currentWord.word || this.currentWord.portuguese || ''}</h3>
        <p class="phonetic">${this.currentWord.phonetic || ''}</p>
      `;
      
      // Back side
      const backSide = document.createElement('div');
      backSide.className = 'flashcard-back';
      backSide.innerHTML = `
        <h3 class="translation">${this.currentWord.translation || ''}</h3>
        <p class="usage">${this.currentWord.usage || ''}</p>
        <p class="english-usage">${this.currentWord.english_usage || ''}</p>
        <button class="play-audio-btn"><i class="fas fa-volume-up"></i> Listen</button>
      `;
      
      // Assemble flashcard
      flashcardInner.appendChild(frontSide);
      flashcardInner.appendChild(backSide);
      
      // Clear and update flashcard
      this.flashcard.innerHTML = '';
      this.flashcard.appendChild(favoriteBtn);
      this.flashcard.appendChild(flashcardInner);
      
      // Add audio button functionality
      const audioButton = this.flashcard.querySelector('.play-audio-btn');
      if (audioButton) {
        audioButton.addEventListener('click', () => {
          this.playAudio(this.currentWord.word || this.currentWord.portuguese);
        });
      }
      
      // Update favorite button
      this.updateFavoriteButton();
    }
    
    // Update counter
    if (this.currentCardElement) this.currentCardElement.textContent = (this.currentIndex + 1).toString();
    if (this.totalCardsElement) this.totalCardsElement.textContent = this.flashcards.length.toString();
    
    // Update button states
    if (this.prevButton) this.prevButton.disabled = this.currentIndex === 0;
    if (this.nextButton) this.nextButton.disabled = this.currentIndex === this.flashcards.length - 1;
    
    // Track progress if progress tracker exists
    if (window.progressTracker) {
      window.progressTracker.updateFlashcardProgress(
        this.currentCategory,
        this.currentIndex + 1,
        this.flashcards.length
      );
    }
  }
  
  flipCard() {
    this.isFlipped = !this.isFlipped;
    
    const flashcardInner = this.flashcard.querySelector('.flashcard-inner');
    if (flashcardInner) {
      if (this.isFlipped) {
        flashcardInner.classList.add('flipped');
      } else {
        flashcardInner.classList.remove('flipped');
      }
    }
  }
  
  nextCard() {
    if (this.currentIndex < this.flashcards.length - 1) {
      this.currentIndex++;
      this.isFlipped = false;
      this.renderFlashcard();
    }
  }
  
  prevCard() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.isFlipped = false;
      this.renderFlashcard();
    }
  }
  
  playAudio(word) {
    // This is a placeholder for audio functionality
    // In a real implementation, you would load and play the audio file
    console.log(`Playing audio for: ${word}`);
    
    // For now, just show a message
    alert(`Audio for "${word}" will be available in a future update.`);
  }
  
  attachEventListeners() {
    // Flip button
    if (this.flipButton) {
      this.flipButton.addEventListener('click', () => {
        this.flipCard();
      });
    }
    
    // Next button
    if (this.nextButton) {
      this.nextButton.addEventListener('click', () => {
        this.nextCard();
      });
    }
    
    // Previous button
    if (this.prevButton) {
      this.prevButton.addEventListener('click', () => {
        this.prevCard();
      });
    }
    
    // Category buttons
    if (this.categoryButtons) {
      this.categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          this.categoryButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          
          const category = btn.getAttribute('data-category');
          if (category) {
            this.currentCategory = category;
            this.loadFlashcards();
          }
        });
      });
    }
    
    // Level buttons
    if (this.levelButtons) {
      this.levelButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          this.levelButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          
          const level = btn.getAttribute('data-level');
          if (level) {
            this.currentLevel = level;
            localStorage.setItem('userLevel', level);
            this.loadFlashcards();
          }
        });
      });
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (document.querySelector('#flashcards.active')) {
        if (e.key === 'ArrowLeft') {
          this.prevCard();
        } else if (e.key === 'ArrowRight') {
          this.nextCard();
        } else if (e.key === ' ' || e.key === 'Enter') {
          this.flipCard();
        }
      }
    });
    
    // Click on flashcard to flip
    if (this.flashcard) {
      this.flashcard.addEventListener('click', (e) => {
        // Don't flip if clicking on a button
        if (e.target.tagName !== 'BUTTON' && !e.target.closest('button')) {
          this.flipCard();
        }
      });
    }
  }
  
  initSearch() {
    const searchInput = document.getElementById('flashcard-search');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        this.searchTerm = searchInput.value.trim().toLowerCase();
        this.loadFlashcards();
      });
      
      // Clear search on Escape key
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          searchInput.value = '';
          this.searchTerm = '';
          this.loadFlashcards();
        }
      });
    }
  }
  
  initFavorites() {
    this.favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    // Favorites toggle button
    const favoritesToggle = document.getElementById('favorites-toggle');
    if (favoritesToggle) {
      favoritesToggle.addEventListener('click', () => {
        this.showingFavorites = !this.showingFavorites;
        
        // Update button appearance
        if (this.showingFavorites) {
          favoritesToggle.innerHTML = '<i class="fas fa-star"></i> All Words';
          favoritesToggle.classList.add('active');
        } else {
          favoritesToggle.innerHTML = '<i class="far fa-star"></i> Favorites';
          favoritesToggle.classList.remove('active');
        }
        
        // Reload cards with filter
        this.loadFlashcards();
      });
    }
  }
  
  updateFavoriteButton() {
    const favoriteBtn = this.flashcard.querySelector('.favorite-btn');
    if (!favoriteBtn || !this.currentWord) return;
    
    const wordKey = this.currentWord.word || this.currentWord.portuguese;
    const isFavorite = this.favorites.some(fav => fav.word === wordKey);
    
    if (isFavorite) {
      favoriteBtn.innerHTML = '<i class="fas fa-star"></i>';
      favoriteBtn.classList.add('active');
    } else {
      favoriteBtn.innerHTML = '<i class="far fa-star"></i>';
      favoriteBtn.classList.remove('active');
    }
    
    // Add click event
    favoriteBtn.onclick = (e) => {
      e.stopPropagation(); // Prevent card from flipping
      this.toggleFavorite();
    };
  }
  
  toggleFavorite() {
    if (!this.currentWord) return;
    
    const wordKey = this.currentWord.word || this.currentWord.portuguese;
    const isFavorite = this.favorites.some(fav => fav.word === wordKey);
    
    if (isFavorite) {
      // Remove from favorites
      this.favorites = this.favorites.filter(fav => fav.word !== wordKey);
    } else {
      // Add to favorites
      this.favorites.push({
        word: wordKey,
        translation: this.currentWord.translation,
        category: this.currentCategory
      });
    }
    
    // Save to localStorage
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
    
    // Update button
    this.updateFavoriteButton();
    
    // If showing favorites and removing a favorite, reload cards
    if (this.showingFavorites && isFavorite) {
      this.loadFlashcards();
    }
  }
}
