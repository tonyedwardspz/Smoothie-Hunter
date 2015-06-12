
BasicGame.Game = function (game) {

	//	When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;		//	a reference to the currently running game
    this.add;		//	used to add sprites, text, groups, etc
    this.camera;	//	a reference to the game camera
    this.cache;		//	the game cache
    this.input;		//	the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;		//	for preloading assets
    this.math;		//	lots of useful common math operations
    this.sound;		//	the sound manager - add a sound, play one, set-up markers, etc
    this.stage;		//	the game stage
    this.time;		//	the clock
    this.tweens;    //  the tween manager
    this.state;	    //	the state manager
    this.world;		//	the game world
    this.particles;	//	the particle manager
    this.physics;	//	the physics manager
    this.rnd;		//	the repeatable random number generator
    this.map;       //  the map
    this.layer;     //  the layer the player collides with
    this.player;    //  the player object

    // UI stuff
    this.score;
    this.scoreText;
    this.livesText;
    this.style = { font: "20px Arial", fill: "#fff", align: "left" };

    // enemies and collectables
    this.hogs;
    this.enemyHogs;
    this.hogClose = false;
    this.bees;
    this.enemyBees;
    this.beeClose = false
    this.fruit;
    this.fruitCollected = 0;
    this.fruitGroup;

    // sounds
    this.menuMusic;
    this.sfx;
    this.jungleBackground;
};

