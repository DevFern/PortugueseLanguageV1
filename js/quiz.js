class QuizManager {
  constructor() {
    this.currentQuiz = null;
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.totalQuestions = 0;
    this.level = localStorage.getItem('userLevel') || 'beginner';
    this.quizType = 'vocabulary';
    this.answeredQuestions = [];
    
    // DOM elements
    this.quizContainer = document.querySelector('.quiz-container');
    this.quizTypeButtons = document.querySelectorAll('.quiz-type-btn');
    this.levelButtons = document.querySelectorAll('#quiz .level-btn');
  }
  
  init() {
    console.log('Initializing QuizManager');
    this.attachEventListeners();
    this.generateQuiz(this.quizType);
  }
  
  attachEventListeners() {
    // Quiz type selection
    if (this.quizTypeButtons) {
      this.quizTypeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          this.quizTypeButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          
          const type = btn.getAttribute('data-quiz');
          if (type) {
            this.quizType = type;
            this.generateQuiz(type);
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
            this.generateQuiz(this.quizType);
          }
        });
      });
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (document.querySelector('#quiz.active')) {
        // Number keys 1-4 for selecting options
        if (e.key >= '1' && e.key <= '4') {
          const optionIndex = parseInt(e.key) - 1;
          const option = this.quizContainer.querySelector(`#option-${optionIndex}`);
          if (option && !option.disabled) {
            option.checked = true;
          }
        }
        
        // Enter to submit answer
        if (e.key === 'Enter') {
          const submitButton = this.quizContainer.querySelector('.submit-answer-btn');
          if (submitButton) {
            submitButton.click();
          }
        }
        
        // Space to play audio in listening questions
        if (e.key === ' ' && e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT') {
          const audioButton = this.quizContainer.querySelector('.play-audio-btn');
          if (audioButton) {
            audioButton.click();
            e.preventDefault(); // Prevent page scrolling
          }
        }
      }
    });
  }
  
  generateQuiz(type) {
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.answeredQuestions = [];
    this.quizType = type;
    
    switch(type) {
      case 'vocabulary':
        this.currentQuiz = this.createVocabQuiz();
        break;
      case 'listening':
        this.currentQuiz = this.createListeningQuiz();
        break;
      case 'grammar':
        this.currentQuiz = this.createGrammarQuiz();
        break;
      case 'citizenship':
        this.currentQuiz = this.createCitizenshipQuiz();
        break;
      default:
        this.currentQuiz = this.createVocabQuiz();
    }
    
    this.totalQuestions = this.currentQuiz.questions.length;
    this.renderQuestion();
  }
  
  createVocabQuiz() {
    const questions = [];
    
    // Try to use vocabulary data if available
    if (typeof vocabularyData !== 'undefined') {
      try {
        // Get words based on level
        let words = [];
        
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
              words = [...words, ...levelData];
            }
          }
        });
        
        // Create questions from words
        if (words.length > 0) {
          // Shuffle words to get random selection
          words = this.shuffleArray(words);
          
          // Create multiple choice questions
          for (let i = 0; i < Math.min(words.length, 10); i++) {
            const word = words[i];
            
            // Portuguese to English question
            questions.push({
              question: `What is the meaning of "${word.word || word.portuguese}"?`,
              options: this.generateOptions(word.translation, words),
              correct: 0 // First option is always correct
            });
            
            // English to Portuguese question
            questions.push({
              question: `How do you say "${word.translation}" in Portuguese?`,
              options: this.generateReverseOptions(word.word || word.portuguese, words),
              correct: 0 // First option is always correct
            });
          }
        }
      } catch (e) {
        console.error('Error creating vocabulary quiz:', e);
      }
    }
    
    // If no questions created, use fallback
    if (questions.length === 0) {
      questions.push(
        {
          question: 'What is the meaning of "cidadania"?',
          options: ['citizenship', 'city', 'citizen', 'civil rights'],
          correct: 0
        },
        {
          question: 'How do you say "passport" in Portuguese?',
          options: ['passaporte', 'passe', 'documento', 'identificação'],
          correct: 0
        },
        {
          question: 'What is the meaning of "residência"?',
          options: ['residence', 'president', 'resident', 'resistance'],
          correct: 0
        },
        {
          question: 'How do you say "thank you" in Portuguese?',
          options: ['obrigado', 'por favor', 'de nada', 'bom dia'],
          correct: 0
        }
      );
    }
    
    // Shuffle questions and limit to 10
    return {
      title: 'Vocabulary Quiz',
      questions: this.shuffleArray(questions).slice(0, 10)
    };
  }
  
  createListeningQuiz() {
    const questions = [
      {
        question: 'Listen and select what the person is asking for:',
        options: ['Directions to the citizenship office', 'A restaurant recommendation', 'The time of day', 'A taxi'],
        correct: 0,
        audio: 'audio/listening1.mp3',
        transcript: 'Pode dizer-me onde fica o departamento de cidadania, por favor?'
      },
      {
        question: 'Listen and select the correct translation:',
        options: ['I need to renew my residence permit', 'I need to apply for citizenship', 'I need to get a new passport', 'I need to register my address'],
        correct: 0,
        audio: 'audio/listening2.mp3',
        transcript: 'Preciso de renovar a minha autorização de residência.'
      },
      {
        question: 'What is the person asking about?',
        options: ['The bus schedule', 'The train station', 'The airport', 'The taxi stand'],
        correct: 1,
        audio: 'audio/listening3.mp3',
        transcript: 'A que horas parte o próximo comboio para Lisboa?'
      }
    ];
    
    return {
      title: 'Listening Comprehension',
      questions: questions
    };
  }
  
  createGrammarQuiz() {
    const questions = [
      {
        question: 'Complete the sentence: "Eu ____ português todos os dias."',
        options: ['estudo', 'estudar', 'estudando', 'estudei'],
        correct: 0,
        explanation: 'Present tense for "eu" with regular -ar verb "estudar" is "estudo"'
      },
      {
        question: 'Which is the correct way to say "I am learning Portuguese" in European Portuguese?',
        options: ['Estou a aprender português', 'Estou aprendendo português', 'Aprendo português', 'Vou aprender português'],
        correct: 0,
        explanation: 'European Portuguese uses "estar a + infinitive" for the present continuous'
      },
      {
        question: 'Complete: "Ontem, eu ____ ao supermercado."',
        options: ['fui', 'vou', 'ia', 'irei'],
        correct: 0,
        explanation: 'Past tense (Pretérito Perfeito) of "ir" is "fui"'
      },
      {
        question: 'Which sentence is correct?',
        options: ['Gosto de comer pão com manteiga', 'Gosto comer pão com manteiga', 'Gosto a comer pão com manteiga', 'Gosto que comer pão com manteiga'],
        correct: 0,
        explanation: 'The verb "gostar" requires the preposition "de" before the infinitive'
      },
      {
        question: 'Complete: "Amanhã nós ____ ao cinema."',
        options: ['vamos', 'fomos', 'íamos', 'iremos'],
        correct: 0,
        explanation: 'Future using "ir + infinitive" is "vamos" for "nós"'
      }
    ];
    
    return {
      title: 'Grammar Quiz',
      questions: questions
    };
  }
  
  createCitizenshipQuiz() {
    const questions = [
      {
        question: 'What is the capital of Portugal?',
        options: ['Lisbon', 'Porto', 'Coimbra', 'Faro'],
        correct: 0
      },
      {
        question: 'Which of these is NOT one of Portugal\'s official symbols?',
        options: ['The Rooster of Barcelos', 'The Portuguese Flag', 'The National Anthem "A Portuguesa"', 'The Portuguese Shield'],
        correct: 0
      },
      {
        question: 'How many years of legal residence in Portugal are generally required for citizenship?',
        options: ['5 years', '3 years', '10 years', '1 year'],
        correct: 0
      },
      {
        question: 'Which language test level is required for Portuguese citizenship?',
        options: ['A2', 'B1', 'B2', 'C1'],
        correct: 0
      },
      {
        question: 'Which of these is a Portuguese national holiday?',
        options: ['April 25 (Freedom Day)', 'May 1 (Labor Day)', 'June 10 (Portugal Day)', 'All of the above'],
        correct: 3
      }
    ];
    
    return {
      title: 'Citizenship Test Preparation',
      questions: questions
    };
  }
  
  renderQuestion() {
    if (!this.quizContainer) {
      console.error('Quiz container not found');
      return;
    }
    
    if (!this.currentQuiz || this.currentQuestionIndex >= this.totalQuestions) {
      this.showResults();
      return;
    }
    
    const question = this.currentQuiz.questions[this.currentQuestionIndex];
    
    let audioHtml = '';
    if (question.audio) {
      audioHtml = `
        <div class="audio-player">
          <button class="play-audio-btn"><i class="fas fa-play"></i> Play Audio</button>
          <p class="audio-note">Note: Audio files will be available in a future update.</p>
        </div>
      `;
    }
    
    let explanationHtml = '';
    if (question.explanation) {
      explanationHtml = `<div class="explanation hidden" id="explanation">${question.explanation}</div>`;
    }
    
    this.quizContainer.innerHTML = `
      <div class="quiz-header">
        <h3>${this.currentQuiz.title}</h3>
        <div class="quiz-progress">Question ${this.currentQuestionIndex + 1} of ${this.totalQuestions}</div>
      </div>
      ${audioHtml}
      <div class="question-text">${question.question}</div>
      <div class="options-container">
        ${question.options.map((option, index) => `
          <div class="option">
            <input type="radio" id="option-${index}" name="answer" value="${index}">
            <label for="option-${index}">${option}</label>
          </div>
        `).join('')}
      </div>
      ${explanationHtml}
      <button class="submit-answer-btn">Submit Answer</button>
    `;
    
    // Attach event listeners
    const submitButton = this.quizContainer.querySelector('.submit-answer-btn');
    if (submitButton) {
      submitButton.addEventListener('click', () => {
        const selectedOption = this.quizContainer.querySelector('input[name="answer"]:checked');
        if (selectedOption) {
          const answer = parseInt(selectedOption.value);
          this.checkAnswer(answer, question.correct);
        } else {
          // Visual feedback for no selection
          this.quizContainer.querySelector('.options-container').classList.add('shake');
          setTimeout(() => {
            this.quizContainer.querySelector('.options-container').classList.remove('shake');
          }, 500);
        }
      });
    }
    
    // Audio button (placeholder for now)
    const audioButton = this.quizContainer.querySelector('.play-audio-btn');
    if (audioButton) {
      audioButton.addEventListener('click', () => {
        alert('Audio files will be available in a future update.');
        
        // Show transcript if available
        if (question.transcript) {
          const audioNote = this.quizContainer.querySelector('.audio-note');
          if (audioNote) {
            audioNote.innerHTML = `<strong>Transcript:</strong> "${question.transcript}"<br><small>Audio files will be available in a future update.</small>`;
          }
        }
      });
    }
    
    // Track progress if progress tracker exists
    if (window.progressTracker) {
      switch(this.quizType) {
        case 'vocabulary':
          window.progressTracker.updateVocabularyFromQuiz({
            percentage: (this.currentQuestionIndex / this.totalQuestions) * 100
          });
          break;
        case 'grammar':
          window.progressTracker.updateGrammarProgress(this.currentQuestionIndex, this.totalQuestions);
          break;
        case 'listening':
          window.progressTracker.updateListeningProgress(this.currentQuestionIndex, this.totalQuestions);
          break;
        case 'citizenship':
          window.progressTracker.updateCitizenshipProgress(this.currentQuestionIndex, this.totalQuestions);
          break;
      }
    }
  }
  
  checkAnswer(userAnswer, correctAnswer) {
    const explanation = this.quizContainer.querySelector('#explanation');
    
    // Record this question as answered
    this.answeredQuestions.push({
      questionIndex: this.currentQuestionIndex,
      userAnswer: userAnswer,
      correctAnswer: correctAnswer,
      isCorrect: userAnswer === correctAnswer
    });
    
    if (userAnswer === correctAnswer) {
      this.score++;
      
      // Show correct answer feedback
      const selectedLabel = this.quizContainer.querySelector(`label[for="option-${userAnswer}"]`);
      if (selectedLabel) {
        selectedLabel.parentNode.classList.add('correct');
      }
    } else {
      // Show incorrect answer feedback
      const selectedLabel = this.quizContainer.querySelector(`label[for="option-${userAnswer}"]`);
      if (selectedLabel) {
        selectedLabel.parentNode.classList.add('incorrect');
      }
      
      // Highlight correct answer
      const correctLabel = this.quizContainer.querySelector(`label[for="option-${correctAnswer}"]`);
      if (correctLabel) {
        correctLabel.parentNode.classList.add('correct');
      }
    }
    
    // Show explanation if available
    if (explanation) {
      explanation.classList.remove('hidden');
    }
    
    // Disable all options
    const options = this.quizContainer.querySelectorAll('input[name="answer"]');
    options.forEach(option => {
      option.disabled = true;
    });
    
    // Change submit button to next button
    const submitButton = this.quizContainer.querySelector('.submit-answer-btn');
    if (submitButton) {
      submitButton.textContent = 'Next Question';
      submitButton.classList.add('next-question-btn');
      submitButton.onclick = () => {
        this.currentQuestionIndex++;
        this.renderQuestion();
      };
    }
  }
  
  showResults() {
    const percentage = Math.round((this.score / this.totalQuestions) * 100);
    
    let resultClass = '';
    let message = '';
    
    if (percentage >= 90) {
      resultClass = 'excellent';
      message = 'Excellent! You have a great understanding of Portuguese!';
    } else if (percentage >= 70) {
      resultClass = 'good';
      message = 'Good job! You\'re making good progress!';
    } else if (percentage >= 50) {
      resultClass = 'average';
      message = 'Not bad! Keep practicing to improve your score.';
    } else {
      resultClass = 'poor';
      message = 'Keep studying! You\'ll get better with practice.';
    }
    
    // Create results summary
    let questionSummary = '';
    if (this.answeredQuestions.length > 0) {
      questionSummary = `
        <div class="question-summary">
          <h4>Question Summary</h4>
          <div class="summary-list">
            ${this.answeredQuestions.map((answer, index) => {
              const question = this.currentQuiz.questions[answer.questionIndex];
              return `
                <div class="summary-item ${answer.isCorrect ? 'correct' : 'incorrect'}">
                  <span class="question-number">Q${index + 1}:</span>
                  <span class="question-result">${answer.isCorrect ? 'Correct' : 'Incorrect'}</span>
                  <span class="question-text">${question.question}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }
    
    const html = `
      <div class="quiz-results">
        <h3>Quiz Results</h3>
        <div class="result-score ${resultClass}">
          <div class="score-circle">
            <span class="score-number">${percentage}%</span>
          </div>
          <p class="score-message">${message}</p>
        </div>
        <p>You scored ${this.score} out of ${this.totalQuestions} questions correctly.</p>
        ${questionSummary}
        <div class="result-actions">
          <button class="retry-btn">Try Again</button>
          <button class="new-quiz-btn">New Quiz</button>
        </div>
      </div>
    `;
    
    this.quizContainer.innerHTML = html;
    
    // Add event listeners to buttons
    const retryButton = this.quizContainer.querySelector('.retry-btn');
    if (retryButton) {
      retryButton.addEventListener('click', () => {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.answeredQuestions = [];
        this.renderQuestion();
      });
    }
    
    const newQuizButton = this.quizContainer.querySelector('.new-quiz-btn');
    if (newQuizButton) {
      newQuizButton.addEventListener('click', () => {
        this.generateQuiz(this.quizType);
      });
    }
    
    // Save quiz result if progress tracker exists
    if (window.progressTracker) {
      const quizResult = {
        type: this.quizType,
        level: this.level,
        score: this.score,
        total: this.totalQuestions,
        percentage: percentage,
        date: new Date().toISOString()
      };
      
      window.progressTracker.saveQuizResult(quizResult);
    }
  }
  
  // Helper methods
  generateOptions(correctAnswer, words) {
    // Create array with correct answer as first element
    const options = [correctAnswer];
    
    // Add 3 random incorrect options
    const translations = words.map(w => w.translation).filter(t => t !== correctAnswer);
    const shuffled = this.shuffleArray(translations);
    
    for (let i = 0; i < 3 && i < shuffled.length; i++) {
      options.push(shuffled[i]);
    }
    
    // If we don't have enough options, add some generic ones
    while (options.length < 4) {
      options.push(`Option ${options.length + 1}`);
    }
    
    // Shuffle options and remember correct answer index
    const shuffledOptions = this.shuffleArray([...options]);
    const correctIndex = shuffledOptions.indexOf(correctAnswer);
    
    // Update correct answer index
    this.currentQuiz.questions[this.currentQuestionIndex].correct = correctIndex;
    
    return shuffledOptions;
  }
  
  generateReverseOptions(correctAnswer, words) {
    // Create array with correct answer as first element
    const options = [correctAnswer];
    
    // Add 3 random incorrect options
    const portugueseWords = words.map(w => w.word || w.portuguese).filter(t => t !== correctAnswer);
    const shuffled = this.shuffleArray(portugueseWords);
    
    for (let i = 0; i < 3 && i < shuffled.length; i++) {
      options.push(shuffled[i]);
    }
    
    // If we don't have enough options, add some generic ones
    while (options.length < 4) {
      options.push(`Option ${options.length + 1}`);
    }
    
    // Shuffle options and remember correct answer index
    const shuffledOptions = this.shuffleArray([...options]);
    const correctIndex = shuffledOptions.indexOf(correctAnswer);
    
    // Update correct answer index
    this.currentQuiz.questions[this.currentQuestionIndex].correct = correctIndex;
    
    return shuffledOptions;
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
