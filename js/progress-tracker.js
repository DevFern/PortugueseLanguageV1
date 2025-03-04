class ProgressTracker {
    constructor() {
        this.progress = {
            vocabulary: 0,
            grammar: 0,
            listening: 0,
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
                this.isInitialized = true;
            } else {
                // Initialize with default values if no progress exists
                this.progress.lastLogin = new Date().toISOString();
                this.saveProgress();
            }
        } else {
            // Try to load from localStorage if not logged in
            const savedProgress = localStorage.getItem('progress');
            if (savedProgress) {
                try {
                    this.progress = JSON.parse(savedProgress);
                    this.isInitialized = true;
                } catch (e) {
                    console.error('Error parsing progress data:', e);
                }
            }
        }
    }
    
    updateProgressUI() {
        // Update progress bars
        const vocabProgress = document.getElementById('vocab-progress');
        const grammarProgress = document.getElementById('grammar-progress');
        const listeningProgress = document.getElementById('listening-progress');
        
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
            activityItem.className =
