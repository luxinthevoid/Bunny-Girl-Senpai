//Objetos
let btnStart;
let txtTitulo;

let initState={
    preload: preloadInit,
    create: createInit,
};

function preloadInit(){
    game.load.image('play','assets/playBtn.png');
}

function createInit(){
    //Posiciones objetos
    let start_posX=game.world.width * 0.5;   //BOTON START
    let start_posY=game.world.height * 0.60;

    let text_posX=game.world.width * 0.5; //Texto Start
    let text_posY=game.world.height * 0.05;

    btnStart=game.add.button(start_posX,start_posY,'play', startPlay);
    btnStart.anchor.setTo(0.5,0.5);
    btnStart.scale.setTo(0.15);

    txtTitulo = game.add.text(text_posX,text_posY,'TETRIS', estiloTitulo);
    txtTitulo.anchor.setTo(0.5, 0.5);
}

function startPlay(){
    game.state.start('play');
}