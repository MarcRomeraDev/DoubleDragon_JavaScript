class menu extends Phaser.Scene {

    constructor() {
        super({ key: "menu" });
    }

    //LOAD ASSETS FOR WHOLE GAME SO THERE ARE NO LOADING SCREENS BETWEEN SCENES
    //WE ONLY LOAD FROM CACHE IN THE CREATE FUNCTION OF EACH SCENE
    preload() {
        //FONTS
        this.load.css('fonts', 'css/font.css');

        //#region SPRITES
        this.load.setPath("assets/sprites/");

        //MENU
        this.load.image('titleScreen1', 'TitleScreenSprites/2.png');
        this.load.image('titleScreen2', 'TitleScreenSprites/1.png');
        this.load.image('mission1bg', 'Mission1BackgroundSprites/0.png');

        //LEVEL 1
        this.load.image('background1', 'Mission1BackgroundSprites/1.png');
        this.load.spritesheet('player', 'BillySprites/CharacterSpritesheet.png', { frameWidth: 72, frameHeight: 46 });
        this.load.spritesheet('williams', 'WilliamSprites/williams.png', { frameWidth: 66, frameHeight: 39 });
        this.load.spritesheet('lindas', 'LindaSprites/lindaSpriteSheet.png', { frameWidth: 76, frameHeight: 40 });
        this.load.spritesheet('lopars', 'LoparSprites/loparSpriteSheet.png', { frameWidth: 66, frameHeight: 55 });
        this.load.image('thumbsUp', 'Props/thumbsUp.png');
        this.load.image('barrel', 'Props/OilDrum.png');
        this.load.image('whip', 'Props/WhipPurple.png');
        this.load.image('health', 'HUD/health_bar.png');
        this.load.image('heart', 'HUD/heart.png');

        //LEVEL 2
        this.load.image('background2.1', 'Mission1BackgroundSprites/2.png');
        this.load.image('background2.2', 'Mission1BackgroundSprites/3.png');
        this.load.image('background2.3', 'Mission1BackgroundSprites/4.png');
        //#endregion

        //AUDIO
        this.load.setPath("assets/sounds/");
        this.load.audio('bgMusic', 'music/mission1.mp3');
        this.load.audio('punch', 'effects/punch.ogg');
        this.load.audio('kick', 'effects/kick.ogg');
        this.load.audio('gameOver', 'music/game_over.mp3');
        this.load.audio('victoryMusic', 'music/mission_clear.mp3');
        this.load.audio('thumbsUpEffect', 'effects/thumbs_up.ogg');
        this.load.audio('levelUp', 'effects/level_up.ogg');

        //AUDIO
        this.load.setPath("assets/sounds/");
        this.load.audio('menuMusic', 'music/menu.mp3');
        this.load.audio('mission1TitleScreen', 'music/mission1_start.mp3');
    }

    create() {
        this.menuMusic = this.sound.add('menuMusic', { volume: .1, loop: true });
        this.mission1TitleScreenMusic = this.sound.add('mission1TitleScreen', { volume: .1 });
        this.menuMusic.play();

        this.keyboardKeys = this.input.keyboard.addKeys({
            a: Phaser.Input.Keyboard.KeyCodes.A
        });

        this.createBackgroundAnim();
    }

    changeScene() {
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

        this.backgroundAnim = this.add.sprite(248, config.height, 'titleScreen1').setOrigin(1).play('menu_background_change');
    }

    update() {
        //INPUT TO CHANGE SCENE--> A
        if (Phaser.Input.Keyboard.JustDown(this.keyboardKeys.a)) {
            //this.backgroundAnim.stop();
            //this.backgroundAnim.setTexture('mission1bg');
            this.menuMusic.stop();
            this.changeScene();
            //this.mission1TitleScreenMusic.on('complete', this.changeScene, this);
            //this.mission1TitleScreenMusic.play();
        }
    }
}