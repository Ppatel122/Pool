let balls = [];

// White Ball Class
class whiteBall{
  constructor(){
    this.xpos = 100;
    this.ypos = 200;
    this.rad = 12.5;
    this.xvel = 0;
    this.yvel = 0;
    this.acceleration = 0;
    this.clickable = true;
    this.clicked = false;
    this.locked = false;
    this.projection = false;
    this.linexpos = this.xpos + 350;
    this.lineypos = 200;  
    this.arrow1x = this.linexpos - 10;
    this.arrow1y = this.lineypos - 10;
    this.arrow2x = this.linexpos - 10;
    this.arrow2y = this.lineypos + 10;
    this.arrowColor = 255;
  }
  // Checks to see if ball is clicked
  click(){
    let d = dist(mouseX,mouseY,this.xpos,this.ypos);
    if(d < this.rad && this.clickable){
      this.clicked = true;
    } else{
      this.clicked = false;
    }
  }
  // Checks for wall collisions
  wallCollisions(xMin, xMax, yMin, yMax, coefRest) {
    if (this.xpos > xMax - this.rad - 17.5)  {
        this.xpos = xMax - this.rad - 17.5;
        this.xvel = -abs(this.xvel)*coefRest;
    } else if (this.xpos < xMin + this.rad + 17.5) {
        this.xpos = xMin + this.rad + 17.5;
        this.xvel = abs(this.xvel)*coefRest;
    }

    if (this.ypos > yMax - this.rad - 17.5)  {
        this.ypos = yMax - this.rad - 17.5;
        this.yvel = -abs(this.yvel)*coefRest;
    } else if (this.ypos < yMin + this.rad + 17.5) {
        this.ypos = yMin + this.rad + 17.5;
        this.yvel = abs(this.yvel)*coefRest;
    }
  }

  // Shoots the ball
  shoot(){
    player.projection = false;
    player.clickable = false;
    player.xvel = 20;
    
  }
  // Draws the white ball
  render(){
    fill(255);
    noStroke();
    if(player.locked){
      stroke(0);
      strokeWeight(4);
    }
    ellipse(this.xpos,this.ypos,2*this.rad);
    fill(255);
    stroke(0);
    strokeWeight(2);
    if(this.projection ){
      line(this.linexpos,this.lineypos,this.xpos,this.ypos);
      line(this.linexpos,this.lineypos,this.arrow1x,this.arrow1y);
      line(this.linexpos,this.lineypos,this.arrow2x,this.arrow2y);
    }
    player.xpos += player.xvel
  }
}

class Ball{
  constructor(x,y,rad,xvel,yvel){
    this.xpos = x;
    this.ypos = y;
    this.rad = rad;
    this.xvel = xvel;
    this.yvel = yvel;
  }

  render(){
    fill(255,0,0);
    noStroke();
    ellipse(this.xpos,this.ypos,2*this.rad);
  }
}

class Hole{
  constructor(x,y){
    this.xpos = x;
    this.ypos = y;
    this.rad = 15
  }

  render(){
    fill(0);
    noStroke();
    ellipse(this.xpos,this.ypos,2*this.rad);
  }
}

class Bumper{
  constructor(){

  }

}

function setup() {
  createCanvas(700, 400);
  resetgame();
};

function draw() {
  // Background 
  background(10, 108, 3);
  drawBorder();
  // Holes
  hole1.render();
  hole2.render();
  hole3.render();
  hole4.render();
  hole5.render();
  hole6.render();
  // Player
  player.click();
  player.render();
  // Target ball
  target.render();
  player.wallCollisions(0,700,0,400,0.5)
  updateSpeed();
}

function updateSpeed(){
  if(player.xvel > 0.2){
    player.xvel -= 0.2;
  } else if(player.xvel < -0.2){
    player.xvel += 0.2
  } else{
    player.xvel = 0;
  }
}

function createHoles(){
  hole1 = new Hole(25,25,false);
  hole2 = new Hole(350,17,true);
  hole3 = new Hole(675,25,false);
  hole4 = new Hole(25,375,false);
  hole5 = new Hole(350,383,true);
  hole6 = new Hole(675,375,false);
}

function drawBorder(){
  stroke(0);
  strokeWeight(2);
  line(200,0,200,400);
  stroke(170,114,67);
  strokeWeight(35);
  line(0,1,700,1);
  line(0,399,700,399);
  line(699,0,699,400);
  line(1,0,1,400);
}

function resetgame(){
  createHoles();
  player = new whiteBall();
  target = new Ball(350,200,12.5);
}
function checkBoundaries(){
  if(player.xpos <= 30){
    player.xpos = 30;
    player.linexpos = player.xpos + 300;
    player.arrow1x = player.linexpos - 10;
    player.arrow2x = player.linexpos - 10;  
  } else if(player.xpos >= 187){
    player.xpos = 187;
    player.linexpos = player.xpos + 300;
    player.arrow1x = player.linexpos - 10;
    player.arrow2x = player.linexpos - 10; 
  }
  if(player.ypos <= 30){
    player.ypos = 30;
    player.lineypos = player.ypos; 
    player.arrow1y = player.lineypos - 10;
    player.arrow2y = player.lineypos + 10;
  } else if(player.ypos >= 370){
    player.ypos = 370;
    player.lineypos = player.ypos; 
    player.arrow1y = player.lineypos - 10;
    player.arrow2y = player.lineypos + 10;
  }
}

function mousePressed() {
  if(player.clicked){
    player.locked = true;
    Stroke(0);
  } else{
    player.locked = false;
  }
}

function mouseDragged() {
  if(player.locked){
    player.xpos = mouseX;
    player.ypos = mouseY;
    player.linexpos = player.xpos + 300;
    player.lineypos = player.ypos; 
    player.arrow1x = player.linexpos - 10;
    player.arrow1y = player.lineypos - 10;
    player.arrow2x = player.linexpos - 10;
    player.arrow2y = player.lineypos + 10;
    checkBoundaries();
  }
}

function mouseReleased() {
  player.locked = false;
}

function keyReleased() {
  if (keyCode == UP_ARROW || keyCode == DOWN_ARROW) {
  } else if (keyCode == RIGHT_ARROW || keyCode == LEFT_ARROW) {
    
  }
}

function keyPressed() {
  if (keyCode === RIGHT_ARROW) {
    player.linexpos += 5;
  } else if (keyCode === LEFT_ARROW) {
    player.linexpos -= 5;
  } else if (keyCode === UP_ARROW) {

  } else if (keyCode === DOWN_ARROW) {

  } else if (keyCode == ENTER){
    player.shoot();
  } else if (keyCode == 82) {
    resetgame();
  } else if (keyCode === 32 ) { // SpaceBar
    if(player.projection){
      player.projection = false;
    } else{
      player.projection = true;
    }
  } else if (keyCode === 81) { // Q
    gameStarted = !gameStarted;
  }
}
