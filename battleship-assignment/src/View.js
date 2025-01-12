import { PLAYER } from "./Player.js";

const PANE = {
    PREGAME : 'pregame',

    SCREEN : 'screen',

    PLAYER_ONE_TURN : 'playerOne-turn',
    PLAYER_TWO_TURN : 'playerTwo-turn',

    POSTGAME : 'postgame',
}

class View {
    constructor(messageBus) {
        this.bus = messageBus;
        this.pane = PANE.PREGAME;
        this.pane = PANE.PLAYER_ONE_TURN;
        this.registerSubscribers();
    }

    // Returns the top DOM Node.
    render(game) {
        const result = this.giveDiv([ 'boards-container' ]);

        result.appendChild(this.renderPlayerBoard(game, PLAYER.ONE));
        result.appendChild(this.renderPlayerBoard(game, PLAYER.TWO));

        const pOneShipLayer = result.querySelector(`#${PLAYER.ONE}-ship-layer`);
        this.renderShips(game, pOneShipLayer, PLAYER.ONE);
        const pTwoShipLayer = result.querySelector(`#${PLAYER.TWO}-ship-layer`);
        this.renderShips(game, pTwoShipLayer, PLAYER.TWO);

        const pOneHitLayer = result.querySelector(`#${PLAYER.ONE}-hit-layer`);
        this.renderHits(game, pOneHitLayer, PLAYER.ONE);
        const pTwoHitLayer = result.querySelector(`#${PLAYER.TWO}-hit-layer`);
        this.renderHits(game, pTwoHitLayer, PLAYER.TWO);

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
        console.log('renderShips', player);
        const gameboard = game.gameboards[player];
        const ships = gameboard.getShips().map((shipObj) => { return shipObj.ship; });

        ships.forEach((ship) => {
            const classes = ['ship'];
            classes.push(ship.isHori ? 'hori' : 'vert');
            if (ship.length === 1) {
                classes.push('length-one')
            }
            if (ship.isSunk()) {
                classes.push('sunk');
            }
            const shipDiv = this.giveDiv(classes);
            const imgEl = document.createElement('img');

            const origin = ship.getShipCoords()[0];
            let style = `grid-column: ${origin[0]+1}; grid-row: ${origin[1]+1};`;

            shipDiv.style = style;
            // shipDiv.innerText = ship.representation;
            
            imgEl.src = ship.imgSrc;
            shipDiv.appendChild(imgEl);

            parent.appendChild(shipDiv);
        });
    }

    renderHits(game, parent, player) {
        console.log('renderHits', player);
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

    doHit(evt) {
        const div = evt.target;
        console.log('doHit target', div);
        const xy = [div.dataset.x, div.dataset.y];

        console.log('publish hit', xy);
        this.bus.publish('view-hit', { xy: xy, pane: this.pane, attackedPlayer: PLAYER.TWO });
    }

    makeGameboardDOM(gameboard) {
        const result = this.giveDiv(['gameboard']);
        const sizeXY = gameboard.size;
        const hits = gameboard.getHits();

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
                    } else {
                        const span = document.createElement('span');
                        span.classList.add('coords')
                        span.innerHTML = `${j},${i}`
                        xyDiv.addEventListener('click', (e) => { this.doHit(e); });
                        xyDiv.appendChild(span);
                    }
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
        this.bus.subscribe('game-hit-done', (data) => { this.render(data.game); });
    }
}

export { PANE as PANES };

export default View;
