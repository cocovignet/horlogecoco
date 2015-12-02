// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com


// A reference to our box2d world
var world;

// A list we'll use to track fixed objects
var boundaries = [];

// A list for all of our particles
var particles = [];
var counts;
var countm;
var counth;
var testFlag = false;

function setup() {
  createCanvas(windowWidth,windowHeight);

  // Initialize box2d physics and create the world
  world = createWorld();
  //console.log( hour());

  //world.SetContactListener(new CustomListener());


    // Add a bunch of fixed boundaries
  boundaries.push(new Boundary(width/2,height-5,width,10,0));
  boundaries.push(new Boundary(width/2,5,width,10,0));
  boundaries.push(new Boundary(width-5,height/2,10,height,0));
  boundaries.push(new Boundary(5,height/2,10,height,0));

  counts = second();
  countm = minute();
  counth = hour();

}

function draw() {
  
  var s = second();
  var m = minute();
  var h = hour();
  background(51);

  // Print current second
  console.log("Current second = " + second())

  // We must always step through time!
  var timeStep = 1.0/60;
  
  // 2nd and 3rd arguments are velocity and position iterations
  world.Step(timeStep,10,10);

  // Add a now particle each second
  if (counts != second()){
      particles.push(new Particle(random(width), (height/2), random(7,8), 10));
      counts = second();
  }

  // Set the cgravity direction according to the current hour
  setGravity(hour())

  // Loop over each particule
  for (var i = particles.length-1; i >= 0; i--) {
    
    // Display the particule
    particles[i].display();
    
    // Delete the particule if it has left the screen
    if (particles[i].done()) {
      console.log("Particule " + i + " left the screen, and is going to be deleted")
      particles.splice(i,1);
    }
    
    // Delete the particules before the next minute start
    if (counts == 59) {
      particles[i].killBody()
      particles.splice(i,1);
    }

  }

  // Draw the boundaries
  for (var j = 0; j < boundaries.length; j++) {
    boundaries[j].display();
  }

}



function setGravity(local_hour) {

  // Configure les fonctions trigo en degrées
  angleMode(DEGREES)

  // Récupère la gravité actuelle
  var currentGravity = world.GetGravity()

  // Calcule la valeur de la gravité actuelle
  var currentGravityValue = currentGravity.GetLength()

  // Modulo sur l'heure pour avoir des valeurs entre 0 et 11
  local_hour = local_hour % 12
  
  //Calcule l'angle de la nouvelle gravité en degrés
  gravityAngle = local_hour/12*360

  // Offset pour les coordonnées
  var offset = 180

  //Calcule la nouvelle gravité
  var newGravityX = currentGravityValue*sin(offset - local_hour/12*360)
  var newGravityY = currentGravityValue*cos(offset - local_hour/12*360)
  var newGravity = new box2d.b2Vec2(newGravityX, newGravityY)

  // Applique la nouvelle gravité
  world.SetGravity(newGravity);
}
