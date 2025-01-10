class MessageBus{
    constructor() {
        this.events = [];
        this.lastId = 0;
    }

    subscribe(eventName, callback) {
        const id = this.lastId++;
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push({ id: id, cb: callback });
        return id;
    }

    unsubscribe(eventName, id) {
        const idx = this.events[eventName].findIndex((subObj) => {
            return subObj.id === id;
        });

        this.events[eventName].splice(idx, 1);
    }

    publish(eventName, data) {
        if (!this.events[eventName]) {
            return;
        }

        this.events[eventName].forEach((subObj) => {
            subObj.cb(data);
        });
    }
}

export default MessageBus;
