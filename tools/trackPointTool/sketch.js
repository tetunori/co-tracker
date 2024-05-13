let myP5MovRec; // Please prepare instance in global
let img;
let cvs;
const points = [];
const defaultMarkSize = 5;
const markColor = 'white';

// Options
const gOptions = {
  frameIndex: 0,
};

function setup() {
  // Prepare GUI
  prepareDatGUI(gOptions);

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
  const opt = gOptions;
  opt.frameIndex = options.frameIndex;

  if (img) {
    image(img, 0, 0, img.width, img.height);

    points.forEach((p, index) => {
      let markSize = defaultMarkSize;
      if (index === draggingPointIdx) {
        markSize *= 2;
        push();
        {
          fill('red');
          circle(mouseX, mouseY, markSize);
        }
        pop();
        text(index, mouseX + defaultMarkSize * 2, mouseY);
      } else if (dist(p.x, p.y, mouseX, mouseY) < markSize) {
        markSize *= 2;
        push();
        {
          fill('red');
          circle(p.x, p.y, markSize);
        }
        pop();
        text(index, p.x + defaultMarkSize * 2, p.y);
      } else {
        circle(p.x, p.y, markSize);
        text(index, p.x + defaultMarkSize * 2, p.y);
      }
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

  showCursorCoordinate();
}

const handleFile = (f) => {
  // console.log(f)

  if (f.type === 'image') {
    // Remove the current image, if any.
    if (img) {
      img.remove();
    }
    // Create an  element with the
    // dropped file.
    img = createImg(f.data, '', '', () => {
      resizeCanvas(img.width, img.height);
    });
    img.hide();
  }

  if (f.type === 'text') {
    let dataText = f.data.replaceAll('.', '');
    dataText = dataText.replaceAll(']', '');
    dataText = dataText.replaceAll(' ', '');
    const dataArray = dataText.split(',');

    points.length = 0;
    dataArray.forEach((e, i) => {
      if (i > 2 && i % 3 === 0) {
        points.push({ x: Number(dataArray[i]), y: Number(dataArray[i + 1]) });
      }
    });
  }
};

const showCursorCoordinate = () => {
  push();
  {
    textSize(width / 80);
    const str = '(' + mouseX + ', ' + mouseY + ')';
    const w = textWidth(str) * 1.1;

    let yOffset = width / 50;
    if (mouseY > height / 2) {
      yOffset *= -1;
    }
    let xOffset = width / 30;
    if (mouseX > width / 2) {
      xOffset *= -1;
    }
    noStroke();
    fill('#00000090');
    rectMode(CENTER);
    rect(mouseX + xOffset, mouseY + yOffset, w, textSize() * 1.5, 5);
    fill('white');
    textAlign(CENTER, CENTER);
    text(str, mouseX + xOffset, mouseY + yOffset);
  }
  pop();
};

let draggingPointIdx = undefined;

function mousePressed() {
  if (!img) {
    return;
  }

  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    let isFoundExistingPoint = false;
    points.forEach((p, index) => {
      let markSize = defaultMarkSize;
      if (dist(p.x, p.y, mouseX, mouseY) < markSize) {
        if (mouseButton !== LEFT) {
          points.splice(index, 1);
        } else {
          draggingPointIdx = index;
        }
        isFoundExistingPoint = true;
      }
    });

    if (!isFoundExistingPoint) {
      if (mouseButton === LEFT) {
        points.push({ x: mouseX, y: mouseY });
      }
    }
  }
}

function mouseReleased() {
  if (draggingPointIdx !== undefined) {
    points[draggingPointIdx] = { x: mouseX, y: mouseY };
    draggingPointIdx = undefined;
  }
}

function keyPressed() {
  if (keyIsDown(CONTROL) && key == 'z') {
    points.pop();
  }

  // switch (keyCode) {
  //   case 49: //1: Start record
  //     myP5MovRec.startRec();
  //     break;
  //   case 50: //2: set webm, stop
  //     // myP5MovRec.setMovType(P5MovRec.movTypeId.webm); // webm is default value
  //     myP5MovRec.stopRec();
  //     break;
  //   default:
  //     break;
  // }
}

const downloadData = () => {
  const name = getYYYYMMDD_hhmmss(true) + '.txt';
  let dataText = '    # [frameIdx, xPos, yPos] \n';
  points.forEach((p, index) => {
    dataText +=
      '    [' + gOptions.frameIndex + '., ' + p.x + '., ' + p.y + '.],  # ' + index + '\n';
  });
  outputScript(name, dataText);
};

const outputScript = (name, text) => {
  // create .txt file since .js files will be stopped for security reason.
  let blob = new Blob([text], { type: 'text/plain' });
  let a = document.createElement('a');
  const url = URL.createObjectURL(blob);
  a.href = url;
  a.download = name;
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

document.oncontextmenu = (e) => {
  e.preventDefault();
};
