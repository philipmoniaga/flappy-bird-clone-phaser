var game = new Phaser.Game(400, 490, Phaser.AUTO, 'gamediv');

var mainState = {

    preload : function() {
        game.stage.backgroundColor = '#71c5cf';


        game.load.image('pipe', 'assets/pipe.png');  
        game.load.spritesheet('bird', 'assets/bird.png',276/3,64);
    },

    create : function() {
        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.bird = this.game.add.sprite(100, 245, 'bird');
        this.bird.scale.x = 0.5;
        this.bird.scale.y = 0.5;

        this.bird.animations.add('fly');

        this.bird.animations.play('fly', 15, true);
        this.bird.anchor.setTo(-0.2, 0.5);  
        game.physics.arcade.enable(this.bird);

        this.bird.body.gravity.y = 1000;

        var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);

        this.pipes = game.add.group(); 
        this.pipes.enableBody = true;  
        this.pipes.createMultiple(20, 'pipe');  

        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);  
        this.score = 0;  
        this.labelScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });  

    },

    update : function() {
        if (this.bird.inWorld == false) {
            this.restartGame();
        }
        if (this.bird.angle < 20) {
            this.bird.angle += 1;
        }
        game.physics.arcade.overlap(this.bird, this.pipes, this.restartGame, null, this);  
    },

    jump : function() {

        this.bird.body.velocity.y = -350;
        var animations = game.add.tween(this.bird);
        animations.to({angle: -20},100);
        animations.start();
    },

    restartGame : function() {
        game.state.start('main');
    },

    addOnePipe : function(x,y) {
        var pipe = this.pipes.getFirstDead();

        pipe.reset(x,y);

        pipe.body.velocity.x = -200;

        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },

    addRowOfPipes: function() {  
    this.score += 1;  
    this.labelScore.text = this.score;  
    var hole = Math.floor(Math.random() * 5) + 1;

    for (var i = 0; i < 8; i++)
        if (i != hole && i != hole + 1) 
            this.addOnePipe(400, i * 60 + 10);   
    },


}

game.state.add('main',mainState);
game.state.start('main');