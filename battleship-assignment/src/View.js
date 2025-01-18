import Player, { AI_PLAYER, PLAYER } from "./Player.js";
import ViewShipPlacer from "./ViewShipPlacer.js";
import { AI_PHASE, GAME_TYPE, PHASE } from "./Game.js";


class View {
    constructor(game, gameContainerEl) {
        this.game = game;

        // this.renderFunc = this.game.gameType === GAME_TYPE.PLAYERS ? this.render : this.renderAI;

        this.bus = game.bus;
        this.gameContainerEl = gameContainerEl;

        this.phase = game.phase;

        this.shipPlacers = [];
        
        this.registerSubscribers();
    }

    reRender() {
        this.gameContainerEl.innerHTML = '';
        // console.log(this.renderFunc);
        this.gameContainerEl.appendChild(this.render());
    }

    // Returns the top DOM Node.
    render() {
        if (this.game.gameType === GAME_TYPE.PLAYERS) {
            return this.renderPVP();
        } else if (this.game.gameType === GAME_TYPE.AI) {
            return this.renderAI();
        } else {
            throw new Error('Game.gameType is not correctly set!');
        }
    }

    renderPVP() {
        console.log('View.render(game)');
        const result = this.giveDiv([ 'boards-container' ]);
        // result.classList.add(this.game.activePlayer === PLAYER.ONE ? 'playerOne-turn' : 'playerTwo-turn');
        result.classList.add('phase-'+this.phase);
        if (this.game.loser) {
            result.classList.add('loser-'+this.game.loser);
        }

        const debugPhaseText = document.getElementById('debug-current-phase');
        if (debugPhaseText) {
            debugPhaseText.innerText = 'DEBUG - CURRENT PHASE: "' + this.phase + '"';
        }

        // const tempPhase = document.createElement('h5');
        // tempPhase.innerText = 'DEBUG - CURRENT PHASE: "' + this.phase + '"';
        // tempPhase.classList.add('temp-phase')
        // result.appendChild(tempPhase);

        result.appendChild(this.renderPhaseHeader(this.phase));

        result.appendChild(this.renderPlayerBoard(this.game, PLAYER.ONE));
        result.appendChild(this.renderPlayerBoard(this.game, PLAYER.TWO));

        const pOneShipLayer = result.querySelector(`#${PLAYER.ONE}-ship-layer`);
        this.renderShips(this.game, pOneShipLayer, PLAYER.ONE);
        const pTwoShipLayer = result.querySelector(`#${PLAYER.TWO}-ship-layer`);
        this.renderShips(this.game, pTwoShipLayer, PLAYER.TWO);

        const pOneHitLayer = result.querySelector(`#${PLAYER.ONE}-hit-layer`);
        this.renderHits(this.game, pOneHitLayer, PLAYER.ONE);
        const pTwoHitLayer = result.querySelector(`#${PLAYER.TWO}-hit-layer`);
        this.renderHits(this.game, pTwoHitLayer, PLAYER.TWO);

        if (this.phase === PHASE.PREGAME) {
            result.appendChild(this.renderShipDock(this.game, PLAYER.ONE));
            result.appendChild(this.renderShipDock(this.game, PLAYER.TWO));
        } else if (this.phase === PHASE.PLAYER_ONE_PLACEMENT || this.phase === PHASE.PLAYER_ONE_PLACEMENT_COMPLETE) {
            result.appendChild(this.renderShipDock(this.game, PLAYER.ONE));
        } else if (this.phase === PHASE.PLAYER_TWO_PLACEMENT || this.phase === PHASE.PLAYER_TWO_PLACEMENT_COMPLETE) {
            result.appendChild(this.renderShipDock(this.game, PLAYER.TWO));
        } else {
            result.appendChild(this.renderShipDock(this.game, PLAYER.ONE, true));
            result.appendChild(this.renderShipDock(this.game, PLAYER.TWO, true));
        }

        
        if (this.phase === PHASE.PREGAME || this.phase === PHASE.POSTGAME || this.phase === AI_PHASE.POSTGAME) {
            const heroContainer = this.giveDivWithID('hero-container');
            this.appendHeroContent(heroContainer, this.phase, this.game.loser);
            result.appendChild(heroContainer);
        }

        return result;
    }

