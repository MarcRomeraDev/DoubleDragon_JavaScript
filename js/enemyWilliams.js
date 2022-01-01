class enemyWilliams extends enemyPrefab
{
    constructor(_scene,_posX,_posY,_tag,character, dmg, health)
    {
        super(_scene,_posX,_posY,_tag,dmg,health);


        _scene.add.existing(this).setOrigin(.5);
        _scene.physics.world.enable(this);
        this.body.setSize(16, 39, true);
        this.flipHitBox();
        
        //_scene.physics.add.sprite(_posX, _posY, _tag).setOrigin(.5);
        //this.body.setSize(16, 37, true).setOffset(30, 10);
        
        this.body.collideWorldBounds = true; //--> Collision with world border walls
        this.body.onWorldBounds = true; //--> On collision event
        //  _scene.physics.world.enable(this);
        
        //this.anims.play('crawl',true);
        //this.direction = 1;
       
        this.target = character;
      
        this.scene = _scene;
        
        //this.body.velocity.x = gameOptions.jumperSpeed*this.direction;

        //_scene.physics.add.collider(this,_scene.player,this.hit,null,this);
        /*this.enemyTimer = this.scene.time.addEvent
        (
            {
                delay:100000, //ms
                callback:this.attack,
                callbackScope:this,
                repeat: 0
            }
        );*/
    }
    
    preUpdate(time,delta)
    {
        this.move();
        this.attack();
        super.preUpdate(time,delta,this,this.scene.player);
    }    
    move()
    {
        super.move(this,this.scene.player);
    }
    attack()
    {
        super.attack(this);
    }
    flipHitBox()
    {
        if(this.flipX)
        {
            this.body.setOffset(25, 0);
        }else{
            this.body.setOffset(26, 0);
        }
    }
    resetEnemy()
    {
        super.init();
    }

    hit()
    {
        this.takeDmg(this,1);
    }
    
}