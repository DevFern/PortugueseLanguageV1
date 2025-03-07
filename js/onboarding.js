/**
 * Onboarding Tips System
 * Shows helpful tips for new users on their first visit
 */
function showOnboardingTips() {
  // Check if user has seen tips
  if (localStorage.getItem('onboardingComplete')) return;
  
  // Show tips after a short delay
  setTimeout(() => {
    const tips = [
      { 
        selector: '.flashcard', 
        text: 'Click or tap to flip the card and see the translation' 
      },
      { 
        selector: '#next-card', 
        text: 'Navigate to the next word' 
      },
      { 
        selector: '.level-btn', 
        text: 'Change difficulty level' 
      },
      {
        selector: '.quiz-type-btn',
        text: 'Try different types of quizzes'
      }
    ];
    
    tips.forEach(tip => {
      const element = document.querySelector(tip.selector);
      if (!element) return;
      
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.textContent = tip.text;
      
      element.style.position = 'relative';
      element.appendChild(tooltip);
      
      // Remove after 5 seconds
      setTimeout(() => {
        tooltip.remove();
      }, 5000);
    });
    
    // Show keyboard shortcuts tip
    const shortcutTip = document.createElement('div');
    shortcutTip.className = 'keyboard-shortcuts-tip';
    shortcutTip.innerHTML = `
      <div class="tip-header">
        <h4>Keyboard Shortcuts</h4>
        <button class="close-tip">×</button>
      </div>
      <ul>
        <li><strong>←/→</strong>: Previous/Next flashcard</li>
        <li><strong>Space</strong>: Flip flashcard</li>
        <li><strong>1-4</strong>: Select quiz options</li>
        <li><strong>Enter</strong>: Submit answer</li>
      </ul>
    `;
    
    document.body.appendChild(shortcutTip);
    
    // Close button functionality
    const closeButton = shortcutTip.querySelector('.close-tip');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        shortcutTip.remove();
      });
    }
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (shortcutTip.parentNode) {
        shortcutTip.remove();
      }
    }, 10000);
    
    // Mark onboarding as complete
    localStorage.setItem('onboardingComplete', 'true');
  }, 2000);
}

// Add keyboard shortcuts tip styles
const style = document.createElement('style');
style.textContent = `
  .keyboard-shortcuts-tip {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #3498db;
    color: white;
    padding: 15px;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    z-index: 1000;
    max-width: 300px;
  }
  
  .tip-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .tip-header h4 {
    margin: 0;
  }
  
  .close-tip {
    background: none;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
  }
  
  .keyboard-shortcuts-tip ul {
    margin: 0;
    padding-left: 20px;
  }
  
  .keyboard-shortcuts-tip li {
    margin-bottom: 5px;
  }
`;
document.head.appendChild(style);

// Run when page loads
window.addEventListener('load', showOnboardingTips);
