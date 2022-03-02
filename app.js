// Object literal with information about the game
const gameStatus = {
	gameOver: false,
    winner: "",
    turn: 0,
    // By default human is X and computer is O
    human: "X", // Currently not being used
    computer: "O",
    // X is always the initial current player
    currentPlayer: "X", // Players: "X" and "O"
    // Prevent user from making a move when it's not it's turn
    canClick: true,
    // Keep count of each player's victories
    xWins: 0,
    oWins: 0,
    // Difficulty (computer behaviour)
    difficulty: 1,
    badMoves: 0,
    blockedWins: 0
}

// DOM OBJECTS FOR FUNCTIONALITY
let choosePlayer = document.querySelector("#choosePlayer");
let chooseDifficulty = document.querySelector("#chooseDifficulty");

// DOM OBJECTS FOR DISPLAY
let winnerDisplay = document.querySelector("#winnerDisplay");
let statusDisplay = document.querySelector("#statusDisplay");

// STATUS DISPLAY ON PAGE
// statusDisplay.innerText = `${gameStatus.currentPlayer}'S TURN`
statusDisplay.innerText = "Start game or select player"



// LINK THE 3X3 BOARD THAT EXISTS IN THE MARKUP TO AN ARRAY HERE (FOR EASIER MANIPULATION)
let boardArray = [[], [], []];
let counter = 0;
for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
        boardArray[i][j] = document.querySelector("#board").children[counter];
        counter++;
    }
}

// BOARD CELLS CLICK EVENT LISTENERS

    // Click generates move for current player (human or computer)
    // Checks if a winner exists after the move
    // Advances one turn
    // Changes the current player
    // Performs a computer move after each human move

for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
        // Adds a click listener to all cells in boardArray
        boardArray[i][j].addEventListener('click', function() {

            // Prevent the user from making a move when it's not it's turn
            if (gameStatus.canClick == true) {

                // document.querySelector("#move4SFX").play();

                if (gameStatus.currentPlayer != gameStatus.computer && this.innerText == "") {
                    gameStatus.canClick = false;
                }

                // Clicked cell is empty AND game status isn't over
                if (this.innerText == "" && !gameStatus.gameOver) {
                    // Inserts current player's symbol into the clicked cell
                    this.innerText = gameStatus.currentPlayer;
                    // Give different color to X and O
                    if (this.innerText == "X") {
                        this.style.color = "blue";
                    } else {
                        this.style.color = "red";
                    }
                    // If the last move generates a victory, finish the game and declare the current player as winner
                    // isWinner function takes the board and the player as arguments, returns boolean
                    // endGame() function should take true if there's a winner and false if there's no winner (tie)
                    isWinner(strArr(boardArray), gameStatus.currentPlayer) && endGame(true);
                    // If we reach 9 turns without a winner, finish the game and declare a tie
                    gameStatus.turn >= 8 && !gameStatus.gameOver && endGame(false);
                    // If the game continues...
                    // ...add one turn
                    // playSound();
                    !gameStatus.gameOver && playSound();
                    !gameStatus.gameOver && gameStatus.turn++;
                    // ...and switch the current player
                    if (!gameStatus.gameOver) {
                        // switchPlayer() function takes some player and returns the other
                        // The function won't affect gamestatus.currentPlayer by itself, must use return value
                        gameStatus.currentPlayer = switchPlayer(gameStatus.currentPlayer);
                        // Change the current player display on the page (NEEDS SOME ANIMATION OR COLOR)
                        
                        // if (gameStatus.turn == 1) {
                        //     statusDisplay.classList.remove('initialDisplay');
                        //     statusDisplay.classList.add('currentPlayerDisplay');
                        // }
                        
                        statusDisplay.classList.remove('initialDisplay');
                        if (gameStatus.currentPlayer == "X") {
                            statusDisplay.classList.remove('oPlayerDisplay');
                            statusDisplay.classList.add('xPlayerDisplay');
                        } else {
                            statusDisplay.classList.remove('xPlayerDisplay');
                            statusDisplay.classList.add('oPlayerDisplay');
                        }
                        
                        statusDisplay.innerText = `${gameStatus.currentPlayer}'s turn`
    
                    }
                    // COMPUTER MOVE...
                    // After switching the player, if the computer becomes the current player, perform computer move
                    if (!gameStatus.gameOver) {
                        // console.log(`gameover status: ${gameStatus.gameOver}`)
                        if (gameStatus.computer == "O" && gameStatus.currentPlayer == "O") {
                            setTimeout(computerMove, 400)
                        }
                        if (gameStatus.computer == "X" && gameStatus.currentPlayer == "X") {
                            setTimeout(computerMove, 400)
                        }
    
                    }
                }  

            }

        })
    }
}


