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

    

        //var gradient = ctx.createRadialGradient(halfWidth, halfHeight, radius[0], halfWidth, halfHeight, radius[1]);
        //gradient.addColorStop(0, "red");
       
       // gradient.addColorStop(1, "blue");

        ctx.beginPath();
        ctx.arc(this.x+this.width/2, this.y+this.height, this.width/2, 0, Math.PI, true);
        
        ctx.closePath();
        ctx.fillStyle = "#b33c00";//gradient;
        ctx.fill();
        ctx.strokeStyle="#b33c00";
        ctx.stroke();
        //create gradient
    
        
    }
    getRight(){
        return (this.x + this.width);
    }

    getBottom(){
        return (this.y + this.height);
    }
}
class character extends GameObject{
    constructor (context, x, y, vx, vy, width, height, image){
        super (context, x, y, vx, vy)
        this.width = width;
        this.height = height;

        this.halfW = width/2;
        this.halfH = height/2;

        this.scale = 1;

        //this.image = new component(this.width, this.height, image, this.x, this.y, "image");;
       this.image = new Image();
       this.image.src = image;
        this.draw = this.draw.bind(this);
        this.update = this.update.bind(this);
        this.newPos = this.newPos.bind(this);
        this.getRight = this.getRight.bind(this);
        this.getBottom = this.getBottom.bind(this);

   
    }
    draw(ctx){
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.scale(this.scale, 1)

        ctx.drawImage(this.image, 
            - this.halfW, 
            - this.halfH, //height
            this.width, this.height);
            ctx.restore()
        // ctx.stroke();
        // ctx.scale (this.scale,1);
        
    }
    newPos(x, y){
        // this.x += x;
        // this.y += y;
        //clamp function inforces min max value to watever your passing
        this.x = Math.min(1000 - this.width, Math.max(0, this.x + x))
        this.y = Math.min(600 - this.height, Math.max(0, this.y + y))
        if (Math.abs(x) > 0){
            this.scale = Math.sign(x)
            console.log(this.scale)
        }
        

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
var ScoreBoard;
var myGamePiece;
var myBackground;
var myWorms;
var myChar;
var myCanvas;
var happySound = document.getElementById("happySound"); //HappySound; 
var sadSound = document.getElementById("sadSound");

//var myScore; //



function startGame() {
    //myGamePiece = new component(200, 100, "person.png", 400, 300, "image");
    //myBackground = new component(1000, 600, "beach.jpg", 0, 0, "image");
   
    myGameArea.start();
    //myScore = new component("30px", "Consolas", "black", 280, 40, "text");
    myWorms = new Array();
    myChar = new character(null, 500, 300, 0, 0, 53, 122, "person.png");
    
    ScoreBoard = new score (null, 800, 100, 0, 0)

    

    for(var i = 0; i < 1; i++){
        var myWorm = new Worm(null, getRandomInRange(50, 950), getRandomInRange(250, 600), getRandomInRange(-1, 1), getRandomInRange(-1, 1), 30, 100);
        myWorms.push(myWorm);

    }
    this.window.requestAnimationFrame(this.gameLoop);  
}

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
    if (myGameArea.key && myGameArea.key == 37) {myChar.newPos(-1, 0)}
    if (myGameArea.key && myGameArea.key == 39) {myChar.newPos(1, 0)}
    if (myGameArea.key && myGameArea.key == 38) {myChar.newPos(0, -1)}
    if (myGameArea.key && myGameArea.key == 40) {myChar.newPos(0, 1)}
    if (myGameArea.key && myGameArea.key == 32) {attemptCatch()}


    // myBackground.newPos();    
    // myBackground.update();
    // myChar.newPos();
   // myChar.update();

    // myGamePiece.newPos();    
    // myGamePiece.update();
    
    for(var i = 0; i < myWorms.length; i++){
        myWorms[i].update();
    }
}
function attemptCatch(){

    checkObjectCollisions(myChar);
}

function gameLoop(time){
    if (time > 180000){
        return
    }
    updateGameArea();
    draw();
    this.window.requestAnimationFrame(this.gameLoop);


}
function draw (){
    ctx = myGameArea.context;
    for(var i = 0; i < myWorms.length; i++){
        myWorms[i].draw(ctx);

    }
    myChar.draw(ctx);
    // ctx.font = this.width + " " + this.height;
    // ctx.fillStyle = color;
    // ctx.fillText("score".toString, this.x, this.y);
    ScoreBoard.draw(ctx);

}


function intersect(){

}

//generating random for worms
function getRandomInRange(min, max) {
    return Math.random() * (Math.abs(min) + max) + min;
}
function checkCollisions() {
    for (var i = 0; i < this.myWorms.length; i++) {
        // for each square, check the wall overlaps
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
                this.myWorms[i].x,
                this.myWorms[i].y,
                this.myWorms[i].width,
                this.myWorms[i].height
                );
                object.isColliding = isCol;
                if (isCol) {
                    //if catch worm then disapear & play sound & increase score
                    (this.myWorms[i]).LC = 4; //play sound
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
