let width = 310, length = 310;

let sim = function(p) {
    p.setup = function() {
        p.createCanvas(length, width);
        reset(p);

    };
  
    p.draw = function() {
        p.background(255);


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
    this.textcolor = 'black';
    this.id = id;
    this.on = show;
}

Ball.prototype.show = function(p) {
    if(this.on){
        p.fill(255);
        p.strokeWeight(3);
        p.stroke(this.color);
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
            this.scaleArrows(p,1,this);
            drawArrow(p,this.v1,this.v3,color(0),this.id);
            let ang1 = circles[0].findAngle(this.v3.x,this.v3.y);
            p.textSize(18);
            p.noStroke();
            p.fill(this.textcolor);
            p.text("Vin", this.v1.x-5*Math.cos(ang1),this.v1.y-5*Math.sin(ang1));

        }
        if(this.v0 != this.v2){
            this.scaleArrows(p,2,this);
            drawArrow(p,this.v0,this.v2,color(0),this.id);
            let ang2 = circles[0].findAngle(this.v3.x,this.v3.y);
            p.noStroke();
            p.fill(this.textcolor);
            p.text("Vout", this.v0.x + this.v2.x + 5*Math.cos(ang2),this.v0.y + this.v2.y +5*Math.sin(ang2));

        }
        if(this.id === 0){
            angle = circles[0].findAngle(this.v2.x,-this.v2.y);
            p.noStroke();
            p.fill(this.textcolor);
            p.text('θ = ' + thetaf + "°",length/2 + 20,width/2);
            p.noFill();
            p.stroke(0);
            p.arc(width/2,length/2,30,30,TWO_PI - angle,TWO_PI);
        }
        }
    }
}

Ball.prototype.scaleArrows = function(p,mode,ball){
    if(ball.id === 0){
        arrowLength = 80;
    } else {
        arrowLength = 40;
    }
    if(mode === 1){
        let ang = circles[0].findAngle(ball.v3.x,ball.v3.y);
        ball.v3.x = arrowLength*Math.cos(ang);
        ball.v3.y = arrowLength*Math.sin(ang);
        ball.v1.x = width/2 - ball.v3.x;
        ball.v1.y = length/2 - ball.v3.y;
        
    } else if(mode === 2){
        let ang = circles[0].findAngle(ball.v2.x,ball.v2.y);
        ball.v2.x = arrowLength*Math.cos(ang);
        ball.v2.y = arrowLength*Math.sin(ang);
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
    whiteball = new Ball(p,length/2,width/2,length*0.3,0,0,0,0,color(0),0,true);
    otherball = new Ball(p,length/2,width/2,length*0.3,0,0,0,0,color(0),0,false);
}

drawArrow = function(p,base,vec,color,id){
    color = 'black';
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
