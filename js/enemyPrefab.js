class enemyPrefab extends Phaser.GameObjects.Sprite {
    constructor(_scene, _posX, _posY, _tag, _dmg, _health) {
        super(_scene, _posX, _posY, _tag);
        this.eType = _tag;
        this.scene = _scene;
        this.maxHealth = _health;
        this.dmg = _dmg;
        this.seekingWeapon = false;
        this.dmgTaken = 0;
        this.direction = 1;
        this.hasWeapon = false;
        this.init();
        this.enemyHitbox = this.scene.add.rectangle(config.width / 2 + 20, config.height * .68, 15, 10, 0xffffff, 0);
        this.scene.physics.add.existing(this.enemyHitbox);
        this.scene.physics.add.overlap(this.enemyHitbox, this.scene.player, this.scene.dmgPlayer, null, this.scene);
        this.enemyHitbox.body.enable = false;
    }

    init() {
        this.eMoveState = "AWAY"; // States: AWAY, IN_RANGE, KNOCKED_DOWN
        this.isScenearyMoving = false;
        this.followY = false;
        this.followX = false;

        this.imFighting = false;
        this.isVulnerable = true;
        this.isAttacking = false;
        this.switchLanes = false;
        //Combat
        this.maxKnockDownCounter = 3;
        this.knockDownCounter = 3;
        this.health = this.maxHealth;
        this.flipFlop = false;
    }
    preUpdate(time, delta, _enemy, _hero) {

        _enemy.depth = _enemy.y;

        if (((this.direction == 1 && _enemy.body.x - _hero.body.x > 0) || (this.direction == -1 && _enemy.body.x - _hero.body.x < 0)) && (this.eMoveState != "KNOCKED_DOWN" && this.eMoveState != "DEAD" && !this.isAttacking)) {
            _enemy.flipX = !_enemy.flipX;
            _enemy.flipHitBox(); // sets hitbox correctly
            this.direction *= -1;
        }
        super.preUpdate(time, delta);
    }
    giveWeapon() {
        this.hasWeapon = true;
        this.enemyHitbox.knockDownPlayer = true;

    }
    dropWeapon() {
        this.hasWeapon = false;
        this.enemyHitbox.knockDownPlayer = false;
    }
    takeDmg(_enemy, _attackType, _forceKnockDown = false) {
        if (this.isVulnerable && Phaser.Math.Distance.Between(0, _enemy.body.y + _enemy.body.height, 0, this.scene.player.body.y + this.scene.player.body.height) < 3) {

            switch (_attackType) {
                case 'PUNCH':
                    this.dmgTaken = 1;
                    this.scene.updateExp(20); //-->UPDATE PLAYER EXP
                    this.scene.updateScore(50); //--> UPDATE PLAYER SCORE AND HIGH SCORE
                    this.scene.punchSound.play();
                    break;
                case 'HEADBUTT':
                    this.dmgTaken = 2;
                    this.scene.updateExp(12); //-->UPDATE PLAYER EXP
                    this.scene.updateScore(700); //--> UPDATE PLAYER SCORE AND HIGH SCORE
                    this.scene.punchSound.play();
                    break;
                case 'KICK':
                    this.dmgTaken = 2;
                    this.scene.updateExp(15); //-->UPDATE PLAYER EXP
                    this.scene.updateScore(70); //--> UPDATE PLAYER SCORE AND HIGH SCORE
                    this.scene.kickSound.play();
                    break;
                default:
                    break;
            }

            if (!this.hasWeapon)
                _enemy.anims.play(this.eType + 'run', false);
            else
                _enemy.anims.play(this.eType + 'runweapon', false);
            this.health -= this.dmgTaken;
            this.isVulnerable = false;
            _enemy.body.velocity.y = 0;
            _enemy.body.velocity.x = 0;
            if (this.health > 0) {
                this.knockDownCounter--;
                if (this.knockDownCounter > 0 && !_forceKnockDown) {
                    if (!this.hasWeapon)
                        _enemy.anims.play(this.eType + 'takeDmg', true);
                    else
                        _enemy.anims.play(this.eType + 'takeDmgweapon', true);
                    if (!this.imFighting) {
                        this.imFighting = true;
                    }
                    this.attackingTimer = this.scene.time.delayedCall(gamePrefs.vulnerableTimer, this.setVulnerable, [true], this);
                }
                else {
                    this.attackingTimer = this.scene.time.delayedCall(gamePrefs.knockDownTimer, this.setVulnerable, [true], this);
                    if (this.hasWeapon) {
                        _enemy.dropWeapon();
                    }
                    _enemy.anims.play(this.eType + 'die', true);
                    this.startAFight(false);
                    this.eMoveState = "KNOCKED_DOWN";
                    this.knockDownCounter = this.maxKnockDownCounter;
                }
            }
            else {
                this.startAFight(false);
                this.eMoveState = "DEAD";
                if (this.hasWeapon) {
                    _enemy.dropWeapon();
                }
                _enemy.anims.play(this.eType + 'die', true);
                this.attackingTimer = this.scene.time.delayedCall(gamePrefs.knockDownTimer, this.scene.waveSystem.enemyDied, [this], this.scene.waveSystem);

            }
        }
    }
    setVulnerable(_bool) {
        if (this.eMoveState == "KNOCKED_DOWN" && _bool) {
            this.eMoveState = "AWAY";
            this.isEnemyDown = false;
        }
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
            this.isAttacking = true;
            if (!this.hasWeapon) {
                if (Phaser.Math.Distance.Between(0, _enemy.body.y + _enemy.body.height, 0, this.scene.player.body.y + this.scene.player.body.height) < 3) {
                    this.enemyHitbox.x = this.flipX ? _enemy.x - _enemy.width * 0.2 : _enemy.x + _enemy.width * 0.2;
                    this.enemyHitbox.y = _enemy.y - _enemy.height * 0.03;
                }
                _enemy.anims.play(this.eType + 'run', false);
                this.scene.physics.world.add(this.enemyHitbox.body); //--> Adds hitbox to the attack when pressing input
                this.scene.ePunchSound.play();
                this.flipFlop = !this.flipFlop;
                if (this.flipFlop) { //right punch
                    _enemy.setFrame(4);
                }
                else { //left punch
                    _enemy.setFrame(3);
                }

                this.enemyPunchTimer = this.scene.time.delayedCall(gamePrefs.punchDuration, this.resetEnemyFrameToIddle, [_enemy], this);
                this.attackingTimer = this.scene.time.delayedCall(gamePrefs.enemyAttackRate, this.setIsAttacking, [false], this);
            }
            else {
                _enemy.anims.play(this.eType + 'runweapon', false);
                _enemy.attackWithWeapon();
            }


        }
    }
    resetEnemyFrameToIddle(_enemy) {
        this.enemyHitbox.body.enable = false;
        if (this.eMoveState != "KNOCKED_DOWN" && this.eMoveState != "DEAD") {
            if (!this.hasWeapon)
                _enemy.setFrame(0);
            else
                _enemy.setFrame(17);
        }
    }
    resetEnemyFrameToGetUp(_enemy) {
        _enemy.setFrame(10);
    }

    changeMoveState(_newState) {
        this.eMoveState = _newState;
    }
    move(_enemy, _hero) {
        if (this.eMoveState != "KNOCKED_DOWN" && this.eMoveState != "DEAD" && this.isVulnerable && !this.isAttacking && !_hero.isDead) {

            var distanceX = Phaser.Math.Distance.Between(_enemy.body.x, 0, _hero.body.x, 0);
            var distanceY = Phaser.Math.Distance.Between(0, _enemy.body.y + _enemy.body.height, 0, _hero.body.y + _hero.body.height);

            if (distanceY > gamePrefs.heightThreshold && this.scene.isPlayerInAFight && this.imFighting) {
                this.startAFight(false);
            }
            else if ((distanceY < gamePrefs.heightThreshold) && !this.scene.isPlayerInAFight && !this.imFighting) {
                this.startAFight(true);
            }

            this.changeMoveState("AWAY");

            if ((this.imFighting || !this.scene.isPlayerInAFight)) { // Player is fighting either no one or me

                if (distanceY > 3) { // 1 pixel offset to avoid gittering
                    if (_enemy.body.y + _enemy.body.height < _hero.body.y + _hero.body.height) {// move towards player
                        _enemy.body.velocity.y = gamePrefs.enemySpeed;
                    }
                    else {
                        _enemy.body.velocity.y = -gamePrefs.enemySpeed;
                    }
                }
                else {
                    _enemy.body.velocity.y = 0;// already in Y range
                }
                if (!this.switchLanes) {

                    if ((this.hasWeapon && distanceX > gamePrefs.attackRange * 1.5) || (!this.hasWeapon && distanceX > gamePrefs.attackRange) && (distanceX > gamePrefs.forceApproachDistance || distanceY < gamePrefs.heightThreshold)) {
                        if (_enemy.body.x < _hero.body.x) {// move towards player
                            _enemy.body.velocity.x = gamePrefs.enemySpeed;
                        }
                        else {
                            _enemy.body.velocity.x = -gamePrefs.enemySpeed;
                        }
                    }
                    else if (distanceX < gamePrefs.attackRange - gamePrefs.evadeThreshold) {// too close from player, must evade
                        if (_enemy.body.x > _hero.body.x) { // Evade player
                            if (distanceX < gamePrefs.attackRange * 0.5 && _enemy.flipX != _hero.flipX) {
                                this.switchLanes = true;
                                _enemy.body.velocity.x = -gamePrefs.enemySpeed * 2.5;
                                this.switchLanesTimer = this.scene.time.delayedCall(200, this.resetSwitchLanes, [], this);
                            }
                            else
                                _enemy.body.velocity.x = gamePrefs.enemySpeed * 2.5;
                        }
                        else {
                            if (distanceX < gamePrefs.attackRange * 0.5 && _enemy.flipX != _hero.flipX) {
                                this.switchLanes = true;
                                _enemy.body.velocity.x = gamePrefs.enemySpeed * 2.5;
                                this.switchLanesTimer = this.scene.time.delayedCall(200, this.resetSwitchLanes, [], this);
                            }
                            else
                                _enemy.body.velocity.x = -gamePrefs.enemySpeed * 2.5;
                        }
                    }
                    else {
                        _enemy.body.velocity.x = 0; // here we always are in attacking range
                        if (distanceY < 3) {
                            this.changeMoveState("IN_RANGE");
                        }

                    }
                }
            }
            else { // Player is fighting someone else, I must wait

                if (this.seekingWeapon && this.scene.hasWeapon) {

                    distanceX = Phaser.Math.Distance.Between(_enemy.body.x, 0, this.scene.weapon.body.x, 0);

                    if (distanceX > 1) { // Move towards weapon

                        if (_enemy.body.x < this.scene.weapon.body.x) {
                            _enemy.body.velocity.x = gamePrefs.enemySpeed;
                        }
                        else {
                            _enemy.body.velocity.x = -gamePrefs.enemySpeed;
                        }
                    }
                    else {
                        this.body.velocity.x = 0;
                        if (_enemy.body.y + _enemy.height < this.scene.weapon.body.y + this.scene.weapon.height) { // sizes of sprites
                            _enemy.body.velocity.y = gamePrefs.enemySpeed;
                        }
                        else {
                            _enemy.body.velocity.y = -gamePrefs.enemySpeed;
                        }
                    }
                }
                else {
                    if (distanceY < gamePrefs.heightThreshold) { // Get in distance to get in when the chance is given
                        if (_enemy.body.y > _hero.body.y && _hero.body.y < this.scene.minY - 20) {
                            _enemy.body.velocity.y = gamePrefs.enemySpeed;
                        }
                        else {
                            if (_hero.body.y > this.scene.maxY + 20)
                                _enemy.body.velocity.y = -gamePrefs.enemySpeed;
                            else {
                                _enemy.body.velocity.y = gamePrefs.enemySpeed;
                            }
                        }

                    }
                    else if (distanceY > gamePrefs.heightThreshold * 1.5) { // Stay within threshold distance
                        if (_enemy.body.y < _hero.body.y) {
                            _enemy.body.velocity.y = gamePrefs.enemySpeed;
                        }
                        else {
                            _enemy.body.velocity.y = -gamePrefs.enemySpeed;
                        }
                    }
                    else {
                        _enemy.body.velocity.y = 0;
                        if (!this.switchLanes) {
                            if (distanceX > gamePrefs.attackRange * 3) { // Move towards player

                                if (_enemy.body.x < _hero.body.x) {
                                    _enemy.body.velocity.x = gamePrefs.enemySpeed;
                                }
                                else {
                                    _enemy.body.velocity.x = -gamePrefs.enemySpeed;
                                }
                            }
                            else if (distanceX < gamePrefs.attackRange * 2) { // too close from player
                                if (_enemy.body.x > _hero.body.x) { // evade
                                    _enemy.body.velocity.x = gamePrefs.enemySpeed;
                                }
                                else {
                                    _enemy.body.velocity.x = -gamePrefs.enemySpeed;
                                }
                            }
                            else {
                                _enemy.body.velocity.x = 0; // here I wait for my chance
                                this.changeMoveState("WAITING");
                                if (!this.hasWeapon)
                                    _enemy.anims.play(this.eType + 'run', false);
                                else
                                    _enemy.anims.play(this.eType + 'runweapon', false);

                            }
                        }
                        else if (distanceX > gamePrefs.forceApproachDistance) {
                            if (_enemy.body.x < _hero.body.x) {// move towards player
                                _enemy.body.velocity.x = gamePrefs.enemySpeed;
                            }
                            else {
                                _enemy.body.velocity.x = -gamePrefs.enemySpeed;
                            }
                        }
                    }
                }

            }
            if (this.eMoveState == "AWAY") {
                if (!this.hasWeapon)
                    _enemy.anims.play(this.eType + 'run', true);
                else
                    _enemy.anims.play(this.eType + 'runweapon', true);
            }
        }
        else if ((this.eMoveState == "KNOCKED_DOWN" || this.eMoveState == "DEAD") && !this.isVulnerable && !this.isEnemyDown) {
            this.isEnemyDown = true;
            _enemy.body.velocity.y = 0;
            if (_enemy.body.x > _hero.body.x) { // evade
                _enemy.body.velocity.x = gamePrefs.enemySpeed;
            }
            else {
                _enemy.body.velocity.x = -gamePrefs.enemySpeed;
            }
            if (this.eMoveState != "DEAD")
                this.getUpTimer = this.scene.time.delayedCall(500, this.getUp, [_enemy], this);
        }
        else { _enemy.body.velocity.x = 0; }

        if (this.isScenearyMoving == true) {
            if (_enemy.body.velocity.x < -gamePrefs.playerSpeed)
                _enemy.body.velocity.x = -gamePrefs.playerSpeed;
            else
                _enemy.body.velocity.x -= gamePrefs.playerSpeed;
            this.isScenearyMoving = false;
        }
        if (this.eMoveState != "DEAD") {
            if (this.scene.waveSystem.stage == 2) {
                if (_enemy.body.y < config.height / 2 + 5 && _enemy.body.y > config.height / 2 - 12 && _enemy.body.x < config.width - 75) {
                    if (_enemy.body.velocity.x + 30 > gamePrefs.enemySpeed + 30)
                        _enemy.body.velocity.x = gamePrefs.enemySpeed + 30;
                    else
                        _enemy.body.velocity.x += 30;
                }
                if (_enemy.body.x > config.width - 75 && _enemy.body.y > config.height / 2 - 12 && this.eMoveState != "DEAD") {
                    this.makeFall(_enemy);
                }
            }

            if (_enemy.body.y < this.scene.maxY - 5 && _enemy.body.velocity.y < 0) {

                _enemy.body.velocity.y = 0;
            }
            if (_enemy.body.y > this.scene.minY + 5 && _enemy.body.velocity.y > 0) {

                _enemy.body.velocity.y = 0;

            }
        }

    }
    makeFall(_enemy) {
        _enemy.anims.stop();
        _enemy.setFrame(5);
        this.isVulnerable = false;
        this.eMoveState = "DEAD";
        _enemy.body.gravity.y = 300;
        _enemy.body.collideWorldBounds = false; //--> Collision with world border walls
        this.isAttacking = false;
        this.startAFight(false);
        this.attackingTimer = this.scene.time.delayedCall(2000, this.scene.waveSystem.enemyDied, [this], this.scene.waveSystem);
    }
    resetSwitchLanes() {
        this.switchLanes = false;
    }

    getUp(_enemy) {
        this.body.velocity.x = 0;
        if (this.eMoveState == "KNOCKED_DOWN")
            this.getUpTimer = this.scene.time.delayedCall(500, this.resetEnemyFrameToGetUp, [_enemy], this);
    }
    pickUpWeapon(_enemy) {
        this.eMoveState = "KNOCKED_DOWN";
        this.body.velocity.x = 0;
    }

    startAFight(_boolean) // Start a fight makes this enemy the only one that can go hit the player like in the original DD
    {
        this.imFighting = _boolean;
        this.scene.isPlayerInAFight = _boolean;
        if (this.eType != 'williams')
            this.seekingWeapon = !_boolean;

    }


}