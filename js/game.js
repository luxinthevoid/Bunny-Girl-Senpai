// --- Config ---
// Estas constantes definen las reglas físicas y lógicas del juego.
const BLOCKSIZE = 28;               // Tamaño en píxeles de cada cuadradito que forma una pieza.
const NUMBLOCKS_X = 10;             // Número de columnas (ancho clásico de Tetris).
const NUMBLOCKS_Y = 20;             // Número de filas (alto clásico de Tetris).
const MOVEMENT_LAG = 85;            // Retraso en milisegundos para evitar que la pieza se mueva a la velocidad de la luz si dejas pulsada una tecla.
const INITIAL_FALL_DELAY = 600;     // Tiempo en ms que tarda la pieza en caer una fila automáticamente por gravedad.

// 7 tetrominoes, rotation around a center cell
const BLOCKS_PER_TETROMINO = 4;     // Cada pieza (tetrimino) está formada exactamente por 4 bloques.
const N_BLOCK_TYPES = 7;            // Existen 7 formas clásicas (I, J, L, O, S, T, Z).

// Color de las piezas:
const PIECE_COLORS = [
 0xfef4d7,
 0xfae1ca,
 0xf6cdbc,
 0xf2baaf,
 0xeda7a2,
 0xe99394,
 0xe58087];

// Scene grid values
// Se usan para definir el estado lógico de cada celda de la cuadrícula.
const EMPTY = 0;                    // La celda está vacía.
const FALLING = 1;                  // La celda está ocupada temporalmente por la pieza que el jugador controla.
const OCCUPIED = 2;                 // La celda tiene un bloque fijo (chocó y se quedó ahí).

/**
 * Clase que gestiona el Tablero (La cuadrícula lógica y visual)
 */
class Tetris {
  constructor() {
    this.scene = [];        // Matriz 2D de números (EMPTY, FALLING, OCCUPIED) para lógica pura.
    this.sceneBlocks = [];  // Matriz 2D que guardará los objetos gráficos (dibujos) de Phaser de los bloques ya fijados.
  }

  // Inicializa la matriz lógica del tablero y la matriz de referencias a bloques ya fijados.
  // Se llama al empezar una partida para crear una matriz de 10x20 llena de ceros (EMPTY) y nulls.
  initGrid() {
    for (let x = 0; x < NUMBLOCKS_X; x++) {
      let col = [];
      let colBlocks = [];
      for (let y = 0; y < NUMBLOCKS_Y; y++) {
        col.push(EMPTY);
        colBlocks.push(null);
      }
      this.scene.push(col);
      this.sceneBlocks.push(colBlocks);
    }
  }

  // Comprueba si una celda (x, y) está dentro del tablero y no está ocupada por bloques ya fijados.
  // Es vital para saber si se puede crear o mover una pieza ahí.
  validateCoordinates(x, y) {
    if (x < 0 || x >= NUMBLOCKS_X) return false; // Choque pared izquierda/derecha
    if (y < 0 || y >= NUMBLOCKS_Y) return false; // Choque con el suelo
    if (this.scene[x][y] === OCCUPIED) return false; // Choque con otra pieza fijada
    return true; // La coordenada es válida y está libre
  }
};

/**
 * Clase que representa la pieza actual que cae
 */
class Tetromino {
  // Se crea pasándole su forma (0 a 6), su color, y el objeto tablero (tetris)
  constructor(shape, color, tetris) {
    this.shape = shape;
    this.color = color;
    this.tetris = tetris;       // Referencia al tablero para poder validar colisiones.
    this.center = [0, 0];       // Coordenada x,y (lógica) central sobre la que rota la pieza.
    this.blocks = [];           // Array con los 4 objetos visuales (Graphics de Phaser).
    this.cells = [];            // Array con las 4 coordenadas lógicas [x,y] de los bloques.
    
    // Matriz clave: Define la "forma" de las piezas mediante coordenadas relativas al centro [0,0].
    this.offsets = {
      0 : [[0,-1],[0,0],[0,1],[1,1]],     // L
      1 : [[0,-1],[0,0],[0,1],[-1,1]],    // J
      2 : [[0,0],[0,1],[0,2],[0,3]],     // I (Palo)
      3 : [[-1,-1],[0,-1],[0,0],[-1,0]],  // O (Cuadrado)
      4 : [[-1,0],[0,0],[0,-1],[1,-1]],   // S
      5 : [[-1,0],[0,0],[1,0],[0,1]],     // T
      6 : [[-1,-1],[0,-1],[0,0],[1,0]]    // Z
    }
  }

