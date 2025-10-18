// Simple Navigation System
document.addEventListener('DOMContentLoaded', function() {
    console.log('Simple Navigation System Loaded');
    
    // Get current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    console.log('Current Page:', currentPage);
    
    // Set active link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        console.log('Checking link:', linkHref);
        
        // Make links work
        link.addEventListener('click', function(e) {
            console.log('Link clicked:', linkHref);
            // Don't prevent default - let the link work
            
            // Close mobile menu if open
            const sidebar = document.querySelector('.sidebar');
            if (window.innerWidth <= 860 && sidebar) {
                sidebar.classList.remove('active');
            }
        });
        
        // Set active class
        if (linkHref && ((currentPage === 'index.html' && linkHref === './index.html') ||
            currentPage === linkHref ||
            (currentPage === '' && linkHref === './index.html') ||
            (currentPage.includes(linkHref.replace('./', '').replace('.html', '')) && linkHref !== './index.html'))) {
            link.classList.add('active');
            console.log('Active link set to:', linkHref);
        }
    });
    
    // Toggle sidebar for mobile
    window.toggleSidebar = function() {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.classList.toggle('active');
            console.log('Sidebar toggled');
        }
    };
    
    // Toggle settings panel
    window.toggleSettings = function() {
        const settingsPanel = document.getElementById('settingsPanel');
        if (settingsPanel) {
            settingsPanel.classList.toggle('active');
            console.log('Settings panel toggled');
        }
    };
    
    // Close settings when clicking outside
    document.addEventListener('click', function(e) {
        const settingsPanel = document.getElementById('settingsPanel');
        const settingsButton = document.querySelector('.settings-toggle');
        
        if (settingsPanel && settingsButton && 
            !settingsPanel.contains(e.target) && 
            !settingsButton.contains(e.target)) {
            settingsPanel.classList.remove('active');
        }
    });
    
    console.log('Navigation setup complete');
});
