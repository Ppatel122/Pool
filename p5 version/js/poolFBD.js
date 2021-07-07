let sim = function(p) {
    p.setup = function() {
        p.createCanvas(200, 200);
        reset(p);

    };
  
    p.draw = function() {
        p.background(10, 108, 3);
        whiteball.show(p);
        otherball.show(p);
    };

}
 

let myp5 = new p5(sim, 'container1');

let Ball =  function(p,x,y,r,xVel1,yVel1,xVel2,yVel2,color,id,show){
    this.p = p;
    this.x = x;
    this.y = y;
    this.rad = r;
    this.xVelI = xVel1;
    this.yVelI = yVel1;
    this.xVelF = xVel2;
    this.yVelF = yVel2;
    this.color = color;
    this.id = id;
    this.on = show;
}

Ball.prototype.show = function(p) {
    if(this.on){
        p.fill(this.color);
        p.noStroke();
        p.ellipse(this.x,this.y,this.rad)
        if(this.id > 8 && this.id < 16){
            p.fill(255);
            p.arc(this.x, this.y, this.rad, this.rad, PI/4, 3*PI/4, OPEN);
            p.arc(this.x, this.y, this.rad, this.rad, -3*PI/4, -PI/4, OPEN);
        }
        p.strokeWeight(2);
        p.stroke(255,0,0);
        p.line(this.x,this.y,this.x - this.xVelI*10,this.y - this.yVelI*10);
        p.stroke(0);
        p.line(this.x,this.y,this.x + this.xVelF*10,this.y + this.yVelF*10);

    }
}

Ball.prototype.updateVectors = function(xVel1,yVel1,xVel2,yVel2){
    this.xVelI = xVel1;
    this.yVelI = yVel1;
    this.xVelF = xVel2;
    this.yVelF = yVel2;
}

reset = function(p){
    whiteball = new Ball(p,100,100,50,0,0,0,0,color(255),0,true);
    otherball = new Ball(p,100,100,50,0,0,0,0,color(255,255,0),0,false);
}
