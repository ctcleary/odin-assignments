class Renderer {
    constructor() {
    }
    
    #todos;
    #contentsEl;

    
    renderProjects(projects, projectsEl, currActiveProjectId) {
        for (let i = 0; i < projects.length; i++) {
            const project = projects[i];

            const projectEl = document.createElement('div');
            projectEl.classList.add('project-nav')

            if (project.getId() === currActiveProjectId) {
                projectEl.classList.add('active-project');
            }
            
            const projectButton = document.createElement('button');
            projectButton.classList.add('project-nav-button');
            projectButton.innerText = project.getTitle();
            projectButton.dataset.projectId = project.getId();
            projectEl.appendChild(projectButton);

            const numTodos = document.createElement('div');
            numTodos.classList.add('project-num-todos');
            numTodos.innerText = `( ${project.getTodos().length} )`;
            projectEl.appendChild(numTodos);

            projectsEl.appendChild(projectEl);
        }
    }

    getCurrSorting() {
        return this.#sortBy;
    }
    changeSortBy(newSorting) {
        this.#sortBy = newSorting;
        if (this.#todos) {
            this.renderTodos(this.#todos, this.#contentsEl);
        }
    }

    #sortBy = SORT_BY.DATE_ASCENDING;
    #sortTodos(todos) {
        switch (this.#sortBy) {
            case SORT_BY.DATE_ASCENDING:
                console.log('todo sort by date asc');
                todos.sort((a, b) => {
                    if (a.dueDate >= b.dueDate) {
                        return 1;
                    } else {
                        return -1;
                    }
                });
                break;
            case SORT_BY.DATE_DESCENDING:
                console.log('todo sort by date desc');
                todos.sort((a, b) => {
                    if (a.dueDate >= b.dueDate) {
                        return -1;
                    } else {
                        return 1;
                    }
                });
                break;
            case SORT_BY.PRIORITY_ASCENDING:
                console.log('todo sort by priority asc');
                todos.sort((a, b) => {
                    if (a.priority > b.priority) {
                        return -1;
                    } else {
                        return 1;
                    }
                });
                break;
            case SORT_BY.PRIORITY_DESCENDING:
                console.log('todo sort by priority desc');
                todos.sort((a, b) => {
                    if (a.priority > b.priority) {
                        return 1;
                    } else {
                        return -1;
                    }
                });
                break;
        }

        return todos;
    }

    
    renderTodos(todos, contentsEl) {
        this.#contentsEl = contentsEl;

        if (todos.length === 0) {
            const noTodosEl = document.createElement('div');
            noTodosEl.innerText = "No Todos for this project yet!";
            this.#contentsEl.appendChild(noTodosEl);
            this.#todos = [];
            return;
        }

        const sortedTodos = this.#sortTodos(todos);
        this.#todos = sortedTodos;

        for (let i = 0; i < sortedTodos.length; i++) {
            const currTodo = sortedTodos[i];

            const wrapEl = document.createElement('div');
            wrapEl.classList.add('todo');

            const todoHeader = document.createElement('div');
            todoHeader.classList.add('todo-header');

                const title = document.createElement('h2');
                title.classList.add('todo-title');
                title.innerText = currTodo.getTitle() || 'No title found!';
                todoHeader.appendChild(title);

                const deleteTodo = document.createElement('button');
                deleteTodo.classList.add('todo-delete');
                deleteTodo.dataset.todoId = currTodo.getId();
                deleteTodo.dataset.todoTitle = currTodo.getTitle();
                deleteTodo.innerText = "- Delete Todo";
                todoHeader.appendChild(deleteTodo);

            wrapEl.appendChild(todoHeader);

            const dueDate = document.createElement('p');
            dueDate.classList.add('todo-due-date');
            // TODO: Format date output to be prettier
            dueDate.innerText = currTodo.getDueDate().toDateString();
            wrapEl.appendChild(dueDate);
            
            const priority = document.createElement('div');
            priority.classList.add('todo-priority');
            priority.classList.add('todo-priority-'+currTodo.getPriority()); // e.g. 'todo-priority-3'
            let priorityText = currTodo.getPriority() + ' - ';
            switch (currTodo.getPriority()) {
                case 1:
                    priorityText += "Very High";
                    break;
                case 2:
                    priorityText += "High";
                    break;
                case 3:
                    priorityText += "Medium";
                    break;
                case 4:
                    priorityText += "Low";
                    break;
                case 5:
                    priorityText += "Very Low";
                    break;
                default:
                    priorityText += "Priority not found.";
            }

            priority.innerText = 'Priority: ' + priorityText;
            wrapEl.appendChild(priority);

            const descriptionText = currTodo.getDescription();
            if (descriptionText) {
                const description = document.createElement('p');
                description.classList.add('todo-description');
                description.innerText = descriptionText;
                wrapEl.appendChild(description);
            }

            const notesArray = currTodo.getNotes();
            if (notesArray && notesArray.length > 0) {
                const notesEl = document.createElement('ul');
                notesEl.classList.add('todo-notes');
                
                for (let j = 0; j < notesArray.length; j++) {
                    const noteText = notesArray[j];
                    const noteEl = document.createElement('li');
                    noteEl.classList.add('todo-note');
                    noteEl.innerText = noteText;
                    notesEl.appendChild(noteEl); 
                }
                wrapEl.appendChild(notesEl);
            }
     
            this.#contentsEl.appendChild(wrapEl);
        }
    }
}

export default Renderer;

export const SORT_BY = {
    DATE_ASCENDING: 'date-asc',
    DATE_DESCENDING: 'date-desc',
    PRIORITY_ASCENDING: 'priority-asc',
    PRIORITY_DESCENDING: 'priority-desc', 
};
