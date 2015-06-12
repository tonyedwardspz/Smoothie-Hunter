// Bee class
EnemyBee = function(_game, _x, _y){

	// create the enemy bee
	Phaser.Sprite.call(this, _game, _x, _y, 'enemy');
	_game.add.existing(this);
	_game.physics.arcade.enable(this);

	// make it play and move
	this.body.enable = true;
	this.body.collideWorldBounds = true;
	this.body.setSize(45, 80, 2, -12);
	this.anchor.setTo(0.5, 1);
	this.body.allowGravity = false;

	// control variabes
	this.isDead = false;

	// Animations
	this.animations.add('fly', Phaser.Animation.generateFrameNames('bee_fly (', 1, 8, ').png', 0), 15, true);
	this.animations.add('die', Phaser.Animation.generateFrameNames('bee_dead (', 1, 3, ').png', 0), 12, false);

	// default animations
	this.animations.play('fly');
	this.body.velocity.y = 50;
	this.body.bounce.y = 1;
	this.scale.x = -1;

	return this;
}
EnemyBee.prototype = Object.create(Phaser.Sprite.prototype);
EnemyBee.prototype.constructor = EnemyBee;

EnemyBee.prototype.killBee = function(_sfx, _game){
	this.animations.play('die');
    this.isDead = true;
    this.body.velocity.y = 0;
    this.body.bounce.y = 0;
    this.body.allowGravity = true;
}


// Bee group class
EnemyBeeGroup = function(_game, _parent, _allBees){
	Phaser.Group.call(this, _game, _parent);

	var b = null
	for (var i = 0; i < _allBees.length; i++){
		b = _allBees[i];
		this.bee = new EnemyBee(_game, b[0], b[1]);
		this.add(this.bee);
	}

}
EnemyBeeGroup.prototype = Object.create(Phaser.Group.prototype);
EnemyBeeGroup.prototype.constructor = EnemyBeeGroup;
