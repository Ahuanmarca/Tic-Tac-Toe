// TicTacToe game with HTML, CSS and JavaScript
// Version 3.0, 13-March-20202


// Difficulty setting
const difficulty = {
    easy: false,
    medium: true,
    hard: false
}


// Current game status
const gameStatus = {
    gameOver: false,
    winner: "",
    turn: 0,
    // human: "X", // Currently not being used
    computer: "O",
    currentPlayer: "X", // Players: "X" and "O"
    canClick: true,
    xWins: 0,
    oWins: 0,
}


// MENUS, BUTTONS, PAGE DISPLAYS
const choosePlayer = document.querySelector("#choosePlayer")
const chooseDifficulty = document.querySelector("#chooseDifficulty")
const winnerDisplay = document.querySelector("#winnerDisplay")
const statusDisplay = document.querySelector("#statusDisplay")
const restartButton = document.querySelector("#restartButton")
const pointerOnHover = document.querySelectorAll(".pointerOnHover")
// Initial display when loading page
statusDisplay.innerText = "Start game or select player"


// RESTART GAME BUTTON
document.querySelector("#restartButton").addEventListener("click", function() {
    restartGame();
    if (gameStatus.computer == "X") {
        setTimeout(computerMove, 800);
    }
})


// SELECT PLAYER DROPDOWN MENU
choosePlayer.addEventListener('change', function() {
    console.log("Changing player")
    if (choosePlayer.value == 'X') {
        gameStatus.computer = 'O';
    }
    else {
        gameStatus.computer = 'X';
    }
    restartButton.click();
})


// SELECT DIFFICULTY DROPDOWN MENU
chooseDifficulty.addEventListener('change', function() {
    console.log("Changing difficulty")
    if (chooseDifficulty.value == 'easy') {
        difficulty.easy = true
        difficulty.medium = false
        difficulty.hard = false
    } else if (chooseDifficulty.value == 'medium') {
        difficulty.easy = false
        difficulty.medium = true
        difficulty.hard = false
    } else {
        difficulty.easy = false
        difficulty.medium = false
        difficulty.hard = true
    }
    restartButton.click();
})


// SHOW POINTER ON HOVER
for (let element of pointerOnHover) {
    element.addEventListener("mouseover", () => {
        element.style.cursor = "pointer"
    })
}


// SHOW POINTER OR NOT-ALLOWED ON HOVER
let allCells = document.querySelectorAll(".cell")
for (let cell of allCells) {
    cell.addEventListener("mouseover", function() {
        if (gameStatus.gameOver == false) {
            this.style.cursor = "pointer";
        } else {
            this.style.cursor = "not-allowed";
        }
    })
}


// LINK 3X3 BOARD FROM INDEX.HTML TO A 3X3 ARRAY
let boardArray = [[], [], []];
let counter = 0;
for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
        boardArray[i][j] = document.querySelector("#board").children[counter];
        counter++;
    }
}


// BOARD CELLS CLICK
//      Generates move for current player
//      Then, calls computerMove()

for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {

        boardArray[i][j].addEventListener('click', function() {

            if (gameStatus.canClick && this.innerText == "" && !gameStatus.gameOver) {
                
                gameStatus.canClick = false;
                this.innerText = gameStatus.currentPlayer;
                if (this.innerText == "X") {
                    this.style.color = "blue";
                } else {
                    this.style.color = "red";
                }
                // CHECK IF GAME ENDED
                if (isWinner(strArr(boardArray), gameStatus.currentPlayer) || gameStatus.turn >= 8) {
                    endGame()
                }
                // IF GAME CONTINUES
                if (!gameStatus.gameOver) {
                    playSound();
                    gameStatus.turn++;
                    gameStatus.currentPlayer = switchPlayer(gameStatus.currentPlayer);
                    updateStatusDisplay()
                    setTimeout(computerMove, 400)                        
                }
            }
        })
    }
}
// ******************** END OF CELLS CLICK EVENT LISTENER ********************




// SCORE SIMULATION
//      This function will return ONLY the score itself
//      The score this function WANTS to return depends on the player passed as argument

