// let myP5MovRec; // Please prepare instance in global
let gImg;
let gVd;
let gMovieFPS;
let gPoints = [];
const gPointsHistory = [[]];
let gPointsHistoryIndex = 0;

let draggingPointIdx = undefined;

const defaultMarkSize = 5;
const markFillColor = 'white';
const markHighlightFillColor = 'red';
const markStrokeColor = 'black';

function setup() {
  // Prepare GUI
  const initOpstion = {
    frameIndex: 0,
    showCoordinate: false,
  };
  prepareDatGUI(initOpstion);

  createCanvas(windowWidth, windowHeight).drop(handleFile);

  textFont('Noto Sans JP');
  fill(markFillColor);
  stroke(markStrokeColor);
  textAlign(LEFT, CENTER);

  // myP5MovRec = new P5MovRec(); // P5MovRec.codecId.vp9 is selected by default.
  // myP5MovRec.startRec();
}

function draw() {
  background(220);

  if (gImg) {
    // Marking mode if image is already set
    image(gImg, 0, 0, gImg.width, gImg.height);

    // Draw marks
    gPoints.forEach((p, index) => {
      let markSize = defaultMarkSize;
      let xPos = p.x;
      let yPos = p.y;
      push();
      {
        if (index === draggingPointIdx) {
          // The dragging point
          xPos = mouseX;
          yPos = mouseY;
          markSize *= 2;
          fill(markHighlightFillColor);
        } else if (dist(p.x, p.y, mouseX, mouseY) < markSize) {
          // Points near mouse coordinate
          markSize *= 2;
          fill(markHighlightFillColor);
        }
        circle(xPos, yPos, markSize);
        text(index, xPos + defaultMarkSize * 2, yPos);
      }
      pop();
    });

    if (options.showCoordinate) {
      showCursorCoordinate();
    }
  } else if (gVd) {
    // Selecting frame mode if video is set
    // In this mode, only to control frame index on canvas
    if (!gVd.elt.paused || gVd.elt.seeking) {
      const frameIndex = getFrameIndex(gVd.elt.currentTime);
      if (options.frameIndex !== frameIndex) {
        options.frameIndex = frameIndex;
        setTimeout(() => {
          gui.updateDisplay();
        }, 10);
      }
    }
  } else {
    // Initial screen let user to drop an image/movie file.
    push();
    {
      push();
      {
        // Draw dotted rectangle
        fill('#ffffff70');
        strokeCap(ROUND);
        drawingContext.setLineDash([1, 10]);
        strokeWeight(4);
        rect(width / 8, height / 4, (3 * width) / 4, height / 2, 20);
      }
      pop();

      // Draw text for operation
      fill('black');
      textAlign(CENTER, CENTER);
      textSize(width / 24);
      text('Drag & Drop image/movie file.', width / 2, height / 2);
    }
    pop();
  }
}

const handleFile = (f) => {
  // console.log(f)

  if (gImg) {
    if (f.type === 'text') {
      handleTextFile(f);
    }
  }

  if (gVd || gImg) {
    return;
  }

  if (f.type === 'image') {
    handleImageFile(f);
  }

  if (f.type === 'video') {
    handleMovieFile(f);
  }
};

const handleImageFile = (f) => {
  const maxFrameIndex = 10000;
  setImageControls(maxFrameIndex, true);

  // Remove the current image, if any.
  if (gImg) {
    gImg.remove();
  }

  gImg = createImg(f.data, '', '', () => {
    resizeCanvas(gImg.width, gImg.height);
  });
  gImg.hide();
};

const handleMovieFile = (f) => {
  // Set fps value by user
  gMovieFPS = parseFloat(window.prompt('Input movie fps: ', '29.97'));

  gVd = createVideo(f.data, () => {
    // Change layer order for user operation
    noCanvas();
    // gVd.parent('forVideo');
    gVd.showControls();
    setMovieControls(getFrameIndex(gVd.duration()), onChangeFrameIndex);
  });
};

const onChangeFrameIndex = () => {
  if (gVd) {
    const totalFrames = getFrameIndex(gVd.duration());
    gVd.time((options.frameIndex / totalFrames) * gVd.duration());
  }
};

const handleTextFile = (f) => {
  let dataText = f.data.replaceAll('.', '');
  dataText = dataText.replaceAll(']', '');
  dataText = dataText.replaceAll(' ', '');
  const dataArray = dataText.split(',');

  gPoints.length = 0;
  dataArray.forEach((e, i) => {
    if (i > 2 && i % 3 === 0) {
      gPoints.push({ x: Number(dataArray[i]), y: Number(dataArray[i + 1]) });
      addPointsHistory();
    }
  });
};

const getFrameIndex = (frameTime) => {
  return Math.floor(frameTime * gMovieFPS);
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

function mousePressed() {
  if (!gImg) {
    return;
  }

  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    let isFoundExistingPoint = false;
    gPoints.forEach((p, index) => {
      let markSize = defaultMarkSize;
      if (dist(p.x, p.y, mouseX, mouseY) < markSize) {
        if (mouseButton !== LEFT || keyIsDown(CONTROL)) {
          // Delete this point
          gPoints.splice(index, 1);
          addPointsHistory();
        } else {
          draggingPointIdx = index;
        }
        isFoundExistingPoint = true;
      }
    });

    if (!isFoundExistingPoint) {
      if (mouseButton === LEFT) {
        // Add this point
        gPoints.push({ x: mouseX, y: mouseY });
        addPointsHistory();
      }
    }
  }
}

function mouseReleased() {
  if (draggingPointIdx !== undefined) {
    gPoints[draggingPointIdx] = { x: mouseX, y: mouseY };
    addPointsHistory();
    draggingPointIdx = undefined;
  }
}

const addPointsHistory = () => {
  gPointsHistoryIndex++;
  if (gPointsHistoryIndex === gPointsHistory.length) {
    gPointsHistory.push([...gPoints]);
  } else {
    gPointsHistory[gPointsHistoryIndex] = [...gPoints];
  }
};

function keyPressed() {
  if (keyIsDown(CONTROL) && key == 'z') {
    if (gPointsHistoryIndex > 0) {
      gPointsHistoryIndex--;
      gPoints.length = 0;
      gPoints = [...gPointsHistory[gPointsHistoryIndex]];
    }
  } else if (keyIsDown(CONTROL) && key == 'y') {
    if (gPointsHistoryIndex < gPointsHistory.length - 1) {
      gPointsHistoryIndex++;
      gPoints.length = 0;
      gPoints = [...gPointsHistory[gPointsHistoryIndex]];
    }
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

const selectFrame = () => {
  // Stop & hide video
  gVd.pause();
  gVd.hide();

  // Reload gui dat
  deleteMovieControls();
  const totalFrames = getFrameIndex(gVd.duration());
  setImageControls(totalFrames, false);

  // Prepare p5.js canvas
  createCanvas(gVd.width, gVd.height);
  gImg = gVd;
  gVd = undefined;
};

const downloadData = () => {
  const name = getYYYYMMDD_hhmmss(true) + '.txt';
  let dataText = '    # [frameIdx, xPos, yPos] \n';
  gPoints.forEach((p, index) => {
    dataText += '    [' + options.frameIndex + '., ' + p.x + '., ' + p.y + '.],  # ' + index + '\n';
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
