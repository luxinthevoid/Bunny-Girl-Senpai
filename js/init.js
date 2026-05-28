//Objetos
let BotonVolver;
let INITbtnCreditos;
let INITbgImg;

// let INITCarga = document.getElementById('imgCarga');

let initState={
    preload: preloadInit,
    init: tamanyoCanvasJuego,
    create: createInit,
};

function preloadInit(){
    game.load.image('background','assets/imgs/UI/Menu_BG.png');
    game.load.image('btnPlay','assets/imgs/UI/Boton_normal.png');
    game.load.image('btnPlayHover','assets/imgs/UI/Boton_hover.png');
    game.load.image('btnCredits','assets/imgs/UI/Boton_creditos.png');
    game.load.image('btnCreditsHover','assets/imgs/UI/Boton_creditos_hover.png');
    game.load.image('creds','assets/imgs/pikmin_creds.png');
    game.load.image('tetris','assets/imgs/ui/Título.png');

    game.load.audio('sfx_click', 'assets/sonidos/click_button_sound.wav');
    game.load.audio('sfx_hover', 'assets/sonidos/hover_sound.wav');
}

function tamanyoCanvasJuego(){
  this.game.scale.setGameSize(canvasWidth,gameHeight);
};

function createInit(){
    //Sonidos
    let sfxClick = game.add.audio('sfx_click');
    let sfxHover = game.add.audio('sfx_hover');

    INITbgColor = game.add.graphics(0, 0);
    INITbgColor.beginFill(0x6D6D7D);
    INITbgColor.drawRect(0, 0, canvasWidth, gameHeight);
    INITbgColor.endFill();

    BGIMG = game.add.image(0,0,'background');
    TetrisTXT = game.add.image(0,game.world.height * 0.1,'tetris');
    game.add.tween(TetrisTXT).to(
            { y: TetrisTXT.y + 15 },    
            1000,Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true  );

    //BOTON INICIO
    BotonVolver = game.add.button(game.world.width * 0.5, game.world.height * 0.65,'btnPlay',
        function(){ sfxClick.play(); menuNiveles(); });

    BotonVolver.onInputOver.add(
        function() {BotonVolver.loadTexture('btnPlayHover'); sfxHover.play();});

    BotonVolver.onInputOut.add(
        function() {BotonVolver.loadTexture('btnPlay');});

    BotonVolver.anchor.setTo(0.5, 0.5);
    BotonVolver.scale.setTo(1);

    //BOTON CREDITOS
    INITbtnCreditos= game.add.button(game.world.width * 0.50, game.world.height * 0.8,'btnCredits',
        function(){ sfxClick.play(); creditos(); });

    INITbtnCreditos.onInputOver.add(
        function() {INITbtnCreditos.loadTexture('btnCreditsHover'); sfxHover.play();});

    INITbtnCreditos.onInputOut.add(
        function() {INITbtnCreditos.loadTexture('btnCredits');});

    INITbtnCreditos.anchor.setTo(0.5, 0.5);
    INITbtnCreditos.scale.setTo(1);
}

function menuNiveles(){
    // INITCarga.style.display = 'flex';
    game.state.start('niveles');
}

function creditos(){
    game.state.start('creditos');
}