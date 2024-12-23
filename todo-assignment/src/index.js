import "./styles.css";
import { greeting } from "./greeting.js"

import Todo from "./Todo.js";
import Project from "./Project.js";
import Renderer from "./Renderer.js";
import { SORT_BY } from "./Renderer.js";
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

const tempProjectsArray = [
    tempProject,
    tempProject2,
    tempProject3
]

/* ------------ ^ TEMP ^ ================ */

const tempRenderer = new Renderer();
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
        // store.storeActiveProjectId(projectId);
    };

    const renderProjectsList = () => {
        const activeProjectId = activeProject.getId();

        const projectsEl = document.getElementById('projects');
        projectsEl.innerHTML = '';

        renderer.renderProjects(projects, projectsEl, activeProjectId);
        
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
        const currProjectHeadline = document.getElementById('current-project');
        currProjectHeadline.innerText = activeProject.getTitle();

        const contentsEl = document.getElementById('todos');
        contentsEl.innerHTML = '';

        renderer.renderTodos(activeProject.getTodos(), contentsEl);

        const deleteTodos = document.querySelectorAll('.todo-delete');
        deleteTodos.forEach((deleteBtn) => {
            deleteBtn.addEventListener('click', (e) => {
                console.log('delete todo clicked; todo-id :: ', e.target.dataset.todoId);
                deleteTodoForm['todo-delete-id'].value = deleteBtn.dataset.todoId;
                deleteTodoTitle.innerText = e.target.dataset.todoTitle;
                deleteTodoDialog.showModal();
            });
        });
    }

    const changeActiveProject = (projectId) => {
        activeProject = projects.find((project) => { 
            return project.getId() == projectId;
        });
        store.storeActiveProjectId(activeProject.getId());

        console.log('activeProject', activeProject);

        renderProjectsList();
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
    const deleteTodo = (todoId) => {
        // const currTodos = activeProject.getTodos();
        // const idx = currTodos.indexOf(
        //     currTodos.find((todo) => { return todo.getId() === todoId; })
        // );
        // // TODO does this need to be a Project.deleteTodo function?
        // currTodos.splice(idx, 1);
        activeProject.deleteTodo(todoId);

        store.storeProjects(projects);
        renderActiveProjectTodos();
    }

    const getActiveProjectId = () => {
        return activeProject.getId();
    }

    const addProject = (title) => {
        const newProject = new Project(title);
        projects.push(newProject);

        store.storeProjects(projects);
        renderProjectsList();
    }
    const deleteProject = (projectId) => {
        controller.changeActiveProject(projects[0].getId());
        const idx = projects.indexOf(
            projects.find((project) => { return project.getId() === projectId; })
        );
        projects.splice(idx, 1);
        
        store.storeProjects(projects);
        renderProjectsList();
    }
    const renameProject = (newTitle) => {
        activeProject.setTitle(newTitle);

        store.storeProjects(projects);
        renderProjectsList();
        renderActiveProjectTodos();
    }

    const sortByButton = document.getElementById('todos-sort-by');
    const savedSortBy = store.loadTodoSortBy();
    const updateSortByButton = () => {
        let newSortBy = sortByButton.dataset.sortBy;

        switch (sortByButton.dataset.sortBy) {
            case SORT_BY.DATE_ASCENDING:
                newSortBy = SORT_BY.DATE_DESCENDING;
                sortByButton.dataset.sortBy = newSortBy;
                sortByButton.innerHTML = 'Sort by: Date &downarrow;';
                break;
            case SORT_BY.DATE_DESCENDING:
                newSortBy = SORT_BY.PRIORITY_ASCENDING;
                sortByButton.dataset.sortBy = newSortBy;
                sortByButton.innerHTML = 'Sort by: Priority &uparrow;';
                break;
            case SORT_BY.PRIORITY_ASCENDING:
                newSortBy = SORT_BY.PRIORITY_DESCENDING;
                sortByButton.dataset.sortBy = newSortBy;
                sortByButton.innerHTML = 'Sort by: Priority &downarrow;';
                break;
            case SORT_BY.PRIORITY_DESCENDING:
                newSortBy = SORT_BY.DATE_ASCENDING;
                sortByButton.dataset.sortBy = newSortBy;
                sortByButton.innerHTML = 'Sort by: Date &uparrow;';
                break;
        }

        return newSortBy;
    }
    console.log('savedSortBy' + savedSortBy);
    if (savedSortBy) {
        tempRenderer.changeSortBy(savedSortBy);1
        updateSortByButton();
        sortByButton.dataset.sortBy = savedSortBy;
    } else {
        sortByButton.dataset.sortBy = SORT_BY.DATE_ASCENDING; // default
    }
    sortByButton.addEventListener('click', (e) => {
        let newSortBy = sortByButton.dataset.sortBy;
        newSortBy = updateSortByButton();
        
        tempRenderer.changeSortBy(newSortBy);
        store.storeTodoSortBy(newSortBy);
        renderActiveProjectTodos();
    });

    return {
        getActiveProjectId,
        renderProjectsList,
        renderActiveProjectTodos,
        changeActiveProject,
        addTodo,
        deleteTodo,
        addProject,
        deleteProject,
        renameProject,
    }
})(tempRenderer, projectsArr, store)

