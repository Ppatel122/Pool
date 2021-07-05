let circles = []; // array to hold all Circle objects
let holes = []; // array to hold all Hole objects
let bumpers = []; // array to hold all Bumper objects

let poolTableX = 1000; // width of the pool table (also the canvas width)
let poolTableY = 500; // height of the pool table (also the canvas height)
let poolTableBorder = 30; // width of the border around the pool table
let bumperLength = 7; // width of the bumpers around the pool table
let bumperIndent = 5; // length of the corner cut-outs on the bumpers
let cornerHoleShift = 3; // the distance that the corner holes are shifted away from the border
let middleHoleShift = 5; // the distance that the middle holes are shifted away from the border
let holeRadius = 20; // radius of the holes

let wallT = poolTableBorder + bumperLength; // position of the top wall (used for collision)
let wallB = poolTableY - poolTableBorder - bumperLength; // position of the bottom wall (used for collision)
let wallL = poolTableBorder + bumperLength; // position of the left wall (used for collision)
let wallR = poolTableX - poolTableBorder - bumperLength; // position of the right wall (used for collision)

let wallCoefRest = 0.5; // coefficient of restitution for collisions between circles and walls
let circleCoefRest = 0.9; // coefficient of restitution for collisions between multiple circles
let circleAcceleration = -0.05; // circleAcceleration is in units/frame^2

let predictionView = false;
let directionView = true;

function setup() {
  frameRate(144);
  var canvas = createCanvas(poolTableX, poolTableY);
  canvas.parent("container");
  resetGame();
};

function draw() {
  background(10, 108, 3);
  drawBorder();

  for (let i = 0; i < bumpers.length;i++){
    bumpers[i].show();
  }

  for (let i=0; i < holes.length; i++) {
    holes[i].show();
  }

  for (let i=0; i < circles.length; i++) {
    circles[i].click();

    for(let j = 0; j < bumpers.length;j++){
      circles[i].bumperCollision(bumpers[j],wallCoefRest);
    }

    // for(let j = 0; j < bumpers.length;j++){
    //   circles[i].wallCollision();
    // }


    for (let j=i+1; j < circles.length; j++) {
        if (circles[i].circleCollisionCheck(circles[j])) {
            circles[i].circleCollisionCalc(circles[j], circleCoefRest);
        }   
    }

    for(let j = 0; j < holes.length;j++){
      circles[i].holeCollision(holes[j]);
    }

    circles[i].accelerate(circleAcceleration);

    circles[i].show();
    circles[i].move();
  }
  cue.show();
  text(circles[0].xVelShot, 100, 20);
  text(circles[0].yVelShot, 120, 20);
  text(frameRate(), 140, 20);

  if (predictionView) {
    for (let i=0; i < circles.length; i++) {
      for (let j=1; j < circles[i].xCollisions.length; j++) {
        strokeWeight(1);
        stroke(circles[i].colour);
        line(circles[i].xCollisions[j-1], circles[i].yCollisions[j-1], circles[i].xCollisions[j], circles[i].yCollisions[j]);
      }
    }
  }

  if (directionView) {
    if (circles[0].xVelShot != 0 || circles[0].yVelShot != 0) {
      strokeWeight(1);
      stroke(0);
      line(circles[0].x, circles[0].y, circles[0].x + circles[0].xVelShot, circles[0].y - circles[0].yVelShot);
    }
  }

}

