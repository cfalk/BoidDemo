function Boid() {
  //Attribute Declarations.
  this.x = 0;
  this.y = 0;

  this.speed = 0;
  this.direction = 0;

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
Boid.prototype.applyInfluence = function(attractionPoint, intensity,
                                         turnIntensity, accelIntensity){
  function evaluateOption(option, boid) {
    option.action();
    var nextPos = boid.plannedPos();
    option.distance = distBetweenPoints(nextPos, attractionPoint);
    option.unaction();
  }

  var boid = this;
  var options=[
    {
      distance:9999, //Turn Left
      action: function() {
        this.oldDirection = boid.direction;
        boid.direction += turnIntensity*intensity;
      },
      unaction: function() { boid.direction = this.oldDirection }
    },
    {
      distance:9999, //Turn Right
      action: function() {
        this.oldDirection = boid.direction;
        boid.direction -= turnIntensity*intensity;
      },
      unaction: function() { boid.direction = this.oldDirection }
    },
    {
      distance:9999, //Speed Up
      action: function() {
        this.oldSpeed = boid.speed;
        boid.speed += accelIntensity*intensity;
      },
      unaction: function() { boid.speed = this.oldSpeed; }
    }
  ]

  for (var i=0; i < options.length ; i++) {
    var option = options[i];
    evaluateOption(option, boid);
  }

  options.sort(function(a,b){
    return a.distance-b.distance;
  });
  options[0].action();

}

//Teleport this Boid to a random position in the #universe.
Boid.prototype.randomTeleport = function(maxVel) {
  //Randomize the position.
  var universe = document.getElementById("boidUniverse")
  var randomXPos = Math.random()*universe.offsetWidth;
  var randomYPos = Math.random()*universe.offsetHeight;

  //Randomize the velocities (and directions).
  this.direction=Math.random()*2;
  this.speed=Math.random()*maxVel;

  this.setPosition(randomXPos, randomYPos);
}

//Draw this boid in its current [x, y] position in the #universe.
Boid.prototype.redraw = function() {
  this.element.style.top = this.y + "px";
  this.element.style.left = this.x + "px";
}

//Get the next position [x, y] of this Boid after applying velocity.
Boid.prototype.plannedPos = function() {
  this.direction %= 2;

  var lengths = getTriangle(this.direction, this.speed);
  var newX = this.x+lengths[0];
  var newY = this.y-lengths[1];

  return [newX, newY];
}

function getTriangle(direction, speed){
  var angle = direction*Math.PI
  var x = Math.cos(angle)*speed
  var y = Math.sin(angle)*speed
  return [x, y];
}

//Update this Boid's [x, y] position by adding its velocity.
Boid.prototype.move = function(randomness, maxTurn, maxSpeed) {
  //Either add or remove a little from the direction of the Boid.
  if (Math.random() < randomness){
    var sign =  (Math.random()>.5) ? -1: 1 ;
    this.direction += Math.random() * maxTurn * sign

    if (this.speed > maxSpeed*0.25 && Math.random()>0.5){
      this.speed *= 0.95;
    } else {
      this.speed *= 1.05;
    }
  }

  if (this.speed>maxSpeed) this.speed *= 0.8;

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
  var xDiff = tuple1[0]-tuple2[1];
  var yDiff = tuple1[0]-tuple2[1];
  return Math.sqrt((xDiff*xDiff)+(yDiff*yDiff));
}

//Prepare this Boid object for destruction by deleting any bindings.
Boid.prototype.remove = function() {
  //Remove the DOM element.
  var universe = document.getElementById("boidUniverse");
  universe.removeChild(this.element);
}

