// The code is really messy at the moment (Many lines are hard coded, will fix at the end)

let circles = []; // array to hold all Circle objects
let holes = []; // array to hold all Hole objects
let bumpers = []; // array to hold all Bumper objects
let projectionLines = []; // array to hold all Projection lines


let poolTableX = 1000; // width of the pool table (also the canvas width)
let poolTableY = 500; // height of the pool table (also the canvas height)
let poolTableBorder = 30; // width of the border around the pool table
let bumperLength = 6; // width of the bumpers around the pool table
let bumperIndent = 2; // length of the corner cut-outs on the bumpers
let cornerHoleShift = 5; // the distance that the corner holes are shifted away from the border
let middleHoleShift = 5; // the distance that the middle holes are shifted away from the border
let holeRadius = 20; // radius of the holes

let wallT = poolTableBorder + bumperLength; // position of the top wall (used for collision)
let wallB = poolTableY - poolTableBorder - bumperLength; // position of the bottom wall (used for collision)
let wallL = poolTableBorder + bumperLength; // position of the left wall (used for collision)
let wallR = poolTableX - poolTableBorder - bumperLength; // position of the right wall (used for collision)

let wallCoefRest = 0.5; // coefficient of restitution for collisions between circles and walls
let circleCoefRest = 0.9; // coefficient of restitution for collisions between multiple circles
let circleAcceleration = -0.01; // circleAcceleration is in units/frame^2
let projectionMode = 3;


let predictionView = false;
let directionView = true;
let motion  = false;
let ballHit = false;


function setup() {
  frameRate(144);
  var canvas = createCanvas(poolTableX, poolTableY);
  canvas.parent("container");
  resetGame();
};

function drawTable(){
  background(10, 108, 3);
  drawBorder();

  for (let i = 0; i < bumpers.length;i++){
    bumpers[i].show();
  }

  for (let i=0; i < holes.length; i++) {
    holes[i].show();
  }
}
function draw() {
  console.log(backgroundShot);
  if(!backgroundShot){
    drawTable();
  } else {
    for(let i = 0; i < projectionLines.length; i++){
      projectionLines[i].show();
      
    }
  }
  for (let i=0; i < circles.length; i++) {

    

    if(!backgroundShot){
      circles[i].show();
    }

    circles[i].click();
    

    for(let j = 0; j < bumpers.length;j++){
      circles[i].bumperCollision(bumpers[j],wallCoefRest);
    }

    for(let j = 0; j < holes.length;j++){
      circles[i].holeCollision(holes[j]);
    }

    for (let j=i+1; j < circles.length; j++) {
        if (circles[i].circleCollisionCheck(circles[j])) {
            circles[i].circleCollisionCalc(circles[j], circleCoefRest);

        }
    }

    circles[i].accelerate(circleAcceleration);
  }

  for (let i=0; i < circles.length; i++) {
    circles[i].move();
    circles[i].show();
  }

  // text(circles[0].xVelShot, 100, 20);
  // text(circles[0].yVelShot, 120, 20);
  // text(frameRate(), 140, 20);

  if (predictionView) {
    for (let i=0; i < circles.length; i++) {
      if(!circles[i].potted){
        switch(projectionMode){
          case 1:
            if(i === 0){
              drawProjections(i);
            }
            break;
          case 2:

          case 3:
            drawProjections(i);
            break;
        }
      }
    }
  }

  if (directionView && !motion) {
    if (circles[0].xVelShot != 0 || circles[0].yVelShot != 0) {
      strokeWeight(3);
      stroke(0);
      line(circles[0].x, circles[0].y, circles[0].x + circles[0].xVelShot*3, circles[0].y - circles[0].yVelShot*3);
    }
  }
  cue.show();

  checkForMotion();
  if(!motion && !cue.on && circles[0].locked){
    cue.update(circles[0]);
    cue.on = true;
  }
  if(!motion && ballHit){
    ballHit = false;
  }
}

function drawProjections(i){
  for (let j=1; j < circles[i].xCollisions.length; j++) {
    strokeWeight(1);
    stroke(circles[i].color);
    line(circles[i].xCollisions[j-1], circles[i].yCollisions[j-1], circles[i].xCollisions[j], circles[i].yCollisions[j]);
  }

}

