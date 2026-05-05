let HOFbtnRestart;
let HOFtxtHeader;

let hofState={
    preload: preloadHof,
    init: tamanyoCanvasJuego,
    create: createHof,
};

function preloadHof(){
    game.load.image('ttt','assets/lilTung.png');
}

function tamanyoCanvasJuego(){
  this.game.scale.setGameSize(canvasWidth+150,gameHeight);
};

function createHof(){
    let HOFposX=game.world.width*0.5;
    let HOFposY=game.world.height*0.65;

    let HOFtext_posX=game.world.width * 0.5;
    let HOFtext_posY=game.world.height * 0.15;

    HOFtxtHeader = game.add.text(HOFtext_posX,HOFtext_posY,'Hall of\nFame', estiloTitulo);
    HOFtxtHeader.anchor.setTo(0.5, 0.5);

    HOFbtnRestart=game.add.button(HOFposX,HOFposY,'ttt', menuNiveles);
    HOFbtnRestart.anchor.setTo(0.5,0.5);
    HOFbtnRestart.scale.setTo(1);
}

function menuNiveles(){
    game.state.start('niveles');
}