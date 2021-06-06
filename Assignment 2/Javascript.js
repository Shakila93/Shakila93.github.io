class GameObject
{
    constructor (context, x, y, vx, vy, width, height){

        this.context = context;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.width = width;
        this.height = height;


        this.isColliding = false;
    }   
    
}
class score extends GameObject{
    constructor (context, x, y, vx, vy){
        super (context, x, y, vx, vy)
        this.num = 0;
    }
    draw(ctx){
        ctx.font = "30px Verdana";
        ctx.fillStyle ="black";
        ctx.fillText("Score: " + this.num, this.x, this.y)

    }
    drawEnd(ctx){
        ctx.font = "90px Verdana";
        ctx.fillStyle ="black";
        ctx.fillText("Game Over ", myCanvas.clientWidth/2 - 200, myCanvas.clientHeight/2)
        ctx.fillText("Score: " + this.num, myCanvas.clientWidth/2 - 200, myCanvas.clientHeight/2 + 100)
    }
    increment(){
        this.num++
    }

}
class Worm extends GameObject{

    constructor (context, x, y, vx, vy, width, height){
        super (context, x, y, vx, vy)

        this.width = width;
        this.height = height;
        this.LC = 1; //life cycle started 1
        this.enabled= false;
        this.gradient;

        this.draw = this.draw.bind(this);
        this.update = this.update.bind(this);
        this.getRight = this.getRight.bind(this);
        this.getBottom = this.getBottom.bind(this);
        this.TimeOut = this.TimeOut.bind(this);
        setTimeout(this.TimeOut, getRandomInRange(1000,10000)); 
        // this.setVelocity = this.setVelocity.bind(this);
        // this.offsetVelocity = this.offsetVelocity.bind(this);

    }
    TimeOut(){
        this.enabled = true;
    }
    update(){
        if (this.enabled == false){
            return;
        }
        
        switch (this.LC) {
            case 1:
                this.x += this.vx;
                this.y += this.vy;
                this.LC = 2;

                break;
            case 2:
                this.x += this.vx;
                this.y += this.vy;
                this.width +=0.1;
                this.height +=0.1;
                if (this.width > 50){
                    this.LC = 3;
                }

                // this.LC = 2;
            
                break;
            case 3:
                this.x += this.vx;
                this.y += this.vy;
                this.width -=0.1;
                this.height -=0.1;
                if (this.width < 1){
                    this.LC = 4;
                }

                break;
            case 4:
                this.x = getRandomInRange(50, 950);
                this.y = getRandomInRange(250, 600);
                this.LC = 1;
               
                break;
        
            default:
                break;
        }


    }
    draw(ctx){
        

        if (this.enabled == false){
            return;
        }
        var x = this.x; //+ (this.width /2);
        var y = this.y; //+ (this.width /2);
        var radius = this.width /2;
        ctx.strokeStyle="#deaf6a";
        this.gradient = ctx.createRadialGradient (this.x, this.y,1, this.x, this.y, radius);

        this.gradient.addColorStop(0, "#e2ba7f");
        this.gradient.addColorStop(0.5, "black");
        this.gradient.addColorStop(1, "#d49940");
        ctx.fillStyle = this.gradient;
        ctx.beginPath();

       
        
     
        ctx.arc(this.x + this.width/2, this.y + this.height, this.width/2, 0, Math.PI, true);
        
       
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
       
        
    }
    getRight(){
        return (this.x + this.width);
    }

    getBottom(){
        return (this.y + this.height);
    }
}
class character extends GameObject{
    constructor (context, x, y, vx, vy, width, height, image, image2){
        super (context, x, y, vx, vy)
        this.width = width;
        this.height = height;

        this.halfW = width/2;
        this.halfH = height/2;

        this.lookingR = false;


        this.scale = 1;

       
       this.image = new Image();
       this.image2 = new Image();
       this.image.src = image;
       this. image2.src = image2;
        this.draw = this.draw.bind(this);
        this.update = this.update.bind(this);
        this.newPos = this.newPos.bind(this);
        this.getRight = this.getRight.bind(this);
        this.getBottom = this.getBottom.bind(this);

   
    }
    draw(ctx){
        
        
        if (this.lookingR){
            ctx.drawImage(this.image, 
                this.x + this.halfW, 
                this.y + this.halfH, //height
                this.width, this.height);
        }
        else {
            ctx.drawImage(this.image2, 
                this.x + this.halfW, 
                this.y + this.halfH, //height
                this.width, this.height);
        }
        ctx.stroke();
    }
    newPos(x, y){
       
        //clamp function inforces min max value to watever your passing
        this.x = Math.min(1000 - this.width, Math.max(0, this.x + x))
        this.y = Math.min(600 - this.height, Math.max(0, this.y + y))
        

    }
    update(){

    }
    getRight(){
        return (this.x + this.width);
    }

    getBottom(){
        return (this.y + this.height);
    }
    //flip imag

}
var ScoreBoard = null;
var myGamePiece;
var myBackground;
var myWorms = [];
var myChar = null;
var myCanvas;
var happySound = document.getElementById("happySound"); //HappySound; 
var sadSound = document.getElementById("sadSound");
var Start = document.getElementById("Start");
var Restart = document.getElementById("Restart");
var time = document.getElementById("Timer");
var endTime = 0;
var timeoffset = 0;

