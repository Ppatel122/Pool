
// White Ball Class
class whiteBall{
  constructor(){
    this.xpos = 600;
    this.ypos = 200;
    this.rad = 12.5;
    this.clicked = false;
    this.locked = false;
    this.projection = false;
    this.linexpos = 250;
    this.lineypos = 200;
    this.arrow1x = this.linexpos + 10;
    this.arrow1y = this.lineypos - 10;
    this.arrow2x = this.linexpos + 10;
    this.arrow2y = this.lineypos + 10;
    this.arrowColor = 255;
  }
  // Checks to see if Ball is clicked
  click(){
    let d = dist(mouseX,mouseY,this.xpos,this.ypos);
    if(d < this.rad){
      this.clicked = true;
    } else{
      this.clicked = false;
    }
  }
  // 
  shoot(){

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
    if(this.projection){
      line(this.linexpos,this.lineypos,this.xpos,this.ypos);
      line(this.linexpos,this.lineypos,this.arrow1x,this.arrow1y);
      line(this.linexpos,this.lineypos,this.arrow2x,this.arrow2y);
    }
  }
}

class Ball{
  constructor(){
    this.xpos = 350;
    this.ypos = 200;
    this.rad = 12.5;
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

function setup() {
  createCanvas(700, 400);
  createHoles();
  player = new whiteBall();
  target = new Ball();
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
  line(500,0,500,400);
  stroke(170,114,67);
  strokeWeight(35);
  line(0,1,700,1);
  line(0,399,700,399);
  line(699,0,699,400);
  line(1,0,1,400);
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
    player.linexpos = player.xpos - 400;
    player.lineypos = player.ypos; 
    player.arrow1x = player.linexpos + 10;
    player.arrow1y = player.lineypos - 10;
    player.arrow2x = player.linexpos + 10;
    player.arrow2y = player.lineypos + 10;
    if(player.xpos >= 700){
      player.xpos = 700;
    } else if(player.xpos <= 500){
      player.xpos = 500;
    }

    if(player.ypos <= 0){
      player.ypos = 0;
    } else if(player.ypos >= 400){
      player.ypos = 400;
    }
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
    player.xpos += 5;
  } else if (keyCode === LEFT_ARROW) {
    player.xpos -= 5;
  } else if (keyCode === UP_ARROW) {

  } else if (keyCode === DOWN_ARROW) {

  } else if (keyCode === 32 ) { // SpaceBar
    player.shoot();
  } else if (keyCode === 81) { // Q
    gameStarted = !gameStarted;
  }i
}
