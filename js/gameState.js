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
        this.load.spritesheet('player', rutaSprites + 'BillySprites/character.png',{frameWidth:72,frameHeight:46});
        
       
    }
//

    create() { //carga los assets en pantalla desde memoria
        this.bg1 = this.add.tileSprite(0, 0, config.width, config.height, 'background1').setOrigin(0);
        
      //  this.player = new character(this,config.width / 2, config.height * .8,'player');
        this.player = this.physics.add.sprite(config.width / 2, config.height * .8, 'player').setOrigin(.5);
 
        this.player.body.collideWorldBounds = true;
        //this.cameras.main.startFollow(this.player);
       // this.cameras.main.setBounds(0,0,config.width, config.height);
        
        this.input = this.input.keyboard.createCursorKeys();
        this.createPlayerAnims();
    
    }
    createPlayerAnims()
    {
        this.anims.create({
            key:'run',
            frames:this.anims.generateFrameNumbers('player',{start:0,end:1}),
            frameRate:5,
            repeat:-1
        });

    }
    updatePlayerHitbox()
    {
        if(this.player.anims.currentFrame != null)
        {
            this.player.body.setSize(16,37,true).setOffset(30,10);
        }
    }
   
    movePlayerManager()
    {
    if (this.input.down.isDown) { // down
            this.player.body.velocity.y = gamePrefs.playerSpeed;
            this.player.body.velocity.x = 0;
            this.player.anims.play('run',true);
      } 
      else if (this.input.up.isDown) { // up
        this.player.body.velocity.y = -gamePrefs.playerSpeed;
        this.player.body.velocity.x = 0;
        this.player.anims.play('run',true);
     } 
        else if (this.input.left.isDown) { //left
            this.player.body.velocity.x = -gamePrefs.playerSpeed;
             this.player.flipX = true;
             this.player.body.velocity.y = 0;
             this.player.anims.play('run',true);
            
         } else if (this.input.right.isDown) { // right
             this.player.body.velocity.x = gamePrefs.playerSpeed;
             this.player.flipX = false;
             this.player.body.velocity.y = 0;
             this.player.anims.play('run',true);
       }
     else{
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;
        this.player.setFrame(0);
     }
    }
    attackPlayerManager()
    {
   // if (this.input.keyboard.isDown) { // down
    //        this.player.body.velocity.y = gamePrefs.playerSpeed;
     //       this.player.body.velocity.x = 0;
    //        this.player.anims.play('run',true);
    //  } 
     
    }
    update() {
       
        this.movePlayerManager();
        this.updatePlayerHitbox();
    }
  
}