import Page from "./Page";

const contentRoot = document.createElement('div');
contentRoot.id = 'content-root-home';
contentRoot.classList.add('content-root');

const contactDiv = document.createElement('div');
contactDiv.classList.add('segment');

contactDiv.innerHTML = "<h1>Contact Us</h1>"+
    "<p>(123) 555 - 7890</p>" +
    "<p>RudyIsNotReal@gmail.com</p>";

contentRoot.appendChild(contactDiv);

const contact = new Page(contentRoot);
export default contact;
