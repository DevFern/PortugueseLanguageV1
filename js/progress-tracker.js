// progress-tracker.js - Simplified progress tracking with localStorage
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
      lastLogin: new Date().toISOString()
    };
  }
  
  init(authManager) {
    this.authManager = authManager;
    this.loadProgress();
    this.updateProgressUI();
    this.updateStreak();
  }
  
  loadProgress() {
    // Try to load from localStorage
    const savedProgress = localStorage.getItem('progress');
    if (savedProgress) {
      try {
        this.progress = JSON.parse(savedProgress);
      } catch (e) {
        console.error('Error parsing progress data:', e);
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
    
    // Update percentage displays
    const vocabPercentage = document.getElementById('vocab-percentage');
    const grammarPercentage = document.getElementById('grammar-percentage');
    const listeningPercentage = document.getElementById('listening-percentage');
    
    if (vocabPercentage) vocabPercentage.textContent = this.progress.vocabulary;
    if (grammarPercentage) grammarPercentage.textContent = this.progress.grammar;
    if (listeningPercentage) listeningPercentage.textContent = this.progress.listening;
    
    // Update streak display
    const streakElement = document.getElementById('streak-count');
    if (streakElement) {
      streakElement.textContent = this.progress.streak;
    }
    
    // Update total lessons completed
    const lessonsElement = document.getElementById('lessons-completed');
    if (lessonsElement) {
      lessonsElement.textContent = this.progress.totalLessonsCompleted;
    }
    
    // Update quiz average
    const quizAverage = document.getElementById('quiz-average');
    if (quizAverage) {
      const average = this.getQuizAverage();
      quizAverage.textContent = `${average}%`;
    }
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
    
    this.progress.lastLogin = new Date().toISOString();
    this.saveProgress();
  }
  
  updateFlashcardProgress(category, index, total) {
    const totalFlashcards = total || 100;
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
  
  saveQuizResult(quizResult) {
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
    }
    
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
  
  saveProgress() {
    localStorage.setItem('progress', JSON.stringify(this.progress));
  }
  
  getQuizAverage() {
    if (!this.progress.quizzes || this.progress.quizzes.length === 0) {
      return 0;
    }
    
    const sum = this.progress.quizzes.reduce((total, quiz) => total + quiz.percentage, 0);
    return Math.round(sum / this.progress.quizzes.length);
  }
}
