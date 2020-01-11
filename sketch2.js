
function preload(){
  // put preload code here
}

var x = 0, y = 0;
var stepSize = 600.0;
var letters = "Такой исключительной по-глощенности темой о человеке ни у кого никогда не было. И ни у кого не было такой гениальности в раскрытии тайн человеческой природы. Достоевский, прежде всего, великий антрополог, исследователь человеческой природы, ее глубин и ее тайн. Все его творчество — антропологические опыты и эксперименты. Достоевский — не художник-реалист, а экспериментатор, создатель опытной метафизики человеческой природы. Все художество Достоевского есть лишь метод антропологических изысканий и открытий. Он не только ниже Толстого как художник, но он и не может быть назван в строгом смысле этого слова художником. То, что пишет Достоевский, — и не романы, и не трагедии, и никакая форма художественного творчества. Это, конечно, какое-то великое художество, целиком захватывающее, вовлекающее в свой особый мир, действующее магически.";
var fontSizeMin = 1;
var angleDistortion = 0.0;
var counter = 0;



function setup() {
  // put setup code here
  createCanvas(windowWidth, windowHeight);
  background('#4B0082');
   smooth();
   cursor(CROSS);

   x = mouseX;
   y = mouseY;

 textAlign(RIGHT);
 fill(255);

}


function draw() {
  // put drawing code here

  if (mouseOver) {
  var d = dist(x,y, mouseX, mouseY);
  textFont('Bodoni');
  textSize(fontSizeMin+d/10)
  var newLetter = letters.charAt(counter);;
  stepSize = textWidth(newLetter);

  if (d > stepSize) {
    var angle = atan2(mouseY-y, mouseX-x);

    push();
    translate(x, y);
    rotate(angle + random(angleDistortion));
    text(newLetter, 0, 0);
    pop();

    counter++;
   if (counter > letters.length-1) counter = 0;

    x = x + cos(angle) * stepSize;
    y = y + sin(angle) * stepSize;
  }
}
}

function mouseOver() {
x = mouseX;
y = mouseY;
}



function windowResized() {
  resizeCanvas(windowWidth, windowHeight)

}
