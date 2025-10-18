// 🌈 THEME MANAGER - Centralized Theme Management

// ==========================
// 1. Theme Definitions
// ==========================
window.themes = {
  // Standard Themes
  red: { 
    name: 'Red', 
    accent: '#ff1a1a', 
    light: '#ff6666', 
    dark: '#660000',
    type: 'standard'
  },
  yellow: { 
    name: 'Yellow', 
    accent: '#ffcc00', 
    light: '#ffee66', 
    dark: '#b38f00',
    type: 'standard'
  },
  green: { 
    name: 'Green', 
    accent: '#00cc66', 
    light: '#66ff99', 
    dark: '#008040',
    type: 'standard'
  },
  blue: { 
    name: 'Blue', 
    accent: '#3366ff', 
    light: '#6699ff', 
    dark: '#0033cc',
    type: 'standard'
  },
  
  // Brosquad Exclusive Themes
  'brosquad-neon': { 
    name: 'Neon Green', 
    accent: '#00ff9d', 
    light: '#80ffce', 
    dark: '#00b36b',
    type: 'brosquad'
  },
  'brosquad-purple': {
    name: 'Electric Purple',
    accent: '#b026ff',
    light: '#d580ff',
    dark: '#7a00cc',
    type: 'brosquad'
  },
  'brosquad-cyan': {
    name: 'Cyan',
    accent: '#00f7ff',
    light: '#80fbff',
    dark: '#00b3b8',
    type: 'brosquad'
  }
};

// ==========================
// 2. Theme Application
// ==========================
function applyTheme(themeName, source = 'local') {
  const theme = window.themes[themeName] || window.themes.blue;
  const root = document.documentElement;
  
  // Add transition class for smooth color changes
  root.classList.add('theme-transition');
  
  // Set theme colors as CSS custom properties
  root.style.setProperty('--accent', theme.accent);
  root.style.setProperty('--accent-light', theme.light);
  root.style.setProperty('--accent-dark', theme.dark);
  root.style.setProperty('--accent-rgb', hexToRgb(theme.accent));
  
  // Save to localStorage if this is a local change
  if (source === 'local') {
    try {
      localStorage.setItem('theme', themeName);
      localStorage.setItem('themeTimestamp', Date.now());
      broadcastThemeChange(themeName);
    } catch (e) {
      console.error('Error saving theme:', e);
    }
  }
  
  // Remove transition class after animation completes
  setTimeout(() => {
    root.classList.remove('theme-transition');
  }, 300);
}

// ==========================
// 3. Helper Functions
// ==========================
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? 
    `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
    '51, 102, 255'; // Default to blue if invalid
}

function broadcastThemeChange(themeName) {
  try {
    if (window.BroadcastChannel) {
      const channel = new BroadcastChannel('theme_channel');
      channel.postMessage({
        type: 'THEME_CHANGE',
        theme: themeName,
        timestamp: Date.now()
      });
      setTimeout(() => channel.close(), 100);
    }
  } catch (e) {
    console.error('Error broadcasting theme change:', e);
  }
}

// ==========================
// 4. Theme Management API
// ==========================
function getCurrentTheme() {
  return localStorage.getItem('theme') || 'blue';
}

function getThemes() {
  return Object.keys(window.themes);
}

function changeTheme(themeName) {
  if (window.themes[themeName]) {
    applyTheme(themeName, 'local');
    // Dispatch event for other scripts
    document.dispatchEvent(new CustomEvent('themeChanged', {
      detail: {
        theme: themeName,
        themeData: window.themes[themeName]
      }
    }));
  }
}

// ==========================
// 5. Cross-tab Communication
// ==========================
function setupCrossTabListener() {
  if (window.BroadcastChannel) {
    const channel = new BroadcastChannel('theme_channel');
    channel.onmessage = (e) => {
      if (e.data && e.data.type === 'THEME_CHANGE') {
        // Only apply if the message is from another tab
        if (e.data.timestamp > (parseInt(localStorage.getItem('themeTimestamp') || 0))) {
          applyTheme(e.data.theme, 'remote');
        }
      }
    };
  }
}

// ==========================
// 6. Initialization
// ==========================
function initializeThemeManager() {
  // Set up cross-tab communication
  setupCrossTabListener();
  
  // Apply saved theme or default
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme && window.themes[savedTheme]) {
    applyTheme(savedTheme, 'local');
  } else {
    applyTheme('blue', 'local');
  }
  
  // Expose public API
  window.ThemeManager = {
    changeTheme,
    getCurrentTheme,
    getThemes,
    init: initializeThemeManager
  };
  
  return window.ThemeManager;
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeThemeManager);
} else {
  // In case the document is already loaded
  setTimeout(initializeThemeManager, 0);
}
