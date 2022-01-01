

class gameState extends Phaser.Scene {
    constructor() { //crea la escena
        super(
            {
                key: "gameState"
            });
    }

    preload() { //carga los assets en memoria

        //FONTS
        this.load.css('fonts', 'css/font.css');

        //SPRITES
        this.load.setPath("assets/sprites/");
        this.load.image('background1', 'Mission1BackgroundSprites/1.png');
        this.load.spritesheet('player', 'BillySprites/CharacterSpritesheet.png', { frameWidth: 72, frameHeight: 46 });
        this.load.spritesheet('williams', 'WilliamSprites/williams.png', { frameWidth: 66, frameHeight: 39 });
        this.load.image('thumbsUp', 'Props/thumbsUp.png');
        this.load.image('health', 'HUD/health_bar.png');

        //AUDIO
        this.load.setPath("assets/sounds/");
        this.load.audio('bgMusic', 'music/mission1.mp3');
        this.load.audio('punch', 'effects/punch.ogg');
    }

    create() { //carga los assets en pantalla desde memoria
        this.gameTime = 200;
        this.exp = 0;
        this.score = 0;
        this.highScore = 0;

        this.timer = this.time.addEvent({ delay: 1000, callback: function () { this.gameTime--; }, callbackScope: this, loop: true });

        //STORES EVERY INPUT KEY WE NEED
        this.keyboardKeys = this.input.keyboard.addKeys({
            a: Phaser.Input.Keyboard.KeyCodes.A,
            h: Phaser.Input.Keyboard.KeyCodes.H,
            q: Phaser.Input.Keyboard.KeyCodes.Q
        });

        this.bg1 = this.add.tileSprite(0, 0, 1015, 192, 'background1').setOrigin(0);
        this.music = this.sound.add('bgMusic', { volume: .3, loop: true });
        this.punchSound = this.sound.add('punch');
        this.music.play();

        this.player = this.physics.add.sprite(config.width / 2, config.height * .7, 'player').setOrigin(.5);
        this.player.body.setSize(16, 37, true).setOffset(30, 10);

        this.thumbsUpImage = this.add.sprite(config.width - 40, config.height / 2, 'thumbsUp');
        this.changeThumbsUp = false;
        this.thumbsUpImage.visible = false

        this.player.body.collideWorldBounds = true; //--> Collision with world border walls
        this.player.body.onWorldBounds = true; //--> On collision event

        this.isPlayerInAFight = false;
        this.wantsToAttack = false;

        //Stores the sprites of the player's health
        this.health = [];
        for (var i = 0; i < 14; i++) {
            this.health[i] = this.add.sprite(40 + 4 * i, config.height - 25, 'health').setOrigin(0).setDisplaySize(3, 7);
        }
        this.player.health = this.health.length;

        this.attackHitbox = this.add.rectangle(config.width / 2 + 20, config.height * .68, 15, 10, 0xffffff, 0);
        this.physics.add.existing(this.attackHitbox);
        this.attackHitbox.body.enable = false;

        this.canAttack = true;
        this.DoOnePunch = true;

        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.attackFlipFlop = false;
        this.flipFlop = false;
        this.numMapSubdivisions = 1015 / config.width;
        this.count = this.numMapSubdivisions / 4;
        this.canAdvance = false;
        this.createPlayerAnims();
        this.createWilliamsAnims();
        this.isAttacking = false;
        this.player.setFrame(1);
        this.enemy = new enemyWilliams(this, config.width / 3, 304, 'williams', this.player, 3, 10);
        this.enemy1 = new enemyWilliams(this, config.width / 1, 304, 'williams', this.player, 3, 10);

        this.physics.add.overlap(this.attackHitbox, this.enemy, this.enemy.hit, null, this.enemy);
        this.physics.add.overlap(this.attackHitbox, this.enemy1, this.enemy1.hit, null, this.enemy1);

        //IN-GAME UI TEXT
        this.playerText = this.add.text(20, config.height - 20, '1P', { fontFamily: 'dd_font', fontSize: '7px' }).setOrigin(0.5).setSize(); //player
        this.expText = this.add.text(20, config.height - 12, this.exp, { fontFamily: 'dd_font', fontSize: '7px' }).setOrigin(0.5).setSize(); //exp
        this.timeText = this.add.text(config.width / 2 + 10, config.height - 12, 'TIME ', { fontFamily: 'dd_font', fontSize: '7px' }).setOrigin(0.5).setSize(); //time
        this.scoreText = this.add.text(config.width - 60, config.height - 12, '1P ', { fontFamily: 'dd_font', fontSize: '7px' }).setOrigin(0.5).setSize(); //time
        this.scoreNumbersText = this.add.text(config.width - 25, config.height - 12, this.score, { fontFamily: 'dd_font', fontSize: '7px' }).setOrigin(0.5).setSize(); //time
        this.highScoreText = this.add.text(config.width - 60, config.height - 20, 'HI ', { fontFamily: 'dd_font', fontSize: '7px' }).setOrigin(0.5).setSize(); //time
        this.highScoreNumbersText = this.add.text(config.width - 25, config.height - 20, this.score, { fontFamily: 'dd_font', fontSize: '7px' }).setOrigin(0.5).setSize(); //time
    }

