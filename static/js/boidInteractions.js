function collectBoidsInRange(boid, otherBoids, outerBoundary, innerBoundary) {
  var affectedBoidList = [];

  //Collect any boids within the lineOfSight.
  for (var i=0; i < otherBoids.length; i++){
    var otherBoid = otherBoids[i];
    var distance = boid.distToBoid(otherBoid);
    if (distance<=outerBoundary && distance>=innerBoundary) {
      affectedBoidList.push(otherBoid);
    }
  }

  return affectedBoidList;
}


//Get the center of mass [x, y] of all boids in a list.
function getCenterOfMass(boids){
  var totalX = 0;
  var totalY = 0;

  for (var i=0; i < boids.length; i++){
    totalX += boids[i].x;
    totalY += boids[i].y;
  }

  var avgX = totalX/parseFloat(boids.length);
  var avgY = totalY/parseFloat(boids.length);

  return [avgX, avgY];
}

//Get a local position [x, y] farthest from all the otherBoids.
function getRepulsionForce(boid, otherBoids) {
  var newX = boid.x;
  var newY = boid.y;

  for (var i=0; i < otherBoids.length; i++){
    var otherBoid = otherBoids[i];
    var velDiff = [boid.xVel-otherBoid.xVel, boid.yVel-otherBoid.yVel];

    newX -= velDiff[0];
    newY -= velDiff[1];

  }

  return [newX, newY];
}

//Get the average velocity [0, 0] of a set of boids.
function getAverageVelocity(boids) {
  var totalDir = 0;
  var totalSpeed = 0;

  for (var i=0; i < boids.length; i++){
    totalDir += boids[i].direction;
    totalSpeed += boids[i].speed
  }

  var avgDir = totalDir/parseFloat(boids.length);
  var avgSpeed = totalSpeed/parseFloat(boids.length);

  return getTriangle(avgDir, avgSpeed);
}



