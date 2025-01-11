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
        // this.render();
    }

    // Returns the top DOM Node.
    render(game) {
        const pOneGB = game.gameboards[PLAYER.ONE];
        const pTwoGB = game.gameboards[PLAYER.TWO];
        
        // game.switchActivePlayer();

        const result = this.giveDiv([ 'boards-container' ]);
        // const screenOne = this.giveDiv([ 'screen' ]);
        // const screenTwo = this.giveDiv([ 'screen' ]);

        const pOne = this.giveDivWithID('gameboard-' + pOneGB.player, ['gameboard-container'], { player: pOneGB.player });
        const headerOne = document.createElement('h2');
        headerOne.classList.add('header');
        headerOne.innerHTML = game.activePlayer === PLAYER.ONE ? 'YOUR BOARD' : 'OPPONENT BOARD';
        pOne.appendChild(headerOne);

        
        const pTwo = this.giveDivWithID('gameboard-' + pTwoGB.player, ['gameboard-container'], { player: pTwoGB.player });
        const headerTwo = document.createElement('h2');
        headerTwo.classList.add('header');
        headerTwo.innerHTML = game.activePlayer === PLAYER.TWO ? 'YOUR BOARD' : 'OPPONENT BOARD';
        pTwo.appendChild(headerTwo);
        

        pOne.appendChild(this.makeGameboardDOM(pOneGB));
        pTwo.appendChild(this.makeGameboardDOM(pTwoGB));
        
        // pOne.appendChild(screenOne);
        // pTwo.appendChild(screenTwo);

        result.appendChild(pOne);
        result.appendChild(pTwo);
        
        return result;
    }

    renderPlayerBoard() {

    }

    renderOpponentBoard() {

    }

    doHit(evt) {
        const div = evt.target;
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

                    const span = document.createElement('span');

                    const isHit = hits.find((hit) => {
                        return hit.xy[0] === j && hit.xy[1] === i;
                    });
                    if (isHit) {
                        if (isHit.shipHit) {
                            xyDiv.classList.add('ship-hit');
                        }
                        xyDiv.classList.add('hit');
                        span.classList.add('hit-marker');
                        span.innerHTML = 'X';
                    } else {
                        span.classList.add('coords')
                        span.innerHTML = `${j},${i}`
                        xyDiv.addEventListener('click', (e) => { this.doHit(e); });
                    }
                    xyDiv.appendChild(span);
                }
                yRow.appendChild(xyDiv);
            }
            result.appendChild(yRow);
        }

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
}

export { PANE as PANES };

export default View;
