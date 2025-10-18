// Button functionality for the website

document.addEventListener('DOMContentLoaded', function() {
    // Toggle sidebar
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.onclick = toggleSidebar;
    }

    // Toggle settings panel
    const settingsToggle = document.querySelector('.settings-toggle');
    if (settingsToggle) {
        settingsToggle.onclick = toggleSettings;
    }

    // Close settings button
    const closeSettings = document.querySelector('.close-settings');
    if (closeSettings) {
        closeSettings.onclick = toggleSettings;
    }

    // Theme buttons
    const themeButtons = document.querySelectorAll('.theme-option');
    themeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            setTheme(theme);
        });
    });

    // Mobile menu close when clicking outside
    document.addEventListener('click', function(event) {
        const sidebar = document.querySelector('.sidebar');
        const menuButton = document.querySelector('.menu-toggle');
        
        if (sidebar && menuButton && 
            !sidebar.contains(event.target) && 
            !menuButton.contains(event.target) &&
            window.innerWidth <= 860) {
            sidebar.classList.remove('active');
        }
    });
});

// Toggle sidebar function
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.toggle('active');
    }
}

// Toggle settings panel
function toggleSettings() {
    const settingsPanel = document.getElementById('settingsPanel');
    if (settingsPanel) {
        settingsPanel.classList.toggle('active');
    }
}

// Set theme function
function setTheme(theme) {
    if (!theme) return;
    
    // Remove all theme classes
    document.body.className = document.body.className
        .split(' ')
        .filter(cls => !cls.startsWith('theme-'))
        .join(' ');
        
    // Add new theme class
    document.body.classList.add(`theme-${theme}`);
    
    // Save to localStorage if available
    try {
        localStorage.setItem('theme', theme);
    } catch (e) {
        console.warn('Could not save theme to localStorage', e);
    }
    
    // Dispatch theme change event
    document.dispatchEvent(new CustomEvent('themeChanged', { 
        detail: { theme: theme } 
    }));
}

// Initialize theme from localStorage
function initTheme() {
    try {
        const savedTheme = localStorage.getItem('theme') || 'default';
        setTheme(savedTheme);
    } catch (e) {
        console.warn('Could not load theme from localStorage', e);
        setTheme('default');
    }
}

// Initialize when the page loads
initTheme();
