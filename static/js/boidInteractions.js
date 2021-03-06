function collectBoidsInRange(boid, otherBoids, outerBoundary, innerBoundary) {
  var affectedBoidList = [];

  //Collect any boids within the lineOfSight.
  for (var i=0; i < otherBoids.length; i++){
    var otherBoid = otherBoids[i];
    var distance = boid.distToBoid(otherBoid);

    if (distance<=outerBoundary && distance>=innerBoundary) {
      //If the otherBoid is within range, make sure it is "viewable" by the boid.
      //  That is, make sure it isn't "behind" the current boid.
      var xDiff = boid.x-otherBoid.x;
      var yDiff = boid.y-otherBoid.y;
      var directionToBoid = (Math.atan2(yDiff, xDiff)/Math.PI+2)%2
      var directionDiff = Math.abs(directionToBoid-boid.direction);
      if (directionDiff>1) directionDiff -= 1;

      var peripheralRange = 0.2; //On a 0-1 scale.
//      if (directionDiff <= peripheralRange){ //TODO
        affectedBoidList.push(otherBoid);
//      }
    }
  }

  return affectedBoidList;
}


//Get the center of mass [x, y] of all boids in a list.
function getCenterVec(boids){
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
function getRepulsionVec(boid, otherBoids) {
  var newX = boid.x;
  var newY = boid.y;

  for (var i=0; i < otherBoids.length; i++){
    var otherBoid = otherBoids[i];
    var oppDir = boid.directionTo(otherBoid.getPosition())+1;
    var distance = boid.distToBoid(otherBoid);
    var newPos = boid.getTriangle(oppDir,10);
    newX += newPos[0];
    newY += newPos[1];
  }

  return [newX/otherBoids.length, newY/otherBoids.length];
}

//Get the average velocity [0, 0] of a set of boids.
function getVelocityVec(boid, boids) {
  var totalDir = 0;
  var totalSpeed = 0;

  for (var i=0; i < boids.length; i++){
    totalDir += boids[i].direction;
    totalSpeed += boids[i].speed
  }

  var avgDir = totalDir/parseFloat(boids.length);
  var avgSpeed = totalSpeed/parseFloat(boids.length);

  return boid.getTriangle(avgDir, avgSpeed);
}



