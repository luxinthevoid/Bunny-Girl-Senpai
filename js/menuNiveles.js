//Objetos
let btnN1, btnN2, btnN3, btnN4, btnN5, btnN6;
let txtHeader;

let nivelesState={
    preload: preloadNiveles,
    init: tamanyoCanvasNiveles,
    create: createNiveles,
};

function tamanyoCanvasNiveles(){
    this.game.scale.setGameSize(gameWidth+130,gameHeight);
};

function preloadNiveles(){
    game.load.image('n1','assets/niveles/2tipospc.png');
    game.load.image('n2','assets/niveles/whysosirius.jpg');
    game.load.image('n3','assets/niveles/uncanny.png');
    game.load.image('n4','assets/niveles/patricio.jpg');
    game.load.image('n5','assets/niveles/iGuess.jpg');
    game.load.image('n6','assets/niveles/bart.jfif');
}

function createNiveles(){
    let text_posX=game.world.width * 0.5;
    let text_posY=game.world.height * 0.15;

    
    txtHeader = game.add.text(text_posX,text_posY,'Niveles', estiloTitulo);
    txtHeader.anchor.setTo(0.5, 0.5);

    btnN1=game.add.button(game.width*0.25,game.height*0.4,'n1',function(){startPlay(1)});
    btnN1.anchor.setTo(0.5,0.5);
    btnN1.scale.set(0.25)

    btnN2=game.add.button(game.width*0.5,game.height*0.4,'n2', function(){startPlay(2)});
    btnN2.anchor.setTo(0.5,0.5);
    btnN2.scale.set(0.1)

    btnN3=game.add.button(game.width*0.75,game.height*0.4,'n3', function(){startPlay(3)});
    btnN3.anchor.setTo(0.5,0.5);
    btnN3.scale.set(0.1)

    btnN4=game.add.button(game.width*0.25,game.height*0.75,'n4', function(){startPlay(4)});
    btnN4.anchor.setTo(0.5,0.5);
    btnN4.scale.set(0.55)

    btnN5=game.add.button(game.width*0.5,game.height*0.75,'n5', function(){startPlay(5)});
    btnN5.anchor.setTo(0.5,0.5);
    btnN5.scale.set(0.25)

    btnN6=game.add.button(game.width*0.75,game.height*0.75,'n6', function(){startPlay(6)});
    btnN6.anchor.setTo(0.5,0.5);
    btnN6.scale.set(0.2)
}

function startPlay(nivel){
    game.state.start('play',true, false, nivel);
}