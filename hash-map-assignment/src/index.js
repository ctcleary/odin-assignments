import "./styles.css";
import LinkedList from "./LinkedList.js";
import HashMap from './HashMap.js';

window.HashMap = HashMap;

const test = new HashMap();
test.set('apple', 'red')
test.set('banana', 'yellow')
test.set('carrot', 'orange')
test.set('dog', 'brown')
test.set('elephant', 'gray')
test.set('frog', 'green')
test.set('grape', 'purple')
test.set('hat', 'black')
test.set('ice cream', 'white')
test.set('jacket', 'blue')
test.set('kite', 'pink')
test.set('lion', 'golden')

// 13th, force the HashMap to expand capacity
test.set('moon', 'silver')

window.hmA = test;

const test2 = new HashMap();
test2.set('Carlos', 'CarlosNameTag');
test2.set('Carla', 'CarlaNameTag');
test2.set('Alex', 'AlexNameTag');

window.hmB = test2;