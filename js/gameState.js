class gameState extends Phaser.Scene {
    constructor() { //crea la escena
        super(
            {
                key: "gameState"
            });
    }


    create() { //carga los assets en pantalla desde memoria
        this.gameTime = 200;
        this.thumbsUpTimer;
        this.maxY = config.height / 2 + 5;
        this.minY = 2 / 3 * config.height + 5;
        this.beltForce = -5;

        this.gameTimer = this.time.addEvent({
            delay: 1000, callback: function () {
                this.gameTime--;
                this.timeText.setText('TIME ' + this.gameTime);
                if (this.gameTime < 0) {
                    this.player.health = 0;
                    this.checkPlayerHealth();
                }
            },
            callbackScope: this,
            loop: true
        });

        //STORES EVERY INPUT KEY WE NEED IN THE SCENE
        this.keyboardKeys = this.input.keyboard.addKeys({
            h: Phaser.Input.Keyboard.KeyCodes.H,
            q: Phaser.Input.Keyboard.KeyCodes.Q
        });

        this.bg1 = this.add.tileSprite(0, 0, 1015, 192, 'background1').setOrigin(0);
        this.music = this.sound.add('bgMusic', { volume: .1, loop: true });
        this.punchSound = this.sound.add('punch', { volume: .3 });
        this.ePunchSound = this.sound.add('punch', { volume: .3 });
        this.kickSound = this.sound.add('kick', { volume: .3 });
        this.thumbsUpSound = this.sound.add('thumbsUpEffect', { volume: .3 });
        this.gameOverMusic = this.sound.add('gameOver', { volume: .1, loop: false });
        this.music.play();

        this.player = new character(this, config.width / 2, config.height * .7, 'player');
        this.loadPlayerData();

        this.thumbsUpImage = this.add.sprite(config.width - 40, config.height / 2, 'thumbsUp');
        this.changeThumbsUp = true;
        this.thumbsUpImage.visible = false;

        this.isPlayerInAFight = false;

        //Stores the sprites of the player's health
        this.health = [];
        for (var i = 0; i < 14; i++) {
            this.health[i] = this.add.sprite(40 + 4 * i, config.height - 25, 'health').setOrigin(0).setDisplaySize(3, 7);
        }
        this.player.health = this.health.length;

        //Stores the sprites of the player's hearts (levels)
        this.hearts = [];
        for (var i = 0; i < 3; i++) {
            this.hearts[i] = this.add.sprite(39 + 12 * i, config.height - 15, 'heart').setOrigin(0).setDisplaySize(12, 9);
            if (i > 0) {
                this.hearts[i].visible = false;
            }
        }

        this.flipFlop = false;
        this.numMapSubdivisions = 1015 / config.width;
        this.count = this.numMapSubdivisions / 4;
        this.canAdvance = false;
        this.createPlayerAnims();
        this.createWilliamsAnims();
        this.createLindasAnims();

        this.waveSystem = new waveSystemManager(this);

        this.physics.add.overlap(this.player.attackHitbox, this.waveSystem.enemies, this.waveSystem.dmgEnemy, null, this.waveSystem);

        this.playerText = this.add.text(20, config.height - 20, '1P', { fontFamily: 'dd_font', fontSize: '7px' }).setOrigin(0.5).setSize(); //player
        this.expText = this.add.text(20, config.height - 12, this.player.exp, { fontFamily: 'dd_font', fontSize: '7px' }).setOrigin(0.5).setSize(); //exp
        this.timeText = this.add.text(config.width / 2 + 10, config.height - 12, 'TIME ' + this.gameTime, { fontFamily: 'dd_font', fontSize: '7px' }).setOrigin(0.5).setSize(); //game time
        this.scoreText = this.add.text(config.width - 60, config.height - 12, '1P ', { fontFamily: 'dd_font', fontSize: '7px' }).setOrigin(0.5).setSize(); //score text
        this.scoreNumbersText = this.add.text(config.width - 25, config.height - 12, '00', { fontFamily: 'dd_font', fontSize: '7px' }).setOrigin(0.5).setSize(); //score num
        this.highScoreText = this.add.text(config.width - 60, config.height - 20, 'HI ', { fontFamily: 'dd_font', fontSize: '7px' }).setOrigin(0.5).setSize(); //highscore text
        this.highScoreNumbersText = this.add.text(config.width - 25, config.height - 20, this.player.highScore, { fontFamily: 'dd_font', fontSize: '7px' }).setOrigin(0.5).setSize(); //highscore num
        this.lifesText = this.add.text(config.width / 2 + 14, config.height - 20, 'P-2', { fontFamily: 'dd_font', fontSize: '7px' }).setOrigin(0.5).setSize(); //game time       

        this.doorTrigger = this.add.rectangle(config.width / 2 + 40, config.height / 2 + 2, 40, 10, 0xffffff, 0);

        this.physics.add.overlap(this.player, this.doorTrigger, this.changeScene, null, this);
    }

    update() {
        this.player.updatePlayer();
        this.updateLevel();

        //INPUT TO TEST RECIEVE DAMAGE
        if (Phaser.Input.Keyboard.JustDown(this.keyboardKeys.h)) {
            this.health[this.player.health - 1].visible = false;
            this.player.health--;
            this.checkPlayerHealth();
            this.changeScene();
        }

        //INPUT TO TEST HEALING
        if (Phaser.Input.Keyboard.JustDown(this.keyboardKeys.q)) {
            if (this.player.health < 14) {
                this.player.health++;
                this.health[this.player.health - 1].visible = true;
            }
        }
    }

    loadPlayerData() {
        this.player.highScore = parseInt(localStorage.getItem('score')) || '00';
    }

    //#region  UPDATES
    updateExp(exp) {
        this.player.exp += exp;
        this.expText.setText(this.player.exp);
    }

    updateScore(score) {
        this.player.score += score; //SCORE EARNED DEPENDS ON ATTACK USED
        this.scoreNumbersText.setText(this.player.score);

        if (this.player.score >= this.player.highScore) {
            this.player.highScore = this.player.score;
            this.highScoreNumbersText.setText(this.player.highScore);
            localStorage.setItem('score', this.player.highScore);
        }
    }

    updateLevel() {
        if (this.player.exp >= 1000) {
            this.player.level++;
            this.player.exp = 0;
            this.expText.setText(this.player.exp.toString());
            this.hearts[this.player.level - 1].visible = true;
        }
    }
    //#endregion

    //#region CREATE ANIMATIONS
    createPlayerAnims() {
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('player', { start: 3, end: 1 }),
            frameRate: 5,
            yoyo: true,
            repeat: -1
        });

        this.anims.create({
            key: 'kick',
            frames: this.anims.generateFrameNumbers('player', { frames: [6, 7, 7] }),
            frameRate: 10
        });

        this.anims.create({
            key: 'headbutt',
            frames: this.anims.generateFrameNumbers('player', { frames: [9, 10, 10] }),
            frameRate: 10
        });
    }

    createWilliamsAnims() {
        this.anims.create({
            key: 'williamsrun',
            frames: this.anims.generateFrameNumbers('williams', { start: 0, end: 2 }),
            frameRate: 5,
            yoyo: true,
            repeat: -1
        });
        this.anims.create({
            key: 'williamstakeDmg',
            frames: this.anims.generateFrameNumbers('williams', { start: 5, end: 7 }),
            frameRate: 5,
            yoyo: true,
            repeat: 0
        });
        this.anims.create({
            key: 'williamsdie',
            frames: this.anims.generateFrameNumbers('williams', { start: 8, end: 9 }),
            frameRate: 5,
            yoyo: false,
            repeat: 0
        });
    }
    createLindasAnims() {
        this.anims.create({
            key: 'lindasrun',
            frames: this.anims.generateFrameNumbers('lindas', { start: 0, end: 2 }),
            frameRate: 5,
            yoyo: true,
            repeat: -1
        });
        this.anims.create({
            key: 'lindasrunweapon',
            frames: this.anims.generateFrameNumbers('lindas', { start: 15, end: 17 }),
            frameRate: 5,
            yoyo: true,
            repeat: -1
        });
        this.anims.create({
            key: 'lindasattackweapon',
            frames: this.anims.generateFrameNumbers('lindas', { start: 5, end: 7 }),
            frameRate: 5,
            repeat: 0
        });
        this.anims.create({
            key: 'lindastakeDmg',
            frames: this.anims.generateFrameNumbers('lindas', { start: 11, end: 12 }),
            frameRate: 5,
            yoyo: true,
            repeat: 0
        });
        this.anims.create({
            key: 'lindastakeDmgweapon',
            frames: this.anims.generateFrameNumbers('lindas', { start: 13, end: 14 }),
            frameRate: 5,
            yoyo: true,
            repeat: 0
        });
        this.anims.create({
            key: 'lindasdie',
            frames: this.anims.generateFrameNumbers('lindas', { start: 8, end: 9 }),
            frameRate: 5,
            yoyo: false,
            repeat: 0
        });
    }
    //#endregion

    changeScene() {
        this.music.stop();
        this.scene.start('level2', {
            player: this.player //--> Pass player data to save it across scene change
        });
    }

    advanceInScene() {
        this.numMapSubdivisions -= this.count;
        this.flipFlop = true;
        this.canAdvance = true;
        if (this.changeThumbsUp) {
            this.changeThumbsUp = false;
            this.thumbsUpTimer = this.time.addEvent({
                delay: 450, callback: function () {
                    !this.thumbsUpFlipFlop ? this.thumbsUpImage.visible = true : this.thumbsUpImage.visible = false;
                    this.thumbsUpFlipFlop = !this.thumbsUpFlipFlop;
                    this.thumbsUpSound.play();
                },
                callbackScope: this,
                repeat: 3
            });
        }
        this.thumbsUpFlipFlop = false;
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
}