//Variable Setup.
var boidList = [];  //Keeps track of the boids in the universe.
var msPerStep = 20;

function step() {

  //Keeps track of the number of boids that may exist.
  var numBoids = document.getElementById("numBoids").value;
  //The range in which a Boid will follow another Boid.
  var lineOfSight = document.getElementById("lineOfSight").value;
  //The max speed a boid can move along an axis.
  var maxAxisSpeed = document.getElementById("maxAxisSpeed").value;
  //
  var randomness = document.getElementById("randomness").value;
  var comfortRadius = document.getElementById("comfortRadius").value;

  var flockIntensity = document.getElementById("flockIntensity").value/100.0;
  var followIntensity = document.getElementById("followIntensity").value/100.0;
  var turnIntensity = document.getElementById("turnIntensity").value/100.0;
  var accelIntensity = document.getElementById("accelIntensity").value/100.0;


  //Either add/remove Boids depending on the numBoids variable.
  if (boidList.length < numBoids) {
    var newBoid = new Boid();
    //Randomize the position of this Boid and draw it on the screen.
    newBoid.randomTeleport(maxAxisSpeed);
    //Remember that this boid exists.
    boidList.push(newBoid);
  } else if (boidList.length > numBoids) {
    //Delete the .boid element from the #universe.
    boidList[0].remove();
    //And delete it from the boidList.
    boidList.shift();
  }

  //Update the velocity and position of each Boid.
  for (var i=0; i < boidList.length ; i++){
    var boid = boidList[i];

    //Get any boids within range of this boid.
    var otherBoids = boidList.slice();
    otherBoids.splice(i,1);
    var boidsInRange = collectBoidsInRange(boid, otherBoids,
                                           lineOfSight, comfortRadius);
    if (boidsInRange.length) {
      //Steer this boid towards the center of mass.
      var centerOfMass = getCenterOfMass(boidsInRange);
      boid.applyInfluence(centerOfMass, flockIntensity,
                        turnIntensity, accelIntensity);


      //And move in the average direction velocity of the local boids.
      var averageVel =getAverageVelocity(otherBoids);
      var influencedPos = [boid.x+averageVel[0], boid.y+averageVel[1]];
      boid.applyInfluence(influencedPos, followIntensity,
                          turnIntensity, accelIntensity);
    }

    //Apply each boid's new velocity to their position.
    boid.move(randomness, turnIntensity, maxAxisSpeed);
  }
}


setInterval( step, msPerStep );