    renderAI() {
        console.log('View.renderAI(game) :: phase ', this.phase);
        const result = this.giveDiv([ 'boards-container' ]);
        // result.classList.add(this.game.activePlayer === PLAYER.ONE ? 'playerOne-turn' : 'playerTwo-turn');
        result.classList.add('phase-'+this.phase);
        if (this.game.loser) {
            result.classList.add('loser-'+this.game.loser);
        }

        const debugPhaseText = document.getElementById('debug-current-phase');
        if (debugPhaseText) {
            debugPhaseText.innerText = 'DEBUG - CURRENT PHASE: "' + this.phase + '"';
        }

        // const tempPhase = document.createElement('h5');
        // tempPhase.innerText = 'DEBUG - CURRENT PHASE: "' + this.phase + '"';
        // tempPhase.classList.add('temp-phase')
        // result.appendChild(tempPhase);

        result.appendChild(this.renderPhaseHeader(this.phase));

        result.appendChild(this.renderPlayerBoard(this.game, AI_PLAYER.HUMAN));
        result.appendChild(this.renderPlayerBoard(this.game, AI_PLAYER.AI));

        const humanShipLayer = result.querySelector(`#${AI_PLAYER.HUMAN}-ship-layer`);
        this.renderShips(this.game, humanShipLayer, AI_PLAYER.HUMAN);

        const aiShipLayer = result.querySelector(`#${AI_PLAYER.AI}-ship-layer`);
        this.renderShips(this.game, aiShipLayer, AI_PLAYER.AI);

        const humanHitLayer = result.querySelector(`#${AI_PLAYER.HUMAN}-hit-layer`);
        this.renderHits(this.game, humanHitLayer, AI_PLAYER.HUMAN);

        const aiHitLayer = result.querySelector(`#${AI_PLAYER.AI}-hit-layer`);
        this.renderHits(this.game, aiHitLayer, AI_PLAYER.AI);


        if (this.phase === AI_PHASE.HUMAN_PLACEMENT || this.phase === AI_PHASE.HUMAN_PLACEMENT_COMPLETE) {
            result.appendChild(this.renderShipDock(this.game, AI_PLAYER.HUMAN));
            // result.appendChild(this.renderShipDock(this.game, AI_PLAYER.AI));
        } else {
            // Render with `trackerMode` set to `true`
            result.appendChild(this.renderShipDock(this.game, AI_PLAYER.HUMAN, true));
            result.appendChild(this.renderShipDock(this.game, AI_PLAYER.AI, true));
        }

        if (this.phase === AI_PHASE.PREGAME || this.phase === AI_PHASE.POSTGAME ||
                this.phase === AI_PHASE.AI_PLACEMENT || this.phase === AI_PHASE.AI_TURN) {
            const heroContainer = this.giveDivWithID('hero-container');
            this.appendHeroContent(heroContainer, this.phase, this.game.loser);
            result.appendChild(heroContainer);
        }

        return result;
    }

