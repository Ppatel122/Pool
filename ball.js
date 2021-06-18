let circles = [];
let wallCoefRest = 0.5;
let circleCoefRest = 5;
let circleAcceleration = 0.000; // circleAcceleration is in units/frame^2

// White Ball Class
class whiteBall{
  constructor(){
    this.x = 100;
    this.y = 200;
    this.radius = 12.5;
    this.xVel = 0;
    this.yVel = 0;
    this.acceleration = 0;
    this.clickable = true;
    this.clicked = false;
    this.locked = false;
    this.projection = false;
    this.linex = this.x + 350;
    this.liney = 200;  
    this.arrowColor = 255;
  }
  // Checks to see if ball is clicked
  click(){
    let d = dist(mouseX,mouseY,this.x,this.y);
    if(d < this.radius && this.clickable){
      this.clicked = true;
    } else{
      this.clicked = false;
    }
  }
  // Checks for wall collisions
  wallCollisions(xMin, xMax, yMin, yMax, coefRest) {
    if (this.x > xMax - this.radius - 17.5)  {
        this.x = xMax - this.radius - 17.5;
        this.xVel = -abs(this.xVel)*coefRest;
    } else if (this.x < xMin + this.radius + 17.5) {
        this.x = xMin + this.radius + 17.5;
        this.xVel = abs(this.xVel)*coefRest;
    }

    if (this.y > yMax - this.radius - 17.5)  {
        this.y = yMax - this.radius - 17.5;
        this.yVel = -abs(this.yVel)*coefRest;
    } else if (this.y < yMin + this.radius + 17.5) {
        this.y = yMin + this.radius + 17.5;
        this.yVel = abs(this.yVel)*coefRest;
    }
  }

  // Shoots the ball
  shoot(){
    player.projection = false;
    player.clickable = false;
    player.xVel = 20;
    
  }
  // Draws the white ball
  show(){
    fill(255);
    noStroke();
    if(player.locked){
      stroke(0);
      strokeWeight(4);
    }
    ellipse(this.x,this.y,2*this.radius);
    fill(255);
    stroke(0);
    strokeWeight(2);
    if(this.projection ){
      line(this.linex,this.liney,this.x,this.y);
    }
    player.x += player.xVel
  }
}

class Ball{
  constructor(x,y,radius,xVel,yVel){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.xVel = xVel;
    this.yVel = yVel;
  }

  show(){
    fill(255,0,0);
    noStroke();
    ellipse(this.x,this.y,2*this.radius);
  }
}

class Circle {
  constructor(x, y, xVel, yVel, radius = 10, mass = 1, colour = color(255)) {
      this.x = x;
      this.y = y;
      this.xVel = xVel;
      this.yVel = yVel;
      this.radius = radius;
      this.diameter = radius*2;
      this.mass = mass;
      this.colour = colour;
  }

  show() {
      noStroke();
      fill(this.colour);
      circle(this.x, this.y, this.diameter);
  }

  move() {
      this.x += this.xVel;
      this.y += this.yVel;
  }

  wallCollision(xMin, xMax, yMin, yMax, coefRest = 1) {
      if (this.x > xMax - this.radius)  {
          this.x = xMax - this.radius;
          this.xVel = -abs(this.xVel)*coefRest;
      } else if (this.x < xMin + this.radius) {
          this.x = xMin + this.radius;
          this.xVel = abs(this.xVel)*coefRest;
      }

      if (this.y > yMax - this.radius)  {
          this.y = yMax - this.radius;
          this.yVel = -abs(this.yVel)*coefRest;
      } else if (this.y < yMin + this.radius) {
          this.y = yMin + this.radius;
          this.yVel = abs(this.yVel)*coefRest;
      }
  }

  circleCollisionCheck(otherCircle) {
      return dist(this.x, this.y, otherCircle.x, otherCircle.y) < this.radius + otherCircle.radius;
  }

