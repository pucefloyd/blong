var animate = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback) { window.setTimeout(callback, 1000/60) 
};

var step = function() {  
    animate(step);
};

function Pong() {
    var canvas = document.getElementById("game");
    this.width = canvas.width;
    this.height = canvas.height;
    this.context = canvas.getContext("2d");
    this.context.fillStyle = "white";
    this.keys = new KeyListener();
    this.player = new Paddle(5, 0);
    this.player.y = this.height/2 - this.player.height/2;
    this.display1 = new Display(this.width/4, 25);
    
    this.computer = new Paddle(this.width - 5 - 2, 0);
    this.computer.y = this.height/2 - this.computer.height/2;
    this.display2 = new Display(this.width*3/4, 25);
    

    this.ball = new Ball();
    this.ball.x = this.width/2;
    this.ball.y = this.height/2;
    this.ball.vy = Math.floor(Math.random()*12 - 6);
    this.ball.vx = 7 - Math.abs(this.ball.vy);
}


window.onload = function() {
    animate(step);
};


Pong.prototype.render= function() {

    this.context.clearRect(0, 0, this.width, this.height);
    this.context.fillRect(this.width/2, 0, 2, this.height);
    this.context.arc(this.ball.x , this.ball.y , this.ball, 0, Math.PI*2, false);

           this.ball.render(this.context);
           this.player.render(this.context);
           this.computer.render(this.context);
           this.display1.render(this.context);
           this.display2.render(this.context);
 };          
           
Pong.prototype.update = function() {
   
  if (this.paused)
        return;

  this.ball.update();
    this.display1.value = this.player.score;
    this.display2.value = this.computer.score;

  if (this.keys.isPressed(83)) { // DOWN
        this.player.y = Math.min(this.height - this.player.height, this.player.y + 4);
    } else if (this.keys.isPressed(87)) { // UP
        this.player.y = Math.max(0, this.player.y - 4);
    }
 
  /*  if (this.keys.isPressed(40)) { // DOWN
        this.computer.y = Math.min(this.height - this.computer.height, this.computer.y + 4);
    } else if (this.keys.isPressed(38)) { // UP
        this.computer.y = Math.max(0, this.computer.y - 4);
    }*/
 if (this.ball.vx > 0) {
        if (this.computer.x <= this.ball.x + this.ball.width &&
                this.computer.x > this.ball.x - this.ball.vx + this.ball.width) {
            var collisionDiff = this.ball.x + this.ball.width - this.computer.x;
            var k = collisionDiff/this.ball.vx;
            var y = this.ball.vy*k + (this.ball.y - this.ball.vy);
            if (y >= this.computer.y && y + this.ball.height <= this.computer.y + this.computer.height) {
                // collides with right paddle
                this.ball.x = this.computer.x - this.ball.width;
                this.ball.y = Math.floor(this.ball.y - this.ball.vy + this.ball.vy*k);
                this.ball.vx = -this.ball.vx;
            }
        }
    } else {
        if (this.player.x + this.player.width >= this.ball.x) {
            var collisionDiff = this.player.x + this.player.width - this.ball.x;
            var k = collisionDiff/-this.ball.vx;
            var y = this.ball.vy*k + (this.ball.y - this.ball.vy);
            if (y >= this.player.y && y + this.ball.height <= this.player.y + this.player.height) {
                // collides with the left paddle
                this.ball.x = this.player.x + this.player.width;
                this.ball.y = Math.floor(this.ball.y - this.ball.vy + this.ball.vy*k);
                this.ball.vx = -this.ball.vx;
            }
        }
    }
 
    // Top and bottom collision
    if ((this.ball.vy < 0 && this.ball.y < 0) ||
            (this.ball.vy > 0 && this.ball.y + this.ball.height > this.height)) {
        this.ball.vy = -this.ball.vy;
    }

     if (this.ball.x >= this.width)
        this.score(this.player);
    else if (this.ball.x + this.ball.width <= 0)
        this.score(this.computer);
};

Pong.prototype.score = function(p)
{
    // player scores
    p.score++;
    var player = p == this.player ? 0 : 1;
 
    // set ball position
    this.ball.x = this.width/2;
    this.ball.y = p.y + p.height/2;
 
    // set ball velocity
    this.ball.vy = Math.floor(Math.random()*12 - 6);
    this.ball.vx = 7 - Math.abs(this.ball.vy);
    if (player == 1)
        this.ball.vx *= -1;
};
   
 
// PADDLE
function Paddle(x,y) {
    this.x = x;
    this.y = y;
    this.width = 2;
    this.height = 28;
    this.score = 0;
}

Paddle.prototype.render = function(p)
{
    p.fillRect(this.x, this.y, this.width, this.height);
};

function Ball() {
this.x = 0;
this.y = 0;
this.vx = 0;
this.vy = 0;
this.width = 6;
this.height = 6;
}

Ball.prototype.update = function()
{
    this.x += this.vx;
    this.y += this.vy;
};

Ball.prototype.render= function(p)
{
 p.fillRect(this.x, this.y, this.width, this.height);

};

function Display(x, y) {
    this.x = x;
    this.y = y;
    this.value = 0;
}
 
Display.prototype.render = function(p)
{
    p.fillText(this.value, this.x, this.y);
};

function KeyListener() {
    this.pressedKeys = [];
 
    this.keydown = function(e) {
        this.pressedKeys[e.keyCode] = true;
    };
 
    this.keyup = function(e) {
        this.pressedKeys[e.keyCode] = false;
    };
 
    window.addEventListener("keydown", this.keydown.bind(this));
    window.addEventListener("keyup", this.keyup.bind(this));
}
 
KeyListener.prototype.isPressed = function(key)
{
    return this.pressedKeys[key] ? true : false;
};
 
KeyListener.prototype.addKeyPressListener = function(keyCode, callback)
{
    window.addEventListener("keypress", function(e) {
        if (e.keyCode == keyCode)
            callback(e);
    });
  };


// prep game
var game = new Pong();


function PongLoop() {
    game.update();
    game.render();
    // Call the main loop again at a frame rate of 30fps
    
    setTimeout(PongLoop, 15.3333);
   }

// Start the game 
PongLoop();



