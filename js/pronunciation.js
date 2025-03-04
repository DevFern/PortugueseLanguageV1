class PronunciationTrainer {
    constructor() {
        this.words = [];
        this.currentIndex = 0;
        this.level = 'beginner';
        this.isRecording = false;
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.recordedAudio = null;
        
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
        this.loadWords();
        this.renderWord();
        this.attachEventListeners();
        this.checkMicrophonePermission();
    }
    
    loadWords() {
        // Reset words array
        this.words = [];
        
        // Check if vocabulary data exists
        if (!vocabularyData) {
            console.error('Vocabulary data not found');
            return;
        }
        
        // Get words from all categories for pronunciation practice
        Object.keys(vocabularyData).forEach(category => {
            if (vocabularyData[category]) {
                if (this.level === 'beginner' && vocabularyData[category].basic) {
                    this.words = [...this.words, ...vocabularyData[category].basic];
                } else if (this.level === 'advanced' && vocabularyData[category].advanced) {
                    this.words = [...this.words, ...vocabularyData[category].advanced];
                }
            }
        });
        
        // If no words found, use fallback data
        if (this.words.length === 0) {
            this.words = [
                {
                    word: 'cidadania',
                    translation: 'citizenship',
                    usage: 'Preciso de obter a cidadania portuguesa.',
                    englishUsage: 'I need to obtain Portuguese citizenship.',
                    audio: 'audio/cidadania.mp3',
                    category: 'citizenship'
                },
                {
                    word: 'passaporte',
                    translation: 'passport',
                    usage: 'O meu passaporte está válido por mais cinco anos.',
                    englishUsage: 'My passport is valid for five more years.',
                    audio: 'audio/passaporte.mp3',
                    category: 'citizenship'
                },
                {
                    word: 'residência',
                    translation: 'residence',
                    usage: 'Tenho autorização de residência em Portugal.',
                    englishUsage: 'I have residence authorization in Portugal.',
                    audio: 'audio/residencia.mp3',
                    category: 'citizenship'
                }
            ];
        }
        
        // Shuffle the words for variety
        this.words = this.shuffleArray(this.words);
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
            // Simple phonetic representation - this could be improved with actual phonetic data
            this.phoneticElement.textContent = `[${this.generateSimplePhonetic(word.word || word.portuguese || '')}]`;
        }
        
        // Reset feedback display
        if (this.feedbackDisplay) {
            this.feedbackDisplay.textContent = 'Listen to the pronunciation and practice saying the word';
        }
        
        // Update progress if progress tracker exists
        if (window.progressTracker) {
            window.progressTracker.updateListeningProgress(this.currentIndex, this.words.length);
        }
    }
    
    generateSimplePhonetic(word) {
        // This is a very simple phonetic representation
        // In a real app, you would use a proper phonetic database or API
        return word.split('').join('-');
    }
    
    playAudio(audioSrc) {
        const word = this.words[this.currentIndex];
        const audioPath = audioSrc || (word ? word.audio : null);
        
        if (!audioPath) {
            console.error('No audio available for this word');
            if (this.feedbackDisplay) {
                this.feedbackDisplay.textContent = 'No audio available for this word';
            }
            return;
        }
        
        const audio = new Audio(audioPath);
        audio.play().catch(error => {
            console.error('Error playing audio:', error);
            if (this.feedbackDisplay) {
                this.feedbackDisplay.textContent = 'Error playing audio. Please try again.';
            }
        });
    }
    
    startRecording() {
        if (!this.mediaRecorder) {
            console.error('Media recorder not initialized');
            return;
        }
        
        this.isRecording = true;
        this.audioChunks = [];
        this.mediaRecorder.start();
        
        if (this.recordButton) {
            this.recordButton.classList.add('recording');
            this.recordButton.innerHTML = '<i class="fas fa-stop"></i> Stop';
        }
        
        if (this.feedbackDisplay) {
            this.feedbackDisplay.textContent = 'Recording... Speak now';
        }
    }
    
    stopRecording() {
        if (!this.mediaRecorder || !this.isRecording) {
            return;
        }
        
        this.isRecording = false;
        this.mediaRecorder.stop();
        
        if (this.recordButton) {
            this.recordButton.classList.remove('recording');
            this.recordButton.innerHTML = '<i class="fas fa-microphone"></i> Record';
        }
        
        if (this.feedbackDisplay) {
            this.feedbackDisplay.textContent = 'Processing your pronunciation...';
        }
    }
    
    provideFeedback() {
        // In a real implementation, this would compare the recorded audio with the correct pronunciation
        // using speech recognition or audio analysis
        // For now, we'll provide simulated feedback
        
        const feedbackOptions = [
            'Good pronunciation! Your accent is improving.',
            'Try to emphasize the stressed syllable more.',
            'Pay attention to the vowel sounds, they\'re different from English.',
            'Great job! Keep practicing this word.',
            'Try to speak a bit slower and clearer.'
        ];
        
        const randomFeedback = feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)];
        
        if (this.feedbackDisplay) {
            this.feedbackDisplay.innerHTML = `
                <p><strong>Feedback:</strong> ${randomFeedback}</p>
                <div class="feedback-actions">
                    <button class="play-recorded">Play Your Recording</button>
                    <button class="play-correct">Play Correct Pronunciation</button>
                </div>
            `;
            
            const playRecordedButton = this.feedbackDisplay.querySelector('.play-recorded');
            if (playRecordedButton && this.recordedAudio) {
                playRecordedButton.addEventListener('click', () => {
                    this.recordedAudio.play();
                });
            }
            
            const playCorrectButton = this.feedbackDisplay.querySelector('.play-correct');
            if (playCorrectButton) {
                playCorrectButton.addEventListener('click', () => {
                    const word = this.words[this.currentIndex];
                    if (word && word.audio) {
                        this.playAudio(word.audio);
                    }
                });
            }
        }
    }
    
    checkMicrophonePermission() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            console.error('Media devices API not supported');
            if (this.feedbackDisplay) {
                this.feedbackDisplay.textContent = 'Your browser does not support audio recording.';
            }
            if (this.recordButton) {
                this.recordButton.disabled = true;
            }
            return;
        }
        
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                this.initializeMediaRecorder(stream);
            })
            .catch(error => {
                console.error('Error accessing microphone:', error);
                if (this.feedbackDisplay) {
                    this.feedbackDisplay.textContent = 'Microphone access denied. Please allow microphone access to use this feature.';
                }
                if (this.recordButton) {
                    this.recordButton.disabled = true;
                }
            });
    }
    
    initializeMediaRecorder(stream) {
        try {
            this.mediaRecorder = new MediaRecorder(stream);
            
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.audioChunks.push(event.data);
                }
            };
            
            this.mediaRecorder.onstop = () => {
                const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
                this.recordedAudio = new Audio(URL.createObjectURL(audioBlob));
                this.provideFeedback();
            };
        } catch (error) {
            console.error('Error initializing media recorder:', error);
            if (this.feedbackDisplay) {
                this.feedbackDisplay.textContent = 'Error initializing audio recording. Please try again.';
            }
        }
    }
    
    nextWord() {
        if (this.currentIndex < this.words.length - 1) {
            this.currentIndex++;
        } else {
            this.currentIndex = 0; // Loop back to the first word
        }
        this.renderWord();
    }
    
    prevWord() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
        } else {
            this.currentIndex = this.words.length - 1; // Loop to the last word
        }
        this.renderWord();
    }
    
    setLevel(level) {
        this.level = level;
        this.currentIndex = 0;
        this.loadWords();
        this.renderWord();
    }
    
    attachEventListeners() {
        // Play audio button
        if (this.playButton) {
            this.playButton.addEventListener('click', () => {
                const word = this.words[this.currentIndex];
                if (word && word.audio) {
                    this.playAudio(word.audio);
                }
            });
        }
        
        // Record button
        if (this.recordButton) {
            this.recordButton.addEventListener('click', () => {
                if (this.isRecording) {
                    this.stopRecording();
                } else {
                    this.startRecording();
                }
            });
        }
        
        // Navigation buttons
        if (this.prevButton) {
            this.prevButton.addEventListener('click', () => this.prevWord());
        }
        
        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => this.nextWord());
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
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (document.querySelector('#pronunciation.active')) {
                if (e.key === 'ArrowRight') {
                    this.nextWord();
                } else if (e.key === 'ArrowLeft') {
                    this.prevWord();
                } else if (e.key === ' ' || e.key === 'Spacebar') {
                    const word = this.words[this.currentIndex];
                    if (word && word.audio) {
                        this.playAudio(word.audio);
                    }
                    e.preventDefault(); // Prevent scrolling with spacebar
                } else if (e.key === 'r' || e.key === 'R') {
                    if (this.isRecording) {
                        this.stopRecording();
                    } else {
                        this.startRecording();
                    }
                }
            }
        });
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
    
    // Add pronunciation exercises
    addPronunciationExercises() {
        if (!this.feedbackDisplay) return;
        
        const word = this.words[this.currentIndex];
        if (!word) return;
        
        const exercises = [
            {
                title: 'Vowel Sounds',
                description: 'Portuguese has nasal vowels that don\'t exist in English. Practice the nasal sounds in this word.',
                example: this.highlightNasalVowels(word.word || word.portuguese || '')
            },
            {
                title: 'Stress Pattern',
                description: 'Pay attention to the stressed syllable in Portuguese words.',
                example: this.highlightStressedSyllable(word.word || word.portuguese || '')
            },
            {
                title: 'Minimal Pairs',
                description: 'Practice distinguishing similar sounds.',
                example: this.getMinimalPairs(word.word || word.portuguese || '')
            }
        ];
        
        // Only show exercises for words that have them
        const filteredExercises = exercises.filter(ex => ex.example !== '');
        
        if (filteredExercises.length === 0) return;
        
        let exercisesHtml = '<div class="pronunciation-exercises"><h4>Pronunciation Exercises</h4>';
        
        filteredExercises.forEach(exercise => {
            exercisesHtml += `
                <div class="exercise">
                    <h5>${exercise.title}</h5>
                    <p>${exercise.description}</p>
                    <div class="example">${exercise.example}</div>
                </div>
            `;
        });
        
        exercisesHtml += '</div>';
        
        // Add exercises after feedback
        const currentContent = this.feedbackDisplay.innerHTML;
        this.feedbackDisplay.innerHTML = currentContent + exercisesHtml;
    }
    
    // Helper methods for pronunciation exercises
    highlightNasalVowels(word) {
        // Highlight nasal vowels (ã, õ, etc.) in the word
        // This is a simplified version - a real implementation would be more sophisticated
        const nasalVowels = ['ã', 'õ', 'ẽ', 'ĩ', 'ũ', 'am', 'em', 'im', 'om', 'um', 'an', 'en', 'in', 'on', 'un'];
        
        let result = word;
        nasalVowels.forEach(vowel => {
            result = result.replace(new RegExp(vowel, 'gi'), `<span class="nasal-vowel">${vowel}</span>`);
        });
        
        return result || '';
    }
    
    highlightStressedSyllable(word) {
        // This is a simplified approach - a real implementation would use a dictionary or rules
        // Portuguese stress rules are complex but generally fall on the penultimate syllable
        
        if (!word || word.length < 2) return word;
        
        // Split into syllables (very simplified)
        const syllables = this.simpleSyllableSplit(word);
        
        if (syllables.length < 2) return word;
        
        // Default stress on penultimate syllable
        let stressIndex = syllables.length - 2;
        
        // Words ending in -r, -l, -z, -i, -u or nasal sounds typically stress the last syllable
        const lastChar = word.charAt(word.length - 1).toLowerCase();
        if (['r', 'l', 'z', 'i', 'u'].includes(lastChar)) {
            stressIndex = syllables.length - 1;
        }
        
        // Words with accent marks have explicit stress
        for (let i = 0; i < syllables.length; i++) {
            if (/[áàâãéèêíìîóòôõúùû]/i.test(syllables[i])) {
                stressIndex = i;
                break;
            }
        }
        
        // Create result with highlighted syllable
        return syllables.map((syllable, index) => 
            index === stressIndex ? 
                `<span class="stressed-syllable">${syllable}</span>` : 
                syllable
        ).join('');
    }
    
    simpleSyllableSplit(word) {
        // Very simplified syllable splitting - not linguistically accurate
        // A real implementation would use proper syllabification rules
        
        if (!word) return [];
        
        const vowels = 'aeiouyáàâãéèêíìîóòôõúùû';
        let syllables = [];
        let currentSyllable = '';
        
        for (let i = 0; i < word.length; i++) {
            currentSyllable += word[i];
            
            // If current character is a vowel and next character exists and is a consonant
            if (
                vowels.includes(word[i].toLowerCase()) && 
                i + 1 < word.length && 
                !vowels.includes(word[i + 1].toLowerCase())
            ) {
                // And if after that consonant there's another vowel
                if (i + 2 < word.length && vowels.includes(word[i + 2].toLowerCase())) {
                    syllables.push(currentSyllable);
                    currentSyllable = '';
                }
            }
        }
        
        // Add the last syllable if there's anything left
        if (currentSyllable) {
            syllables.push(currentSyllable);
        }
        
        // If we couldn't split it properly, just return the whole word
        return syllables.length > 0 ? syllables : [word];
    }
    
    getMinimalPairs(word) {
        // This would ideally come from a database of minimal pairs
        // For now, we'll just provide some common examples
        
        const commonPairs = {
            'avô': 'avó (grandfather/grandmother - note the stress difference)',
            'caro': 'carro (expensive/car - note the rolled R)',
            'sede': 'sede (thirst/headquarters - note the open vs closed E)',
            'tu': 'do (you/of the - practice the T vs D sounds)',
            'pão': 'pau (bread/stick - practice the nasal vs oral vowel)'
        };
        
        return commonPairs[word.toLowerCase()] || '';
    }
}
