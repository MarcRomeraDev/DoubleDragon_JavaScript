class enemyLindas extends enemyPrefab {
    constructor(_scene, _posX, _posY, _tag, character, dmg, health) {
        super(_scene, _posX, _posY, _tag, dmg, health);


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

    preUpdate(time, delta) {
        this.move();
        this.attack();
        super.preUpdate(time, delta, this, this.scene.player);
    }
    move() {
        super.move(this, this.scene.player);
    }
    attack() {
        super.attack(this);
    }
    flipHitBox() {
        if (this.flipX) {
            this.body.setOffset(33, 0);
        } else {
            this.body.setOffset(27, 0);
        }

    }
    giveWeapon() {
        if(this.eMoveState != "DEAD")
        {
        this.setFrame(5);
        super.setVulnerable(false);
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
        super.giveWeapon();
        this.getWeaponTimer = this.scene.time.delayedCall(500, super.setVulnerable, [true], this);
        }

        // super.pickUpWeapon(this);

    }
    dropWeapon() {
        this.scene.createWeapon(this.body.x,this.body.y,'whip',0,-100,this.body.y+39);
        super.dropWeapon();
    }
    resetEnemy() {
        super.init();
    }
    attackWithWeapon() {
        
        this.whipAnimation = this.anims.play(this.eType + 'attackweapon', true);
      
        this.whipAnimation.on('animationupdate', function () {
            if (this.whipAnimation.anims.currentFrame.index < 3) {
              return;
            }
            this.scene.ePunchSound.play();
            if (Phaser.Math.Distance.Between(0, this.body.y + this.body.height, 0, this.scene.player.body.y + this.scene.player.body.height) < 3) {
                this.enemyHitbox.x = this.flipX ? this.x - this.width * 0.2 : this.x + this.width * 0.2;
                this.enemyHitbox.y = this.y - this.height * 0.03;
                this.scene.physics.world.add(this.enemyHitbox.body); //--> Adds hitbox to the attack when pressing input
                this.auxTimer = this.scene.time.delayedCall(gamePrefs.punchDuration, function() {this.enemyHitbox.body.enable = false;}, [], this);
            } 
            
            this.whipAnimation.off('animationupdate'); //STOPS LISTENER IF ANIMATION IS IN FRAME 3
          
          });
      
        this.scene.ePunchSound.play();
        super.enemyPunchTimer = this.scene.time.delayedCall(gamePrefs.whipDuration, super.resetEnemyFrameToIddle, [this], this);
        super.attackingTimer = this.scene.time.delayedCall(gamePrefs.lindaWeaponAttackRate, super.setIsAttacking, [false], this);
    }


    hit(attackType) {
        this.takeDmg(this, attackType);
    }

}