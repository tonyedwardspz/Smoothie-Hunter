
BasicGame.GameOverMenu = function (game) {	
	
	this.menuMusic;
	this.score;
	this.highScore;
	this.style = { font: "29px Arial", fill: "#fff" };
};

BasicGame.GameOverMenu.prototype = {

	init: function() {
		this.finalScore();
		// start the menu music as ealy as possible
		this.menuMusic = this.game.add.audio('menuMusic');
        this.menuMusic.loop = true;
        this.menuMusic.volume = 1;
        this.menuMusic.play();
   	},

	create: function () {

        console.log("Game over menu");

        this.menuItems = this.game.add.group();

        // set the backgrounds
        this.farBackground = this.game.add.sprite(0, 0, 'far-background');
        this.nearBackground = this.game.add.sprite(0,0, 'near-background');

        // add the holder
        this.title = this.game.add.sprite((this.game.width/2) - 240, 100, 'ui', 'panel.png');
        this.menuItems.add(this.title);

        // display player scores
        this.scoreBackground = this.game.add.sprite(((this.game.width/2) - 100), 255, 'ui', 'score.png');
        this.scoreText = this.game.add.text((this.game.width/2) + 15, 269, this.score, this.style);
        this.menuItems.add(this.scoreBackground);
        this.menuItems.add(this.scoreText);

        this.highScoreBackground = this.game.add.sprite(((this.game.width/2) - 150), 330, 'ui', 'highScore.png');
        this.highScoreText = this.game.add.text((this.game.width/2) + 55, 344, this.highScore, this.style);
        this.menuItems.add(this.highScoreBackground);
        this.menuItems.add(this.highScoreText);

        // add some buttons
        this.startButton = this.game.add.button(this.game.width/2, 450, 'ui', this.startClick, this, 'playAgain.png', 'playAgain.png', 'playAgain.png');
        this.startButton.anchor.setTo(0.5, 0.5);
        this.menuItems.add(this.startButton);
        this.facebookButton = this.game.add.button(this.game.width/2, 550, 'ui', this.share, this, 'share.png', 'share.png', 'share.png');
        this.facebookButton.anchor.setTo(0.5, 0.5);
        this.menuItems.add(this.facebookButton);

        // bring buttons / holder to the front
        this.game.world.bringToTop(this.menuItems);
	},

	update: function () {

		//	Do some nice funky main menu effect here

	},

	// This game is awesome, lets share it on facebook
	share: function() {
		var winTop = (screen.height / 2) - 260;
        var winLeft = (screen.width / 2) - 175;
        window.open('http://www.facebook.com/sharer.php?s=100&p[url]=' + window.location.href, 'sharer', 
        	        'top=' + winTop + ',left=' + winLeft + ',toolbar=0,status=0,width=520,height=350');
	},
	
	startClick: function(){
		// basic fade into the game
		var tween = this.add.tween(this.menuItems).to({ alpha: 0.05 }, 1000, Phaser.Easing.Linear.none, true);
            tween.onComplete.add(this.restartGame, this);
	}, 
	
	// reset and restart the game
	restartGame: function(){
		// reset the game
		this.score = 0;
		localStorage.lives = 3;
		localStorage.score = 0;
		SH.current_level = 1;

		// destroy menu items
		this.menuItems.destroy();

		this.state.start('Game',false, false, this.menuMusic);
	},

	// Calculate final score and update local storage with high score if required
	finalScore: function () {

		if (localStorage.score){
			this.score = parseInt(localStorage.score);
		} else {
			this.score = 0;
		}

		// bonus lives score
		switch (parseInt(localStorage.lives)){
			case 3:
				this.score += 75;
				break;
			case 2:
				this.score += 50;
				break;
			case 1:
				this.score += 25;
				break;
			default:
				break;
		}

		// high score jiggery pokery
		if (localStorage.highScore){
			this.highScore = parseInt(localStorage.highScore);
			
			if (this.score > this.highScore){
				localStorage.highScore = this.score;
				this.highScore = this.score;
			}
		} else {
			this.highScore = 0;
			localStorage.highScore = this.score;
		}
	}
};
