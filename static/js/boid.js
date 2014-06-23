function Boid() {
  //Attribute Declarations.
  this.x = 0;
  this.y = 0;

  this.xVel = 0;
  this.yVel = 0;

  //Bind this Boid object to a .boid DOM element.
  var universe = document.getElementById("boidUniverse");
  var newElement = document.createElement("div");
  newElement.className += " boid";
  universe.appendChild(newElement);
  newElement.style.display="show";
  this.element = newElement;

}

//Returns the [x,y] position of the Boid.
Boid.prototype.getPosition = function() {
  return [this.x, this.y];
}

//Set the Boid's [x, y] position to [newX, newY].
Boid.prototype.setPosition = function(newX, newY) {
  var universe = document.getElementById("boidUniverse")

  //Wrap the screen.
  if (newX<0) newX += universe.offsetWidth-1;
  if (newY<0) newY += universe.offsetHeight-1;
  newX %= universe.offsetWidth;
  newY %= universe.offsetHeight;

  this.x = newX;
  this.y = newY;
  this.redraw();
}

//Apply a new position [x,y] to this Boid's velocity.
Boid.prototype.applyInfluence = function(newPos, intensity, stubborness, max){
  var xDir = (newPos[0]-this.x)*intensity;
  var newVelX = this.xVel + (this.xVel+xDir)/stubbornness;
  if (newVelX>max) newVelX=max;
  if (newVelX<-max) newVelX=-max;
  this.xVel = newVelX;

  var yDir = (newPos[1]-this.y)*intensity;
  var newVelY = this.yVal = (this.yVel+yDir)/stubbornness;
  if (newVelY>max) newVelY=max;
  if (newVelY<-max) newVelY=-max;

  this.yVel = newVelY;
}

//Teleport this Boid to a random position in the #universe.
Boid.prototype.randomTeleport = function(maxVel) {
  //Randomize the position.
  var universe = document.getElementById("boidUniverse")
  var randomXPos = Math.random()*universe.offsetWidth;
  var randomYPos = Math.random()*universe.offsetHeight;

  //Randomize the velocities (and directions).
  this.xVel=Math.random()*maxVel * ((Math.random()<0.5) ? -1 : 1);
  this.yVel=Math.random()*maxVel * ((Math.random()<0.5) ? -1 : 1);

  this.setPosition(randomXPos, randomYPos);
}

//Draw this boid in its current [x, y] position in the #universe.
Boid.prototype.redraw = function() {
  this.element.style.top = this.y + "px";
  this.element.style.left = this.x + "px";
}

//Update this Boid's [x, y] position by adding its velocity.
Boid.prototype.move = function(randomness) {
  var xRandom = Math.random()*randomness * ((Math.random()<0.5) ? -1 : 1);
  var yRandom = Math.random()*randomness * ((Math.random()<0.5) ? -1 : 1);
  var newX = this.x+this.xVel + xRandom;
  var newY = this.y+this.yVel + yRandom;
  this.setPosition(newX, newY);
}

//Returns the velocity [xVel, yVel] of this Boid.
Boid.prototype.getVel = function() {
  return [this.xVel, this.yVel];
}

//Get the distance between this Boid and another Boid.
Boid.prototype.distanceTo = function(boid) {
  var xDiff = this.x-boid.x;
  var yDiff = this.y-boid.y;
  return Math.sqrt((xDiff*xDiff)+(yDiff*yDiff));
}

//Prepare this Boid object for destruction by deleting any bindings.
Boid.prototype.remove = function() {
  //Remove the DOM element.
  var universe = document.getElementById("boidUniverse");
  universe.removeChild(this.element);
}