    renderPhaseHeader(phase) {
        const result = this.giveDivWithID('phase-container');

        const header = document.createElement('h2');
        header.classList.add('phase-header');
        const loser = this.game.loser;
        let winner;
        if (!!loser) {
            switch(loser) {
                case PLAYER.ONE:
                    winner = 'Player Two';
                    break;
                case PLAYER.TWO:
                    winner = 'Player One';
                    break;
                case AI_PLAYER.AI:
                    winner = 'Player One';
                    break;
                case AI_PLAYER.HUMAN:
                    winner = 'The Computer';
                    break;
                default:
                    break;
            }
        }
        let headerText;
        switch(phase) {
            case PHASE.PREGAME :
            case AI_PHASE.PREGAME :
                headerText = 'Let\'s Play Battleship!';
                break;
            case PHASE.POSTGAME :
            case AI_PHASE.POSTGAME :
                headerText = `Congratulations to ${winner}!`;
                break;

            case PHASE.PLAYER_ONE_PLACEMENT :
            case AI_PHASE.HUMAN_PLACEMENT :
                headerText = 'Player One, Place Your Ships!'
                break;
            case PHASE.PLAYER_ONE_PLACEMENT_COMPLETE :
            case AI_PHASE.HUMAN_PLACEMENT_COMPLETE :
                headerText = 'Player One, Confirm Your Placement!'
                break;
            case PHASE.PLAYER_ONE_INTRO_SCREEN :
                headerText = 'Please Turn Screen to Player One!'
                break;
            case PHASE.PLAYER_ONE_TURN :
            case AI_PHASE.HUMAN_TURN :
                headerText = 'Player One\'s Turn! Attack!';
                break;

            case PHASE.PLAYER_TWO_PLACEMENT :
                headerText = 'Player Two, Place Your Ships!'
                break;
            case PHASE.PLAYER_TWO_PLACEMENT_COMPLETE :
                headerText = 'Player Two, Confirm Your Placement!'
                break;
            case PHASE.PLAYER_TWO_INTRO_SCREEN :
                headerText = 'Please Turn Screen to Player Two!'
                break;
            case PHASE.PLAYER_TWO_TURN :
                headerText = 'Player Two\'s Turn! Attack!';
                break;
        
            case AI_PHASE.AI_PLACEMENT :
                headerText = 'Computer is Placing Ships!'
                break;
            case AI_PHASE.AI_TURN:
                headerText = 'Computer\'s Turn!';
                break;

            default:
                headerText = 'Error: Header text not found.';
                throw new Error('Error: Header text not found');
                break;
        }
        header.innerText = headerText;

        result.appendChild(header);

        // // const hero = this.giveDivWithID('hero-container');
        // const heroContent = this.giveDivWithID('hero-content');
        // result.appendChild(heroContent);

        return result;
    }

    appendHeroContent(parent, phase, loser) {
        let button;
        switch(phase) {
            case PHASE.PREGAME:
                button = document.createElement('button');
                button.classList.add('pregame-start-button');
                button.classList.add('start-button');
                button.classList.add('hero-content');
                button.innerText = 'Player vs. Player';
                button.addEventListener('click', () => {
                    this.bus.publish('start-game', { gameType: GAME_TYPE.PLAYERS });
                })
                parent.appendChild(button);
                // parent.appendChild(document.createElement('br'));
                const aiButton = document.createElement('button');
                aiButton.classList.add('pregame-start-button');
                aiButton.classList.add('start-button');
                aiButton.classList.add('hero-content');
                aiButton.innerText = 'Player vs. Computer';
                aiButton.addEventListener('click', () => {
                    this.bus.publish('start-game', { gameType: GAME_TYPE.AI });
                })
                parent.appendChild(aiButton);
                break;
            case PHASE.POSTGAME:
            case AI_PHASE.POSTGAME:
                const banner = this.giveDiv(['hero-banner', 'hero-content']);
                const winnerText = this.game.getWinnerPlayerStr(loser);
                banner.innerText = winnerText + ' Wins!';
                parent.appendChild(banner);

                button = document.createElement('button');
                button.classList.add('postgame-start-button');
                button.classList.add('start-button');
                button.classList.add('hero-content');
                button.innerText = 'Want to play again?';
                button.addEventListener('click', () => {
                    this.bus.publish('restart-game');
                })
                parent.appendChild(button);
                break;
            case AI_PHASE.AI_PLACEMENT:
            case AI_PHASE.AI_TURN:
                const thinker = this.giveDivWithID('thinker', ['hero-content']);
                const dots = document.createElement('img');
                dots.src = './assets/thinker-dots.gif';
                thinker.appendChild(dots);
                parent.appendChild(thinker);
                break;
            default:
                break;
        }
    }

