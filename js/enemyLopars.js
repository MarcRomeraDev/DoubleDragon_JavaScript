class enemyLopars extends enemyPrefab {
    constructor(_scene, _posX, _posY, _tag, character, dmg, health) {
        super(_scene, _posX, _posY, _tag, dmg, health);


        _scene.add.existing(this).setOrigin(.5);
        _scene.physics.world.enable(this);
        this.body.setSize(16, 39, true);

        this.flipHitBox();

        this.body.collideWorldBounds = true; //--> Collision with world border walls
        this.body.onWorldBounds = true; //--> On collision event

        this.target = character;

        this.scene = _scene;
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
        this.anims.play(this.eType + 'runweapon', true);
        this.setFrame(14);
        super.setVulnerable(false);
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
        super.giveWeapon();
        this.getWeaponTimer = this.scene.time.delayedCall(500, super.setVulnerable, [true], this);


    }
    dropWeapon() {

        this.scene.createWeapon(this.body.x, this.body.y, 'barrel', 70 * this.direction, 10 * this.direction, this.body.y + 39);
        super.dropWeapon();
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


    hit(attackType) {
        this.takeDmg(this, attackType);
    }

}