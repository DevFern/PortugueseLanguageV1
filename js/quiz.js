class QuizManager {
    constructor(quizData) {
        this.quizData = quizData || {};
        this.currentQuiz = null;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.totalQuestions = 0;
        this.level = 'beginner';
        this.quizType = 'vocabulary';
        
        // DOM elements
        this.quizContainer = document.querySelector('.quiz-container');
    }

    init() {
        this.attachEventListeners();
        this.generateQuiz(this.quizType);
    }
    
    setLevel(level) {
        this.level = level;
        this.generateQuiz(this.quizType);
    }
    
    attachEventListeners() {
        // Quiz type selection
        const quizTypeButtons = document.querySelectorAll('.quiz-type-btn');
        if (quizTypeButtons) {
            quizTypeButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const type = btn.getAttribute('data-quiz');
                    this.quizType = type;
                    
                    // Update active button
                    quizTypeButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    // Generate new quiz
                    this.generateQuiz(type);
                });
            });
        }
    }

    generateQuiz(type) {
        this.currentQuestionIndex = 0;
        this.score = 0;
        
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
        // Create vocabulary quiz based on level
        const questions = [];
        
        // Use vocabulary data if available
        if (vocabularyData && vocabularyData.citizenship) {
            let words = [];
            
            if (this.level === 'beginner' && vocabularyData.citizenship.basic) {
                words = vocabularyData.citizenship.basic;
            } else if (this.level === 'advanced' && vocabularyData.citizenship.advanced) {
                words = vocabularyData.citizenship.advanced;
            }
            
            // Create questions from words
            words.forEach(word => {
                // Create multiple choice question
                questions.push({
                    question: `What is the meaning of "${word.word || word.portuguese}"?`,
                    options: this.generateOptions(word.translation, words),
                    correct: 0, // First option is always correct
                    audio: word.audio
                });
                
                // Create reverse question (English to Portuguese)
                questions.push({
                    question: `How do you say "${word.translation}" in Portuguese?`,
                    options: this.generateReverseOptions(word.word || word.portuguese, words),
                    correct: 0, // First option is always correct
                });
            });
        } else {
            // Fallback to hardcoded questions
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
        // Create listening quiz based on level and a2TestPrep data
        let questions = [];
        
        if (this.quizData && this.quizData.listening) {
            this.quizData.listening.forEach(item => {
                item.questions.forEach(q => {
                    questions.push({
                        question: q.question,
                        options: q.options,
                        correct: q.correct,
                        audio: item.audio,
                        transcript: item.transcript
                    });
                });
            });
        } else {
            // Fallback to hardcoded questions
            questions = [
                {
                    question: 'Listen and select what the person is asking for:',
                    options: ['Directions to the citizenship office', 'A restaurant recommendation', 'The time of day', 'A taxi'],
                    correct: 0,
                    audio: 'listening1.mp3'
                }
            ];
        }
        
        return {
            title: 'Listening Comprehension',
            questions: this.shuffleArray(questions).slice(0, 5)
        };
    }

    createGrammarQuiz() {
        // Create grammar quiz based on level
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
            }
        ];
        
        return {
            title: 'Grammar Quiz',
            questions: questions
        };
    }

    createCitizenshipQuiz() {
        // Create citizenship test prep quiz
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
            }
        ];
        
        return {
            title: 'Citizenship Test Preparation',
            questions: questions
        };
    }

    renderQuestion() {
        if (!this.currentQuiz || !this.currentQuiz.questions.length) {
            this.quizContainer.innerHTML = '<p>No questions available for this quiz type.</p>';
            return;
        }
        
        const question = this.currentQuiz.questions[this.currentQuestionIndex];
        
        let audioHtml = '';
        if (question.audio) {
            audioHtml = `
                <div class="audio-player">
                    <audio controls>
                        <source src="assets/audio/${question.audio}" type="audio/mpeg">
                        Your browser does not support the audio element.
                    </audio>
                </div>
            `;
        }
        
        let html = `
            <div class="quiz-header">
                <h3>${this.currentQuiz.title}</h3>
                <div class="quiz-progress">
                    Question ${this.currentQuestionIndex + 1} of ${this.totalQuestions}
                </div>
            </div>
            
            <div class="question-container">
                ${audioHtml}
                <h4 class="question">${question.question}</h4>
                <div class="options">
        `;
        
        question.options.forEach((option, index) => {
            html += `
                <button class="option-btn" data-index="${index}">
                    ${option}
                </button>
            `;
        });
        
        html += `
                </div>
            </div>
            
            <div class="quiz-footer">
                <div class="score">Score: ${this.score}/${this.totalQuestions}</div>
            </div>
        `;
        
        this.quizContainer.innerHTML = html;
        
        // Add event listeners to options
        const optionButtons = this.quizContainer.querySelectorAll('.option-btn');
        optionButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const selectedIndex = parseInt(btn.getAttribute('data-index'));
                this.checkAnswer(selectedIndex);
            });
        });
    }

    checkAnswer(selectedIndex) {
        const question = this.currentQuiz.questions[this.currentQuestionIndex];
        const isCorrect = selectedIndex === question.correct;
        
        // Update score
        if (isCorrect) {
            this.score++;
        }
        
        // Show correct/incorrect feedback
        const optionButtons = this.quizContainer.querySelectorAll('.option-btn');
        optionButtons.forEach((btn, index) => {
            btn.disabled = true;
            
            if (index === question.correct) {
                btn.classList.add('correct');
            } else if (index === selectedIndex && !isCorrect) {
                btn.classList.add('incorrect');
            }
        });
        
        // Show explanation if available
        if (question.explanation) {
            const explanationDiv = document.createElement('div');
            explanationDiv.className = 'explanation';
            explanationDiv.textContent = question.explanation;
            this.quizContainer.querySelector('.question-container').appendChild(explanationDiv);
        }
        
        // Add next button
        const nextButton = document.createElement('button');
        nextButton.className = 'next-btn';
        nextButton.textContent = this.currentQuestionIndex < this.totalQuestions - 1 ? 'Next Question' : 'See Results';
        
        nextButton.addEventListener('click', () => {
            if (this.currentQuestionIndex < this.totalQuestions - 1) {
                this.currentQuestionIndex++;
                this.renderQuestion();
            } else {
                this.showResults();
            }
        });
        
        this.quizContainer.querySelector('.quiz-footer').appendChild(nextButton);
    }

    showResults() {
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
                <div class="result-actions">
                    <button class="retry-btn">Try Again</button>
                    <button class="new-quiz-btn">New Quiz</button>
                </div>
            </div>
        `;
        
        this.quizContainer.innerHTML = html;
        
        // Add event listeners to buttons
        this.quizContainer.querySelector('.retry-btn').addEventListener('click', () => {
            this.currentQuestionIndex = 0;
            this.score = 0;
            this.renderQuestion();
        });
        
        this.quizContainer.querySelector('.new-quiz-btn').addEventListener('click', () => {
            this.generateQuiz(this.quizType);
        });
        
        // Save quiz result if user is logged in
        if (window.authManager && window.authManager.getCurrentUser()) {
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
