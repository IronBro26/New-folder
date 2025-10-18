// ==========================
// THEME MANAGER (With Smooth Transitions)
// ==========================
(function () {
  // 1. Theme Definitions
  const themeDefinitions = {
    red: { accent: '#ff1a1a', light: '#ff6666', dark: '#660000' },
    yellow: { accent: '#d4aa00ff', light: '#fde31aff', dark: '#b38f00' },
    green: { accent: '#00cc66', light: '#66ff99', dark: '#008040' },
    blue: { accent: '#3366ff', light: '#6699ff', dark: '#0033cc' },
  // removed: orange, pink, gold (deprecated)

    // BroSquad Themes
    "brosquad-neon": { accent: '#00ff9d', light: '#80ffce', dark: '#00b36b' },
    "brosquad-purple": { accent: '#b026ff', light: '#d580ff', dark: '#7a00cc' },
    "brosquad-cyan": { accent: '#00f7ff', light: '#80fbff', dark: '#00b3b8' },
    "brosquad-blue": { accent: '#00aaff', light: '#66ccff', dark: '#006699' },
  // removed: brosquad-gold, brosquad-orange, brosquad-pink (deprecated)
  };

  // 2. Get a random theme
  function getRandomTheme() {
    const themes = Object.keys(themeDefinitions);
    const randomIndex = Math.floor(Math.random() * themes.length);
    return themes[randomIndex];
  }

  // 3. Apply Theme (DISABLED)
  // We lock theme changes: initTheme applies a single, fixed theme and
  // subsequent apply/change calls become no-ops to prevent runtime changes.
  function applyTheme(themeName, source = "local") {
    // No-op by design: theme changes are disabled globally.
    console.log('ThemeManager: theme changes disabled (applyTheme called for', themeName, ')');
    return;
  }

  // 3. Sync Theme Across Tabs
  function setupCrossTabSync() {
    // Disabled: do not react to storage events when theme changes are locked.
    return;
  }

  // 4. Initialize on Page Load
  function initTheme() {
    try {
      // Determine locked theme (respect a saved theme if present)
      let lockedTheme = 'brosquad-blue';
      try {
        if (typeof localStorage !== 'undefined') lockedTheme = localStorage.getItem('theme') || lockedTheme;
      } catch (e) { /* ignore */ }

      // Apply the locked theme once (directly, without enabling dynamic changes)
      try {
        const theme = themeDefinitions[lockedTheme] || themeDefinitions['brosquad-blue'];
        const root = document.documentElement;
        root.setAttribute('data-theme', lockedTheme);
        root.style.setProperty('--accent', theme.accent);
        root.style.setProperty('--accent-light', theme.light);
        root.style.setProperty('--accent-dark', theme.dark);

        // Minimal static glow styles to keep visuals consistent
        const styleId = 'theme-style';
        let styleEl = document.getElementById(styleId);
        if (!styleEl) { styleEl = document.createElement('style'); styleEl.id = styleId; document.head.appendChild(styleEl); }
        styleEl.textContent = `
          a:hover, a:focus { color: ${theme.light}; }
          ::selection { background: ${theme.accent}; color: #fff; }
        `;
      } catch (e) { /* ignore apply errors */ }

      // Do not attach any data-theme button listeners or storage sync: changes are disabled
    } catch (e) {
      console.warn('ThemeManager: initTheme failed', e);
    }
  }

  // 5. Auto-rotate functionality removed
  function setupAutoRotate() {
    // Auto-rotation is now disabled by default
    console.log('Auto-rotation is disabled');
  }

  // Public function for compatibility (does nothing)
  function setAutoRotate() {
    console.log('Auto-rotation is permanently disabled');
  }

  // 6. Expose globally (with backward-compatible aliases)
  if (typeof window !== "undefined") {
  // Internal helper to notify other scripts about a theme change
  function notifyThemeChange(themeName) {
    try {
      const themeData = themeDefinitions[themeName] || {};
      // Standard event used by some pages
      document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: themeName, themeData } }));
      // Alternate event name used in other parts
      document.dispatchEvent(new CustomEvent('themeChange', { detail: { theme: themeName, themeData } }));
    } catch (e) {
      // no-op
    }
  }

  // Wrap applyTheme to emit events (no-op) to preserve API without changing state
  function applyThemeAndNotify(themeName, source) {
    // Do not change theme; keep API stable and optionally notify listeners without changing values
    try { /* no-op */ } catch (e) {}
    try { /* do not dispatch theme change events to avoid UI mutations */ } catch (e) {}
  }

  // Backwards compatible API (no-op)
  function changeTheme(themeName) { applyThemeAndNotify(themeName); }
  function getCurrentTheme() { return localStorage.getItem('theme') || document.documentElement.getAttribute('data-theme') || 'red'; }
  function initThemeManager() { initTheme(); }

  // Expose themes and helper for compatibility with older code
  try {
    // attach themes map and a hexToRgb helper
    if (!window.ThemeManager) window.ThemeManager = {};
    window.ThemeManager.themes = themeDefinitions;
    window.hexToRgb = window.hexToRgb || function(hex) {
      try {
        if (!hex) return '';
        const clean = (hex + '').replace('#', '');
        const bigint = parseInt(clean.length === 3 ? clean.split('').map(c=>c+c).join('') : clean, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `${r}, ${g}, ${b}`;
      } catch (e) { return ''; }
    };

    window.ThemeManager = Object.assign(window.ThemeManager, { applyTheme: applyThemeAndNotify, initTheme: initTheme, getRandomTheme, setAutoRotate, changeTheme, getCurrentTheme, initThemeManager });
  } catch (e) {
    // no-op
  }
    
    // Initialize after DOM is fully loaded (defensive)
    try {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          try { initTheme(); } catch (e) { console.warn('ThemeManager: initTheme error', e); }
          // Remove preload class after a short delay to prevent initial transition
          setTimeout(() => {
            try { document.documentElement.classList.remove('preload'); } catch (ignore) {}
          }, 100);
        });
      } else {
        try { initTheme(); } catch (e) { console.warn('ThemeManager: initTheme error', e); }
        try { document.documentElement.classList.remove('preload'); } catch (ignore) {}
      }
    } catch (e) {
      console.warn('ThemeManager: initialization guard failed', e);
    }
  }
})();
