class powerUpPrefab extends Phaser.GameObjects.Sprite{
    
    constructor(scene, positionX, positionY,_tipo){
		super(scene, positionX, positionY, 'powerUp'+_tipo);
		scene.add.existing(this);
        this.setOrigin(.5,0);
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