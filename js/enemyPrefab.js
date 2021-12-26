class enemyPrefab extends Phaser.GameObjects.Sprite
{
    constructor(_scene,_posX,_posY,_tag)
    {
        super(_scene,_posX,_posY,_tag);
       // _scene.add.existing(this);
        this.eMoveState = "Wandering";
        //_scene.physics.world.enable(this);

       // this.anims.play('crawl',true);
       // this.direction = 1;


        this.scene = _scene;

        //this.body.velocity.x = gameOptions.jumperSpeed*this.direction;

       // _scene.physics.add.collider(this,_scene.hero,this.hit,null,this);
    }
    
    preUpdate(time,delta)
    {
        
       /* if(this.body.blocked.left || this.body.position.x > this.patrol)
        {
            this.flipX = !this.flipX;
            this.direction *= -1;
            this.body.velocity.x = gameOptions.jumperSpeed*this.direction;
        }*/
        
        super.preUpdate(time,delta);
    }    
    move(_enemy,_hero)
    {
       switch(this.eMoveState)
       {
            case "Distancing":
                //if(_enemy.body.x)
                break;
            case "Approaching":
                break;
            default:
                break;
       }
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