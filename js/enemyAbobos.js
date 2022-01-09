class enemyAbobos extends enemyPrefab {
    constructor(_scene, _posX, _posY, _tag, character, dmg, health) {
        super(_scene, _posX, _posY, _tag, dmg, health);


        _scene.add.existing(this).setOrigin(.5);
        _scene.physics.world.enable(this);
        this.body.setSize(16, 39, true);

        this.flipHitBox();
        this.aType = "PUNCH"; // PUNCH, KICK, BIG_ATTACK

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
            this.body.setOffset(25, 15);
        } else {
            this.body.setOffset(23, 15);
        }

    }
    giveWeapon() {
       

    }
    dropWeapon() {
  
    }
    resetEnemy() {
        super.init();
    }
    attackWithWeapon() {
        this.scene.ePunchSound.play();
        this.anims.play(this.eType + 'attackweapon', true);
        this.dropWeapon();
        super.enemyPunchTimer = this.scene.time.delayedCall(gamePrefs.loparthrowingRecoverTime, super.resetEnemyFrameToIddle, [this], this);
        super.attackingTimer = this.scene.time.delayedCall(gamePrefs.loparthrowingRecoverTime, super.setIsAttacking, [false], this);
    }
    BigAttack() {
        if (!this.isAttacking) {
          this.isAttacking = true;
          this.bigAttackAnimation = this.play('abobosBigAttack', true);
    
          this.enemyHitbox.x = this.flipX ? this.x - this.width * 0.2 : this.x + this.width * 0.2;
          this.enemyHitbox.y = this.y - this.height * 0.1;
          this.enemyHitbox.type = 'HEADBUTT';
    
          this.bigAttackAnimation.on('animationupdate', function () {
            if (this.bigAttackAnimation.anims.currentFrame.index < 1) {
              return;
            }
            this.bigAttackAnimation.off('animationupdate'); //STOPS LISTENER IF ANIMATION IS IN FRAME 3
            this.scene.physics.world.add(this.enemyHitbox.body); //--> ADDS HITBOX WHEN THE ANIMATIONS IS IN ITS THIRD FRAME
            //this.scene.punchSound.play();
          });
    
          this.bigAttackAnimation.on('animationcomplete', function () { this.isAttacking = false; this.enemyHitbox.body.enable = false; }, this);
        }
      }

    hit(attackType) {
        this.takeDmg(this, attackType);
    }

}