  circleCollisionCalc(otherCircle, coefRest = 1) {
      let mt = this.mass;
      let mo = otherCircle.mass;
      let dx = otherCircle.x - this.x;
      let dy = otherCircle.y - this.y;

      // finding angles and initial velocities
      let vt = Math.sqrt(this.xVel * this.xVel + this.yVel * this.yVel);
      let vo = Math.sqrt(otherCircle.xVel * otherCircle.xVel + otherCircle.yVel * otherCircle.yVel);
      let at = this.findAngle(this.xVel, this.yVel);
      let ao = this.findAngle(otherCircle.xVel, otherCircle.yVel);
      let phi = this.findAngle(dx, dy);

      // finding initial velocities on new coordinate system
      let vtx = vt*Math.cos(at-phi);
      let vty = vt*Math.sin(at-phi);
      let vox = vo*Math.cos(ao-phi);
      let voy = vo*Math.sin(ao-phi);

      // finding final velocities on new coordinate system
      let vtfx = (mt*vtx + mo*vox + mo*coefRest*(vox-vtx))/(mt+mo);
      let vofx = (mt*vtx + mo*vox + mt*coefRest*(vtx-vox))/(mt+mo);
      let vtfy = vty;
      let vofy = voy;

      // converting final velocities to regular coordinate system and replacing them
      this.xVel = Math.cos(phi)*vtfx + Math.cos(phi+PI/2)*vtfy;
      this.yVel = Math.sin(phi)*vtfx + Math.sin(phi+PI/2)*vtfy;
      otherCircle.xVel = Math.cos(phi)*vofx + Math.cos(phi+PI/2)*vofy;
      otherCircle.yVel = Math.sin(phi)*vofx + Math.sin(phi+PI/2)*vofy;

      // This adjusts the positions of the circles so they remain outside one another. The circles may stick together if they overlap.
      let halfOverlap = 0.51*abs(dist(this.x, this.y, otherCircle.x, otherCircle.y) - (this.radius + otherCircle.radius));
      this.x += halfOverlap * -Math.cos(phi);
      this.y += halfOverlap * -Math.sin(phi);
      otherCircle.x += halfOverlap * Math.cos(phi);
      otherCircle.y += halfOverlap * Math.sin(phi);
  }

  findAngle(x, y) {
      if (x==0) {
          if (y > 0) {
              return PI/2;
          } else if (y < 0) {
              return 3*PI/2;
          } else {
              return 0;
          }
      }

      if (y==0) {
          if (x > 0) {
              return 0;
          } else if (x < 0) {
              return PI;
          } else {
              return 0;
          }
      }

      if (x > 0) {
          if (y > 0) {
              return Math.atan(y/x);
          } else {
              return Math.atan(y/x) + 2*PI;
          }
      } else {
          if (y > 0) {
              return Math.atan(y/x) + PI;
          } else {
              return Math.atan(y/x) + PI;
          }
      }
  }

  accelerate(acceleration) {
      if (acceleration == 0) {
          return;
      }

      let theta = this.findAngle(this.xVel, this.yVel);

      if (this.xVel != 0) {
          let initSignX = Math.sign(this.xVel);
          this.xVel += acceleration*Math.cos(theta);
          
          if (initSignX != Math.sign(this.xVel)) {
              this.xVel = 0;
          }
      }

      if (this.yVel != 0) {
          let initSignY = Math.sign(this.yVel);
          this.yVel += acceleration*Math.sin(theta);
          if (initSignY != Math.sign(this.yVel)) {
              this.yVel = 0;
          }
      }

  }
}

class Hole{
  constructor(x,y){
    this.x = x;
    this.y = y;
    this.radius = 15
  }

  show(){
    fill(0);
    noStroke();
    ellipse(this.x,this.y,2*this.radius);
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
  hole1.show();
  hole2.show();
  hole3.show();
  hole4.show();
  hole5.show();
  hole6.show();
  // Player
  player.click();
  player.show();
  // Target ball
  target.show();
  player.wallCollisions(0,700,0,400,0.5)
  updateSpeed();
}

function updateSpeed(){
  if(player.xVel > 0.2){
    player.xVel -= 0.2;
  } else if(player.xVel < -0.2){
    player.xVel += 0.2
  } else{
    player.xVel = 0;
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
  if(player.x <= 30){
    player.x = 30;
    player.linex = player.x + 300;
    player.arrow1x = player.linex - 10;
    player.arrow2x = player.linex - 10;  
  } else if(player.x >= 187){
    player.x = 187;
    player.linex = player.x + 300;
    player.arrow1x = player.linex - 10;
    player.arrow2x = player.linex - 10; 
  }
  if(player.y <= 30){
    player.y = 30;
    player.liney = player.y; 
    player.arrow1y = player.liney - 10;
    player.arrow2y = player.liney + 10;
  } else if(player.y >= 370){
    player.y = 370;
    player.liney = player.y; 
    player.arrow1y = player.liney - 10;
    player.arrow2y = player.liney + 10;
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
    player.x = mouseX;
    player.y = mouseY;
    player.linex = player.x + 300;
    player.liney = player.y; 
    player.arrow1x = player.linex - 10;
    player.arrow1y = player.liney - 10;
    player.arrow2x = player.linex - 10;
    player.arrow2y = player.liney + 10;
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
    player.linex += 5;
  } else if (keyCode === LEFT_ARROW) {
    player.linex -= 5;
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
