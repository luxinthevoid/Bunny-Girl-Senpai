let HOFbtnRestart;
let HOFtxtHeader;
let LPTexto;
let HOFListaPuntos = "";
let nombre;
let puntosFinal;

let hofState={
    preload: preloadHof,
    init: tamanyoCanvasJuego,
    create: createHof,
};

function preloadHof(){
    game.load.image('ttt','assets/lilTung.png');
}

function tamanyoCanvasJuego(nombreUsuario, puntos){
  this.game.scale.setGameSize(canvasWidth+150,gameHeight);
  nombre = nombreUsuario;
  puntosFinal = puntos;
};

function createHof(){
    let HOFposX=game.world.width*0.8;
    let HOFposY=game.world.height*0.8;

    let HOFtext_posX=game.world.width * 0.5;
    let HOFtext_posY=game.world.height * 0.15;

    HOFListaPuntos = HOFListaPuntos+nombre+": "+puntosFinal+"\n";
    LPTexto = game.add.text(game.world.width*0.5,game.world.height*0.3,HOFListaPuntos, estiloText);
    LPTexto.anchor.setTo(0.5, 0);

    HOFtxtHeader = game.add.text(HOFtext_posX,HOFtext_posY,'Hall of\nFame', estiloTitulo);
    HOFtxtHeader.anchor.setTo(0.5, 0.5);

    HOFbtnRestart=game.add.button(HOFposX,HOFposY,'ttt', menuNiveles);
    HOFbtnRestart.anchor.setTo(0.5,0.5);
    HOFbtnRestart.scale.setTo(.3);
}

function menuNiveles(){
    game.state.start('niveles');
}