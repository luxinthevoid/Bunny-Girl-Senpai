let btnStart;

let initState={
    preload: preloadInit,
    create: createInit,
};

function preloadInit(){
    game.load.image('play','assets/playBtn.png');
}

function createInit(){
    let posX=game.world.width/2;
    let posY=game.world.height/2;
    btnStart=game.add.button(posX,posY,'play', startPlay);
    btnStart.anchor.setTo(0.5,0.5);
    btnStart.scale.setTo(0.2);
}

function startPlay(){
    game.state.start('play');
}