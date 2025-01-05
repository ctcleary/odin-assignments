import "./styles.css";
import Tree from "./Tree";

function randArrBelow100(ct = 13) {
    const arr = [];

    for (let i = 0; i < ct; i++) {
        arr.push(Math.round(Math.random()*100));
    }

    return arr;
}

function randIntAbove100() {
    return 100 + Math.round(Math.random()*100);
}

// const tree = new Tree([1, 7, 4, 23, 8, 9, 4, 3, 5, 9, 72, 6345, 324, 160, 170, 220, 180, 219, 220, 221, 222, 223, 82, 65, 110, 15])
const tree = new Tree(randArrBelow100(23));
window.tree = tree;

// Unbalance the tree
// tree.insert(randIntAbove100());
// tree.insert(randIntAbove100());
// tree.insert(randIntAbove100());
// tree.insert(randIntAbove100());

// Print unbalanced tree
// tree.prettyPrint();