class gameState extends Phaser.Scene
{
    constructor()
    { //crea la escena
        super(
        {
            key:"gameState"
        });
    }
    preload()
    { //carga los assets en memoria
        this.cameras.main.setBackgroundColor("#000000");
        var rutaImg = 'assets/img/';
        //this.load.image('background1',rutaImg+'background_back.png');
        //this.load.image('background2',rutaImg+'background_frontal.png');

        //this.load.spritesheet('nave',rutaImg+'naveAnim.png',
        //{frameWidth:16,frameHeight:24});
        this.load.image('bullet', 	rutaImg+'spr_bullet_0.png');
        this.load.image('enemyBullet', 	rutaImg+'spr_enemy_bullet_0.png');
        this.load.spritesheet('enemy',rutaImg+'enemy-medium.png',
        {frameWidth:32,frameHeight:16});
        this.load.spritesheet('explosion',rutaImg+'explosion.png',
        {frameWidth:16,frameHeight:16});
        this.load.spritesheet('powerUp1',rutaImg+'spr_power_up.png',
        {frameWidth:16,frameHeight:16});
        this.load.spritesheet('powerUp2',rutaImg+'spr_power_up_2.png',
        {frameWidth:16,frameHeight:16});
        this.load.image('scoreUI',rutaImg+'spr_score_0.png');
        this.load.spritesheet('escudo',rutaImg+'spr_armor.png',
        {frameWidth: 66, frameHeight: 28});

        //---------AUDIO----------//
        this.load.setPath('assets/sounds/')
        this.load.audio('shoot','snd_shoot.mp3');
        this.load.audio('hitEnemy','snd_hit.wav');
        this.load.audio('enemyExplodes','explosion.wav');
      
    }
    create()
    { //carga los assets en pantalla desde memoria
       this.bg1 = this.add.tileSprite(0,0,config.width,config.height,'background1').setOrigin(0);
       this.bg2 = this.add.tileSprite(0,0,config.width,config.height,'background2').setOrigin(0); 

       //this.nave = this.add.sprite(config.width/2,config.height/2,'nave').setOrigin(.5).setScale(3);
       //this.nave = this.add.sprite(config.width/2,config.height*.95,'nave').setOrigin(.5).setScale(1);
       this.nave = this.physics.add.sprite(config.width/2,config.height*.95,'nave').setOrigin(.5).setScale(1);
       
       this.nave.body.collideWorldBounds = true;


        this.loadPools();
        this.loadAnimations();
        //this.loadBullets();
        //this.loadEnemies();
        //this.loadExplosions();
        this.loadSounds();

        this.cursores = this.input.keyboard.createCursorKeys();

        //this.enemy = this.physics.add.sprite(config.width/2,config.height/2,'enemy').setOrigin(.5).setScale(2);

        //Disparo automático
        
        /*
        this.shootingTimer = this.time.addEvent
        (
            {
                delay:250, //ms
                callback:this.createBullet,
                callbackScope:this,
                repeat: -1
            }
        );
        */

        //Diparo manual
        this.puedoDisparar = true;
        
        this.cursores.up.on
        (
            'down', 
            function()
            {
                if(this.puedoDisparar)
                {
                    this.createBullet();
                    this.puedoDisparar = false;
                    this.shootingTimer = this.time.addEvent
                    (
                        {
                            delay:1000, //ms
                            callback:function()
                            {
                                this.puedoDisparar = true;
                            },
                            callbackScope:this,
                            repeat: 0
                        }
                    );
                }
            }
            ,this
        );

        this.enemyTimer = this.time.addEvent
        (
            {
                delay:2000, //ms
                callback:this.createEnemy,
                callbackScope:this,
                repeat: -1
            }
        );

        

        this.physics.add.overlap
        (
            this.bullets,
            this.enemies,
            this.killEnemy,
            null,
            this
        );

        this.scoreBoxUI = this.add.sprite(config.width-5,5,'scoreUI')
        .setOrigin(1,0).setScale(.5);
        this.scoreText = this.add.text(config.width-8, 6, '00000', 
            {fontFamily: 'Arial', 
             fontSize: '10px',   
             color:'#fff' 
            })
            .setOrigin(1,0);
        
        this.nave.escudoMAX = 4;
        this.nave.escudo = this.nave.escudoMAX;
        this.escudoUI = this.add.sprite(5,5,'escudo')
        .setOrigin(0)
        .setScale(.5)
        .setFrame(this.nave.escudo);

    }

    loadSounds()
    {
        this.shoot = this.sound.add('shoot');
        this.hitEnemy = this.sound.add('hitEnemy');
        this.enemyExplodes = this.sound.add('enemyExplodes');
    }

