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
    game.load.image('background','assets/imgs/UI/Menu_BG.png');
    game.load.image('n1','assets/imgs/UI/lvl_1.png');
    game.load.image('n2','assets/imgs/UI/lvl_2.png');
    game.load.image('n3','assets/imgs/UI/lvl_3.png');
    game.load.image('n4','assets/imgs/UI/lvl_4.png');
    game.load.image('n5','assets/lilTung.png');
    game.load.image('n6','assets/niveles/whysosirius.jpg');
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

    BGIMG = game.add.image(0,0,'background');

    MNtxtHeader = game.add.text(MNtext_posX,MNtext_posY,'Levels', estiloTitulo);
    MNtxtHeader.anchor.setTo(0.5, 0.5);

    MNbtnN1=game.add.button(game.width*0.2,game.height*0.4,'n1',function(){
        startPlay(1);
        sfxClick.play();}
    );
    MNbtnN1.inputEnabled = true;
    MNbtnN1.onInputOver.add(function() {
        sfxHover.play();
    }, this);


    MNbtnN2=game.add.button(game.width*0.6,game.height*0.4,'n2', function(){
        startPlay(2);
        sfxClick.play();}
    );
    MNbtnN2.inputEnabled = true;
    MNbtnN2.onInputOver.add(function() {
        sfxHover.play();
    }, this);


    MNbtnN3=game.add.button(game.width*0.2,game.height*0.55,'n3', function(){
        startPlay(3);
        sfxClick.play();}
    );
    MNbtnN3.inputEnabled = true;
    MNbtnN3.onInputOver.add(function() {
        sfxHover.play();
    }, this);


    MNbtnN4=game.add.button(game.width*0.6,game.height*0.55,'n4', function(){startPlay(4);
        sfxClick.play();}
    );
    MNbtnN4.inputEnabled = true;
    MNbtnN4.onInputOver.add(function() {
        sfxHover.play();
    }, this);


    MNbtnVolver=game.add.button(MNvolver_posX,MNvolver_posY,'n5', function(){ mainMenu();
        sfxClick.play();}
    );
    MNbtnVolver.inputEnabled = true;
    MNbtnVolver.onInputOver.add(function() {
        sfxHover.play();
    }, this);

    MNbtnVolver.anchor.setTo(.5,.5);
    MNbtnVolver.scale.setTo(0.3);


    MNbtnN6=game.add.button(game.width*0.25,game.height*0.8,'n6', function(){ halloffame();
        sfxClick.play();}
    );
    MNbtnN6.inputEnabled = true;
    MNbtnN6.onInputOver.add(function() {
        sfxHover.play();
    }, this);

    MNbtnN6.anchor.setTo(.5,.5);
    MNbtnN6.scale.setTo(0.1);

}

function startPlay(nivel){
    game.state.start('play',true, false, nivel);
}

function mainMenu(){
    game.state.start('init');
}

function halloffame(){
    game.state.start('hof');
}