class enemyWilliams extends enemyPrefab {
    constructor(_scene, _posX, _posY, _tag, character, dmg, health) {
        super(_scene, _posX, _posY, _tag, dmg, health);


        _scene.add.existing(this).setOrigin(.5);
        _scene.physics.world.enable(this);
        this.body.setSize(16, 38, true);
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
            this.body.setOffset(25, 0);
        } else {
            this.body.setOffset(26, 0);
        }
    }
    resetEnemy() {
        super.init();
    }
    giveWeapon() { }

    hit(attackType) {
        this.takeDmg(this, attackType);
    }

}