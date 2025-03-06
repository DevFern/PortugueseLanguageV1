/**
 * Pronunciation Trainer for Portuguese A2 Learning App
 * Simplified version without audio recording dependencies
 */

class PronunciationTrainer {
  constructor() {
    this.words = [];
    this.currentIndex = 0;
    this.level = localStorage.getItem('userLevel') || 'beginner';
    
    // DOM elements
    this.wordDisplay = document.querySelector('.word-display');
    this.wordElement = this.wordDisplay ? this.wordDisplay.querySelector('.word') : null;
    this.translationElement = this.wordDisplay ? this.wordDisplay.querySelector('.translation') : null;
    this.phoneticElement = this.wordDisplay ? this.wordDisplay.querySelector('.phonetic') : null;
    this.playButton = document.querySelector('.play-audio');
    this.recordButton = document.querySelector('.record-pronunciation');
    this.feedbackDisplay = document.querySelector('.feedback-display');
    this.prevButton = document.getElementById('prev-word');
    this.nextButton = document.getElementById('next-word');
    
    // Level selectors
    this.levelButtons = document.querySelectorAll('#pronunciation .level-btn');
  }
  
  init() {
    console.log('Initializing PronunciationTrainer');
    this.loadWords();
    this.renderWord();
    this.attachEventListeners();
  }
  
  loadWords() {
    console.log('Loading pronunciation words');
    
    // Reset words array
    this.words = [];
    
    // Try to load from vocabulary data if it exists
    if (typeof vocabularyData !== 'undefined') {
      try {
        // Get words from all categories for pronunciation practice
        Object.keys(vocabularyData).forEach(category => {
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
              this.words = [...this.words, ...levelData];
            }
          }
        });
      } catch (e) {
        console.error('Error loading vocabulary data:', e);
      }
    }
    
    // If no words found, use fallback data
    if (this.words.length === 0) {
      console.log('Using fallback pronunciation data');
      this.words = [
        {
          word: 'cidadania',
          translation: 'citizenship',
          phonetic: 'si-da-da-ni-a',
          usage: 'Preciso de obter a cidadania portuguesa.',
          englishUsage: 'I need to obtain Portuguese citizenship.',
          audio: 'audio/cidadania.mp3'
        },
        {
          word: 'passaporte',
          translation: 'passport',
          phonetic: 'pa-sa-por-te',
          usage: 'O meu passaporte está válido por mais cinco anos.',
          englishUsage: 'My passport is valid for five more years.',
          audio: 'audio/passaporte.mp3'
        },
        {
          word: 'residência',
          translation: 'residence',
          phonetic: 're-zi-den-si-a',
          usage: 'Tenho autorização de residência em Portugal.',
          englishUsage: 'I have residence authorization in Portugal.',
          audio: 'audio/residencia.mp3'
        },
        {
          word: 'obrigado',
          translation: 'thank you',
          phonetic: 'o-bri-ga-do',
          usage: 'Obrigado pela sua ajuda.',
          englishUsage: 'Thank you for your help.',
          audio: 'audio/obrigado.mp3'
        },
        {
          word: 'por favor',
          translation: 'please',
          phonetic: 'por fa-vor',
          usage: 'Por favor, pode repetir?',
          englishUsage: 'Please, can you repeat?',
          audio: 'audio/porfavor.mp3'
        }
      ];
    }
  }
  
  renderWord() {
    if (this.words.length === 0) {
      console.error('No words available');
      return;
    }
    
    const word = this.words[this.currentIndex];
    
    // Update word display
    if (this.wordElement) {
      this.wordElement.textContent = word.word || word.portuguese || '';
    }
    
    if (this.translationElement) {
      this.translationElement.textContent = word.translation || '';
    }
    
    if (this.phoneticElement) {
      this.phoneticElement.textContent = word.phonetic || this.generateSimplePhonetic(word.word || word.portuguese);
    }
    
    // Update navigation buttons
    this.updateNavigationButtons();
  }
  
  attachEventListeners() {
    // Level selection
    if (this.levelButtons) {
      this.levelButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          // Update active button
          this.levelButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          
          // Update level and reload words
          this.level = btn.getAttribute('data-level');
          localStorage.setItem('userLevel', this.level);
          this.loadWords();
          this.currentIndex = 0;
          this.renderWord();
        });
      });
    }
    
    // Audio playback
    if (this.playButton) {
      this.playButton.addEventListener('click', () => {
        this.playCurrentWordAudio();
      });
    }
    
    // Recording (simplified for now)
    if (this.recordButton) {
      this.recordButton.addEventListener('click', () => {
        this.toggleRecording();
      });
    }
    
    // Navigation
    if (this.prevButton) {
      this.prevButton.addEventListener('click', () => {
        this.navigateToPrevWord();
      });
    }
    
    if (this.nextButton) {
      this.nextButton.addEventListener('click', () => {
        this.navigateToNextWord();
      });
    }
  }
  
  navigateToPrevWord() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.renderWord();
    }
  }
  
  navigateToNextWord() {
    if (this.currentIndex < this.words.length - 1) {
      this.currentIndex++;
      this.renderWord();
    }
  }
  
  updateNavigationButtons() {
    if (this.prevButton) {
      this.prevButton.disabled = this.currentIndex === 0;
    }
    
    if (this.nextButton) {
      this.nextButton.disabled = this.currentIndex === this.words.length - 1;
    }
  }
  
  playCurrentWordAudio() {
    const word = this.words[this.currentIndex];
    if (word && word.audio) {
      const audio = new Audio(`assets/${word.audio}`);
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
        if (this.feedbackDisplay) {
          this.feedbackDisplay.innerHTML = 'Audio file not found. Please try another word.';
        }
      });
    } else {
      console.warn('No audio file available for this word');
      if (this.feedbackDisplay) {
        this.feedbackDisplay.innerHTML = 'No audio file available for this word.';
      }
    }
  }
  
  toggleRecording() {
    if (this.recordButton.classList.contains('recording')) {
      // Stop recording
      this.recordButton.classList.remove('recording');
      this.recordButton.innerHTML = '<i class="fas fa-microphone"></i> Record';
      
      // In a real implementation, this would stop the recording and process it
      if (this.feedbackDisplay) {
        this.feedbackDisplay.innerHTML = 'Recording feature will be available in a future update.';
      }
    } else {
      // Start recording
      this.recordButton.classList.add('recording');
      this.recordButton.innerHTML = '<i class="fas fa-stop"></i> Stop';
      
      // In a real implementation, this would start the recording
      if (this.feedbackDisplay) {
        this.feedbackDisplay.innerHTML = 'Recording... (simulated)';
      }
    }
  }
  
  generateSimplePhonetic(word) {
    // Simple function to generate basic phonetic representation
    // In a real app, this would be more sophisticated
    if (!word) return '';
    return word.toLowerCase().split('').join('-');
  }
  
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
  if (document.querySelector('#pronunciation')) {
    const pronunciationTrainer = new PronunciationTrainer();
    pronunciationTrainer.init();
    
    // Make it globally accessible
    window.pronunciationTrainer = pronunciationTrainer;
  }
});
