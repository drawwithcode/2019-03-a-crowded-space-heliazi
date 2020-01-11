// instances of the Enemy object will be insert here:
var allTheEnemies = [];
// instances of the Enemyes' bullets will be insert here (they have to be differentiated from player's bullets):
var allTheEnemyBullets = [];
// instances of the Player's bullets will be insert here:
var allThePlayersBullets = [];
// number of enemies, useful both to create the instances and to check if the player won
var enemyCount = 15;
// just a simple array to give enemies and player a random moving direction at the start of the game
var randomDirection = [1, -1];
// declaring the player's instance
var player;
// a variable that I used to limit the player's shooting frequency
var bulletLimiter = 0;
// a string variable that definies the text of the final screen (win or game over)
var textScreen = "You saved the galaxy!";
// declaring the unit of measure of spatial values (it will be 1% of window width to make the game playable on all the screen sizes)
var a;
// instances of the stars that will be on the background:
var stars = [];
//a boolean that checks if the game started
var start = false;


function setup() {
  // put setup code here
  frameRate(25);
  angleMode(DEGREES);
  ellipseMode(CENTER);
  rectMode(CENTER);
  createCanvas(windowWidth, windowHeight);
  //setting the unit of measure
  a = width / 100;
  //creating enemies' instances with differents Xposition, Yposition, "fire power" (I'll explain this later) and initial direction
  for (var i = 0; i < enemyCount; i++) {
    var randomEnemy = new Enemy(8 * a + random() * (width - 16 * a), random() * height / 3, Math.round(random() * 10), randomDirection[Math.round(random() * 1)]);
    allTheEnemies.push(randomEnemy);
  }
  //creating instances for the stars on the background
  for (var i = 0; i < 100; i++) {
    var randomStar = new Star(random() * width, random() * height, 0.05 * a + random() * 0.15 * a);
    stars.push(randomStar);
  }
  //creating the player's instance
  player = new Player();
}

function draw() {
  //background and stars
  background(20);
  for (var i = 0; i < stars.length; i++) {
    var star = stars[i];
    star.display();
  }
  //shows the title screen
  if (start == false) {
    textSize(4 * a);
    textAlign(CENTER);
    textStyle(BOLD);
    fill('orange');
    text("DEFEND THE GALAXY!", width / 2, height / 3);
    textSize(2 * a);
    textAlign(CENTER);
    textStyle(BOLD);
    fill(230);
    text("COMMANDS:", width / 2, height / 2);
    textSize(2 * a);
    textAlign(CENTER);
    textStyle(NORMAL);
    text("←  move left,   →  move right,   ↑  shoot!", width / 2, height / 1.7);
    textSize(1.5 * a);
    textAlign(CENTER);
    textStyle(BOLD);
    fill('orange');
    text("press ENTER to start the game", width / 2, height / 1.2);
  }
  //game started
  else if (enemyCount > 0) {
    //calling the methods for all the enemies
    for (var i = 0; i < allTheEnemies.length; i++) {
      var enemy = allTheEnemies[i];
      enemy.move();
      enemy.display();
      enemy.shoot();
      enemy.destroy();
    }
    //calling the methods for all the enemies' bullets
    for (var i = 0; i < allTheEnemyBullets.length; i++) {
      var bullet = allTheEnemyBullets[i];
      bullet.move();
      bullet.display();
      bullet.gameover();
    }
    //calling the methods for all the player's bullets
    for (var i = 0; i < allThePlayersBullets.length; i++) {
      var bullet = allThePlayersBullets[i];
      bullet.move();
      bullet.display();
    }
    //calling the methods for the player
    player.move();
    player.display();
  }
  //game ended, shows the final screen
  else {
    textSize(2.5 * a);
    textAlign(CENTER);
    textFont('sans-serif');
    fill(230);
    text(textScreen, width / 2, height / 2);
  }
}

