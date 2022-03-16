# Tic Tac Toe game with HTML, CSS and JavaScript.

## Description

This is a simple Tic Tac Toe game written in HTML, CSS and JaveScript, that lets you play against the computer in different difficulty levels.

This game runs on the web browser (tested in Chrome and Firefox) from an index.html file that is linked with CSS and JavaScript files. It has a minimal and (hopefully) pleasant layout with a 3x3 game board and a control panel with some options for the player. The layout is responsive, it shrinks for smaller screens and even changes the layout for mobile devices (tested only with chrome's developer tools).

When playing, each move makes a sound with a higher pitch for every turn. When the game finishes, the sound we hear depends on whether the human wins, loses, or if it's a tied game.

For this project I've used a lot of the concepts and strategies learned in the CS50 course. Algorithms, Recursion, Abstraction, Conditionals, Loops, Arrays, Scope, Debugging. Once I got the code to work, I've tried to clean it as much as I could to reduce innecesary redundancy, to make it more legible, more self explanatory if possible. I was unsure whether to use Pyhton or JavaScript because both languages are super interesting and enjoyable to work with. I went with JavaScript because I believe it's amazing how powerfull it can be in combination with HTML and CSS, and also because I wanted to learn much more of CSS and JavaScript. I've been eating and breathing JavaScript for a couple weeks. I also had to learn much more CSS, specially because I didn't want to use a framework like Bootstrap for this.

## Features
- Play against the computer
- Displays the current status of the game with nice fonts and colors
- The user can choose to play as "X" or "O"
- The user can choose between 3 difficulty levels: easy, medium (default) and hard
- A score keeper keeps track of every player's wins
- A reset button restart's the match
- The layout is responsive
- Each move makes a different sound
- Ending the game makes a sound, which is different depending on the result (win, lose, tie)

## The computer's AI
The computer's AI uses the Minimax Algorithm (as seen on Brian Yu's CS50 Seminar) to decide it's next move. The AI was the hardest part to code because it needs to recursively simulate all possible moves, get the score for each one, and finally decide which one to perform, based on the Algorithm.

There are only 3 possible scores for every board:
   - -1 if "O" wins
   - +1 if "X" wins
   - 0 (zero) if it's a tie.

This is important because it's part of the reason for a very interesting bug that was happening.

## THE BUG !!

Whenever the computer evaluates all possible moves as having the same score, it just chooses one randomly. This causes a weird behaviour at some instances, because sometimes the computer could block the player from achieving a row, but still can't prevent the player from winning the game a few moves later, so it "doesn't care" and just makes a random move.

In the following boards it seems obvius that "O" should block "X" from doing a row, but it would perform just a random move.
```
[X][ ][ ]
[ ][ ][ ]
[O][ ][X]

[X][X][O]
[O][X][ ]
[ ][ ][ ]
```
This behaviour is not "incorrect" from the computer's perspective because it's assumed that the opponent will not make any mistake in the following turns, so doing a random move wouldn't impact on the result. But it "feels" very weird from the human's perspective, like an error in the program. What's more, the human is very much capable of making a mistake and end up not winning that game.

