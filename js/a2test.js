/**
 * A2 Test Preparation Module
 * Handles the A2 test preparation section functionality
 */

class A2TestPreparation {
    constructor() {
        this.testContainer = document.querySelector('.test-container');
        this.sectionButtons = document.querySelectorAll('.test-section-btn');
        this.currentSection = 'listening';
        this.testData = a2TestPrep || {};
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.totalQuestions = 0;
        this.isTestActive = false;
    }

    init() {
        if (!this.testContainer || !this.sectionButtons.length) {
            console.error('A2 Test elements not found');
            return;
        }

        // Attach event listeners to section buttons
        this.sectionButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const section = btn.getAttribute('data-section');
                this.changeSection(section);
                
                // Update active button
                this.sectionButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // Initialize with default section
        this.loadSection(this.currentSection);
    }

    changeSection(section) {
        this.currentSection = section;
        this.loadSection(section);
    }

    loadSection(section) {
        if (!this.testData[section]) {
            this.testContainer.innerHTML = `
                <div class="section-intro">
                    <h3>A2 ${this.capitalizeFirstLetter(section)} Test</h3>
                    <p>This section is currently under development. Please check back soon!</p>
                </div>
            `;
            return;
        }

        // Reset test state
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.isTestActive = false;

        // Show section introduction
        this.showSectionIntro(section);
    }

    showSectionIntro(section) {
        const sectionData = this.testData[section];
        
        this.testContainer.innerHTML = `
            <div class="section-intro">
                <h3>A2 ${this.capitalizeFirstLetter(section)} Test</h3>
                <p>${this.getSectionDescription(section)}</p>
                <div class="test-info">
                    <div class="info-item">
                        <i class="fas fa-clock"></i>
                        <span>Duration: ${sectionData.length} minutes</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-question-circle"></i>
                        <span>Questions: ${this.countQuestions(sectionData)} questions</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-trophy"></i>
                        <span>Passing Score: 60%</span>
                    </div>
                </div>
                <button class="start-test-btn">Start Test</button>
            </div>
        `;

        // Attach event listener to start button
        const startButton = this.testContainer.querySelector('.start-test-btn');
        if (startButton) {
            startButton.addEventListener('click', () => this.startTest(section));
        }
    }

    startTest(section) {
        this.isTestActive = true;
        this.totalQuestions = this.countQuestions(this.testData[section]);
        
        // Start with first question
        this.renderQuestion(section);
    }

    renderQuestion(section) {
        const sectionData = this.testData[section];
        
        if (!sectionData || this.currentQuestionIndex >= sectionData.length) {
            this.showResults();
            return;
        }

        const questionData = sectionData[this.currentQuestionIndex];
        
        let questionHTML = '';
        
        // Different rendering based on section type
        if (section === 'listening') {
            questionHTML = this.renderListeningQuestion(questionData);
        } else if (section === 'reading') {
            questionHTML = this.renderReadingQuestion(questionData);
        } else if (section === 'grammar') {
            questionHTML = this.renderGrammarQuestion(questionData);
        } else {
            questionHTML = this.renderGenericQuestion(questionData);
        }
        
        this.testContainer.innerHTML = `
            <div class="test-question">
                <div class="question-header">
                    <h3>Question ${this.currentQuestionIndex + 1} of ${this.totalQuestions}</h3>
                    <div class="test-progress">
                        <div class="progress-bar">
                            <div class="progress" style="width: ${((this.currentQuestionIndex + 1) / this.totalQuestions) * 100}%"></div>
                        </div>
                    </div>
                </div>
                ${questionHTML}
            </div>
        `;
        
        // Attach event listeners to options
        const optionButtons = this.testContainer.querySelectorAll('.option-btn');
        optionButtons.forEach((btn, index) => {
            btn.addEventListener('click', () => this.checkAnswer(index));
        });
        
        // Attach event listener to audio player if it exists
        const audioPlayer = this.testContainer.querySelector('.play-audio');
        if (audioPlayer && questionData.audio) {
            audioPlayer.addEventListener('click', () => {
                const audio = new Audio(questionData.audio);
                audio.play().catch(error => {
                    console.error('Error playing audio:', error);
                });
            });
        }
    }

