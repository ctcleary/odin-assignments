import AIPlayer, { aiPlayer } from "./AIPlayer.js";
import Gameboard from "./Gameboard.js";
import MessageBus from "./MessageBus.js";
import Player, { PLAYER, AI_PLAYER } from "./Player.js";

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


const AI_PHASE = {
    PREGAME : 'vs-ai-pregame',

    HUMAN_PLACEMENT : AI_PLAYER.HUMAN+'-placement',
    HUMAN_PLACEMENT_COMPLETE : AI_PLAYER.HUMAN+'-placement-complete',
    HUMAN_TURN : AI_PLAYER.HUMAN+'-turn',

    AI_PLACEMENT : 'ai-placement',
    AI_TURN : 'ai-turn',

    POSTGAME : 'vs-ai-postgame'
}

const GAME_TYPE = {
    VS_AI : 'vs-ai',
    PLAYERS : 'players',
};

const AI_TIMEOUT = 500;

// Game is a "mediator"
class Game {
    constructor(gameType = GAME_TYPE.PLAYERS, sizeXY = [10,10]) {
        this.gameType = gameType;
        // this.phase = gameType === GAME_TYPE.PLAYERS ? PHASE.PREGAME : AI_PHASE.PREGAME;
        this.phase = PHASE.PREGAME;
        // this.phase = PHASE.PLAYER_ONE_PLACEMENT;

        this.size = sizeXY;
        
        this.bus = new MessageBus();
        this.registerSubscribers();

        this.gameboards = gameType === GAME_TYPE.PLAYERS ? this.setupGameboards(this.bus) : this.setupGameboardsAI(this.bus);
        
        // Currently unused, consider refactoring to use them for AI mode.
        // this.players = this.setupPlayers(this.gameboards);
        

        this.activePlayer = null;

        this.loser = null;
    }

    changePhase(newPhase, doPublish) {
        console.log('game.changePhase, doPublish ::',newPhase, doPublish);
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

            case AI_PHASE.HUMAN_PLACEMENT :
            case AI_PHASE.HUMAN_PLACEMENT_COMPLETE :
                this.switchActivePlayer(AI_PLAYER.HUMAN);
                break;

            case AI_PHASE.AI_PLACEMENT:
                this.randomizeAllShips(AI_PLAYER.AI);
                this.timeoutAITurn();
                break;
            case AI_PHASE.AI_TURN:
                setTimeout(() => {
                    this.aiAttack(); 
                }, AI_TIMEOUT-100);
                this.timeoutAITurn();
                break;
            default:
                break;
        }

        if (doPublish) {
            this.bus.publish('game-phase-change', { phase: newPhase })
        }

