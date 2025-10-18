/**
 * UI Controls for IronBro26 Website
 * Handles all UI interactions including sidebar, settings, and notifications
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeUI();
    setupEventListeners();
    checkAdminStatus();
});

// Initialize UI components
function initializeUI() {
    // Set initial theme
    const savedTheme = localStorage.getItem('theme') || 'brosquad-blue';
    applyTheme(savedTheme);
    
    // Set active nav link
    setActiveNavLink();
}

// Set up event listeners
function setupEventListeners() {
    // Menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleSidebar);
    }

    // Settings toggle
    const settingsToggle = document.querySelector('.settings-toggle');
    if (settingsToggle) {
        settingsToggle.addEventListener('click', toggleSettings);
    }

    // Close settings button
    const closeSettings = document.querySelector('.close-settings');
    if (closeSettings) {
        closeSettings.addEventListener('click', toggleSettings);
    }

    // Theme buttons
    const themeButtons = document.querySelectorAll('.theme-option');
    themeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            setTheme(theme);
        });
    });

    // Close settings when clicking outside
    document.addEventListener('click', function(event) {
        const settingsPanel = document.getElementById('settingsPanel');
        const settingsButton = document.querySelector('.settings-toggle');
        
        if (settingsPanel && settingsButton && 
            !settingsPanel.contains(event.target) && 
            !settingsButton.contains(event.target)) {
            settingsPanel.classList.remove('active');
        }
        
        // Close mobile menu when clicking outside
        const sidebar = document.querySelector('.sidebar');
        if (window.innerWidth <= 860 && 
            sidebar && 
            !sidebar.contains(event.target) && 
            menuToggle && 
            !menuToggle.contains(event.target)) {
            sidebar.classList.remove('active');
        }
    });
}

// Toggle sidebar
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

// Apply theme
function applyTheme(theme) {
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
    
    // Show notification
    showNotification(`Theme set to ${theme.replace('brosquad-', '').charAt(0).toUpperCase() + theme.replace('brosquad-', '').slice(1)}`);
}

// Set active navigation link based on current page
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
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

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remove after animation
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Check admin status and show/hide admin elements
function checkAdminStatus() {
    const adminEmail = 'krfuchs11@icloud.com';
    
    try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
        console.log('Current User:', currentUser);
        
        if (!currentUser) {
            console.log('No user found in localStorage');
            return;
        }

        const userRole = (currentUser.role || '').toLowerCase();
        const userEmail = (currentUser.email || '').toLowerCase();
        const isAdmin = (userRole === 'admin' || userRole === 'owner');
        const isAdminEmail = (userEmail === adminEmail.toLowerCase());

        console.log('User Email:', userEmail);
        console.log('User Role:', userRole);
        console.log('Is Admin Email:', isAdminEmail);
        console.log('Is Admin Role:', isAdmin);

        if (isAdminEmail && isAdmin) {
            const adminSection = document.getElementById('adminSection');
            const adminLink = document.getElementById('adminLink');
            const adminBtnHome = document.getElementById('adminBtnHome');

            if (adminSection) adminSection.style.display = 'block';
            if (adminLink) adminLink.style.display = 'block';
            if (adminBtnHome) adminBtnHome.style.display = 'inline-block';

            // Add hover effect
            if (adminLink) {
                adminLink.addEventListener('mouseover', () => {
                    adminLink.style.background = 'rgba(255, 26, 26, 0.2)';
                    adminLink.style.boxShadow = '0 0 15px rgba(255, 26, 26, 0.4)';
                });
                adminLink.addEventListener('mouseout', () => {
                    adminLink.style.background = 'rgba(255, 26, 26, 0.1)';
                    adminLink.style.boxShadow = '0 0 10px rgba(255, 26, 26, 0.2)';
                });
            }
        } else {
            const adminSection = document.getElementById('adminSection');
            const adminBtnHome = document.getElementById('adminBtnHome');
            if (adminSection) adminSection.style.display = 'none';
            if (adminBtnHome) adminBtnHome.style.display = 'none';
        }
    } catch(e) {
        console.error('Error checking admin status:', e);
    }
}

// Make functions available globally
window.toggleSidebar = toggleSidebar;
window.toggleSettings = toggleSettings;
window.setTheme = applyTheme;
window.showNotification = showNotification;