// creates objects on table
// press "R" to reset the table to this position
function resetGame(){
  circles = [];
  holes = [];
  bumpers = [];
  
  // TOP LEFT bumper
  bumpers.push(new Bumper(poolTableBorder+holeRadius, poolTableBorder, // top left corner
                          poolTableX/2-holeRadius, poolTableBorder, // top right corner
                          poolTableX/2-holeRadius-bumperIndent, poolTableBorder+bumperLength, // bottom right corner
                          poolTableBorder+holeRadius+bumperIndent, poolTableBorder+bumperLength, // bottom left corner
                          1));
  // TOP RIGHT bumper
  bumpers.push(new Bumper(poolTableX/2+holeRadius, poolTableBorder, // top left corner
                          poolTableX-poolTableBorder-holeRadius, poolTableBorder, // top right corner
                          poolTableX-poolTableBorder-holeRadius-bumperIndent, poolTableBorder+bumperLength, // bottom right corner
                          poolTableX/2+holeRadius+bumperIndent, poolTableBorder+bumperLength, // bottom left corner
                          1));
  // LEFT bumper
  bumpers.push(new Bumper(poolTableBorder, poolTableBorder+holeRadius, // top left corner
                          poolTableBorder+bumperLength, poolTableBorder+holeRadius+bumperIndent, // top right corner
                          poolTableBorder+bumperLength, poolTableY-poolTableBorder-holeRadius-bumperIndent, // bottom right corner
                          poolTableBorder, poolTableY-poolTableBorder-holeRadius, // bottom left corner
                          2));
  // RIGHT bumper
  bumpers.push(new Bumper(poolTableX-poolTableBorder-bumperLength, poolTableBorder+holeRadius+bumperIndent, // top left corner
                          poolTableX-poolTableBorder, poolTableBorder+holeRadius, // top right corner
                          poolTableX-poolTableBorder, poolTableY-poolTableBorder-holeRadius, // bottom right corner
                          poolTableX-poolTableBorder-bumperLength, poolTableY-poolTableBorder-holeRadius-bumperIndent, // bottom left corner
                          3));
  // BOTTOM LEFT bumper
  bumpers.push(new Bumper(poolTableBorder+holeRadius+bumperIndent, poolTableY-poolTableBorder-bumperLength, // top left corner
                          poolTableX/2-holeRadius-bumperIndent, poolTableY-poolTableBorder-bumperLength, // top right corner
                          poolTableX/2-holeRadius, poolTableY-poolTableBorder, // bottom right corner
                          poolTableBorder+holeRadius, poolTableY-poolTableBorder, // bottom left corner
                          4));
  // BOTTOM RIGHT bumper
  bumpers.push(new Bumper(poolTableX/2+holeRadius+bumperIndent, poolTableY-poolTableBorder-bumperLength, // top left corner
                          poolTableX-poolTableBorder-holeRadius-bumperIndent, poolTableY-poolTableBorder-bumperLength, // top right corner
                          poolTableX-poolTableBorder-holeRadius, poolTableY-poolTableBorder, // bottom right corner
                          poolTableX/2+holeRadius, poolTableY-poolTableBorder, // bottom left corner
                          4));

  holes.push(new Hole(poolTableBorder + cornerHoleShift, poolTableBorder + cornerHoleShift, holeRadius));
  holes.push(new Hole(poolTableX/2, poolTableBorder - middleHoleShift, holeRadius));
  holes.push(new Hole(poolTableX - poolTableBorder - cornerHoleShift, poolTableBorder + cornerHoleShift, holeRadius));
  holes.push(new Hole(poolTableBorder + cornerHoleShift, poolTableY - poolTableBorder - cornerHoleShift, holeRadius));
  holes.push(new Hole(poolTableX/2, poolTableY - poolTableBorder + middleHoleShift, holeRadius));
  holes.push(new Hole(poolTableX - poolTableBorder - cornerHoleShift, poolTableY - poolTableBorder - cornerHoleShift, holeRadius));

  circles.push(new Circle(100, 250, 0, 0, 12.5, 10, color(255),           0)); // White
  circles.push(new Circle(750, 250, 0, 0, 12.5, 10, color(0),             8)); // Black
  // SOLIDS
  circles.push(new Circle(700, 250, 0, 0, 12.5, 10, color(255, 255, 0),   1)); // Yellow
  circles.push(new Circle(725, 237.5, 0, 0, 12.5, 10, color(0, 0, 255),   2)); // Blue
  circles.push(new Circle(750, 275, 0, 0, 12.5, 10, color(255, 0, 0),     3)); // Red
  circles.push(new Circle(725, 262.5, 0, 0, 12.5, 10, color(90, 25, 140), 4)); // Purple
  circles.push(new Circle(800, 300, 0, 0, 12.5, 10, color(255, 160, 0),   5)); // Orange
  circles.push(new Circle(775, 212.5, 0, 0, 12.5, 10, color(0, 255, 0),   6)); // Green
  circles.push(new Circle(800, 225, 0, 0, 12.5, 10, color(128, 0, 0),     7)); // Maroon
  // STRIPES
  circles.push(new Circle(775, 262.5, 0, 0, 12.5, 10, color(255, 255, 0), 9)); // Yellow
  circles.push(new Circle(775, 287.5, 0, 0, 12.5, 10, color(0, 0, 255),   10)); // Blue
  circles.push(new Circle(775, 237.5, 0, 0, 12.5, 10, color(255, 0, 0),   11)); // Red
  circles.push(new Circle(800, 200, 0, 0, 12.5, 10, color(90, 25, 140),   12)); // Purple
  circles.push(new Circle(800, 250, 0, 0, 12.5, 10, color(255, 160, 0),   13)); // Orange
  circles.push(new Circle(800, 275, 0, 0, 12.5, 10, color(0, 255, 0),     14)); // Green
  circles.push(new Circle(750, 225, 0, 0, 12.5, 10, color(128, 0, 0),     15)); // Maroon

  cue = new Cue(circles[0]);
  projection = new Projection(circles[0]);
}

