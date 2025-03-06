// config.js - Client-side configuration
const appConfig = {
  appName: "Portuguese A2 Learning",
  version: "1.0.0",
  useLocalStorage: true
};

// Mock Firebase for compatibility with existing code
const firebase = {
  initializeApp: function() {
    console.log('Using localStorage instead of Firebase');
    return {
      auth: function() {
        return {
          onAuthStateChanged: function(callback) {
            const userData = localStorage.getItem('user');
            if (userData) {
              try {
                callback(JSON.parse(userData));
              } catch (e) {
                console.error('Error parsing user data:', e);
                callback(null);
              }
            } else {
              callback(null);
            }
            return function() {}; // Unsubscribe function
          },
          signInWithEmailAndPassword: function(email, password) {
            return new Promise((resolve) => {
              const user = {
                email: email,
                displayName: email.split('@')[0],
                uid: 'local-' + Date.now()
              };
              localStorage.setItem('user', JSON.stringify(user));
              resolve({ user });
            });
          },
          createUserWithEmailAndPassword: function(email, password) {
            return new Promise((resolve) => {
              const user = {
                email: email,
                displayName: email.split('@')[0],
                uid: 'local-' + Date.now()
              };
              localStorage.setItem('user', JSON.stringify(user));
              resolve({ user });
            });
          },
          signOut: function() {
            return new Promise((resolve) => {
              localStorage.removeItem('user');
              resolve();
            });
          }
        };
      }
    };
  }
};

// Initialize mock Firebase
const firebaseConfig = {
  apiKey: "PLACEHOLDER",
  authDomain: "placeholder.firebaseapp.com",
  projectId: "placeholder",
  storageBucket: "placeholder.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:0000000000000000000000"
};

firebase.initializeApp(firebaseConfig);
