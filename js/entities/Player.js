Player = function(_game, _x, _y){

    // Create the player
    Phaser.Sprite.call(this, _game, _x, _y, 'hero');
    this.game.add.existing(this);
    this.game.physics.arcade.enable(this);

    this.body.enable = true;
    this.body.collideWorldBounds = true;
    this.body.setSize(40, 100, 2, -8);
    this.anchor.setTo(0.4, 1);
    this.body.bounce.y = 0.1;
    this.body.maxVelocity.setTo(175, 600);

    // player variables
    this.climbing = false;
    this.hurt = false;
    this.updateCycles = 0;
    this.lives = 3;
    this.acceleration = 900;
    this.jumpSpeed = -600;
    this.doubleJumpSpeed = -400;
    this.jumps = 0;
    this.jumping = false;
    this.attack = false;
    this.isAttacking = null;
    

    // Animations
    this.animations.add('idle', Phaser.Animation.generateFrameNames('idle(', 1, 4, ').png', 0), 3, true);
    this.animations.add('walk', Phaser.Animation.generateFrameNames('walk (', 1, 11, ').png', 0), 15, true);
    this.animations.add('climb', Phaser.Animation.generateFrameNames('climb (', 1, 6, ').png', 0), 6, true);
    this.animations.add('dead', Phaser.Animation.generateFrameNames('dead (', 1, 5, ').png', 0), 10, false);
    this.animations.add('hurt', Phaser.Animation.generateFrameNames('hurt (', 1, 1, ').png', 0), 1, false);
    this.animations.add('jump', Phaser.Animation.generateFrameNames('jump (', 1, 5, ').png', 0), 10, true);
    this.isAttacking = this.animations.add('slash', Phaser.Animation.generateFrameNames('slash (', 1, 7, ').png', 0), 11, false);    //this.animations.add('slash_crouch', Phaser.Animation.generateFrameNames('slash_crouch (', 0, 12, ').png', 0), 15, true);
    this.animations.add('slash_jump', Phaser.Animation.generateFrameNames('slash_jump (', 0, 12, ').png', 0), 15, false);
    this.animations.add('crouch', Phaser.Animation.generateFrameNames('crouch (', 1, 1, ').png', 0), 15, true);

    return this;
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.climb = function (sprite) {
    if (sprite == player){
        this.climbing = true;
    }
};

Player.prototype.hurtPlayer = function (player, enemy){
    if (!player.hurt){
        player.hurt = true;
        player.lives -= 1;
        localStorage.lives = player.lives;
        this.livesText.setText(player.lives);
    }
};

Player.prototype.attackCheck = function(){
        //console.log("attack!!!");
        player.attack = true;
};
