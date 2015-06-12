Fruit = function(_game, _x, _y, _fruitType) {

    // give this fruit life
    Phaser.Sprite.call(this, _game, _x, _y, 'ui', 'fruit (' + _fruitType + ').png');
    _game.physics.arcade.enable(this);
     this.body.enable = true;
    this.body.allowGravity = false;

};
Fruit.prototype = Object.create(Phaser.Sprite.prototype);
Fruit.prototype.constructor = Fruit;

FruitGroup = function( _game, _parent, _allFruits){
	Phaser.Group.call(this, _game, _parent);

	var f = null;
	for (var i = 0; i < _allFruits.length; i++){
		f = _allFruits[i];
		this.fruit = new Fruit(_game, f[0], f[1], f[2]);
		this.add(this.fruit);
	}

};
FruitGroup.prototype = Object.create(Phaser.Group.prototype);
FruitGroup.prototype.constructor = FruitGroup;