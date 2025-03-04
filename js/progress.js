class ProgressTracker {
    constructor() {
        this.progress = {
            vocabulary: 0,
            grammar: 0,
            listening: 0,
            quizzes: []
        };
        this.isInitialized = false;
    }
    
    init() {
        this.loadProgress();
        this.updateProgressUI();
    }
    
    async loadProgress() {
        if (window.authManager && window.authManager.getCurrentUser()) {
            const progress = await window.authManager.getProgress();
            if (progress) {
                this.progress = progress;
                this.isInitialized = true;
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
        }
        
        if (grammarProgress) {
            grammarProgress.style.width = `${this.progress.grammar}%`;
        }
        
        if (listeningProgress) {
            listeningProgress.style.width = `${this.progress.listening}%`;
        }
    }
    
    updateFlashcardProgress(category, index) {
        // Calculate vocabulary progress based on flashcards viewed
        const totalFlashcards = 100; // Assuming 100 total flashcards
        const newProgress = Math.min(Math.round((index / totalFlashcards) * 100), 100);
        
        if (newProgress > this.progress.vocabulary) {
            this.progress.vocabulary = newProgress;
            this.saveProgress();
            this.updateProgressUI();
        }
    }
    
    updateGrammarProgress(completed, total) {
        // Calculate grammar progress
        const newProgress = Math.min(Math.round((completed / total) * 100), 100);
        
        if (newProgress > this.progress.grammar) {
            this.progress.grammar = newProgress;
            this.saveProgress();
            this.updateProgressUI();
        }
    }
    
    updateListeningProgress(completed, total) {
        // Calculate listening progress
        const newProgress = Math.min(Math.round((completed / total) * 100), 100);
        
        if (newProgress > this.progress.listening) {
            this.progress.listening = newProgress;
            this.saveProgress();
            this.updateProgressUI();
        }
    }
    
    saveQuizResult(quizResult) {
        // Add quiz result to history
        this.progress.quizzes.push(quizResult);
        
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
        }
        
        this.saveProgress();
    }
    
    updateVocabularyFromQuiz(quizResult) {
        // Update vocabulary progress based on quiz performance
        const newProgress = Math.min(
            this.progress.vocabulary + Math.round((quizResult.percentage / 100) * 10),
            100
        );
        
        if (newProgress > this.progress.vocabulary) {
            this.progress.vocabulary =
