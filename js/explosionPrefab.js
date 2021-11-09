class explosionPrefab extends Phaser.GameObjects.Sprite
{
    constructor(_scene,_positionX,_positionY,_spriteTag)
    {
        super(_scene,_positionX,_positionY,_spriteTag);
        _scene.add.existing(this);
        this.anims.play('explosionAnim');
        this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, ()=> {
            this.setActive(false);
        }, _scene);
    }

}