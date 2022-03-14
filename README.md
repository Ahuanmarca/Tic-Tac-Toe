# 2022_TicTacToe
Tic Tac Toe game with HTML, CSS and JavaScript.

Program created from scratch for my application to The Recurse Center.


VERSION 3.0 (13-March-2022)

Cambios y mejoras de esta versión:

- Object literal para definir dificultad. Más fácil de leer y usar.

- Archivo separado functions.js para la mayoría de las funciones, para limpiar app.js

- Función playSound() mejorada. Ahora sólo es necesario llamarla en el momento adecuado, y automáticamente decide qué sonido debe reproducir.

- Corregido un "loop infinito" en computerMove()
   - Problema: Se hacía un loop infinito entre computerMove() y boardArray[x][y].click()
   - Solución antigua: Un montón de condicionales para evitar que se genere el loop infinito. Funcionaba pero ensuciaba tanto el código que ni entendía para qué era cada condicional.
   - Solución nueva: Nueva función computerClick(x, y) para que sea utilizada específicamente dentro de computerMove(), mucho más simnple
   - Esto me permitió limpiar un montón de condicionales en el eventListener() cuando se hace click en las celdas, ahora es mucho más legible

- Función shouldBlock() mejorada. Ya no necesita argumentos, usa las variables globales.
   - Antes: shouldBlock(strArr(boardArray), switchPlayer(gameStatus.currentPlayer)
   - Ahora: shouldBlock()

- Status Display se actualiza en función updateStatusDisplay(), en vez de actualizar cosita por cosita cada vez que se tiene que hacer (todas las cositas pasaron al interior de la función), lo cual limpia bastante el código en los momentos que se debe actualizar el display.
   - Se llama sin argumentos, automáticamente decide qué debe hacer
   - Actualiza según jugador actual
   - Actualiza al final según ganador o empate
   - NO SIRVE PARA ACTUALIZAR EL DISPLAY CUANDO SE REINICIA EL JUEGO

- BUG FIX: (THE BUG!!) MEJOR PROCESO PARA BLOCKING MOVES
   - Computadora "se picaba" (ver THE BUG más abajo).
   Nueva solución:
   - Ahora el blocking move únicamente ocurre (toma prioridad sobre los scores, sobre el Minimax) cuando la computadora evalúa que no tiene posibilidades de evitar la derrota. Únicamente interviene en esas circunstancias, de modo que no altera la dificultad, no altera el comportamiento de la computadora, no previene que haga BAD MOVES cuando debería hacerlo según la dificultad.
   - El único problema es que me ha quedado un condicional bien largo para "atrapar" esta circunstancia, de hecho se puede refactorizar (LINES 284 TO 291)

- BUG FIX: Humano ya no puede hacer jugada mientras ocurre el "loading time". Simplemente tenía que poner gameStatus.canClick = false al inicio de la función, y devolverlo a true al final.


Problemas que persisten / otras mejoras que quisiera hacer:

- Falta alguna animación que aparezca sobre el tablero cuando ocurre 3 en raya, aunque sea que parpadeen los símbolos

- Falta algún error checking en la carga de los archivos mp3. Si por algún motivo están ausentes, la consola se repleta de mensajes de error horribles (pero igual se puede jugar). Preferiría que aparezca un único mensaje discreto.

- Reescribir líneas 284 a 291 de app.js, están muy redundantes



VERSION 2.0 (02-March-2022)

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
- The responsive layout it's ok in big screens, but doesn't look very good on mobile devices
- Loading time is mocked with setTimeout's... the human can chat and play when the game is "loading"

Computer AI:
- Uses the Minimax Algorithm to choose what move to make (as seen on Bryan Yu's lecture on AI)
- Boards evaluate to 3 possible scores. X wins == +1, = wins == -1, Tie == 0
- Makes a list of good moves and chooses one randomly, so it won't always make the same move
- Also creates a list of bad moves. Depending on the difficulty, will do a bad move with less or more frequency

   !__!
  (@)(-)
 \.'||'./
-:  ::  :-
/'..''..'\

THE BUG !!
La computadora "se pica" cuando es "imposible" (i.e. según las simulaciones todas las jugadas
evalúan al mismo score) alterar el resultado (i.e. evitar perder).

Por ejemplo en estos tableros (turno de "O"), en vez de bloquear a "X", hace cualquier jugada
random. Como todas las jugadas evalúan el mismo score (+1), no puede distinguir cuál es
"mejor" o "peor". Esto se "siente" rarazo, como que fuera un error estúpido del A.I.

EJEMPLO A       EJEMPLO B   

[X][ ][ ]       [X][X][O]   
[ ][ ][ ]       [O][X][ ]   
[O][ ][X]       [ ][ ][ ]   

FIX (Sort of)
Antes de usar los scores para decidir la jugada, chequear si se necesita bloquear al oponente,
con un alto chance de realizar esa jugada (ya no chequea scores más abajo, bloquea y chau).
Lo malo es que esto altera mucho la dificultad porque a veces bloquea cuando debería equivocarse.
