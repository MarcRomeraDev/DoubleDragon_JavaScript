class bulletPrefab extends Phaser.GameObjects.Sprite
{
    constructor(_scene,_positionX,_positionY,_spriteTag)
    {
        super(_scene,_positionX,_positionY,_spriteTag);
        _scene.add.existing(this);
    }

    preUpdate()
    {
        if(this.y <=0)
        {
            this.active = false;
        }
    }
}