    renderPlayerBoard(game, player) {
        const playerGB = game.gameboards[player];

        const playerBoardContainer = this.giveDivWithID('gameboard-' + player, ['gameboard-container'], { player: player });

        const headerOne = document.createElement('h2');
        headerOne.classList.add('header');
        let headerText;

        switch (player) {
            case PLAYER.ONE:
            case AI_PLAYER.HUMAN:
                headerText = 'Player One';
                break;
            case PLAYER.TWO:
                headerText = 'Player Two';
                break;
            case AI_PLAYER.AI:
                headerText = 'The Computer';
                break;
            defaut:
                break;    
        }
        headerOne.innerText = headerText;

        playerBoardContainer.appendChild(headerOne);
        playerBoardContainer.appendChild(this.makeGameboardDOM(playerGB));

        return playerBoardContainer;
    }

    renderShips(game, parent, player) {
        // console.log('renderShips', player);
        const gameboard = game.gameboards[player];
        // const ships = gameboard.getShips().map((shipObj) => { return shipObj.ship; });
        const shipObjs = gameboard.getShips();

        shipObjs.forEach((shipObj) => {
            const ship = shipObj.ship;
            const anchorCoords = ship.getShipCoords()[0];
            // Do not place ships that have -1,-1 coords. these are unplaced.
            if (anchorCoords[0] !== -1 && anchorCoords[1] !== -1) {
                const classes = ['ship'];
                classes.push(ship.isHori ? 'hori' : 'vert');
                if (ship.length === 1) {
                    classes.push('length-one')
                }
                if (ship.isSunk()) {
                    classes.push('sunk');
                }
                const shipDiv = this.giveDiv(classes);
                shipDiv.id = player+'-'+shipObj.id;
                const imgEl = document.createElement('img');

                const origin = ship.getShipCoords()[0];
                let style = `grid-column: ${origin[0]+1}; grid-row: ${origin[1]+1};`;

                shipDiv.style = style;
                // shipDiv.innerText = ship.representation;
                
                imgEl.src = ship.imgSrc;
                shipDiv.appendChild(imgEl);

                parent.appendChild(shipDiv);
            }
        });
    }

    renderHits(game, parent, player) {
        // console.log('renderHits', player);
        const gameboard = game.gameboards[player];
        const hits = gameboard.getHits();

        const prevHitCoords = game.gameboards[player].getPreviousHitCoords();
        hits.forEach((hit) => {
            const classes = ['hit-marker'];
            if (hit.shipHit) {
                classes.push('ship-hit');
            }
            // Add a shine to the most recent hit.
            if (hit.xy[0] === prevHitCoords[0] && hit.xy[1] === prevHitCoords[1]) {
                classes.push('shine');
            }
            const hitDiv = this.giveDiv(classes);            
            
            const style = `grid-column: ${hit.xy[0]+1}; grid-row: ${hit.xy[1]+1};`;
            hitDiv.style = style;

            const xDiv = this.giveDiv(['hit-x']);
            xDiv.innerText = 'X';

            hitDiv.appendChild(xDiv);

            parent.appendChild(hitDiv);
        });

    }

