  // labelled rgb values
  const COLORS = {
    "red": [255, 0, 0],
    "dimRed": [255, 0, 0, 75],
    "maroon": [128, 0, 0],
    "orange": [255, 165, 0],
    "yellow": [255, 255, 0],
    "green": [0, 90, 0],
    "purple": [85, 26, 139],
    "blue": [0, 0, 255],
    "white": 255,
    "black": 0,
    "lightBlack": 54,
    "blueGreen": [13, 186, 148],
    "darkBlueGreen": [11, 130, 90],
    "tableWood": [170,114,67]
  }
  
  class Wall {
    constructor(x, y, w, h, a) {
      const options = {
        friction: 0.5,
        restitution: 0.5,
        angle: a,
        isStatic: true
      }
      this.body = Bodies.rectangle(x, y, w, h, options);
      this.body.label = "wall";
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.a = a;
      World.add(world, this.body);
    }
  
    render() {
      push();
      fill(COLORS.tableWood);
      noStroke();
      translate(this.x, this.y)
      rotate(this.a);
      rectMode(CENTER);
      rect(0, 0, this.w, this.h);
      pop();
    }
  }
  
  class Bumper {
    constructor(x, y, w, h, a) {
      const options = {
        friction: 0.5,
        restitution: 0.5,
        angle: a,
        isStatic: true
      }
      this.body = Bodies.trapezoid(x, y, w, h, 0.12, options);
      this.body.label = "bumper";
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.a = a;
      this.vertices = this.body.vertices.reduce((accumulator, vertex) => {
        const v = [ vertex.x, vertex.y ];
        return accumulator.concat(v)
      }, []);
      World.add(world, this.body);
    }
  
    render() {
      const v = this.vertices;
      push();
      fill(COLORS.darkBlueGreen);
      noStroke();
      quad(v[0], v[1], v[2], v[3], v[4], v[5], v[6], v[7]);
      pop();
    }
  }
  
  class Pocket {
    constructor(x, y, r, isMiddle) {
      this.x = x;
      this.y = y;
      this.radius = r;
      this.isMiddle = isMiddle;
      const options = { isStatic: true }
      this.body = Bodies.circle(x, y, r/6, options);
      this.body.label = "pocket";
      World.add(world, this.body);
    }
  
    render() {
      fill(COLORS.black);
      noStroke();
      if (this.isMiddle) {
        const yAdjustment = this.y < height/2 ? -height/64 : height/64;
        ellipse(this.x, this.y + yAdjustment, this.radius);
      } else {
        ellipse(this.x, this.y, this.radius);
      }
    }
  }
  
  class SlingShot {
    constructor(x, y, body) {
      const options = {
        pointA: {
          x: x,
          y: y
        },
        bodyB: body,
        stiffness: 0.02,
      };
      this.isConstrained = true;
      this.sling = Constraint.create(options);
      World.add(world, [body,this.sling]);
    }
  
    shoot() {
      const timeoutID = setTimeout(() => {
        this.isConstrained = false;
        cue.show = false;
        World.remove(world, this.sling);
        clearTimeout(timeoutID);
      }, 25);
    }
  
    show() {
      if (this.isConstrained) {
        stroke(0);
        strokeWeight(4);
        const posA = this.sling.pointA;
        const posB = this.sling.bodyB.position;
        line(posA.x, posA.y, posB.x, posB.y);
      }
      if (this.isConstrained) {
        return;
      }
      // if the white ball is slow enough reset the constraint on the ball
      if (Math.abs(balls[0].body.velocity.x) <= 0.01 && Math.abs(balls[0].body.velocity.y) < 0.01) {
        this.isConstrained = true;
        const { x, y } = balls[0].body.position;
        this.sling.pointA.x = x;
        this.sling.pointA.y = y;
        World.add(world, this.sling);
      }
    }
  

  }

  class Cue {
    constructor(x,y,ball){
      this.position = createVector(x,y)
      this.width = 20
      this.length = 20
      this.col = cue
      this.show = true
      const options = {
        restitution: 0.9,
        friction: 0.05,
        density: 0.0001,
        collisionFilter: {
          category: this.col,
          mask: normal
        }
      }
      this.body = Bodies.rectangle(this.position.x,this.position.y,this.width,this.height,options)
      this.body.label = "cue";
      this.id = this.body.id;
      World.add(world,this.body)

      // slingshot = new SlingShot(this.body.position.x, this.body.position.y, this.body);
      // var canvasmouse = Mouse.create(canvas.elt);
      // var mouseConstraint = MouseConstraint.create(engine, {mouse:canvasmouse});
      // mouseConstraint.collisionFilter.mask = cue;
      // World.add(world, mouseConstraint);

      
    }

    update() {
      this.position.x = this.body.position.x;
      this.position.y = this.body.position.y;
    }

    render(){
      push();
      console.log("yes")
        fill(COLORS.blue);
        noStroke();
        rect(this.position.x - this.width/2,this.position.y - this.length/2,this.width,this.length);
        translate(this.body.position.x, this.body.position.y)
        rotate(this.body.angle)
      
      pop();
      if (Math.abs(balls[0].body.velocity.x) <= 0.01 && Math.abs(balls[0].body.velocity.y) < 0.01) {
        this.show = true;
      }
    }
  }

  class Ball {
    constructor(number, x, y) {
      this.position = createVector(x, y)
      this.radius = width/32
      this.number = number
      this.col = white
      if (number > 0){
        this.col = normal
      } 
      
        const options = {
          restitution: 0.9,
          friction: 0.05,
          density: 0.0001,
          collisionFilter: {
            category: this.col,
          }
        }

      this.body = Bodies.circle(
        this.position.x, this.position.y, this.radius/2, options
      )
      this.number !== 8 ? this.body.label = "ball" : this.body.label = "eightBall";
      this.number !== 0 ? this.body.label = "ball" : this.body.label = "whiteBall";

      this.id = this.body.id;
      World.add(world, this.body)

      if(this.number === 0){
        slingshot = new SlingShot(this.body.position.x, this.body.position.y, this.body);
        var canvasmouse = Mouse.create(canvas.elt);
        var mouseConstraint = MouseConstraint.create(engine, {mouse:canvasmouse});
        mouseConstraint.collisionFilter.mask = white;
        World.add(world, mouseConstraint);

      }

      }
    
    update() {
      this.position.x = this.body.position.x;
      this.position.y = this.body.position.y;
    }
  
    ballType() {
      if (this.number === 8) { 
        return "eight" ;
      } else if (this.number === 0){
        return "white";
      }
      return this.number < 8 ? "solid" : "stripe";
    }
  
    drawSolid(number, color) {
      fill(color)
      ellipse(0, 0, this.radius)
      fill(COLORS.white)
      ellipse(0, 0, this.radius/2)
      if(number !== 0){
        fill(COLORS.black)
        textAlign(CENTER, CENTER);
        text(number, 0, 0)
      }
    }
  
    drawStripe(number, color) {
      fill(COLORS.white)
      ellipse(0, 0, this.radius)
      fill(color)
      rectMode(CENTER);
      rect(0, 0, this.radius, this.radius/2, this.radius/(2*PI))
      fill(COLORS.white)
      ellipse(0, 0, this.radius/2)
      fill(COLORS.black)
      textAlign(CENTER, CENTER);
      text(number, 0, 0)
    }
  
    displaySolidBall(number) {
      switch (number) {
        case 0 : this.drawSolid(number, COLORS.white); break;
        case 1 : this.drawSolid(number, COLORS.yellow); break;
        case 2 : this.drawSolid(number, COLORS.blue); break;
        case 3 : this.drawSolid(number, COLORS.red); break;
        case 4 : this.drawSolid(number, COLORS.purple); break;
        case 5 : this.drawSolid(number, COLORS.orange); break;
        case 6 : this.drawSolid(number, COLORS.green); break;
        case 7 : this.drawSolid(number, COLORS.maroon); break;
        case 8 : this.drawSolid(number, COLORS.black); break;
        default: break;
      }
    }
  
    displayStripedBall(number) {
      switch (number) {
        case 9 : this.drawStripe(number, COLORS.yellow); break;
        case 10: this.drawStripe(number, COLORS.blue); break;
        case 11: this.drawStripe(number, COLORS.red); break;
        case 12: this.drawStripe(number, COLORS.purple); break;
        case 13: this.drawStripe(number, COLORS.orange); break;
        case 14: this.drawStripe(number, COLORS.green); break;
        case 15: this.drawStripe(number, COLORS.maroon); break;
        default: break;
      }
    }
  
    displayBall(number) {
      number <= 8 ? this.displaySolidBall(number) : this.displayStripedBall(number);
    }
  
    render() {
      push()
      translate(this.body.position.x, this.body.position.y)
      rotate(this.body.angle)
      this.displayBall(this.number)
      pop()
    }
  }

  const Engine = Matter.Engine;
  const World = Matter.World;
  const Bodies = Matter.Bodies;
  const Body = Matter.Body;
  const Events = Matter.Events;
  const Constraint = Matter.Constraint;
  const Mouse = Matter.Mouse;
  const MouseConstraint = Matter.MouseConstraint;
  
  let engine;
  let world;
  let slingshot;
  let cue;
  let white = 0x0001, normal = 0x0002;

  const exaustClouds = 25;
  
 
  let poolTableX = 1000; // width of the pool table (also the canvas width)
  let poolTableY = 500; // height of the pool table (also the canvas height)
  
  let balls = [];
  let walls = [];
  let bumpers = [];
  let pockets = [];
  
  let visibleWallOffset;
  
  
  let gameStarted = false;
  
  let replayButton;
  
  let countdownMode = true;
  let countdownText;
  let eightBallEarthquake = false;
  
  function resetGame() {

  
    // remove previous balls and setup new balls
    World.remove(world,cue.body)
    cue = new Cue(200,250,balls[0])
    balls.forEach(b => {
      World.remove(world, b.body);
    })
    balls = [];
    setupRackOfBalls();


  }
  
  function setup() {
    createCanvas(poolTableX, poolTableY);
  
    visibleWallOffset = width/32;
  
    engine = Engine.create();
    world = engine.world;
  
    // disable matter.js gravity (top-down game)
    engine.world.gravity.y = 0;
  
    //collision detection (pockets should make balls disappear)
    Events.on(engine, 'collisionStart', collision);
  
    addWalls();
    addBumpers();
    addPockets();
  

  

    setupRackOfBalls();
    cue = new Cue(200,250,balls[0])
    gameStarted = true;
  }
  
  function collision(event) {
    const pairs = event.pairs;
    for (let i = 0; i < pairs.length; i++) {
      const labelA = pairs[i].bodyA.label;
      const labelB = pairs[i].bodyB.label;
      if (labelA === 'pocket' && labelB === 'ball') {
        removeBall(pairs[i].bodyB);
      } else if (labelA === 'ball' && labelB === 'pocket') {
        removeBall(pairs[i].bodyA);
      } else if ((labelA === 'ball' || labelA === 'eightBall'|| labelB === 'whiteBall') &&
                  labelB === 'wall') {
        // matterjs BUG: ball has gone through bumper
        resetBallPosition(pairs[i].bodyA);
      } else if ((labelB === 'ball' || labelB === 'eightBall' || labelB === 'whiteBall') &&
                  labelA === 'wall') {
        // matterjs BUG: ball has gone through bumper
        resetBallPosition(pairs[i].bodyB);
      }
    }
  }
  
  function resetBallPosition(ballBody) {
    const ballId = ballBody.id;
    const matches = balls.filter(b => b.body.id === ballId);
    const ball = matches.length > 0 ? matches[0] : null;
    if (ball) {
      setBallBackInBounds(ball);
    }
  }
  
  function setBallBackInBounds(ball) {
    const visibleWallOffset = width/32;
    const bumperThickness = width/108;
    const edgeOffset = visibleWallOffset + bumperThickness;
    const xPos = ball.body.position.x;
    const yPos = ball.body.position.y;
    let x = xPos, y = yPos;
    if (xPos < edgeOffset) {
      x = edgeOffset + 1;
    }
    if (xPos > width - edgeOffset) {
      x = width - edgeOffset - 1
    }
    if (yPos < edgeOffset) {
      y = edgeOffset + 1
    }
    if (yPos > height - edgeOffset) {
      y = height - edgeOffset - 1
    }
    Body.setPosition(ball.body, { x, y });
  }
    

  
  function removeBall(body) {
    const bodyId = body.id;
    World.remove(world, body);
    for (let i = balls.length - 1; i >= 0; i--) {
      if (bodyId == balls[i].id) {
        balls.splice(i, 1);
      }
    }
  }
  
  // helper method to shuffle ball order
  function shuffleArray(array) {
      for (var i = array.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
  }
  
  function getRandomizedBallOrderArray() {
    let solidBalls = [1, 2, 3, 4, 5, 6, 7];
    let stripedBalls = [9, 10, 11, 12, 13, 14, 15];
    // eight ball in the back middle. everything else is random.
    let nonEightBalls = solidBalls.concat(stripedBalls);
  
    shuffleArray(nonEightBalls);
  
    let firstTwelve = nonEightBalls.slice(0, 12);
    let firstThirteen = firstTwelve.concat(8);
    let lastTwo = nonEightBalls.slice(12, 14);
    const randomizedBallOrderArray = firstThirteen.concat(lastTwo);
    return randomizedBallOrderArray;
  }
  
  function setupRackOfBalls() {
    const centerX = 0.68 * width;
    const centerY = 0.5 * height;
    const ballDiameter = width/32;
    const ballNums = getRandomizedBallOrderArray();
  
    let row = 1;
    let y = centerY;
    let x = centerX + ballDiameter;
    balls.push(new Ball(0,200,250))
    balls.push(new Ball(ballNums[0], x, y));
    for (let i = 1; i <= 14; i++) {
      if ([1, 3, 6, 10].indexOf(i) > -1) {
        row++;
        x += ballDiameter;
        y = centerY - ((row - 1) * ballDiameter * 0.5)
      } else {
        y += ballDiameter;
      }
      balls.push(new Ball(ballNums[i], x, y));
    }
  }
  
  function keyReleased() {
    if (keyCode == UP_ARROW || keyCode == DOWN_ARROW) {

    } else if (keyCode == RIGHT_ARROW || keyCode == LEFT_ARROW) {

    }
  }
  
  function keyPressed() {
    if (keyCode === RIGHT_ARROW) {

    } else if (keyCode === LEFT_ARROW) {

    } else if (keyCode === UP_ARROW) {

    } else if (keyCode === DOWN_ARROW) {

    } else if (keyCode === 82) {
      resetGame();
    } else if (keyCode === 80) {
      
    }
  }

  function mousePressed(){
 
  }

  function mouseReleased(){
    setTimeout(() => {
      slingshot.shoot();

    }, 25);
  }
  
  function draw() {
    if (gameStarted) {
      drawGame();
      let gameOver = isGameOver();
      if (!gameOver) { updateGame() };
    }
  }
  
  function updateGame() {
    Engine.update(engine);
    
    balls.forEach(b => b.update())
    cue.update();

  }
  
  function drawGame() {
    drawPoolTable()

    balls.length > 0 ? balls.forEach(b => b.render()) : setupRackOfBalls();
    slingshot.show();
    cue.render();

  }
  
  function isGameOver() {
    let gameOver = false;
    const stripes = balls.filter(b => b.ballType() === 'stripe').length;
    const solids = balls.filter(b => b.ballType() === 'solid').length;
    if (stripes === 0) {
      gameOver = true;
      this.gameOver(winner = "stripe");
    } else if (solids === 0) {
      gameOver = true;
      this.gameOver(winner = "solid");
    }
    return gameOver;
  }
  
  function distanceBetween(object1, object2) {
    const a2 = Math.pow(object1.position.x - object2.position.x, 2);
    const b2 = Math.pow(object1.position.y - object2.position.y, 2);
    return a2 + b2;
  }
  
  function drawPoolTable() {
    background(COLORS.blueGreen);
    walls.forEach(w => w.render());
    bumpers.forEach(b => b.render());
    pockets.forEach(p => p.render());
  }
  
  function addWalls() {
    const wallThickness = 500;
    const wt2 = wallThickness/2;
  
    bottomWall = new Wall(width/2, height + wt2 - visibleWallOffset, width, wallThickness, 0);
    topWall = new Wall(width/2, -wt2 + visibleWallOffset, width, wallThickness, 0);
  
    leftWall = new Wall(-wt2 + visibleWallOffset, height/2, height, wallThickness, PI/2);
    rightWall = new Wall(width + wt2 - visibleWallOffset, height/2, height, wallThickness, PI/2);
  
    walls.push(topWall); walls.push(bottomWall);
    walls.push(leftWall); walls.push(rightWall);
  }
  
  function addBumpers() {
    const bumperThickness = width/108;
    const adjustedWidth = width - visibleWallOffset*2;
  
    bottomLeftBumper = new Bumper(adjustedWidth/4 + visibleWallOffset, height - visibleWallOffset, adjustedWidth/2, bumperThickness, 0);
    bottomRightBumper = new Bumper(3*adjustedWidth/4 + visibleWallOffset, height - visibleWallOffset, adjustedWidth/2, bumperThickness, 0);
  
    topLeftBumper = new Bumper(adjustedWidth/4 + visibleWallOffset, visibleWallOffset, adjustedWidth/2, bumperThickness, -PI);
    topRightBumper = new Bumper(3*adjustedWidth/4 + visibleWallOffset, visibleWallOffset, adjustedWidth/2, bumperThickness, -PI);
  
    leftBumper = new Bumper(visibleWallOffset, height/2, height - visibleWallOffset*2, bumperThickness, PI/2);
    rightBumper = new Bumper(width - visibleWallOffset, height/2, height - visibleWallOffset*2, bumperThickness, -PI/2);
  
    bumpers.push(topLeftBumper); bumpers.push(topRightBumper);
    bumpers.push(leftBumper); bumpers.push(rightBumper);
    bumpers.push(bottomLeftBumper); bumpers.push(bottomRightBumper);
  }
  
  function addPockets() {
    const radius = width/24,
          topY = visibleWallOffset,
          bottomY = height - visibleWallOffset,
          leftX = visibleWallOffset,
          middleX = width/2,
          rightX = width - visibleWallOffset;
  
    [leftX, middleX, rightX].forEach((x) => {
      [topY, bottomY].forEach((y) => {
        if (x === middleX) {
          pockets.push(new Pocket(x, y, radius, isMiddle = true));
        } else {
          pockets.push(new Pocket(x, y, radius, isMiddle = false));
        }
      })
    })
  }