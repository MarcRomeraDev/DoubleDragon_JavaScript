class menu extends Phaser.Scene {

    constructor() {
        super({ key: "menu" });
    }

    preload() {
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

        this.createBackgroundAnim();
    }

    changeScene() {
        this.music.stop();
        this.scene.start('gameState');
    }

    createBackgroundAnim() {
        this.anims.create({
            key: 'menu_background_change',
            frames: [
                { key: 'titleScreen1' },
                { key: 'titleScreen2' }
            ],
            frameRate: 2,
            repeat: -1
        });

        this.add.sprite(256, config.height, 'titleScreen1').setOrigin(1.03, 1).play('menu_background_change');
    }

    update() {
        //INPUT TO CHANGE SCENE--> A
        if (Phaser.Input.Keyboard.JustDown(this.keyboardKeys.a)) {
            this.changeScene();
        }
    }
}