    makeGameboardDOM(gameboard) {
        const result = this.giveDiv(['gameboard']);
        const sizeXY = gameboard.size;
        const hits = gameboard.getHits();
        const ships = gameboard.getShips().map((shipObj) => { return shipObj.ship; });
        
        let wavesCoords = [];
        for (let i = 1; i < 7+Math.round(Math.random()*8); i++) {
            const xy = [1+Math.round(Math.random()*9), 1+Math.round(Math.random()*9)];
            wavesCoords.push(xy);
        }

        for (let i = 0; i <= sizeXY[1]; i++) {
            const yRow = this.giveDiv([ 'y-row' ], [ ['y', i ]]);
            for (let j = 0; j <= sizeXY[0]; j++) {
                const xyDiv = this.giveDiv([ ], [ ['x', j ], ['y', i ] ]);

                if (i === 0 && j === 0) { // Dead cell, top left
                    xyDiv.classList.add('dead-cell');
                } else if (i === 0) { // First row of numbers
                    xyDiv.innerHTML = j;
                    xyDiv.classList.add('number-cell');
                } else if (j === 0) { // First column of numbers
                    xyDiv.innerHTML = i;
                    xyDiv.classList.add('number-cell');
                } else { // Regular cell
                    xyDiv.classList.add('cell');


                    const isHit = hits.find((hit) => {
                        return hit.xy[0] === j && hit.xy[1] === i;
                    });
                    
                    if (isHit) {
                        xyDiv.classList.add('hit');
                        const isSunk = ships.find((ship) => {
                            const foundShipCoords = ship.getShipCoords().find((coords) => {
                                return j === coords[0] && i === coords[1];
                            });
                            if (foundShipCoords && ship.isSunk()) {
                                xyDiv.classList.add('sunk-hit');
                            }
                        })
                    } else {
                        const span = document.createElement('span');
                        span.classList.add('coords')
                        span.innerHTML = `${j},${i}`
                        xyDiv.addEventListener('click', (e) => { 
                            if (!!window.pickedUpShip) {
                                // e.g. 'shipPlacer-playerOne-4-1'
                                const parts = window.pickedUpShip.split('-');
                                const ownGBClick = gameboard.player === parts[1];

                                if (ownGBClick) {
                                    console.log('own GB click w ship picked up');
                                }

                                console.log('registering picked up ship');
                            } else {
                                console.log('doHit');
                                this.doHit(e); 
                            }
                        });
                        xyDiv.appendChild(span);
                    }
                }
                if (wavesCoords.find((coords) => {
                    return coords[0] === j && coords[1] === i;
                })) {
                    const altNum = 1 + Math.round(Math.random()*2); // Between 1 and 3.
                    const wave = this.giveDiv(['wave', 'alt-'+altNum]);
                    const randLeft = Math.floor(Math.random()*10);
                    const randTop = Math.floor(Math.random()*25);
                    wave.style = `left: ${randLeft}px; top: ${randTop}px;`;
                    xyDiv.appendChild(wave);
                }
                yRow.appendChild(xyDiv);
            }
            result.appendChild(yRow);
        }

        const shipLayer = this.giveDivWithID(gameboard.player+'-ship-layer', [ 'ship-layer' ]);
        result.appendChild(shipLayer);
        
        const hitLayer = this.giveDivWithID(gameboard.player+'-hit-layer', ['hit-layer']);
        result.appendChild(hitLayer);

        const screen = this.giveDiv([ 'screen' ]);
        screen.addEventListener('animationend', () => {
            const boardsEl = document.querySelector('.boards-container');
            boardsEl.classList.add('screen-in-done');
        });
        result.appendChild(screen);

        // For "intro-screen" phases
        const goBtn = document.createElement('button');
        goBtn.classList.add('go-button');
        const playerStr = this.game.getPlayerStr(gameboard.player);
        goBtn.innerText = `${playerStr}... Click to play!`;
        goBtn.addEventListener('click', (evt) => {
            const newPhase = gameboard.player === PLAYER.ONE ? PHASE.PLAYER_ONE_TURN : PHASE.PLAYER_TWO_TURN;
            this.changePhase(newPhase, true);
        });
        screen.appendChild(goBtn);

        return result;
    }

