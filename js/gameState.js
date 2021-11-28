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
        this.bg1 = this.add.tileSprite(0, 0, config.width, config.height, 'background1').setOrigin(0);
        this.player = this.physics.add.sprite(config.width / 2, config.height * .8, 'player').setOrigin(.5);

        this.player.body.collideWorldBounds = true;
        this.input = this.input.keyboard.createCursorKeys();
    }

    update() {
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