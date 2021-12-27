class menu extends Phaser.Scene {

    constructor() {
        super({ key: "menu" });
    }

    preload() {
        this.cameras.main.setBackgroundColor("#000000");
        this.load.setPath('assets/sprites/TitleScreenSprites');
        this.load.image('background1', '/2.png');
        this.load.image('background2', '/1.png');
    }

    create() {
        this.backgroundFlipFlop = false;
        this.canChangeScene = true;
        this.bg1 = this.add.tileSprite(0, 0, 256, config.height, 'background1').setOrigin(0.03, 0);

    }

    iniciaJuego() {

    }

    // cambiaEscena()
    // {
    //     this.scene.start('gameState');
    // }

    updateBackground() {
        if (this.canChangeScene) {
            if (!this.backgroundFlipFlop) {
                this.bg1 = this.add.tileSprite(0, 0, 256, config.height, 'background1').setOrigin(0.03, 0);
            }
            else {
                this.bg1 = this.add.tileSprite(0, 0, 256, config.height, 'background2').setOrigin(0.03, 0);
            }

            this.backgroundFlipFlop = !this.backgroundFlipFlop;
            this.canChangeScene = false;
            this.changeBgTimer = this.time.delayedCall(450, this.changeBackground, [], this);
        }
    }

    changeBackground() {
        this.canChangeScene = true;
    }

    update() {
        this.updateBackground();
    }
}