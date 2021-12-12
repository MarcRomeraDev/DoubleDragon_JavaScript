class gameState extends Phaser.Scene {
    constructor() { //crea la escena
        super(
            {
                key: "gameState"

            });

    }

    preload() { //carga los assets en memoria
        this.cameras.main.setBackgroundColor("#000000");
        this.load.setPath("assets/sprites/");
        this.load.image('background1', 'Mission1BackgroundSprites/1.png');
        this.load.spritesheet('player', 'BillySprites/character.png', { frameWidth: 72, frameHeight: 46 });
        this.load.spritesheet('healthUI', 'HUD/health.png', { frameWidth: 128, frameHeight: 28 });
    }

    create() { //carga los assets en pantalla desde memoria
        this.healthKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H);
        this.bg1 = this.add.tileSprite(0, 0, 1015, config.height, 'background1').setOrigin(0);
        this.player = this.physics.add.sprite(config.width / 2, config.height * .7, 'player').setOrigin(.5);
        this.player.body.setSize(16, 37, true).setOffset(30, 10);

        this.player.body.collideWorldBounds = true; //--> Collision with world border walls
        this.player.body.onWorldBounds = true; //--> On collision event

        this.player.health = 6;
        this.healthUI = this.add.sprite(0, 0, 'healthUI', this.player.health).setOrigin(0, -10);
        this.healthUI.scaleX = (.7);
        this.healthUI.scaleY = (.6);
        this.healthUI.setScrollFactor(0);

        this.input = this.input.keyboard.createCursorKeys();

        this.flipFlop = false;
        this.numMapSubdivisions = 1015 / config.width;
        this.count = this.numMapSubdivisions / 4;
        this.canAdvance = false;
        this.createPlayerAnims();

    }

    createPlayerAnims() {
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 1 }),
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

        if (this.input.down.isDown) { // down
            this.player.setVelocityY(gamePrefs.playerSpeed);
            this.player.play('run', true);
        }
        else if (this.input.up.isDown) { // up
            if (this.player.body.y > config.height / 2 + 10) {
                this.player.setVelocityY(-gamePrefs.playerSpeed);
                this.player.play('run', true);
            }
        }

        if (this.input.left.isDown) { //left
            this.player.setVelocityX(-gamePrefs.playerSpeed);
            this.player.play('run', true);
            this.player.flipX = true;
        }
        else if (this.input.right.isDown) { // right
            this.player.setVelocityX(gamePrefs.playerSpeed);
            this.player.play('run', true);
            this.player.flipX = false;

            if (this.canAdvance && (this.bg1.tilePositionX < 1015 - (config.width * this.numMapSubdivisions))) {
                if (this.player.body.x > config.width * 2 / 3) {
                    this.bg1.tilePositionX += .3; //--> Background scroll speed
                    this.player.body.velocity.x = 0.001;
                }
            }
            else {
                this.canAdvance = false;
                this.flipFlop = false;
            }
        }

        if (this.player.body.velocity.x == 0 && this.player.body.velocity.y == 0)
            this.player.setFrame(0);
    }

    update() {
        this.movePlayerManager();
        this.updatePlayerHitbox();

        this.physics.world.on('worldbounds', (body, up, down, left, right) => {
        });

        //INPUT TO ACTIVATE FLAG TO SCROLL BACKGROUND
        if (this.input.space.isDown) {
            if (!this.flipFlop) {
                this.numMapSubdivisions -= this.count;
                this.flipFlop = true;
                this.canAdvance = true;
            }
        }

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