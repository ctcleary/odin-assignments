console.log('main.js loaded');

const makePlayer = function(name, mark) {
    if (mark !== 'x' && mark !== 'o') {
        throw new Error('Invalid mark provided to makePlayer');
    }

    let playerName = name;
    const playerMark = mark;

    function getName() {
        return playerName;
    }

    function setName(newVal) {
        playerName = newVal;
        return playerName;
    }

    function getMark() {
        return playerMark;
    }

    return {
        getName,
        setName,
        getMark
    }
}

const playerOne = makePlayer('John', 'x');
const playerTwo = makePlayer('Sue', 'o');

const gameboard = (function(firstPlayer, secondPlayer) { 
    const boardArrayNull = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ]

    let boardArray;
    let winner = null;
    reset();

    const players = [firstPlayer, secondPlayer];

    let currPlayer = players[0];
    

    function markCell(x, y) {
        const mark = currPlayer.getMark();
        boardArray[y][x] = mark.toUpperCase();

        // Check for winner before switching players
        checkForWinner();

        // Switch players
        currPlayer = players.indexOf(currPlayer) === 0 ? players[1] : players[0];
        return getBoardState();
    }

    function notNull(cell) {
        return cell !== null;
    }

    function checkArrayForWin(checkArray) {
        return (notNull(checkArray[0]) && notNull(checkArray[1]) && notNull(checkArray[2]) &&
            checkArray[0] === checkArray[1] &&
            checkArray[0] === checkArray[2] &&
            checkArray[1] === checkArray[1]);

    }
    function checkRow(rowArray) {
        checkArrayForWin(rowArray);
    }

    function checkCol(colIndex) {
        return checkArrayForWin([ 
            boardArray[0][colIndex], 
            boardArray[1][colIndex], 
            boardArray[2][colIndex] 
        ]);
    }

    function checkDiagLeft() {
        return checkArrayForWin([
            boardArray[0][2],
            boardArray[1][1],
            boardArray[2][0]

        ])

    }
    function checkDiagRight() {
        return checkArrayForWin([
            boardArray[0][0],
            boardArray[1][1],
            boardArray[2][2]
        ])
    }

    function checkFull() {
        const isFull = boardArray.every((xArray) => {
            return xArray.every((cell) => {
                return cell !== null;
            });
        })

        return isFull;
    }

    function checkForWinner() {
        for (let i = 0; i < boardArray.length; i++) {
            const rowArray = boardArray[i];

            if (checkRow(rowArray)) {
                declareWinner();
                return;
            }
        }

        for (let j = 0; j < 3; j++) {
            if (checkCol(j)) {
                declareWinner();
                return;
            }
        }

        if (checkDiagLeft() || checkDiagRight()) {
            declareWinner();
            return;
        }

        if (checkFull()) {
            declareTied();
            return;
        }
    }

    function declareWinner() {
        console.log('winner is '+ currPlayer.getName());
        winner = currPlayer;
    }

    function declareTied() {
        console.log('game is tied');
        winner = 'Tied';
    }

    function reset() {
        winner = null;
        boardArray = JSON.parse(JSON.stringify(boardArrayNull));
    }

    function getWinner() {
        let winnerName;
        if (winner === null) {
            return null;
        } if (winner === 'Tied') {
            return 'Tied';
        } else {
            return winner.getName();
        }
    }
    function getWinnerMark () {
        return winner.getMark();
    }

    function getCurrPlayer() {
        return currPlayer.getName();
    }
    function getCurrPlayerMark() {
        return currPlayer.getMark();
    }

    function getCellState(x, y) {
        return boardArray[y][x];
    }

    function getBoardState() {
        return boardArray;
    }

    return {
        markCell,
        getCellState,
        getBoardState,
        getCurrPlayer,
        getCurrPlayerMark,
        getWinner,
        getWinnerMark,
        reset
    }
})(playerOne, playerTwo);



const displayEl = document.getElementById('boardDisplay');
const displayController = (function(displayNode) {
    function renderGame(gameboard, winner) {
        displayNode.innerHTML = '';

        const gameboardEl = document.createElement('div');
        gameboardEl.id = 'gameboard';

        for (let i = 0; i < 3; i++) {

            for (let j = 0; j < 3; j++) {
                const cell = document.createElement('div');
                cell.classList.add('gamecell');
                if (winner) cell.classList.add('won-game');
                cell.id = `cell-${j}${i}`; // cell{X}{Y};

                let currCellState = gameboard.getCellState(j, i);
                // console.log('cell'+j+i + ' state = ' + currCellState);
                currCellState = currCellState || '-';
                cell.innerText = currCellState;

                cell.setAttribute('data-mark', currCellState);

                if (!winner) {
                    cell.onclick = () => {
                        console.log(`cell ${j},${i} clicked`);
                        const currState = gameboard.getCellState(j, i);
                        if (currState === null) {
                            gameboard.markCell(j, i);

                            // RECURSIVE CALL
                            renderGame(gameboard, gameboard.getWinner());
                        }
                    }
                }

                gameboardEl.appendChild(cell);
            }
        }

        displayNode.appendChild(gameboardEl);

        const restartButton = document.createElement('button');
        restartButton.classList.add('restart-button');
        restartButton.innerText = 'Restart Game';
        restartButton.onclick = () => {
            gameboard.reset();
            renderGame(gameboard);
        }

        const stateReporter = document.createElement('div');
        if (winner === 'Tied') {
            stateReporter.innerText = 'Game is Tied';
        } else if (winner) {
            stateReporter.innerText = `Winner is: ${gameboard.getWinner()} / ${gameboard.getWinnerMark().toUpperCase()}`;
        } else {
            stateReporter.innerText = `Current player is: ${gameboard.getCurrPlayer()} / ${gameboard.getCurrPlayerMark().toUpperCase()}`;
        }
        

        displayNode.appendChild(stateReporter);
        displayNode.appendChild(restartButton);
    }

    return {
        renderGame
    }
})(displayEl);

displayController.renderGame(gameboard);

const playerController = (function() {
    const pOneNameInput = document.getElementById('playerOne');
    const pTwoNameInput = document.getElementById('playerTwo');

    pOneNameInput.placeholder = playerOne.getName();
    pTwoNameInput.placeholder = playerTwo.getName();

    pOneNameInput.onkeyup = (e) => {
        if (e.key === 'Enter') {
            playerOne.setName(pOneNameInput.value);
            displayController.renderGame(gameboard);
        }
    }
    pTwoNameInput.onkeyup = (e) => {
        if (e.key === 'Enter') {
            playerTwo.setName(pTwoNameInput.value);
            displayController.renderGame(gameboard);
        }
    }
 })();
