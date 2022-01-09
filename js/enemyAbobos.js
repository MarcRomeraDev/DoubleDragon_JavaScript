class enemyAbobos extends enemyPrefab {
    constructor(_scene, _posX, _posY, _tag, character, dmg, health) {
        super(_scene, _posX, _posY, _tag, dmg, health);


        _scene.add.existing(this).setOrigin(.5);
        _scene.physics.world.enable(this);
        this.body.setSize(20, 48, true);

        this.flipHitBox();
        this.aType = "PUNCH"; // PUNCH, KICK, BIG_ATTACK
        this.body.collideWorldBounds = true; //--> Collision with world border walls
        this.body.onWorldBounds = true; //--> On collision event


        this.target = character;
        this.flipFlopSpecial = true;
        this.scene = _scene;
        this.randomAttackTimer = this.scene.time.delayedCall(5000, this.randomAttack, [], this);
        this.maxKnockDownCounter = 7;
    }
    randomAttack() { // Every 5 seconds attack with a special
        if (this.flipFlopSpecial) {
            this.aType = "KICK";
        }
        else {
            this.aType = "BIG_ATTACK";
        }
        this.flipFlopSpecial = !this.flipFlopSpecial;

    }
    preUpdate(time, delta) {
        if (!this.scene.player.isDead)
            this.move();
        else {
            super.resetEnemyFrameToIddle(this);
        }
        this.attack();
        super.preUpdate(time, delta, this, this.scene.player);
    }
    move() {
        super.move(this, this.scene.player);
    }
    attack() {
        if (!this.isAttacking && this.eMoveState == "IN_RANGE" && this.isVulnerable) {
            this.isAttacking = true;

            this.anims.play(this.eType + 'run', false);
            if (this.aType == "PUNCH") {

                this.enemyHitbox.knockDownPlayer = false;
                if (Phaser.Math.Distance.Between(0, this.body.y + this.body.height, 0, this.scene.player.body.y + this.scene.player.body.height) < 3) {
                    this.enemyHitbox.x = this.flipX ? this.x - this.width * 0.2 : this.x + this.width * 0.2;
                    this.enemyHitbox.y = this.y - this.height * 0.03;
                }
                this.scene.physics.world.add(this.enemyHitbox.body); //--> Adds hitbox to the attack when pressing input
                this.scene.ePunchSound.play();
                this.flipFlop = !this.flipFlop;
                if (this.flipFlop) { //right punch
                    this.setFrame(4);
                }
                else { //left punch
                    this.setFrame(3);
                }

                this.enemyPunchTimer = this.scene.time.delayedCall(gamePrefs.punchDuration, this.resetEnemyFrameToIddle, [this], this);
                this.attackingTimer = this.scene.time.delayedCall(gamePrefs.enemyAttackRate, this.setIsAttacking, [false], this);
            }
            else if (this.aType == "KICK") {

                this.enemyHitbox.knockDownPlayer = true;
                this.randomAttackTimer = this.scene.time.delayedCall(5000, this.randomAttack, [], this);
                this.kickAnimation = this.play('abobosKick');
                this.aType = "PUNCH";
                this.scene.kickSound.play();

                if (Phaser.Math.Distance.Between(0, this.body.y + this.body.height, 0, this.scene.player.body.y + this.scene.player.body.height) < 3) {
                    this.enemyHitbox.x = this.flipX ? this.x - this.width * 0.2 : this.x + this.width * 0.2;
                    this.enemyHitbox.y = this.body.y + this.body.height - 15;
                }
                this.scene.physics.world.add(this.enemyHitbox.body); //--> Adds hitbox to the attack when pressing input
                if (this.body.x < this.scene.player.body.x) {// move towards player
                    this.body.velocity.x = gamePrefs.enemySpeed;
                }
                else {
                    this.body.velocity.x = -gamePrefs.enemySpeed;
                }
                this.kickAnimation.on('animationupdate', function () {
                    if (this.body.x < this.scene.player.body.x) {// move towards player
                        this.body.velocity.x = gamePrefs.enemySpeed;
                    }
                    else {
                        this.body.velocity.x = -gamePrefs.enemySpeed;
                    }
                    this.body.velocity.y = 0;
                    if (Phaser.Math.Distance.Between(0, this.body.y + this.body.height, 0, this.scene.player.body.y + this.scene.player.body.height) < 3) {
                        this.enemyHitbox.x = this.flipX ? this.x - this.width * 0.2 : this.x + this.width * 0.2;
                        this.enemyHitbox.y = this.body.y + this.body.height - 15;
                    }

                    if (this.kickAnimation.anims.currentFrame.index < 5) {
                        this.kickAnimation.off('animationupdate');
                    }



                });

                this.kickAnimation.on('animationcomplete', function () {
                    this.enemyHitbox.knockDownPlayer = false; this.enemyPunchTimer = this.scene.time.delayedCall(gamePrefs.punchDuration, this.resetEnemyFrameToIddle, [this], this);
                    this.attackingTimer = this.scene.time.delayedCall(gamePrefs.enemyAttackRate, this.setIsAttacking, [false], this);
                }, this);


            }
            else {

                this.enemyHitbox.knockDownPlayer = true;
                this.randomAttackTimer = this.scene.time.delayedCall(5000, this.randomAttack, [], this);
                this.superPunch = this.play('abobosBigAttack');
                this.aType = "PUNCH";
                this.isVulnerable = false;

                this.superPunch.on('animationupdate', function () {
                    if (this.superPunch.anims.currentFrame.index < 3) {
                        return;
                    }
                    if (Phaser.Math.Distance.Between(0, this.body.y + this.body.height, 0, this.scene.player.body.y + this.scene.player.body.height) < 3) {
                        this.enemyHitbox.x = this.flipX ? this.x - this.width * 0.2 : this.x + this.width * 0.2;
                        this.enemyHitbox.y = this.body.y + this.body.height - 15;
                    }
                    this.scene.physics.world.add(this.enemyHitbox.body); //--> Adds hitbox to the attack when pressing input
                    this.isVulnerable = true;
                    this.scene.kickSound.play();
                    this.superPunch.off('animationupdate');
                });
                this.superPunch.on('animationcomplete', function () {
                    this.enemyHitbox.knockDownPlayer = false; this.enemyPunchTimer = this.scene.time.delayedCall(gamePrefs.punchDuration, this.resetEnemyFrameToIddle, [this], this);
                    this.attackingTimer = this.scene.time.delayedCall(gamePrefs.enemyAttackRate, this.setIsAttacking, [false], this);
                }, this);
            }



        }
    }
    flipHitBox() {
        if (this.flipX) {
            this.body.setOffset(30, 0);
        } else {
            this.body.setOffset(33, 0);
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

    }


    hit(attackType) {
        this.takeDmg(this, attackType);
    }

}