let circles = [];
let holes = [];

let poolTableX = 1000;
let poolTableY = 500;
let poolTableBorder = 20;
let wallT = poolTableBorder;
let wallB = poolTableY - poolTableBorder;
let wallL = poolTableBorder;
let wallR = poolTableX - poolTableBorder;

let borderlength = 20;
let wallCoefRest = 0.5;
let circleCoefRest = 5;
let circleAcceleration = 0.000; // circleAcceleration is in units/frame^2

function setup() {
  frameRate(60);
  createCanvas(poolTableX, poolTableY);
  resetGame();
};

function draw() {
  background(10, 108, 3);
  drawBorder();

  for (let i=0; i < holes.length; i++) {
    holes[i].show()
  }

  for (let i=0; i < circles.length; i++) {
    circles[i].click();

    circles[i].wallCollision(wallL, wallR, wallT, wallB, wallCoefRest);

    for (let j=i+1; j < circles.length; j++) {
        if (circles[i].circleCollisionCheck(circles[j])) {
            circles[i].circleCollisionCalc(circles[j], circleCoefRest);
        }
    }

    circles[i].accelerate(circleAcceleration);
  }

  for (let i=0; i < circles.length; i++) {
    circles[i].show();
  }
}

// creates objects on table
// press "R" to reset the table to this position
function resetGame(){
  circles = [];
  holes = [];

  holes.push(new Hole(poolTableBorder, poolTableBorder));
  holes.push(new Hole(poolTableX/2, poolTableBorder));
  holes.push(new Hole(poolTableX - poolTableBorder, poolTableBorder));
  holes.push(new Hole(poolTableBorder, poolTableY - poolTableBorder));
  holes.push(new Hole(poolTableX/2, poolTableY - poolTableBorder));
  holes.push(new Hole(poolTableX - poolTableBorder, poolTableY - poolTableBorder));

  circles.push(new Circle(100, 200, 0, 0, 12.5, 10, color(255), true));
  circles.push(new Circle(350, 200, 0, 0, 12.5, 10, color(255, 0, 0)));
}

// draws border around the outside of the table
function drawBorder() {
  stroke(0);
  strokeWeight(1);
  line(poolTableX/5,0,poolTableX/5,poolTableY);

  stroke(170,114,67);
  strokeWeight(2*poolTableBorder);
  line(0,0,poolTableX,0);
  line(0,poolTableY,poolTableX,poolTableY);
  line(poolTableX,0,poolTableX,poolTableY);
  line(0,0,0,poolTableY);
}

class whiteBall {
  constructor(x,y,radius){
    this.x = 100;
    this.y = 200;
    this.radius = 12.5;
    this.xVel = 0;
    this.yVel = 0;
    this.acceleration = 0;
    this.clickable = true; //
    this.clicked = false; // These 3 are needed for mouse input, will need to add to circle class
    this.locked = false;  //
    this.projection = false;
    this.linex = this.x + 350;
    this.liney = 200;  
    this.arrowColor = 255;
  }
  // Checks to see if ball is clicked
  click() {
    let d = dist(mouseX,mouseY,this.x,this.y);
    if (d < this.radius && this.clickable) {
      this.clicked = true;
    } else {
      this.clicked = false;
    }
  }

  // Checks for wall collisions. Similar to yours but takes borderlength into account (Might have to update it again when we add bumpers cause if forgot about them)
  wallCollisions(xMin, xMax, yMin, yMax, coefRest) {
    if (this.x > xMax - this.radius - poolTableBorder)  {
        this.x = xMax - this.radius - poolTableBorder;
        this.xVel = -abs(this.xVel)*coefRest;
    } else if (this.x < xMin + this.radius + poolTableBorder) {
        this.x = xMin + this.radius + poolTableBorder;
        this.xVel = abs(this.xVel)*coefRest;
    }

    if (this.y > yMax - this.radius - poolTableBorder)  {
        this.y = yMax - this.radius - poolTableBorder;
        this.yVel = -abs(this.yVel)*coefRest;
    } else if (this.y < yMin + this.radius + poolTableBorder) {
        this.y = yMin + this.radius + poolTableBorder;
        this.yVel = abs(this.yVel)*coefRest;
    }
  }

  // Shoots the ball
  shoot(){
    player.projection = false;
    player.clickable = false;
    player.xVel = 20;
    player.yVel = -20;
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
    player.move();
    player.accelerate();
  }

  //accelerate
  accelerate(){
    if(player.xVel > 0.2){
      player.xVel -= 0.2;
    } else if(player.xVel < -0.2){
      player.xVel += 0.2;
    } else{
      player.xVel = 0;
    }
    if(player.yVel > 0.2){
      player.yVel -= 0.2;
    } else if(player.yVel < -0.2){
      player.yVel += 0.2;
    } else{
      player.yVel = 0;
    }
  
  }

  // Moves the white ball
  move(){
    player.x += player.xVel;
    player.y += player.yVel;
  }
}

class Circle {
  constructor(x, y, xVel, yVel, radius = 10, mass = 1, colour = color(255), isWhiteBall = false) {
    this.x = x;
    this.y = y;
    this.xVel = xVel;
    this.yVel = yVel;
    this.radius = radius;
    this.diameter = radius*2;
    this.mass = mass;
    this.colour = colour;

    this.isWhiteBall = isWhiteBall;
    this.clickable = true;
    this.clicked = false;
    this.locked = false;
  }

  show() {
    noStroke();
    fill(this.colour);
    ellipse(this.x, this.y, this.diameter);
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

  click() {
    if (dist(mouseX, mouseY, this.x, this.y) < this.radius && this.clickable) {
      this.clicked = true;
    } else {
      this.clicked = false;
    }
  }
}

class Hole {
  constructor(x, y, radius = 15) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.diameter = radius*2;
  }

  show() {
    fill(0);
    noStroke();
    circle(this.x, this.y, this.diameter);
  }
}

class Bumper {
  constructor(){

  }

}

// All the functions below this are for mouse/keyboard input. I can explain them to you tommorow
// we're gonna need to generalize these functions
function mousePressed() {
  if(circles[0].clicked){
    circles[0].locked = true;
    Stroke(0);
  } else{
    circles[0].locked = false;
  }
}

function mouseDragged() {
  if(circles[0].locked){
    circles[0].x = mouseX;
    circles[0].y = mouseY;
    //player.linex = player.x + 300;
    //player.liney = player.y; 
    //player.arrow1x = player.linex - 10;
    //player.arrow1y = player.liney - 10;
    //player.arrow2x = player.linex - 10;
    //player.arrow2y = player.liney + 10;
  }
}

function mouseReleased() {
  circles[0].locked = false;
}

function keyReleased() {
  if (keyCode == UP_ARROW || keyCode == DOWN_ARROW) {
  } else if (keyCode == RIGHT_ARROW || keyCode == LEFT_ARROW) {
    
  }
}

function keyPressed() {
  if (keyCode === RIGHT_ARROW) {
    circles[0].linex += 5;
  } else if (keyCode === LEFT_ARROW) {
    circles[0].linex -= 5;
  } else if (keyCode === UP_ARROW) {

  } else if (keyCode === DOWN_ARROW) {

  } else if (keyCode == ENTER){
    circles[0].shoot();
  } else if (keyCode == 82) { // R
    resetGame();
  } else if (keyCode === 32 ) { // SpaceBar
    if(circles[0].projection){
      circles[0].projection = false;
    } else{
      circles[0].projection = true;
    }
  } else if (keyCode === 81) { // Q

  }
}