function simulateScore(arr, player) {

    // Generate list of possible moves
    //      List of objects with x, y coordinates and empty score
    let moves = getPossibleMoves(arr);

    // If the board is empty or has only one move, always returns 0
    if (moves.length >= 8) {
        return 0;
    }

    // If there's only one empty cell on the board
    //      Generate simulated move, get it´s value, return the value
    else if (moves.length == 1) {
        let simBoard = simulateMove(arr, moves[0], player);
        return getValue(simBoard);
    }

    // IF THERE ARE 2 To 7 MOVES LEFT
    //      Create an empty list of simulated scores
    //      Loop possible moves list
    //      Record the scores inside a simulatedScores list
    else {

        let simulatedScores = []

        for (let i = 0; i < moves.length; i++) {
            let simBoard = simulateMove(arr, moves[i], player);
            // If this generates a win, return it's score (ending the loop)
            if (isWinner(simBoard, player)) {
                return getValue(simBoard)
            }

            else {
                // RECURSIVE CASE:
                //      Call simulateScore() with simulated board and opposing player
                //      Record scores in simulatedScores
                let tmpScore = simulateScore(simBoard, switchPlayer(player))
                simulatedScores.push(tmpScore)
            }

        }

        // Return score depending on the currentPlayer (X wants highest, O wants lowest)
        if (player == "X") {
            return simulatedScores.reduce((x, y) => {
                if (x > y) {
                    return x;
                } else {
                    return y;
                }
            })
        }
        if (player == "O") {
            return simulatedScores.reduce((x, y) => {
                if (x < y) {
                    return x;
                } else {
                    return y;
                }
            })
        }
    }
}
// ******************** END OF simulateScore() DEFFINITION ********************




// COMPUTER MOVE FUNCTION
    // Computer performs a move automatically

function computerMove() {

    // LIST OF SIMULATED BOARDS
    let arr = strArr(boardArray);
    let possibleMoves = getPossibleMoves(arr);
    let simBoards = []
    for (let i = 0; i < possibleMoves.length; i++) {
        let tmp = simulateMove(arr, possibleMoves[i], gameStatus.currentPlayer);
        simBoards.push(tmp);
    }

    // CHECKS OUTCOME OF SIMULATED BOARDS
    //      A) If (Causes win || Last turn) -> do the move (no need to simulate scores)
    //      B) Else -> Game continues, will simulate scores

    for (let i = 0; i < simBoards.length; i++) {

        let x = possibleMoves[i].move[0];
        let y = possibleMoves[i].move[1];

        // If any move wins the game or there's only one move available, do that move
        if (isWinner(simBoards[i], gameStatus.currentPlayer) || possibleMoves.length == 1) {
            computerClick(x, y)
            break;
        }

        // SIMULATE SCORES AND STORE THEM IN possibleMoves LIST
        //      This will be needed for the Minimax Algorithm
        else {
            let simScore = simulateScore(simBoards[i], switchPlayer(gameStatus.currentPlayer))
            possibleMoves[i].score = simScore;
        }
    }

    /*
    MINIMAX ALGORITHM
    Recién se aplica si el juego continúa después de este punto.

    COMPUTER BEHAVIOUR:
         "Easy" -> most times do a bad move
         "Medium" -> sometimes do a bad move
         "Hard" > rarely do a bad move
    */
    
    if (!gameStatus.gameOver) {

        // Lists of GOOD MOVES and BAD MOVES
        let goodMoves = possibleMoves.filter(n => n.score == bestValue(possibleMoves, gameStatus.currentPlayer))
        let badMoves = possibleMoves.filter(n => n.score != bestValue(possibleMoves, gameStatus.currentPlayer))

        // Die roll for computer's luck
        let luck = Math.floor(Math.random() *100) + 1
        // console.log(`computer's luck: ${luck}`)

        let chosenOne = null;

        // SI LA COMPUTADORA YA PERDIÓ, IGUAL INTENTA BLOQUEAR LOS 3 EN RAYA
        if (shouldBlock().length && gameStatus.currentPlayer == "O" && badMoves.length == 0 && goodMoves[0].score == 1) {
            console.log("Blocking Move")
            let blockingMoves = shouldBlock();
            chosenOne = randomPick(blockingMoves);
        } else if (shouldBlock().length && gameStatus.currentPlayer == "X" && badMoves.length == 0 && goodMoves[0].score == -1) {
            console.log("Blocking Move")
            let blockingMoves = shouldBlock();
            chosenOne = randomPick(blockingMoves);
        // HARD DIFFICULTY
        } else if (difficulty.hard) {
            if (luck <= 2 && badMoves.length >= 1) {
                chosenOne = randomPick(badMoves);
            } else {
                chosenOne = randomPick(goodMoves);
            }
        // MEDIUM DIFFICULTY
        } else if (difficulty.medium) {
            if (luck <= 5 && badMoves.length >= 1) {
                chosenOne = randomPick(badMoves);
            } else {
                chosenOne = randomPick(goodMoves);
            }
        // EASY DIFFICULTY
        } else if (difficulty.easy) {
            if (luck <= 25 && badMoves.length >= 1) {
                chosenOne = randomPick(badMoves);
            } else {
                chosenOne = randomPick(goodMoves);
            }
        }

        // Perform the picked move
        let x = chosenOne.move[0];
        let y = chosenOne.move[1];
        // boardArray[x][y].click() // <-- Antes se ejecutaba esto, pero era problemático
        computerClick(x, y)
        gameStatus.canClick = true;
    }
}
// **************** END OF computerMove() DEFFINITION !!!! ****************
