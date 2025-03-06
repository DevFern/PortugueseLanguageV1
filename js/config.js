// config.js - Replace Firebase with localStorage implementation
const appConfig = {
  appName: "Portuguese A2 Learning",
  version: "1.0.0",
  useLocalStorage: true
};

// LocalStorage-based auth and data management
class LocalStorageManager {
  constructor() {
    this.initialize();
  }
  
  initialize() {
    // Create default data structure if it doesn't exist
    if (!localStorage.getItem('userData')) {
      localStorage.setItem('userData', JSON.stringify({
        isLoggedIn: false,
        user: null,
        progress: {
          vocabulary: 0,
          grammar: 0,
          listening: 0,
          quizzes: [],
          lastActivity: null,
          totalLessonsCompleted: 0,
          streak: 0,
          lastLogin: new Date().toISOString()
        }
      }));
    }
  }
  
  getUserData() {
    return JSON.parse(localStorage.getItem('userData') || '{}');
  }
  
  saveUserData(data) {
    localStorage.setItem('userData', JSON.stringify(data));
  }
  
  isLoggedIn() {
    const userData = this.getUserData();
    return userData.isLoggedIn || false;
  }
  
  getCurrentUser() {
    const userData = this.getUserData();
    return userData.isLoggedIn ? userData.user : null;
  }
  
  getProgress() {
    const userData = this.getUserData();
    return userData.progress || {};
  }
  
  saveProgress(progress) {
    const userData = this.getUserData();
    userData.progress = progress;
    this.saveUserData(userData);
  }
}

// Create global instance
const storageManager = new LocalStorageManager();
