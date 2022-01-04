class character extends Phaser.GameObjects.Sprite {
  constructor(_scene, _posX, _posY, _tag) {
    super(_scene, _posX, _posY, _tag);

    this.scene = _scene;

    //STORES EVERY INPUT KEY WE NEED
    this.keyboardKeys = this.scene.input.keyboard.addKeys({
      a: Phaser.Input.Keyboard.KeyCodes.A
    });

    this.cursorKeys = this.scene.input.keyboard.createCursorKeys();

    this.scene.add.existing(this).setOrigin(.5);
    this.scene.physics.world.enable(this);
    this.body.setSize(16, 39, true);

    this.body.collideWorldBounds = true; //--> Collision with world border walls
    this.body.onWorldBounds = true; //--> On collision event

    this.attackHitbox = this.scene.add.rectangle(config.width / 2 + 20, config.height * .68, 15, 10, 0xffffff, 0);
    this.scene.physics.add.existing(this.attackHitbox);
    this.attackHitbox.body.enable = false;

    //#region PLAYER DATA
    this.isDead = false;
    this.level = 1;
    this.lifes = 2;
    this.health = 14;
    this.exp = 0;
    this.score = 0;
    this.canMove = true;
    this.isAttacking = false;
    this.wantsToAttack = false;
    this.attackFlipFlop = false;
    this.canAttack = true;
    this.DoOnePunch = true;
    //#endregion

    this.setFrame(1);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta)
  }

  updatePlayer() {
    this.movePlayerManager();
    this.updatePlayerHitbox();
    this.depth = this.y;
    this.attackPlayerManager();
  }

  updatePlayerHitbox() {
    if (this.anims.currentFrame != null) {
      this.body.setSize(16, 37, true).setOffset(30, 10);
    }
  }

  //KILLS PLAYER --> RESETS HIM ON SCENE AND UPDATES PROPERTIES
  kill() {
    this.lifes--;
    this.health = 14;
    this.canMove = true;
    this.body.collideWorldBounds = true;
    this.body.gravity.y = 0;
    this.isDead = false;
    this.body.reset(config.width / 10, config.height / 2 + 22);
    if (this.lifes < 0) {
      this.visible = false;
    }
  }

  //#region ATTACK
  attackPlayerManager() {

    if (Phaser.Input.Keyboard.JustDown(this.keyboardKeys.a)) {
      this.wantsToAttack = true;
    }

    if (Phaser.Input.Keyboard.JustUp(this.keyboardKeys.a)) {
      this.wantsToAttack = false;
    }

    if (!this.isAttacking && this.wantsToAttack) //65 == a
    {
      if (this.attackFlipFlop)
        this.setFrame(4)
      else
        this.setFrame(5);

      this.attackFlipFlop = !this.attackFlipFlop;
      this.punchTimer = this.scene.time.delayedCall(gamePrefs.punchDuration, function () { this.setFrame(1); }, [], this);
      this.stop();
      this.scene.punchSound.play();
      this.isAttacking = true;

      //Sets hitbox position infront of player and facing same way as player
      this.attackHitbox.x = this.flipX ? this.x - this.width * 0.2 : this.x + this.width * 0.2;
      this.attackHitbox.y = this.y - this.height * 0.1;

      this.scene.physics.world.add(this.attackHitbox.body); //--> Adds hitbox to the attack when pressing input

      this.AttackingTimer = this.scene.time.delayedCall(gamePrefs.attackRate, function () { this.isAttacking = false; }, [], this);

      // Removes hitbox of attack when attack ends
      this.HitBoxTimer = this.scene.time.delayedCall(gamePrefs.punchCollisionDuration, function () { this.attackHitbox.body.enable = false; }, [], this);
    }
  }
  //#endregion

  //#region  MOVE
  movePlayerManager() {
    this.body.setVelocity(0, 0);
    if (!this.isAttacking && this.canMove) {
      if (this.cursorKeys.down.isDown) { // down
        if (this.body.y < this.scene.minY) {
          this.body.setVelocityY(gamePrefs.playerSpeed);
          this.play('run', true);
        }
      }
      else if (this.cursorKeys.up.isDown) { // up
        if (this.body.y > this.scene.maxY) {
          this.body.setVelocityY(-gamePrefs.playerSpeed);
          this.play('run', true);
        }
      }

      if (this.cursorKeys.left.isDown) { //left
        this.body.setVelocityX(-gamePrefs.playerSpeed);
        this.play('run', true);
        this.flipX = true;
      }
      else if (this.cursorKeys.right.isDown) { // right
        this.body.setVelocityX(gamePrefs.playerSpeed);
        this.play('run', true);
        this.flipX = false;
        if (this.scene.canAdvance && (this.scene.bg1.tilePositionX < 1015 - (config.width * this.scene.numMapSubdivisions))) {
          if (this.body.x > config.width * 2 / 3) {
            this.scene.changeThumbsUp = false;
            this.scene.thumbsUpImage.visible = false
            this.scene.thumbsUpTimer.remove();
            this.scene.bg1.tilePositionX += gamePrefs.backgroundSpeed; //--> Background scroll speed
            this.body.velocity.x = 0.001;

            this.scene.waveSystem.moveAllEnemiesWhenWalking();
          }

          if (this.scene.bg1.tilePositionX > 1015 - (config.width * this.scene.numMapSubdivisions)) {
            this.scene.waveSystem.sceneMovementFinishedEvent();
          }
        }
        else {
          this.scene.canAdvance = false;
          this.scene.flipFlop = false;
        }
      }

      if (this.body.velocity.x == 0 && this.body.velocity.y == 0)
        this.setFrame(1);
    }
  }
  //#endregion
}