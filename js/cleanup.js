// Clean Navigation and Theme Management

// Global functions
function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  if (sidebar) {
    sidebar.classList.toggle('active');
  }
}

function toggleSettings() {
  const settingsPanel = document.getElementById('settingsPanel');
  if (settingsPanel) {
    settingsPanel.classList.toggle('active');
  }
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  document.body.appendChild(notification);
  
  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

function setTheme(theme) {
  if (window.ThemeManager) {
    window.ThemeManager.applyTheme(theme, 'user');
  }
}

// Close settings when clicking outside
document.addEventListener('click', function(event) {
  const settingsPanel = document.getElementById('settingsPanel');
  const settingsButton = document.querySelector('.settings-toggle');
  
  if (settingsPanel && settingsButton && 
      !settingsPanel.contains(event.target) && 
      !settingsButton.contains(event.target)) {
    settingsPanel.classList.remove('active');
  }
});

// Set active nav link based on current page
document.addEventListener('DOMContentLoaded', function() {
  // Get current page name
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  // Update active state for nav links
  const navLinks = document.querySelectorAll('.nav-link');
  if (navLinks.length > 0) {
    navLinks.forEach(link => {
      const linkHref = link.getAttribute('href');
      if (linkHref === currentPage || 
          (currentPage === 'index.html' && linkHref === './index.html') ||
          (currentPage === '' && linkHref === './index.html')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
  
  // Theme management with fallback
  const applyTheme = (theme = 'default') => {
    // Remove all theme classes
    document.body.className = document.body.className
      .split(' ')
      .filter(cls => !cls.startsWith('theme-'))
      .join(' ');
      
    // Add current theme class
    document.body.classList.add(`theme-${theme}`);
    
    // Set data-theme attribute for CSS variables
    document.documentElement.setAttribute('data-theme', theme);
  };
  
  // Try to use ThemeManager if available
  if (window.ThemeManager && typeof window.ThemeManager.getCurrentTheme === 'function') {
    try {
      const savedTheme = window.ThemeManager.getCurrentTheme();
      applyTheme(savedTheme);
      
      // Listen for theme changes
      document.addEventListener('themeChanged', (e) => {
        const { theme } = e.detail || {};
        if (theme) {
          applyTheme(theme);
        }
      });
    } catch (e) {
      console.warn('Error initializing theme manager, using default theme', e);
      applyTheme('default');
    }
  } else {
    // Fallback to default theme if ThemeManager is not available
    console.warn('ThemeManager not found, using default theme');
    applyTheme('default');
  }
});

// Safe localStorage wrapper
const storage = {
  get: function(key, defaultValue = '') {
    try {
      return localStorage.getItem(key) || defaultValue;
    } catch (e) {
      console.warn('localStorage is not available, using default value');
      return defaultValue;
    }
  },
  set: function(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
  }
};

// Admin section visibility
(function(){
  try {
    const adminEmail = 'krfuchs11@icloud.com';
    const userEmail = storage.get('userEmail', '');
    const adminSection = document.getElementById('adminSection');
    
    if (adminSection) {
      if (userEmail && userEmail.toLowerCase() === adminEmail.toLowerCase()) {
        adminSection.style.display = 'block';
      } else {
        adminSection.style.display = 'none';
      }
    }
  } catch (e) {
    console.error('Error in admin section initialization:', e);
  }
})();

// Fallback for theme management
if (typeof window.ThemeManager === 'undefined') {
  console.warn('ThemeManager not found, using default theme');
  document.documentElement.setAttribute('data-theme', 'default');
}