// RESTART GAME BUTTON
    // Calls restarGame() function
    // IF COMPUTER IS CURRENTLY X, PERFORM COMPUTER MOVE

document.querySelector("#restartButton").addEventListener("click", function() {

    restartGame();
    
    if (gameStatus.computer == "X") {
        setTimeout(computerMove, 800);
    }
    
})

// RESTAR GAME FUNCTION
    // Erases symbols from the board
    // Sets current player to X
    // Sets turn to 0
    // Sets winner to ""
function restartGame() {
    console.log("Restarting game")

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            boardArray[i][j].innerText = "";
        }
    }
    gameStatus.currentPlayer = "X";
    gameStatus.gameOver = false;
    gameStatus.turn = 0;
    gameStatus.winner = "";
    gameStatus.canClick = true;
    gameStatus.blockedWins = 0;

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
    }, 500)
}

// SELECT PLAYER DROPDOWN MENU
    // Listens for 'change' event in drop down menu
    // Sets computer symbol opposing to selected by human (gameStatus.computer)
    // Restarts the game by clicking the restart button (which resets the game and performs a computer move if neccesary)
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
        gameStatus.difficulty = 0;
    } else if (chooseDifficulty.value == 'medium') {
        gameStatus.difficulty = 1;
    } else {
        gameStatus.difficulty = 2;
    }
    restartButton.click();
})



// UTILITY FUNCTIONS


// CHECK IF PLAYER IS WINNER IN A GIVEN BOARD
// Takes board and player, returns boolean
// Loops all possible lines looking for 3 in a row
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
    // Create a list of possible moves
    // Create a list of simulated boards with the possible moves
    // Check if any of those boards generates a win
    // If a win is generated, return a list with the move(s), else return an empty list
