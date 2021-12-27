

class gameState extends Phaser.Scene {
    constructor() { //crea la escena
        super(
            {
                key: "gameState"

            });
    }

    preload() { //carga los assets en memoria
        this.cameras.main.setBackgroundColor("#000000");

        //SPRITES
        this.load.setPath("assets/sprites/");
        this.load.image('background1', 'Mission1BackgroundSprites/1.png');
        this.load.spritesheet('player', 'BillySprites/CharacterSpritesheet.png', { frameWidth: 72, frameHeight: 46 });
        this.load.spritesheet('healthUI', 'HUD/health.png', { frameWidth: 128, frameHeight: 28 });
        this.load.image('thumbsUp', 'Props/thumbsUp.png');

        //AUDIO
        this.load.setPath("assets/sounds/");
        this.load.audio('bgMusic', 'music/mission1.mp3');
        this.load.audio('punch', 'effects/punch.ogg');
    }

    create() { //carga los assets en pantalla desde memoria
        this.bg1 = this.add.tileSprite(0, 0, 1015, 192, 'background1').setOrigin(0);
        this.music = this.sound.add('bgMusic', { volume: .3, loop: true });
        this.punchSound = this.sound.add('punch');
        this.music.play();
        this.healthKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H);
        this.player = this.physics.add.sprite(config.width / 2, config.height * .7, 'player').setOrigin(.5);
        this.player.body.setSize(16, 37, true).setOffset(30, 10);

        this.thumbsUpImage = this.add.sprite(config.width - 40, config.height / 2, 'thumbsUp').setOrigin(.5);
        this.changeThumbsUp = false;
        this.thumbsUpImage.visible = false

        this.player.body.collideWorldBounds = true; //--> Collision with world border walls
        this.player.body.onWorldBounds = true; //--> On collision event

        this.player.health = 6;
        this.healthUI = this.add.sprite(0, 0, 'healthUI', this.player.health).setOrigin(0, -12);
        this.healthUI.scaleX = (.7);
        this.healthUI.scaleY = (.6);
        this.healthUI.setScrollFactor(0);
        this.attackHitbox = this.add.rectangle(config.width / 2 + 20, config.height * .68, 15, 10, 0xffffff, 0);
        this.physics.add.existing(this.attackHitbox);
        this.physics.world.remove(this.attackHitbox.body);

        this.canAttack = true;

        this.DoOnePunch = true;
        this.keyboardKeys = this.input.keyboard.addKeys({
            a: Phaser.Input.Keyboard.KeyCodes.A
        });
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.attackFlipFlop = false;
        this.flipFlop = false;
        this.numMapSubdivisions = 1015 / config.width;
        this.count = this.numMapSubdivisions / 4;
        this.canAdvance = false;
        this.createPlayerAnims();
        this.isAttacking = false;
        this.player.setFrame(1);

        // this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A, false)
        // this.input.keyboard.on("keydown_A", (e) => {
        //     this.attackPlayerManager();
        //  });
        //var combo = this.input.keyboard.createCombo()
        //  this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        //this.keyB = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    }

    createPlayerAnims() {
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('player', { start: 2, end: 3 }),
            frameRate: 5,
            repeat: -1
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
    attackPlayerManager() {
        if (Phaser.Input.Keyboard.JustDown(this.keyboardKeys.a) && !this.isAttacking) {

            if (this.attackFlipFlop)
                this.player.setFrame(4)
            else
                this.player.setFrame(5);

            this.physics.world.add(this.attackHitbox.body); //--> Adds hitbox to the attack when pressing input

            this.attackFlipFlop = !this.attackFlipFlop;

            this.player.stop();
            this.punchSound.play();
            this.isAttacking = true;

            //Sets hitbox position infront of player and facing same way as player
            this.attackHitbox.x = this.player.flipX ? this.player.x - this.player.width * 0.2 : this.player.x + this.player.width * 0.2;
            this.attackHitbox.y = this.player.y - this.player.height * 0.1;

            this.physics.world.remove(this.attackHitbox.body); //--> Removes hitbox of attack when attack ends
        }
        if (Phaser.Input.Keyboard.JustUp(this.keyboardKeys.a)) {
            this.isAttacking = false;
        }
    }
    resetAttackTimer() {

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
        if (Phaser.Input.Keyboard.JustDown(this.healthKey)) {
            this.player.health--;
            this.healthUI.setFrame(this.player.health);
            this.checkPlayerHealth();
        }
    }

    checkPlayerHealth() {
        if (this.player.health <= 0) {
            this.player.body.reset(config.width / 10, config.height * .7);
            this.player.health = 6;
            this.healthUI.setFrame(this.player.health);
        }
    }
}