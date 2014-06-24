//Variable Setup.
var boidList = [];  //Keeps track of the boids in the universe.
var numBoids = 50;   //Keeps track of the number of boids that may exist.
var msPerStep = 20;
var lineOfSight = 400;

var maxAxisSpeed = 5; //The max speed a boid can move along an axis.
var flockIntensity = 0.5;  //The importance of moving towards other boids.
var followIntensity = 0.5;
var randomness = 0.5;
var comfortRadius = 20;
var turnIntensity = 0.05;
var accelIntensity = 0.05;

function step() {
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
    delete boidList[0];
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
                         maxAxisSpeed,
                        turnIntensity, accelIntensity);


      //And move in the average direction velocity of the local boids.
      var averageVel =getAverageVelocity(otherBoids);
      var influencedPos = [boid.x+averageVel[0], boid.y+averageVel[1]];
      boid.applyInfluence(influencedPos, followIntensity,
                          maxAxisSpeed,
                          turnIntensity, accelIntensity);
    }

    //Apply each boid's new velocity to their position.
    boid.move(randomness, turnIntensity, accelIntensity);
  }
}


setInterval( step, msPerStep );