  // Dibuja un cuadradito individual mediante Graphics de Phaser.
  // Retorna un objeto gráfico que se guardará en this.blocks.
  renderBlock() {
    let g = game.add.graphics(0,0);
    g.beginFill(this.color, 1);
    let m = 1; // Margen para que las piezas no parezcan un bloque sólido uniforme.
    g.drawRect(m, m, BLOCKSIZE - 2*m, BLOCKSIZE - 2*m);
    g.endFill();
    return g;
  }

  // Función que instancia la pieza en el tablero (arriba). Retorna 'true' si colisiona al nacer (Game Over).
  create(c_x, c_y) {
    this.center = [c_x, c_y]; // Establece el pivote.

    let conflict = false;
    for (let i = 0; i < BLOCKS_PER_TETROMINO; i++) {
      // Calcula la posición real sumando el centro más el offset de su forma.
      let x = c_x + this.offsets[this.shape][i][0];
      let y = c_y + this.offsets[this.shape][i][1];

      let b = this.renderBlock(); // Crea el dibujo.
      // Lo posiciona en pantalla multiplicando por el tamaño en píxeles.
      b.x = x * BLOCKSIZE;
      b.y = y * BLOCKSIZE;

      this.blocks.push(b); // Lo guarda visualmente.
      this.cells.push([x,y]); // Lo guarda lógicamente.

      // Si el punto calculado no es válido, levanta bandera de conflicto.
      if (!this.tetris.validateCoordinates(x,y)) {
        conflict = true;
      } else {
        // Marca la lógica del tablero indicando que hay algo cayendo ahí.
        this.tetris.scene[x][y] = FALLING;
      }
    }
    return conflict;
  }

  // Comprueba virtualmente si la pieza PUEDE ejecutar el movimiento 'dir' usando la función 'coordFn'.
  // Se usa antes de mover de verdad, para asegurar que no chocará.
  canMove(coordFn, dir) {
    if (gameOverState) return false;
    for(let i = 0; i < this.cells.length; i++) {
      let nc = coordFn(i, dir); // Calcula la futura coordenada (New Coord)
      if (!this.tetris.validateCoordinates(nc[0], nc[1])) return false;
    }
    return true; // Si los 4 bloques pueden moverse a su nueva posición, se permite el movimiento.
  }

  // Retorna el array [nuevaX, nuevaY] si un bloque se desliza en una dirección (izq, der, abajo).
  slide(block, dir) {
    return [this.cells[block][0] + move_offsets[dir][0],
            this.cells[block][1] + move_offsets[dir][1]];
  }

  // Retorna el array [nuevaX, nuevaY] de un bloque si la pieza rota 90 grados alrededor del pivote.
  rotate(block, dir) {
    let c_x = this.center[0];
    let c_y = this.center[1];

    let ox = this.cells[block][0] - c_x; // Posición relativa al centro en X
    let oy = this.cells[block][1] - c_y; // Posición relativa al centro en Y

    oy = -oy; // Ajuste por el sistema de coordenadas invertido de las pantallas (Y crece hacia abajo).

    // Algoritmo matemático estándar de rotación de matrices 2D 90 grados.
    let nx = (dir === 'clockwise') ? oy : -oy;
    let ny = (dir === 'clockwise') ? -ox : ox;

    ny = -ny;

    return [c_x + nx, c_y + ny]; // Devuelve la coordenada global sumándole de nuevo el centro.
  }

  // Ejecuta físicamente y lógicamente el movimiento/rotación, borrando el rastro viejo y pintando el nuevo.
  move(coordFn, centerFn, dir) {
    for (let i = 0; i < this.cells.length; i++) {
      let ox = this.cells[i][0]; // Old X
      let oy = this.cells[i][1]; // Old Y
      let nc = coordFn(i, dir);  // Calcula la nueva posición usando slide o rotate
      let nx = nc[0];
      let ny = nc[1];

      this.cells[i][0] = nx; // Actualiza lógica
      this.cells[i][1] = ny;
      this.blocks[i].x = nx * BLOCKSIZE; // Actualiza dibujo
      this.blocks[i].y = ny * BLOCKSIZE;

      this.tetris.scene[ox][oy] = EMPTY; // Libera la celda vieja
      this.tetris.scene[nx][ny] = FALLING; // Ocupa la nueva
    }
    // Si se pasó una función para actualizar el centro (en slide sí cambia, en rotación no), se actualiza.
    if (centerFn) {
      let nc = centerFn(dir);
      this.center = [nc[0], nc[1]];
    }
  }