    updateGameTimer() {
        this.timeText.setText('TIME ' + this.gameTime);
    }

    updateExp() {
        this.exp += 20;
        this.timeText.setText('TIME ' + this.gameTime);
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

    updatePlayerHitbox() {
        if (this.player.anims.currentFrame != null) {
            this.player.body.setSize(16, 37, true).setOffset(30, 10);
        }
    }

    movePlayerManager() {
        this.player.setVelocity(0, 0);
        if (!this.isAttacking) {
            if (this.cursorKeys.down.isDown) { // down
                if (this.player.body.y < 2 / 3 * config.height + 5) {
                    this.player.setVelocityY(gamePrefs.playerSpeed);
                    this.player.play('run', true);
                }
            }
            else if (this.cursorKeys.up.isDown) { // up
                if (this.player.body.y > config.height / 2) {
                    this.player.setVelocityY(-gamePrefs.playerSpeed);
                    this.player.play('run', true);
                }
            }

            if (this.cursorKeys.left.isDown) { //left
                this.player.setVelocityX(-gamePrefs.playerSpeed);
                this.player.play('run', true);
                this.player.flipX = true;
            }
            else if (this.cursorKeys.right.isDown) { // right
                this.player.setVelocityX(gamePrefs.playerSpeed);
                this.player.play('run', true);
                this.player.flipX = false;
                if (this.canAdvance && (this.bg1.tilePositionX < 1015 - (config.width * this.numMapSubdivisions))) {
                    if (this.player.body.x > config.width * 2 / 3) {
                        this.changeThumbsUp = false;
                        this.thumbsUpImage.visible = false
                        this.bg1.tilePositionX += .5; //--> Background scroll speed
                        this.player.body.velocity.x = 0.001;
                    }
                }
                else {
                    this.canAdvance = false;
                    this.flipFlop = false;
                }
            }

            if (this.player.body.velocity.x == 0 && this.player.body.velocity.y == 0)
                this.player.setFrame(1);
        }
    }
    iddlePlayer() {
        this.player.setFrame(1);
        this.attackHitbox.body.enable = false; //--> Removes hitbox of attack when attack ends
    }

    attackPlayerManager() {

        if (Phaser.Input.Keyboard.JustDown(this.keyboardKeys.a)) {
            this.wantsToAttack = true;
        }
        if (Phaser.Input.Keyboard.JustUp(this.keyboardKeys.a)) {
            this.wantsToAttack = false;
        }

        if (!this.isAttacking && this.wantsToAttack) //65 == a
        {
            if (this.attackFlipFlop)
                this.player.setFrame(4)
            else
                this.player.setFrame(5);

            this.attackFlipFlop = !this.attackFlipFlop;
            this.punchTimer = this.time.delayedCall(gamePrefs.punchDuration, this.iddlePlayer, [], this);
            this.player.stop();
            this.punchSound.play();
            this.isAttacking = true;

            //Sets hitbox position infront of player and facing same way as player
            this.attackHitbox.x = this.player.flipX ? this.player.x - this.player.width * 0.2 : this.player.x + this.player.width * 0.2;
            this.attackHitbox.y = this.player.y - this.player.height * 0.1;

            this.physics.world.add(this.attackHitbox.body); //--> Adds hitbox to the attack when pressing input

            this.AttackingTimer = this.time.delayedCall(gamePrefs.attackRate, this.resetAttackTimer, [], this);
        }
    }

    resetAttackTimer() {
        this.isAttacking = false;
    }

    updateThumbsUp() {
        if (this.changeThumbsUp) {
            !this.thumbsUpFlipFlop ? this.thumbsUpImage.visible = true : this.thumbsUpImage.visible = false;
            this.thumbsUpFlipFlop = !this.thumbsUpFlipFlop;
            this.changeThumbsUp = false;

            //Timer in ms to call function that triggers swap between backgrounds
            this.thumbsUpTimer = this.time.delayedCall(450, function changeThumbsUpVisibility() { this.changeThumbsUp = true }, [], this);
        }
    }

    update(time, delta) {
        this.updateGameTimer();
        this.movePlayerManager();
        this.updatePlayerHitbox();
        this.attackPlayerManager();
        this.physics.world.on('worldbounds', (body, up, down, left, right) => {
        });

        //INPUT TO ACTIVATE FLAG TO SCROLL BACKGROUND
        if (this.cursorKeys.space.isDown) {
            if (!this.flipFlop) {
                this.numMapSubdivisions -= this.count;
                this.flipFlop = true;
                this.canAdvance = true;
                this.changeThumbsUp = true;
                this.thumbsUpFlipFlop = false;
            }
        }

        this.updateThumbsUp();

        //INPUT TO TEST RECIEVE DAMAGE
        if (Phaser.Input.Keyboard.JustDown(this.keyboardKeys.h)) {
            this.health[this.player.health - 1].visible = false;
            this.player.health--;
            console.log("Health: ", this.player.health);
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
            this.player.body.reset(config.width / 10, config.height * .7);
            this.player.health = 14;
            for (var i = 0; i < this.player.health; i++) {
                this.health[i].visible = true;
            }
        }
    }
}