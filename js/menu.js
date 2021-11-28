class menu extends Phaser.Scene
{
    
    constructor()
    {
        //super({key: "menu"});
    }
    
    preload()
    {
        this.load.setPath('assets/sprites/Mission1BackgroundSprites');
        this.load.image('background1','1.png');
    }
    
    create()
    {
        this.bg1=this.add.tileSprite(0,0,1015,192,'background1').setOrigin(0);
    }
    
    iniciaJuego()
    {
        
    }
    
    // cambiaEscena()
    // {
    //     this.scene.start('gameState');
    // }
    
    update()
    {
    }
}