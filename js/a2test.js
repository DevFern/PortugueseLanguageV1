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
    console.log('Initializing A2TestPreparation');
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
  
  countQuestions(sectionData) {
    if (!sectionData || !Array.isArray(sectionData)) return 0;
    
    let count = 0;
    sectionData.forEach(item => {
      if (item.questions && Array.isArray(item.questions)) {
        count += item.questions.length;
      } else {
        count += 1; // Count the item itself as a question
      }
    });
    
    return count;
  }
  
  showNoContentMessage() {
    if (!this.testContainer) return;
    
    this.testContainer.innerHTML = `
      <div class="no-content">
        <h3>Content Coming Soon</h3>
        <p>We're working on adding ${this.capitalizeFirstLetter(this.currentSection)} test content.</p>
        <p>Please check back later or try another section.</p>
      </div>
    `;
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
  
  getSectionDescription(section) {
    const descriptions = {
      'listening': 'Test your ability to understand spoken Portuguese. You will hear audio clips and answer questions about what you heard.',
      'reading': 'Test your ability to read and understand Portuguese texts. You will read passages and answer questions about them.',
      'speaking': 'Practice your speaking skills with guided prompts. You will be asked to speak about various topics.',
      'writing': 'Practice your writing skills with guided prompts. You will be asked to write short texts on various topics.',
      'grammar': 'Test your knowledge of Portuguese grammar rules and structures.'
    };
    
    return descriptions[section] || 'Test your Portuguese language skills.';
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
        
        // Show transcript if available
        if (question.transcript) {
          const audioNote = this.testContainer.querySelector('.audio-note');
          if (audioNote) {
            audioNote.innerHTML = `<strong>Transcript:</strong> "${question.transcript}"<br><small>Audio files will be available in a future update.</small>`;
          }
        }
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
          <textarea class="writing-input" rows="8" placeholder="Write your response here..."></textarea>
        </div>
        <div class="assessment-criteria">
          <h4>Assessment Criteria:</h4>
          <ul>
            ${question.assessment.map(criterion => `<li>${criterion}</li>`).join('')}
          </ul>
        </div>
        <div class="writing-controls">
          <button class="save-btn">Save Response</button>
          <button class="next-question-btn">Next Question</button>
        </div>
      </div>
    `;
    
    // Attach event listeners
    const saveButton = this.testContainer.querySelector('.save-btn');
    if (saveButton) {
      saveButton.addEventListener('click', () => {
        const response = this.testContainer.querySelector('.writing-input').value;
        if (response.trim()) {
          alert('Your response has been saved. In a future update, you will be able to receive feedback on your writing.');
        } else {
          alert('Please write a response before saving.');
        }
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
    const question = this.testData[this.currentSection][this.currentQuestionIndex];
    
    if (userAnswer === correctAnswer) {
      this.score++;
      
      // Show correct answer feedback
      const selectedLabel = this.testContainer.querySelector(`label[for="option-${userAnswer}"]`);
      if (selectedLabel) {
        selectedLabel.parentNode.classList.add('correct');
      }
    } else {
      // Show incorrect answer feedback
      const selectedLabel = this.testContainer.querySelector(`label[for="option-${userAnswer}"]`);
      if (selectedLabel) {
        selectedLabel.parentNode.classList.add('incorrect');
      }
      
      // Highlight correct answer
      const correctLabel = this.testContainer.querySelector(`label[for="option-${correctAnswer}"]`);
      if (correctLabel) {
        correctLabel.parentNode.classList.add('correct');
      }
    }
    
    // Show explanation if available
    if (question.explanation) {
      const explanationDiv = document.createElement('div');
      explanationDiv.className = 'explanation';
      explanationDiv.innerHTML = `<p><strong>Explanation:</strong> ${question.explanation}</p>`;
      
      const optionsContainer = this.testContainer.querySelector('.options-container');
      if (optionsContainer) {
        optionsContainer.after(explanationDiv);
      }
    }
    
    // Disable all options
    const options = this.testContainer.querySelectorAll('input[name="answer"]');
    options.forEach(option => {
      option.disabled = true;
    });
    
    // Change submit button to next button
    const submitButton = this.testContainer.querySelector('.submit-answer-btn');
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
          <button class="new-test-btn">Choose Another Test</button>
        </div>
      </div>
    `;
    
    // Add event listeners to buttons
    const retryButton = this.testContainer.querySelector('.retry-btn');
    if (retryButton) {
      retryButton.addEventListener('click', () => {
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
        type: this.currentSection,
        score: this.score,
        total: this.totalQuestions,
        percentage: percentage,
        date: new Date().toISOString()
      };
      
      window.progressTracker.saveQuizResult(testResult);
    }
  }
  
  capitalizeFirstLetter(string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}
