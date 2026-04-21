let btnRestart;

let hofState={
    preload: preloadHof,
    create: createHof,
};

function preloadHof(){
    game.load.image('ttt','assets/lilTung.png');
}

function createHof(){
    let posX=game.world.width/2;
    let posY=game.world.height/2;
    btnRestart=game.add.button(posX,posY,'ttt', startPlay);
    btnRestart.anchor.setTo(0.5,0.5);
    btnRestart.scale.setTo(1);
}

function startPlay(){
    game.state.start('play');
}