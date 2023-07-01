//Gameboard Module
const Gameboard = (() => {
    //Private state of GameBoard
    const board = ['','','',
                   '','','',
                   '','',''];

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
        let result = 'none';
        for (let i = 0; i < winConditions.length; i++){
            //Checks if every every number in the playerFields array is present in the current winConditions iteration
            if(winConditions[i].every(num => playerFields.includes(num))){
                result = 'won';
            }
        }
        console.log(result);
    }

    return {placeSign, resetBoard, checkWin};
})();

//Player Object Module
const Player = (name, sign) => {
    return {name, sign};
};


//Game Flow Module
const gameController = (() => {
    const player1 = Player(1, 'x');
    const player2 = Player(2,'o');
    
    let activePlayer = player1;
    let turnCount = 0;

    const switchTurn = () => {
        if(activePlayer == player1){
            activePlayer = player2;
            turnCount++;
        } else {
            activePlayer = player1;
            turnCount++;
        }
    };

    const playRound = (index) => {
        let success = Gameboard.placeSign(index, activePlayer.sign);
        if (success) {
            Gameboard.checkWin(activePlayer.sign);
            return true;
        };
    }

    const getTurnCount = () => {
        return turnCount;
    }

    const getActivePlayerSign = () => {
        return activePlayer.sign;
    }

    //Finish up ending the game on 9 turns and checking result

    return {playRound, getTurnCount, getActivePlayerSign, switchTurn};
})();    


//Display Controller Object(module)
    //Used to update the UI
const displayController = (() => {
    const htmlBoard = document.querySelectorAll('button.square');

    for (let i = 0; i < htmlBoard.length; i++){
        htmlBoard[i].addEventListener('click', () => {
            let success = gameController.playRound(i);
            if (success) {
                htmlBoard[i].textContent = gameController.getActivePlayerSign();
            gameController.switchTurn();
            };
        })
    }

})();
