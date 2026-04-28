// Crea la instancia principal del juego Phaser.
// Utiliza las variables globales 'gameWidth' y 'gameHeight' definidas en game.js.
// Phaser.AUTO permite que el motor decida si usar WebGL o Canvas normal.
// 'game' le indica que debe meter el juego dentro del <div id="game"> del HTML.
let game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, 'game');

window.onload = startGame;

// Añadimos un Estado (State) al juego llamado 'Game'.
// 'gameState' es un objeto definido en game.js que contiene las funciones create y update.
function startGame(){
    game.state.add('init', initState);
    game.state.add('niveles', nivelesState);
    game.state.add('play', gameState);
    game.state.add('hof',hofState);

    // Arrancamos el estado 'init', lo que disparará la función resetGame() (definida en gameState.create).
    game.state.start('init');
}


