let btnRestart;
let txtHeaderHof;

let hofState={
    preload: preloadHof,
    create: createHof,
};

function preloadHof(){
    game.load.image('ttt','assets/lilTung.png');
}

function createHof(){
    let posX=game.world.width*0.5;
    let posY=game.world.height*0.65;

    let text_posX=game.world.width * 0.5;
    let text_posY=game.world.height * 0.15;
    
    txtHeader = game.add.text(text_posX,text_posY,'Hall of\nFame', estiloTitulo);
    txtHeader.anchor.setTo(0.5, 0.5);

    btnRestart=game.add.button(posX,posY,'ttt', menuNiveles);
    btnRestart.anchor.setTo(0.5,0.5);
    btnRestart.scale.setTo(1);
}

function menuNiveles(){
    game.state.start('niveles');
}