BasicGame.Game.prototype = {

    init: function(menuMusic) {
        this.menuMusic = menuMusic;
        if (menuMusic){
            menuMusic.fadeOut(5000);
        }
    },

	create: function () {
        console.log('Game state')

        // get Physical
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.physics.arcade.gravity.y = 1000;


        // create the map, dependent on level
        this.farBackground = this.add.tileSprite(0,0, 2400, 768, 'far-background');
        this.nearBackground = this.add.tileSprite(0,0, 2400, 768, 'near-background');
        this.map = this.add.tilemap('level' + SH.current_level);
        this.map.addTilesetImage('terrain', 'Tileset');
        layer = this.map.createLayer('level' + SH.current_level + 'map');
        overlay = this.map.createLayer('overlay');
        layer.resizeWorld();


        // create the player
        player = new Player(this.game, 150, 680);
        this.camera.follow(player, Phaser.Camera.FOLLOW_TOPDOWN_TIGHT);
        this.setUpScoreLives();
        

        // create the sounds in game
        this.sfx = this.game.add.audio('soundBoard');
        this.sfx.alllowMultiple = true;
        this.sfx.addMarker('eatFruit', 0, 0.27);
        this.sfx.addMarker('jump', 1, 0.16);
        this.sfx.addMarker('allFruit', 2, 0.7);
        this.sfx.addMarker('slash', 23, 0.25, 1, false);
        this.sfx.addMarker('bee', 4, 0.9);
        this.sfx.addMarker('hog', 14, 22.8);
        this.sfx.addMarker('beeDead', 24, 1);
        this.sfx.addMarker('hogDead', 26, 0.75);
        this.jungleBackground = this.game.add.audio('jungleBoogie');
        this.jungleBackground.loop = true;
        this.jungleBackground.play();


        // create enemies, collectables and UI
        this.loadGroups();
        this.loadUI();
        

        // set up controls
        cursors = this.input.keyboard.createCursorKeys();
        this.jumpkey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR); // jumping / double jump
        this.jumpkey.onDown.add(this.jumpCheck, this);
        this.attackKey = this.input.keyboard.addKey(Phaser.Keyboard.C); // attack
        this.attackKey.onDown.add(player.attackCheck, this);


        // Collisions and call backs
        this.map.setCollision(this.map.tilesets[0].properties.collision, true);
        this.map.setTileIndexCallback([142,151], player.climb, player, layer);// ladder
        this.map.setTileIndexCallback(this.map.tilesets[0].properties.transitionTile, this.changeLevel, player, layer);// level switcher
    },

	update: function () {

        //console.log("X: " + Math.floor(player.body.x) + " Y: " + Math.floor(player.body.y));

        // create collisons between game items
        this.physics.arcade.collide([enemyHogs, enemyBees, player], layer );
        this.physics.arcade.overlap(fruitGroup, player, this.collectFruit, null, this);
        if (!player.hurt){
            this.physics.arcade.collide([enemyHogs, enemyBees], player, player.hurtPlayer, null, this);
        }
        

        // check some player stuff
        if (player.body.onFloor()){
             player.jumps = 0;
             player.jumping = false;
        } 
 

        // player movements (walking left / right)
        if (cursors.left.isDown && !cursors.down.isDown){
            player.body.acceleration.x = -player.acceleration;
            player.scale.x = -1;

            if (!player.jumping){
                player.animations.play('walk');
            }
        } else if (cursors.right.isDown && !cursors.down.isDown) {
            player.body.acceleration.x = player.acceleration;
            player.scale.x = 1;

            if (!player.jumping){
                player.animations.play('walk');
             }
        } else {
            player.body.acceleration.x = 0;
            player.body.velocity.x = 0;
        }


        // Player climbing and crouching
        if (cursors.up.isDown && player.climbing) {
            player.jumping = false;                
            player.body.allowGravity = false;
            player.body.velocity.y = -150;
            player.animations.play('climb');
        } else if (cursors.down.isDown && !player.jumping) {
            player.animations.play('crouch');
        }
        // reset climbing (Stops player from climing after leaving ladder)
        player.climbing = false;
        player.body.allowGravity = true; 


        // idle animation
        if (player.body.onFloor() && !cursors.down.isDown &&
            !cursors.up.isDown && !cursors.right.isDown && 
            !cursors.left.isDown && !player.climbing || player.updateCycles > 30){
            player.animations.play('idle');
        }


        // player falls into pit of doom
        if (player.y >= 730){
            this.endGame();
        }


        // player collides with enemy
        if (player.hurt){
            player.body.velocity.x = -200;
            player.updateCycles ++;
            player.animations.play('hurt');
        }


        // prevent imediate death on collision
        if (player.updateCycles > 30){
            player.body.velocity.x = 0;
            player.body.velocity.y = 0;
            player.updateCycles = 0;
            player.hurt = false;
        }


        // kill the bugger and end the game
        if(player.lives <= 0){
            player.animations.play('dead');
            this.endGame();
        }


        // Attacking
        if (player.attack == true){
            this.sfx.play('slash');
            if (player.jumping){
                player.animations.play('slash_jump');
            } else {
                player.isAttacking.play();
            }
        }


        // Check some bee stuff
        enemyBees.forEach(function(item){
            // keep the be on the straight and narrow
            if(item.body.velocity.x < 0 || item.body.velocity.x > 0){
                item.body.velocity.x = 0;
            }
            
            // check if the bee has been attacked
            if ((this.game.physics.arcade.distanceBetween(item, player) < 100) 
                                             && player.attack && !item.isDead){
                this.sfx.play('beeDead');
                this.addToScore(25);
                item.killBee();
            }

            // remove the bee from game when it hits the ground
            if (item.isDead && item.body.onFloor()){
                item.kill();
            }
        }, this);

        // check some hog stuff
        enemyHogs.forEach(function(item){

            // Enable hog patrols
            if (!this.map.getTileWorldXY((item.x + 80),(item.y + 20), 48, 48, layer)){
                item.body.velocity.x = -100;
            } else if(!this.map.getTileWorldXY((item.x - 80),(item.y + 20), 48, 48, layer)){
                item.body.velocity.x = 100;
            }

            // check for attacks on pigs
            if ((this.game.physics.arcade.distanceBetween(item, player) < 100) 
                                             && player.attack && !item.isDead){
                this.addToScore(35);
                this.sfx.play('hogDead');
                item.makeSausages();
            }

            // flip the pig when it hits a boundary
            if(item.body.velocity.x <= 0){
                item.scale.x = -1;
            } else{
                item.scale.x = 1;
            }
        }, this);


        // reset the player attack. Needs work to allow the whole animation to play
        if (player.isAttacking.isPlaying){
            player.attack = false;
        }


        // paralax the background
        this.farBackground.tilePosition.x = this.game.camera.x*0.2;
        this.nearBackground.tilePosition.x = this.game.camera.x*0.1;
	},

	quitGame: function (pointer) {
		this.state.start('MainMenu');
	},

    endGame: function(){

        // Kill everything
        this.jungleBackground.stop();
        this.fruitCollected = 0;
        layer.destroy();
        overlay.destroy();
        this.map.destroy();
        player.destroy();
        enemyHogs.destroy();
        enemyBees.destroy();
        fruitGroup.destroy();
        this.uiGroup.destroy();
        this.sfx.destroy();
        localStorage.lives = 0;

        // back to main menu
        this.state.start('GameOverMenu', false, false);
    },

    // create groups of enemies and collectables from data in JSON file
    loadGroups: function(){

        hogs = this.game.add.group();
        enemyHogs = new EnemyHogGroup(this.game, hogs, this.map.tilesets[0].properties.hogs);

        bees = this.game.add.group();
        enemyBees = new EnemyBeeGroup(this.game, bees, this.map.tilesets[0].properties.bees);

        fruit = this.game.add.group();
        fruitGroup = new FruitGroup(this.game, fruit, this.map.tilesets[0].properties.fruit);
    },

    // create the UI components (score / lives)
    loadUI: function(){
        this.uiGroup = this.game.add.group();
        this.scoreHolder = this.game.add.sprite(28, 30, 'ui', 'scoreBackground.png');
        this.scoreText = this.game.add.text(65,51,"Score: " + this.score, this.style);
        this.uiGroup.add(this.scoreHolder);
        this.uiGroup.add(this.scoreText);
        this.livesHolder = this.game.add.sprite(this.game.width - 100, 30, 'ui', 'lives.png');
        this.livesText = this.game.add.text(this.game.width - 68, 50, player.lives, this.style);
        this.uiGroup.add(this.livesHolder);
        this.uiGroup.add(this.livesText);
        this.uiGroup.fixedToCamera = true;
    },

    // level loader
    changeLevel: function(sprite){
        console.log('level transition triggered');
        enemyHogs.destroy();
        enemyBees.destroy();
        fruitGroup.destroy();

        this.fruitCollected = 0;

        if (sprite == player){
            if (SH.current_level != 3){
                SH.current_level++;
                this.game.world.setBounds(0,0,0,0);
                this.game.state.start("Game", true, false);
            } else {
                this.game.state.start('GameOverMenu', false, false);
            }
        }
    },

    // Collect a fruit
    collectFruit: function(player, fruit){
        // change to total possible score or num fruit
        this.fruitCollected++;
        this.addToScore(10);
        if (this.fruitCollected == 20){
            this.sfx.play('allFruit');
            this.addToScore(20);
        } else {
            this.sfx.play('eatFruit');
        }
        fruit.kill();
    },

    // check is the player can jump
    jumpCheck: function(){
       if (player.jumps < 2){
          this.jump();
          player.jumping = true;
          player.jumps ++;
       }
    },

    // perform the jump actions
    jump:function() {
        if (!player.attack){
            this.sfx.play('jump');
        }
        player.animations.play('jump');
        if (player.jumps == 0){
            player.body.velocity.y  = player.jumpSpeed;
        } else if (player.jumps == 1){
            player.body.velocity.y  = player.doubleJumpSpeed;
        }
    },

    // update score UI and localStorage
    addToScore: function(toAdd){
        console.log("Add to score")
        this.score += toAdd;
        localStorage.score = this.score;
        this.scoreText.setText("Score: " + this.score);
    },

    // set up lives and score
    setUpScoreLives: function(){
        if (SH.current_level == 1){
            localStorage.score = 0;
            this.score = 0;
            localStorage.lives = player.lives;
        } else {
            this.score = parseInt(localStorage.score);
            player.lives = localStorage.lives;
        }
    }
};
