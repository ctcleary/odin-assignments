import Gameboard from "./Gameboard.js";
import MessageBus from "./MessageBus.js";
import Player from "./Player.js";

const PLAYER = {
    ONE: 'playerOne',
    TWO: 'playerTwo',
};

// Game is a "mediator"
class Game {
    constructor(sizeXY = [20,20]) {
        this.size = sizeXY;
        this.bus = new MessageBus();

        this.gameboards = {
            [PLAYER.ONE] : new Gameboard(sizeXY, PLAYER.ONE),
            [PLAYER.TWO] : new Gameboard(sizeXY, PLAYER.TWO),
        };
        
        this.players = {
            [PLAYER.ONE] : new Player(PLAYER.ONE, this.gameboards[PLAYER.ONE], this.gameboards[PLAYER.TWO]),
            [PLAYER.TWO] : new Player(PLAYER.TWO, this.gameboards[PLAYER.TWO], this.gameboards[PLAYER.ONE]),
        };

        this.activePlayer = PLAYER.ONE;
    }

    switchActivePlayer() {
        this.activePlayer = (this.activePlayer === PLAYER.ONE) ? PLAYER.TWO : PLAYER.ONE;
        return this.activePlayer;
    }
}

export { PLAYER }

export default Game;

