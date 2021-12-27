class enemyPrefab extends Phaser.GameObjects.Sprite {
    constructor(_scene, _posX, _posY, _tag, _dmg, _health) {
        super(_scene, _posX, _posY, _tag);
        // _scene.add.existing(this);
        this.eMoveState = "AWAY"; // States: AWAY, IN_RANGE, KNOCKED_DOWN 
        this.direction = 1;
        this.followY = false;
        this.followX = false;

        this.eType = _tag;
        this.imFighting = false;
        this.scene = _scene;
        this.isVulnerable = true;
        this.isAttacking = false;
        //Combat
        this.dmg = _dmg;
        this.health = _health;
        this.flipFlop = false;



    }

    preUpdate(time, delta, _enemy, _hero) {
        _enemy.depth = _enemy.y;
        if ((this.direction == 1 && _enemy.body.x - _hero.body.x > 0) || (this.direction == -1 && _enemy.body.x - _hero.body.x < 0)) {
            _enemy.flipX = !_enemy.flipX;
            _enemy.flipHitBox(); // sets hitbox correctly
            this.direction *= -1;
        }



        super.preUpdate(time, delta);
    }

    takeDmg(_enemy, _dmgTaken) {
        if (this.isVulnerable) {
            this.health -= _dmgTaken;
            this.isVulnerable = false;
            console.log(this.health);
            if (this.health > 0) {
                _enemy.anims.play(this.eType + 'takeDmg', true);
                this.attackingTimer = this.scene.time.delayedCall(gamePrefs.vulnerableTimer, this.setVulnerable, [true], this);

            }
            else {
                _enemy.anims.play(this.eType + 'die', true);
                this.attackingTimer = this.scene.time.delayedCall(gamePrefs.knockDownTimer, _enemy.destroy, [], _enemy);

            }
        }
    }
    setVulnerable(_bool) {
        this.isVulnerable = _bool;
    }
    setIsAttacking(_bool) {
        this.isAttacking = _bool;
    }
    changeDmg(_newDmg) {
        this.dmg = _newDmg;
    }
    attack(_enemy) {
        if (!this.isAttacking && this.eMoveState == "IN_RANGE" && this.isVulnerable) {
            console.log("Attack!");
            this.flipFlop = !this.flipFlop;
            if (this.flipFlop) { //right punch
                _enemy.setFrame(4);
            }
            else { //left punch
                _enemy.setFrame(3);
            }
            this.isAttacking = true;
            this.enemyPunchTimer = this.scene.time.delayedCall(gamePrefs.punchDuration, this.resetEnemyFrameToIddle, [_enemy], this);
            this.attackingTimer = this.scene.time.delayedCall(gamePrefs.attackRate, this.setIsAttacking, [false], this);
        }
    }
    resetEnemyFrameToIddle(_enemy) {
        _enemy.setFrame(0);
    }

    changeMoveState(_newState) {
        this.eMoveState = _newState;
    }
    move(_enemy, _hero) {
        if (this.eMoveState != "KNOCKED_DOWN" && this.isVulnerable && !this.isAttacking) {

            var distanceX = Phaser.Math.Distance.Between(_enemy.body.x, 0, _hero.body.x, 0);
            var distanceY = Phaser.Math.Distance.Between(0, _enemy.body.y, 0, _hero.body.y);

            if (distanceY > gamePrefs.heightThreshold && this.scene.isPlayerInAFight && this.imFighting) {
                this.startAFight(false);
            }
            else if ((distanceY < gamePrefs.heightThreshold) && !this.scene.isPlayerInAFight && !this.imFighting) {
                this.startAFight(true);
                console.log("Im Fighting!");
            }

            this.changeMoveState("AWAY");

            if (this.imFighting || !this.scene.isPlayerInAFight) { // Player is fighting either no one or me

                if (distanceY > 1) { // 1 pixel offset to avoid gittering
                    if (_enemy.body.y < _hero.body.y) {// move towards player
                        _enemy.body.velocity.y = gamePrefs.enemySpeed;
                    }
                    else {
                        _enemy.body.velocity.y = -gamePrefs.enemySpeed;
                    }
                }
                else {
                    _enemy.body.velocity.y = 0;// already in Y range
                    _enemy.body.y = _hero.body.y;
                }
                if (distanceX > gamePrefs.attackRange && (distanceX > gamePrefs.forceApproachDistance || distanceY < gamePrefs.heightThreshold)) {
                    if (_enemy.body.x < _hero.body.x) {// move towards player
                        _enemy.body.velocity.x = gamePrefs.enemySpeed;
                    }
                    else {
                        _enemy.body.velocity.x = -gamePrefs.enemySpeed;
                    }
                }
                else if (distanceX < gamePrefs.attackRange - gamePrefs.evadeThreshold) {// too close from player
                    if (_enemy.body.x > _hero.body.x) { // Evade player
                        _enemy.body.velocity.x = gamePrefs.enemySpeed;
                    }
                    else {
                        _enemy.body.velocity.x = -gamePrefs.enemySpeed;
                    }
                }
                else {
                    _enemy.body.velocity.x = 0; // here we always are in attacking range
                    if (distanceY < 1)
                        this.changeMoveState("IN_RANGE");
                }
            }
            else { // Player is fighting someone else, I must wait
                if (distanceY < gamePrefs.heightThreshold) { // Get in distance to get in when the chance is given
                    if (_enemy.body.y > _hero.body.y) {
                        _enemy.body.velocity.y = gamePrefs.enemySpeed;
                    }
                    else {
                        _enemy.body.velocity.y = -gamePrefs.enemySpeed;
                    }
                }
                else if (distanceY > gamePrefs.heightThreshold * 1.3) { // Stay within threshold distance
                    if (_enemy.body.y < _hero.body.y) {
                        _enemy.body.velocity.y = gamePrefs.enemySpeed;
                    }
                    else {
                        _enemy.body.velocity.y = -gamePrefs.enemySpeed;
                    }
                }
                else {
                    _enemy.body.velocity.y = 0;
                    if (distanceX > gamePrefs.attackRange) { // Move towards player

                        if (_enemy.body.x < _hero.body.x) {
                            _enemy.body.velocity.x = gamePrefs.enemySpeed;
                        }
                        else {
                            _enemy.body.velocity.x = -gamePrefs.enemySpeed;
                        }
                    }
                    else if (distanceX < gamePrefs.attackRange - gamePrefs.evadeThreshold) { // too close from player
                        if (_enemy.body.x > _hero.body.x) { // evade
                            _enemy.body.velocity.x = gamePrefs.enemySpeed;
                        }
                        else {
                            _enemy.body.velocity.x = -gamePrefs.enemySpeed;
                        }
                    }
                    else {
                        _enemy.body.velocity.x = 0; // here I wait for my chance
                    }
                }

            }
            if (this.eMoveState == "AWAY") {
                if (_enemy.body.velocity.x != 0 || _enemy.body.velocity.y != 0)
                    _enemy.anims.play(this.eType + 'run', true);
                else {
                    this.resetEnemyFrameToIddle(_enemy);
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