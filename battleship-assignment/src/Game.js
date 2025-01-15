import Gameboard from "./Gameboard.js";
import MessageBus from "./MessageBus.js";
import Player, { PLAYER } from "./Player.js";
import { PANE } from "./View.js";

// Game is a "mediator"
class Game {
    constructor(sizeXY = [10,10]) {
        this.size = sizeXY;
        
        this.bus = new MessageBus();
        this.registerSubscribers();

        this.gameboards = this.setupGameboards(this.bus);
        this.players = this.setupPlayers(this.gameboards);

        this.activePlayer = PLAYER.ONE;

        this.loser = null;
    }

    setupGameboards(sizeXY, messageBus) {
        const gameboards = {
            [PLAYER.ONE] : new Gameboard(this, PLAYER.ONE),
            [PLAYER.TWO] : new Gameboard(this, PLAYER.TWO),
        }
        
        gameboards[PLAYER.ONE].setBus(messageBus);
        gameboards[PLAYER.TWO].setBus(messageBus);

        // this.setGameboardShipCoordsDefault(gameboards);

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
            // board.setShipCoords('3-2', [5,3], true);
            board.setShipCoords('3-2', [5,3], false);
        
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

    unplaceAllShips(player) {
        const gb = this.gameboards[player];
        const ships = gb.getShips().map((shipObj) => { return shipObj.ship });
        ships.forEach((ship) => {
            ship.setShipCoords([-1,-1], true);
        });
        this.bus.publish('request-render');
    }
    randomizeAllShips(player) {
        console.log('TODO Game.randomizeAllShips(player)')
    }

    switchActivePlayer() {
        this.activePlayer = (this.activePlayer === PLAYER.ONE) ? PLAYER.TWO : PLAYER.ONE;
        return this.activePlayer;
    }

    registerSubscribers() {
        this.bus.subscribe('view-hit', (data) => { this.doHit(data) });
        this.bus.subscribe(PLAYER.ONE+'-lose', () => {
            console.log('PLAYER ONE LOSES');
        });
        this.bus.subscribe(PLAYER.TWO+'-lose', () => {
            console.log('PLAYER TWO LOSES');
        });

        // this.bus.publish('ship-placed', { shipId: shipObj.id, shipPlayer: shipObj.player, xy: xy, isHori: isHori});
        this.bus.subscribe('ship-placed', (data) => {
            this.shipPlacedHandler(data);
        });

        this.bus.subscribe(PLAYER.ONE+'-lose', () => {
            this.setLoser(PLAYER.ONE);
        });
        this.bus.subscribe(PLAYER.TWO+'-lose', () => {
            this.setLoser(PLAYER.TWO);
        });
    }

    setLoser(player) {
        this.loser = player;
        this.bus.publish('request-render');
    }

    shipPlacedHandler(data) {
        console.log('game heard ship-placed');
        const player = data.player;
        const shipId = data.shipId;

        const xy = data.xy;
        const isHori = data.isHori;

        const shipObj = this.gameboards[player].getShipByID(shipId);
        shipObj.ship.setShipCoords(xy, isHori);

        const allShipsPlaced = this.gameboards[player].allShipsPlaced();
        
        if (allShipsPlaced) {
            this.bus.publish('placement-complete');
        }
        this.bus.publish('request-render');
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
            console.log('attackedGB', attackedGB);
            attackedGB.receiveHit(data.xy);
            this.bus.publish('game-hit-done', { game: this });
        }

        // this.bus.publish('game-hit-done', { game: this });
    }
}

export { PLAYER }

export default Game;

