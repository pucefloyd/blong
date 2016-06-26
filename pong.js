function Pong() {
    var canvas = document.getElementById("game");
    this.width = canvas.width;
    this.height = canvas.height;
    this.context = canvas.getContext("2d");
    this.context.fillStyle = "white";
    this.radius = 75;
    this.startAngle = 5.0 * Math.PI;
    this.endAngle = 6.9 * Math.PI;
    this.counterClockwise = false;
    this.player = new Player(5, 0);
    this.player.y = this.height/2 - this.player.height/2;
    this.computer = new Computer(this.width - 5 - 2, 0);
    this.computer.y = this.height/2 - this.computer.height/2;

    this.ball = new Ball();
    this.ball.x = this.width/2;
    this.ball.y = this.height/2;
}

Pong.prototype.render= function()
{
    this.context.clearRect(0, 0, this.width, this.height);
    this.context.fillRect(this.width/2, 0, 2, this.height);
    this.context.arc(this.ball.x , this.ball.y , this.ball, 0, Math.PI*2, false);
         
           this.ball.render(this.context);
           this.player.render(this.context);
           this.computer.render(this.context);
};
 
/*Pong.prototype.update = function() 
{
    if (this.paused)
        return;
};*/


// PADDLE
function Paddle(x,y) {
    this.x = x;
    this.y = y;
    this.width = 2;
    this.height = 28;
}

Paddle.prototype.render = function(p)
{
    p.fillRect(this.x, this.y, this.width, this.height);
};

function Player(x,y) {
    this.x = x;
    this.y = y;
    this.width = 2;
    this.height = 28;
}

Player.prototype.render = function(p)
{
    p.fillRect(this.x, this.y, this.width, this.height);
};

function Computer(x,y) {
    this.x = x;
    this.y = y;
    this.width = 2;
    this.height = 28;
}

Computer.prototype.render = function(p)
{
    p.fillRect(this.x, this.y, this.width, this.height);
};

function Ball() {
    this.x = 0;
    this.y = 0;
    this.width = 10;
    this.height = 10;
}
 
 
Ball.prototype.render= function(p)
{
     p.fillRect(this.x, this.y, this.width, this.height);
     
};


// Initialize our game instance
var game = new Pong();
 
function PongLoop() {
   
    game.render();
    // Call the main loop again at a frame rate of 30fps
    setTimeout(PongLoop, 33.3333);
}
 
// Start the game execution
PongLoop();