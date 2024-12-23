import Todo from "./Todo.js";

class Project {
    static lastId = 0;

    constructor(title, todos, overrideId = null) {
        if (overrideId) {
            this.id = overrideId;
            if (overrideId > Project.lastId) {
                Project.lastId = overrideId;
            }
        } else {
            this.id = ++Project.lastId;
        }
        this.title = title ? title.toString() : 'Project ' + this.id;
        this.todos = todos || []; // []
    }

    getId() {
        return this.id;
    }

    getTitle() {
        return this.title;
    }

    setTitle(newTitle) {
        this.title = newTitle;
        return this.title;
    }

    getTodos() {
        return this.todos.slice(); // Make a copy to protect internal data
    }

    addTodo(todo) {
        if (todo instanceof Todo) {
            this.todos.push(todo);
        } else {
            throw new Error('Invalid argument provided to Project.addTodo(). Must be an instance of Todo. To create a new Todo using Project methods, use "Project.addNewTodo(...)"')
        }
    }

    // sortTodos() {
    //     console.log("TODO, sort todos by date / priority");
    // }

    deleteTodo(todoId) {
        const parsedTodoId = parseInt(todoId, 10);
        const todoToDelete = this.todos.find((todo) => { 
            return todo.getId() === parsedTodoId; 
        });

        const idx = this.todos.indexOf(todoToDelete);
        // console.log('Project.deleteTodo -- idx', idx);
        this.todos.splice(idx, 1);
    }

}

export default Project;