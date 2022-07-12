//make a game loop
//set the canvas to the size of the window
let canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
//set canvas to fixed position
canvas.style.position = "fixed";
canvas.style.top = "0";
canvas.style.left = "0";
//I did this
canvas.style.zIndex = -1;
//create a context
let ctx = canvas.getContext("2d");

//create an object that represents a square
let square = {
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  color: "red",
  draw: function () {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  },
};
//create a second square
let square2 = {
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  color: "blue",
  draw: function () {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  },
};

//create a function to generate squares
let generateSquares = function (x, y, width, height, color) {
  //generate a random number between 0 and the width of the canvas
  x = x ?? Math.floor(Math.random() * canvas.width);
  //generate a random number between 0 and the height of the canvas
  y = y ?? Math.floor(Math.random() * canvas.height);
  //generate a random number between 0 and the width of the canvas
  width = width ?? Math.floor(Math.random() * canvas.width);
  //generate a random number between 0 and the height of the canvas
  height = height ?? Math.floor(Math.random() * canvas.height);
  //generate a random color
  color =
    color ??
    `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(
      Math.random() * 255
    )}, ${Math.floor(Math.random() * 255)})`;
  //create a new square
  let newSquare = {
    x: x,
    y: y,
    width: width,
    height: height,
    color: color,
    draw: function () {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    },
  };
  //return the new square
  return newSquare;
};

//determine if two squares intersect
let intersects = function (a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
};

//create an object that represents keyboard input
let keyboard = {
  left: false,
  right: false,
  up: false,
  down: false,
  pressed: function () {
    return this.left || this.right || this.up || this.down;
  },
};

//create listeners to modify the keyboard object
document.addEventListener("keydown", function (e) {
  switch (e.keyCode) {
    case 37:
      keyboard.left = true;
      break;
    case 38:
      keyboard.up = true;
      break;
    case 39:
      keyboard.right = true;
      break;
    case 40:
      keyboard.down = true;
      break;
  }
});

//create keyup listener to modify the keyboard object
document.addEventListener("keyup", function (e) {
  switch (e.keyCode) {
    case 37:
      keyboard.left = false;
      break;
    case 38:
      keyboard.up = false;
      break;
    case 39:
      keyboard.right = false;
      break;
    case 40:
      keyboard.down = false;
      break;
  }
});

//initialize the square in the middle of the screen

square.x = canvas.width / 2 - square.width / 2;
square.y = canvas.height / 2 - square.height / 2;

//initialize the second square in the middle of the screen offset by 200px
square2.x = canvas.width / 2 - square2.width / 2 + 200;
square2.y = canvas.height / 2 - square2.height / 2 + 200;

//create a game loop
let gameLoop = function () {
  //clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ff0000";
  //move the square based on keyboard input
  if (keyboard.left) {
    square.x -= 10;
  }
  if (keyboard.right) {
    square.x += 10;
  }
  if (keyboard.up) {
    square.y -= 10;
  }
  if (keyboard.down) {
    square.y += 10;
  }
  //draw the square
  square.draw();
  //draw the second square
  square2.draw();
  //check if the squares intersect
  if (intersects(square, square2)) {
    square.color = "green";
    square2.color = "green";
  } else {
    square.color = "red";
    square2.color = "blue";
  }
  //call the game loop again
  requestAnimationFrame(gameLoop);
};
//call the game loop
gameLoop();

//add the canvas to the dom
document.body.appendChild(canvas);
