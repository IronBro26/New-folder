/**
 * Theme Initialization Script
 * Load this script after theme-manager.js on all pages
 */

(function() {
  // Function to apply theme styles - simplified to only apply theme on page load
  function applyTheme(themeName) {
    try {
      if (!window.ThemeManager) return;
      const themes = window.ThemeManager.themes || {};
      const theme = themes[themeName] || themes['red'] || { accent: '#ff1a1a', light: '#ff6666', dark: '#660000' };

      const root = document.documentElement;
      root.style.setProperty('--accent', theme.accent || '#ff1a1a');
      root.style.setProperty('--accent-light', theme.accentLight || theme.light || '#ff6666');
      root.style.setProperty('--accent-dark', theme.accentDark || theme.dark || '#660000');

      try {
        if (window.hexToRgb && theme.accent) {
          root.style.setProperty('--accent-rgb', window.hexToRgb(theme.accent));
        }
      } catch (e) { /* ignore */ }

      try { localStorage.setItem('theme', themeName); } catch (e) { /* ignore */ }

      // Dispatch theme changed event
      try {
        document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: themeName, themeData: theme } }));
      } catch (e) { /* ignore */ }
    } catch (e) {
      console.warn('theme-init: applyTheme failed', e);
    }
  }

  // Initialize when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    // Wait for ThemeManager to be available
    const checkThemeManager = setInterval(() => {
      if (window.ThemeManager) {
        clearInterval(checkThemeManager);

        // Apply saved theme or default - only on page load
        const savedTheme = (function(){ try { return localStorage.getItem('theme') || 'red'; } catch(e){ return 'red'; } })();
        if (typeof window.ThemeManager.applyTheme === 'function') {
          try { window.ThemeManager.applyTheme(savedTheme, 'local'); } catch (e) { applyTheme(savedTheme); }
        } else {
          applyTheme(savedTheme);
        }

        // Listen for theme changes and update CSS variables
        document.addEventListener('themeChanged', (event) => {
          const { theme, themeData } = event.detail || {};
          if (themeData) {
            try {
              const root = document.documentElement;
              root.style.setProperty('--accent', themeData.accent || '');
              root.style.setProperty('--accent-light', themeData.accentLight || themeData.light || '');
              root.style.setProperty('--accent-dark', themeData.accentDark || themeData.dark || '');
              if (window.hexToRgb && themeData.accent) root.style.setProperty('--accent-rgb', window.hexToRgb(themeData.accent));
            } catch (e) { /* ignore */ }
          }
        });

        // Listen for a siteAccent change (persisted by Brosquad settings)
        function applySiteAccent(accent) {
          try {
            if (!accent) return;
            // Exclude certain pages from automatic replacement
            const path = window.location.pathname.split('/').pop() || '';
            const excluded = ['reviews.html', 'camoman.html'];
            if (excluded.includes(path)) return;

            // Do NOT write root CSS vars here to avoid affecting navigation hover styles that rely on --accent.
            // We will only perform local inline updates within allowed containers.

            // Only apply accent replacement within explicit allow containers or on highlight/neon elements
            const allowSelector = '[data-allow-accent]';
            const highlightSelector = '.highlight, .neon, .accent-highlight';

            // Build a list of nodes to process: elements inside allow containers plus standalone highlight/neon elements
            const nodes = [];
            try {
              document.querySelectorAll(allowSelector).forEach(container => {
                Array.from(container.querySelectorAll('*:not(script):not(style)')).forEach(n => nodes.push(n));
              });
            } catch (e) { /* ignore */ }

            try {
              document.querySelectorAll(highlightSelector).forEach(n => nodes.push(n));
            } catch (e) { /* ignore */ }

            // Deduplicate
            const uniq = Array.from(new Set(nodes));

            // Helper: parse hex or rgb to {r,g,b}
            function parseToRgb(s) {
              if (!s) return null;
              s = s.trim();
              if (s.startsWith('rgb')) {
                const m = s.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
                if (m) return { r: parseInt(m[1],10), g: parseInt(m[2],10), b: parseInt(m[3],10) };
                return null;
              }
              // hex
              const hex = s.replace('#','');
              if (/^[0-9a-f]{3}$/i.test(hex)) {
                return { r: parseInt(hex[0]+hex[0],16), g: parseInt(hex[1]+hex[1],16), b: parseInt(hex[2]+hex[2],16) };
              }
              if (/^[0-9a-f]{6}$/i.test(hex)) {
                return { r: parseInt(hex.slice(0,2),16), g: parseInt(hex.slice(2,4),16), b: parseInt(hex.slice(4,6),16) };
              }
              return null;
            }

            function darkenRgb(rgb, amount) {
              if (!rgb) return null;
              const clamp = v => Math.max(0, Math.min(255, Math.round(v)));
              return `rgb(${clamp(rgb.r - amount)}, ${clamp(rgb.g - amount)}, ${clamp(rgb.b - amount)})`;
            }

            // First, explicitly update allowed sidebars' container visuals (gradient and glow)
            try {
              const sidebars = Array.from(document.querySelectorAll('.sidebar[data-allow-accent]'));
              sidebars.forEach(sb => {
                try {
                  // compute a darker stop for gradient
                  const parsed = parseToRgb(accent);
                  const dark = parsed ? darkenRgb(parsed, 40) : accent;
                  sb.style.background = `linear-gradient(180deg, ${accent}, ${dark})`;
                  sb.style.boxShadow = `0 0 25px ${accent}, inset 0 0 20px ${dark}`;
                  // update images inside sidebar
                  const imgs = sb.querySelectorAll('img');
                  imgs.forEach(img => {
                    try { img.style.boxShadow = `0 0 20px ${accent}, 0 0 40px ${dark}`; img.style.borderColor = accent; } catch(e){}
                  });
                } catch (e) { /* ignore per-sidebar errors */ }
              });
            } catch (e) { /* ignore */ }

            uniq.forEach(node => {
              try {
                if (!(node instanceof HTMLElement)) return;

                // Skip IMG, SVG, VIDEO, CANVAS
                if (/^(IMG|SVG|VIDEO|CANVAS|PICTURE)$/.test(node.tagName)) return;

                // Skip explicit navigation links or anything inside a data-skip-accent container
                if (node.matches && node.matches('.nav-link')) return;
                if (node.closest && node.closest('[data-skip-accent]')) return;

                // Skip nodes that appear to be emoji-only
                const text = node.textContent?.trim() || '';
                if (text && [...text].every(ch => /\p{Emoji}/u.test(ch))) return;

                const cs = getComputedStyle(node);
                // Only replace colors that are not black/white and not transparent
                function isBlackOrWhite(colorStr) {
                  if (!colorStr) return true;
                  const c = colorStr.replace(/\s+/g, '').toLowerCase();
                  if (c === 'rgb(0,0,0)' || c === '#000' || c === '#000000' || c === 'black') return true;
                  if (c === 'rgb(255,255,255)' || c === '#fff' || c === '#ffffff' || c === 'white') return true;
                  return false;
                }

                // Replace computed color if it's not black/white
                if (cs.color && !isBlackOrWhite(cs.color) && cs.color !== 'transparent') {
                  node.style.color = accent;
                }
                // Replace background colors that are not black/white
                if (cs.backgroundColor && !isBlackOrWhite(cs.backgroundColor) && cs.backgroundColor !== 'transparent') {
                  node.style.backgroundColor = accent;
                }
                // Replace border colors similarly
                if (cs.borderTopColor && !isBlackOrWhite(cs.borderTopColor) && cs.borderTopColor !== 'transparent') {
                  node.style.borderColor = accent;
                }
              } catch (e) {
                // ignore nodes that throw (SVG, etc)
              }
            });
          } catch (e) {
            console.warn('applySiteAccent failed', e);
          }
        }

        // Apply on initial load if siteAccent exists
        try {
          const savedAccent = (function(){ try { return localStorage.getItem('siteAccent'); } catch(e){ return null; } })();
          if (savedAccent) applySiteAccent(savedAccent);
        } catch (e) { /* ignore */ }

        // Listen for siteAccent change events (same-tab)
        window.addEventListener('siteAccentChanged', (e) => { const a = e.detail && e.detail.accent; if (a) applySiteAccent(a); });

        // Listen for storage events from other tabs
        window.addEventListener('storage', (ev) => {
          if (ev.key === 'siteAccent') {
            try { const a = ev.newValue; if (a) applySiteAccent(a); }
            catch(e){}
          }
        });
      }
    }, 100);
  });

  // Disable cross-tab theme syncing
  console.log('Cross-tab theme syncing is disabled');
  
  // Disable storage event listener
  console.log('Storage-based theme changes are disabled');
})();
