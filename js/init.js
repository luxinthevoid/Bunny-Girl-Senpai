//Objetos
let INITbtnStart;
let INITbtnCreditos;
let INITtxtTitulo;
let INITbgImg;

let initState={
    preload: preloadInit,
    create: createInit,
};

function preloadInit(){
    game.load.image('background','assets/imgs/zen_background.jpg');
    game.load.image('play','assets/playButton.webp');
    game.load.image('ttt','assets/lilTung.png');

    game.load.audio('sfx_click', 'assets/sonidos/click_button_sound.wav');
    game.load.audio('sfx_hover', 'assets/sonidos/hover_sound.wav');
}

function createInit(){
    //Posiciones objetos
    let INITstart_posX=game.world.width * 0.5;   //BOTON START
    let INITstart_posY=game.world.height * 0.60;

    let INITcreditos_posX=game.world.width * 0.8;   //BOTON CREDITOS
    let INITcreditos_posY=game.world.height * 0.8;

    let INITtext_posX=game.world.width * 0.5; //Texto Start
    let INITtext_posY=game.world.height * 0.15;

    //Sonidos
    let sfxClick = game.add.audio('sfx_click');
    let sfxHover = game.add.audio('sfx_hover');

    INITbgImg = game.add.image(0,0,'background');
    INITbgImg.width = gameWidth+130;
    INITbgImg.height = gameHeight;

    INITbtnStart=game.add.button(INITstart_posX,INITstart_posY,'play', function(){
        sfxClick.play();
        menuNiveles();}
    );
    INITbtnStart.inputEnabled = true;
    INITbtnStart.onInputOver.add(function() {
        sfxHover.play();
    }, this);
    INITbtnStart.anchor.setTo(0.5,0.5);
    INITbtnStart.scale.setTo(0.15);


    INITbtnCreditos=game.add.button(INITcreditos_posX,INITcreditos_posY,'ttt', creditos);
    INITbtnCreditos.anchor.setTo(0.5,0.5);
    INITbtnCreditos.scale.setTo(0.2);

    INITtxtTitulo = game.add.text(INITtext_posX,INITtext_posY,'TETRIS', estiloTitulo);
    INITtxtTitulo.anchor.setTo(0.5, 0.5);
}

function menuNiveles(){
    game.state.start('niveles');
}

function creditos(){
    game.state.start('creditos');
}