class enemyPrefab extends Phaser.GameObjects.Sprite
{
    constructor(_scene,_positionX,_positionY,_spriteTag)
    {
        super(_scene,_positionX,_positionY,_spriteTag);
        _scene.add.existing(this);
        this.setOrigin(.5,0);
        this.anims.play('idleEnemy');
        this.health = 2;
    }

    preUpdate(time,delta)
    {
        
        if(this.y > config.height+this.body.height)
        {
            this.active = false;
        }
        
        super.preUpdate(time, delta);
    }
}