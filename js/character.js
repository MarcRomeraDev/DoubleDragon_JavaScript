class character extends Phaser.GameObjects.Sprite {
    constructor(_scene,_posX,_posY,_tag)
    {
        super(_scene,_posX,_posY,_tag);
        
        
        this.scene = _scene;
        _scene.add.existing(this);
        
        this.sprite = _scene.physics.add.sprite(_scene,_posX, _posY, 'player').setOrigin(.5);
       
      //  _scene.physics.world.enable(this);

        //this.anims.play('jump',true);
      //  this.direction = 1;
      
      //this.input = _scene.input;
     // this.input = this.input.keyboard.createCursorKeys();
     // this.input.enabled = true;
       // this.body.velocity.x = gameOptions.heroSpeed*this.direction;

       // _scene.physics.add.collider(this,_scene.hero,this.hit,null,this);
    }
    
    preUpdate() {
        
    }
    Move(_input){
        if (_input.left.isDown) {
            this.sprite.body.velocity.x = -5;
             this.sprite.flipX = true;
         } else if (_input.right.isDown) {
             this.sprite.body.velocity.x = 5
             this.sprite.flipX = false;
       } else {
         }
    }
}