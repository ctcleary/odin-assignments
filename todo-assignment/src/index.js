import "./styles.css";
import { greeting } from "./greeting.js"

import Todo from "./Todo.js";
import Project from "./Project.js";
import Renderer from "./Renderer.js";

const tempTodo = new Todo(
    "Get milk", 
    new Date(2025, 0, 3),
    1,
    "Next time I go to the store I need to get 2% milk.",
    [
        'Janie wants skim.',
        'Melissa wants almond milk.'
    ]
);

const tempTodo2 = new Todo(
    "Get car wash",
    new Date(2025, 0, 15),
    "The car is filthy",
)

// console.log(tempTodo.getTitle());
// console.log(tempTodo.getId());

const tempProject = new Project();
console.log(tempProject.getTodos());

const tempProject2 = new Project();
const tempProject2Todo = new Todo('Get oil changed', new Date(2025, 0, 15));
tempProject2.addTodo(tempProject2Todo);

tempProject.addTodo(tempTodo);
console.log(tempProject.getTodos());

tempProject.addTodo(tempTodo2);
console.log(tempProject.getTodos());

// tempProject.removeTodo(tempTodo.getId());
// console.log(tempProject.getTodos());

const renderer = new Renderer();

console.log(tempProject.getTodos());
console.log(document.getElementById('todos'));
renderer.renderTodos(tempProject.getTodos(), document.getElementById('todos'));

renderer.renderProjects([tempProject, tempProject2], document.getElementById('projects'));