//var myScore; //

function setup(){
    myGameArea.start();
    window.requestAnimationFrame(gameLoop); 
}

function startGame() {
    //myGamePiece = new component(200, 100, "person.png", 400, 300, "image");
    //myBackground = new component(1000, 600, "beach.jpg", 0, 0, "image");
   
    
    //myScore = new component("30px", "Consolas", "black", 280, 40, "text");
    //myWorms = new Array();
    myWorms.length = 0;
    myChar = new character(null, 500, 300, 0, 0, 57, 100, "person2.png", "person3.png");
    
    ScoreBoard = new score (null, 800, 100, 0, 0)

    

    for(var i = 0; i < 8; i++){
        var myWorm = new Worm(null, getRandomInRange(50, 950), getRandomInRange(250, 600), getRandomInRange(-1, 1), getRandomInRange(-1, 1), 30, 100);
        myWorms.push(myWorm);

    }
    
    Start.disabled = true;
    Restart.disabled = false;
    time.disabled = true
    endTime = parseInt(time.value)*1000 + timeoffset;
}

function RestartGame(){
    myChar = null
    ScoreBoard = null
    myWorms.length = 0
    Start.disabled = false;
    Restart.disabled = true;
    time.disabled = false;
    endTime = 0;
}
Start.addEventListener("click", startGame)
Restart.addEventListener("click", RestartGame)

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {

        this.canvas.width = 1000;
        this.canvas.height = 600;
        this.canvas.style.backgroundImage = "url('beach.jpg')";
        myCanvas= this.canvas;
        
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);

        window.addEventListener('keydown', function (e) {
            myGameArea.key = e.keyCode;
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.key = false;
        })
    }, 
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    // stop : function() {
    //     clearInterval(this.interval);
    // }
}

function updateGameArea() {
    checkCollisions();
    
    myGameArea.clear();

    // myGamePiece.speedX = 0;
    // myGamePiece.speedY = 0;
    if (myChar !== null ){
        if (myGameArea.key && myGameArea.key == 37) {myChar.newPos(-1, 0); myChar.lookingR = false;}
        if (myGameArea.key && myGameArea.key == 39) {myChar.newPos(1, 0); myChar.lookingR = true;}
        if (myGameArea.key && myGameArea.key == 38) {myChar.newPos(0, -1)}
        if (myGameArea.key && myGameArea.key == 40) {myChar.newPos(0, 1)}
        if (myGameArea.key && myGameArea.key == 32) {attemptCatch()}
    }

    
    for(var i = 0; i < myWorms.length; i++){
        myWorms[i].update();
    }
}
function attemptCatch(){

    if(myChar === null || myChar === undefined)
    return;
    checkObjectCollisions(myChar);
}

function gameLoop(time){
    timeoffset = time
    if (time > endTime && endTime > 0){
        if(ScoreBoard !== null)
        ScoreBoard.drawEnd(myGameArea.context)
    }
    else{
    updateGameArea();
    draw();
    }
    window.requestAnimationFrame(gameLoop);


}
function draw (){
    ctx = myGameArea.context;
    for(var i = 0; i < myWorms.length; i++){
        myWorms[i].draw(ctx);

    }
    if (myChar !== null){
        myChar.draw(ctx);
    }
    if (ScoreBoard !== null){
        ScoreBoard.draw(ctx);
    }
    

}


function intersect(){

}

//generating random for worms
function getRandomInRange(min, max) {
    return Math.random() * (Math.abs(min) + max) + min;
}
function checkCollisions() {
    for (var i = 0; i < this.myWorms.length; i++) {
        // for each worm, check the wall overlaps
        this.checkWallCollisions(this.myWorms[i]);
        

        
    }
    
}
function checkWallCollisions(object) {
    // check right and left wall overlap
    if (object.getRight() >= myCanvas.clientWidth) {
        object.vx = -object.vx;
        object.x = myCanvas.clientWidth - object.width - 1;
    }
    else if (object.x <= 0) {
        object.vx = -object.vx;
        object.x = 1;
    }
    
    // check bottom and top wall overlap
    if (object.getBottom() >= myCanvas.clientHeight) {
        object.vy = -object.vy;
        object.y = myCanvas.clientHeight - object.height - 1;
    }
    else if (object.y <= 150) {
        object.vy = -object.vy;
        object.y = 150;
    }
}

function checkObjectCollisions(object) {
    // check parameter square against all other squares
    for (var i = 0; i < this.myWorms.length; i++) {
        if (this.myWorms[i].LC == 4){
            continue
        }
        if (object !== this.myWorms[i])
        {
            var isCol = this.rectIntersect(
                object.x, 
                object.y, 
                object.width,
                object.height,
                myWorms[i].x,
                myWorms[i].y,
                myWorms[i].width,
                myWorms[i].height
                );
                object.isColliding = isCol;
                if (isCol) {
                    //if catch worm then disapear & play sound & increase score
                    (myWorms[i]).LC = 4; //play sound
                    happySound.play();
                    ScoreBoard.increment();
                    break;
                } 
                sadSound.play();

                //else 
                //play unhappy sound
        }
    }
}

function rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2) {
    // Check x and y for overlap
    if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2){
        return false;
    }
    return true;
}
