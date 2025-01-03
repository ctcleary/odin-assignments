import LinkedList from "./LinkedList";

class HashMap { 
    constructor() {
        this.hashMap = [];
        this.loadFactor = 0.75;
        this.capacity = 16;
        this.hashMap.length = 16;
    }

    hash(key) {
        let hashCode = 0;

        const primeNumber = 31;
        for (let i = 0; i < key.length; i++) {
            hashCode = primeNumber * hashCode + key.charCodeAt(i);
        }

        return hashCode;
    }

    #findBucketNumByHash(hashedKey) {
        return hashedKey % this.capacity;
    }

    #findBucketByKey(key) {
        return this.hashMap[this.#findBucketNumByHash(this.hash(key))];
    }

    #getBucketByIndex(index) {
        if (index < 0 || index >= this.hashMap.length) {
            throw new Error("Trying to access index out of bounds");
        }

        return this.hashMap[index];
    }

    set(key, val) {
        const hashedKey = this.hash(key);
        const bucketNum = this.#findBucketNumByHash(hashedKey);
        let bucket = this.#getBucketByIndex(bucketNum);
        let node;

        if (!bucket) {
            const ll = new LinkedList();
            this.hashMap[bucketNum] = ll;
            bucket = this.hashMap[bucketNum]; // Is this necessary?

        } else if (bucket.size() >= 1) {
            node = this.#findNodeByKey(bucket, key);
            if (node) {
                node.value[key] = val;
                return;
            }
        }

        const obj = {};
        obj[key] = val;
        bucket.append(obj);

        this.#checkShouldIncreaseCapacity();
    }

    #checkShouldIncreaseCapacity() {
        const currLoad = this.length() / this.capacity;
        if (currLoad > this.loadFactor) {
            this.capacity = this.capacity * 2;
            this.hashMap.length = this.capacity;
        }

    }

    #findNodeByKey(bucket, key) {
        if (bucket.isEmpty()) {
            return null;
        }
        let node = bucket.head();

        while (!this.#nodeHasKey(node, key)) {
            if (node.getNext() === null) {
                return null;
            }

            node = node.getNext();
        }

        return node;
    }

    #nodeHasKey(node, key) {
        return Object.keys(node.value)[0] === key;
    }

    get(key) {
        const bucket = this.#findBucketByKey(key);
        if (bucket === null || bucket.isEmpty()) {
            return null;
        }

        let node = bucket.head();
        while (!this.#nodeHasKey(node, key)) {
            node = node.getNext();
            if (node === null) {
                return null;
            }
        }

        return node.value[key];
    }

    has(key) {
        const bucket = this.#findBucketByKey(key);
        if (!bucket) {
            return false;
        }

        const node = this.#findNodeByKey(bucket, key);
        return node ? true : false;
    }

    remove(key) {
        const bucket = this.#findBucketByKey(key);
        if (!bucket) {
            return false;
        }

        let node = bucket.head();

        while (!this.#nodeHasKey(node, key)) {
            node = node.getNext();
            if (node === null) {
                return false;
            }
        }
        const index = bucket.findNode(node);
        bucket.removeAt(index);
        return true;
    }

    length() {
        let ct = 0;

        for (let i = 0; i < this.hashMap.length; i++) {
            const bucket = this.hashMap[i]
            if (bucket) {
                ct += bucket.size();
            }
        }

        return ct;
    }

    clear() {
        this.hashMap = [];
    }

    keys() {
        const result = [];
        for (let i = 0; i < this.hashMap.length; i++) {
            const bucket = this.hashMap[i]
            if (bucket) {
                for (let j = 0; j < bucket.size(); j++) {
                    const nodeVal = bucket.at(j).value;
                    result.push(Object.keys(nodeVal)[0]);
                }
            }
        }

        return result;
    }

    values() {
        const result = [];
        for (let i = 0; i < this.hashMap.length; i++) {
            const bucket = this.hashMap[i]
            if (bucket) {
                for (let j = 0; j < bucket.size(); j++) {
                    const nodeObj = bucket.at(j).value;
                    result.push(Object.values(nodeObj)[0]);
                }
            }
        }

        return result;
    }

    entries() {
        const result = [];
        for (let i = 0; i < this.hashMap.length; i++) {
            const bucket = this.hashMap[i]
            if (bucket) {
                for (let j = 0; j < bucket.size(); j++) {
                    const nodeObj = bucket.at(j).value;
                    result.push([Object.keys(nodeObj)[0], Object.values(nodeObj)[0]]);
                }
            }
        }

        // Returns [[firstKey, firstValue], [secondKey, secondValue] ... ]
        return result;
    }
}


export default HashMap;
