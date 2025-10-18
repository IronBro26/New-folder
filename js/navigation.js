// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Navigation script loaded');

    // Set active nav link based on current page
    function setActiveLink() {
        try {
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            const navLinks = document.querySelectorAll('.nav-link');
            
            navLinks.forEach(link => {
                if (!link) return;
                
                const linkHref = link.getAttribute('href');
                console.log(`Checking link: ${linkHref} against current page: ${currentPage}`);
                
                if ((currentPage === 'index.html' && linkHref === './index.html') ||
                    (currentPage === linkHref) ||
                    (currentPage === '' && linkHref === './index.html') ||
                    (currentPage.includes(linkHref.replace('./', '').replace('.html', '')) && linkHref !== './index.html')) {
                    link.classList.add('active');
                    console.log(`Active link set to: ${linkHref}`);
                } else {
                    link.classList.remove('active');
                }
            });
        } catch (error) {
            console.error('Error in setActiveLink:', error);
        }
    }

    // Close sidebar when clicking a link on mobile
    function setupMobileMenu() {
        try {
            const navLinks = document.querySelectorAll('.nav-link');
            const sidebar = document.querySelector('.sidebar');
            
            navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    // Don't prevent default - let the link work normally
                    if (window.innerWidth <= 860 && sidebar) {
                        sidebar.classList.remove('active');
                    }
                    
                    // Add a small delay to ensure the active class is set after navigation
                    setTimeout(setActiveLink, 100);
                });
            });
        } catch (error) {
            console.error('Error in setupMobileMenu:', error);
        }
    }

    // Close settings when clicking outside
    function setupClickOutside() {
        try {
            document.addEventListener('click', function(event) {
                const settingsPanel = document.getElementById('settingsPanel');
                const settingsButton = document.querySelector('.settings-toggle');
                
                if (settingsPanel && settingsButton && 
                    !settingsPanel.contains(event.target) && 
                    !settingsButton.contains(event.target)) {
                    settingsPanel.classList.remove('active');
                }
            });
        } catch (error) {
            console.error('Error in setupClickOutside:', error);
        }
    }

    // Initialize navigation
    setActiveLink();
    setupMobileMenu();
    setupClickOutside();

    // For debugging
    console.log('Navigation initialization complete');
});
