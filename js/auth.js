class AuthManager {
  constructor() {
    this.currentUser = null;
    this.listeners = [];
    
    // Check if user is already logged in
    this.loadUserFromStorage();
  }
  
  loadUserFromStorage() {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        this.currentUser = JSON.parse(userData);
      } catch (e) {
        console.error('Error parsing user data:', e);
        this.currentUser = null;
      }
    }
  }
  
  getCurrentUser() {
    return this.currentUser;
  }
  
  async signIn(email, password) {
    // Simple validation
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    // In a real app, you would validate against a server
    // For now, we'll just simulate a successful login
    this.currentUser = {
      email: email,
      displayName: email.split('@')[0],
      uid: 'local-' + Date.now()
    };
    
    // Save to localStorage
    localStorage.setItem('user', JSON.stringify(this.currentUser));
    
    // Notify listeners
    this.notifyAuthStateChanged();
    
    return this.currentUser;
  }
  
  async signUp(email, password, displayName) {
    // Simple validation
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    // Create a new user
    this.currentUser = {
      email: email,
      displayName: displayName || email.split('@')[0],
      uid: 'local-' + Date.now()
    };
    
    // Save to localStorage
    localStorage.setItem('user', JSON.stringify(this.currentUser));
    
    // Initialize empty progress
    const emptyProgress = {
      vocabulary: 0,
      grammar: 0,
      listening: 0,
      quizzes: [],
      lastActivity: null,
      totalLessonsCompleted: 0,
      streak: 1,
      lastLogin: new Date().toISOString()
    };
    
    localStorage.setItem('progress', JSON.stringify(emptyProgress));
    
    // Notify listeners
    this.notifyAuthStateChanged();
    
    return this.currentUser;
  }
  
  async signOut() {
    this.currentUser = null;
    localStorage.removeItem('user');
    
    // Notify listeners
    this.notifyAuthStateChanged();
  }
  
  onAuthStateChanged(callback) {
    if (typeof callback === 'function') {
      this.listeners.push(callback);
      
      // Call immediately with current state
      callback(this.currentUser);
    }
    
    return () => {
      // Return function to unsubscribe
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }
  
  notifyAuthStateChanged() {
    this.listeners.forEach(callback => {
      try {
        callback(this.currentUser);
      } catch (e) {
        console.error('Error in auth state change listener:', e);
      }
    });
  }
}
