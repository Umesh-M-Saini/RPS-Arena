document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (!menuToggle || !navLinks) {
        console.error("Navbar elements not found!");
        return;
    }

    // Toggle Menu
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('open');
    });

    // Close when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('open');
        });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (
            navLinks.classList.contains('active') &&
            !navLinks.contains(e.target) &&
            !menuToggle.contains(e.target)
        ) {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('open');
        }
    });
});