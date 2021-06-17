// Declaring Variables

class whiteBall{
  constructor(){
    this.xpos = 600;
    this.ypos = 200;
    this.rad = 12.5;
    this.clicked = false;
    this.locked = false;
    this.linexpos = 250;
    this.lineypos = 200;
    this.arrow1x = this.linexpos + 10;
    this.arrow1y = this.lineypos - 10;
    this.arrow2x = this.linexpos + 10;
    this.arrow2y = this.lineypos + 10;
    this.arrowColor = 255;
  }

  click(){
    let d = dist(mouseX,mouseY,this.xpos,this.ypos);
    if(d < this.rad){
      this.clicked = true;
    } else{
      this.clicked = false;
    }
  }

  shoot(){

  }

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
    line(this.linexpos,this.lineypos,this.xpos,this.ypos);
    line(this.linexpos,this.lineypos,this.arrow1x,this.arrow1y);
    line(this.linexpos,this.lineypos,this.arrow2x,this.arrow2y);
  }
}

class redBall{
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

function setup() {
  createCanvas(700, 400);

  player = new whiteBall();
  target = new redBall();
};

function draw() {
  // Background 
  background(10, 108, 3);
  drawlines();
  // Hole
  fill(0);
  ellipse(100,200,35);
  // Player
  player.click();
  player.render();
  // Target ball
  target.render();
}

function drawlines(){
  stroke(0);
  strokeWeight(2);
  line(500,0,500,400);
  strokeWeight(10);
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
