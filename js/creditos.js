//Objetos
let CRbtnVolver;
let CRtxtCreditos;
let CRbgImg;

let creditosState={
    preload: preloadCreditos,
    create: createCreditos,
};

function preloadCreditos(){
    game.load.image('background','assets/imgs/zen_background.jpg');
    game.load.image('play','assets/playButton.webp');
}

function createCreditos(){
   
    //Posiciones objetos
    let CRstart_posX=game.world.width * 0.5;   //BOTON START
    let CRstart_posY=game.world.height * 0.60;

    let CRtext_posX=game.world.width * 0.5; //Texto Start
    let CRtext_posY=game.world.height * 0.25;

    CRbgImg = game.add.image(0,0,'background');
    CRbgImg.width = gameWidth+130;
    CRbgImg.height = gameHeight;

    CRbtnVolver=game.add.button(CRstart_posX,CRstart_posY,'play', mainMenu);
    CRbtnVolver.anchor.setTo(0.5,0.5);
    CRbtnVolver.scale.setTo(0.15);

    CRtxtCreditos = game.add.text(CRtext_posX,CRtext_posY,'Juego creador por:\nLorena López\ny\nAdrián Chica', estiloTitulo);
    CRtxtCreditos.anchor.setTo(0.5, 0.5);
}

function mainMenu(){
    game.state.start('init');
}