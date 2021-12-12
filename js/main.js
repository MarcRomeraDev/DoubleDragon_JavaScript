var gamePrefs=
{
    playerSpeed: 30
}
var sceneVars =
{
    canMove: false
}
var config=
{
    type: Phaser.AUTO,
    width:248,
    height:192,
    scene:[gameState], //array con los niveles
    render:{
        pixelArt:true
    },
    scale:{
        mode:Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics:{
        default:'arcade',
        arcade:{
            //gravity:{y:0},
            debug:true
        }
    }
}
var juego = new Phaser.Game(config);