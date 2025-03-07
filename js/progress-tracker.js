class ProgressTracker {
  constructor() {
    this.progress = {
      vocabulary: 0,
      grammar: 0,
      listening: 0,
      citizenship: 0, // Added citizenship progress
      quizzes: [],
      lastActivity: null,
      totalLessonsCompleted: 0,
      streak: 1,
      longestStreak: 1, // Added longest streak tracking
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
        
        // Ensure citizenship property exists (for backward compatibility)
        if (typeof this.progress.citizenship === 'undefined') {
          this.progress.citizenship = 0;
        }
        
        // Ensure longestStreak property exists
        if (typeof this.progress.longestStreak === 'undefined') {
          this.progress.longestStreak = this.progress.streak || 1;
        }
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
      citizenship: 0,
      quizzes: [],
      lastActivity: null,
      totalLessonsCompleted: 0,
      streak: 1,
      longestStreak: 1,
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
    // Update progress bars in dashboard
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
    
    // Update progress bars in progress section
    const vocabularyProgressBar = document.getElementById('vocabulary-progress');
    const grammarProgressBar = document.getElementById('grammar-progress');
    const listeningProgressBar = document.getElementById('listening-progress');
    const citizenshipProgressBar = document.getElementById('citizenship-progress');
    
    if (vocabularyProgressBar) {
      vocabularyProgressBar.style.width = `${this.progress.vocabulary}%`;
      vocabularyProgressBar.setAttribute('aria-valuenow', this.progress.vocabulary);
    }
    
    if (grammarProgressBar) {
      grammarProgressBar.style.width = `${this.progress.grammar}%`;
      grammarProgressBar.setAttribute('aria-valuenow', this.progress.grammar);
    }
    
    if (listeningProgressBar) {
      listeningProgressBar.style.width = `${this.progress.listening}%`;
      listeningProgressBar.setAttribute('aria-valuenow', this.progress.listening);
    }
    
    if (citizenshipProgressBar) {
      citizenshipProgressBar.style.width = `${this.progress.citizenship}%`;
      citizenshipProgressBar.setAttribute('aria-valuenow', this.progress.citizenship);
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
    
    // Update streak in progress section
    const currentStreakElement = document.getElementById('current-streak');
    const longestStreakElement = document.getElementById('longest-streak');
    
    if (currentStreakElement) {
      currentStreakElement.textContent = this.progress.streak;
    }
    
    if (longestStreakElement) {
      longestStreakElement.textContent = this.progress.longestStreak;
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
    
    // Update quiz history table
    this.updateQuizHistory();
    
    // Update streak calendar
    this.updateStreakCalendar();
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
  
  updateQuizHistory() {
    const quizHistoryBody = document.getElementById('quiz-history-body');
    const emptyQuizHistory = document.getElementById('empty-quiz-history');
    
    if (!quizHistoryBody) return;
    
    // Clear existing rows
    quizHistoryBody.innerHTML = '';
    
    if (!this.progress.quizzes || this.progress.quizzes.length === 0) {
      if (emptyQuizHistory) {
        emptyQuizHistory.style.display = 'block';
      }
      return;
    }
    
    if (emptyQuizHistory) {
      emptyQuizHistory.style.display = 'none';
    }
    
    // Sort quizzes by date (most recent first)
    const sortedQuizzes = [...this.progress.quizzes]
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Add rows to table
    sortedQuizzes.forEach(quiz => {
      const date = new Date(quiz.date);
      const formattedDate = date.toLocaleDateString();
      
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${formattedDate}</td>
        <td>${this.capitalizeFirstLetter(quiz.type)}</td>
        <td>${this.capitalizeFirstLetter(quiz.level)}</td>
        <td>${quiz.percentage}%</td>
      `;
      
      quizHistoryBody.appendChild(row);
    });
  }
  
  updateStreakCalendar() {
    const calendarGrid = document.getElementById('streak-calendar');
    if (!calendarGrid) return;
    
    // Clear existing calendar
    calendarGrid.innerHTML = '';
    
    // Create calendar for current month
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Get first day of month and total days
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Create day labels
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayLabels.forEach(day => {
      const dayLabel = document.createElement('div');
      dayLabel.className = 'calendar-day-label';
      dayLabel.textContent = day;
      calendarGrid.appendChild(dayLabel);
    });
    
    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDay; i++) {
      const emptyDay = document.createElement('div');
      emptyDay.className = 'calendar-day empty';
      calendarGrid.appendChild(emptyDay);
    }
    
    // Add days of month
    for (let i = 1; i <= daysInMonth; i++) {
      const day = document.createElement('div');
      day.className = 'calendar-day';
      
      // Check if this day has activity
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const hasActivity = this.checkDateHasActivity(dateStr);
      
      if (hasActivity) {
        day.classList.add('active-day');
      }
      
      // Mark today
      if (i === today.getDate()) {
        day.classList.add('today');
      }
      
      day.textContent = i;
      calendarGrid.appendChild(day);
    }
  }
  
  checkDateHasActivity(dateStr) {
    if (!this.progress.quizzes || this.progress.quizzes.length === 0) {
      return false;
    }
    
    return this.progress.quizzes.some(quiz => {
      const quizDate = new Date(quiz.date);
      return quizDate.toISOString().substring(0, 10) === dateStr;
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
      this.progress.longestStreak = 1;
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
      
      // Update longest streak if current streak is longer
      if (this.progress.streak > this.progress.longestStreak) {
        this.progress.longestStreak = this.progress.streak;
      }
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
  
  updateCitizenshipProgress(completed, total) {
    const newProgress = Math.min(Math.round((completed / total) * 100), 100);
    
    if (newProgress > this.progress.citizenship) {
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
  
  updateCitizenshipFromQuiz(quizResult) {
    const potentialProgress = Math.min(
      this.progress.citizenship + Math.round((quizResult.percentage / 100) * 10),
      100
    );
    
    if (potentialProgress > this.progress.citizenship) {
      this.progress.citizenship = potentialProgress;
    }
  }
  
  capitalizeFirstLetter(string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}
