import Gameboard from "./Gameboard.js";
import MessageBus from "./MessageBus.js";
import Player, { PLAYER } from "./Player.js";
import PANE from "./View.js";

// Game is a "mediator"
class Game {
    constructor(sizeXY = [10,10]) {
        this.size = sizeXY;

        this.gameboards = {
            [PLAYER.ONE] : new Gameboard(sizeXY, PLAYER.ONE),
            [PLAYER.TWO] : new Gameboard(sizeXY, PLAYER.TWO),
        };
        
        this.players = {
            [PLAYER.ONE] : new Player(PLAYER.ONE, this.gameboards[PLAYER.ONE], this.gameboards[PLAYER.TWO]),
            [PLAYER.TWO] : new Player(PLAYER.TWO, this.gameboards[PLAYER.TWO], this.gameboards[PLAYER.ONE]),
        };

        this.activePlayer = PLAYER.ONE;
        
        this.bus = new MessageBus();
        this.registerSubscribers();
    }

    switchActivePlayer() {
        this.activePlayer = (this.activePlayer === PLAYER.ONE) ? PLAYER.TWO : PLAYER.ONE;
        return this.activePlayer;
    }

    registerSubscribers() {
        this.bus.subscribe('view-hit', this.doHit);
    }

    doHit(data) {
        console.log('Game doHit ', data)
        let attackedGB;
        switch(data.pane) {
            case PANE.PLAYER_ONE_TURN:
                attackedGB = this.gameboards[PLAYER.TWO];
                break;
            case PANE.PLAYER_TWO_TURN:
                attackedGB = this.gameboards[PLAYER.ONE];
                break;
            case PANE.PREGAME:
            case PANE.POSTGAME:
            case PANE.SCREEN:
                break;
        }
        if (attackedGB && !attackedGB.isAlreadyHit(data.xy)) {
            const wasShipHit = attackedGB.receiveHit(data.xy);

        }
    }
}

export { PLAYER }

export default Game;