        this.bus.publish('request-render');
    }

    setupGameboards(messageBus) {
        const gameboards = {
            [PLAYER.ONE] : new Gameboard(this, PLAYER.ONE),
            [PLAYER.TWO] : new Gameboard(this, PLAYER.TWO),
        }
        
        gameboards[PLAYER.ONE].setBus(messageBus);
        gameboards[PLAYER.TWO].setBus(messageBus);

        // this.setGameboardShipCoordsDefault(gameboards);

        return gameboards;
    }

    setupGameboardsAI(messageBus) {
        const gameboards = {
            [AI_PLAYER.HUMAN] : new Gameboard(this, AI_PLAYER.HUMAN),
            [AI_PLAYER.AI] : new Gameboard(this, AI_PLAYER.AI),
        }
        
        gameboards[AI_PLAYER.HUMAN].setBus(messageBus);
        gameboards[AI_PLAYER.AI].setBus(messageBus);

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

    setupPlayersAI(gameboards) {
        const players = {
            [AI_PLAYER.HUMAN] : new Player(PLAYER.ONE, gameboards[AI_PLAYER.HUMAN], gameboards[AI_PLAYER.AI]),
            [AI_PLAYER.AI] : new Player(PLAYER.TWO, gameboards[AI_PLAYER.AI], gameboards[AI_PLAYER.HUMAN]),
        }

        return players;
    }

    // Lays out ships in orderly rows.
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

        if (this.gameType === GAME_TYPE.PLAYERS) {
            const newPhase = player === PLAYER.ONE ? PHASE.PLAYER_ONE_PLACEMENT_COMPLETE : PHASE.PLAYER_TWO_PLACEMENT_COMPLETE;
            this.changePhase(newPhase, true);
        } else if (player === AI_PLAYER.HUMAN) {
            const newPhase = AI_PHASE.HUMAN_PLACEMENT_COMPLETE;
            this.changePhase(newPhase, true);
        }
    }

    getPlayerStr(player) {
        if (player === PLAYER.ONE || player === AI_PLAYER.HUMAN) {
            return 'Player One';
        } else if (player === PLAYER.TWO) {
            return 'Player Two';
        } else if (player === AI_PLAYER.AI) {
            return 'The Computer';
        } else {
            return null;
        }
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

    
    changeGameType(gameType) {
        this.gameboards = gameType === GAME_TYPE.PLAYERS ? this.setupGameboards(this.bus) : this.setupGameboardsAI(this.bus);
        this.gameType = gameType;
        this.bus.publish('change-game-type', { gameType: gameType });
    }

    registerSubscribers() {
        this.bus.subscribe('start-game', (data) => {
            this.gameType = data.gameType;
            this.changeGameType(data.gameType);
            if (this.gameType === GAME_TYPE.PLAYERS) {
                this.changePhase(PHASE.PLAYER_ONE_PLACEMENT, true);
            } else {
                this.switchActivePlayer(AI_PLAYER.HUMAN);
                this.changePhase(AI_PHASE.HUMAN_PLACEMENT, true);
            }
        });

        this.bus.subscribe('restart-game', () => {
            this.resetGameboards();
            this.changePhase(PHASE.PREGAME, true);
        });

        this.bus.subscribe('view-hit', (data) => { 
            this.doHit(data.xy, data.phase);
        });

        this.bus.subscribe('view-phase-change', (data) => {
            this.changePhase(data.phase);
        });

        this.bus.subscribe(PLAYER.ONE+'-lose', () => {
            console.log('PLAYER ONE LOSES');
            this.setLoser(PLAYER.ONE);
            this.changePhase(PHASE.POSTGAME, true);
        });
        this.bus.subscribe(PLAYER.TWO+'-lose', () => {
            console.log('PLAYER TWO LOSES');
            this.setLoser(PLAYER.TWO);
            this.changePhase(PHASE.POSTGAME, true);
        });

        this.bus.subscribe(AI_PLAYER.HUMAN+'-lose', () => {
            console.log('PLAYER ONE (HUMAN) LOSES');
            this.setLoser(AI_PLAYER.HUMAN);
            this.changePhase(AI_PHASE.POSTGAME, true);
        });
        this.bus.subscribe(AI_PLAYER.AI+'-lose', () => {
            console.log('AI LOSES');
            this.setLoser(AI_PLAYER.AI);
            this.changePhase(AI_PHASE.POSTGAME, true);
        });

        // from ViwShipPlacer.js
        // data: { shipId: shipObj.id, shipPlayer: shipObj.player, xy: xy, isHori: isHori});
        this.bus.subscribe('ship-placed', (data) => {
            this.shipPlacedHandler(data);
        });
    }

    resetGameboards() {
        if (this.gameType === GAME_TYPE.PLAYERS) {
            this.gameboards = this.setupGameboards(this.bus);
        } else {
            this.gameboards = this.setupGameboardsAI(this.bus);
        }
    }

    setLoser(player) {
        this.loser = player;
        // this.bus.publish('request-render');
    }

    shipPlacedHandler(data) {
        console.log('game heard ship-placed'); // from ViwShipPlacer.js
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

    doHit(xy, phase) {
        let attackedGB;
        let nextPhase;
        switch(phase) {
            case PHASE.PLAYER_ONE_TURN:
                attackedGB = this.gameboards[PLAYER.TWO];
                nextPhase = PHASE.PLAYER_TWO_INTRO_SCREEN;
                // console.log('Game doHit => ', PLAYER.TWO);
                break;
            case PHASE.PLAYER_TWO_TURN:
                attackedGB = this.gameboards[PLAYER.ONE];
                nextPhase = PHASE.PLAYER_ONE_INTRO_SCREEN;
                // console.log('Game doHit => ', PLAYER.ONE);
                break;
            case AI_PHASE.HUMAN_TURN:
                attackedGB = this.gameboards[AI_PLAYER.AI];
                nextPhase = AI_PHASE.AI_TURN;
                // console.log('Game dohit => '+ AI_PLAYER.AI)
                break;
            case AI_PHASE.AI_TURN:
                attackedGB = this.gameboards[AI_PLAYER.HUMAN];
                nextPhase = AI_PHASE.HUMAN_TURN;
                // console.log('Game dohit => '+ AI_PLAYER.HUMAN)
                break;
            default:
                return;
                break;
        }
        if (attackedGB && !attackedGB.isAlreadyHit(xy)) {
            // console.log('attackedGB', attackedGB);
            attackedGB.receiveHit(xy);
            if (attackedGB.allShipsSunk()) {
                this.bus.publish(attackedGB.player+'-lose');
            } else {
                // If nobody lost:
                this.changePhase(nextPhase, true);
            }
        }
    }

    aiAttack() {
        const humanHits = this.gameboards[AI_PLAYER.HUMAN].getHits();
        const xy = aiPlayer.findAttackCoords(humanHits);
        console.log('aiAttack found :: ', xy);
        this.doHit(xy, this.phase);
    }

    timeoutAITurn() {
        setTimeout(() => {
            this.changePhase(AI_PHASE.HUMAN_TURN, true);
        }, AI_TIMEOUT);
    }
}

export { PLAYER, PHASE, AI_PHASE, GAME_TYPE }

export default Game;