    loadAnimations()
    {
        this.anims.create({
            key: 'standPowerUp1',
            frames: this.anims.generateFrameNumbers('powerUp1', { start: 0, end: 1 }),
            frameRate: 2,
            repeat: -1
        });
        
        this.anims.create({
            key: 'standPowerUp2',
            frames: this.anims.generateFrameNumbers('powerUp2', { start: 0, end: 1 }),
            frameRate: 2,
            repeat: -1
        });
        /*
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('nave', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
        });*/
        this.nave.anims.play('idle');
        
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('nave', { start: 2, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
		this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('nave', { start: 4, end: 5 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'idleEnemy',
            frames: this.anims.generateFrameNumbers('enemy', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'explosionAnim',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 4 }),
            frameRate: 10,
            repeat: 0,
            showOnStart:true,
            hideOnComplete:true
        });
    }

    loadPools()
    {
        this.bullets = this.physics.add.group();
        this.explosions = this.add.group();
        this.enemies = this.physics.add.group();
        this.enemyBullets = this.physics.add.group();
        this.powerUps = this.physics.add.group();
    }
  

    createExplosion(_bullet)
    {
        var _explosion = this.explosions.getFirst(false);  //Buscamos en el pool de explosiones si hay alguna reutilizable
        if(!_explosion)
        {//No hay
            console.log('Create explosion');
            _explosion = new explosionPrefab(this,_bullet.x,_bullet.y,'explosion');
            this.explosions.add(_explosion);
        }else
        {//Si hay
            console.log('Reset explosion');
            _explosion.active = true;
            _explosion.x=_bullet.x;
            _explosion.y=_bullet.y;
            _explosion.anims.play('explosionAnim');
        }        
    }

    createPowerUp(_posX, _posY,_tipo){
		var powerUp = this.powerUps.getFirst(false);
        
        if(_posX<16)
            _posX=16;
        
        if (_posX>config.width-16)
            _posX=config.width-16;

        if(!powerUp){
            //crea un powerUp nueva
			console.log('create powerUp tipo:'+_tipo); 
			powerUp = new  powerUpPrefab(this,_posX,_posY,_tipo);
            this.powerUps.add(powerUp);
            powerUp.anims.play('standPowerUp'+_tipo);
		} else{
			//reset
            powerUp.setTexture('powerUp'+_tipo,0);
            
            powerUp.active = true;
            powerUp.body.reset(_posX,_posY);
		}
		//Damos velocidad
        powerUp.tipo = _tipo;
		powerUp.body.setVelocityY(gamePrefs.POWER_UP_SPEED);
	}

    createBullet()
    {
        var _bullet = this.bullets.getFirst(false);  //Buscamos en el pool de balas si hay alguna reutilizable
        if(!_bullet)
        {//No hay
            console.log('Create Bullet');
            _bullet = new bulletPrefab(this,this.nave.x,this.nave.y,'bullet');
            this.bullets.add(_bullet);
        }else
        {//Si hay
            console.log('Reset Bullet');
            _bullet.active = true;
            _bullet.body.reset(this.nave.x,this.nave.y);
        }
        //Sea una bala nueva o una reutilizable, le damos velocidad
        _bullet.body.setVelocityY(gamePrefs.speedBullet);
        this.shoot.play();
    }

    createEnemyBullet(_enemy)
    {
        var _bullet = this.enemyBullets.getFirst(false);  //Buscamos en el pool de balas si hay alguna reutilizable
        if(!_bullet)
        {//No hay
            console.log('Create Bullet');
            _bullet = new enemyBulletPrefab(this,_enemy.x,_enemy.y,'enemyBullet');
            this.enemyBullets.add(_bullet);
        }else
        {//Si hay
            console.log('Reset Bullet');
            _bullet.active = true;
            _bullet.body.reset(_enemy.x,_enemy.y);
        }
        //Sea una bala nueva o una reutilizable, le damos velocidad
        _bullet.body.setVelocityY(gamePrefs.BULLET_ENEMY_SPEED);
        this.shoot.play();
    }

    createEnemy()
    {
        var _enemy = this.enemies.getFirst(false);  //Buscamos en el pool de enemigos si hay alguna reutilizable
        var posX = Phaser.Math.Between(16,config.width-16);
        var posY = -16;
        if(!_enemy)
        {//No hay
            console.log('Create Enemy');            
            _enemy = new enemyPrefab(this,posX,posY,'enemy');
            this.enemies.add(_enemy);
        }else
        {//Si hay
            console.log('Reset Enemy');
            _enemy.active = true;
            _enemy.body.reset(posX,posY);
            _enemy.health = 2;
        }
        //Sea un enemigo nuevo o uno reutilizable, le damos velocidad
        _enemy.body.setVelocityY(gamePrefs.speedEnemy);

        var rnd= Phaser.Math.Between(3,6);
        _enemy.shootingTimer = this.time.addEvent({
            delay:rnd*1000,
            callback:this.createEnemyBullet,
            args:[_enemy],
            callbackScope:this,
            repeat:1
        });
    }

    killEnemy(_bullet,_enemy)
    {
        //Una bala ha impactado en un enemigo
        console.log('kill');
        this.createExplosion(_bullet);
        _bullet.setActive(false);
        _bullet.x = config.width+_bullet.width;
        

        _enemy.health--;

        
        

        if(_enemy.health<=0)
        {
            //sonido de "adios enemigo"
            this.enemyExplodes.play();
            //Incrementar puntuación
            //Valorar drop de powerUp
            var rnd = Phaser.Math.Between(1,5); //20% de posibilidades de 
            if(rnd==1)
            {
                var tipo = Phaser.Math.Between(1,2);
                //console.log(tipo);
                //tocaria asegurarse que el powerup no sale cortado
                this.createPowerUp(_enemy.body.x, _enemy.body.y,tipo);
            } 




            _enemy.setActive(false);
            _enemy.x = config.width+_enemy.width;
        }else
        {
            //sonido tocado pero no hundido
            this.hitEnemy.play();
        }
        
    }

    update()
    { //actualiza assets
        this.bg1.tilePositionY -=.25;
        this.bg2.tilePositionY -=1;

        if(this.cursores.left.isDown){            			
            this.nave.anims.play('left',true);
			this.nave.body.velocity.x -=gamePrefs.speedNave;
		} else if(this.cursores.right.isDown){            
			this.nave.anims.play('right',true);           
            this.nave.body.velocity.x += gamePrefs.speedNave;        
		} else{
			this.nave.anims.play('idle',true);
			//this.nave.body.velocity.x=0;
		}

    }
}