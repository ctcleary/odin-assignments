const PANES = {
    PREGAME : 'pregame',

    SCREEN : 'screen',

    PLAYER_ONE_TURN : 'playerOneTurn',
    PLAYER_TWO_TURN : 'playerTwoTurn',

    POSTGAME : 'postgame',
}

class View {
    constructor() {
        this.pane = PANES.PREGAME;
        // this.render();
    }

    render() {
        return this.makeGameboard();
    }

    renderPlayerBoard() {

    }

    renderOpponentBoard() {

    }

    makeGameboard(sizeXY = [20,20]) {
        const result = this.giveDiv(['gameboard']);

        for (let i = 0; i <= sizeXY[1]; i++) {
            const yRow = this.giveDiv([ 'y-row' ], [ ['y', i ]]);
            for (let j = 0; j <= sizeXY[0]; j++) {
                const xyDiv = this.giveDiv([ 'cell' ], [ ['x', j ], ['y', i ] ]);

                if (i === 0 && j === 0) { // Dead cell, top left
                    xyDiv.innerHTML = '/';
                    xyDiv.classList.add('dead');
                } else if (i === 0) { // First row of numbers
                    xyDiv.innerHTML = j;
                    xyDiv.classList.add('number-cell');
                } else if (j === 0) { // First column of numbers
                    xyDiv.innerHTML = i;
                    xyDiv.classList.add('number-cell');
                } 
                // console.log(xyDiv);

                yRow.appendChild(xyDiv);
            }
            result.appendChild(yRow);
        }

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

        
        if (!div.dataset['x'] || (div.dataset['x'] !== 0 && div.dataset['y'] !== 0)) {
            div.dataset.hit = 'false';
        }

        if (content) {
            div.innerText = content;
        }

        return div;
    }
}

export default View;