// predicts a shot and draws lines
// press Q to run the prediction
function predictShot() {
  predictionView = true;

  // store initial circle positions
  xInitial = [];
  yInitial = [];
  for (let i=0; i < circles.length; i++) {
    xInitial[i] = circles[i].x;
    yInitial[i] = circles[i].y;
  }

  // calculate the entire shot
  circles[0].shoot();
  for (let i=0; i < circles.length; i++) {
    circles[i].xCollisions.push(circles[i].x);
    circles[i].yCollisions.push(circles[i].y);
  }
  for (let i=0; i<10000; i++) {
    for (let i=0; i < circles.length; i++) {
  
      circles[i].wallCollision(wallL, wallR, wallT, wallB, wallCoefRest);
  
      for (let j=i+1; j < circles.length; j++) {
          if (circles[i].circleCollisionCheck(circles[j])) {
              circles[i].circleCollisionCalc(circles[j], circleCoefRest);
          }
      }
  
      circles[i].accelerate(circleAcceleration);
    }
  
    for (let i=0; i < circles.length; i++) {
      circles[i].move();
    }
  }
  for (let i=0; i < circles.length; i++) {
    circles[i].xCollisions.push(circles[i].x);
    circles[i].yCollisions.push(circles[i].y);
  }

  // restore initial circle positions
  for (let i=0; i < circles.length; i++) {
    circles[i].x = xInitial[i];
    circles[i].y = yInitial[i];
  }
}

// draws border around the outside of the table
function drawBorder() {
  stroke(170,114,67);
  strokeWeight(2*poolTableBorder);
  line(0,0,poolTableX,0);
  line(0,poolTableY,poolTableX,poolTableY);
  line(poolTableX,0,poolTableX,poolTableY);
  line(0,0,0,poolTableY);
}

class Cue{
  constructor(ball){
    this.x1 = ball.x
    this.y1 = ball.y
    this.x2 = ball.x
    this.y2 = ball.y
    this.on = true
  }
  update(ball){
    this.x1 = ball.x;
    this.x2 = mouseX;
    this.y1 = ball.y;
    this.y2 = mouseY;
  }

  reset(ball){
    this.x2 = ball.x;
    this.y2 = ball.y;
  }

  show(){
    if(this.on){
      stroke(0);
      strokeWeight(5);
      line(this.x1,this.y1,this.x2,this.y2)
    }
  }
}

class Projection {
  constructor(ball){
    this.x1 = ball.x
    this.y1 = ball.y
    this.x2 = ball.x
    this.y2 = ball.y
    this.on = true
  }

  updateX(xVel){
    this.x2 = this.x1 + 40*xVel;
  }

  updateY(yVel){
    this.y2 = this.y1 + 40*yVel;
  }
  
  update(){
    this.x1 = circles[0].x;
    this.x2 = -(cue.x2 - circles[0].x) + circles[0].x
    this.y1 = circles[0].y;
    this.y2 = -(cue.y2 - circles[0].y) + circles[0].y
  }

  reset(ball){
    this.x2 = ball.x;
    this.y2 = ball.y;
  }

  show(){
    if(this.on){
      stroke(0);
      strokeWeight(2);
      line(this.x1,this.y1,this.x2,this.y2)
    }
  }
}

class Circle {
  constructor(x, y, xVel, yVel, radius = 10, mass = 1, colour = color(255), number = 0) {
    this.x = x;
    this.y = y;
    this.xVel = xVel;
    this.yVel = yVel;
    this.radius = radius;
    this.diameter = radius*2;
    this.mass = mass;
    this.colour = colour;
    this.number = number;

    this.clickable = true;
    this.clicked = false;
    this.locked = false;
    this.potted = false;
  }
  move(){
    this.x += this.xVel;
    this.y += this.yVel;
  }
  show() {


      noStroke();
      if(this.locked) {
        stroke(0);
        strokeWeight(4);
      }

      fill(this.colour);
      circle(this.x, this.y, this.diameter);
      if (this.number >= 9 && this.number <= 15) {
        fill(255);
        arc(this.x, this.y, this.diameter, this.diameter, PI/4, 3*PI/4, OPEN);
        arc(this.x, this.y, this.diameter, this.diameter, -3*PI/4, -PI/4, OPEN);
      }

  }