controller.renderActiveProjectTodos();
controller.renderProjectsList();

// controller.addTodo('Get dog food', '2024-12-28 12:00', 2, 'FreshPet Multi-Protein Formula - Freeze Dried');


const newProjectButton = document.getElementById('projects-new-project');
const newProjectDialog = document.getElementById('dialog-new-project');
const newProjectForm = document.getElementById('form-new-project');
const newProjectClose = document.querySelector('#dialog-new-project .dialog-close');

newProjectButton.addEventListener('click', (el, e) => {
    newProjectDialog.showModal()
});
newProjectForm.addEventListener('submit', (el, e) => {
    controller.addProject(newProjectForm['new-project-title'].value);

    newProjectForm['new-project-title'].value = '';
});
newProjectClose.addEventListener('click', () => {
    newProjectDialog.close();
})

const newTodoButton = document.getElementById('todos-new-todo');
const newTodoDialog = document.getElementById('dialog-new-todo');
const newTodoForm = document.getElementById('form-new-todo');
const newTodoClose = document.querySelector('#dialog-new-todo .dialog-close');

newTodoButton.addEventListener('click', (el, e) => {
    newTodoDialog.showModal()
});
newTodoForm.addEventListener('submit', (el, e) => {
    controller.addTodo(
        newTodoForm['new-todo-title'].value,
        newTodoForm['new-todo-due-date'].value,
        newTodoForm['new-todo-priority'].value,
        newTodoForm['new-todo-description'].value
    );

    // Clear form inputs
    newTodoForm['new-todo-title'].value = '';
    newTodoForm['new-todo-due-date'].value = '';
    newTodoForm['new-todo-priority'].value = 3;
    newTodoForm['new-todo-description'].value = '';
});
newTodoClose.addEventListener('click', (el, e) => {
    newTodoDialog.close();
})


// const sortTodosButton = document.getElementById('todos-sort-by-date');

const deleteProjectButton = document.getElementById('button-delete-project');
const deleteProjectDialog = document.getElementById('dialog-delete-project');
const deleteProjectForm = document.getElementById('form-confirm-project-delete');
const deleteProjectClose = document.querySelector('#dialog-delete-project .dialog-close');

deleteProjectButton.addEventListener('click', () => {
    deleteProjectDialog.showModal();
});
deleteProjectForm.addEventListener('submit', (el, e) => {
    controller.deleteProject(controller.getActiveProjectId())
});
deleteProjectClose.addEventListener('click', (el, e) => {
    deleteProjectDialog.close();
});

const renameProjectButton = document.getElementById('button-rename-project');
const renameProjectDialog = document.getElementById('dialog-rename-project');
const renameProjectForm = document.getElementById('form-rename-project');
const renameProjectClose = document.querySelector('#dialog-rename-project .dialog-close');

renameProjectButton.addEventListener('click', (e) => {
    renameProjectDialog.showModal();
});

renameProjectForm.addEventListener('submit', (e) => {
    controller.renameProject(renameProjectForm['project-new-title'].value);

    renameProjectForm['project-new-title'].value = '';
})

renameProjectClose.addEventListener('click', (e) => {
    renameProjectDialog.close();
    renameProjectForm['project-new-title'].value = '';
});

const deleteTodoDialog = document.getElementById('dialog-delete-todo');
const deleteTodoTitle = document.getElementById('dialog-delete-todo-title');
const deleteTodoForm = document.getElementById('form-delete-todo');
const deleteTodoClose = document.querySelector('#dialog-delete-todo .dialog-close');

const deleteTodos = document.querySelectorAll('.todo-delete');
deleteTodos.forEach((deleteBtn) => {
    deleteBtn.addEventListener('click', (e) => {
        console.log('delete todo clicked; todo-id :: ', e.target.dataset.todoId);
        deleteTodoForm['todo-delete-id'].value = deleteBtn.dataset.todoId;
        deleteTodoTitle.innerText = e.target.dataset.todoTitle;
        deleteTodoDialog.showModal();
    })
});

deleteTodoForm.addEventListener('submit', (e) => {
    console.log('delete form onsubmit -- id value', deleteTodoForm['todo-delete-id'].value);
    controller.deleteTodo(deleteTodoForm['todo-delete-id'].value);
});

deleteTodoClose.addEventListener('click', (e) => {
    deleteTodoDialog.close();
});