  // Retorna el array con la nueva posición del centro tras deslizar la pieza.
  slideCenter(dir) {
    return [this.center[0] + move_offsets[dir][0],
            this.center[1] + move_offsets[dir][1]];
  }
};

/* --- VARIABLES Y ESTADOS GLOBALES DE PHASER --- */

// Define el estado principal. Phaser llamará a create al inicio y update en bucle a 60fps.
let gameState = {
  create: resetGame,
  init: tamanyoCanvasJuego,
  update: updateGame
};

let bg; // Guardará el fondo gráfico (rejilla)

// Se calculan las dimensiones exactas del lienzo multiplicando bloques por su tamaño.
let gameWidth  = NUMBLOCKS_X * BLOCKSIZE;
let gameHeight = NUMBLOCKS_Y * BLOCKSIZE;

// Diccionario para saber en qué fila "Y" debe aparecer cada pieza. Algunas necesitan empezar en 1 o en 0.
let y_start = { 0:1, 1:1, 2:0, 3:1, 4:1, 5:0, 6:1 };

// Diccionario de direcciones que convierte palabras en vectores (movimiento en x, movimiento en y).
let move_offsets = {
  left:  [-1,0],
  down:  [0,1],
  right: [1,0]
};

// Elements for the game
let tetromino, theTetris; // Pieza actual y tablero
let cursors, keyRotate, keyRestart, keyHof, keyPausa; // Entradas de teclado
let gameOverState = false; // Bandera booleana de estado de fin de partida
let gameWinState = false;

let timer, loop; // Temporizador nativo de Phaser y el bucle para la gravedad.
let currentMovementTimer = 0; // Acumulador para restringir la velocidad de input lateral
let shade, centerText; // Elementos gráficos de la pantalla Game Over

let hudJuego = document.getElementById('HUD');
let puntos = document.getElementById('intPuntos');
let nivelActual = document.getElementById('intNivel');
let tiempo = document.getElementById('segundos');
let txtMinutos = document.getElementById('minutos');

let pausado = false; //bool para la pausado
let nivelSeleccionado, objetivoPuntos;
let puntosActual = 0;
let tiempoActual = 0;
let minutos = 0;
let loopReloj;

let previewShape;
let previewGraphics = [];

function tamanyoCanvasJuego(nivelsel){
  this.game.scale.setGameSize(gameWidth+130,gameHeight);
  nivelSeleccionado = nivelsel;
};

// Reinicia estado, tablero, HUD, input y temporizador para empezar una partida limpia.
function resetGame() {
  game.world.removeAll(); // Borra todos los gráficos en pantalla

  gameOverState = false;
  gameWinState = false;
  currentMovementTimer = 0;

  // Creamos el tablero lógico
  theTetris = new Tetris();
  theTetris.initGrid();

  // Se dibuja el fondo (un gris muy oscuro) y la cuadrícula (rejilla)
  bg = game.add.graphics(0,0);
  bg.beginFill(0x0E0E0E, 1);
  bg.drawRect(0,0,gameWidth,gameHeight);
  bg.endFill();
  bg.lineStyle(1, 0x1B1B1B, 1);
  // Dibuja líneas verticales
  for (let x = 0; x < NUMBLOCKS_X; x++) {
    bg.moveTo(x*BLOCKSIZE, 0);
    bg.lineTo(x*BLOCKSIZE, gameHeight);
  };
  // Dibuja líneas horizontales
  for (let y = 0; y < NUMBLOCKS_Y; y++) {
    bg.moveTo(0, y*BLOCKSIZE);
    bg.lineTo(gameWidth, y*BLOCKSIZE);
  };

  // Se configuran las teclas de flechas (cursors) y teclas específicas (UP para rotar, R para reiniciar)
  cursors = game.input.keyboard.createCursorKeys();
  keyRotate = game.input.keyboard.addKey(Phaser.Keyboard.UP);
  keyRestart = game.input.keyboard.addKey(Phaser.Keyboard.R);
  keyHof = game.input.keyboard.addKey(Phaser.Keyboard.Q)
  keyPausa = game.input.keyboard.addKey(Phaser.Keyboard.ESC);

  // Se configura el temporizador de gravedad.
  timer = game.time.events;
  timer.removeAll(); // Limpia timers viejos
  timer.resume(); // Importante: despausa el timer si veníamos de un Game Over.
  // Crea un evento repetitivo que llamará a fall() cada INITIAL_FALL_DELAY ms.
  loop = timer.loop(INITIAL_FALL_DELAY, fall, this);

  //Codigo para reloj de partida
  tiempoActual = 0;
  loopReloj = timer.loop(1000, actualizarReloj, this);

  //mostrar el HUD
  hudJuego.style.display = 'block';
  nivelActual.innerText = nivelSeleccionado;
  puntos.innerText = 0;
  tiempo.innerText = '00';

  calcularObjetivo();

  previewShape = Math.floor(Math.random()* N_BLOCK_TYPES);
  spawn(); // Nace la primera pieza
};

