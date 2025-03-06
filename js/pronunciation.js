/**
 * Pronunciation Trainer for Portuguese A2 Learning App
 * Includes playback and recording buttons with placeholders for future functionality
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
    this.audioVisualizer = document.getElementById('audio-visualizer');
    
    // Level selectors
    this.levelButtons = document.querySelectorAll('#pronunciation .level-btn');
    
    // Recording state
    this.isRecording = false;
  }
  
  init() {
    console.log('Initializing PronunciationTrainer');
    this.loadWords();
    this.renderWord();
    this.attachEventListeners();
    this.initializeAudioVisualizer();
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
          audio: 'audio/cidadania.mp3',
          pronunciationGuide: 'The "ci" is pronounced like "see", and the stress is on the "da" syllable.'
        },
        {
          word: 'passaporte',
          translation: 'passport',
          phonetic: 'pa-sa-por-te',
          usage: 'O meu passaporte está válido por mais cinco anos.',
          englishUsage: 'My passport is valid for five more years.',
          audio: 'audio/passaporte.mp3',
          pronunciationGuide: 'The "ss" is pronounced like "s" in "see", and the stress is on the "por" syllable.'
        },
        {
          word: 'residência',
          translation: 'residence',
          phonetic: 're-zi-den-si-a',
          usage: 'Tenho autorização de residência em Portugal.',
          englishUsage: 'I have residence authorization in Portugal.',
          audio: 'audio/residencia.mp3',
          pronunciationGuide: 'The "r" is slightly rolled, and the stress is on the "den" syllable.'
        },
        {
          word: 'obrigado',
          translation: 'thank you',
          phonetic: 'o-bri-ga-do',
          usage: 'Obrigado pela sua ajuda.',
          englishUsage: 'Thank you for your help.',
          audio: 'audio/obrigado.mp3',
          pronunciationGuide: 'The "r" is pronounced like "h" in English, and the stress is on the "ga" syllable.'
        },
        {
          word: 'por favor',
          translation: 'please',
          phonetic: 'por fa-vor',
          usage: 'Por favor, pode repetir?',
          englishUsage: 'Please, can you repeat?',
          audio: 'audio/por-favor.mp3',
          pronunciationGuide: 'The "r" at the end of "favor" is almost silent, and the stress is on the "vor" syllable.'
        },
        {
          word: 'bom dia',
          translation: 'good morning',
          phonetic: 'bom di-a',
          usage: 'Bom dia, como está?',
          englishUsage: 'Good morning, how are you?',
          audio: 'audio/bom-dia.mp3',
          pronunciationGuide: 'The "om" in "bom" is nasalized, similar to the French nasal vowels.'
        },
        {
          word: 'boa tarde',
          translation: 'good afternoon',
          phonetic: 'bo-a tar-de',
          usage: 'Boa tarde, tudo bem?',
          englishUsage: 'Good afternoon, all good?',
          audio: 'audio/boa-tarde.mp3',
          pronunciationGuide: 'The "r" in "tarde" is pronounced like "h" in English.'
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
      // Include pronunciation guide if available
      const guide = word.pronunciationGuide || this.generatePronunciationGuide(word.word || word.portuguese);
      this.feedbackDisplay.innerHTML = `
        <p>Listen to the pronunciation and practice saying the word.</p>
        <p><strong>Pronunciation Guide:</strong> ${guide}</p>
        <p><small>Recording functionality will be available in a future update. For now, practice saying the word out loud.</small></p>
      `;
    }
    
    // Update navigation buttons
    if (this.prevButton) {
      this.prevButton.disabled = this.currentIndex === 0;
    }
    
    if (this.nextButton) {
      this.nextButton.disabled = this.currentIndex === this.words.length - 1;
    }
    
    // Reset recording state
    this.isRecording = false;
    if (this.recordButton) {
      this.recordButton.classList.remove('recording');
      this.recordButton.innerHTML = '<i class="fas fa-microphone"></i> Record';
    }
  }
  
  initializeAudioVisualizer() {
    if (!this.audioVisualizer) return;
    
    const canvas = this.audioVisualizer;
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Draw placeholder visualization
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw some placeholder waveform
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    
    for (let x = 0; x < canvas.width; x++) {
      const y = (Math.sin(x * 0.05) * canvas.height / 4) + (canvas.height / 2);
      ctx.lineTo(x, y);
    }
    
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 2;
    ctx.stroke();
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
  
  generatePronunciationGuide(word) {
    if (!word) return '';
    
    // Common Portuguese pronunciation patterns
    const patterns = {
      'ão': 'pronounced as a nasal "ow" sound',
      'nh': 'similar to "ny" in "canyon"',
      'lh': 'similar to "lli" in "million"',
      'rr': 'a strong guttural sound, like "h" in English',
      'r': 'at the beginning of words, pronounced like "h" in English',
      'e': 'at the end of words, pronounced like "i" in "bit"',
      'o': 'at the end of words, pronounced like "oo" in "book" but shorter',
      'ç': 'pronounced like "s" in "see"',
      'ch': 'pronounced like "sh" in "shoe"'
    };
    
    // Check for patterns in the word
    let foundPatterns = [];
    for (const [pattern, pronunciation] of Object.entries(patterns)) {
      if (word.includes(pattern)) {
        foundPatterns.push(`The "${pattern}" is ${pronunciation}.`);
      }
    }
    
    if (foundPatterns.length > 0) {
      return foundPatterns.join(' ');
    } else {
      return 'Pronounce each letter clearly, with emphasis on the stressed syllable.';
    }
  }
  
  attachEventListeners() {
    // Play audio button
    if (this.playButton) {
      this.playButton.addEventListener('click', () => {
        const currentWord = this.words[this.currentIndex];
        if (currentWord && currentWord.audio) {
          // For now, just show a message since we don't have audio files
          if (this.feedbackDisplay) {
            this.feedbackDisplay.innerHTML = `
              <p>Audio files will be available in a future update.</p>
              <p><strong>Pronunciation Guide:</strong> ${currentWord.pronunciationGuide || this.generatePronunciationGuide(currentWord.word || currentWord.portuguese)}</p>
              <p><small>For now, practice saying the word out loud.</small></p>
            `;
          }
        } else {
          if (this.feedbackDisplay) {
            this.feedbackDisplay.innerHTML = `
              <p>No audio available for this word.</p>
              <p><strong>Pronunciation Guide:</strong> ${currentWord.pronunciationGuide || this.generatePronunciationGuide(currentWord.word || currentWord.portuguese)}</p>
              <p><small>For now, practice saying the word out loud.</small></p>
            `;
          }
        }
      });
    }
    
    // Record button
    if (this.recordButton) {
      this.recordButton.addEventListener('click', () => {
        if (this.isRecording) {
          // Stop recording
          this.isRecording = false;
          this.recordButton.classList.remove('recording');
          this.recordButton.innerHTML = '<i class="fas fa-microphone"></i> Record';
          
          if (this.feedbackDisplay) {
            this.feedbackDisplay.innerHTML = `
              <p>Recording functionality will be available in a future update.</p>
              <p><strong>Pronunciation Guide:</strong> ${this.words[this.currentIndex].pronunciationGuide || this.generatePronunciationGuide(this.words[this.currentIndex].word || this.words[this.currentIndex].portuguese)}</p>
              <p><small>For now, practice saying the word out loud.</small></p>
            `;
          }
        } else {
          // Start recording
          this.isRecording = true;
          this.recordButton.classList.add('recording');
          this.recordButton.innerHTML = '<i class="fas fa-stop"></i> Stop';
          
          if (this.feedbackDisplay) {
            this.feedbackDisplay.innerHTML = `
              <p>Recording functionality will be available in a future update.</p>
              <p><strong>Pronunciation Guide:</strong> ${this.words[this.currentIndex].pronunciationGuide || this.generatePronunciationGuide(this.words[this.currentIndex].word || this.words[this.currentIndex].portuguese)}</p>
              <p><small>For now, practice saying the word out loud.</small></p>
            `;
          }
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
}
