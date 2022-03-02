# 2022_TicTacToe
Tic Tac Toe game with HTML, CSS and JavaScript.

My first ever program written from scratch. Tic Tac Toe game with HTML, CSS and JavaScript.

Features:
- User can select symbol (X or O)
- Can select difficulty (3 levels)
- A score keeper keeps track of wins
- Status display shows current player / winner of match
- Reset button restart's the match
- The layout is responsive

Problems:
- "Easy" and "Hard" work ok, but "Medium" should be a little easier
- Some animation is needed when 3 in a row is achieved
- Needs a button to toggle on/off the sound
- The responsibe layout it's ok in big screens, but doen't look very good on mobile devices

Computer AI:
- Uses the Minimax Algorithm to choose what move to make (as seen on Bryan Yu's lecture on AI)
- Makes a list of good moves and chooses one randomly, so it won't always make the same move
- Also creates a list of bad moves. Depending on the difficulty, will do a bad move with less or more frequency

In this program there are only 3 possible scores for the boards.
  - If X wins, the score is 1
  - If O wins, the score is -1
  - If it's a tie, the score is 0

With these options the AI can only distinguish between favorable, neutral and unfavorable moves.
Cannot distinguish between "more unfavorable" and "less unfavorable".
A "less unfavorable" options happens when defeat cannot be avoided, but at least can be delayed.

KNOWN ISSUE:
When all the moves will ultimately render the same result (i.e. it's already impossible to guarantee not loosing the match),
the AI cannot distinguish which of the available moves is "better". For instance, it could block the player from winning the match
the next turn, even tough the player will winn the next-next turn anyway... In this circumstances, with just the Minimax Algorithm,
the AI just sorta "gives up" and makes it's next move at random. This feels very weird, it should al least delay defeat.

WORKAROUND:
If there's the need to block the opponent, there's a chance the AI will override the Minimax Algorithm and just do the blocking move.
The problem is that this makes "Medium" a little too hard (at least IMO).
I don't want to fix this by decreassing the chance of the computer making the blocking move (because it just feels weird sometimes),
so I could fis it by increasing the chance of AI making a bad move. NEEDS TESTING!

