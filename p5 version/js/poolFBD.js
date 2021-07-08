let width = 250, length = 250;

let sim = function(p) {
    p.setup = function() {
        p.createCanvas(length, width);
        reset(p);

    };
  
    p.draw = function() {
        p.background(10, 108, 3);


        otherball.show(p);
        whiteball.show(p);
        axes.show(p);
    };

}
 

let myp5 = new p5(sim, 'container1');

let Axis = function(p,l,w){
    this.p = p;
    this.l = l;
    this.w = w;
}

Axis.prototype.show = function(p){
    p.stroke(0);
    p.strokeWeight(0.5);
    p.line(this.l/2,0,this.l/2,this.w);
    p.line(0,this.w/2,this.l,this.w/2);
    p.fill(0);
    p.triangle(this.l/2,0,this.l/2+this.l/30,this.w/30,this.l/2-this.l/30,this.w/30);
    p.triangle(this.l,this.w/2,this.l-this.l/30,this.w/2-this.w/30,this.l-this.l/30,this.w/2+this.w/30);
    p.text('x',this.l-10,this.w/2-10)
    p.text('y',this.l/2+10,10);
}


let Ball =  function(p,x,y,r,xVel1,yVel1,xVel2,yVel2,color,id,show){
    this.p = p;
    this.x = x;
    this.y = y;
    this.rad = r;
    this.v0 = createVector(this.x,this.y);
    this.v1 = createVector(this.x- xVel1*10,this.x- yVel1*10);
    this.v2 = createVector( + xVel2*10, + yVel2*10);
    this.v3 = createVector(xVel1*10,yVel1*10);
    this.color = color;
    this.id = id;
    this.on = show;
}

Ball.prototype.show = function(p) {
    if(this.on){
        p.fill(this.color);
        p.noStroke();
        p.ellipse(this.x,this.y,this.rad);
        if(this.id > 8 && this.id < 16){
            p.fill(255);
            p.arc(this.x, this.y, this.rad, this.rad, PI/4, 3*PI/4, OPEN);
            p.arc(this.x, this.y, this.rad, this.rad, -3*PI/4, -PI/4, OPEN);
        }
        p.strokeWeight(2);
        p.stroke(0);
        p.fill(0);
        if(calc){
        if(this.v0 != this.v1 && this.id === 0){
            // p.line(this.x,this.y,this.v1.x,this.v1.y);
            drawArrow(p,this.v1,this.v3,color(0),this.id);
        }
        if(this.v0 != this.v2){
            // p.line(this.x,this.y,this.v2.x,this.v2.y);
            drawArrow(p,this.v0,this.v2,color(0),this.id);
        }
        if(this.id === 0){
            angle = circles[0].findAngle(this.v2.x,-this.v2.y);
            p.fill(255,0,0)
            p.text('θ = ' + thetaf ,length/2 + 20,width/2);
            p.noFill();
            p.stroke(255,0,0);
            p.arc(width/2,length/2,30,30,TWO_PI - angle,TWO_PI);
        }
        }
    }
}

Ball.prototype.updateVectors = function(xVel1,yVel1,xVel2,yVel2){
    this.v1.x = this.x- xVel1*10;
    this.v1.y = this.x- yVel1*10;
    this.v2.x =  + xVel2*10;
    this.v2.y = + yVel2*10;
    this.v3.x =  xVel1*10;
    this.v3.y =  yVel1*10;

}

reset = function(p){
    axes = new Axis(p,length,width);
    whiteball = new Ball(p,length/2,width/2,75,0,0,0,0,color(255),0,true);
    otherball = new Ball(p,length/2,width/2,75,0,0,0,0,color(255,255,0),0,false);
}

drawArrow = function(p,base,vec,color,id){
    if(id === 8){
        color = 'white';
    } else{
        color = 'black';
    }
    p.push();
    p.stroke(color);
    p.strokeWeight(3);
    p.fill(color);
    p.translate(base.x,base.y);
    p.line(0, 0, vec.x, vec.y);
    p.rotate(vec.heading());
    let arrowSize = 7;
    p.translate(vec.mag() - arrowSize, 0);
    p.triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    p.pop();
}
