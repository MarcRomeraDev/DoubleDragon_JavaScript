class level2 extends Phaser.Scene {
    constructor() { //crea la escena
        super({ key: "level2" });
    }

    //RECIEVES DATA WHEN CREATING SCENE
    init(data) {
        this.playerData = data.player;
    }

    create() { //carga los assets en pantalla desde memoria
        this.punchSound = this.sound.add('punch', { volume: .3 });
        this.ePunchSound = this.sound.add('punch', { volume: .3 });
        this.kickSound = this.sound.add('kick', { volume: .3 });
        this.music = this.sound.add('bgMusic', { volume: .1, loop: true });

        this.levelUpSound = this.sound.add('levelUp', { volume: .3 });
        this.gameOverMusic = this.sound.add('gameOver', { volume: .1, loop: false });
        this.victoryMusic = this.sound.add('victoryMusic', { volume: .1, loop: false });
        this.music.play();

        this.player = new character(this, config.width / 2, config.height * .7, 'player');
        this.initPlayerData();

        this.gameTime = 200;
        this.maxY = config.height / 3 + 5;
        this.minY = config.height / 2 + 15;
        this.flipFlop = false;
        this.numMapSubdivisions = 1015 / config.width;
        this.count = this.numMapSubdivisions / 4;
        this.canAdvance = false;
        this.gameTimer = this.time.addEvent({
            delay: 1000, callback: function () {
                this.gameTime--;
                this.timeText.setText('TIME ' + this.gameTime);
                if (this.gameTime < 0) {
                    this.player.health = 0;
                    this.checkPlayerHealth();
                }
            },
            callbackScope: this, loop: true
        });

        //STORES EVERY INPUT KEY WE NEED IN THE SENE
        this.keyboardKeys = this.input.keyboard.addKeys({
            h: Phaser.Input.Keyboard.KeyCodes.H,
            q: Phaser.Input.Keyboard.KeyCodes.Q
        });

        
        //STORES THE SPRITES OF THE PLAYER'S HEALTH
        this.health = [];
        for (var i = 0; i < 14; i++) {
            this.health[i] = this.add.sprite(40 + 4 * i, config.height - 25, 'health').setOrigin(0).setDisplaySize(3, 7);
        }
        this.player.health = this.health.length;
        
        //STORES THE SPRITES OF THE PLAYER'S HEARTS (levels)
        this.hearts = [];
        for (var i = 0; i < 3; i++) {
            this.hearts[i] = this.add.sprite(39 + 12 * i, config.height - 15, 'heart').setOrigin(0).setDisplaySize(12, 9);
            if (i > this.player.level - 1) {
                this.hearts[i].visible = false;
            }
        }
        
        this.isPlayerInAFight = false;
        this.playerVulnerable = true;
        this.createBackgroundAnim();
        this.waveSystem = new waveSystemManager(this, 2);
        this.weapon;
        this.hasWeapon = false;
        this.physics.add.overlap(this.player.attackHitbox, this.waveSystem.enemies, this.waveSystem.dmgEnemy, null, this.waveSystem);

        this.playerText = this.add.text(20, config.height - 20, '1P', { fontFamily: 'dd_font', fontSize: '7px' }).setOrigin(0.5).setSize(); //player
        this.expText = this.add.text(20, config.height - 12, this.player.exp, { fontFamily: 'dd_font', fontSize: '7px' }).setOrigin(0.5).setSize(); //exp
        this.timeText = this.add.text(config.width / 2 + 10, config.height - 12, 'TIME ' + this.gameTime, { fontFamily: 'dd_font', fontSize: '7px' }).setOrigin(0.5).setSize(); //game time
        this.scoreText = this.add.text(config.width - 60, config.height - 12, '1P ', { fontFamily: 'dd_font', fontSize: '7px' }).setOrigin(0.5).setSize(); //score text
        this.scoreNumbersText = this.add.text(config.width - 25, config.height - 12, this.player.score, { fontFamily: 'dd_font', fontSize: '7px' }).setOrigin(0.5).setSize(); //score num
        this.highScoreText = this.add.text(config.width - 60, config.height - 20, 'HI ', { fontFamily: 'dd_font', fontSize: '7px' }).setOrigin(0.5).setSize(); //highscore text
        this.highScoreNumbersText = this.add.text(config.width - 25, config.height - 20, this.player.highScore, { fontFamily: 'dd_font', fontSize: '7px' }).setOrigin(0.5).setSize(); //highscore num
        this.lifesText = this.add.text(config.width / 2 + 14, config.height - 20, 'P-2', { fontFamily: 'dd_font', fontSize: '7px' }).setOrigin(0.5).setSize(); //game time
    }

    update() {
        this.player.updatePlayer();
        this.updateLevel();
        this.updateConveyorBelt();

        //INPUT TO TEST HEALING
        if (Phaser.Input.Keyboard.JustDown(this.keyboardKeys.q)) {
            if (this.player.health < 14) {
                this.player.health++;
                this.health[this.player.health - 1].visible = true;
            }
        }
    }
    dmgPlayer(hit) {
        if (this.player.canMove) {
            //PREVENTS FROM PLAYER'S ATTACK HITBOX GENERATING AFTER GETTING HIT GLITCH
            if (this.player.headbuttAnimation != null) this.player.headbuttAnimation.off('animationupdate');
            if (this.player.kickAnimation != null) this.player.kickAnimation.off('animationupdate');

            this.player.canMove = false;

            //KNOCK DOWN TAKE DAMAGE ANIMATION
            if (hit.knockDownPlayer) {
                var direction = 1;

                if (hit.x > this.player.body.x) {
                    if (this.player.flipX) this.player.flipX = false;
                    direction = -1;
                }
                else {
                    if (!this.player.flipX) this.player.flipX = true;
                }
                this.player.isInFloor = true;
                this.player.body.velocity.x = 60 * direction;
                this.fallingAnimation = this.player.play('fall', true);

                this.fallingAnimation.on('animationupdate', function () {
                    if (this.fallingAnimation.anims.currentFrame.index < 3) {
                        return;
                    }
                    this.fallingAnimation.off('animationupdate'); //STOPS LISTENER IF ANIMATION IS IN FRAME 3
                    this.player.body.setVelocity(0);
                }, this);

                this.fallingAnimation.on('animationcomplete', function () {
                    this.getUpAnimation = this.player.play('getUp', true);
                    this.fallingAnimation.off('animationcomplete');

                    this.getUpAnimation.on('animationcomplete', function () {
                        this.player.isInFloor = false;
                        this.player.canMove = true;
                        this.getUpAnimation.off('animationcomplete');
                    }, this);
                }, this);
            }
            else {
                //NORMAL HIT TAKE DAMAGE ANIMATION
                this.recieveDmgAnimation = this.player.play('recieveDamage' + Phaser.Math.Between(1, 3), true);
                this.recieveDmgAnimation.on('animationcomplete', function () {
                    this.player.canMove = true;
                    this.recieveDmgAnimation.off('animationcomplete');
                }, this);
            }

            if (this.playerVulnerable) {
                this.vulnerabilityTimer = this.time.delayedCall(gamePrefs.knockDownTimer, function () { this.playerVulnerable = true }, [], this);
                this.playerVulnerable = false;
                this.health[this.player.health - 1].visible = false;
                this.player.health--;
                this.checkPlayerHealth();
            }
        }
    }
    //#region  UPDATES
    updateExp(exp) {
        this.player.exp += exp;
        this.expText.setText(this.player.exp);
    }

    updateScore() {
        this.player.score += 50; //SCORE EARNED DEPENDS ON ATTACK USED
        this.scoreNumbersText.setText(this.player.score);

        if (this.player.score >= this.player.highScore) {
            this.player.highScore = this.player.score;
            this.highScoreNumbersText.setText(this.player.highScore);
            localStorage.setItem('score', this.player.highScore);
        }
    }

    updateLevel() {
        if (this.player.exp >= 1000 && this.player.level < 7) {
            this.levelUpSound.play();
            this.player.level++;
            this.player.exp = 0;
            this.expText.setText(this.player.exp.toString());
            this.hearts[this.player.level - 1].visible = true;
        }
    }

    updateConveyorBelt() {
        if (this.player.body.y < config.height / 2 + 5 && this.player.body.y > config.height / 2 - 12 && this.player.body.x < config.width - 75) {
            if (this.player.body.velocity.x + 30 > gamePrefs.playerSpeed + 30)
                this.player.body.velocity.x = gamePrefs.playerSpeed + 30;
            else
                this.player.body.velocity.x += 30;
        }
        if (this.player.body.x > config.width - 75 && this.player.body.y > config.height / 2 - 12 && !this.player.isDead) {
            this.makePlayerFall();
        }
    }
    //#endregion

    //#region CREATE ANIMATIONS
    createBackgroundAnim() {
        this.anims.create({
            key: 'level2_background_change',
            frames: [
                { key: 'background2.3' },
                { key: 'background2.2' },
                { key: 'background2.1' }
            ],
            frameRate: 4,
            repeat: -1
        });

        this.add.sprite(config.width, 192, 'background2.3').setOrigin(1).play('level2_background_change');
    }
    //#endregion

    //INITIALIZES PLAYER INFO WITH DATA RECIEVED ON SCENE CREATION
    initPlayerData() {
        this.player.exp = this.playerData.exp;
        this.player.score = this.playerData.score;
        this.player.highScore = this.playerData.highScore;
        this.player.level = this.playerData.level;
        this.player.health = this.playerData.health;
        this.player.body.reset(config.width / 10, config.height / 2);
    }

    makePlayerFall() {
        this.player.anims.stop();
        this.player.setFrame(19);
        this.player.canMove = false;
        this.player.isDead = true;
        this.player.body.gravity.y = 300;
        this.player.body.collideWorldBounds = false; //--> Collision with world border walls
        this.player.isAttacking = false;
        this.deathTimer = this.time.delayedCall(2000, function () { this.player.health = 0; this.checkPlayerHealth(); }, [], this);
    }

    //CHECK IF PLAYER DIES
    checkPlayerHealth() {
        if (this.player.health <= 0) {
            this.player.kill();
            this.music.play();
            if (this.player.lifes >= 0) {
                this.gameTime = 200;
                this.lifesText.setText("P-" + this.player.lifes);
                this.timeText.setText('TIME ' + this.gameTime);
                for (var i = 0; i < this.player.health; i++) {
                    this.health[i].visible = true;
                }
            }
            else {
                this.scene.pause();
                this.music.stop();
                this.gameTimer.remove();
                this.timeText.setText("GAME OVER");
                this.gameOverMusic.on('complete', function () { this.scene.start('menu'); }, this);
                this.gameOverMusic.play();
            }
        }
    }

    victoryEvent() {
        this.scene.pause();
        this.music.stop();
        this.victoryMusic.on('complete', function () { this.scene.start('menu'); }, this);
        this.victoryMusic.play();
    }
}