//Variable Setup.
var boidList = [];  //Keeps track of the boids in the universe.
var msPerStep = 20;

function overallInfluence(v1, v2, v3, weights) {
  avgVec = [];
  for (var i=0; i<v1.length; i++) {
    var avg = (v1[i]*weights[0]+v2[i]*weights[1]+v3[i]*weights[2])/3.0
    avgVec.push(avg);
  }
  return avgVec;
}

function step() {

  //Keeps track of the number of boids that may exist.
  var numBoids = document.getElementById("numBoids").value;
  //The range in which a Boid will follow another Boid.
  var lineOfSight = document.getElementById("lineOfSight").value;
  //The max speed a boid can move along an axis.
  var maxAxisSpeed = parseFloat(document.getElementById("maxAxisSpeed").value);
  //
  var randomness = parseFloat(document.getElementById("randomness").value)/100.0;
  var comfortRadius = parseFloat(document.getElementById("comfortRadius").value);

  var flockIntensity = parseFloat(document.getElementById("flockIntensity").value)/100.0
  var followIntensity = parseFloat(document.getElementById("followIntensity").value)/100.0
  var turnIntensity = parseFloat(document.getElementById("turnIntensity").value)/100.0
  var accelIntensity = parseFloat(document.getElementById("accelIntensity").value)/100.0


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
      //If this Boid is being influenced by other Boids, visualize it.
      if (boid.element.className.indexOf("influenced")<0){
        boid.element.className += " influenced";
      }

      var flockVec = getCenterVec(otherBoids)
      var repVec = getRepulsionVec(boid, otherBoids)
      var velVec = getVelocityVec(boid, otherBoids)
      var weights = [0,3,0]
      var influenceVector = overallInfluence(flockVec,repVec,velVec, weights);

    } else {
      boid.element.className = boid.element.className.replace(" influenced","");
      var influenceVector = [];
    }

    //Apply each boid's new velocity to their position.
    boid.move(influenceVector, randomness, turnIntensity, maxAxisSpeed,accelIntensity, lineOfSight);
  }
}


setInterval( step, msPerStep );


