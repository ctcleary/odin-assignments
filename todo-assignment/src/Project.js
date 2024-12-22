import Todo from "./Todo.js";

class Project {
    static lastId = 0;

    constructor(title, todos) {
        this.id = ++Project.lastId;
        this.title = title ? title.toString() : 'Project ' + this.id;
        this.todos = todos || []; // []
    }

    getId() {
        return this.id;
    }
    
    getTitle() {
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

    removeTodo(todoId) {
        const idx = this.todos.indexOf(this.todos.find((todo) => { return todo.getId() === todoId; }));
        this.todos.splice(idx, 1);
    }

}

export default Project;