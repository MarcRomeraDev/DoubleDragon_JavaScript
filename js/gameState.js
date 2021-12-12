class gameState extends Phaser.Scene {
    constructor() { //crea la escena
        super(
            {
                key: "gameState"

            });

    }
    preload() { //carga los assets en memoria
        this.cameras.main.setBackgroundColor("#000000");
        var rutaImg = 'assets/img/';
        var rutaSprites = 'assets/sprites/';
        this.load.image('background1', rutaSprites + 'Mission1BackgroundSprites/1.png');
        this.load.image('player', rutaSprites + 'BillySprites/0.png');
    }


    create() { //carga los assets en pantalla desde memoria
        this.bg1 = this.add.tileSprite(0, 0, 1015, 192, 'background1').setOrigin(0);
        this.player = this.physics.add.sprite(config.width / 2, config.height * .7, 'player').setOrigin(.5);

        this.player.body.collideWorldBounds = true; //--> Collision with world border walls
        this.player.body.onWorldBounds = true; //--> On collision event

        this.input = this.input.keyboard.createCursorKeys();

        this.mapThreshold = false;
        this.flipFlop = false;
        this.numMapSubdivisions = 1015 / config.width;
        this.count = this.numMapSubdivisions / 4;
    }

    update() {
        this.physics.world.on('worldbounds', (body, up, down, left, right) => {
        });

        if (this.bg1.tilePositionX < 1015 - (config.width * this.numMapSubdivisions)) {
            this.bg1.tilePositionX += 1;
        }
        else {
            if (this.input.space.isDown) {
                if (!this.flipFlop) {
                    this.numMapSubdivisions -= this.count;
                    this.flipFlop = true;
                }
            }
        }

        if (this.input.space.isUp) {
            this.flipFlop = false;
        }

        if (this.input.left.isDown) {
            this.player.body.velocity.x -= 5
            this.player.flipX = true;
        } else if (this.input.right.isDown) {
            this.player.body.velocity.x += 5
            this.player.flipX = false;
        } else {
        }
    }
}