
class Todo {
    static lastId = 0;

    constructor(title, dueDate, priority = 3, description = "", notes = []) {
        this.id = ++Todo.lastId;

        this.title = title.toString();
        this.dueDate = this.#makeValidDate(dueDate);

        this.description = description.toString();
        
        // Valid priority is between 0-5, 
        // 1: "Very High" -- 2: "High"
        // 3: "Medium" (default)
        // 4: "Low" -- 5: "Very Low"
        this.priority = this.#makeValidPriority(priority);

        // Must be an array.
        this.notes = this.#makeValidNotes(notes);
    }

    getId() {
        return this.id;
    }

    getTitle() {
        return this.title; 
    }

    getDescription() {
        return this.description;
    }

    getDueDate() {
        return this.dueDate;
    }

    getPriority() {
        return this.priority;
    }

    getNotes() {
        return this.notes;
    }

    #makeValidDate(val) {
        if (val instanceof Date) {
            return val;
        }

        if (typeof val === "string") {
            const attemptedDate = new Date(val);
            //
            if (isNaN(attemptedDate)) {
                return new Date();
            }
            return attemptedDate;
        }

        return false;
    }
    #makeValidPriority(val) {
        const parsedVal = parseInt(val, 10);
        if (parsedVal >= 0 && parsedVal <= 5) {
            return parsedVal;
        }

        return 3; // Default to "Medium" on invalid priority
    }

    #makeValidNotes(val) {
        if (val instanceof Array) {
            const result = val.map((note) => {
                return note.toString();
            });
            return result;

        } else if (val instanceof String) {
            return [val];
        }

        return ['Invalid notes provided to "new Todo(...)"'];
    }
}

export default Todo;