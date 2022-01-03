class level2 extends Phaser.Scene {
    constructor() { //crea la escena
        super({ key: "level2" });
    }

    //RECIEVES DATA WHEN CREATING SCENE
    init(data) {
        this.playerData = data.player;
    }

    preload() { //carga los assets en memoria
        //SPRITES
        this.load.setPath("assets/sprites/");
        this.load.image('background2.1', 'Mission1BackgroundSprites/2.png');
        this.load.image('background2.2', 'Mission1BackgroundSprites/3.png');
        this.load.image('background2.3', 'Mission1BackgroundSprites/4.png');
    }

    updateBackground() {
        if (this.canChangeScene) {
            this.canChangeScene = false;
            this.numBackground++;
            this.background = this.add.tileSprite(0, 0, 256, 192, 'background2.' + this.numBackground).setOrigin(0);

            if (this.numBackground >= 3) {
                this.numBackground = 0;
            }

            //Timer in ms to call function that triggers swap between backgrounds
            this.changeBgTimer = this.time.delayedCall(450, function changeBackground() { this.canChangeScene = true }, [], this);
        }
    }

    //UPDATES PLAYER INFO WITH DATA RECIEVED ON SCENE CREATION
    updatePlayerData() {
        this.player.exp = this.playerData.exp;
        this.player.score = this.playerData.score;
        this.player.level = this.playerData.level;
        this.player.health = this.playerData.health;
        this.player.body.reset(config.width / 10, config.height / 2);
    }

    create() { //carga los assets en pantalla desde memoria
        this.background = this.add.tileSprite(0, 0, config.width, 192, 'background2.1').setOrigin(0.03, 0);
        this.punchSound = this.sound.add('punch');
        this.ePunchSound = this.sound.add('punch');
        this.music = this.sound.add('bgMusic', { volume: .3, loop: true });
        this.gameOverMusic = this.sound.add('gameOver', { volume: .3, loop: false });
        this.music.play();

        this.player = new character(this, config.width / 2, config.height * .7, 'player');
        this.updatePlayerData();

        this.canChangeScene = true;
        this.gameTime = 200;
        this.maxY = config.height / 3 + 5;
        this.minY = config.height / 2 + 15;

        this.numBackground = 1;

        this.gameTimer = this.time.addEvent({ delay: 1000, callback: function () { this.gameTime--; }, callbackScope: this, loop: true });

        //STORES EVERY INPUT KEY WE NEED
        this.keyboardKeys = this.input.keyboard.addKeys({
            h: Phaser.Input.Keyboard.KeyCodes.H,
            q: Phaser.Input.Keyboard.KeyCodes.Q
        });

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
            if (i > this.player.level - 1) {
                this.hearts[i].visible = false;
            }
        }
        this.createPlayerAnims();
        //this.createWilliamsAnims();
        //this.physics.add.overlap(this.player.attackHitbox, this.waveSystem.enemies, this.waveSystem.dmgEnemy, null, this.waveSystem);

        this.playerText = this.add.text(20, config.height - 20, '1P', { fontFamily: 'dd_font', fontSize: '7px' }).setOrigin(0.5).setSize(); //player
        this.expText = this.add.text(20, config.height - 12, this.player.exp, { fontFamily: 'dd_font', fontSize: '7px' }).setOrigin(0.5).setSize(); //exp
        this.timeText = this.add.text(config.width / 2 + 10, config.height - 12, 'TIME ', { fontFamily: 'dd_font', fontSize: '7px' }).setOrigin(0.5).setSize(); //game time
        this.scoreText = this.add.text(config.width - 60, config.height - 12, '1P ', { fontFamily: 'dd_font', fontSize: '7px' }).setOrigin(0.5).setSize(); //score text
        this.scoreNumbersText = this.add.text(config.width - 25, config.height - 12, this.player.score, { fontFamily: 'dd_font', fontSize: '7px' }).setOrigin(0.5).setSize(); //score num
        this.highScoreText = this.add.text(config.width - 60, config.height - 20, 'HI ', { fontFamily: 'dd_font', fontSize: '7px' }).setOrigin(0.5).setSize(); //highscore text
        this.highScoreNumbersText = this.add.text(config.width - 25, config.height - 20, this.player.score, { fontFamily: 'dd_font', fontSize: '7px' }).setOrigin(0.5).setSize(); //highscore num
        this.lifesText = this.add.text(config.width / 2 + 14, config.height - 20, 'P-2', { fontFamily: 'dd_font', fontSize: '7px' }).setOrigin(0.5).setSize(); //game time       

        //this.doorTrigger = this.add.rectangle(config.width / 2 + 40, config.height / 2 - 5, 40, 10, 0xffffff, 0);
        //this.physics.add.overlap(this.player, this.doorTrigger, this.changeScene, null, this);
    }

    updateGameTimer() {
        if (this.player.lifes >= 0) {
            this.timeText.setText('TIME ' + this.gameTime);
        }
    }

    updateExp(exp) {
        this.exp += exp;
        this.expText.setText(this.exp.toString());
    }

    updateScore() {
        this.score += 50; //SCORE EARNED DEPENDS ON ATTACK USED
        this.scoreNumbersText.setText(this.score.toString());
        this.highScoreNumbersText.setText(this.score.toString());
    }

    updateLevel() {
        if (this.exp >= 1000) {
            this.player.level++;
            this.exp = 0;
            this.expText.setText(this.exp.toString());
            this.hearts[this.player.level - 1].visible = true;
        }
    }

    createPlayerAnims() {
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('player', { start: 2, end: 3 }),
            frameRate: 5,
            repeat: -1
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

    makePlayerFall() {
        this.player.canMove = false;
        this.player.body.gravity.y = 4000;
        this.player.body.collideWorldBounds = false; //--> Collision with world border walls
        this.deathTimer = this.time.delayedCall(2000, function killPlayer() { this.player.health = 0; this.checkPlayerHealth(); }, [], this);
    }

    // makeEnemiesFall() {
    // }

    updateConveyorBelt() {
        if (this.player.body.y < config.height / 2 + 5 && this.player.body.y > config.height / 2 - 12 && this.player.body.x < config.width - 60) {
            this.player.body.velocity.x += 30;
        }
        if (this.player.body.x > config.width - 60 && this.player.body.y > config.height / 2 - 12 && !this.player.isDead) {
            this.makePlayerFall();
            this.player.isDead = true;
        }
    }

    update() {
        this.updateBackground();
        this.updateLevel();
        this.updateGameTimer();
        this.player.updatePlayer();
        this.updateConveyorBelt();

        //INPUT TO TEST RECIEVE DAMAGE
        if (Phaser.Input.Keyboard.JustDown(this.keyboardKeys.h)) {
            this.health[this.player.health - 1].visible = false;
            this.player.health--;
            this.checkPlayerHealth();
        }

        //INPUT TO TEST HEALING
        if (Phaser.Input.Keyboard.JustDown(this.keyboardKeys.q)) {
            if (this.player.health < 14) {
                this.player.health++;
                this.health[this.player.health - 1].visible = true;
                console.log("Health: ", this.player.health);
            }
        }
    }

    //CHECK IF PLAYER DIES
    checkPlayerHealth() {
        if (this.player.health <= 0) {
            this.player.kill();
            this.music.play();
            if (this.player.lifes >= 0) {
                this.lifesText.setText("P-" + this.player.lifes);
                for (var i = 0; i < this.player.health; i++) {
                    this.health[i].visible = true;
                }
            }
            else {
                this.scene.pause();
                this.music.stop();
                this.timeText.setText("GAME OVER");
                this.gameTimer.remove();
                this.gameOverMusic.on('complete', function () { this.scene.start('menu'); }, this);
                this.gameOverMusic.play();
            }
        }
    }
}