function actualizarReloj(){
  if(gameOverState) return;
  tiempoActual++;
  console.log(minutos);
  if(tiempoActual==60){
    tiempoActual=0;
    minutos++;
  }

  if(minutos<10)
      txtMinutos.innerText = '0'+ minutos;
  else txtMinutos.innerText = minutos;

  if(tiempoActual<10){
    tiempo.innerText = '0'+tiempoActual;
  }else
    tiempo.innerText = tiempoActual;
}

// Tick de caída automática (llamada por el timer). Intenta bajar la pieza.
function fall() {
  if (gameOverState) return; // No hace nada si estás muerto

  // Pregunta: ¿Puedo moverme hacia abajo?
  if (tetromino.canMove(tetromino.slide.bind(tetromino),'down')) {
    // Si puedo, muevo la pieza.
    tetromino.move(tetromino.slide.bind(tetromino), tetromino.slideCenter.bind(tetromino), 'down');
  }
  else {
    // Si no puedo, he tocado suelo o pieza. La congelo.
    lockTetromino();
  }
};

// Crea una nueva pieza aleatoria en la parte superior del tablero.
function spawn() {
  let shape = previewShape;
  let color = PIECE_COLORS[shape];

  tetromino = new Tetromino(shape, color, theTetris);

  let start_x = Math.floor(NUMBLOCKS_X/2); // Columna central
  let start_y = y_start[tetromino.shape]; // Fila de inicio predefinida

  let conflict = tetromino.create(start_x, start_y);
  // Si al nacer ya está en conflicto (chocando con otra), Game Over.
  if (conflict) setGameOver(true);

  previewShape = Math.floor(Math.random()* N_BLOCK_TYPES);
  dibujarPreview();
};

function dibujarPreview(){
  for(let i = 0; i < previewGraphics.length; i++){
    previewGraphics[i].destroy();
  }
  previewGraphics = [];

  let baseX = gameWidth+55;
  let baseY = 100;
  if(previewShape==2)
    baseY = 50;

  let dummy = new Tetromino(previewShape, PIECE_COLORS[previewShape], null);
  
  let offsets = dummy.offsets[previewShape];

  for(let i = 0; i< BLOCKS_PER_TETROMINO; i++){
    let xPos = baseX + (offsets[i][0]*BLOCKSIZE);
    let yPos = baseY + (offsets[i][1]*BLOCKSIZE);

    let g = dummy.renderBlock();

    g.x = xPos;
    g.y = yPos;

    previewGraphics.push(g);
  }
}

// Activa/Desactiva el estado de fin de partida y crea la pantalla opaca con texto.
function setGameOver(on){
  gameOverState = on;
  if (gameOverState) {
    timer.pause(); // Para que dejen de caer piezas.
    makeShade(0.65); // Dibuja la sombra negra semitransparente.

    //apagamos el HUD del juego
    hudJuego.style.display = 'none';

    // Añade el texto centrado indicando que pulsando R reinicias.
    centerText = game.add.text(game.world.centerX, game.world.centerY,
      'GAME OVER\n\nPress R to restart,\nQ to go to\nHall of Fame', {
        font: 'bold 32px system-ui, -apple-system, Segoe UI, Roboto, Arial',
        fill: '#ffffff',
        align: 'center'
      }
    );
    centerText.anchor.set(0.5); // Centra el eje del texto
  }
};

