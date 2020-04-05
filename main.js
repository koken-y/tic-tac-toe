/* eslint-disable indent */
/* eslint-disable semi */

const playerFactory = function (name, symbol) {
    const getName = () => name;
    const getSymbol = () => symbol;

    return {
        getName,
        getSymbol
    };
};

const gameBoard = (function () {
    let board = [
        [, , ,],
        [, , ,],
        [, , ,],
    ];

    const getBoard = () => board;
    const renderBoard = () => {
        const gameBoardElement = document.getElementById('gameBoard');
        while (gameBoardElement.firstChild) {
            gameBoardElement.removeChild(gameBoardElement.lastChild);
        }
        for (let i = 0; i < board.length; i++) {
            const rowElement = document.createElement('div');
            rowElement.classList.add('row');
            for (let j = 0; j < board[i].length; j++) {
                const tileElement = document.createElement('div');
                tileElement.classList.add('tile');
                tileElement.setAttribute('id', `${i}${j}`);
                rowElement.appendChild(tileElement);
            }
            gameBoardElement.appendChild(rowElement);
        }
    };
    const clearBoard = () => {
        board = [
            [, , ,],
            [, , ,],
            [, , ,],
        ];
    };
    const placeSymbol = (e) => {
        if (_isPlaceableTile(e.target)) {
            /* Use id on element to find out where to change on board array */
            const xCoord = e.target.id.charAt(0);
            const yCoord = e.target.id.charAt(1);
            if (gameFlow.getCurrentPlayer().getSymbol() === 'X') {
                board[xCoord][yCoord] = 1;
            } else if (gameFlow.getCurrentPlayer().getSymbol() === 'O') {
                board[xCoord][yCoord] = -1;
            }
            /* add class to change style of tile to blue or pink */
            e.target.classList.add(gameFlow.getCurrentPlayer().getSymbol());
            gameFlow.incrementMoves();
        }
    };
    const tileElements = document.getElementsByClassName('tile');
    const addListeners = () => {
        for (const tile of tileElements) {
            tile.addEventListener('click', placeSymbol);
        }
    };
    const clearListeners = () => {
        for (const tile of tileElements) {
            tile.removeEventListener('click', placeSymbol);
        }
    };
    const _isPlaceableTile = (tile) => {
        if (!tile.classList.contains('X') && !tile.classList.contains('O')) {
            return true;
        }
        return false;
    }

    return {
        clearBoard,
        getBoard,
        renderBoard,
        placeSymbol,
        addListeners,
        clearListeners
    };
})();

const gameFlow = (function () {
    let p1;
    let p2;
    let currentPlayer;
    let moves = 0;

    const getCurrentPlayer = () => {
        return currentPlayer;
    }
    const initializePlayers = (p1Name, p2Name) => {
        p1 = playerFactory(p1Name.value, 'X');
        p2 = playerFactory(p2Name.value, 'O');
        currentPlayer = p1;
    };
    const swapCurrentPlayer = () => {
        currentPlayer === p1 ? currentPlayer = p2 : currentPlayer = p1;
        displayCurrentPlayer();
    };
    const displayCurrentPlayer = () => {
        const currentPlayerName = currentPlayer.getName();
        const currentPlayerSymbol = currentPlayer.getSymbol();
        updateDisplay(`${currentPlayerName}'s turn (${currentPlayerSymbol})`);
    }
    const incrementMoves = () => {
        moves++;
        if (checkWin()) {
            const winnerName = getCurrentPlayer().getName();
            const winnerSymbol = getCurrentPlayer().getSymbol();
            updateDisplay(`${winnerName} (${winnerSymbol}) has won the game!`);
            moves = 0;
            gameBoard.clearListeners();
            modal.openModal();
        } else if (gameFlow.checkWin() === false) {
            updateDisplay('Draw! No one wins');
            moves = 0;
            gameBoard.clearListeners();
            modal.openModal();
        } else {
            gameFlow.swapCurrentPlayer();
        }
    }
    const checkWin = () => {
        const board = gameBoard.getBoard();
        for (let i = 0; i < 3; i++) {
            if (Math.abs(board[i][0] + board[i][1] + board[i][2]) === 3 ||
                Math.abs(board[0][i] + board[1][i] + board[2][i]) === 3) {
                return true;
            }
        }
        if (Math.abs(board[0][0] + board[1][1] + board[2][2]) === 3 ||
            Math.abs(board[0][2] + board[1][1] + board[2][0]) === 3) {
            return true;
        }
        if (moves === 9) {
            return false;
        }
    }
    const run = () => {
        gameBoard.clearBoard();
        gameBoard.renderBoard();
        gameBoard.addListeners();
        displayCurrentPlayer();
    };
    const updateDisplay = (text) => {
        const gameTextElement = document.getElementById('gameText');
        gameTextElement.innerHTML = text;
    }

    return {
        getCurrentPlayer,
        initializePlayers,
        swapCurrentPlayer,
        displayCurrentPlayer,
        incrementMoves,
        checkWin,
        updateDisplay,
        run
    };
})();

const modal = (function () {
    const startGameElement = document.getElementById('startGame');
    const clearFieldElement = document.getElementById('clearFields');
    const p1NameElement = document.getElementById('p1Name');
    const p2NameElement = document.getElementById('p2Name');
    const modalElement = document.getElementById('playerInfoModal')

    const openModal = () => {
        modalElement.style.display = 'block';
    }
    const _closeModal = () => {
        modalElement.style.display = 'none';
    };
    const _checkValidName = (name) => {
        if (name.length !== 0) {
            return true;
        }
        return false;
    }
    startGameElement.addEventListener('click', (e) => {
        if (_checkValidName(p1NameElement.value) && _checkValidName(p2NameElement.value)) {
            gameFlow.initializePlayers(p1NameElement, p2NameElement);
            e.target.parentElement.reset();
            _closeModal();
            gameFlow.run();
        } else {
            alert('Enter a name for both players!')
        }
    });
    clearFieldElement.addEventListener('click', (e) => {
        e.target.parentElement.reset();
    });

    return {
        openModal
    }
})();
