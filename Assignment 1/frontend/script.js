document.addEventListener('DOMContentLoaded', () => {
    const currentLocation = location.href;
    const menuItems = document.querySelectorAll('.nav-links a');

    // Set the active class on the initial load
    menuItems.forEach(menuItem => {
        if (menuItem.href === currentLocation) {
            menuItem.classList.add("active");
        }

        // Add click event listener to each menu item
        menuItem.addEventListener('click', () => {
            // Remove the active class from all menu items
            menuItems.forEach(item => item.classList.remove("active"));

            // Add the active class to the clicked menu item
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
