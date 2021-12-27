class menu extends Phaser.Scene {

    constructor() {
        super({ key: "menu" });
    }

    preload() {
        this.cameras.main.setBackgroundColor("#000000");

        //SPRITES
        this.load.setPath('assets/sprites/TitleScreenSprites');
        this.load.image('titleScreen1', '/2.png');
        this.load.image('titleScreen2', '/1.png');

        //AUDIO
        this.load.setPath("assets/sounds/");
        this.load.audio('menuMusic', 'music/menu.mp3');
    }

    create() {
        this.music = this.sound.add('menuMusic', { volume: .3, loop: true });
        this.music.play();

        this.keyboardKeys = this.input.keyboard.addKeys({
            a: Phaser.Input.Keyboard.KeyCodes.A
        });

        this.backgroundFlipFlop = false;
        this.canChangeScene = true;
        this.titleScreen = this.add.tileSprite(0, 0, 256, config.height, 'titleScreen').setOrigin(0.03, 0);
    }

    changeScene() {
        this.music.stop();
        this.scene.start('gameState');
    }

    updateBackground() {
        if (this.canChangeScene) {
            !this.backgroundFlipFlop ? this.titleScreen = this.add.tileSprite(0, 0, 256, config.height, 'titleScreen1').setOrigin(0.03, 0) :
                this.titleScreen = this.add.tileSprite(0, 0, 256, config.height, 'titleScreen2').setOrigin(0.03, 0);

            this.backgroundFlipFlop = !this.backgroundFlipFlop;
            this.canChangeScene = false;

            //Timer in ms to call function that triggers swap between backgrounds
            this.changeBgTimer = this.time.delayedCall(450, function changeBackground() { this.canChangeScene = true }, [], this);
        }
    }

    update() {
        this.updateBackground();

        //INPUT TO CHANGE SCENE--> A
        if (Phaser.Input.Keyboard.JustDown(this.keyboardKeys.a)) {
            this.changeScene();
        }
    }
}