## FIX
Before the step in which the computer chooses a move based on the scores, I've placed a conditional that will check two conditions:
   a) Are there any possible blocking moves to be made?
   b) Do all the possible moves have a non-favorable (worst possible) score? (i.e. computer "believes" it's already lost the game)

If and only if both of this conditions are met, the AI will override the score evaluation and just perform the blocking move. It's important that this happens only when the computer "believes" the game is lost, so this won't alter the computer's chance to make bad moves (as per the difficulty setting).

## Files and folders:
- index.html
- functions.js
- app.js
- styles.css
- assets/

## index.html
Contains a simple structure divided in two sections.

The first section contains 9 divs that will represent the game board. This section will be styled with CSS to look like a 3x3 board. The divs will be selected with JavaScript to get the functionality to click a play the game.

The second section contains a "control panel" with:
   - Main header
   - Status display
   - Player selection dropdown menu
   - Difficulty dropdown menu
   - Score keeper
   - Restart game button

## functions.js
Contains most of the functions needed by app.js to run the core part of the logic. All this functions were originally inside app.js, but at some point it got quite messy and difficult to navigate. There are a lot of little functions that do some small specific task, created to clean the code here and there, to improve readability, to reduce redundancy, etc. The definitions for this functions were like noise in the main part of the code, in app.js. I'm a big fan of the concept of abstractions introduced very early in the CS50 course, so I got those functions out of sight and out of mind.

## app.js
This file contains the core part of the logic.

### Object literals with game status information
- At the top of the file are two object literals with globally accessible variables that are used by many functions and processes of the program, like turn, current player, computer symbol, difficulty setting, winner, game over status, etc.

### Event Listener for the game board
- The 9 divs from the game board are linked to a tridimentional 3x3 array (defined as boardArray), so we can easly access and manipulate them.
- The cells (stored in boardArray) have a click event listener that trigger all the actions necesary to generate a move, whenever the human clicks an empty cell on the board. This event listener also performs a computer move after the human move is finished (some miliseconds later).

### Selectors for the menus, buttons and status display
- There are selectors for the status display, the dropdown menu for choosing player, the dropdown menu for choosing difficulty, the score keeper and a reset button. Most of these elements also have event listeners so trigger some actions when the user clicks and canges things.

### Selectors for some elements that show a pointer on hover
- Some elements show a pointer on hover: the board cells, the dropdown menus and the reset button. Also, the board cells will show a "not allowed" cursos when the game is over.

### ``simulateScore()``
- This function recursively simulates all possible moves available in the board (empty cells) to find out the score of each one. It works even if the board is completely empty.
- It's a meant to be called inside the ``computerMove()`` function below, needed to get the scores to apply the Minimax Algorithm. The score that this functions WANTS to return dependes on the player that is passed as an argument.
- The function cuts some corners whith some conditionals so it wont need to do innecesary simulations (at least not excessively). For instance, if the board is empty, it will just return a score of 0 without doing any simulations. This avoids thousands of simulations that would always return the exact same result.

### ``computerMove()``
- This functions, in combinations with ``simulateScore()``, configure the core of the logic in this program. It's task is to check all the possible moves available on the board, get the score for all of them calling ``simulateScore()``, and then decide which move to make, based on the Minimax Algorithm.
- There are some conditionals that will override the Minimax Algorithm. For instance, if there's a winning move available, the computer will always perform that move, even in the "easy" difficulty level.
- To adjust the computer behaviour according to difficulty, this function creates a list of "good moves" and "bad moves" (easily achieved once we have the scores for all the possible moves). The lower the difficulty, the higher the chance of performing a "bad move".
- The BUG FIX described above (line 54) is right here. If the conditions are met (blocking move is needed, game is already "lost"), the computer will override the Minimax Algorithm and will perform the blocking move.

## styles.css
In my experience, CSS is easy to understand but very challenging to actually use. I'm not a graphic designer, but at least I wanted a clean look with a nice and balanced distribution. This aspect of the program took me much muuuch longer than I expected.
- Uses grid to give the game board it's form, colors, size, etc.
- Uses flexbox to nicely distribute all the elements in the screen.
- Defines font families and font sizes.
- Class selectors to change styles of the status display.
- Uses media queries to make the layout responsive. It should look ok in mobile devices.

## assets/ folder
This folder contains the mp3 files for the sound effects. The sound effects were created using Chrome Music Lab - Song Maker.

# Version History

## VERSION 3.0 (13-March-2022)

### Changes:

- Object literal added to define difficulty in a more readeable way.

- The majority of the functions are now in a separate funcions.js file

- Function ``playSound()`` improved so it doesn't need arguments, it automatically knows which sound should be played.

- Fixed an "infinite loop" at ``computerMove()``
   - Problem: There was an infinite loop between `computerMove()` and `boardArray[x][y].click()`
   - Old solution: A lot of conditionals to prevent the infinite loop from happening. It was super messy but worked.
   - New solution: New function `computerClick(x, y)` is used specifically inside `computerMove()`, which is much simpler because it doen't need so many conditionals
   - This allowed me to really clean a lot of the clutter that was inside the `eventListener()` for the click of the board cells. Now it's much cleaner and readable

- Function `shouldBlock()` improved so it doesn't need arguments. Much claner when calling. Instead of `shouldBlock(strArr(boardArray), switchPlayer(gameStatus.currentPlayer)` we just call `shouldBlock()`

- Status Display is now updated in it's own function `updateStatusDisplay()` instead of updating every single thing by hand every time. Just call this functions and it knows what to do. Updates player's turn, updates endgame status, but doesn't work for updating the display when restarting the game. That's still done manually inside the `restartGame()` function.

- **THE BUG IS FIXED!!** Much improved process for blocking moves (check line 34 above). The only issue I have with the current solution is that the conditional I'm using is very long and redundant (LINES 284 TO 291 at app.js)

- BUG FIX: Human can't do a move during the mocked "loading time". This was fixed simply by turning off the clickability of the cells at the beginning of the `restartGame()` function, and then turning it back on at the end of the function

### Known issues (v3.0)
- Still lacks an animation or visual cue to highlight the 3 in a row, when it happens
- Still lacks a button to toggle on/off the sound


##  VERSION 2.0 (02-March-2022)

### Changes

- Brief delay before the computer makes it's move (using setTimeout), so if feels a bit more natural. This caused a bug where the human could quickly click another cell when it was not it's turn, forcing the computer's move. This was fixed by "turning off" the clickability of the cells during this brief delay. This was achieved with a global variable defined as ``gameStatus.canCLick`` that is set to ``true`` by default and can be changed when needed.

- Allows user to select player ("X" or "O") with a simple dropdown menu that changes a global variable defined as ``gameStatus.computer`` (set to "O" by default). This variable will affect the behaviour of the ``computerMove()`` function and the avent listener in the cells, among some other processes.

- When there are more than one possible "good" moves, the computer won't always make the very same move (it did before). This was achieved by creating a list of good moves (i.e. all of them have the same score), then picking one of those randomly.

- Score keeper keeps the wins for each player. This was achived with two global variables that keep track of the wins for each player, which updates evety time the game finishes with either player winning the game.

- User can select difficulty. The difficulty is selected with a dropdown menu that changes a global variable defined as ``gameStatus.difficulty`` that can have the values ``0`` for "easy", ``1`` for "medium" or ``2`` for "hard". Inside ``computerMove()`` we create a list of "bad moves". The lower the difficulty, the higher the chance for the computer to perform a "bad move" (i.e. will pick a move from the "bad moves" list instead of the "good moves" list).

- **THE BUG** (check line 34 of this document) was somewhat adressed by puting a conditional before the Minimax Algorithm, so the computer will have a high chance of making a blocking move when it's necessary. The problem with this solution is that it alters the chance of the computer making a "bad move", messing with the difficulty levels.

- Minor BUG FIX: The layout changed when the game finished. This was addressed by hard coding some fixed sizes on some of the divs.

### Known issues (v2.0):
- "Easy" and "Hard" work ok, but "Medium" should be a little easier

- Some animation is needed when 3 in a row is achieved

- Needs a button to toggle on/off the sound

- Loading time is mocked with setTimeout's... the human can cheat and play when the game is "loading"

## VERSION 1.0 (08-February-2022)
The layout was very simple and kinda ugly, the user wasn't able to choose "X" or "O" (always played as "X"), couldn't choose difficulty or even restart the game without reloading the page. There was no score keeper. The status display was already working. The layout was not responsive.

The most important aspect of this version is that it already had the computer's AI working correctly, so it was impossible to win the game against the computer.

I began to work on this project just before moving from Arequipa to Lima, about a month ago, but had to take a long 3 week break to make arrangements for the trip. Luckly at least I got the AI to work before packing my computer!