
function preload(){
}
var stars = [];

function setup() {
  createCanvas(windowWidth,windowHeight);
  frameRate(1000);
  textFont('Oberon Title Italic');

  var starNumber = 200;
  for(var i=0; i < starNumber; i++) {
    var myStar = new Star(random(2,width),random(2,height),30);
    myStar.h = random(50,50);
    myStar.w = random(50,2000);
    myStar.speed = random(0,5);
    stars.push(myStar);
  }
}

function draw() {
  background(255);

  for(var j = 0; j < stars.length; j++){
    stars[j].move();
    stars[j].display();
    stars[j].over(mouseX, mouseY);
  }

//text
  strokeWeight(0);
  stroke(0);
  fill(random(255),random(255),random(255),random(255));
  textSize(20);
  textAlign(CENTER);
  text('Drag the mouse',width/6,height/8);

}

function Star(_x,_y,_h,_w) {
  this.x = _x;
  this.y = _y;
  this.h = _h;
  this.w = _w;
  this.color = (random(255));
  this.speed = 10;
//bouncing
  var yDir = 1;
  var xDir = 1;

  this.display = function() {
    fill(this.color);
    noStroke();
    rect(this.x,this.y,this.h,this.w);
  }

//colorchange
  this.over = function() {
  var d = dist(mouseX, mouseY, this.x, this.y);
  if (d < this.h/1) {
  this.color = color(random(765),random(255),random(255))
  }  }

this.move = function() {
  this.x += this.speed * xDir;
  this.y += this.speed * yDir;
  if (this.y > height || this.y < 0) {
    yDir = yDir * -5;
  }

  if (this.x > width || this.x < 0) {
    xDir = xDir * -1;
  }
}
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
