class enemyWilliams extends enemyPrefab
{
    constructor(_scene,_posX,_posY,_tag,character)
    {
        super(_scene,_posX,_posY,_tag);
        _scene.add.existing(this);
        //_scene.physics.add.sprite(_posX, _posY, _tag).setOrigin(.5);
        _scene.physics.world.enable(this);
        //this.body.setSize(16, 37, true).setOffset(30, 10);
        
        this.body.collideWorldBounds = true; //--> Collision with world border walls
        this.body.onWorldBounds = true; //--> On collision event
        //  _scene.physics.world.enable(this);
        
        //this.anims.play('crawl',true);
        //this.direction = 1;
        
        this.target = character;
      
        this.scene = _scene;
        
        //this.body.velocity.x = gameOptions.jumperSpeed*this.direction;

        //_scene.physics.add.collider(this,_scene.hero,this.hit,null,this);
    }
    
    preUpdate(time,delta)
    {
        
        this.move();
        this.depth = this.y;
        super.preUpdate(time,delta);
    }    
    move()
    {
        super.move(this,this.scene.player);
    }

    hit(_enemy,_hero)
    {
        if(_enemy.body.touching.up && _hero.body.touching.down)
        {
            _hero.body.velocity.y = -gameOptions.heroJump;
            this.destroy();
        }else
        {
            _hero.body.reset(65,100);
            this.scene.cameras.main.shake(500,0.05);
            this.scene.cameras.main.flash(500,255,0,0);
        }

    }
    
}