let myP5MovRec; // Please prepare instance in global
let img;
let cvs;
const points = [];

function setup() {
  cvs = createCanvas(windowWidth, windowHeight);
  cvs.drop(handleFile);

  fill('red');
  stroke('red');

  // myP5MovRec = new P5MovRec(); // P5MovRec.codecId.vp9 is selected by default.
  // myP5MovRec.startRec();
}

function draw() {
  background(220);
  if (img) {
    image(img, 0, 0, img.width, img.height);

    points.forEach((p) => {
      let size = 10;
      if (dist(p.x, p.y, mouseX, mouseY) < size / 2) {
        size = 15;
      }
      circle(p.x, p.y, size);
    });
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
      let size = 10;
      if (dist(p.x, p.y, mouseX, mouseY) < size / 2) {
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
  if (keyIsDown(CONTROL) && key == 'z'){
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
