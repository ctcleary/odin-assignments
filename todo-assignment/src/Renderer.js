class Renderer {
    constructor() {

    }

    renderProjects(projects, projectsEl) {
        for (let i = 0; i < projects.length; i++) {
            const project = projects[i];

            const projectEl = document.createElement('div');
            projectEl.classList.add('project-nav')
            
            const title = document.createElement('button');
            title.classList.add('project-nav-button');
            title.innerText = project.getTitle();
            projectEl.appendChild(title);

            const numTodos = document.createElement('div');
            numTodos.classList.add('project-num-todos');
            numTodos.innerText = `( ${project.getTodos().length} )`;
            projectEl.appendChild(numTodos);

            projectsEl.appendChild(projectEl);
        }
    }

    
    renderTodos(todos, contentsEl) {
        for (let i = 0; i < todos.length; i++) {
            const currTodo = todos[i];

            const wrapEl = document.createElement('div');
            wrapEl.classList.add('todo');

            const title = document.createElement('h2');
            title.classList.add('todo-title');
            title.innerText = currTodo.getTitle();
            wrapEl.appendChild(title);

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