  shoot() {
    for (let i=0; i < circles.length; i++) {
      circles[i].xCollisions = [];
      circles[i].yCollisions = [];
    }
    this.xVel = this.xVelShot;
    this.yVel = -this.yVelShot;
  }

  shootMouse(cue){
    console.log(cue.x2-cue.x1);
    this.xVel = -(cue.x2-cue.x1)*0.2;
    this.yVel = -(cue.y2-cue.y1)*0.2;
  }

  bumperCollision(bumper,coefRest){
    switch(bumper.id) {
      case 1: // Top Bumpers
        if(this.y < bumper.y3 + this.radius &&  bumper.x3 >= this.x  && this.x >= bumper.x4){
          this.y = bumper.y3 + this.radius;
          this.yVel = abs(this.yVel)*coefRest;
          this.xCollisions.push(this.x);
          this.yCollisions.push(this.y);
        }
        break;
      case 2: // Left Bumper
        if(this.x < bumper.x3 + this.radius &&  bumper.y3 >= this.y && this.y >= bumper.y2){
          this.x = bumper.x3 + this.radius;
          this.xVel = abs(this.xVel)*coefRest;
          this.xCollisions.push(this.x);
          this.yCollisions.push(this.y);
        }
        break;
      case 3: // Right Bumper
        if(this.x > bumper.x1 - this.radius &&  bumper.y4 >= this.y  && this.y >= bumper.y1){
          this.x = bumper.x1 - this.radius;
          this.xVel = -abs(this.xVel)*coefRest;
          this.xCollisions.push(this.x);
          this.yCollisions.push(this.y);
        }
        break;
      case 4: // Bottom Bumpers
        if(this.y > bumper.y1 - this.radius &&  bumper.x2 >= this.x && this.x >= bumper.x1){
          this.y = bumper.y1 - this.radius;
          this.yVel = -abs(this.yVel)*coefRest;
          this.xCollisions.push(this.x);
          this.yCollisions.push(this.y);
        }
        break;
    }
  }

  // Will fix this function to fix the "going through walls" problem
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

  holeCollision(hole){
    if(dist(this.x,this.y,hole.x,hole.y) < hole.radius){
      if(this.number === 0){
        this.resetWhite();
        return;
      }
      this.potted = true;
    }
  }

  circleCollisionCheck(otherCircle) {
    return dist(this.x, this.y, otherCircle.x, otherCircle.y) < this.radius + otherCircle.radius;
  }

  circleCollisionCalc(otherCircle, coefRest = 1) {
    this.xCollisions.push(this.x);
    this.yCollisions.push(this.y);
    otherCircle.xCollisions.push(otherCircle.x);
    otherCircle.yCollisions.push(otherCircle.y);

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

  resetWhite(){
    if(this.number === 0){
      this.x = 200;
      this.y = 250;
      this.xVel = 0;
      this.yVel = 0;
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
  constructor(x1, y1, x2, y2, x3, y3, x4, y4,id) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.x3 = x3;
    this.y3 = y3;
    this.x4 = x4;
    this.y4 = y4;
    this.id = id;
  }

  show(){
    noStroke();
    fill(11, 130, 90);
    quad(this.x1, this.y1, this.x2, this.y2, this.x3, this.y3, this.x4, this.y4);
  }
}

// All the functions below this are for mouse/keyboard input. I can explain them to you tommorow
// we're gonna need to generalize these functions
function mousePressed() {
  if(circles[0].clicked){
    circles[0].locked = true;
    cue.on = true;
    projection.on = true;
  } else{
    circles[0].locked = false;
  }
}

function mouseDragged() {
  if(circles[0].locked){
    cue.update(circles[0]);
    projection.update();
  }
}

function mouseReleased() {
  if(circles[0].locked){
    circles[0].shootMouse(cue);
    circles[0].locked = false;
    cue.on = false;
    cue.reset(circles[0]);
    projection.on = false;
    projection.reset(circles[0]);
  }
}

function keyReleased() {

}

function keyPressed() {
  if (keyCode === RIGHT_ARROW) {
    circles[0].xVelShot += 1;
    predictionView = false;
    predictShot();
  } else if (keyCode === LEFT_ARROW) {
    circles[0].xVelShot -= 1;
    predictionView = false;
    predictShot();
  } else if (keyCode === UP_ARROW) {
    circles[0].yVelShot += 1;
    predictionView = false;
    predictShot();
  } else if (keyCode === DOWN_ARROW) {
    circles[0].yVelShot -= 1;
    predictionView = false;
    predictShot();
  } else if (keyCode == ENTER){
    predictionView = false;
    circles[0].shoot();
  } else if (keyCode == 82) { // R
    predictionView = false;
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
