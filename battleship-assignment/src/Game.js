import Gameboard from "./Gameboard.js";
import MessageBus from "./MessageBus.js";
import Player, { PLAYER } from "./Player.js";

const PHASE = {
    PREGAME : 'pregame',

    PLAYER_ONE_PLACEMENT : PLAYER.ONE+'-placement',
    PLAYER_ONE_PLACEMENT_COMPLETE : PLAYER.ONE+'-placement-complete',

    PLAYER_TWO_PLACEMENT : PLAYER.TWO+'-placement',
    PLAYER_TWO_PLACEMENT_COMPLETE : PLAYER.TWO+'-placement-complete',

    PLAYER_ONE_INTRO_SCREEN : PLAYER.ONE+'-intro-screen',
    PLAYER_ONE_TURN : PLAYER.ONE+'-turn',

    PLAYER_TWO_INTRO_SCREEN : PLAYER.TWO+'-intro-screen',
    PLAYER_TWO_TURN : PLAYER.TWO+'-turn',
    
    SCREEN : 'screen',

    POSTGAME : 'postgame',
}

// Game is a "mediator"
class Game {
    constructor(sizeXY = [10,10]) {
        this.size = sizeXY;
        
        this.bus = new MessageBus();
        this.registerSubscribers();

        this.gameboards = this.setupGameboards(this.bus);
        this.players = this.setupPlayers(this.gameboards);
        
        // Start here, naturally.
        this.phase = PHASE.PREGAME;

        this.activePlayer = PLAYER.ONE;

        this.loser = null;
    }

    changePhase(newPhase, doPublish) {
        console.log(newPhase);
        this.phase = newPhase;
        switch(newPhase) {
            case PHASE.PREGAME :
            case PHASE.SCREEN :
            case PHASE.POSTGAME :
                this.unsetActivePlayer();
                break;

            case PHASE.PLAYER_ONE_PLACEMENT :
            case PHASE.PLAYER_ONE_PLACEMENT_COMPLETE :
            case PHASE.PLAYER_ONE_INTRO_SCREEN :
            case PHASE.PLAYER_ONE_TURN :
                this.switchActivePlayer(PLAYER.ONE);
                break;

            case PHASE.PLAYER_TWO_PLACEMENT :
            case PHASE.PLAYER_TWO_PLACEMENT_COMPLETE :
            case PHASE.PLAYER_TWO_INTRO_SCREEN :
            case PHASE.PLAYER_TWO_TURN :
                this.switchActivePlayer(PLAYER.TWO);
                break;
            default:
                break;
        }

        // switch(newPhase) {
        //     case PHASE.PREGAME :
        //         break;
        //     case PHASE.SCREEN :
        //         break;
        //     case PHASE.POSTGAME :
        //         break;

        //     case PHASE.PLAYER_ONE_PLACEMENT :
        //         break;
        //     case PHASE.PLAYER_ONE_PLACEMENT_COMPLETE :
        //         break;
        //     case PHASE.PLAYER_ONE_INTRO_SCREEN :
        //         break;
        //     case PHASE.PLAYER_ONE_TURN :
        //         break;

        //     case PHASE.PLAYER_TWO_PLACEMENT :
        //         break;
        //     case PHASE.PLAYER_TWO_PLACEMENT_COMPLETE :
        //         break;
        //     case PHASE.PLAYER_TWO_INTRO_SCREEN :
        //         break;
        //     case PHASE.PLAYER_TWO_TURN :
        //         break;
        //     default:
        //         break;
        // }

        if (doPublish) {
            this.bus.publish('game-phase-change', { phase: newPhase })
        }
        this.bus.publish('request-render');
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
        gb.unplaceAllShips();
        this.bus.publish('request-render');
    }

    randomizeAllShips(player) {
        const gb = this.gameboards[player];
        gb.unplaceAllShips();
        gb.randomizeAllShips();

        const newPhase = player === PLAYER.ONE ? PHASE.PLAYER_ONE_PLACEMENT_COMPLETE : PHASE.PLAYER_TWO_PLACEMENT_COMPLETE;
        this.changePhase(newPhase, true);
    }

    unsetActivePlayer() {
        this.activePlayer = null;
    }

    switchActivePlayer(player = null) {
        if (player) {
            this.activePlayer = player;
        } else {
            this.activePlayer = (this.activePlayer === PLAYER.ONE) ? PLAYER.TWO : PLAYER.ONE;
        }
        return this.activePlayer;
    }

    registerSubscribers() {
        this.bus.subscribe('view-hit', (data) => { 
            this.doHit(data) 
        });

        this.bus.subscribe('view-phase-change', (data) => {
            this.changePhase(data.phase);
        });

        this.bus.subscribe(PLAYER.ONE+'-lose', () => {
            console.log('PLAYER ONE LOSES');
            this.loser = PLAYER.ONE;
            this.changePhase(PHASE.POSTGAME, true);
        });
        this.bus.subscribe(PLAYER.TWO+'-lose', () => {
            console.log('PLAYER TWO LOSES');
            this.loser = PLAYER.TWO;
            this.changePhase(PHASE.POSTGAME, true);
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
        let attackedGB;
        let nextPhase;
        switch(data.phase) {
            case PHASE.PLAYER_ONE_TURN:
                attackedGB = this.gameboards[PLAYER.TWO];
                nextPhase = PHASE.PLAYER_TWO_INTRO_SCREEN;
                console.log('Game doHit => ', PLAYER.TWO);
                break;
            case PHASE.PLAYER_TWO_TURN:
                attackedGB = this.gameboards[PLAYER.ONE];
                nextPhase = PHASE.PLAYER_ONE_INTRO_SCREEN;
                console.log('Game doHit => ', PLAYER.ONE);
                break;
            default:
                return;
                break;
        }
        if (attackedGB && !attackedGB.isAlreadyHit(data.xy)) {
            console.log('attackedGB', attackedGB);
            attackedGB.receiveHit(data.xy);
            if (attackedGB.allShipsSunk()) {
                this.bus.publish(attackedGB.player+'-lose');
            } else {
                // If nobody lost:
                this.changePhase(nextPhase, true);
            }
        }

        // this.bus.publish('game-hit-done', { game: this });
    }
}

export { PLAYER }
export { PHASE }

export default Game;

