// Hog class
EnemyHog = function(_game, _x, _y) {

    // Create the EnemyHog
    Phaser.Sprite.call(this, _game, _x, _y, 'enemy');
    _game.add.existing(this);
    _game.physics.arcade.enable(this);

    // make it play and move
    this.body.enable = true;
    this.body.collideWorldBounds = true;
    this.body.setSize(70, 70, 2, -8);
    this.body.bounce.x = 1;
    this.anchor.setTo(0.5, 1);

    // control variables
    this.isDead = false;

    // Animations
    //this.animations.add('idle', Phaser.Animation.generateFrameNames('boar_idle (', 1, 4, ').png', 0), 6, true);
    this.animations.add('die', Phaser.Animation.generateFrameNames('boar_dead (', 1, 4, ').png', 0), 7, false);
    this.animations.add('walk', Phaser.Animation.generateFrameNames('boar_walk (', 1, 8, ').png', 0), 12, true);

    // Set default animation
    this.animations.play('walk');
    this.body.velocity.x = 100;

    return this;
};
EnemyHog.prototype = Object.create(Phaser.Sprite.prototype);
EnemyHog.prototype.constructor = EnemyHog;

EnemyHog.prototype.walking = function(){
    this.body.velocity.x = 120;
}

EnemyHog.prototype.reverseWalking = function(){
    console.log("reverse walking");
    this.body.velocity.x *= 1;
}

EnemyHog.prototype.makeSausages = function(){

    this.animations.stop('walk');
    this.animations.play('die');
    this.isDead = true;
    this.body.velocity.x = 0;
    this.events.onAnimationComplete.add(function(){
        this.kill();
    }, this);

}


// Create the hogs defined in the levels json file
EnemyHogGroup = function( _game, _parent, _allHogs){
    Phaser.Group.call(this, _game, _parent)

    var h = null;
    for (var i = 0; i < _allHogs.length; i++){
        h = _allHogs[i];
        this.hog = new EnemyHog(_game, h[0], h[1]);
        this.add(this.hog);
    }
};
EnemyHogGroup.prototype = Object.create(Phaser.Group.prototype);
EnemyHogGroup.prototype.constructor = EnemyHogGroup;
