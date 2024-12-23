class Store {
    constructor() {
        // this.controller = controller;
        // this.controller.addEventListener('activeProjectChange', (e) => {
        //     console.log('e : ', e);
        // });
    }

    storeActiveProjectId(projectId) {
        // console.log('localstorage ', projectId)
        localStorage.setItem('activeProjectId', projectId);
    }

    loadActiveProjectId() {
        const activeProjectIdRaw = localStorage.getItem('activeProjectId');
        if (activeProjectIdRaw) {
            const activeProjectId = parseInt(activeProjectIdRaw, 10);
            return activeProjectId;
        } else {
            return null;
        }
    }

    storeTodoSortBy(sortBy) {
        localStorage.setItem('todoSortBy', sortBy);
    }
    loadTodoSortBy() {
        const savedSortBy = localStorage.getItem('todoSortBy');
        if (savedSortBy) {
            return savedSortBy;
        } else {
            return null;
        }

    }

    storeProjects(projectsArray) {
        const result = projectsArray.map((project) => {
            return this.objectifyProject(project);
        });

        // console.log('storeProjects result', result);
        localStorage.setItem('projectsJSON', JSON.stringify(result));
    }

    loadProjects() {
        const json = localStorage.getItem('projectsJSON');
        if (!json) {
            return null;
        }

        const parsedObj = JSON.parse(json);
        console.log('parsedObj', parsedObj);

        return parsedObj;
    }

    objectifyProject(project) {
        const result = {
            project: {
                projectId: project.getId(),
                title: project.getTitle(),
            },
            todos: []
        };

        result.todos = project.getTodos().map((todo) => {
            const mapItem = {
                title: todo.getTitle(),
                dueDate: todo.getDueDate(),
                priority: todo.getPriority(),
                description: todo.getDescription(),
                notes: todo.getNotes().length > 0 ? todo.getNotes() : []
            };

            return mapItem;
        });

        // console.log(result);
        return result;
    }
}

export default Store;