import Gameboard from "./Gameboard.js";
import MessageBus from "./MessageBus.js";
import Player, { PLAYER } from "./Player.js";
import PANE from "./View.js";

// Game is a "mediator"
class Game {
    constructor(sizeXY = [10,10]) {
        this.size = sizeXY;
        
        this.bus = new MessageBus();
        this.registerSubscribers();


        this.gameboards = this.setupGameboards(sizeXY, this.bus);

        
        this.players = this.setupPlayers(this.gameboards);

        this.activePlayer = PLAYER.ONE;
        
    }

    setupGameboards(sizeXY, messageBus) {
        const gameboards = {
            [PLAYER.ONE] : new Gameboard(sizeXY, PLAYER.ONE),
            [PLAYER.TWO] : new Gameboard(sizeXY, PLAYER.TWO),
        }
        
        gameboards[PLAYER.ONE].setBus(messageBus);
        gameboards[PLAYER.TWO].setBus(messageBus);

        this.setGameboardShipCoordsDefault(gameboards);

        return gameboards;
    }

    setupPlayers(gameboards) {
        const players = {
            [PLAYER.ONE] : new Player(PLAYER.ONE, gameboards[PLAYER.ONE], gameboards[PLAYER.TWO]),
            [PLAYER.TWO] : new Player(PLAYER.TWO, gameboards[PLAYER.TWO], gameboards[PLAYER.ONE]),
        }

        return players;
    }

    setGameboardShipCoordsDefault(gameboards) {
        [
            gameboards[PLAYER.ONE], 
            gameboards[PLAYER.TWO]
        ].forEach((board) => {
            board.setShipCoords('4-1', [1,1], true);

            board.setShipCoords('3-1', [1,3], true);
            board.setShipCoords('3-2', [5,3], true);
        
            board.setShipCoords('2-1', [1,5], true);
            // board.setShipCoords('2-2', [4,5], true);
            board.setShipCoords('2-2', [4,5], false); // for testing vert
            board.setShipCoords('2-3', [7,5], true);
        
            board.setShipCoords('1-1', [1,7], true);
            board.setShipCoords('1-2', [3,7], true);
            board.setShipCoords('1-3', [5,7], true);
            board.setShipCoords('1-4', [7,7], true);
        });
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

