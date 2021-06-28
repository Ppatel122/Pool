var elXVel,elYVel,shootbutton,resetbutton,el1,el2;

window.onload = () => {
  //Prevent right-click on simulation from bringing up the context menu
  document.oncontextmenu = function() {
  if (mouseX > 0 && mouseY > 0 && mouseX < width && mouseY < height)
    return false;
  }
  elXVel = document.querySelector("#xVel");
  elYVel = document.querySelector("#yVel");
  el1 = document.querySelector("#e1");
  el2 = document.querySelector("#e2");
  shootbutton = document.querySelector("#shootbutton");
  resetbutton = document.querySelector("#resetbutton");
  calculatebutton = document.querySelector("#calculatebutton");

  elXVel.onchange = () => {
    console.log("X Velocity: " + validateInput(elXVel));
    projection.updateX(parseFloat(validateInput(elXVel)));
    el1.innerHTML = parseFloat(elXVel.value).toFixed(3).replace('-0', '0');
  };
  elYVel.onchange = () => {
    console.log("Y Velocity: " + validateInput(elYVel));
    projection.updateY(parseFloat(validateInput(elYVel)));
    el2.innerHTML = parseFloat(elYVel.value).toFixed(3).replace('-0', '0');
  };

  shootbutton.onclick = () => {
    console.log("Shooting!");
    circles[0].shoot(parseFloat(validateInput(elXVel)),parseFloat(validateInput(elYVel)));
  }

  resetbutton.onclick = () => {
    console.log("Reseting!");
    resetGame();
    el1.innerHTML = 0;
    el2.innerHTML = 0;
    elXVel.value = 0;
    elYVel.value = 0;
    projection.updateX(0);
    projection.updateY(0);
  }
  
  calculatebutton.onclick = () => {
    backgroundShot = true;
    circles[0].calculate(parseFloat(validateInput(elXVel)),parseFloat(validateInput(elYVel)));
  }
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