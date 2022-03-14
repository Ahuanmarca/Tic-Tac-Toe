// Functions for TIcTacToe game with HTML, CSS and JavaScript
// Version 3.0, 13-March-2022


// RESTART GAME FUNCTION
function restartGame() {
    console.log("Restarting game")
    gameStatus.canClick = false;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            boardArray[i][j].innerText = "";
        }
    }
    gameStatus.currentPlayer = "X";
    gameStatus.gameOver = false;
    gameStatus.turn = 0;
    gameStatus.winner = "";
    
    statusDisplay.classList.remove("oPlayerDisplay");
    statusDisplay.classList.remove("xPlayerDisplay");
    statusDisplay.classList.remove("tieDisplay");
    statusDisplay.classList.add("initialDisplay");
    statusDisplay.innerText = ".";
    
   // Mock loading time
   setTimeout(function() {
       statusDisplay.innerText = "..";
    }, 100)
    setTimeout(function() {
        statusDisplay.innerText = "...";
    }, 200)
    setTimeout(function() {
        statusDisplay.innerText = "....";
    }, 300)
    setTimeout(function() {
        statusDisplay.innerText = ".....";
    }, 400)
    
    setTimeout(function() {
        statusDisplay.innerText = "X's turn";
        statusDisplay.classList.remove("initialDisplay");
        statusDisplay.classList.remove("oPlayerDisplay");
        statusDisplay.classList.add("xPlayerDisplay");
        gameStatus.canClick = true;
    }, 500)
}


// CHECK IF PLAYER IS WINNER IN A GIVEN BOARD
//      Takes board and player, returns boolean
//      Loops all possible lines looking for 3 in a row
function isWinner(arr, player) {
    let diagonalA = 0, diagonalB = 0;
    for (let i = 0; i < 3; i++) {
        let horizontal = 0, vertical = 0;
        for (let j = 0; j < 3; j++) {
            if (arr[i][j] == player) {horizontal++;} // Loop horizontal lines
            if (arr[j][i] == player) {vertical++;} // Loop vertical lines
        }
        // Loop diagonal lines
        if (arr[i][i] == player) {diagonalA++;}
        if (arr[i][2-i] == player) {diagonalB++;}

        if (horizontal == 3 || vertical == 3 || diagonalA == 3 || diagonalB == 3) {
            return true;
        }
    }
    return false;
}


// CHECK IF THE CURRENT PLAYER SHOULD DO A BLOCKING MOVE
//      Return a list with the move(s), else return an empty list
function shouldBlock() {
    let arr = strArr(boardArray);
    let player = switchPlayer(gameStatus.currentPlayer)

    let possibeMoves = getPossibleMoves(arr);
    let simBoards = [];
    let blockingMoves = [];
    for (let i = 0; i < possibeMoves.length; i++) {
        let tmp = simulateMove(arr, possibeMoves[i], player);
        simBoards.push(tmp);
    }
    for (let i = 0; i < simBoards.length; i++) {
        if (isWinner(simBoards[i], player)) {
            let tmp = possibeMoves[i];
            blockingMoves.push(tmp);
        }
    }
    return blockingMoves;
}


// SWITCH PLAYER
//      Takes one player, returns the other
function switchPlayer(player) {
    if (player == "X") {
        return "O";
    } else if (player == "O") {
        return "X";
    }
}


// ENDS GAME AND DECLARES WINNER OR TIE
//      Esta función está un poco enredada y redundante
function endGame() {
    console.log("Ending Game")
    
    if (!isWinner(strArr(boardArray), gameStatus.currentPlayer)) {
        gameStatus.gameOver = true;
        updateStatusDisplay()
    } else {
        gameStatus.winner = gameStatus.currentPlayer;
        gameStatus.gameOver = true;
        updateStatusDisplay()
    }

    // Update Score Keeper
    if (gameStatus.winner == "X") {
        gameStatus.xWins++;
        document.querySelector("#xWinsDisplay").innerText = gameStatus.xWins;
        console.log("X Wins!")
    } else if (gameStatus.winner == "O") {
        gameStatus.oWins++;
        document.querySelector("#oWinsDisplay").innerText = gameStatus.oWins;
        console.log("O Wins!")
    } else {
        console.log("It's a Tie!")
    }

    playSound()
}


// GETS SCORE OF A FINISHED BOARD
//      X wins, return 1 || O wins, return -1 || No winner, return 0 
//      Must be called on finished boards, passing 3x3 array of strings
function getValue(arr) {
    if (isWinner(arr, "X")) {
        return 1;
    }
    else if (isWinner(arr, "O")) {
        return -1;
    }
    else {
        return 0;
    }
}


// RETURNS A COPY OF A 3X3 ARRAY, VALUE BY VALUE
function copyArr(arr) {
    let arrC = [[], [], []]
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {        
            arrC[i].push(arr[i][j]);
        }
    }
    return arrC;
}


