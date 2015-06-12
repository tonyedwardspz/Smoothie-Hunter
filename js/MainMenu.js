
BasicGame.MainMenu = function (game) {	
	
	this.menuMusic;
	this.menuItems;
	this.hog;
};

BasicGame.MainMenu.prototype = {

	init: function(menuMusic) {
		// start the menu music as ealy as possible
		if (!menuMusic){
			this.menuMusic = this.game.add.audio('menuMusic');
	        this.menuMusic.loop = true;
	        this.menuMusic.volume = 1;
	        this.menuMusic.play();
	    } else {
	    	this.menuMusic = menuMusic;
	    }
   	},

	create: function () {

        console.log("Main menu");

        this.menuItems = this.game.add.group();

        // set the backgrounds
        this.farBackground = this.game.add.sprite(0, 0, 'far-background');
        this.nearBackground = this.game.add.sprite(0,0, 'near-background');

        // holder for the buttons
        this.title = this.game.add.sprite((this.game.width/2) - 272, 30, 'ui', 'startmenu.png');
        this.menuItems.add(this.title);

        // add action buttons
        this.startButton = this.game.add.button(this.game.width/2, 425, 'ui', this.startClick, this, 'play.png', 'play.png', 'play.png');
        this.startButton.anchor.setTo(0.5, 0.5);
        this.menuItems.add(this.startButton);
        this.instructionsButton = this.game.add.button(this.game.width/2, 525, 'ui', this.showInstructions, this, 'instructions.png', 'instructions.png', 'instructions.png');
        this.instructionsButton.anchor.setTo(0.5, 0.5);
        this.menuItems.add(this.instructionsButton);

        // bring buttons / holder to the front
        this.game.world.bringToTop(this.menuItems);

        // random hog
        this.hog = new EnemyHog(this.game, this.game.rnd.integerInRange(20, 800), 778);
	
		// reset the scores
        localStorage.lives = 3;
		localStorage.score = 0;
		if (!localStorage.highScore){ localStorage.highScore = 0}
	},

	update: function () {

		//	Spin the hog around
		if(this.hog.body.velocity.x <= 0){
            this.hog.scale.x = -1;
            return
        } else{
            this.hog.scale.x = 1;
            return;
        }
	},

	resize: function (width, height) {

		//	If the game container is resized this function will be called automatically.
		//	You can use it to align sprites that should be fixed in place and other responsive display things.
	},
	
	startClick: function(){
		// basic fade into the game
		var tween = this.add.tween(this.menuItems).to({ alpha: 0.05 }, 1000, Phaser.Easing.Linear.none, true);
            tween.onComplete.add(this.startGame, this);
	}, 

	showInstructions: function(){
		this.menuItems.destroy();
		this.hog.destroy();		

		this.state.start('InstructionsMenu',false, false, this.menuMusic);
	},
	
	startGame: function(){
		this.menuItems.destroy();
		this.hog.destroy();

		this.state.start('Game',false, false, this.menuMusic);
	}
};
