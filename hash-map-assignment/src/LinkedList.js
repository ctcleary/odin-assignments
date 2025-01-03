import LLNode from "./LLNode.js"

class LinkedList {
    constructor(valsArr = null) {
        this.list = new LLNode();

        if (valsArr === null) {
            return;
        }
        
        for (let i = 0; i < valsArr.length; i++) {
            this.append(valsArr[i]);
        }

    }

    tail() {
        return this.#findTail();
    }
    
    #findTail(node = null) {
        const searchNode = node || this.list;

        if (searchNode.getNext() === null) {
            return searchNode;
        }

        return this.#findTail(searchNode.getNext());
    }

    head() {
        return this.list;
    }

    size() {
        return this.#findSize();
    }

    #findSize() {
        let searchNode = this.list;
        let i = 1;

        while (searchNode.getNext() !== null) {
            i += 1;
            searchNode = searchNode.getNext();
        }

        return i;
    }

    at(index) {
        if (index === 0) {
            return this.list;
        }

        let searchNode = this.list;
        let i = 0;

        while(i < index) {
            searchNode = searchNode.getNext();
            i += 1;
        }

        return searchNode;
    }

    isEmpty() {
        return this.list.value === null && this.list.nextNode === null;
    }

    append(val) {
        const node = new LLNode(val, null);

        if (this.isEmpty()) { // Initial empty list.
            this.list = node;
        } else {
            this.tail().setNext(node);
        }
    }

    prepend(val) {
        let node;
        if (this.isEmpty()) {
            node = new LLNode(val, null);
        } else {
            node = new LLNode(val, this.list)
        }
        this.list = node;
    }

    pop() {
        if (this.isEmpty()) {
            return;
        }

        let searchNode = this.list;

        while (searchNode) {
            if (searchNode.getNext().getNext() === null) {
                // Reached penultimate node
                searchNode.setNext(null);
                searchNode = null;
            } else {
                searchNode = searchNode.getNext();
            }
        }
    }

    insertAt(val, index) {
        if (index === 0) {
            this.prepend(val);
            return;
        }

        const newNode = new LLNode(val);

        let searchNode = this.list;

        let prevNode;
        let postNode;

        for (let i = 0; i < index; i++) {
            if (i + 1 === index) {
                prevNode = searchNode;
                postNode = searchNode.getNext();
            } else {
                searchNode = searchNode.getNext();
            }
        }

        prevNode.setNext(newNode);
        newNode.setNext(postNode);
    }

    removeAt(index) {
        if (index === 0) {
            this.list = this.list.getNext();
            return;
        }

        let searchNode = this.list;

        let prevNode;
        let postNode;

        for (let i = 0; i < index; i++) {
            if (i + 1 === index) {
                prevNode = searchNode;
                postNode = searchNode.getNext().getNext();
            } else {
                searchNode = searchNode.getNext();
            }
        }

        prevNode.setNext(postNode);
    }

    contains(value) {
        if (this.list.value === value) {
            return this.list;
        }

        let searchNode = this.list;

        while (searchNode) {
            if (searchNode.value === value) {
                return true;
            } else if (searchNode.getNext() === null) {
                return false;
            }

            searchNode = searchNode.getNext();
        }

        return false;
    }

    find(value) {
        if (this.list.value === value) {
            return this.list;
        }

        let searchNode = this.list;
        let i = 0;

        while (searchNode) {
            if (searchNode.value === value) {
                return i;
            } else if (searchNode.getNext() === null) {
                return;
            }

            i += 1;
            searchNode = searchNode.getNext();
        }
        
        return false;
    }

    toString(searchNode = null) {
        if (searchNode === null) {
            searchNode = this.list;
        }
        
        if (searchNode.getNext() === null) {
            return `( ${searchNode.value} ) -> null`;
        }

        return `( ${searchNode.value} ) -> ` + this.toString(searchNode.getNext());
    }
}

export default LinkedList;