    renderShipDock(game, player, trackerMode = false) {
        const result = this.giveDivWithID(player+'-ship-dock', ['ship-dock'], { player: player });
        if (trackerMode) {
            result.classList.add('ship-tracker')
        }
        const dockFrame = this.giveDiv(['ship-dock-frame']);
        result.appendChild(dockFrame);

        const header = document.createElement('h3');
        header.classList.add('ship-dock-header');
        header.innerText = trackerMode ? 'Ship Kill Tracker' : 'Ship Dock' ;

        dockFrame.appendChild(header);

        if (!trackerMode) {
            const resetBtn = document.createElement('button');
            resetBtn.type = 'button';
            resetBtn.innerText = 'Reset'
            resetBtn.classList.add('ship-dock-button');
            resetBtn.classList.add('reset-button');
            resetBtn.addEventListener('click', () => {
                game.unplaceAllShips(player);
                let placementPhase;
                switch(player) {
                    case PLAYER.ONE:
                        placementPhase = PHASE.PLAYER_ONE_PLACEMENT;
                        break;
                    case PLAYER.TWO:
                        placementPhase = PHASE.PLAYER_TWO_PLACEMENT;
                        break;
                    case AI_PLAYER.HUMAN:
                        placementPhase = AI_PHASE.HUMAN_PLACEMENT;
                        break;
                }
                this.changePhase(placementPhase, true);
            });
            dockFrame.appendChild(resetBtn);

            const randomizeBtn = document.createElement('button');
            randomizeBtn.type = 'button';
            randomizeBtn.innerText = 'Randomize';
            randomizeBtn.classList.add('ship-dock-button');
            randomizeBtn.classList.add('randomize-button');
            randomizeBtn.addEventListener('click', () => {
                game.randomizeAllShips(player);
            });
            dockFrame.appendChild(randomizeBtn);
        }

        const gb = game.gameboards[player];
        const shipObjArr = gb.getShips();

        // const isCurrPlayerPlacement = (player === PLAYER.ONE && this.phase === PHASE.PLAYER_ONE_PLACEMENT) ||
        //     (player === PLAYER.TWO && this.phase === PHASE.PLAYER_TWO_PLACEMENT) ||
        //     (player === AI_PLAYER.HUMAN && this.phase === AI_PHASE.HUMAN_PLACEMENT);

        const isPlacementCompletePhase = (this.phase === PHASE.PLAYER_ONE_PLACEMENT_COMPLETE || this.phase === PHASE.PLAYER_TWO_PLACEMENT_COMPLETE || this.phase === AI_PHASE.HUMAN_PLACEMENT_COMPLETE);
        const isPregame = this.phase === PHASE.PREGAME;

        // if (isCurrPlayerPlacement || isPregame) {
        if (!isPlacementCompletePhase) {
            let lastLength = 0;
            shipObjArr.forEach((shipObj) => {
                const id = shipObj.id;
                const length = parseInt(id.charAt(0), 10);

                if (lastLength > length) {
                    const br = document.createElement('br');
                    dockFrame.appendChild(br);
                }
                lastLength = length;

                // const shipContainer = this.giveDiv(['ship-dock-img-container']);
                const imgSrc = shipObj.ship.getImgSrc();
                const img = document.createElement('img');
                img.id = player+'-ship-'+id;
                // img.draggable = true;
                img.src = imgSrc;
                img.classList.add('dock-ship');
                img.classList.add('ship');
                img.classList.add('hori');
                if (shipObj.ship.isSunk()) {
                    img.classList.add('sunk');
                }

                if (!trackerMode) {
                    const shipPlacer = new ViewShipPlacer(game, img, shipObj, player);
                    this.shipPlacers.push(shipPlacer);
                }
            
                dockFrame.appendChild(img);
            });

            if (!trackerMode) {
                const instructions = this.giveDiv(['instructions']);
                instructions.innerText = 'Click to pick up | [Space] to flip | Click to place';
                dockFrame.appendChild(instructions);
            }

        } else { // pane === [player] PLACEMENT COMPLETE?
            const finishButton = document.createElement('button');
            finishButton.type = 'button';
            finishButton.classList.add('finish-button');
            finishButton.classList.add('ship-dock-button');
            finishButton.innerText = 'Finalize Placement';
            finishButton.addEventListener('click', (evt) => {
                if (this.phase === PHASE.PLAYER_ONE_PLACEMENT_COMPLETE) {
                    this.changePhase(PHASE.PLAYER_TWO_PLACEMENT, true);
                } else if (this.phase === PHASE.PLAYER_TWO_PLACEMENT_COMPLETE) {
                    this.changePhase(PHASE.PLAYER_ONE_INTRO_SCREEN, true);
                } else if (this.phase === AI_PHASE.HUMAN_PLACEMENT_COMPLETE) {
                    this.changePhase(AI_PHASE.AI_PLACEMENT, true);
                }
            });
            dockFrame.appendChild(finishButton);
        }

        return result;
    }

