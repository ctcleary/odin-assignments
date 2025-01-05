import BSTNode from "./BSTNode.js";

class Tree {
    constructor(arr) {
        const sortedArr = this.#sortArrAndRemoveDuplicates(arr);

        this.root = this.buildTree(sortedArr);
        
        this.prettyPrint();
    }

    #sortArrAndRemoveDuplicates(arr) {
        const arrCopy = arr.slice();
        let sortedArr = arrCopy.sort((a, b) => {
            if (a < b) {
                return -1;
            } else {
                return 1;
            }
        });

        sortedArr = this.#removeDuplicates(sortedArr);
        return sortedArr;
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

    buildTree(arr) {
        return this.#buildTreeRec(arr, 0, arr.length - 1);
    }

    #buildTreeRec(arr, start, end) {
        if (start > end) {
            return null;
        }

        const arrCopy = arr.slice();
        const midIdx = start + Math.floor((end - start) / 2);

        const node = new BSTNode(arrCopy[midIdx]);

        node.left = this.#buildTreeRec(arrCopy, start, midIdx-1);
        node.right = this.#buildTreeRec(arrCopy, midIdx+1, end);

        return node;
    }

    insert(num) {
        let searchNode = this.root;

        while (!!searchNode && searchNode.left !== null || searchNode.right !== null) {
            if ((num < searchNode.data && !searchNode.left) || num > searchNode.data && !searchNode.right) {
                // We've reached the proper node to which we'll append data
                break;
            } else if (num < searchNode.data) {
                searchNode = searchNode.left;

            } else if (num > searchNode.data) {
                searchNode = searchNode.right;

            } else if (num === searchNode.data) {
                console.log('Number is duplicate, returning existing node.');
                return searchNode;
            } else {
                throw new Error('Unexpected case reached in Tree.insert().');
            }
        }

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

    // Returns true if the item existed and has been deleted
        // Returns false if `num` was not in the tree.
    deleteItem(num) {
        const newRoot = this.#deleteItem(this.root, num);
        if (newRoot) {
            this.root = newRoot;
            return true;
        }

        return false;
    }

    #deleteItem(treeRoot, num) {
        let searchNode = treeRoot;
        let parent;

        // Find the node where (node.data === num)
          // And keep track of parentage as we iterate
        // If the treeRoot argument is the correct node, this loop will not run
        while (searchNode !== null && searchNode.data !== num) {
            parent = searchNode;

            if (num < searchNode.data) {
                searchNode = searchNode.left;
            } else {
                searchNode = searchNode.right;
            }
        }

        if (searchNode === null) {
            // The node with (node.data === num) does not exist
            return null;
        }

        // We have the correct node in searchNode, reassign for readability
        const targetNode = searchNode;

        // targetNode has only one child
        if (!targetNode.left || !targetNode.right) {
            let singleChild = !!targetNode.left ? targetNode.left : targetNode.right;

            // The targetNode is actually the root,  
                // and it has only one child
            if (parent === null) {
                return singleChild;
            }

            // Reassign targetNode's spot to its `singleChild`
            if (targetNode === parent.left) {
                parent.left = singleChild;
            } else {
                parent.right = singleChild;
            }

            return treeRoot;
        
        } else {
            //targetNode has 2 children

            // Due to the nature of this type of Binary Tree
            // the number to replace targetNode's number will
            // be to the right, then as far down left as it can go
            let tempParent = null;
            let tempNode = targetNode.right;
            while (tempNode.left !== null) {
                tempParent = tempNode;
                tempNode = tempNode.left;
            }

            if (tempParent === null) {
                // the above while() loop never ran because
                // targetNode.right *doesn't have a .left*
                // so simply replace targetNode.right with targetNode.right.right
                    // tempNode is now floating/unattached to the tree
                targetNode.right = tempNode.right;
            } else {
                // targetNode.right.left exists
                // tempNode is as far down left from targetNode.right.left as it can go
                // Replace tempParent.left with tempNode.right (could be `null`)
                    // tempNode is now floating/unattached to the tree.
                tempParent.left = tempNode.right;
            }

            // replace the "deleted" targetNode's number with the tempNode's number
            targetNode.data = tempNode.data;
        }

        // return the modified tree
        return treeRoot;
    }

    levelOrder(cb) {
        if (!cb || typeof cb !== 'function') {
            throw new Error('Callback function is required :: Tree.levelOrder(cb).')
        }

        // Create a Queue
        this.q = [];
        this.q.push({ node: this.root });

        let searchNode;

        while (this.q.length > 0) {
            // Pull the first item off the Queue
            searchNode = this.q.shift().node;

            cb(searchNode);

            if (!!searchNode.left) {
                this.q.push({ node: searchNode.left });
            }

            if (!!searchNode.right) {
                this.q.push({ node: searchNode.right });
            }
        }
    }

    preOrder(cb) {
        if (!cb || typeof cb !== 'function') {
            throw new Error('Callback function is required :: Tree.preOrder(cb).')
        }

        this.#preOrderRec(this.root, cb);
    }

    #preOrderRec(node, cb) {
        if (node === null) {
            return null;
        }

        cb(node);
        this.#preOrderRec(node.left, cb);
        this.#preOrderRec(node.right, cb);
    }

    inOrder(cb) {
        if (!cb || typeof cb !== 'function') {
            throw new Error('Callback function is required :: Tree.inOrder(cb).')
        }

        this.#inOrderRec(this.root, cb);
    }

    #inOrderRec(node, cb) {
        if (node === null) {
            return null;
        }

        this.#inOrderRec(node.left, cb);   
        cb(node);
        this.#inOrderRec(node.right, cb);
    }


    postOrder(cb) {
        if (!cb || typeof cb !== 'function') {
            throw new Error('Callback function is required :: Tree.postOrder(cb).')
        }

        this.#postOrderRec(this.root, cb);
    }

    #postOrderRec(node, cb) {
        if (node === null) {
            return null;
        }

        this.#postOrderRec(node.left, cb);   
        this.#postOrderRec(node.right, cb);
        cb(node);
    }


    find(num) {
        // return this.#findBreadthFirst(num);
        return this.#findDepthFirst(num);
    }

    #findBreadthFirst(num) {
        // Create a Queue
        this.q = [];
        this.q.push({ node: this.root });

        let searchNode;

        while (this.q.length > 0) {
            // Pull the first item off the Queue
            searchNode = this.q.shift().node;

            if (searchNode.data === num) {
                return searchNode;
            }

            if (!!searchNode.left) {
                this.q.push({ node: searchNode.left });
            }

            if (!!searchNode.right) {
                this.q.push({ node: searchNode.right });
            }
        }

        return null;
    }

    #findDepthFirst(num) {
        return this.#findDepthFirstRec(this.root, num);
    }

    #findDepthFirstRec(node, num) {;
        if (node === null) {
            return null;
        }

        if (node.data === num) {
            return node;
        }
        
        let result;

        result = this.#findDepthFirstRec(node.left, num);   

        if (!result) {
            result = this.#findDepthFirstRec(node.right, num);
        }

        if (result) {
            return result;
        }

        return false;
    }

    // Uses breadth-first traversal to track height as it follows every
        // path until it finds a leaf node, at which point
        // it adds the height re: that leaf node to `heightsArray`,
        // then returns the highest height in `heightsArray`
    height(node) {
        if (!node.left && !node.right) {
            // Is leaf.
            return 0;
        }
        
        // Create a Queue
        this.q = [];
        this.q.push({ node: node, height: 0 });
        
        let heightsArray = [];
        let searchObj;
        let searchNode;

        while (this.q.length > 0) {
            // Pull the first item off the Queue
            searchObj = this.q.shift();
            searchNode = searchObj.node;

            if (!!searchNode.left) {
                this.q.push({ node: searchNode.left, height: searchObj.height + 1 });
            }

            if (!!searchNode.right) {
                this.q.push({ node: searchNode.right, height: searchObj.height + 1 });
            }

            if (!searchNode.left && !searchNode.right) {
                // Found a leaf node, push its `height` to `heightsArray`
                heightsArray.push(searchObj.height);
            }
        }

        // Return highest value from `heightsArray`
        heightsArray.sort();
        return heightsArray.pop();
    }

    depth(depthNode) {
        // Create a Queue
        this.q = [];
        this.q.push({ node: this.root, depth: 0 });

        let searchObj;

        while (this.q.length > 0) {
            // Pull the first item off the Queue
            searchObj = this.q.shift();

            if (searchObj.node === depthNode) {
                return searchObj.depth;
            }

            if (!!searchObj.node.left) {
                this.q.push({ node: searchObj.node.left, depth: searchObj.depth + 1 });
            }

            if (!!searchObj.node.right) {
                this.q.push({ node: searchObj.node.right, depth: searchObj.depth + 1 });
            }
        }

        return null;
    }


    // Uses breadth-first traversal to push every value in
        // the tree to an array and returns that array
    values() {
        // Create a Queue
        this.q = [];
        this.q.push({ node: this.root });

        const valuesArray = [];
        let searchNode;

        while (this.q.length > 0) {
            // Pull the first item off the Queue
            searchNode = this.q.shift().node;

            valuesArray.push(searchNode.data);

            if (!!searchNode.left) {
                this.q.push({ node: searchNode.left });
            }

            if (!!searchNode.right) {
                this.q.push({ node: searchNode.right });
            }
        }

        return valuesArray;
    }

    isBalanced() {
        // TODO

        const leftHeight = this.root.left ? this.height(this.root.left) : 0;
        const rightHeight = this.root.right ? this.height(this.root.right) : 0;

        if (leftHeight > rightHeight+1 || leftHeight < rightHeight-1) {
            return false;
        }

        return true;
    }


    rebalance() {
        // Skip rebalancing if not needed
        if (this.isBalanced()) {
            return false;
        }
        const valuesArr = this.values();
        const sortedArr = this.#sortArrAndRemoveDuplicates(valuesArr);
        this.root = this.buildTree(sortedArr);
        return true;
    }




    // ---------------------------------------------

    // ------------- CONSOLE PRINTING --------------

    prettyPrint() {
        this.#prettyPrint(this.root);
    }

    // This function provided by The Odin Project
    #prettyPrint(node, prefix = "", isLeft = true) {
        if (node === null) {
            return;
        }
        if (node.right !== null) {
            this.#prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
        }
        console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
        if (node.left !== null) {
            this.#prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
        }
    }
}

export default Tree;
