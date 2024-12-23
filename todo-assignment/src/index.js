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



/* ------------------------------------------

                CONTROLLER

-----------------------------------------------*/
const controller = (function(renderer, projects, store) {
    //renderer;
    //projects;
    const currActiveProjectId = store.loadActiveProjectId();
    let activeProject = currActiveProjectId ? 
        projects.find((project) => { return project.getId() == currActiveProjectId }) :
        projects[0];
    // let activeProject = projects[0];


    
    let projectButtons = [];

    const projectButtonListenerFunc =  (e) => {
        const projectId = e.target.dataset.projectId;
        changeActiveProject(projectId);
        store.storeActiveProjectId(projectId);
    };

    const renderProjectsList = () => {
        const projectsEl = document.getElementById('projects');
        projectsEl.innerHTML = '';

        renderer.renderProjects(projects, projectsEl);
        
        // Remove existing event listeners if they exist
        if (projectButtons.length > 0) {
            projectButtons.forEach((btn) => {
                btn.removeEventListener('click', projectButtonListenerFunc);
            })
        }
        // Set up project button event listeners
        projectButtons = document.querySelectorAll('.project-nav-button');
        projectButtons.forEach((btn) => {
            btn.addEventListener('click', projectButtonListenerFunc)
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

    const addProject = (title) => {
        const newProject = new Project(title);
        projects.push(newProject);

        store.storeProjects(projects);

        renderProjectsList();
    }

    return {
        renderProjectsList,
        renderActiveProjectTodos,
        changeActiveProject,
        addTodo,
        addProject
    }
})(tempRenderer, projectsArr, store)

controller.renderActiveProjectTodos();
controller.renderProjectsList();

// controller.addTodo('Get dog food', '2024-12-28 12:00', 2, 'FreshPet Multi-Protein Formula - Freeze Dried');


const newProjectButton = document.getElementById('projects-new-project');
const newProjectDialog = document.getElementById('dialog-new-project');
const newProjectForm = document.getElementById('form-new-project');

newProjectButton.addEventListener('click', (el, e) => {
    newProjectDialog.showModal()
});
newProjectDialog.addEventListener('close', (el, e) => {
    controller.addProject(newProjectForm['new-project-title'].value);

    newProjectForm['new-project-title'].value = '';
});

const newTodoButton = document.getElementById('todos-new-todo');
const newTodoDialog = document.getElementById('dialog-new-todo');
const newTodoForm = document.getElementById('form-new-todo');

newTodoButton.addEventListener('click', (el, e) => {
    newTodoDialog.showModal()
});
newTodoDialog.addEventListener('close', (el, e) => {
    controller.addTodo(
        newTodoForm['new-todo-title'].value,
        newTodoForm['new-todo-due-date'].value,
        newTodoForm['new-todo-priority'].value,
        newTodoForm['new-todo-description'].value
    );

    // Clear form inputs
    newTodoForm['new-todo-title'].value = '';
    newTodoForm['new-todo-due-date'].value = '';
    newTodoForm['new-todo-priority'].value = '';
    newTodoForm['new-todo-description'].value = '';
});



const sortTodosButton = document.getElementById('todos-sort-by-date');