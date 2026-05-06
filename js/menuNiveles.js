//Objetos
let MNbtnN1, MNbtnN2, MNbtnN3, MNbtnN4, MNbtnN5, MNbtnN6;
let MNtxtHeader;
let MNbtnVolver;

let nivelesState={
    preload: preloadNiveles,
    init: tamanyoCanvasJuego,
    create: createNiveles,
};

function preloadNiveles(){
    game.load.image('n1','assets/niveles/2tipospc.png');
    game.load.image('n2','assets/niveles/whysosirius.jpg');
    game.load.image('n3','assets/niveles/uncanny.png');
    game.load.image('n4','assets/niveles/patricio.jpg');
    game.load.image('n5','assets/niveles/iGuess.jpg');
    game.load.image('n6','assets/niveles/bart.jfif');
    game.load.image('ttt','assets/lilTung.png');

    game.load.audio('sfx_click', 'assets/sonidos/click_button_sound.wav');
    game.load.audio('sfx_hover', 'assets/sonidos/hover_sound.wav');

}

function tamanyoCanvasJuego(){
  this.game.scale.setGameSize(canvasWidth,gameHeight);
};

function createNiveles(){
    let MNtext_posX=game.world.width * 0.5;
    let MNtext_posY=game.world.height * 0.15;

    let MNvolver_posX=game.world.width * 0.8;   //BOTON volver
    let MNvolver_posY=game.world.height * 0.8;

    //Sonidos
    let sfxClick = game.add.audio('sfx_click');
    let sfxHover = game.add.audio('sfx_hover');

    MNtxtHeader = game.add.text(MNtext_posX,MNtext_posY,'Niveles', estiloTitulo);
    MNtxtHeader.anchor.setTo(0.5, 0.5);

    MNbtnN1=game.add.button(game.width*0.25,game.height*0.4,'n1',function(){
        startPlay(1);
        sfxClick.play();}
    );
    MNbtnN1.inputEnabled = true;
    MNbtnN1.onInputOver.add(function() {
        sfxHover.play();
    }, this);
    MNbtnN1.anchor.setTo(0.5,0.5);
    MNbtnN1.scale.set(0.15)

    MNbtnN2=game.add.button(game.width*0.5,game.height*0.4,'n2', function(){
        startPlay(2);
        sfxClick.play();}
    );
    MNbtnN2.inputEnabled = true;
    MNbtnN2.onInputOver.add(function() {
        sfxHover.play();
    }, this);
    MNbtnN2.anchor.setTo(0.5,0.5);
    MNbtnN2.scale.set(0.05)

    MNbtnN3=game.add.button(game.width*0.75,game.height*0.4,'n3', function(){
        startPlay(3);
        sfxClick.play();}
    );
    MNbtnN3.inputEnabled = true;
    MNbtnN3.onInputOver.add(function() {
        sfxHover.play();
    }, this);
    MNbtnN3.anchor.setTo(0.5,0.5);
    MNbtnN3.scale.set(0.05)

    MNbtnN4=game.add.button(game.width*0.25,game.height*0.65,'n4', function(){startPlay(4);
        sfxClick.play();}
    );
    MNbtnN4.inputEnabled = true;
    MNbtnN4.onInputOver.add(function() {
        sfxHover.play();
    }, this);
    MNbtnN4.anchor.setTo(0.5,0.5);
    MNbtnN4.scale.set(0.30)

    MNbtnN5=game.add.button(game.width*0.5,game.height*0.65,'n5', function(){startPlay(5);
        sfxClick.play();}
    );
    MNbtnN5.inputEnabled = true;
    MNbtnN5.onInputOver.add(function() {
        sfxHover.play();
    }, this);
    MNbtnN5.anchor.setTo(0.5,0.5);
    MNbtnN5.scale.set(0.15)

    MNbtnN6=game.add.button(game.width*0.75,game.height*0.65,'n6', function(){startPlay(6);
        sfxClick.play();}
    );
    MNbtnN6.inputEnabled = true;
    MNbtnN6.onInputOver.add(function() {
        sfxHover.play();
    }, this);
    MNbtnN6.anchor.setTo(0.5,0.5);
    MNbtnN6.scale.set(0.1)

    MNbtnVolver=game.add.button(MNvolver_posX,MNvolver_posY,'ttt', function(){ mainMenu();
        sfxClick.play();}
    );
    MNbtnVolver.inputEnabled = true;
    MNbtnVolver.onInputOver.add(function() {
        sfxHover.play();
    }, this);
    MNbtnVolver.anchor.setTo(0.5,0.5);
    MNbtnVolver.scale.setTo(0.15);
}

function startPlay(nivel){
    game.state.start('play',true, false, nivel);
}

function mainMenu(){
    game.state.start('init');
}