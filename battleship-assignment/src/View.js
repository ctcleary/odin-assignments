import { PLAYER } from "./Player.js";
import ViewShipPlacer from "./ViewShipPlacer.js";

const PANE = {
    PREGAME : 'pregame',

    SCREEN : 'screen',

    PLAYER_ONE_PLACEMENT : 'playerOne-placement',
    PLAYER_TWO_PLACEMENT : 'playerTwo-placement',

    PLAYER_ONE_TURN : 'playerOne-turn',
    PLAYER_TWO_TURN : 'playerTwo-turn',

    POSTGAME : 'postgame',
}

class View {
    constructor(game, gameContainerEl) {
        this.game = game;
        this.bus = game.bus;
        this.gameContainerEl = gameContainerEl;

        // this.pane = PANE.PREGAME;
        this.pane = PANE.PLAYER_ONE_PLACEMENT;
        // this.pane = PANE.PLAYER_ONE_TURN;

        this.shipPlacers = [];
        
        this.registerSubscribers();
    }

    reRender() {
        this.gameContainerEl.innerHTML = '';
        this.gameContainerEl.appendChild(this.render());
    }

    // Returns the top DOM Node.
    render() {
        console.log('View.render(game)');
        const result = this.giveDiv([ 'boards-container' ]);
        // result.classList.add(this.game.activePlayer === PLAYER.ONE ? 'playerOne-turn' : 'playerTwo-turn');
        result.classList.add('pane-'+this.pane);

        const tempPane = document.createElement('h5');
        tempPane.innerText = 'Debug - Current Pane: ' + this.pane;
        tempPane.classList.add('temp-pane')
        result.appendChild(tempPane);

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

        if (this.pane === PANE.PREGAME) {
            result.appendChild(this.renderShipDock(this.game, PLAYER.ONE));
            result.appendChild(this.renderShipDock(this.game, PLAYER.TWO));
        } else if (this.pane === PANE.PLAYER_ONE_PLACEMENT) {
            result.appendChild(this.renderShipDock(this.game, PLAYER.ONE));
        } else if (this.pane === PANE.PLAYER_TWO_PLACEMENT) {
            result.appendChild(this.renderShipDock(this.game, PLAYER.TWO));
        }

        return result;
    }

    renderPlayerBoard(game, player) {
        const playerGB = game.gameboards[player];

        const playerBoardContainer = this.giveDivWithID('gameboard-' + player, ['gameboard-container'], { player: player });

        const headerOne = document.createElement('h2');
        headerOne.classList.add('header');
        headerOne.innerHTML = game.activePlayer === player ? 'YOUR BOARD' : 'OPPONENT BOARD';
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

        hits.forEach((hit) => {
            const classes = ['hit-marker'];
            if (hit.shipHit) {
                classes.push('ship-hit');
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
                            } else if (this.pane === gameboard.player+'-turn') {
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
        result.appendChild(screen);

        return result;
    }

    renderShipDock(game, player) {
        const result = this.giveDivWithID(player+'-ship-dock', ['ship-dock'], { player: player });
        const dockFrame = this.giveDiv(['ship-dock-frame']);
        result.appendChild(dockFrame);

        const header = document.createElement('h3');
        header.classList.add('ship-dock-header');
        header.innerText = 'Ship Dock';
        dockFrame.appendChild(header);

        const randoBtn = document.createElement('button');
        randoBtn.type = 'button';
        randoBtn.innerText = 'Randomize';
        randoBtn.classList.add('rando-button');
        dockFrame.appendChild(randoBtn);

        const gb = game.gameboards[player];
        const shipObjArr = gb.getShips();

        let lastLength = 0;
        shipObjArr.forEach((shipObj) => {
            const id = shipObj.id;
            const length = parseInt(id.charAt(0), 10);

            if (lastLength > length) {
                const br = document.createElement('br');
                dockFrame.appendChild(br);
            }
            lastLength = length;

            const imgSrc = shipObj.ship.getImgSrc();

            const img = document.createElement('img');
            img.id = player+'-ship-'+id;
            // img.draggable = true;
            img.src = imgSrc;
            img.classList.add('dock-ship');
            img.classList.add('ship');
            img.classList.add('hori');

            const shipPlacer = new ViewShipPlacer(game, img, shipObj, player);
            this.shipPlacers.push(shipPlacer);
        
            dockFrame.appendChild(img);
        });

        const instructions = this.giveDiv(['instructions']);
        instructions.innerText = 'Click to pick up | [Space] to flip | Click to place';
        dockFrame.appendChild(instructions);

        return result;
    }

    switchPane(newPane) {
        this.pane = newPane;
        this.reRender(this.game);
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

        
        // if (!div.dataset['x'] || (div.dataset['x'] !== 0 && div.dataset['y'] !== 0)) {
        if (div.dataset['x'] && div.dataset['y']) {
            div.dataset.hit = 'false';
        }

        if (content) {
            div.innerText = content;
        }

        return div;
    }

    registerSubscribers() {
        this.bus.subscribe('game-hit-done', (data) => { 
            console.log('game-hit-done', data.game);
            this.gameContainerEl.innerHTML = '';
            this.gameContainerEl.appendChild(this.render(data.game)); 
        });
        
        this.bus.subscribe('request-render', () => {
            console.log('reRender');
            this.reRender();
        });
    }
    
    doHit(evt) {
        const div = evt.target;
        // console.log('doHit target', div);
        const xy = [parseInt(div.dataset.x, 10), parseInt(div.dataset.y, 10)];

        // console.log('publish hit', xy, this.pane, PLAYER.TWO);
        this.bus.publish('view-hit', { xy: xy, pane: this.pane, attackedPlayer: PLAYER.TWO });
    }
}

export { PANE };

export default View;
