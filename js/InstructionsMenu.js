
BasicGame.InstructionsMenu = function (game) {	
	
	this.menuMusic;
	this.menuItems;
};

BasicGame.InstructionsMenu.prototype = {

	init: function(menuMusic) {
		// start the menu music as ealy as possible
  		this.menuMusic = menuMusic;
   	},

	create: function () {

        console.log("Instructions menu");

        this.menuItems = this.game.add.group();

        // set the backgrounds
        this.farBackground = this.game.add.sprite(0, 0, 'far-background');
        this.nearBackground = this.game.add.sprite(0,0, 'near-background');

        // holder for the buttons
        this.title = this.game.add.sprite((this.game.width/2) - 272, 30, 'ui', 'instructionsPanel.png');
        this.menuItems.add(this.title);

        // add action buttons
        this.mainMenuButton = this.game.add.button(this.game.width/2, 600, 'ui', this.menuClick, this, 'mainMenu.png', 'mainMenu.png', 'mainMenu.png');
        this.mainMenuButton.anchor.setTo(0.5, 0.5);
        this.menuItems.add(this.mainMenuButton);

        // bring buttons / holder to the front
        this.game.world.bringToTop(this.menuItems);
	},

	update: function () {

		//	Do some nice funky main menu effect here

	},

	resize: function (width, height) {

		//	If the game container is resized this function will be called automatically.
		//	You can use it to align sprites that should be fixed in place and other responsive display things.

	},
	
	menuClick: function(){
		// basic fade into the game
		this.state.start('MainMenu', false, false, this.menuMusic);
	}
};
