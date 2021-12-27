class menu extends Phaser.Scene {

    constructor() {
        super({ key: "menu" });
    }

    preload() {
        this.cameras.main.setBackgroundColor("#000000");
        this.load.setPath('assets/sprites/TitleScreenSprites');
        this.load.image('titleScreen1', '/2.png');
        this.load.image('titleScreen2', '/1.png');
    }

    create() {
        this.keyboardKeys = this.input.keyboard.addKeys({
            a: Phaser.Input.Keyboard.KeyCodes.A
        });

        this.backgroundFlipFlop = false;
        this.canChangeScene = true;
        this.titleScreen = this.add.tileSprite(0, 0, 256, config.height, 'titleScreen').setOrigin(0.03, 0);

    }

    changeScene() {
        this.scene.start('gameState');
    }

    updateBackground() {
        if (this.canChangeScene) {
            !this.backgroundFlipFlop ? this.titleScreen = this.add.tileSprite(0, 0, 256, config.height, 'titleScreen1').setOrigin(0.03, 0) :
                this.titleScreen = this.add.tileSprite(0, 0, 256, config.height, 'titleScreen2').setOrigin(0.03, 0);

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
        if (Phaser.Input.Keyboard.JustDown(this.keyboardKeys.a)){
            this.changeScene();
        }        
    }
}