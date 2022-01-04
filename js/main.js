var gamePrefs =
{
    playerSpeed: 60,
    enemySpeed: 35,
    attackRange: 26,
    heightThreshold: 20,
    forceApproachDistance: 60,
    evadeThreshold: 2,
    attackRate: 310,
    punchDuration: 155,
    punchCollisionDuration: 35,
    vulnerableTimer: 300,
    knockDownTimer: 2000,
    backgroundSpeed: 1,
    heightPunchingThreshold: 4,
    whipDuration: 300,
    lindaWeaponAttackRate: 450
}
var sceneVars =
{
    canMove: false
}
var config =
{
    type: Phaser.AUTO,
    width: 248,
    height: 224,
    scene: [menu, gameState, level2], //array con los niveles
    render: {
        pixelArt: true
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    }
}
var juego = new Phaser.Game(config);