//costructor of the Enemy object
function Enemy(_x, _y, _firePower, _direction) {
  //properties definied by the "firePower": more the fire power, than bigger the size and shooting frequency (probability of shooting for each frame), but it moves more slowly
  this.size = 2 * a + 0.15 * a * _firePower;
  this.speed = (0.8 * a - 0.05 * a * _firePower) * _direction;
  this.shootingFrequencyModifier = _firePower / 1000;
  //position properties
  this.x = _x;
  this.y = _y;
  //boolead that checks if an enemy is destroyed
  this.destroyed = false;
  //color changes according to the firePower, to divide enemies in two "classes"
  if (_firePower <= 5) {
    this.color = 'FireBrick';
  } else {
    this.color = 'DarkMagenta';
  }

  //move & direction change method. only activates if the enemy isn't destroyed yet
  this.move = function() {
    if (this.destroyed == false) {
      this.x += this.speed;
      this.y += abs(this.speed / 20);
      if (this.x >= width - this.size || this.x <= this.size) {
        this.speed = -this.speed;
      }
    } else {
      this.x = -1;
      this.y = -1;
    }
    //game over if the enemy is too close to the player
    if (this.y >= height - player.size) {
      textScreen = "GAME OVER";
      enemyCount = 0;
    }
  }
  //object drawing method
  this.display = function() {
    if (this.destroyed == false) {
      push();
      noFill();
      strokeWeight(this.size / 8);
      stroke(this.color);
      arc(this.x, this.y, this.size, this.size, -70, 70);
      arc(this.x, this.y, this.size, this.size, 110, 250);
      pop();
      push();
      noStroke();
      fill(this.color);
      rect(this.x, this.y, this.size, this.size / 3);
      pop();
    }
  }
  //enemy shooting method. probability of shooting for each frame that slightly changes according to the fire power. They start shooting a second after the game starts
  this.shoot = function() {
    if (frameCount > 25 && random() >= 0.99 - this.shootingFrequencyModifier * 1.5 && this.destroyed == false) {
      var newshot = new Bullet(this.x, this.y + this.size / 2, 0.7 * a, "Orange");
      allTheEnemyBullets.push(newshot);
    }
  }
  //object destroying method
  this.destroy = function() {
    for (var i = 0; i < allThePlayersBullets.length; i++) {
      var bullet = allThePlayersBullets[i];
      if (bullet.x >= this.x - this.size / 2 && bullet.x <= this.x + this.size / 2 &&
        bullet.y >= this.y - this.size / 2 && bullet.y <= this.y + this.size / 2) {
        this.destroyed = true;
        enemyCount -= 1;
      }
    }
  }
}

//costructor of the Enemy's Bullet object
function Bullet(_x, _y, _direction, _color) {
  this.x = _x;
  this.y = _y;
  this.color = _color;
  this.wdth = 0.4 * a;
  this.hght = a;
  this.speed = _direction;

  this.move = function() {
    this.y += this.speed;
  }

  this.display = function() {
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.wdth, this.hght);
  }
  //gameover method: checks if the player was hit and ends the game
  this.gameover = function() {
    if (this.x >= player.x - player.size / 2 && this.x <= player.x + player.size / 2 &&
      this.y >= player.y - player.size / 2 && this.y <= player.y + player.size / 2) {
      textScreen = "GAME OVER";
      enemyCount = 0;
    }
  }
}

//costructor of the Player's Bullet object
function PlayerBullet(_x, _y, _direction, _color) {
  this.x = _x;
  this.y = _y;
  this.color = _color;
  this.wdth = 0.4 * a;
  this.hght = a;
  this.speed = _direction;

  this.move = function() {
    this.y += this.speed;
  }

  this.display = function() {
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.wdth, this.hght);
  }
}

//costructor of the Player object
function Player() {
  this.size = 4 * a;
  this.x = width / 2;
  this.y = height - this.size;J
  this.color = "DarkCyan";
  this.speed = 0.6 * a * randomDirection[Math.round(random() * 1)];

  this.move = function() {
    this.x += this.speed;
    if (this.x >= width - this.size || this.x <= this.size) {
      this.speed = -this.speed;
    }
  }

  this.display = function() {
    push();
    noFill();
    strokeWeight(this.size / 8);
    stroke(this.color);
    arc(this.x, this.y, this.size, this.size, -75, 75);
    arc(this.x, this.y, this.size, this.size, 115, 245);
    pop();
    push();
    noStroke();
    fill(this.color);
    rect(this.x, this.y, this.size, this.size / 3);
    pop();
  }

  this.shoot = function() {
    var newshot = new PlayerBullet(this.x, this.y - this.size / 2, -1.3 * a, "SpringGreen");
    allThePlayersBullets.push(newshot);
  }

}

//constructor of the stars in the background
function Star(_x, _y, _size) {
  this.display = function() {
    fill(230);
    noStroke();
    ellipse(_x, _y, _size);
  }
}

//check if a key is pressed
function keyPressed() {
  //change player's direction
  if (keyCode === LEFT_ARROW && player.x > player.size) {
    if (player.x >= width - player.size) {
      player.x += -0.6 * a;
      player.speed = -0.6 * a;
    } else {
      player.speed = -0.6 * a;
    }
    //change player's direction
  } else if (keyCode === RIGHT_ARROW && player.x < width - player.size) {
    if (player.x <= player.size) {
      player.x += 0.6 * a;
      player.speed = 0.6 * a;
    } else {
      player.speed = 0.6 * a;
    }
  }
  //player shooting, frequency limited by the bulletLimiter variable
  if (keyCode === UP_ARROW) {
    if (bulletLimiter < frameCount) {
      player.shoot();
      bulletLimiter = frameCount + 5;
    }
  }
  //starts the game and resets the frameCount
  if (keyCode === ENTER) {
    if (start == false) {
      start = true;
      frameCount = 0;
    }
  }
}
