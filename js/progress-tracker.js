class ProgressTracker {
  constructor() {
    this.progress = {
      vocabulary: 0,
      grammar: 0,
      listening: 0,
      quizzes: [],
      lastActivity: null,
      totalLessonsCompleted: 0,
      streak: 1,
      lastLogin: new Date().toISOString()
    };
    this.authManager = null;
  }
  
  init(authManager) {
    this.authManager = authManager;
    this.loadProgress();
    this.updateProgressUI();
    this.updateStreak();
    
    // Set up daily check for streak
    this.checkDailyStreak();
  }
  
  loadProgress() {
    const savedProgress = localStorage.getItem('progress');
    if (savedProgress) {
      try {
        this.progress = JSON.parse(savedProgress);
      } catch (e) {
        console.error('Error parsing progress data:', e);
        // Initialize with default values
        this.initializeDefaultProgress();
      }
    } else {
      // Initialize with default values
      this.initializeDefaultProgress();
    }
  }
  
  initializeDefaultProgress() {
    this.progress = {
      vocabulary: 0,
      grammar: 0,
      listening: 0,
      quizzes: [],
      lastActivity: null,
      totalLessonsCompleted: 0,
      streak: 1,
      lastLogin: new Date().toISOString()
    };
    this.saveProgress();
  }
  
  saveProgress() {
    localStorage.setItem('progress', JSON.stringify(this.progress));
  }
  
  checkDailyStreak() {
    const now = new Date();
    const lastCheck = localStorage.getItem('lastStreakCheck');
    
    if (!lastCheck || new Date(lastCheck).getDate() !== now.getDate()) {
      this.updateStreak();
      localStorage.setItem('lastStreakCheck', now.toISOString());
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
    
    // Update recent activity
    this.updateRecentActivity();
  }
  
  updateRecentActivity() {
    const activityList = document.querySelector('.activity-list');
    if (!activityList) return;
    
    // Clear existing activity items
    activityList.innerHTML = '';
    
    if (!this.progress.quizzes || this.progress.quizzes.length === 0) {
      activityList.innerHTML = `
        <div class="empty-activity">
          <p>No recent activity. Start learning to see your progress!</p>
        </div>
      `;
      return;
    }
    
    // Sort quizzes by date (most recent first)
    const recentQuizzes = [...this.progress.quizzes]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
    
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
  
  getQuizAverage() {
    if (!this.progress.quizzes || this.progress.quizzes.length === 0) {
      return 0;
    }
    
    const sum = this.progress.quizzes.reduce((total, quiz) => total + quiz.percentage, 0);
    return Math.round(sum / this.progress.quizzes.length);
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
  
  updateGrammarProgress(completed, total) {
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
  
  updateVocabularyFromQuiz(quizResult) {
    const potentialProgress = Math.min(
      this.progress.vocabulary + Math.round((quizResult.percentage / 100) * 10),
      100
    );
    
    if (potentialProgress > this.progress.vocabulary) {
      this.progress.vocabulary = potentialProgress;
    }
  }
  
  updateGrammarFromQuiz(quizResult) {
    const potentialProgress = Math.min(
      this.progress.grammar + Math.round((quizResult.percentage / 100) * 10),
      100
    );
    
    if (potentialProgress > this.progress.grammar) {
      this.progress.grammar = potentialProgress;
    }
  }
  
  updateListeningFromQuiz(quizResult) {
    const potentialProgress = Math.min(
      this.progress.listening + Math.round((quizResult.percentage / 100) * 10),
      100
    );
    
    if (potentialProgress > this.progress.listening) {
      this.progress.listening = potentialProgress;
    }
  }
  
  capitalizeFirstLetter(string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}
