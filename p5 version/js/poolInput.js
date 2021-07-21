var elAxis,elXVel,elYVel,elVel,elAng,elCoeffBumper,elCoeffBalls,elRoll,elProjectionMode,elCoordinateSystem,elOtherCalc,shootbutton,resetbutton,calculatebutton,el1,el2,el3,el4,el5,el6,el7;
let thetaf;

window.onload = () => {
  //Prevent right-click on simulation from bringing up the context menu
  document.oncontextmenu = function() {
    console.log(mouseX,mouseY,width,length);
  if (mouseX > 0 && mouseY > 0 && mouseX < 1000 && mouseY < 500){
    return false;
  }
  }
  // document.addEventListener('contextmenu', event => event.preventDefault());
  elXVel = document.querySelectorAll("#xVel");
  elYVel = document.querySelectorAll("#yVel");
  elVel = document.querySelectorAll("#Vel");
  elAng = document.querySelectorAll("#Ang");
  elCoeffBumper = document.querySelector("#coeffBumper");
  elCoeffBalls = document.querySelector("#coeffBalls");
  elRoll = document.querySelector("#coeffRoll");
  elProjectionMode = document.querySelectorAll(".projection-mode-toggle");
  elCoordinateSystem = document.querySelectorAll(".coordinate-system-toggle");
  elOtherCalc = document.querySelector("#calculation-toggle");
  elAxis = document.querySelector("#axis-toggle");
  el1 = document.querySelector("#e1");
  el2 = document.querySelector("#e2");
  el3 = document.querySelector("#e3");
  el4 = document.querySelector("#e4");
  el5 = document.querySelector("#e5");
  el6 = document.querySelector("#e6");
  el7 = document.querySelector("#e7");
  shootbutton = document.querySelector("#shootbutton");
  resetbutton = document.querySelector("#resetbutton");

  elXVel[0].onchange = () => {
    circles[0].xVelShot = parseFloat(elXVel[0].value).toFixed(3).replace('-0', '0');
    el1.innerHTML = parseFloat(elXVel[0].value).toFixed(3).replace('-0', '0');
    elXVel[1].value = elXVel[0].value;
    circles[0].vel = circles[0].findVelocity();
    circles[0].angle = circles[0].findAngle(circles[0].xVelShot,circles[0].yVelShot);
    updateControls();
    predictionView = false;
    ballhit = false;
    ballNum = 0;
    predictShot();
  };

  elXVel[1].onchange = () => {
    circles[0].xVelShot = parseFloat(elXVel[1].value).toFixed(3).replace('-0', '0');
    el1.innerHTML = parseFloat(elXVel[1].value).toFixed(3).replace('-0', '0');
    elXVel[0].value = elXVel[1].value;
    circles[0].vel = circles[0].findVelocity();
    circles[0].angle = circles[0].findAngle(circles[0].xVelShot,circles[0].yVelShot);
    updateControls();
    predictionView = false;
    ballhit = false;
    ballNum = 0;
    predictShot();
  };

  elYVel[0].onchange = () => {
    circles[0].yVelShot = parseFloat(elYVel[0].value).toFixed(3).replace('-0', '0');
    el2.innerHTML = parseFloat(elYVel[0].value).toFixed(3).replace('-0', '0');
    elYVel[1].value = elYVel[0].value;
    circles[0].vel = circles[0].findVelocity();
    circles[0].angle = circles[0].findAngle(circles[0].xVelShot,circles[0].yVelShot);
    updateControls();
    predictionView = false;
    ballhit = false;
    ballNum = 0;
    predictShot();
  };

  elYVel[1].onchange = () => {
    circles[0].yVelShot = parseFloat(elYVel[1].value).toFixed(3).replace('-0', '0');
    el2.innerHTML = parseFloat(elYVel[1].value).toFixed(3).replace('-0', '0');
    elYVel[0].value = elYVel[1].value;
    circles[0].vel = circles[0].findVelocity();
    circles[0].angle = circles[0].findAngle(circles[0].xVelShot,circles[0].yVelShot);
    updateControls();
    predictionView = false;
    ballhit = false;
    ballNum = 0;
    predictShot();
  };

  elVel[0].onchange = () => {
    circles[0].vel = parseFloat(elVel[0].value).toFixed(3).replace('-0', '0');
    el6.innerHTML = parseFloat(elVel[0].value).toFixed(3).replace('-0', '0');
    elVel[1].value = elVel[0].value;
    circles[0].xVelShot = Math.cos(circles[0].angle)*circles[0].vel;
    circles[0].yVelShot = Math.sin(circles[0].angle)*circles[0].vel;
    updateControls();
    predictionView = false;
    ballhit = false;
    ballNum = 0;
    predictShot();
  };

  elVel[1].onchange = () => {
    circles[0].vel = parseFloat(elVel[1].value).toFixed(3).replace('-0', '0');
    el6.innerHTML = parseFloat(elVel[1].value).toFixed(3).replace('-0', '0');
    elVel[0].value = elVel[1].value;
    circles[0].xVelShot = Math.cos(circles[0].angle)*circles[0].vel;
    circles[0].yVelShot = Math.sin(circles[0].angle)*circles[0].vel;
    updateControls();
    predictionView = false;
    ballhit = false;
    ballNum = 0;
    predictShot();
  };

  elAng[0].onchange = () => {
    circles[0].angle = ((parseFloat(elAng[0].value))*(PI/180));
    el7.innerHTML = ((parseFloat(elAng[1].value))*(PI/180)).toFixed(2).replace('-0', '0');
    elAng[1].value = elAng[0].value;
    circles[0].xVelShot = Math.cos(circles[0].angle)*circles[0].vel;
    circles[0].yVelShot = Math.sin(circles[0].angle)*circles[0].vel;
    updateControls();
    predictionView = false;
    ballhit = false;
    ballNum = 0;
    predictShot();
  };

  elAng[1].onchange = () => {
    circles[0].angle = ((parseFloat(elAng[1].value))*(PI/180));
    el7.innerHTML = ((parseFloat(elAng[1].value))*(PI/180)).toFixed(2).replace('-0', '0');
    elAng[0].value = elAng[1].value;
    circles[0].xVelShot = Math.cos(circles[0].angle)*circles[0].vel;
    circles[0].yVelShot = Math.sin(circles[0].angle)*circles[0].vel;
    updateControls();
    predictionView = false;
    ballhit = false;
    ballNum = 0;
    predictShot();
  };

  elCoeffBumper.onchange = () => {
    wallCoefRest = parseFloat(elCoeffBumper.value).toFixed(2).replace('-0', '0');
    el3.innerHTML = parseFloat(elCoeffBumper.value).toFixed(2).replace('-0', '0');
  };

  elCoeffBalls.onchange = () => {
    circleCoefRest = parseFloat(elCoeffBalls.value).toFixed(2).replace('-0', '0');
    el4.innerHTML = parseFloat(elCoeffBalls.value).toFixed(2).replace('-0', '0');
  };

  elRoll.onchange = () => {
    coeffRoll = parseFloat(elRoll.value).toFixed(3).replace('-0', '0');
    el5.innerHTML = parseFloat(elRoll.value).toFixed(3).replace('-0', '0');
  };

  elAxis.onclick = function() {
    toggleAxis();
  }

  elOtherCalc.onclick = function(){
    toggleExtraCalc();
  }

  shootbutton.onclick = () => {
    predictionView = false;
    ballhit = false;
    ballNum = 0;
    cue.on = false;
    cue.reset(circles[0]);
    circles[0].shoot();
    circles[0].xVelShot = 0;
    circles[0].yVelShot = 0;
    circles[0].yVelShot = 0;
    circles[0].vel = 0;
    circles[0].angle = 0;
    updateControls();
  }

  resetbutton.onclick = () => {
    resetGame();
    reset();
    resetEquations();
    el1.innerHTML = 0;
    el2.innerHTML = 0;
    el3.innerHTML = 0.5;
    el4.innerHTML = 0.9;
    el5.innerHTML = 0.010.toFixed(3);
    circles[0].xVelShot = 0;
    circles[0].yVelShot = 0;
    circles[0].vel = 0;
    circles[0].angle = 0;
    updateControls();
    elCoeffBumper.value = 0.5;
    elCoeffBalls.value = 0.9;
    elRoll.value = 0.01;
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
  for (const elCoordinateSystemBtn of elCoordinateSystem) {
    elCoordinateSystemBtn.onclick = function() {
      coordinateSystem = parseFloat(elCoordinateSystemBtn.firstElementChild.value);
      toggleCoordinates(coordinateSystem);
      for (let elCoordinateSystemBtn2 of document.querySelectorAll(".coordinate-system-toggle")) {
        if (this === elCoordinateSystemBtn2) {
          elCoordinateSystemBtn2.classList.add("coordinate-system-toggle-active");
        } else {
          elCoordinateSystemBtn2.classList.remove("coordinate-system-toggle-active");
        }
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
  white =  `White Ball: \n \\[v_{f} = \\sqrt{(${vfx})^2 + (${-vfy})^2}\\;\\mathrm{m/s} = ${vf}\\;\\mathrm{m/s} \\quad \\theta_f = \\arctan(\\frac{${-vfy}}{${vfx}})^{\\circ} = ${thetaf}^{\\circ}\\]`;
  whiteBallEquation.innerHTML = white;
  MathJax.typeset();
}

function updateOtherCalculations(mt,mo,dx,dy,vtxi,vtyi,voxi,voyi,vt,vo,at,ao,phi,vtx,vty,vox,voy,vtfx,vtfy,vofx,vofy,xVel,yVel,xVel2,yVel2) {
  if(voxi === 0 && voyi === 0){
    ao === 0;
  } else {
    ao = TWO_PI - ao;
  }
  let white;
  let whiteBallEquation = document.getElementById("white-extra-calculation");
  white =  `<u><b>White Ball:</b></u> <br>
            <b>Starting with the velocities in the <i>x</i> and <i>y</i> direction and finding intial velocity and angle:</b> \n\\[m_{w} = ${mt.toFixed(2)} \\;\\mathrm{kg} \\qquad v_{ix} = ${vtxi.toFixed(2)} \\;\\mathrm{m/s} \\qquad  v_{iy}= ${-vtyi.toFixed(2)} \\;\\mathrm{m/s}\\] \n 
            \\[\\theta_i = \\arctan(\\frac{v_{iy}}{v_{ix}}) = \\arctan(\\frac{${-vtyi.toFixed(2)}}{${vtxi.toFixed(2)}}) = ${(360-((at*180)/PI)).toFixed(2)}^{\\circ}\\] \n
            \\[ v_{i} = \\sqrt{{v_{ix}}^2 + {v_{iy}}^2} \\;=\\sqrt{{(${vtxi.toFixed(2)})}^2 + {(${-vtyi.toFixed(2)})}^2} \\; = ${vt.toFixed(2)} \\;\\mathrm{m/s} \\] \n
            <b>Rotating the axis of collision around the center of the white ball so only the <i>x</i> component of the velocity is involved in the collision:</b> \n\\[{v_{ix}}' = v_{i}\\cos{(\\theta_i-\\phi)} = (${vt.toFixed(2)})\\cos{( ${(360-((at*180)/PI)).toFixed(2)}^{\\circ} -\\ ${(360-((phi*180)/PI)).toFixed(2)}^{\\circ})} = ${vtx.toFixed(2)} \\;\\mathrm{m/s} \\] \n 
            \\[{v_{iy}}' = v_{i}\\sin{(\\theta_i-\\phi)} = (${vt.toFixed(2)})\\sin{( ${(360-((at*180)/PI)).toFixed(2)}^{\\circ} -\\ ${(360-((phi*180)/PI)).toFixed(2)}^{\\circ})} = ${-vty.toFixed(2)} \\;\\mathrm{m/s} \\] \n
            <b>Finding the final velocities in the <i>x</i> and <i>y</i> direction on the rotated axis of collision: \n \\[{v_{fx}}' = \\frac{m_{w}{v_{wix}}' + m_{o}{v_{oix}}' +m_{o}e({v_{oix}}'-{v_{wix}}')}{m_{w} + m_{o}}  \\] \n
            \\[{v_{fx}}' = \\frac{(${mt.toFixed(2)})(${vtx.toFixed(2)}) + (${mo.toFixed(2)})(${vox.toFixed(2)}) +(${mt.toFixed(2)})(${circleCoefRest})(${vox.toFixed(2)}-${vtx.toFixed(2)})}{${mt.toFixed(2)} + ${mo.toFixed(2)}} \\] \\[ {v_{fx}}'= ${vtfx.toFixed(2)} \\;\\mathrm{m/s}  \\] \n
            \\[{v_{fy}}' = {v_{iy}}' = ${-vty.toFixed(2)} \\;\\mathrm{m/s}\\] \n
            <B>Converting the velocities in the <i>x</i> and <i>y</i> direction back to standard axis of collision:\n  \\[v_{fx} = {v_{fx}}'\\cos{(\\phi)} + {v_{fy}}'\\cos{(\\phi + 90)} \\] \n 
            \\[ v_{fx} =(${vtfx.toFixed(2)})\\cos{(${(360-((phi*180)/PI)).toFixed(2)})} + (${-vtfy.toFixed(2)})\\cos{(${(360-((phi*180)/PI)).toFixed(2)} + 90)} = ${xVel.toFixed(2)}\\;\\mathrm{m/s}\\] \n
            \\[v_{fy} = {v_{fx}}'\\sin{(\\phi)} + {v_{fy}}'\\sin{(\\phi + 90)} \\] \n 
            \\[ v_{fy} =(${vtfx.toFixed(2)})\\sin{(${(360-((phi*180)/PI)).toFixed(2)})} + (${-vtfy.toFixed(2)})\\sin{(${(360-((phi*180)/PI)).toFixed(2)} + 90)} = ${-yVel.toFixed(2)}\\;\\mathrm{m/s}\\]`;
  whiteBallEquation.innerHTML = white;

  let other;
  let otherBallEquation = document.getElementById("other-extra-calculation");
  other =  `<b><u>Other Ball:</u></b> <br> 
            <b>Starting with the velocities in the <i>x</i> and <i>y</i> direction and finding intial velocity and angle:</b> \n \\[m_{w} = ${mo.toFixed(2)}\\;\\mathrm{kg} \\qquad v_{ix} = ${voxi.toFixed(2)} \\;\\mathrm{m/s} \\qquad  v_{iy}= ${voyi.toFixed(2)} \\;\\mathrm{m/s}\\] \n 
            \\[\\theta_i = \\arctan(\\frac{v_{iy}}{v_{ix}}) = \\arctan(\\frac{${voyi.toFixed(2)}}{${voxi.toFixed(2)}}) = ${((ao*180)/PI).toFixed(2)}^{\\circ}\\] \n
            \\[v_{i} =\\sqrt{{v_{ix}}^2 + {v_{iy}}^2} \\;=\\sqrt{{${voxi.toFixed(2)}}^2 + {${voyi.toFixed(2)}}^2} \\;= 0.00\\;\\mathrm{m/s}  \\] \n
            <b>Rotating the axis of collision around the center of the white ball so only the <i>x</i> component of the velocity is involved in the collision:</b> \n\\[{v_{ix}}' = v_{i}\\cos{(\\theta_i-\\phi)} = (${vo.toFixed(2)})\\cos{( ${(360-((ao*180)/PI)).toFixed(2)}^{\\circ} -\\ ${(360-((phi*180)/PI)).toFixed(2)}^{\\circ})} = ${vox.toFixed(2)} \\;\\mathrm{m/s} \\] \n 
            \\[{v_{iy}}' = v_{i}\\sin{(\\theta_i-\\phi)} = (${vo.toFixed(2)})\\sin{( ${(360-((ao*180)/PI)).toFixed(2)}^{\\circ} -\\ ${(360-((phi*180)/PI)).toFixed(2)}^{\\circ})} = ${voy.toFixed(2)} \\;\\mathrm{m/s} \\] \n
            <b>Finding the final velocities in the <i>x</i> and <i>y</i> direction on the rotated axis of collision:</b> \n\\[{v_{fx}}' = \\frac{m_{w}{v_{wix}}' + m_{o}{v_{oix}}' +m_{w}e({v_{wix}}'-{v_{oix}}')}{m_{w} + m_{o}}  \\] \n
            \\[{v_{fx}}' = \\frac{(${mt.toFixed(2)})(${vtx.toFixed(2)}) + (${mo.toFixed(2)})(${voxi.toFixed(2)}) +(${mo.toFixed(2)})(${circleCoefRest})(${vtx.toFixed(2)} - ${voxi.toFixed(2)})}{${mt.toFixed(2)} + ${mo.toFixed(2)}} \\]  \\[{v_{fx}}' = ${vofx.toFixed(2)} \\;\\mathrm{m/s}  \\] \n
            \\[{v_{fy}}' = {v_{iy}}' = ${vofy.toFixed(2)} \\;\\mathrm{m/s}\\] \n
            <B>Converting the velocities in the <i>x</i> and <i>y</i> direction back to standard axis of collision:\n  \\[v_{fx} = {v_{fx}}'\\cos{(\\phi)} + {v_{fy}}'\\cos{(\\phi + 90)} \\] \n 
            \\[ v_{fx} =(${vofx.toFixed(2)})\\cos{(${(360-((phi*180)/PI)).toFixed(2)})} + (${-vofy.toFixed(2)})\\cos{(${(360-((phi*180)/PI)).toFixed(2)} + 90)} = ${xVel2.toFixed(2)}\\;\\mathrm{m/s}\\] \n
            \\[v_{fy} = {v_{fx}}'\\sin{(\\phi)} + {v_{fy}}'\\sin{(\\phi + 90)} \\] \n 
            \\[ v_{fy} =(${vofx.toFixed(2)})\\sin{(${(360-((phi*180)/PI)).toFixed(2)})} + (${-vofy.toFixed(2)})\\sin{(${(360-((phi*180)/PI)).toFixed(2)} + 90)} = ${-yVel2.toFixed(2)}\\;\\mathrm{m/s}\\]`;
  otherBallEquation.innerHTML = other;
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

  whiteBallEquation = document.getElementById("white-extra-calculation");
  white = `Hit a colored ball to see impact calculations.`;
  whiteBallEquation.innerHTML = white;

  let other;
  let otherBallEquation = document.getElementById("other-extra-calculation");
  other = `Hit a colored ball to see impact calculations.`;
  otherBallEquation.innerHTML = other;
}

function toggleCoordinates(coordinateSystem){
  var x = document.getElementById("cartesian-controls");
  var y = document.getElementById("polar-controls");
  switch(coordinateSystem){
    case 1:
      x.style.display = "block";
      y.style.display = "none";
      break;
    case 2:
      x.style.display = "none";
      y.style.display = "block";
      break;
  }

}

/**
 * Update the values in the input box
*/ 
function updateControls(){
  elXVel[0].value = parseFloat(circles[0].xVelShot).toFixed(3).replace('-0', '0');
  elXVel[1].value = parseFloat(circles[0].xVelShot).toFixed(3).replace('-0', '0');
  el1.innerHTML = parseFloat(circles[0].xVelShot).toFixed(3).replace('-0', '0');
  elYVel[0].value = parseFloat(circles[0].yVelShot).toFixed(3).replace('-0', '0');
  elYVel[1].value = parseFloat(circles[0].yVelShot).toFixed(3).replace('-0', '0');
  el2.innerHTML = parseFloat(circles[0].yVelShot).toFixed(3).replace('-0', '0');
  elVel[0].value = parseFloat(circles[0].vel).toFixed(3).replace('-0', '0');
  elVel[1].value = parseFloat(circles[0].vel).toFixed(3).replace('-0', '0');
  el6.innerHTML = parseFloat(circles[0].vel).toFixed(3).replace('-0', '0');
  elAng[0].value = (parseFloat(circles[0].angle)*(180/PI)).toFixed(2).replace('-0', '0');
  elAng[1].value = (parseFloat(circles[0].angle)*(180/PI)).toFixed(2).replace('-0', '0');
  el7.innerHTML = (parseFloat(circles[0].angle)*(180/PI)).toFixed(2).replace('-0', '0');
  cue.update(circles[0],circles[0].x + circles[0].xVelShot*(-10),circles[0].y + circles[0].yVelShot*(10));
}

function toggleAxis(){
  if(coordinateView){
    coordinateView = false;
  } else {
    coordinateView = true;
  }
}

function toggleExtraCalc() {
  var x = document.getElementById("impact-calculation");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

function showMenu(id) {
  document.getElementById(id).classList.toggle("show");
}
