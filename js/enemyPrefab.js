class enemyPrefab extends Phaser.GameObjects.Sprite {
    constructor(_scene, _posX, _posY, _tag) {
        super(_scene, _posX, _posY, _tag);
        // _scene.add.existing(this);
        this.eMoveState = "AWAY"; // States: AWAY, IN_RANGE, KNOCKED_DOWN, 

        this.followY = false;
        this.followX = false;
        this.imFighting = false;
        
        //_scene.physics.world.enable(this);

        // this.anims.play('crawl',true);
        // this.direction = 1;


        this.scene = _scene;

        //this.body.velocity.x = gameOptions.jumperSpeed*this.direction;

        // _scene.physics.add.collider(this,_scene.hero,this.hit,null,this);
    }

    preUpdate(time, delta) {

        /* if(this.body.blocked.left || this.body.position.x > this.patrol)
         {
             this.flipX = !this.flipX;
             this.direction *= -1;
             this.body.velocity.x = gameOptions.jumperSpeed*this.direction;
         }*/


        super.preUpdate(time, delta);
    }
    changeMoveState(_newState) {
        this.eMoveState = _newState;
    }
    move(_enemy, _hero) {
        if (this.eMoveState != "KNOCKED_DOWN") {
            var distanceX = Phaser.Math.Distance.Between(_enemy.body.x, 0, _hero.body.x, 0);
            var distanceY = Phaser.Math.Distance.Between(0, _enemy.body.y, 0, _hero.body.y);
            
            if(distanceY > gamePrefs.heightThreshold && this.scene.isPlayerInAFight && this.imFighting)
            {
                this.startAFight(false);
            }
            else if((distanceY < gamePrefs.heightThreshold) && !this.scene.isPlayerInAFight && !this.imFighting)
            {
                this.startAFight(true);
            }
            
            

            if (this.imFighting || !this.scene.isPlayerInAFight) {
               
                if (distanceY > 1) { // We just need one pixel
                    if (_enemy.body.y < _hero.body.y) {
                        _enemy.body.velocity.y = gamePrefs.enemySpeed;
                    }
                    else {
                        _enemy.body.velocity.y = -gamePrefs.enemySpeed;
                    }
                }
                else {
                    _enemy.body.velocity.y = 0;
                }
                if (distanceX > gamePrefs.attackRange && (distanceX > gamePrefs.forceApproachDistance || distanceY < gamePrefs.heightThreshold)) {
                    if (_enemy.body.x < _hero.body.x) {
                        _enemy.body.velocity.x = gamePrefs.enemySpeed;
                    }
                    else {
                        _enemy.body.velocity.x = -gamePrefs.enemySpeed;
                    }
                }
                else if(distanceX < gamePrefs.attackRange - gamePrefs.evadeThreshold)
                    {
                        if (_enemy.body.x > _hero.body.x) {
                            _enemy.body.velocity.x = gamePrefs.enemySpeed;
                        }
                        else {
                            _enemy.body.velocity.x = -gamePrefs.enemySpeed;
                        }
                    }
                else {
                    _enemy.body.velocity.x = 0;
                    this.changeMoveState("IN_RANGE");
                }
            }
            else {
                if (distanceY < gamePrefs.heightThreshold) {
                    if (_enemy.body.y > _hero.body.y) {
                        _enemy.body.velocity.y = gamePrefs.enemySpeed;
                    }
                    else {
                        _enemy.body.velocity.y = -gamePrefs.enemySpeed;
                    }
                }
                else if(distanceY > gamePrefs.heightThreshold*1.3)
                {
                    if (_enemy.body.y < _hero.body.y) {
                        _enemy.body.velocity.y = gamePrefs.enemySpeed;
                    }
                    else {
                        _enemy.body.velocity.y = -gamePrefs.enemySpeed;
                    }
                }
                else {
                    _enemy.body.velocity.y = 0;
                    if (distanceX > gamePrefs.attackRange) {

                        if (_enemy.body.x < _hero.body.x) {
                            _enemy.body.velocity.x = gamePrefs.enemySpeed;
                        }
                        else {
                            _enemy.body.velocity.x = -gamePrefs.enemySpeed;
                        }
                    }
                    else if(distanceX < gamePrefs.attackRange - gamePrefs.evadeThreshold)
                    {
                        if (_enemy.body.x > _hero.body.x) {
                            _enemy.body.velocity.x = gamePrefs.enemySpeed;
                        }
                        else {
                            _enemy.body.velocity.x = -gamePrefs.enemySpeed;
                        }
                    }
                    else {
                        _enemy.body.velocity.x = 0;
                    }
                }

            }
        }


    }

    startAFight(_boolean) // Start a fight makes this enemy the only one that can go hit the player like in the original DD
    {
        this.imFighting = _boolean;
        this.scene.isPlayerInAFight = _boolean;
    }
    hit(_enemy, _hero) {
        if (_enemy.body.touching.up && _hero.body.touching.down) {
            _hero.body.velocity.y = -gameOptions.heroJump;
            this.destroy();
        } else {
            _hero.body.reset(65, 100);
            this.scene.cameras.main.shake(500, 0.05);
            this.scene.cameras.main.flash(500, 255, 0, 0);
        }

    }

}