    changePhase(newPhase, doPublish = false, doReRender = true) {
        this.phase = newPhase;
        if (doReRender) {
            this.reRender(this.game);
        }
        
        if (doPublish) {
            this.bus.publish('view-phase-change', { phase: newPhase })
        }
    }

    giveDiv(classes, data) {
        return this.#giveDiv('', classes, data);
    }

    giveDivWithID(id, classes, data) {
        return this.#giveDiv(id, classes, data);
    }

    #giveDiv(id = '', classes = [], data = [], content = '') {
        const div = document.createElement('div');
        
        if (id !== '') {
            div.id = id;
        }

        if (classes.length) {
            for (let i = 0; i < classes.length; i++) {
                const cssClass = classes[i];
                div.classList.add(cssClass);
            }
        }

        if (data.length) {
            for (let j = 0; j < data.length; j++) {
                const dataPair = data[j];
                div.dataset[dataPair[0]] = dataPair[1];
            }
        }
        
        if (div.dataset['x'] && div.dataset['y']) {
            div.dataset.hit = 'false';
        }

        if (content) {
            div.innerText = content;
        }

        return div;
    }

    registerSubscribers() {
        // this.bus.subscribe('game-hit-done', (data) => { 
        //     console.log('game-hit-done', data.game);
        //     this.gameContainerEl.innerHTML = '';
        //     this.gameContainerEl.appendChild(this.render(data.game)); 
        // });
        // this.bus.subscribe('change-game-type', (data) => {
        //     if (data.gameType === GAME_TYPE.PLAYERS) {
        //         this.renderFunc = this.render;
        //     } else {
        //         this.renderFunc = this.renderAI;
        //     }
        // })

        this.bus.subscribe('game-phase-change', (data) => {
            this.changePhase(data.phase, false, false);
        });
        this.bus.subscribe('request-render', () => {
            console.log('reRender');
            this.reRender();
        });

        this.bus.subscribe('placement-complete', () => {
            console.log('heard bus placement-complete');
            if (this.phase === PHASE.PLAYER_ONE_PLACEMENT) {
                console.log('setting to phase placement-complete')
                const newPhase = PHASE.PLAYER_ONE_PLACEMENT_COMPLETE;
                this.changePhase(newPhase, true);
            } else if (this.phase === PHASE.PLAYER_TWO_PLACEMENT) {
                console.log('setting to phase placement-complete')
                const newPhase = PHASE.PLAYER_TWO_PLACEMENT_COMPLETE;
                this.changePhase(newPhase, true);
            } else if (this.phase === AI_PHASE.HUMAN_PLACEMENT) {
                const newPhase = AI_PHASE.HUMAN_PLACEMENT_COMPLETE;
                this.changePhase(newPhase, true);
            }
        });


    }
    
    doHit(evt) {
        const div = evt.target;
        // console.log('doHit target', div);
        const xy = [parseInt(div.dataset.x, 10), parseInt(div.dataset.y, 10)];

        // console.log('publish hit', xy, this.phase, PLAYER.TWO);
        this.bus.publish('view-hit', { xy: xy, phase: this.phase, attackedPlayer: PLAYER.TWO });
    }
}

export { PHASE };

export default View;
