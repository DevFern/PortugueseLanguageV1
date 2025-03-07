class ProgressTracker {
    constructor() {
        this.progress = {
            vocabulary: 0,
            grammar: 0,
            listening: 0,
            citizenship: 0,
            quizzes: [],
            lastActivity: null,
            totalLessonsCompleted: 0,
            streak: 0,
            lastLogin: null
        };
        this.isInitialized = false;
        this.authManager = null;
    }
    
    init(authManager) {
        this.authManager = authManager;
        this.loadProgress();
        this.updateProgressUI();
        this.updateStreak();
    }
    
    async loadProgress() {
        if (this.authManager && this.authManager.getCurrentUser()) {
            const progress = await this.authManager.getProgress();
            if (progress) {
                this.progress = progress;
                // Ensure citizenship property exists
                if (typeof this.progress.citizenship === 'undefined') {
                    this.progress.citizenship = 0;
                }
                this.isInitialized = true;
            } else {
                // Initialize with default values if no progress exists
                this.progress.lastLogin = new Date().toISOString();
                this.saveProgress();
            }
        } else {
            // Try to load from localStorage
            const savedProgress = localStorage.getItem('progress');
            if (savedProgress) {
                try {
                    this.progress = JSON.parse(savedProgress);
                    // Ensure citizenship property exists
                    if (typeof this.progress.citizenship === 'undefined') {
                        this.progress.citizenship = 0;
                    }
                } catch (e) {
                    console.error('Error parsing saved progress:', e);
                }
            }
        }
    }
    
    updateProgressUI() {
        // Update progress bars
        const vocabProgress = document.getElementById('vocab-progress');
        const grammarProgress = document.getElementById('grammar-progress');
        const listeningProgress = document.getElementById('listening-progress');
        const citizenshipProgress = document.getElementById('citizenship-progress');
        
        if (vocabProgress) {
            vocabProgress.style.width = `${this.progress.vocabulary}%`;
            vocabProgress.setAttribute('aria-valuenow', this.progress.vocabulary);
        }
        
        if (grammarProgress) {
            grammarProgress.style.width = `${this.progress.grammar}%`;
            grammarProgress.setAttribute('aria-valuenow', this.progress.grammar);
        }
        
        if (listeningProgress) {
            listeningProgress.style.width = `${this.progress.listening}%`;
            listeningProgress.setAttribute('aria-valuenow', this.progress.listening);
        }
        
        if (citizenshipProgress) {
            citizenshipProgress.style.width = `${this.progress.citizenship || 0}%`;
            citizenshipProgress.setAttribute('aria-valuenow', this.progress.citizenship || 0);
        }
        
        // Update streak display if it exists
        const streakElement = document.getElementById('streak-count');
        if (streakElement) {
            streakElement.textContent = this.progress.streak;
        }
        
        // Update total lessons completed
        const lessonsElement = document.getElementById('lessons-completed');
        if (lessonsElement) {
            lessonsElement.textContent = this.progress.totalLessonsCompleted;
        }
        
        // Update overall progress if element exists
        const overallElement = document.getElementById('overall-progress');
        if (overallElement) {
            const overall = this.getOverallProgress();
            overallElement.textContent = `${overall}%`;
        }
        
        // Update recent activity
        this.updateRecentActivity();
    }
    
    updateRecentActivity() {
        const activityList = document.querySelector('.activity-list');
        if (!activityList || !this.progress.quizzes || this.progress.quizzes.length === 0) {
            return;
        }
        
        // Sort quizzes by date (most recent first)
        const recentQuizzes = [...this.progress.quizzes]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);
        
        // Clear existing activity items
        activityList.innerHTML = '';
        
        // Add recent quizzes to activity list
        recentQuizzes.forEach(quiz => {
            const date = new Date(quiz.date);
            const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';
            
            let icon = '';
            switch(quiz.type) {
                case 'vocabulary':
                    icon = '<i class="fas fa-book"></i>';
                    break;
                case 'grammar':
                    icon = '<i class="fas fa-pencil-alt"></i>';
                    break;
                case 'listening':
                    icon = '<i class="fas fa-headphones"></i>';
                    break;
                case 'citizenship':
                    icon = '<i class="fas fa-flag"></i>';
                    break;
                default:
                    icon = '<i class="fas fa-check-circle"></i>';
            }
            
            activityItem.innerHTML = `
                ${icon}
                <div class="activity-details">
                    <div class="activity-title">${this.capitalizeFirstLetter(quiz.type)} Quiz (${quiz.level})</div>
                    <div class="activity-time">${formattedDate}</div>
                </div>
                <div class="activity-score">${quiz.percentage}%</div>
            `;
            
            activityList.appendChild(activityItem);
        });
    }
    
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    updateStreak() {
        if (!this.progress.lastLogin) {
            this.progress.streak = 1;
            this.progress.lastLogin = new Date().toISOString();
            this.saveProgress();
            return;
        }
        
        const today = new Date();
        const lastLogin = new Date(this.progress.lastLogin);
        
        // Reset time part to compare dates only
        today.setHours(0, 0, 0, 0);
        lastLogin.setHours(0, 0, 0, 0);
        
        // Calculate difference in days
        const diffTime = Math.abs(today - lastLogin);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
            // Consecutive day, increase streak
            this.progress.streak += 1;
        } else if (diffDays > 1) {
            // Streak broken, reset to 1
            this.progress.streak = 1;
        }
        // If diffDays is 0, user already logged in today, don't change streak
        
        this.progress.lastLogin = new Date().toISOString();
        this.saveProgress();
    }
    
    updateFlashcardProgress(category, index, total) {
        // Calculate vocabulary progress based on flashcards viewed
        const totalFlashcards = total || 100; // Default to 100 if total not provided
        const newProgress = Math.min(Math.round((index / totalFlashcards) * 100), 100);
        
        if (newProgress > this.progress.vocabulary) {
            this.progress.vocabulary = newProgress;
            this.progress.lastActivity = {
                type: 'flashcard',
                category: category,
                date: new Date().toISOString()
            };
            this.progress.totalLessonsCompleted += 1;
            this.saveProgress();
            this.updateProgressUI();
        }
    }
    
    updateGrammarProgress(completed, total) {
        // Calculate grammar progress
        const newProgress = Math.min(Math.round((completed / total) * 100), 100);
        
        if (newProgress > this.progress.grammar) {
            this.progress.grammar = newProgress;
            this.progress.lastActivity = {
                type: 'grammar',
                date: new Date().toISOString()
            };
            this.progress.totalLessonsCompleted += 1;
            this.saveProgress();
            this.updateProgressUI();
        }
    }
    
    updateListeningProgress(completed, total) {
        // Calculate listening progress
        const newProgress = Math.min(Math.round((completed / total) * 100), 100);
        
        if (newProgress > this.progress.listening) {
            this.progress.listening = newProgress;
            this.progress.lastActivity = {
                type: 'listening',
                date: new Date().toISOString()
            };
            this.progress.totalLessonsCompleted += 1;
            this.saveProgress();
            this.updateProgressUI();
        }
    }
    
    updateCitizenshipProgress(completed, total) {
        // Calculate citizenship progress
        const newProgress = Math.min(Math.round((completed / total) * 100), 100);
        
        if (!this.progress.citizenship || newProgress > this.progress.citizenship) {
            this.progress.citizenship = newProgress;
            this.progress.lastActivity = {
                type: 'citizenship',
                date: new Date().toISOString()
            };
            this.progress.totalLessonsCompleted += 1;
            this.saveProgress();
            this.updateProgressUI();
        }
    }
    
    saveQuizResult(quizResult) {
        // Add quiz result to history
        if (!this.progress.quizzes) {
            this.progress.quizzes = [];
        }
        
        this.progress.quizzes.push(quizResult);
        
        // Limit quiz history to last 50 quizzes
        if (this.progress.quizzes.length > 50) {
            this.progress.quizzes = this.progress.quizzes.slice(-50);
        }
        
        // Update relevant progress based on quiz type
        switch (quizResult.type) {
            case 'vocabulary':
                this.updateVocabularyFromQuiz(quizResult);
                break;
            case 'grammar':
                this.updateGrammarFromQuiz(quizResult);
                break;
            case 'listening':
                this.updateListeningFromQuiz(quizResult);
                break;
            case 'citizenship':
                this.updateCitizenshipFromQuiz(quizResult);
                break;
        }
        
        // Update last activity
        this.progress.lastActivity = {
            type: 'quiz',
            quizType: quizResult.type,
            score: quizResult.percentage,
            date: new Date().toISOString()
        };
        
        this.progress.totalLessonsCompleted += 1;
        this.saveProgress();
        this.updateProgressUI();
    }
    
    updateVocabularyFromQuiz(quizResult) {
        // Update vocabulary progress based on quiz performance
        // Only update if the new score would increase progress
        const potentialProgress = Math.min(
            this.progress.vocabulary + Math.round((quizResult.percentage / 100) * 10),
            100
        );
        
        if (potentialProgress > this.progress.vocabulary) {
            this.progress.vocabulary = potentialProgress;
        }
    }
    
    updateGrammarFromQuiz(quizResult) {
        // Update grammar progress based on quiz performance
        const potentialProgress = Math.min(
            this.progress.grammar + Math.round((quizResult.percentage / 100) * 10),
            100
        );
        
        if (potentialProgress > this.progress.grammar) {
            this.progress.grammar = potentialProgress;
        }
    }
    
    updateListeningFromQuiz(quizResult) {
        // Update listening progress based on quiz performance
        const potentialProgress = Math.min(
            this.progress.listening + Math.round((quizResult.percentage / 100) * 10),
            100
        );
        
        if (potentialProgress > this.progress.listening) {
            this.progress.listening = potentialProgress;
        }
    }
    
    updateCitizenshipFromQuiz(quizResult) {
        // Update citizenship progress based on quiz performance
        const potentialProgress = Math.min(
            (this.progress.citizenship || 0) + Math.round((quizResult.percentage / 100) * 10),
            100
        );
        
        if (!this.progress.citizenship || potentialProgress > this.progress.citizenship) {
            this.progress.citizenship = potentialProgress;
        }
    }
    
    async saveProgress() {
        if (this.authManager && this.authManager.getCurrentUser()) {
            await this.authManager.saveProgress(this.progress);
        } else {
            // Save to localStorage as fallback when user is not logged in
            localStorage.setItem('progress', JSON.stringify(this.progress));
        }
    }
    
    getOverallProgress() {
        // Calculate overall progress as average of all categories
        const categories = [
            this.progress.vocabulary || 0,
            this.progress.grammar || 0,
            this.progress.listening || 0,
            this.progress.citizenship || 0
        ];
        
        const sum = categories.reduce((total, current) => total + current, 0);
        return Math.round(sum / categories.length);
    }
    
    getQuizAverage() {
        if (!this.progress.quizzes || this.progress.quizzes.length === 0) {
            return 0;
        }
        
        const sum = this.progress.quizzes.reduce((total, quiz) => total + quiz.percentage, 0);
        return Math.round(sum / this.progress.quizzes.length);
    }
    
    getStreak() {
        return this.progress.streak || 0;
    }
    
    getTotalLessonsCompleted() {
        return this.progress.totalLessonsCompleted || 0;
    }
    
    resetProgress() {
        this.progress = {
            vocabulary: 0,
            grammar: 0,
            listening: 0,
            citizenship: 0,
            quizzes: [],
            lastActivity: null,
            totalLessonsCompleted: 0,
            streak: 0,
            lastLogin: new Date().toISOString()
        };
        
        this.saveProgress();
        this.updateProgressUI();
    }
}
