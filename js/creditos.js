//Objetos
let CRbtnVolver;
let CRtxtCreditos;
let CRbgImg;

let creditosState={
    preload: preloadCreditos,
    init: tamanyoCanvasJuego,
    create: createCreditos,
};

function preloadCreditos(){
    game.load.image('btnVolver','assets/imgs/UI/Boton_normal.png');
    game.load.image('btnVolverHover','assets/imgs/UI/Boton_hover.png');
    game.load.image('background','assets/imgs/UI/Menu_BG.png');
}

function tamanyoCanvasJuego(){
  this.game.scale.setGameSize(canvasWidth,gameHeight);
};

function createCreditos(){
    let sfxClick = game.add.audio('sfx_click');
    let sfxHover = game.add.audio('sfx_hover');

    //Posiciones objetos
    let CRstart_posX=game.world.width * 0.5;   //BOTON START
    let CRstart_posY=game.world.height * 0.60;

    let CRtext_posX=game.world.width * 0.5; //Texto Start
    let CRtext_posY=game.world.height * 0.25;

    CRbgImg = game.add.image(0,0,'background');

    BotonVolver = game.add.button(game.world.width * 0.50, game.world.height * 0.9,'btnVolver',
        function(){ sfxClick.play(); mainMenu(); });

    BotonVolver.onInputOver.add(
        function() {BotonVolver.loadTexture('btnVolverHover'); sfxHover.play();});

    BotonVolver.onInputOut.add(
        function() {BotonVolver.loadTexture('btnVolver');});

    BotonVolver.anchor.setTo(0.5, 0.5);
    BotonVolver.scale.setTo(1);

    CRtxtCreditos = game.add.text(CRtext_posX,CRtext_posY,'Game created by:\nLorena López\nand\nAdrián Chica', estiloTitulo);
    CRtxtCreditos.anchor.setTo(0.5, 0.5);
}

function mainMenu(){
    game.state.start('init');
}