// Copia de setGameOver para cuando ganas
function setGameWin(on){
  gameWinState = on;
  if (gameWinState) {
    timer.pause(); // Para que dejen de caer piezas.
    makeShade(0.65); // Dibuja la sombra negra semitransparente.

    //apagamos el HUD del juego
    hudJuego.style.display = 'none';

    // Añade el texto centrado indicando que pulsando R reinicias.
    centerText = game.add.text(game.world.centerX, game.world.centerY,
      'WINNER\n\nPoints: '+puntosActual+',\nQ to go to\nHall of Fame', {
        font: 'bold 32px system-ui, -apple-system, Segoe UI, Roboto, Arial',
        fill: '#ffffff',
        align: 'center'
      }
    );
    centerText.anchor.set(0.5); // Centra el eje del texto
  }
};

function makeShade(alpha) {

  // crear SOLO una vez
  if (!shade) {
    shade = game.add.graphics(0, 0);
    shade.beginFill(0xC4B7E7, 1);
    shade.drawRect(0, 0, gameWidth+130, gameHeight);
    shade.endFill();
  }

  // solo cambias visibilidad/opacidad
  shade.alpha = alpha;
}


function updateGame() {

  if(puntosActual == objetivoPuntos){
    setGameWin(true);
  }

  //Control de la pausa
  if(keyPausa.justDown){
    if(pausado){
      pausado=false;
      centerText.visible = false;
      makeShade(0);
      timer.resume();
    } else{
      pausado=true;
      makeShade(0.65);
      timer.pause();
    }
  }

  if(!gameOverState)
    if(pausado){
      if (!centerText) {
        centerText = game.add.text(game.world.centerX, game.world.centerY, 'PAUSE', {
          font: 'ari-w9500-bold',
          fontSize: '32px',
          fill: '#ffffff',
          align: 'center'
        });
        centerText.anchor.set(0.5);
      }
      centerText.visible = true;
      return;
    }

  // Bucle ejecutado a 60 FPS por Phaser. Controla el teclado.

  currentMovementTimer += this.time.elapsed; // Suma el tiempo entre frames
  // Si no ha pasado el lag mínimo (85ms), aborta lectura de teclas para no ir demasiado rápido
  if (currentMovementTimer <= MOVEMENT_LAG) return;

  if (gameOverState) {
    // Si estás muerto, solo escucha la tecla R para reiniciar.
    if (keyRestart.isDown)
      resetGame();

    if (keyHof.isDown)
      game.state.start('hof');

    currentMovementTimer = 0;
    return;
  };

  // Comprueba flechas: Si pulsas y se puede mover, mueve.
  if (cursors.left.isDown && tetromino.canMove(tetromino.slide.bind(tetromino), 'left')) {
    tetromino.move(tetromino.slide.bind(tetromino), tetromino.slideCenter.bind(tetromino), 'left');
  } else if (cursors.right.isDown && tetromino.canMove(tetromino.slide.bind(tetromino), 'right')) {
    tetromino.move(tetromino.slide.bind(tetromino), tetromino.slideCenter.bind(tetromino), 'right');
  } else if (cursors.down.isDown && tetromino.canMove(tetromino.slide.bind(tetromino), 'down')) {
    tetromino.move(tetromino.slide.bind(tetromino), tetromino.slideCenter.bind(tetromino), 'down');
  } else if (keyRotate.isDown) {
    // La tecla arriba rota (Sentido horario).
    // Nota: la rotación de la pieza O no sirve de nada visualmente, pero la lógica lo permite.
    if (tetromino.canMove(tetromino.rotate.bind(tetromino), 'clockwise'))
      tetromino.move(tetromino.rotate.bind(tetromino), null, 'clockwise');
  };

  //Actualiza el HUD
  puntos.innerText = puntosActual;

  // Reinicia el timer para que haya que esperar otros 85ms antes de registrar otro movimiento.
  currentMovementTimer = 0;
};

