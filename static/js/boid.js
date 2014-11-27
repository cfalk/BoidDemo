function Boid() {
  //Attribute Declarations.
  this.x = 0;
  this.y = 0;

  this.speed = 0;
  this.direction = 0; //In radian "steps." That is, x in (x*Math.PI).

  //Bind this Boid object to a .boid DOM element.
  var universe = document.getElementById("boidUniverse");
  var newElement = document.createElement("div");
  newElement.className += " boid";
  universe.appendChild(newElement);
  newElement.style.display="show";
  this.element = newElement;

  var newGoal = document.createElement("div");
  newGoal.className += " goalPoint";
  universe.appendChild(newGoal);
  newGoal.style.display="show";
  this.goalPoint = newGoal;

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
Boid.prototype.applyInfluence = function(newCenter) {

}

//Teleport this Boid to a random position in the #universe.
Boid.prototype.randomTeleport = function(maxVel) {
  //Randomize the position.
  var universe = document.getElementById("boidUniverse")
  var randomXPos = Math.random()*universe.offsetWidth;
  var randomYPos = Math.random()*universe.offsetHeight;

  //Randomize the velocities (and directions).
  this.direction=Math.random()*2; //TODO: Direction seems wrong. Fix to right?
  this.speed=Math.random()*maxVel+0.1;

  this.setPosition(randomXPos, randomYPos);
}

//Draw this boid in its current [x, y] position in the #universe.
Boid.prototype.redraw = function() {
  //Redraw the position of the boid.
  this.element.style.top = this.y + "px";
  this.element.style.left = this.x + "px";

  //Rotate the boid.
  var deg = this.direction*Math.PI
  this.element.style.webkitTransform = 'rotate('+deg+'rad)';
  this.element.style.mozTransform    = 'rotate('+deg+'rad)';
  this.element.style.msTransform     = 'rotate('+deg+'rad)';
  this.element.style.oTransform      = 'rotate('+deg+'rad)';
  this.element.style.transform       = 'rotate('+deg+'rad)';
}

//Get the next position [x, y] of this Boid after applying velocity.
Boid.prototype.plannedPos = function() {
  var newPos = this.getTriangle(this.direction, this.speed);
  return newPos;
}

Boid.prototype.getTriangle = function(direction, speed){
  this.direction = (this.direction+2)%2;
  var angle = direction*Math.PI
  var x = Math.sin(angle)*speed
  var y = Math.cos(angle)*speed
  return [this.x + x, this.y-y];
}

Boid.prototype.directionTo = function(vector) {
  var x = vector[0] - this.x;
  var y = vector[1] - this.y;
  return (Math.atan2(y,x)/Math.PI+2.5 ) % 2;
}

function randomSign(){
  return (Math.random()>.5) ? -1: 1 ;
}

//Update this Boid's [x, y] position by adding its velocity.
Boid.prototype.move = function(influenceVector, randomness, maxTurn, maxSpeed, acceleration, sight) {

  //Make movement more fluid by slowing down when close to the influenceVector
  friction = 0.1;
  if (influenceVector.length) {

    //Redraw the boid influence point.
    this.goalPoint.style["display"]="block";
    this.goalPoint.style.left = influenceVector[0] + 5+ "px";
    this.goalPoint.style.top = influenceVector[1] + 5 +"px";

    var distance = this.distToPoint(influenceVector);
    var lookahead = this.speed*sight/2;
    this.speed += acceleration*friction;

    var dirTo = this.directionTo(influenceVector);
    console.log(dirTo);
    var diff = this.direction - dirTo
    //console.log(this.direction + " " + dirTo);
    var sign = (diff>0);
    turn = Math.min(Math.abs(diff), maxTurn);
    this.direction -= turn*sign
    this.direction = dirTo;

  } else {
    this.goalPoint.style["display"]="none";

  }

  //Either add or remove a little from the direction of the Boid.
  if (Math.random() < randomness){
    this.direction += (Math.random() * maxTurn * randomness * randomSign())
    this.speed += parseFloat((Math.random() * randomness * 0.1 * randomSign()));

  }

  if (this.speed<0) this.speed = 0;
  if (this.speed>maxSpeed) this.speed = maxSpeed;

  this.step();
}

Boid.prototype.step = function() {
  var nextPos = this.plannedPos();
  this.setPosition(nextPos[0], nextPos[1]);
}

//Get the distance between this Boid and another Boid.
Boid.prototype.distToBoid = function(boid) {
  return this.distToPoint([boid.x, boid.y]);
}

//Get the distance between this Boid and a query point [x, y].
Boid.prototype.distToPoint = function(tuple) {
  return distBetweenPoints([this.x, this.y], tuple);
}

//Get the distance between two point tuples [x, y] and [x2. y2].
function distBetweenPoints(tuple1, tuple2){
  var xDiff = tuple1[0]-tuple2[0];
  var yDiff = tuple1[1]-tuple2[1];
  return Math.sqrt((xDiff*xDiff)+(yDiff*yDiff));
}

//Prepare this Boid object for destruction by deleting any bindings.
Boid.prototype.remove = function() {
  //Remove the DOM element.
  var universe = document.getElementById("boidUniverse");
  universe.removeChild(this.element);
  universe.removeChild(this.goalPoint);
}

