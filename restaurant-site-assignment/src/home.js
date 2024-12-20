import Page from "./Page";

const contentRoot = document.createElement('div');
contentRoot.id = 'content-root-home';
contentRoot.classList.add('content-root');

contentRoot.innerText = "home content root";






const home = new Page(contentRoot);
export default home;