// RETURNS AN ARRAY OF STRINGS FROM THE INNERTEXT VALUES OF AN ARRAY OF NODES
//      Helps keep the code cleaner
function strArr(divArr) {
    let arr = divArr.map(function(row) {
        return row.map(function(cell) {
            return cell.innerText;
        })
    })
    return arr;
}


// GETS POSSIBLE MOVES FROM A BOARD
//      Looks for empty cells and records them as possible moves
//      Returns list of objects with coordinates and (empty) score
function getPossibleMoves(arr) {
    let possibleMoves = [];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            // Checks if cell is empty (available for a move)
            if (arr[i][j] == "") {
                // Creates an object literal with the coordinates of the move and the (undefined) score
                let move = {
                    move: [i, j],
                    score: undefined
                }
                // Pushes the object literal into the possibeMoves list
                possibleMoves.push(move);
            }
        }
    }
    return possibleMoves;
}


// SIMULATE MOVE
//      Returns copy of the board with the new move.
//      Esta función está hecha para usarla en simulaciones, así que no se debe
//      llamar pasando variables globales.
//      Necesita arr, move y player
function simulateMove(arr, move, player) {
    let simBoard = copyArr(arr);
    simBoard[move.move[0]][move.move[1]] = player;
    return simBoard;
}


// FROM A LIST OF MOVES, FIND THE VALUE OF THE BEST MOVE
//      Returns the value
function bestValue(possibleMoves, player) {
    if (player == 'X') {
        let bestValue = possibleMoves.reduce((x, y) => {
            if (x.score > y.score) {
                return x;
            } else {
                return y;
            }
        })
        return bestValue.score;
    }
    if (player == 'O') {
        let bestValue = possibleMoves.reduce((x, y) => {
            if (x.score > y.score) {
                return y;
            } else {
                return x;
            }
        })
        return bestValue.score;
    }
}


// RECEIVES A LIST OF ANY SIZE, RANDOMLY RETURNS ONE OF IT'S ELEMENTS
function randomPick(list) {
    return list[Math.floor(Math.random() * list.length)];
}


// PLAY SOUND
function playSound() {
    if (gameStatus.winner == gameStatus.computer) {
        document.querySelector("#lose_Sound").play();
    } else if (gameStatus.winner == switchPlayer(gameStatus.computer)) {
        document.querySelector("#win_Sound").play();
    } else if (gameStatus.gameOver) {
        document.querySelector("#draw_Sound").play();
    } else {
        document.querySelector(`#move${gameStatus.turn + 1}_Sound`).play();
    }
}


// UPDATE STATUS DISPLAY
//      Actualiza según turno del jugador
//      Actualiza según final del juego
//      NO ACTUALIZA AL REINICIAR EL JUEGO
function updateStatusDisplay() {
    /* 
        TODO
        Que también actualice display al reiniciar
        Ojo, al reiniciar hay varios setTimeout()
    */
    if (!gameStatus.gameOver) {
        statusDisplay.classList.remove('initialDisplay')
        if (gameStatus.currentPlayer == "X") {
            statusDisplay.classList.remove('oPlayerDisplay')
            statusDisplay.classList.add('xPlayerDisplay')
        } else {
            statusDisplay.classList.remove('xPlayerDisplay')
            statusDisplay.classList.add('oPlayerDisplay')
        }
        statusDisplay.innerText = `${gameStatus.currentPlayer}'s turn`
    } else {
        if (gameStatus.winner == "") {
            statusDisplay.innerText = "IT'S A TIE!"
            statusDisplay.classList.remove("initialDisplay");
            statusDisplay.classList.remove("xPlayerDisplay");
            statusDisplay.classList.remove("oPlayerDisplay");
            statusDisplay.classList.add("tieDisplay");
        } else {
            statusDisplay.innerText = "Winner: " + gameStatus.winner
        }
    }

}


// COMPUTER "CLICK"
//      To be called inside computerMove()
function computerClick(x, y) {
    let cell = boardArray[x][y]
    cell.innerText = gameStatus.currentPlayer
    if (cell.innerText == "X") {
        cell.style.color = "blue"
    } else {
        cell.style.color = "red"
    }
    isWinner(strArr(boardArray), gameStatus.currentPlayer) && endGame()
    gameStatus.turn >= 8 && !gameStatus.gameOver && endGame()
    
    if (!gameStatus.gameOver) {
        playSound()
        gameStatus.turn++
        gameStatus.currentPlayer = switchPlayer(gameStatus.currentPlayer)
        updateStatusDisplay()
    }
}




// SIMULATE GAME
function simulateGame() {
    if (gameStatus.turn == 0) {
        computerMove()
        setTimeout(computerMove, 250)
        setTimeout(computerMove, 500)
        setTimeout(computerMove, 750)
        setTimeout(computerMove, 1000)
        setTimeout(computerMove, 1250)
        setTimeout(computerMove, 1500)
        setTimeout(computerMove, 1750)
        setTimeout(computerMove, 2000)
    } else {
        console.warn("MUST RESTART GAME FIRST!")
    }
}