class A2TestPreparation {
  constructor() {
    this.testData = a2TestPrep || {};
    this.currentSection = 'listening';
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.totalQuestions = 0;
    this.testContainer = document.querySelector('.test-container');
    this.sectionButtons = document.querySelectorAll('.test-section-btn');
  }
  
  init() {
    this.attachEventListeners();
    this.loadSection(this.currentSection);
  }
  
  attachEventListeners() {
    if (this.sectionButtons) {
      this.sectionButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const section = btn.getAttribute('data-section');
          
          // Update active button
          this.sectionButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          
          // Load section
          this.loadSection(section);
        });
      });
    }
  }
  
  loadSection(section) {
    this.currentSection = section;
    this.currentQuestionIndex = 0;
    this.score = 0;
    
    if (!this.testData[section]) {
      this.showNoContentMessage();
      return;
    }
    
    const sectionData = this.testData[section];
    this.totalQuestions = this.countQuestions(sectionData);
    
    if (this.totalQuestions === 0) {
      this.showNoContentMessage();
      return;
    }
    
    this.showSectionIntro(section, sectionData);
  }
  
  showSectionIntro(section, sectionData) {
    if (!this.testContainer) return;
    
    const sectionTitle = this.capitalizeFirstLetter(section);
    const description = this.getSectionDescription(section);
    
    this.testContainer.innerHTML = `
      <div class="section-intro">
        <h3>${sectionTitle} Test</h3>
        <p>${description}</p>
        <p>This test contains ${this.totalQuestions} questions.</p>
        <button class="start-test-btn">Start Test</button>
      </div>
    `;
    
    const startButton = this.testContainer.querySelector('.start-test-btn');
    if (startButton) {
      startButton.addEventListener('click', () => {
        this.startTest(section);
      });
    }
  }
  
  startTest(section) {
    this.currentSection = section;
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.renderQuestion();
  }
  
  renderQuestion() {
    if (!this.testContainer) return;
    
    const sectionData = this.testData[this.currentSection];
    if (!sectionData || this.currentQuestionIndex >= sectionData.length) {
      this.showResults();
      return;
    }
    
    const question = sectionData[this.currentQuestionIndex];
    
    // Different rendering based on section type
    switch (this.currentSection) {
      case 'listening':
        this.renderListeningQuestion(question);
        break;
      case 'reading':
        this.renderReadingQuestion(question);
        break;
      case 'speaking':
        this.renderSpeakingQuestion(question);
        break;
      case 'writing':
        this.renderWritingQuestion(question);
        break;
      case 'grammar':
        this.renderGrammarQuestion(question);
        break;
      default:
        this.renderDefaultQuestion(question);
    }
  }
  
  renderListeningQuestion(question) {
    this.testContainer.innerHTML = `
      <div class="question-container">
        <h3>Question ${this.currentQuestionIndex + 1} of ${this.totalQuestions}</h3>
        <div class="audio-player">
          <button class="play-audio-btn"><i class="fas fa-play"></i> Play Audio</button>
          <p class="audio-note">Note: Audio files will be available in a future update.</p>
        </div>
        <div class="question-text">${question.question}</div>
        <div class="options-container">
          ${question.options.map((option, index) => `
            <div class="option">
              <input type="radio" id="option-${index}" name="answer" value="${index}">
              <label for="option-${index}">${option}</label>
            </div>
          `).join('')}
        </div>
        <button class="submit-answer-btn">Submit Answer</button>
      </div>
    `;
    
    // Attach event listeners
    const submitButton = this.testContainer.querySelector('.submit-answer-btn');
    if (submitButton) {
      submitButton.addEventListener('click', () => {
        const selectedOption = this.testContainer.querySelector('input[name="answer"]:checked');
        if (selectedOption) {
          const answer = parseInt(selectedOption.value);
          this.checkAnswer(answer, question.correct);
        } else {
          alert('Please select an answer');
        }
      });
    }
    
    // Audio button (placeholder for now)
    const audioButton = this.testContainer.querySelector('.play-audio-btn');
    if (audioButton) {
      audioButton.addEventListener('click', () => {
        alert('Audio files will be available in a future update.');
      });
    }
  }
  
  renderReadingQuestion(question) {
    this.testContainer.innerHTML = `
      <div class="question-container">
        <h3>Question ${this.currentQuestionIndex + 1} of ${this.totalQuestions}</h3>
        <div class="reading-text">${question.text}</div>
        <div class="question-text">${question.question}</div>
        <div class="options-container">
          ${question.options.map((option, index) => `
            <div class="option">
              <input type="radio" id="option-${index}" name="answer" value="${index}">
              <label for="option-${index}">${option}</label>
            </div>
          `).join('')}
        </div>
        <button class="submit-answer-btn">Submit Answer</button>
      </div>
    `;
    
    // Attach event listeners
    const submitButton = this.testContainer.querySelector('.submit-answer-btn');
    if (submitButton) {
      submitButton.addEventListener('click', () => {
        const selectedOption = this.testContainer.querySelector('input[name="answer"]:checked');
        if (selectedOption) {
          const answer = parseInt(selectedOption.value);
          this.checkAnswer(answer, question.correct);
        } else {
          alert('Please select an answer');
        }
      });
    }
  }
  
  renderSpeakingQuestion(question) {
    this.testContainer.innerHTML = `
      <div class="question-container">
        <h3>Speaking Practice</h3>
        <div class="speaking-prompt">
          <h4>${question.title}</h4>
          <p>${question.prompt}</p>
        </div>
        <div class="example-container">
          <h4>Example Response:</h4>
          <p class="example-text">${question.example}</p>
        </div>
        <div class="assessment-criteria">
          <h4>Assessment Criteria:</h4>
          <ul>
            ${question.assessment.map(criterion => `<li>${criterion}</li>`).join('')}
          </ul>
        </div>
        <div class="speaking-controls">
          <button class="record-btn"><i class="fas fa-microphone"></i> Record</button>
          <button class="next-question-btn">Next Question</button>
        </div>
      </div>
    `;
    
    // Attach event listeners
    const recordButton = this.testContainer.querySelector('.record-btn');
    if (recordButton) {
      recordButton.addEventListener('click', () => {
        alert('Recording functionality will be available in a future update.');
      });
    }
    
    const nextButton = this.testContainer.querySelector('.next-question-btn');
    if (nextButton) {
      nextButton.addEventListener('click', () => {
        this.currentQuestionIndex++;
        this.renderQuestion();
      });
    }
  }
  
  renderWritingQuestion(question) {
    this.testContainer.innerHTML = `
      <div class="question-container">
        <h3>Writing Practice</h3>
        <div class="writing-prompt">
          <h4>${question.title}</h4>
          <p>${question.prompt}</p>
        </div>
        <div class="writing-area">
          <textarea class="writing-input" rows="10" placeholder="Write your response here..."></textarea>
        </div>
        <div class="example-container">
          <h4>Example Response:</h4>
          <p class="example-text">${question.example.replace(/\n/g, '<br>')}</p>
        </div>
        <div class="assessment-criteria">
          <h4>Assessment Criteria:</h4>
          <ul>
            ${question.assessment.map(criterion => `<li>${criterion}</li>`).join('')}
          </ul>
        </div>
        <button class="next-question-btn">Next Question</button>
      </div>
    `;
    
    // Attach event listeners
    const nextButton = this.testContainer.querySelector('.next-question-btn');
    if (nextButton) {
      nextButton.addEventListener('click', () => {
        this.currentQuestionIndex++;
        this.renderQuestion();
      });
    }
  }
  
  renderGrammarQuestion(question) {
    this.testContainer.innerHTML = `
      <div class="question-container">
        <h3>Question ${this.currentQuestionIndex + 1} of ${this.totalQuestions}</h3>
        <div class="question-text">${question.question}</div>
        <div class="options-container">
          ${question.options.map((option, index) => `
            <div class="option">
              <input type="radio" id="option-${index}" name="answer" value="${index}">
              <label for="option-${index}">${option}</label>
            </div>
          `).join('')}
        </div>
        <button class="submit-answer-btn">Submit Answer</button>
      </div>
    `;
    
    // Attach event listeners
    const submitButton = this.testContainer.querySelector('.submit-answer-btn');
    if (submitButton) {
      submitButton.addEventListener('click', () => {
        const selectedOption = this.testContainer.querySelector('input[name="answer"]:checked');
        if (selectedOption) {
          const answer = parseInt(selectedOption.value);
          this.checkAnswer(answer, question.correct);
        } else {
          alert('Please select an answer');
        }
      });
    }
  }
  
  renderDefaultQuestion(question) {
    this.testContainer.innerHTML = `
      <div class="question-container">
        <h3>Question ${this.currentQuestionIndex + 1} of ${this.totalQuestions}</h3>
        <div class="question-text">${question.question}</div>
        <div class="options-container">
          ${question.options.map((option, index) => `
            <div class="option">
              <input type="radio" id="option-${index}" name="answer" value="${index}">
              <label for="option-${index}">${option}</label>
            </div>
          `).join('')}
        </div>
        <button class="submit-answer-btn">Submit Answer</button>
      </div>
    `;
    
    // Attach event listeners
    const submitButton = this.testContainer.querySelector('.submit-answer-btn');
    if (submitButton) {
      submitButton.addEventListener('click', () => {
        const selectedOption = this.testContainer.querySelector('input[name="answer"]:checked');
        if (selectedOption) {
          const answer = parseInt(selectedOption.value);
          this.checkAnswer(answer, question.correct);
        } else {
          alert('Please select an answer');
        }
      });
    }
  }
  
  checkAnswer(userAnswer, correctAnswer) {
    if (userAnswer === correctAnswer) {
      this.score++;
    }
    
    this.currentQuestionIndex++;
    this.renderQuestion();
  }
  
  showResults() {
    if (!this.testContainer) return;
    
    const percentage = Math.round((this.score / this.totalQuestions) * 100);
    let resultClass = 'average';
    let message = 'Good effort!';
    
    if (percentage >= 80) {
      resultClass = 'excellent';
      message = 'Excellent work!';
    } else if (percentage < 50) {
      resultClass = 'needs-improvement';
      message = 'Keep practicing!';
    }
    
    this.testContainer.innerHTML = `
      <div class="test-results">
        <h3>Test Results</h3>
        <div class="result-score ${resultClass}">
          <div class="score-circle">
            <span class="score-number">${percentage}%</span>
          </div>
          <p class="score-message">${message}</p>
        </div>
        <p>You scored ${this.score} out of ${this.totalQuestions} questions correctly.</p>
        <div class="result-actions">
          <button class="retry-btn">Try Again</button>
          <button class="new-test-btn">Try Another Section</button>
        </div>
      </div>
    `;
    
    // Attach event listeners to buttons
    const retryButton = this.testContainer.querySelector('.retry-btn');
    if (retryButton) {
      retryButton.addEventListener('click', () => {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.startTest(this.currentSection);
      });
    }
    
    const newTestButton = this.testContainer.querySelector('.new-test-btn');
    if (newTestButton) {
      newTestButton.addEventListener('click', () => {
        this.loadSection(this.currentSection);
      });
    }
    
    // Save test result if progress tracker exists
    if (window.progressTracker) {
      const testResult = {
        type: 'a2test',
        section: this.currentSection,
        score: this.score,
        total: this.totalQuestions,
        percentage: percentage,
        date: new Date().toISOString()
      };
      
      window.progressTracker.saveQuizResult(testResult);
    }
  }
  
  showNoContentMessage() {
    if (!this.testContainer) return;
    
    this.testContainer.innerHTML = `
      <div class="no-content-message">
        <h3>Content Coming Soon</h3>
        <p>The ${this.capitalizeFirstLetter(this.currentSection)} section is currently under development.</p>
        <p>Please check back later or try another section.</p>
      </div>
    `;
  }
  
  // Helper methods
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  getSectionDescription(section) {
    const descriptions = {
      listening: 'This section tests your ability to understand spoken European Portuguese in everyday situations.',
      reading: 'This section tests your ability to read and understand written European Portuguese texts.',
      speaking: 'This section tests your ability to communicate in spoken European Portuguese.',
      writing: 'This section tests your ability to write in European Portuguese.',
      grammar: 'This section tests your knowledge of European Portuguese grammar rules.'
    };
    
    return descriptions[section] || 'This section tests your knowledge of European Portuguese.';
  }
  
  countQuestions(sectionData) {
    return Array.isArray(sectionData) ? sectionData.length : 0;
  }
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  if (document.querySelector('#a2test')) {
    const a2TestModule = new A2TestPreparation();
    a2TestModule.init();
    window.a2TestModule = a2TestModule;
  }
});
