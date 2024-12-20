import Page from "./Page";

const contentRoot = document.createElement('div');
contentRoot.id = 'content-root-home';
contentRoot.classList.add('content-root');

// contentRoot.innerText = "home content root";

const description = document.createElement('div');
description.id = "home-description";
description.classList.add('segment');

description.textContent = "Thanks for visiting Rudy's Restaurant, where your cravings lead to savings. Our super hip wait staff won't even make you feel bad about ordering an inferior kind of coffee! So come on down today, we won't bite unless you really want us to.";

contentRoot.appendChild(description);


const hours = document.createElement('div');
hours.id = "home-hours";
hours.classList.add('segment');

const hoursList = document.createElement('ul');
hoursList.innerHTML = '<li> Mon - Fri :: 8am - 9pm</li>' +
    '<li>Sat :: 7am - 10pm</li>' +
    '<li>Sun :: Closed</li>';

hours.appendChild(hoursList);
contentRoot.appendChild(hours);



const home = new Page(contentRoot);
export default home;
