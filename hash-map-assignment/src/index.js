import "./styles.css";
import LinkedList from "./LinkedList.js";
import HashMap from './HashMap.js';

window.LinkedList = LinkedList;

window.llA = new LinkedList([0,1,2,3,4,5,7,8,9]);
window.llB = new LinkedList([1,4,6,7,9,124,509,1025,1403]);

/*

if (index < 0 || index >= buckets.length) {
  throw new Error("Trying to access index out of bounds");
}
  
*/

window.hm = new HashMap();