// creates objects on table
// press "R" to reset the table to this position
function resetGame(){
  circles = [];
  holes = [];
  bumpers = [];
  projectionLines = [];

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
  circles.push(new Circle(775, 262.5, 0, 0, 12.5, 10, color(255, 255, 0), 1)); // Yellow
  circles.push(new Circle(725, 237.5, 0, 0, 12.5, 10, color(0, 0, 255),   2)); // Blue
  circles.push(new Circle(750, 275, 0, 0, 12.5, 10, color(255, 0, 0),     3)); // Red
  circles.push(new Circle(725, 262.5, 0, 0, 12.5, 10, color(90, 25, 140), 4)); // Purple
  circles.push(new Circle(800, 300, 0, 0, 12.5, 10, color(255, 160, 0),   5)); // Orange
  circles.push(new Circle(775, 212.5, 0, 0, 12.5, 10, color(0, 255, 0),   6)); // Green
  circles.push(new Circle(800, 225, 0, 0, 12.5, 10, color(128, 0, 0),     7)); // Maroon
  // STRIPES
  circles.push(new Circle(700, 250, 0, 0, 12.5, 10, color(255, 255, 0),   9)); // Yellow
  circles.push(new Circle(775, 287.5, 0, 0, 12.5, 10, color(0, 0, 255),   10)); // Blue
  circles.push(new Circle(775, 237.5, 0, 0, 12.5, 10, color(255, 0, 0),   11)); // Red
  circles.push(new Circle(800, 200, 0, 0, 12.5, 10, color(90, 25, 140),   12)); // Purple
  circles.push(new Circle(800, 250, 0, 0, 12.5, 10, color(255, 160, 0),   13)); // Orange
  circles.push(new Circle(800, 275, 0, 0, 12.5, 10, color(0, 255, 0),     14)); // Green
  circles.push(new Circle(750, 225, 0, 0, 12.5, 10, color(128, 0, 0),     15)); // Maroon

  cue = new Cue(circles[0]);
}
function checkForMotion(){
  motion = false;
  for(let i = 0; i < circles.length;i++){
    if(circles[i].xVel != 0 || circles[i].yVel != 0){
      motion = true;
    }
  }
}
// predicts a shot and draws lines
// press Q to run the prediction
function predictShot() {
  console.log(circles[0].xVelShot,circles[0].yVelShot);
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

  for (let k=0; k<10000; k++) {
    for (let i=0; i < circles.length; i++) {
      
      for(let j = 0; j < bumpers.length;j++){
        circles[i].bumperCollision(bumpers[j],wallCoefRest);
      }

      for(let j = 0; j < holes.length;j++){
        circles[i].holeCollision(holes[j]);
      }
      


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

class Line{
  constructor(x1,y1,x2,y2,color){
    this.x1 = x1
    this.y1 = y1
    this.x2 = x2
    this.y2 = y2
    this.color = color
  }

  show(){
    stroke(this.color);
    strokeWeight(1);
    line(this.x1,this.y1,this.x2,this.y2);
  }
}

class Cue{
  constructor(ball){
    this.x1 = ball.x
    this.y1 = ball.y
    this.x2 = ball.x
    this.y2 = ball.y
    this.on = true
  }
  update(ball,x = mouseX, y = mouseY){
    this.x1 = ball.x;
    this.x2 = x;
    this.y1 = ball.y;
    this.y2 = y;
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


class Circle {
  constructor(x, y, xVel, yVel, radius = 10, mass = 1, color = color(255), number = 0) {
    this.x = x;
    this.y = y;
    this.xInit = x;
    this.yInit = y;
    this.xPrev = x;
    this.yPrev = y;
    this.xVel = xVel;
    this.yVel = yVel;
    this.radius = radius;
    this.diameter = radius*2;
    this.mass = mass;
    this.color = color;
    this.number = number;

    this.xVelShot = 0;
    this.yVelShot = 0;
    this.xCollisions = [];
    this.yCollisions = [];

    this.clickable = true;
    this.clicked = false;
    this.locked = false;

  }

  move() {
    this.x += this.xVel;
    this.y += this.yVel;

  }

  show() {
    if(!this.potted){
      noStroke();
      if(this.locked) {
        stroke(0);
        strokeWeight(4);
      }

      fill(this.color);
      circle(this.x, this.y, this.diameter);
      if (this.number >= 9 && this.number <= 15) {
        fill(255);
        arc(this.x, this.y, this.diameter, this.diameter, PI/4, 3*PI/4, OPEN);
        arc(this.x, this.y, this.diameter, this.diameter, -3*PI/4, -PI/4, OPEN);
      }
    }
  }

  shoot() {
    for (let i=0; i < circles.length; i++) {
      circles[i].xCollisions = [];
      circles[i].yCollisions = [];

    }
    console.log(this.xVelShot,this.yVelShot);
    this.xVel = +this.xVelShot;
    this.yVel = -this.yVelShot;

  }


  resetWhite(hole){
    if(predictionView){
      this.x = 200;
      this.y = 250;
      this.xVel = 0;
      this.yVel = 0;
    } else {
      this.x = 200;
      this.y = 250;
      this.xVel = 0;
      this.yVel = 0;
    }

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


  holeCollision(hole){
    if(dist(this.x,this.y,hole.x,hole.y) < hole.radius){
      this.xCollisions.push(this.x);
      this.yCollisions.push(this.y);
      this.x = hole.x;
      this.y = hole.y;
      this.xVel = 0;
      this.yvel = 0;
      if(!predictionView){
      if(this.number === 0){
        this.resetWhite(hole);
        return;

      }
        this.potted = true;
      }
    }
  }

  wallCollision(xMin, xMax, yMin, yMax, coefRest = 1) {
    if (this.x > xMax - this.radius)  {
      this.x = xMax - this.radius;
      this.xVel = -abs(this.xVel)*coefRest;
      this.xCollisions.push(this.x);
      this.yCollisions.push(this.y);
    } else if (this.x < xMin + this.radius) {
      this.x = xMin + this.radius;
      this.xVel = abs(this.xVel)*coefRest;
      this.xCollisions.push(this.x);
      this.yCollisions.push(this.y);
    }

    if (this.y > yMax - this.radius)  {
      this.y = yMax - this.radius;
      this.yVel = -abs(this.yVel)*coefRest;
      this.xCollisions.push(this.x);
      this.yCollisions.push(this.y);
    } else if (this.y < yMin + this.radius) {
      this.y = yMin + this.radius;
      this.yVel = abs(this.yVel)*coefRest;

      this.xCollisions.push(this.x);
      this.yCollisions.push(this.y);

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
    let vtxi = this.xVel;
    let vtyi = this.yVel;
    let voxi = otherCircle.xVel;
    let voyi = otherCircle.yVel;

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

    if(predictionView && this.number === 0 && !ballHit){
      ballHit = true;
      otherball.on = true;
      otherball.x = (otherCircle.x - this.x)*2 + whiteball.x
      otherball.y = (otherCircle.y - this.y)*2 + whiteball.y
      otherball.color = otherCircle.color;
      otherball.id = otherCircle.number;
      whiteball.updateVectors(vtxi,vtyi,this.xVel,this.yVel);
      otherball.updateVectors(voxi,voyi,otherCircle.xVel,otherCircle.yVel);
      updateCalculations();
    }
    
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
  constructor(x1, y1, x2, y2, x3, y3, x4, y4, id) {
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


function updateSliders(){

}

function mousePressed() {

  if(circles[0].clicked){
    circles[0].locked = true;
    stroke(0);
  } else{
    circles[0].locked = false;

  }
}

function mousePressed() {
  // if(circles[0].clicked){
  //   circles[0].locked = true;
  //   cue.on = true;
  //   projection.on = true;

  // } else{
  //   circles[0].locked = false;
  // }
}

function mouseDragged() {
  if(circles[0].locked){
    circles[0].xVelShot = (mouseX - circles[0].x) * -0.1;
    circles[0].yVelShot = (mouseY - circles[0].y) * 0.1;
    elXVel.value = parseFloat(circles[0].xVelShot).toFixed(3).replace('-0', '0');
    elYVel.value = parseFloat(circles[0].yVelShot).toFixed(3).replace('-0', '0');
    el1.innerHTML = parseFloat(circles[0].xVelShot).toFixed(3).replace('-0', '0');
    el2.innerHTML = parseFloat(circles[0].yVelShot).toFixed(3).replace('-0', '0');
    cue.update(circles[0]);

  }
}

function mouseReleased() {
  circles[0].locked = false;
}

function keyReleased() {

}

function keyPressed() {
  if (keyCode === RIGHT_ARROW) {
    circles[0].xVelShot += 1;
    predictionView = false;
    ballhit = false;
    predictShot();

  } else if (keyCode === LEFT_ARROW) {
    circles[0].xVelShot -= 1; 
    predictionView = false;
    ballhit = false;
    predictShot();

  } else if (keyCode === UP_ARROW) {
    circles[0].yVelShot += 1;
    predictionView = false;
    ballhit = false;
    predictShot();

  } else if (keyCode === DOWN_ARROW) {
    circles[0].yVelShot -= 1;
    predictionView = false;
    ballhit = false;
    predictShot();

  } else if (keyCode === ENTER){
    predictionView = false;
    ballhit = false;
    cue.on = false;
    cue.reset(circles[0]);
    circles[0].shoot();
    circles[0].xVelShot = 0;
    circles[0].yVelShot = 0;
  } else if (keyCode === 82) { 
    
  } else if (keyCode === 81) { // Q
    if(!motion){
    predictionView = false;
    ballhit = false;
    predictShot();

    }
  } else if (keyCode === 69) { // E
    directionView = !directionView;
  }
}