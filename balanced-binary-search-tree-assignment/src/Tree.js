import BSTNode from "./BSTNode.js";

class Tree {
    constructor(arr) {
        const arrCopy = arr.slice();

        let sortedArr = arrCopy.sort((a, b) => {
            if (a < b) {
                return -1;
            } else {
                return 1;
            }
        });

        sortedArr = this.#removeDuplicates(sortedArr);

        this.root = this.buildTree(sortedArr);
        
        this.prettyPrint(this.root);
    }

    buildTree(arr) {
        return this.#buildTreeRec(arr, 0, arr.length - 1);
    }

    #buildTreeRec(arr, start, end) {
        if (start > end) {
            return null;
        }

        const arrCopy = arr.slice();
        const midIdx = start + Math.floor((end - start) / 2);
        
        // console.log('mid', arrCopy[midIdx]);

        const node = new BSTNode(arrCopy[midIdx]);

        node.left = this.#buildTreeRec(arrCopy, start, midIdx-1);
        node.right = this.#buildTreeRec(arrCopy, midIdx+1, end);

        return node;
    }

    insert(num) {
        console.log('this', this);
        console.log('this.root', this.root);
        let searchNode = this.root;
        console.log('searchNode', searchNode);

        while (searchNode.left !== null || searchNode.right !== null) {
            if (num < searchNode.data) {
                searchNode = searchNode.left;

            } else if (num > searchNode.data) {
                searchNode = searchNode.right;
            } else {
                console.log('Number is duplicate, returning existing node.');
                return searchNode;
            }
        }

        console.log(searchNode);

        const newNode = new BSTNode(num);

        if (num < searchNode.data) {
            searchNode.left = newNode;

        } else if (num > searchNode.data) {
            searchNode.right = newNode;

        } else {
            // Number is a duplicate, remove;
            console.log('Number is duplicate, returning existing node.');
            return searchNode;
        }
        
        return newNode;
    }

    remove(num) {
        //TODO
    }


        
    #removeDuplicates(arr) {
        const result = arr.slice();

        for (let i = 0; i < result.length; i++) {
            const num = result[i];
            if (num === result[i-1] || num === result[i+1]) {
                result.splice(i, 1);
            }
        }

        return result;
    }

    // This function provided by The Odin Project
    prettyPrint(node, prefix = "", isLeft = true) {
        if (node === null) {
            return;
        }
        if (node.right !== null) {
            this.prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
        }
        console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
        if (node.left !== null) {
            this.prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
        }
    }
}

export default Tree;
