var elXVel,elYVel,elCoeffBumper,elCoeffBalls,elDecel,elProjectionMode,elOtherCalc,shootbutton,resetbutton,calculatebutton,el1,el2,el3,el4,el5;
let thetaf;

window.onload = () => {
  //Prevent right-click on simulation from bringing up the context menu
  document.oncontextmenu = function() {
  if (mouseX > 0 && mouseY > 0 && mouseX < width && mouseY < height)
    return false;
  }
  elXVel = document.querySelector("#xVel");
  elYVel = document.querySelector("#yVel");
  elCoeffBumper = document.querySelector("#coeffBumper");
  elCoeffBalls = document.querySelector("#coeffBalls");
  elDecel = document.querySelector("#Decel");
  elProjectionMode = document.querySelectorAll(".projection-mode-toggle");
  elOtherCalc = document.getElementsByClassName(".checkbox");
  el1 = document.querySelector("#e1");
  el2 = document.querySelector("#e2");
  el3 = document.querySelector("#e3");
  el4 = document.querySelector("#e4");
  el5 = document.querySelector("#e5");
  shootbutton = document.querySelector("#shootbutton");
  resetbutton = document.querySelector("#resetbutton");
  calculatebutton = document.querySelector("#calculatebutton");


  elXVel.onchange = () => {
    console.log("X Velocity: " + validateInput(elXVel));
    circles[0].xVelShot = parseFloat(elXVel.value).toFixed(3).replace('-0', '0');
    el1.innerHTML = parseFloat(elXVel.value).toFixed(3).replace('-0', '0');
  };

  elYVel.onchange = () => {
    console.log("Y Velocity: " + validateInput(elYVel));
    circles[0].yVelShot = parseFloat(elYVel.value).toFixed(3).replace('-0', '0');
    el2.innerHTML = parseFloat(elYVel.value).toFixed(3).replace('-0', '0');
  };

  elCoeffBumper.onchange = () => {
    wallCoefRest = parseFloat(elCoeffBumper.value).toFixed(2).replace('-0', '0');
    el3.innerHTML = parseFloat(elCoeffBumper.value).toFixed(2).replace('-0', '0');
  };

  elCoeffBalls.onchange = () => {
    circleCoefRest = parseFloat(elCoeffBalls.value).toFixed(2).replace('-0', '0');
    el4.innerHTML = parseFloat(elCoeffBalls.value).toFixed(2).replace('-0', '0');
  };

  elDecel.onchange = () => {
    circleAcceleration = -parseFloat(elDecel.value).toFixed(3).replace('-0', '0');
    el5.innerHTML = -parseFloat(elDecel.value).toFixed(3).replace('-0', '0');
  };

  elOtherCalc.onclick = function(){

  }

  shootbutton.onclick = () => {
    predictionView = false;
    ballhit = false;
    cue.on = false;
    cue.reset(circles[0]);
    circles[0].shoot();
    circles[0].xVelShot = 0;
    circles[0].yVelShot = 0;
    elXVel.value = parseFloat(circles[0].xVelShot).toFixed(3).replace('-0', '0');
    elYVel.value = parseFloat(circles[0].yVelShot).toFixed(3).replace('-0', '0');
    el1.innerHTML = parseFloat(circles[0].xVelShot).toFixed(3).replace('-0', '0');
    el2.innerHTML = parseFloat(circles[0].yVelShot).toFixed(3).replace('-0', '0');
  }

  resetbutton.onclick = () => {
    console.log("Reseting!");
    resetGame();
    reset();
    resetEquations();
    el1.innerHTML = 0;
    el2.innerHTML = 0;
    el3.innerHTML = 0.5;
    el4.innerHTML = 0.9;
    el5.innerHTML = -0.01;
    elXVel.value = 0;
    elYVel.value = 0;
    elCoeffBumper.value = 0.5;
    elCoeffBalls.value = 0.9;
    elDecel.value = -0.01;
  }
  
  calculatebutton.onclick = () => {
    if(!motion){
      predictionView = false;
      ballhit = false;
      predictShot();
    }
  }
  }

  for (const elProjectionModeBtn of elProjectionMode) {
    elProjectionModeBtn.onclick = function() {
      projectionMode = parseFloat(elProjectionModeBtn.firstElementChild.value);
      for (let elProjectionModeBtn2 of document.querySelectorAll(".projection-mode-toggle")) {
        if (this === elProjectionModeBtn2) {
          elProjectionModeBtn2.classList.add("projection-mode-toggle-active");
        } else {
          elProjectionModeBtn2.classList.remove("projection-mode-toggle-active");
        }
      }
    }
  }

function updateCalculations() {
  let vfx = Number.parseFloat(circles[0].xVel).toFixed(2);
  let vfy = Number.parseFloat(circles[0].yVel).toFixed(2);
  let vf = Number.parseFloat(Math.sqrt(vfx*vfx + vfy*vfy)).toFixed(2);
  thetaf = Number.parseFloat(circles[0].findAngle(vfx,-vfy)*(180/PI)).toFixed(2);

  let white;
  let whiteBallEquation = document.getElementById("white-ball-calculation");
  white =  `White Ball: \n \\[v_{f} = \\sqrt{(${vfx})^2 + (${-vfy})^2} = ${vf}\\] \n \\[\\qquad \\theta_f = \\arctan(\\frac{${-vfy}}{${vfx}})^{\\circ} = ${thetaf}^{\\circ}\\]`;
  whiteBallEquation.innerHTML = white;
  MathJax.typeset();
}

function validateInput(input) {
  if (parseFloat(input.value) > parseFloat(input.max) ) {
    input.value = input.max;
    return input.max;
  } else if (parseFloat(input.value) < parseFloat(input.min) || input.value == "") {
    input.value = input.min;
    return input.min;
  }
  return input.value;
}

function resetEquations(){
  let white;
  let whiteBallEquation = document.getElementById("white-ball-calculation");
  white = ``;
  whiteBallEquation.innerHTML = white;
}