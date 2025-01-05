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

        return false;
    }

    #findDepthFirst(num) {
        return this.#findDepthFirstRec(this.root, num);
    }

    #findDepthFirstRec(node, num) {
        // console.log('Node:', !!node ? node.data : null);
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
