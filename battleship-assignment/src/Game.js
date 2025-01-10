import Gameboard from "./Gameboard.js";
import Player from "./Player.js";

const PLAYER = {
    ONE: 'playerOne',
    TWO: 'playerTwo',
};

class Game {
    constructor(sizeXY = [20,20]) {
        this.size = sizeXY;

        this.gameboards = {
            playerOne : new Gameboard(sizeXY, PLAYER.ONE),
            playerTwo : new Gameboard(sizeXY, PLAYER.TWO),
        };
        
        this.playerOne = new Player(this.gameboards.playerOne, this.gameboards.playerTwo);
        this.playerTwo = new Player(this.gameboards.playerTwo, this.gameboards.playerOne);
    }
}

export { PLAYER }

export default Game;

