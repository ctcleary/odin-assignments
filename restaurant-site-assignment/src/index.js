import "./styles.css";
import Page from "./Page.js";
import home from "./homePage.js";
import menu from "./menuPage.js";
import contact from "./contactPage.js";

import { greeting } from "./greeting.js"
console.log(greeting);

const contentDiv = document.getElementById('content');

const homeButton = document.getElementById('nav-home');
const menuButton = document.getElementById('nav-menu');
const contactButton = document.getElementById('nav-contact');

homeButton.addEventListener('click', () => {
    home.render(contentDiv);
});

menuButton.addEventListener('click', () => {
    menu.render(contentDiv);
});

contactButton.addEventListener('click', () => {
    contact.render(contentDiv);
})

home.render(contentDiv);
// menu.render(contentDiv);
// contact.render(contentDiv);
