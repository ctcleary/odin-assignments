import "./styles.css";
import Page from "./Page.js";
import home from "./home.js";

import { greeting } from "./greeting.js"
console.log(greeting);

const contentDiv = document.getElementById('content');

// const page = new Page();
// page.render(contentDiv);

home.render(contentDiv);

