var BasicGame = {};

SH = {
    current_level: 1,
};

BasicGame.Boot = function (game) {

};

BasicGame.Boot.prototype = {

    init: function () {

        //  Unless you specifically know your game needs to support multi-touch I would recommend setting this to 1
        this.input.maxPointers = 1;

        //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
        this.stage.disableVisibilityChange = true;

        //  This tells the game to resize the renderer to match the game dimensions (i.e. 100% browser width / height)
        this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true; 
        this.scale.refresh();

        // Add reset of the game states
        this.state.add('Preloader', BasicGame.Preloader);
        this.state.add('MainMenu', BasicGame.MainMenu);
        this.state.add('Game', BasicGame.Game);
        this.state.add('GameOverMenu', BasicGame.GameOverMenu);
        this.state.add('InstructionsMenu', BasicGame.InstructionsMenu)
    },

    preload: function () {

        //  Here we load the assets required for our preloader (in this case a background and a loading bar)
        this.load.image('preloaderBackground', 'assets/background.jpg');
        this.load.image('preloaderBar', 'assets/preloader/bar.png');
    },

    create: function () {

        console.log("Booting");
        this.state.start('Preloader');
    }

};
