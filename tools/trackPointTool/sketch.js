// let myP5MovRec; // Please prepare instance in global
let gImg;
let gVd, gVdOrg;
let gMovieFPS;

let gPoints = [];
const gPointsHistory = [[]];
let gPointsHistoryIndex = 0;
let draggingPointIdx = undefined;

let gFrameCountOnCopied = undefined;

let gIsSeeked = false;

const defaultMarkSize = 5;
const markFillColor = 'white';
const markHighlightFillColor = '#ffbe0b';
const markStrokeColor = 30;

function setup() {
  // Prepare GUI
  const initOption = {
    frameIndex: 0,
    showCoordinate: false,
    showIndexNumber: true,
    overlayColor: '#00000000',
  };
  const callbacks = {
    selectFrame: () => {
      selectFrame();
    },
    backToMovie: () => {
      backToMovie();
    },
    downloadData: () => {
      downloadData();
    },
  };
  prepareDatGUI(initOption, callbacks);

  // Setup canvas
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

    // Transparent overlay for higher visibility
    push();
    {
      noStroke();
      fill(options.overlayColor);
      rect(0, 0, width, height);
    }
    pop();

    // Draw marks
    gPoints.forEach((p, index) => {
      let markSize = defaultMarkSize;
      const xIndexTextOffset = defaultMarkSize * 2;
      let xPos = p.x;
      let yPos = p.y;
      push();
      {
        if (index === draggingPointIdx) {
          // The dragging point
          xPos = mouseX;
          yPos = mouseY;
          markSize *= 2;
          textSize(textSize() * 2);
          fill(markHighlightFillColor);
        } else if (dist(p.x, p.y, mouseX, mouseY) < markSize) {
          // Points near mouse coordinate
          markSize *= 2;
          textSize(textSize() * 2);
          fill(markHighlightFillColor);
        }

        // Draw mark
        circle(xPos, yPos, markSize);

        // Draw index number near the mark
        if (options.showIndexNumber) {
          strokeWeight(2);
          text(index, xPos + xIndexTextOffset, yPos);
        }
      }
      pop();
    });

    if (options.showCoordinate) {
      showCursorCoordinate();
    }

    if (gFrameCountOnCopied) {
      if (frameCount - gFrameCountOnCopied < 80) {
        push();
        {
          // Draw 'Copied' text
          fill('#000000A0');
          strokeCap(ROUND);
          noStroke();
          rectMode(CENTER);
          rect(width / 2, height / 2, width / 4, height / 4, 20);

          fill('white');
          textAlign(CENTER, CENTER);
          textSize(width / 24);
          text('Copied!', width / 2, height / 2);
        }
        pop();
      }
    }
  } else if (gVd) {
    // Selecting frame mode if video is set
    // In this mode, only to control frame index on canvas
    if (!gVd.elt.paused || gVd.elt.seeking) {
      const frameIndex = min(getFrameIndex(gVd.elt.currentTime), getFrameIndex(gVd.duration()) - 1);
      if (options.frameIndex !== frameIndex) {
        options.frameIndex = frameIndex;
        gIsSeeked = true;
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
      fill(30);
      textAlign(CENTER, CENTER);
      textSize(width / 24);
      text('Drag & Drop image/movie file.', width / 2, height / 2);
    }
    pop();
  }
}

const handleFile = (f) => {
  // console.log(f)

  if (gImg && f.type === 'text') {
    handleTextFile(f);
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
  // Remove the current image, if any.
  if (gImg) {
    gImg.remove();
  }

  gImg = createImg(f.data, '', '', () => {
    resizeCanvas(gImg.width, gImg.height);

    const maxFrameIndex = 10000;
    setImageControls(maxFrameIndex, true);
    setGuiPos(width, 0);
  });
  gImg.hide();
};

const handleMovieFile = (f) => {
  // Set fps value by user
  gMovieFPS = parseFloat(window.prompt('Input movie fps: ', '29.97'));

  gVd = createVideo(f.data, () => {
    // Change layer order for user operation
    noCanvas();
    gVd.showControls();
    setMovieControls(getFrameIndex(gVd.duration()) - 1, onChangeFrameIndex);
    setGuiPos(gVd.width, 0);
    gVd.elt.onpause = () => {
      onChangeFrameIndex();
    };
    gVd.elt.onseeked = () => {
      if (gIsSeeked) {
        onChangeFrameIndex();
        gIsSeeked = false;
      }
    };
  });
  gVdOrg = gVd;
};

const onChangeFrameIndex = () => {
  if (gVd) {
    const totalFrames = getFrameIndex(gVd.duration());
    gVd.time((round(10000 * (options.frameIndex / totalFrames)) / 10000) * gVd.duration() + 0.0001);
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
  return round(frameTime * gMovieFPS);
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
  } else if (keyIsDown(DELETE)) {
    gPoints = [];
    addPointsHistory();
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

  // Prepare p5.js canvas
  createCanvas(gVd.width, gVd.height);

  // Reload gui dat
  deleteMovieControls();
  const totalFrames = getFrameIndex(gVd.duration());
  setImageControls(totalFrames, false);
  setBackToMovie();
  setGuiPos(width, 0);

  gImg = gVd;
  gVd = undefined;
};

const downloadData = () => {
  const name = getYYYYMMDD_hhmmss(true) + '.txt';
  let dataText = '';

  // Find max digits
  let xMaxDigits = 0;
  let yMaxDigits = 0;
  xMaxDigits = String(
    Math.max.apply(
      null,
      gPoints.map((e) => {
        return e.x;
      })
    )
  ).length;
  yMaxDigits = String(
    Math.max.apply(
      null,
      gPoints.map((e) => {
        return e.y;
      })
    )
  ).length;

  gPoints.forEach((p, index) => {
    dataText +=
      '    [' +
      options.frameIndex +
      '., ' +
      p.x.toString().padStart(xMaxDigits, ' ') +
      '., ' +
      p.y.toString().padStart(yMaxDigits, ' ') +
      '.],  # ' +
      index.toString().padStart(String(gPoints.length - 1).length, '0') +
      '\n';
  });

  navigator.clipboard.writeText(dataText);

  const prefix = '    # [frameIdx, xPos, yPos] \n';
  outputText(name, prefix + dataText);

  gFrameCountOnCopied = frameCount;
};

const outputText = (name, text) => {
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

const backToMovie = () => {
  gImg = undefined;
  gVd = gVdOrg;

  deleteImageControls();

  noCanvas();
  gVd.show();
  gVd.showControls();
  setMovieControls(getFrameIndex(gVd.duration()) - 1, onChangeFrameIndex);
};
