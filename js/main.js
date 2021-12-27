var gamePrefs=
{
    playerSpeed: 40
}
var sceneVars =
{
    canMove: false
}
var config=
{
    type: Phaser.AUTO,
    width:248,
    height:224,
    scene:[menu, gameState], //array con los niveles
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