import "./styles.css";

const hamburgerButton = document.getElementById('hamburger-button');
const dropdownMenu = document.getElementById('dropdown');

hamburgerButton.addEventListener('click', () => {
    if (dropdownMenu.classList.contains('visible')) {
        dropdownMenu.classList.remove('visible');
        hamburgerButton.innerHTML = '&middot; &middot; &middot;';
    } else {
        dropdownMenu.classList.add('visible');
        hamburgerButton.innerHTML = '&middot; X &middot;';
    }
});

const dropdownLinks = document.querySelectorAll('.dropdown-item a');

dropdownLinks.forEach((el) => {
    el.addEventListener('click', () => {
        dropdownMenu.classList.remove('visible');
    })
})
