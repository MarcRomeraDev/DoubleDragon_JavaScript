var gamePrefs=
{
    playerSpeed: 40,
    enemySpeed: 20  ,
    attackRange: 25,
    heightThreshold: 20,
    forceApproachDistance: 60,
    evadeThreshold: 10,
    attackRate: 310,
    punchDuration: 155,
    vulnerableTimer: 300,
    knockDownTimer: 2000
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