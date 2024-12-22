import "./styles.css";
import { greeting } from "./greeting.js"

import Todo from "./Todo.js";
import Project from "./Project.js";
import Renderer from "./Renderer.js";
import Store from "./Store.js";


/* ------------ v TEMP v ================ */
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

const tempProject = new Project('Named Project');
console.log(tempProject.getTodos());

const tempProject2 = new Project();
const tempProject2Todo = new Todo('Get oil changed', new Date('2025-1-15'));
tempProject2.addTodo(tempProject2Todo);

const tempProject3 = new Project('Another Named Project');

tempProject.addTodo(tempTodo);
console.log(tempProject.getTodos());

tempProject.addTodo(tempTodo2);
console.log(tempProject.getTodos());

// tempProject.removeTodo(tempTodo.getId());
// console.log(tempProject.getTodos());

const tempRenderer = new Renderer();
const tempProjectsArray = [
    tempProject,
    tempProject2,
    tempProject3
]

/* ------------ ^ TEMP ^ ================ */

const store = new Store();
const currActiveProjectId = store.loadActiveProjectId() || 0;
const projectsObjects = store.loadProjects();
let projectsArr;
if (projectsObjects) {
    projectsArr = projectsObjects.map((projectRaw) => {
        const projectTodos = projectRaw.todos.map((todoRaw) => {
            const mapItem = new Todo(
                todoRaw.title,
                todoRaw.dueDate,
                todoRaw.priority,
                todoRaw.description,
                todoRaw.notes
            )

            return mapItem;
        })
        const project = new Project(projectRaw.project.title, projectTodos, projectRaw.project.projectId)
        return project;
    })
} else {
    projectsArr = tempProjectsArray;
}

const controller = (function(renderer, projects, store) {
    //renderer;
    //projects;
    const currActiveProjectId = store.loadActiveProjectId();
    let activeProject = currActiveProjectId ? 
        projects.find((project) => { return project.getId() == currActiveProjectId }) :
        projects[0];
    // let activeProject = projects[0];
    
    let projectButtons = [];

    const renderProjectsList = () => {
        const projectsEl = document.getElementById('projects');
        projectsEl.innerHTML = '';

        renderer.renderProjects(projects, projectsEl);
        
        // Remove existing event listeners if they exist
        if (projectButtons.length > 0) {
            projectButtons.forEach((btn) => {
                btn.removeEventListener('click');
            })
        }
        // Set up project button event listeners
        projectButtons = document.querySelectorAll('.project-nav-button');
        projectButtons.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const projectId = e.target.dataset.projectId;
                changeActiveProject(projectId);
                store.storeActiveProjectId(projectId);
            })
        });
    }

    const renderActiveProjectTodos = () => {
        const contentsEl = document.getElementById('todos');
        contentsEl.innerHTML = '';
        renderer.renderTodos(activeProject.getTodos(), contentsEl);
    }

    const changeActiveProject = (projectId) => {
        activeProject = projects.find((project) => { 
            return project.getId() == projectId;
        });

        renderActiveProjectTodos(); 
    }

    const addTodo = (title, dueDate, priority, description, notes) => {
        const newTodo = new Todo(title, dueDate, priority, description, notes);
        activeProject.addTodo(newTodo);

        // const projectObj = store.objectifyProject(activeProject);
        // console.log(JSON.stringify(projectObj));
        store.storeProjects(projects);

        renderActiveProjectTodos();
    }

    return {
        renderProjectsList,
        renderActiveProjectTodos,
        changeActiveProject,
        addTodo
    }
})(tempRenderer, projectsArr, store)

controller.renderActiveProjectTodos();
controller.renderProjectsList();

// controller.addTodo('Get dog food', '2024-12-28 12:00', 2, 'FreshPet Multi-Protein Formula - Freeze Dried');