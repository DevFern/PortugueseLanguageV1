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
          audio: 'audio/por-favor.mp3'
        }
      ];
    }
    
    // Shuffle the words for variety
    this.words = this.shuffleArray(this.words);
    console.log(`Loaded ${this.words.length} words for pronunciation practice`);
  }
  
  renderWord() {
    if (this.words.length === 0) {
      console.error('No words available for pronunciation practice');
      if (this.feedbackDisplay) {
        this.feedbackDisplay.innerHTML = 'No words available for pronunciation practice. Please try again later.';
      }
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
      this.phoneticElement.textContent = `[${word.phonetic || this.generateSimplePhonetic(word.word || word.portuguese)}]`;
    }
    
    // Reset feedback display
    if (this.feedbackDisplay) {
      this.feedbackDisplay.innerHTML = 'Listen to the pronunciation and practice saying the word. <br><small>Audio files will be available in a future update.</small>';
    }
    
    // Update navigation buttons
    if (this.prevButton) {
      this.prevButton.disabled = this.currentIndex === 0;
    }
    
    if (this.nextButton) {
      this.nextButton.disabled = this.currentIndex === this.words.length - 1;
    }
  }
  
  generateSimplePhonetic(word) {
    if (!word) return '';
    
    // Simple syllable splitting for Portuguese
    // This is a very basic implementation
    const vowels = ['a', 'e', 'i', 'o', 'u', 'á', 'é', 'í', 'ó', 'ú', 'ã', 'õ', 'â', 'ê', 'ô'];
    let result = '';
    let syllable = '';
    
    for (let i = 0; i < word.length; i++) {
      const char = word[i].toLowerCase();
      syllable += word[i];
      
      // If current character is a vowel and next character is a consonant or end of word
      if (vowels.includes(char) && 
          (i === word.length - 1 || !vowels.includes(word[i+1].toLowerCase()))) {
        result += syllable + (i < word.length - 1 ? '-' : '');
        syllable = '';
      }
    }
    
    // Add any remaining characters
    if (syllable) {
      result += syllable;
    }
    
    return result;
  }
  
  attachEventListeners() {
    // Play audio button
    if (this.playButton) {
      this.playButton.addEventListener('click', () => {
        const currentWord = this.words[this.currentIndex];
        if (currentWord && currentWord.audio) {
          // For now, just show a message since we don't have audio files
          if (this.feedbackDisplay) {
            this.feedbackDisplay.innerHTML = 'Audio files will be available in a future update. <br><small>Practice saying the word out loud.</small>';
          }
        } else {
          if (this.feedbackDisplay) {
            this.feedbackDisplay.innerHTML = 'No audio available for this word. <br><small>Practice saying the word out loud.</small>';
          }
        }
      });
    }
    
    // Record button
    if (this.recordButton) {
      this.recordButton.addEventListener('click', () => {
        // For now, just show a message
        if (this.feedbackDisplay) {
          this.feedbackDisplay.innerHTML = 'Recording functionality will be available in a future update. <br><small>For now, practice saying the word out loud.</small>';
        }
      });
    }
    
    // Navigation buttons
    if (this.prevButton) {
      this.prevButton.addEventListener('click', () => {
        if (this.currentIndex > 0) {
          this.currentIndex--;
          this.renderWord();
        }
      });
    }
    
    if (this.nextButton) {
      this.nextButton.addEventListener('click', () => {
        if (this.currentIndex < this.words.length - 1) {
          this.currentIndex++;
          this.renderWord();
          
          // Track progress if progress tracker exists
          if (window.progressTracker) {
            window.progressTracker.updateListeningProgress(this.currentIndex + 1, this.words.length);
          }
        }
      });
    }
    
    // Level buttons
    if (this.levelButtons && this.levelButtons.length > 0) {
      this.levelButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          this.levelButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          
          const level = btn.getAttribute('data-level');
          if (level) {
            this.setLevel(level);
          }
        });
      });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      // Only handle keys if pronunciation section is active
      if (document.querySelector('#pronunciation.active')) {
        if (e.key === 'ArrowRight') {
          if (this.currentIndex < this.words.length - 1) {
            this.currentIndex++;
            this.renderWord();
          }
        } else if (e.key === 'ArrowLeft') {
          if (this.currentIndex > 0) {
            this.currentIndex--;
            this.renderWord();
          }
        } else if (e.key === ' ' || e.key === 'Spacebar') {
          // Play audio on spacebar
          this.playButton.click();
          e.preventDefault(); // Prevent scrolling with spacebar
        }
      }
    });
  }
  
  setLevel(level) {
    if (this.level !== level) {
      this.level = level;
      localStorage.setItem('userLevel', level);
      this.currentIndex = 0;
      this.loadWords();
      this.renderWord();
    }
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
  
  // Placeholder for future audio playback
  playAudio(audioSrc) {
    console.log(`Would play audio: ${audioSrc}`);
    if (this.feedbackDisplay) {
      this.feedbackDisplay.innerHTML = 'Audio files will be available in a future update. <br><small>Practice saying the word out loud.</small>';
    }
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
