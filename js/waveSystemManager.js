class waveSystemManager extends Phaser.GameObjects.Sprite {
    constructor(_scene) {
        super(_scene, 0, 0, '_tag');
        this.scene = _scene;
        this.counter = 0;
        this.state = "ACTIVE"; //States: ACTIVE, WAITING,

        this.loadPools();

        this.checkEvent();
    }

    enemyDied(_enemy) {
        this.counter++;
        _enemy.active = false;
        _enemy.y = config.width + _enemy.width;
        this.checkEvent();
    }
    dmgEnemy(_hitbox, _enemy) {
        _enemy.hit();
    }
    checkEvent() {
        console.log("Event Counter: " + this.counter);
        if (this.state == "ACTIVE") {
            switch (this.counter) {
                case 0:
                    //Spawn 2 williams at start
                    this.createEnemy((config.width * 2 / 3 ) + 20, (config.height *2/ 3) + 20, 'williams');
                    this.createEnemy(config.width * 8 / 10, (config.height*2 / 3) - 20, 'williams');

                    break;
                case 1:
                    //Spawn 1 william appears
                    this.createEnemy(config.width + 50, config.height / 2, 'lindas');
                    break;
                case 3:
                    //Move Screen
                    this.scene.advanceInScene();
                    break;
                default:
            }
        }
    }
    loadPools() {
        this.enemies = this.scene.physics.add.group();
    }

    createEnemy(_posX, _posY, _type) {
        var _enemy = this.enemies.getFirst(false);  //Buscamos en el pool de enemigos si hay alguna reutilizable
        if (!_enemy) {//No hay
            console.log('Create Enemy');

            switch (_type) {
                case 'williams':
                    _enemy = new enemyWilliams(this.scene, _posX, _posY, _type, this.scene.player, 3, 10);
                    break;
                case 'lindas':
                    _enemy = new enemyWilliams(this.scene, _posX, _posY, 'williams', this.scene.player, 3, 1);
                    break;
                case 'lopars':
                    _enemy = new enemyWilliams(this.scene, _posX, _posY, 'williams', this.scene.player, 3, 100);
                    break;
                default:
                    // _enemy = new enemyWilliams(this, config.width / 3, 304, _type, this.player, 3, 10);
                    console.log('Enemy tag invalid');
                    break;
            }

            this.enemies.add(_enemy);
        } else {//Si hay
            console.log('Reset Enemy');
            if (_type != _enemy.eType) {
                switch (_type) {
                    case 'williams':
                        _enemy = new enemyWilliams(this.scene, _posX, _posY, _type, this.scene.player, 3, 10);
                        break;
                    case 'lindas':
                        _enemy = new enemyWilliams(this.scene, _posX, _posY, 'williams', this.scene.player, 3, 1);
                        break;
                    case 'lopars':
                        _enemy = new enemyWilliams(this.scene, _posX, _posY, 'williams', this.scene.player, 3, 100);
                        break;
                    default:
                        // _enemy = new enemyWilliams(this, config.width / 3, 304, _type, this.player, 3, 10);
                        console.log('Enemy tag invalid');
                        break;
                }
                this.enemies.add(_enemy);
            }
            _enemy.active = true;
            _enemy.body.reset(_posX, _posY);
            _enemy.resetEnemy();
        }

    }
    instantiateEnemy(_enemy, _type, _posX, _posY) {
        switch (_type) {
            case 'williams':
                _enemy = new enemyWilliams(this.scene, _posX, _posY, _type, this.scene.player, 3, 10);
                break;
            case 'lindas':
                _enemy = new enemyWilliams(this.scene, _posX, _posY, 'williams', this.scene.player, 3, 1);
                break;
            case 'lopars':
                _enemy = new enemyWilliams(this.scene, _posX, _posY, 'williams', this.scene.player, 3, 100);
                break;
            default:
                // _enemy = new enemyWilliams(this, config.width / 3, 304, _type, this.player, 3, 10);
                console.log('Enemy tag invalid');
                break;
        }
    }

}