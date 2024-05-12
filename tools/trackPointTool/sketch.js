let myP5MovRec; // Please prepare instance in global
let img;
let cvs;
const points = [];
const defaultMarkSize = 5;
const markColor = 'white';

function setup() {
  cvs = createCanvas(windowWidth, windowHeight);
  cvs.drop(handleFile);

  textFont('Noto Sans JP');
  fill(markColor);
  stroke('black');
  strokeWeight(1);
  textAlign(LEFT, CENTER);

  // myP5MovRec = new P5MovRec(); // P5MovRec.codecId.vp9 is selected by default.
  // myP5MovRec.startRec();
}

function draw() {
  background(220);
  if (img) {
    image(img, 0, 0, img.width, img.height);

    points.forEach((p, index) => {
      let markSize = defaultMarkSize;
      if (dist(p.x, p.y, mouseX, mouseY) < markSize) {
        markSize *= 2;
        push();
        {
          fill('red');
          circle(p.x, p.y, markSize);
        }
        pop();
      } else {
        circle(p.x, p.y, markSize);
      }
      text(index, p.x + defaultMarkSize * 2, p.y);
    });
  } else {
    push();
    {
      push();
      {
        fill('#ffffff70');
        strokeCap(ROUND);
        drawingContext.setLineDash([1, 10]);
        strokeWeight(4);
        rect(width / 8, height / 4, (3 * width) / 4, height / 2, 20);
      }
      pop();
      fill('black');
      textAlign(CENTER, CENTER);
      textSize(width / 24);
      text('Drag & Drop an image file here.', width / 2, height / 2);
    }
    pop();
  }
}

const handleFile = (f) => {
  // Remove the current image, if any.
  if (img) {
    img.remove();
  }
  // Create an  element with the
  // dropped file.
  img = createImg(f.data, '');
  img.hide();
  resizeCanvas(img.width, img.height);
};

function mousePressed() {
  if (!img) {
    return;
  }

  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    let isFoundExistingPoint = false;
    points.forEach((p, index) => {
      let markSize = defaultMarkSize;
      if (dist(p.x, p.y, mouseX, mouseY) < markSize) {
        points.splice(index, 1);
        isFoundExistingPoint = true;
      }
    });

    if (!isFoundExistingPoint) {
      points.push({ x: mouseX, y: mouseY });
    }
  }
}

function keyPressed() {
  if (keyIsDown(CONTROL) && key == 'z') {
    points.pop();
  }

  switch (keyCode) {
    case 49: //1: Start record
      myP5MovRec.startRec();
      break;
    case 50: //2: set webm, stop
      // myP5MovRec.setMovType(P5MovRec.movTypeId.webm); // webm is default value
      myP5MovRec.stopRec();
      break;
    default:
      break;
  }
}
