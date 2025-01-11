import Gameboard from "./src/Gameboard.js";
import Game from "./src/Game.js";
import Ship from "./src/Ship.js";
import View from "./src/View.js";

window.Game = Game;
window.View = View;
window.Ship = Ship;

console.log('main.js loaded');
const game = new Game();