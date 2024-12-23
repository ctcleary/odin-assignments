class Renderer {
    constructor() {

    }

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

    
    renderTodos(todos, contentsEl) {
        if (todos.length === 0) {
            const noTodosEl = document.createElement('div');
            noTodosEl.innerText = "No Todos for this project yet!";
            contentsEl.appendChild(noTodosEl);
            return;
        }

        for (let i = 0; i < todos.length; i++) {
            const currTodo = todos[i];

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
            let priorityText;
            switch (currTodo.getPriority()) {
                case 1:
                    priorityText = "Very High";
                    break;
                case 2:
                    priorityText = "High";
                    break;
                case 3:
                    priorityText = "Medium";
                    break;
                case 4:
                    priorityText = "Low";
                    break;
                case 5:
                    priorityText = "Very Low";
                    break;
                default:
                    priorityText = "Priority not found.";
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
     
            contentsEl.appendChild(wrapEl);
        }
    }
}

export default Renderer;