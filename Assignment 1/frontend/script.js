document.addEventListener('DOMContentLoaded', () => {
    const currentLocation = location.href;
    const menuItems = document.querySelectorAll('.nav-links a');

    menuItems.forEach(menuItem => {
        if (menuItem.href === currentLocation) {
            menuItem.classList.add("active");
        }

        menuItem.addEventListener('click', () => {
            menuItems.forEach(item => item.classList.remove("active"));
            menuItem.classList.add("active");
        });
    });
});

const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');
});