// Fija la pieza actual convirtiéndola en estado 'OCCUPIED' en la matriz.
function lockTetromino() {
  let touchedLines = []; // Array temporal para guardar qué filas Y ha ocupado la pieza
  for (let i = 0; i < tetromino.cells.length; i++) {
    let x = tetromino.cells[i][0];
    let y = tetromino.cells[i][1];

    theTetris.scene[x][y] = OCCUPIED; // Lógicamente ahora es "piedra dura"
    theTetris.sceneBlocks[x][y] = tetromino.blocks[i]; // Guarda la imagen visual en la matriz global

    // Guarda la línea si no está repetida
    if (touchedLines.indexOf(y) == -1)
      touchedLines.push(y);
  }
  // Manda a comprobar si las líneas tocadas acaban de completarse.
  checkLines(touchedLines);
  // Saca la pieza siguiente
  spawn();
};

// Revisa las filas tocadas por la pieza recién fijada y aplica limpieza/colapso.
function checkLines(candidateLines) {
  let collapsed = []; // Líneas a destruir
  let multiplicador = 0; //multiplicador lineas colapsadas en la misma jugada
  let puntosJugada = 0;  //puntos de esta jugada
  for (let i = 0; i < candidateLines.length; i++) {
    let y = candidateLines[i];
    // Matemáticas astutas: si la suma de la fila da = (10 celdas * OCCUPIED (2)) = 20, está llena.
    if (lineSum(y) == (NUMBLOCKS_X * OCCUPIED)) {
      puntosJugada+=lineSum(y); //Sumar puntos por linea
      collapsed.push(y);
      cleanLine(y); // Borra visualmente esa fila
    }
  }

  multiplicador = collapsed.length;
  if(multiplicador==1)
    puntosActual += puntosJugada;
  else if(multiplicador==2)
    puntosActual += puntosJugada*1.5;
  else if(multiplicador==3)
    puntosActual += puntosJugada*2;
  else if(multiplicador==4)
    puntosActual += puntosJugada*4;

  // Si se ha eliminado al menos 1 línea, manda a colapsar (bajar) el resto.
  if (collapsed.length)
    collapse(collapsed);
};

// Suma el estado de una fila para detectar si está completamente ocupada.
// Recorre cada X (columna) en una Y (fila) y suma sus estados lógicos.
function lineSum(y) {
  let s = 0;
  for (let x = 0; x < NUMBLOCKS_X; x++) 
    s += theTetris.scene[x][y];
  return s;
};

// Borra una fila: destruye los Graphics nativos de Phaser de esa fila y marca las celdas como vacías lógicamente.
function cleanLine(y) {
  for (let x = 0; x < NUMBLOCKS_X; x++) {
    if (theTetris.sceneBlocks[x][y]) {
      theTetris.sceneBlocks[x][y].destroy(); // Elimina el dibujo de la RAM y pantalla
      theTetris.sceneBlocks[x][y] = null;
    }
    theTetris.scene[x][y] = EMPTY; // Marca como hueco libre
  }
};

// Colapsa filas: Efecto gravedad de los bloques superiores tras limpiar una línea.
function collapse(linesToCollapse) {
  // Ordena las líneas de menor a mayor (ascendente) para ir cayendo desde abajo hacia arriba.
  linesToCollapse.sort(function (a, b) {
    return a - b;
  });
  for (let idx = 0; idx < linesToCollapse.length; idx++) {
    let y = linesToCollapse[idx]; // Coge la línea borrada
    // Desde la borrada (y) hacia el cielo (yy > 0), vamos desplazando todo 1 casilla abajo.
    for (let yy = y; yy > 0; yy--) {
      for (let x = 0; x < NUMBLOCKS_X; x++) {
        // La celda actual hereda el valor lógico y gráfico de la de justo arriba.
        theTetris.scene[x][yy] = theTetris.scene[x][yy-1];
        theTetris.sceneBlocks[x][yy] = theTetris.sceneBlocks[x][yy-1];
        // Si hay un dibujo, se le actualiza su Y visual multiplicando por el tamaño.
        if (theTetris.sceneBlocks[x][yy])
          theTetris.sceneBlocks[x][yy].y = yy * BLOCKSIZE;
      }
    }
    // Finalmente, la fila más alta de todas (la 0) se limpia obligatoriamente al haber bajado todo.
    for (let x2 = 0; x2 < NUMBLOCKS_X; x2++) {
      theTetris.scene[x2][0] = EMPTY;
      theTetris.sceneBlocks[x2][0] = null;
    }
  }
};

function calcularObjetivo(){
  objetivoPuntos = 20; //67*20*nivelSeleccionado;
  console.log(objetivoPuntos);
};