function shouldBlock(arr, player) {    
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
// Takes one player, returns the other
// This function wont't chagne the player by itself, so it can be used in simulations
function switchPlayer(player) {
    // Some gentle warning, just in case
    gameStatus.gameOver && console.warn("Called switchPlayer() on a finished game")

    let switchedPlayer = '';
    if (player == "X") {
        switchedPlayer = "O";
    } else {
        switchedPlayer = "X";
    }
    return switchedPlayer;
}


// ENDS GAME AND DECLARES WINNER OR TIE
    // Takes true or false as arguments
    // 'true' means that a winner exists, 'false' means nobody won, it's a tie
    // ...not convinced of using booleans here, it's kinda confusing
function endGame(playerWon) {
    console.log("Ending Game")
    if (!playerWon) {
        gameStatus.gameOver = true;
        statusDisplay.innerText = "IT'S A TIE!"
        statusDisplay.classList.remove("initialDisplay");
        statusDisplay.classList.remove("xPlayerDisplay");
        statusDisplay.classList.remove("oPlayerDisplay");
        statusDisplay.classList.add("tieDisplay");
        document.querySelector("#drawSFX").play();
    } else {
        gameStatus.winner = gameStatus.currentPlayer;
        gameStatus.gameOver = true;
        statusDisplay.innerText = "Winner: " + gameStatus.winner;
        if (gameStatus.winner == "X") {
            gameStatus.xWins++;
            document.querySelector("#xWinsDisplay").innerText = gameStatus.xWins;
        } else {
            gameStatus.oWins++;
            document.querySelector("#oWinsDisplay").innerText = gameStatus.oWins;
        }

        if (gameStatus.winner == gameStatus.computer) {
            document.querySelector("#looseSFX").play();
        } else {
            document.querySelector("#winSFX").play();
        }

    }
    console.log(`gameover status: ${gameStatus.gameOver}`)

}


// GETS SCORE OF A FINISHED BOARD -- TESTED!!
// Must be called on finished boards, passing 3x3 array of strings
function getValue(arr) {
    // If the winner is X, returns 1
    if (isWinner(arr, "X")) {return 1;}
    // If the winner is O, returns -1
    else if (isWinner(arr, "O")) {return -1;}
    // If there´s no winner, return 0
    else {return 0;}
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
    // This function helps keep the code a little cleaner when the board is needed
function strArr(divArr) {
    let arr = divArr.map(function(row) {
        return row.map(function(cell) {
            return cell.innerText;
        })
    })
    return arr;
}

// GETS POSSIBLE MOVES FROM A BOARD
    // Takes 3x3 array of strings - convert beforehand with strArr()
    // Looks for empty cells and records them as possible moves
    // Each possible move is an Object Literal containing the coordinates of the move and it's (undefined) score
    // The return value is a list of objects. If no moves are possible, returns an empty list
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


// SIMULATE MOVE IN A COPY OF THE BOARD
    // This function just simulates the move, creating and returning a simulated board with the new move
    // This function will not evaluate the board in any way (score, finished, etc)
    // Takes 3 arguments:
        // 1) current board (arr)
        // 2) move == object literal with the coordinates of the move
            // move.move[0] and move.move[1] == coordinates
        // 3) current (simulated) player (should be switched upon calling this function)
function simulateMove(arr, move, player) {
    // Creates a copy of the received array
    let simBoard = copyArr(arr);
    // Places the new (simulated) move in the simulated board
    simBoard[move.move[0]][move.move[1]] = player;
    // Returns thw whole simulated board
    return simBoard;
}


// SIMULATE SCORE IN ANY INCOMPLETE BOARD (EVEN IF IT'S EMPTY)
    // This function will return only the score itself, NOT HOW WE GOT THERE
        // The score this function WANTS to return depends on the current player (actual or simulated)
        // Simulates all moves in current board
        // RECURSIVELY SIMULATES ALL FUTURE MOVES FROM BOTH PLAYERS
        // All moves from both players will be optimal
    // Takes as arguments the current board and the current player (both real or simulated)

// Score simulation
function simulateScore(arr, player) {

    // Generate list of dictionaries with possible moves and their scores (using custom function)
    let moves = getPossibleMoves(arr);

    // If the board is empty or has only one move, always returns 0
        // in those cases the game will always finish in a draw if both players play perfectly
        // ...thus we can save some processing... but should we?
    if (moves.length >= 8) {
        return 0;
    }

    // If there's only one empty cell in the board
        // Generate the simulated move, get it´s value, return it
    else if (moves.length == 1) {

        // Generate a simulated board with the last possible move
        let simBoard = simulateMove(arr, moves[0], player);

        // Return the score of the simulated board
        return getValue(simBoard);
    }

    // IF THERE ARE 2 To 7 MOVES LEFT IN THE BOARD
        // Create an empty list of simulated scores (REMEMBER, WE JUST CARE FOR THE SCORES THEMSELVES!!)
        // Loop possible moves and record the score for each one, pushing it into the simulatedScores list
    else {
        
        let simulatedScores = []

        // Loop the list of possible moves
        for (let i = 0; i < moves.length; i++) {
            
            // Creates a simulated board
            let simBoard = simulateMove(arr, moves[i], player);
            
            // Check if the last simulated board would generate a winner. If so, return it's score (ending the loop)
            if (isWinner(simBoard, player)) {
                return getValue(simBoard)
            }

            else {
                // RECURSIVE CASE:
                // If last move does not generate winner, this function must call itself
                // Call simulateScore(), passing as arguments:
                    // The simulated board
                    // The opposing player - switch it with switchPlayer()
                // Record the returned score in the simulatedScores list, so we can pick which to return later
                let tmpScore = simulateScore(simBoard, switchPlayer(player))
                simulatedScores.push(tmpScore)
            }

        }

        // Return a score from the simulatedScores list, depending on the current (simulated) player

        // If current player is X, will return the highest score in the list
        if (player == "X") {
            return simulatedScores.reduce((x, y) => {
                if (x > y) {
                    return x;
                } else {
                    return y;
                }
            })
        }

        // If current player is O, will return the lowest score in the list
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



// COMPUTER MOVE FUNCTION
    // Computer performs a move automatically

function computerMove() {

    console.log("doing computer move")
    // document.querySelector("#move5SFX").play();

    // Allow clicking on cell (disabled in cell's click event)
    gameStatus.canClick = true;

    // Creates a copy of the boardArray that contains only the innerHTML values as strings
    let arr = strArr(boardArray);

    // Creates a list of object literals containing all possible moves and it's (yet undefined) scores
    let possibleMoves = getPossibleMoves(arr);

    // Creates an array and fills it with simulated boards for all possible moves
    let simBoards = []
    // Loops over all possible moves
    for (let i = 0; i < possibleMoves.length; i++) {
        // Creates a simulated board, stores it in temporary variable
        let tmp = simulateMove(arr, possibleMoves[i], gameStatus.currentPlayer);
        // Pushes the simulated board into simBoards array
        simBoards.push(tmp);
    }
    
    // Creates an empty list of blocking moves
    // let blockingMoves = []

    // CHECKS THE OUTCOME OF EVERY SIMULATED BOARD
        // Option A) Causes the current player to win the game (break loop, wont simulate scores).
        // Option B) Causes the board to completely fill (break loop, wont simulate socores).
        // Option C) Game continues, will simulate scores

    for (let i = 0; i < simBoards.length; i++) {

        // Temp variables for possible move coordinates
        let x = possibleMoves[i].move[0];
        let y = possibleMoves[i].move[1];

        // Check if move will win the game. If so, perform the move
        if (isWinner(simBoards[i], gameStatus.currentPlayer)) {
            // boardArray[possibleMoves[i].move[0]][possibleMoves[i].move[1]].click();
            boardArray[x][y].click();
            break;
        }
        // Check if there's only one move left. If so, perform the move
        else if (possibleMoves.length == 1) {
            boardArray[x][y].click();
            break;
        }
        // Check if there's one or more rows that the opponent could complete on next turn
        // Do this by checking if the current simulated board did by change block the opponent from winning
        // ...if so, perform the move (shouldn't matter if the game is already impossible to win)
        // Else (game continues)...
        // SIMULATE SCORES OF ALL POSSIBLE MOVES AND STORE THEM IN possibleMoves LIST
        // Simulate the score of the board when continuing the game
        // Must call simulateScore, passing a) the simulated board and b) the opposing player
        // ...this simulates the next turn, which belongs to the opposing player
        // ...the return value that we get belongs to the current board (which is the same as all the following simulated boards)
        else {
            // Get the value of the current board by recursively simulating all following turns
            let simScore = simulateScore(simBoards[i], switchPlayer(gameStatus.currentPlayer))
            // Update possibleMoves, so the obtained score is stored in the corresponding object of the list
            possibleMoves[i].score = simScore;
        }

        // if (shouldBlock(simBoards[i], gameStatus.currentPlayer)) {
        //     // boardArray[x][y].click();
        //     console.warn(`Computer could block with: ${x} ${y}`)
        //     blockingMoves.push(possibleMoves[i])
        // }
    }
    
    // console.log(gameStatus.blockedWins)
    // console.log(blockingMoves)

    // If the game hasn't finished, now we have a list of possible moves, all of them with their score
    
    // Create a list of ONLY GOOD MOVES
    let filteredMoves = possibleMoves.filter(n => n.score == bestValue(possibleMoves, gameStatus.currentPlayer))
    // console.log("Good moves:")
    // console.log(filteredMoves)
    
    // Create a list of ONLY BAD MOVES
    let badMoves = possibleMoves.filter(n => n.score != bestValue(possibleMoves, gameStatus.currentPlayer))
    // console.log("Bad moves:")
    // console.log(badMoves)
    

    // COMPUTER BEHAVIOUR
        // If difficulty is "Easy", most times do a bad move
        // If difficulty is "Medium", sometimes do a bad move
        // If difficulty is "Hard", rarely do a bad move

    // COMPUTER PERFORMS A MOVE, DEPENDING ON DIFFICULTY
        // ¡BUT BEFORE MUST CHECK IF A BLOCKING MOVE IS NEEDED!
        // Why? Because if game is "unwinnable" for computer, it wont even try to block, which feels very weird when playing
    let chosenOne = null;
    // If difficulty is "Hard"
    if (!gameStatus.gameOver && shouldBlock(arr, switchPlayer(gameStatus.currentPlayer)) != 0 && rollDice(2) == 1) {
        console.log("Block!")
        // console.log(shouldBlock(arr, switchPlayer(gameStatus.currentPlayer)))
        let blockingMoves = shouldBlock(arr, switchPlayer(gameStatus.currentPlayer));
        chosenOne = randomPick(blockingMoves);
    }
    // if (gameStatus.difficulty == 2) {
    else if (gameStatus.difficulty == 2 && !gameStatus.gameOver) {
        // RARELY DO A BAD MOVE
        let diceRoll = Math.floor(Math.random() * 40) + 1;
        console.log(`computer rolls ${diceRoll} on d40`);
        if (diceRoll == 1) {
            if (badMoves.length >= 1) {
                chosenOne = randomPick(badMoves);
            } else {
                chosenOne = randomPick(filteredMoves);
            }
        } else {
            if (filteredMoves.length >= 1) {
                chosenOne = randomPick(filteredMoves);
            } else {
                chosenOne = randomPick(badMoves);
            }
        }
    // If difficulty is "Medium"
    } else if (gameStatus.difficulty == 1 && !gameStatus.gameOver) {
        // SOMETIMES DO A BAD MOVE
        let diceRoll = Math.floor(Math.random() * 20) + 1;
        console.log(`computer rolls ${diceRoll} on d20`);
        if (diceRoll == 1) {
            if (badMoves.length >= 1) {
                chosenOne = randomPick(badMoves);
            } else {
                chosenOne = randomPick(filteredMoves);
            }
        } else {
            if (filteredMoves.length >= 1) {
                chosenOne = randomPick(filteredMoves);
            } else {
                chosenOne = randomPick(badMoves);
            }
        }
    // If difficulty is "Easy"
    } else if (gameStatus.difficulty == 0 && !gameStatus.gameOver) {
        // MOST TIMES DO A BAD MOVE
        let diceRoll = Math.floor(Math.random() * 4) + 1;
        console.log(`computer rolls ${diceRoll} on d4`);
        if (diceRoll != 1) {
            if (badMoves.length >= 1) {
                chosenOne = randomPick(badMoves);
            } else {
                chosenOne = randomPick(filteredMoves);
            }
        } else {
            if (filteredMoves.length >= 1) {
                chosenOne = randomPick(filteredMoves);
            } else {
                chosenOne = randomPick(badMoves);
            }
        }
    }
    
    // Perform the randomly picked move
    if (!gameStatus.gameOver) {
        let x = chosenOne.move[0];
        let y = chosenOne.move[1];
        boardArray[x][y].click();
    }
}

// SIMPLE ROLL DICE
function rollDice(dice) {
    if (gameStatus.difficulty == 2) {
        return 1;
    } else {
        let rolled = Math.floor(Math.random() * dice) + 1;
        console.log(`block roll: ${rolled}`);
        return rolled;
    }
}

// FROM A LIST OF MOVES, FIND THE VALUE OF THE BEST MOVE
    // Just returns the value itself
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
    document.querySelector(`#move${gameStatus.turn + 1}SFX`).play();
    // document.querySelector("#move1SFX").play();

}


// SOME ELEMENTS SHOW POINTER ON HOVER

document.querySelector("#restartButton").addEventListener("mouseover", function() {
    this.style.cursor = "pointer";
})

choosePlayer.addEventListener("mouseover", function() {
    this.style.cursor = "pointer";
})

chooseDifficulty.addEventListener("mouseover", function() {
    this.style.cursor = "pointer";
})

let allCells = document.querySelectorAll(".cell")
for (let cell of allCells) {
    // console.log(cell)
    cell.addEventListener("mouseover", function() {
        if (gameStatus.gameOver == false) {
            this.style.cursor = "pointer";
        } else {
            this.style.cursor = "not-allowed";
        }
    })
}



