import LinkedList from "./LinkedList";

class HashMap { 
    constructor() {
        this.hashMap = [];
        this.loadFactor = null;
        this.capacity = 16;
    }

    hash(key) {
        let hashCode = 0;

        const primeNumber = 31;
        for (let i = 0; i < key.length; i++) {
            hashCode = primeNumber * hashCode + key.charCodeAt(i);
        }

        console.log('hashCode', hashCode);
        return hashCode;
    }

    findBucketNum(hashedKey) {
        return hashedKey % this.capacity;
    }

    set(key, val) {
        const hashedKey = this.hash(key);
        const bucketNum = this.findBucketNum(hashedKey);
        let bucket = this.hashMap[bucketNum];

        if (!bucket) {
            const ll = new LinkedList();
            this.hashMap[bucketNum] = {
                key: key,
                values: ll
            }
            bucket = this.hashMap[bucketNum].list;
        } 
         
        bucket.append([key, val]);
    }

    get(key) {
        const hashedKey = this.hash(key);
        const bucketNum = this.findBucketNum(hashedKey);
        const bucket = this.hashMap[bucketNum];
        if (bucket === null || bucket.isEmpty()) {
            return;
        }

        let node = bucket.at(0);
        console.log('node.value', node.value);
        while (node.value[0] !== key) {
            node = node.getNext();
            if (node === null) {
                return false;
            }
        }

        return node.value;
    }

    has(key) {

    }

    remove(key) {

    }

    length() {

    }

    clear() {

    }

    keys() {

    }

    values() {

    }

    entries() {

        // Returns [[firstKey, firstValue], [secondKey, secondValue] ... ]
    }
}


export default HashMap;
