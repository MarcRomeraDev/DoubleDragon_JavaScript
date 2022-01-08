class weapon extends Phaser.GameObjects.Sprite {
    constructor(_scene, _posX, _posY, _tag, velX,velY, throwerY) {
        super(_scene, _posX, _posY, _tag);
        //this.add.sprite(config.width - 40, config.height / 2, 'thumbsUp');
        this.scene = _scene;
        this.scene.add.existing(this).setOrigin(.5);
        this.scene.physics.world.enable(this);
        this.body.gravity.y = 400;
        this.body.velocity.set(velX, velY);
        
        this.body.collideWorldBounds = true;
        
        this.line = this.scene.add.line(config.width/2,throwerY,0,throwerY,config.width,throwerY, 0xffffff, 1);
        this.scene.physics.add.existing(this.line);
        this.line.body.immovable = true;
        this.knockDownPlayer = true;
        this.scene.physics.add.collider(this, this.line);
        if(_tag == 'barrel')
        {
            this.body.bounce.set(0.9);
            this.scene.physics.add.overlap(this, this.scene.player, this.scene.dmgPlayer, null, this.scene);

        }
        this.pickUpTimer = this.scene.time.delayedCall(gamePrefs.knockDownTimer, this.canBePickedUp, [], this);

    }
    canBePickedUp()
    {
       
        this.body.velocity.x = 0;
        this.scene.physics.add.overlap(this, this.scene.waveSystem.enemies, this.scene.waveSystem.giveWeapon, null, this.scene.waveSystem);
        this.scene.hasWeapon = true;
    }
}