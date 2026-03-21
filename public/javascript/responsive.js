/* Highlights of the fix */
.navbar {
    position: fixed; /* Changed to fixed for consistency */
    top: 0;
    left: 0;
    z-index: 1000;
    width: 100vw !important; /* Enforced 100vw as requested */
    transition: all 0.3s ease;
}

html, body {
    overflow-x: hidden; /* Prevents horizontal scroll from 100vw */
    width: 100%;
}document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('open');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('open');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('open');
            }
        });
    }
});