    renderListeningQuestion(questionData) {
        return `
            <div class="listening-question">
                <div class="audio-player">
                    <button class="play-audio"><i class="fas fa-volume-up"></i> Listen</button>
                    <p class="audio-instruction">Listen to the audio and answer the question below.</p>
                </div>
                <div class="question-text">
                    <p>${questionData.question}</p>
                </div>
                <div class="options">
                    ${questionData.options.map((option, index) => `
                        <button class="option-btn" data-index="${index}">${option}</button>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderReadingQuestion(questionData) {
        return `
            <div class="reading-question">
                <div class="reading-passage">
                    <p>${questionData.passage}</p>
                </div>
                <div class="question-text">
                    <p>${questionData.question}</p>
                </div>
                <div class="options">
                    ${questionData.options.map((option, index) => `
                        <button class="option-btn" data-index="${index}">${option}</button>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderGrammarQuestion(questionData) {
        return `
            <div class="grammar-question">
                <div class="question-text">
                    <p>${questionData.question}</p>
                </div>
                <div class="options">
                    ${questionData.options.map((option, index) => `
                        <button class="option-btn" data-index="${index}">${option}</button>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderGenericQuestion(questionData) {
        return `
            <div class="generic-question">
                <div class="question-text">
                    <p>${questionData.question}</p>
                </div>
                <div class="options">
                    ${questionData.options.map((option, index) => `
                        <button class="option-btn" data-index="${index}">${option}</button>
                    `).join('')}
                </div>
            </div>
        `;
    }

    checkAnswer(selectedIndex) {
        const sectionData = this.testData[this.currentSection];
        const questionData = sectionData[this.currentQuestionIndex];
        
        const isCorrect = selectedIndex === questionData.correct;
        
        if (isCorrect) {
            this.score++;
        }
        
        // Show feedback
        const optionButtons = this.testContainer.querySelectorAll('.option-btn');
        
        optionButtons.forEach((btn, index) => {
            btn.disabled = true;
            
            if (index === questionData.correct) {
                btn.classList.add('correct');
            } else if (index === selectedIndex && !isCorrect) {
                btn.classList.add('incorrect');
            }
        });
        
        // Add explanation if available
        if (questionData.explanation) {
            const explanationDiv = document.createElement('div');
            explanationDiv.className = 'explanation';
            explanationDiv.innerHTML = `<p><strong>${isCorrect ? 'Correct!' : 'Incorrect!'}</strong> ${questionData.explanation}</p>`;
            this.testContainer.querySelector('.options').after(explanationDiv);
        }
        
        // Add next button
        const nextButton = document.createElement('button');
        nextButton.className = 'next-btn';
        nextButton.textContent = 'Next Question';
        nextButton.addEventListener('click', () => {
            this.currentQuestionIndex++;
            this.renderQuestion(this.currentSection);
        });
        
        this.testContainer.querySelector('.test-question').appendChild(nextButton);
    }

    showResults() {
        const percentage = Math.round((this.score / this.totalQuestions) * 100);
        let resultClass, message;
        
        if (percentage >= 80) {
            resultClass = 'excellent';
            message = 'Excellent! You\'re well prepared for the A2 exam.';
        } else if (percentage >= 60) {
            resultClass = 'good';
            message = 'Good job! You\'re on the right track for the A2 exam.';
        } else {
            resultClass = 'needs-improvement';
            message = 'You need more practice before taking the A2 exam.';
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
        
        // Save test result if user is logged in
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
    const a2TestModule = new A2TestPreparation();
    a2TestModule.init();
});
