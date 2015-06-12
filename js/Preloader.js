
BasicGame.Preloader = function (game) {

	this.background = null;
	this.preloadBar = null;
	this.ready = false;
};

BasicGame.Preloader.prototype = {

	preload: function () {

		//	Create preloader visuals
		this.background = this.add.tileSprite(0, 0, 1920, 1080, 'preloaderBackground');
		this.preloadBar = this.add.sprite((this.game.width/2) - 200, 400, 'preloaderBar');
  		this.backgroundColor = 0xffffff;
		this.load.setPreloadSprite(this.preloadBar);


		// load sounds and do some cool stuff
	    this.load.audio('menuMusic', [ 'assets/audio/background_music.mp3', 'assets/audio/background_music.ogg' ]);
		this.load.audio('soundBoard', [ 'assets/audio/sound_board.mp3', 'assets/audio/sound_board.ogg' ]);
		this.load.audio('jungleBoogie', [ 'assets/audio/jungle_background.mp3', 'assets/audio/jungle_background.ogg' ]);


		// Load the map
	    this.load.tilemap('level1', 'assets/level1.json', null, Phaser.Tilemap.TILED_JSON);
	    this.load.tilemap('level2', 'assets/level2.json', null, Phaser.Tilemap.TILED_JSON);
	    this.load.tilemap('level3', 'assets/level3.json', null, Phaser.Tilemap.TILED_JSON);
	    this.load.image('Tileset', 'assets/Tileset.png');


	    // Load the sprite assets
	    this.load.atlasJSONArray('hero', 'assets/hero.png', 'assets/hero.json');
	    this.load.atlasJSONArray('enemy', 'assets/enemy.png', 'assets/enemy.json');
	    this.load.atlasJSONArray('ui', 'assets/ui.png', 'assets/ui.json');


	    // load backgrounds
	    this.load.image('far-background', 'assets/far-background.png');
	    this.load.image('near-background', 'assets/near-background.png');
	},

	create: function () {

        console.log("Preload");

        var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 800, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startMainMenu, this);
	}, 

	startMainMenu: function (){
		this.state.start('MainMenu');
	}
};
