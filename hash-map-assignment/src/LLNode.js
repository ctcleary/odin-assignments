
class LLNode {
    constructor(val = null, next = null) {
        this.value = val;
        this.nextNode = next; // type LLNode
    }

    setNext(nextNode) {
        this.nextNode = nextNode;
    }

    getNext() {
        return this.nextNode;
    }
}

export default LLNode;