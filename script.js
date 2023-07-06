//Gameboard Module
const Gameboard = (() => {
    //Private state of GameBoard
    const board = ['','','',
                   '','','',
                   '','',''];

    //Function to read only board 
    const getBoard = () => {
        return [...board];
    };              

    //Private list of win conditions
    const winConditions = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ];              

    //Function to place current players sign into board array
    const placeSign = (index, playerSign) => {
        if (board[index] == ''){
            board[index] = playerSign;
            return true;
        } else {
            return false;
        }
    };

    const resetBoard = () => {
        for (let i = 0; i < board.length; i++){
            board[i] = '';
        }
    };

    const checkWin = (playerSign) => {
        //Creates new array with indexes of current player's Signs
        const playerFields = board.map((cell, index) => {
            return cell === playerSign ? index : null;
        }).filter(index => index !== null);

        //Compares playerFields array with winConditions array
        let result = false;
        for (let i = 0; i < winConditions.length; i++){
            //Checks if every every number in the playerFields array is present in the current winConditions iteration
            if(winConditions[i].every(num => playerFields.includes(num))){
                result = true;
            }
        }
        return result;
    }

    return {placeSign, resetBoard, checkWin, getBoard};
})();

//Player Object Module
const Player = (name, sign) => {
    return {name, sign};
};


//Game Flow Module
const gameController = (() => {
    const player1 = Player(1, 'X');
    const player2 = Player('AI','O');
    
    let activePlayer = player1;
    let turnCount = 0;

    const switchTurn = () => {
        if(activePlayer == player1){
            displayController.setGameInfo(`Player O's Turn`);
            activePlayer = player2;
            turnCount++;
            //If player name is AI simulate a click
            if(player2.name == 'AI'){
                displayController.setGameInfo(`AI's Turn`);
                displayController.disableButton();
                setTimeout(() => {
                    displayController.enableButton();
                    AI.aiMove();
                  }, 1000);
                  
            }
        } else {
            displayController.setGameInfo(`Player X's Turn`);
            activePlayer = player1;
            turnCount++;
        }
    };

    const playRound = (index) => {
        let success = Gameboard.placeSign(index, activePlayer.sign);
        if (success) {
            endGame(Gameboard.checkWin(activePlayer.sign));
            return true;
        };
    }

    const resetMatch = () => {
        activePlayer = player1;
        turnCount = 0;
    }

    const getActivePlayerSign = () => {
        return activePlayer.sign;
    }

    //Finish up ending the game on 9 turns and checking result
    const endGame = (won) => {
        if (won == true){
            displayController.disableButton();
            displayController.setGameInfo(`Player ${activePlayer.sign} Won!`);
            return
        } else if (turnCount == 8) {
            displayController.setGameInfo(`Tie!`);
        } else {
            switchTurn();
        }
    }

    return {playRound, resetMatch, getActivePlayerSign, switchTurn};
})();    


//Display Controller Object(module)
const displayController = (() => {
    const htmlBoard = document.querySelectorAll('button.square');
    for (let i = 0; i < htmlBoard.length; i++){
        htmlBoard[i].addEventListener('click', () => {
            let sign = gameController.getActivePlayerSign();
            let success = gameController.playRound(i);
            if (success) {
                htmlBoard[i].textContent = sign;
            };
        })
    }

    //Function to disable the buttons
    const disableButton = () => {
        htmlBoard.forEach(button => {
            button.disabled = true;
        });
    }

    const enableButton = () => {
        htmlBoard.forEach(button => {
            button.disabled = false;
        });
    }

    //Make Game Info Accessible
    const gameInfo = document.querySelector('.gameInfo h2');
    const setGameInfo = (newText) => {
        gameInfo.textContent = newText;
    }

    //Reset Game
    const resetButton = document.querySelector('button.restart');
    resetButton.addEventListener('click', () => {
        Gameboard.resetBoard();
        gameController.resetMatch();
        htmlBoard.forEach(button => {
            button.textContent = '';
            button.disabled = false;
        });
        gameInfo.textContent = `Player X's Turn`;
    })

    return {disableButton, enableButton, setGameInfo, htmlBoard};
})();

//Artifical Player Module 
const AI = (() => {
    //Attempt to play a random spot in board until return true
    const attemptMove = () => {
        const tempBoard = Gameboard.getBoard();
        let success = false;
        let randomSpot;

        while(!success){
            randomSpot =  Math.floor(Math.random() * 9);
            if (tempBoard[randomSpot] == ''){
                success = true;
            }
        }
        return randomSpot;
    }


    const aiMove = () => {
        let validMove = attemptMove();
        displayController.htmlBoard[validMove].click();
    }

    return {aiMove};
})();