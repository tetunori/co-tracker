// let myP5MovRec; // Please prepare instance in global
let gVd;
let gMovieFPS;
let gPoints = [];
let gPointsHistoryIndex = 0;
let gIsPlaying = false;

const markSize = 5;
const markFillColor = 'white';
const markStrokeColor = 'black';

function setup() {
  // Prepare GUI
  const initOpstion = {
    frameIndex: 0,
    dataFPS: 0,
    movieFPS: 0,
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

  if (gVd) {
    const frameIndex = getFrameIndex(gVd.elt.currentTime);
    if (options.frameIndex !== frameIndex) {
      options.frameIndex = frameIndex;
      setTimeout(() => {
        gui.updateDisplay();
      }, 10);
    }

    image(gVd, 0, 0, gVd.width, gVd.height);

    let blackLayerColor = color('black');
    blackLayerColor.setAlpha(floor(map(mouseX, 0, width, 0, 255)));
    background(blackLayerColor);

    // Draw marks
    if (gPoints.length > frameIndex) {
      gPoints[frameIndex].forEach((p) => {
        let xPos = p.x;
        let yPos = p.y;
        circle(xPos, yPos, markSize);
        text(p.pointIdx, xPos + markSize * 2, yPos);
      });
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

  if (f.type === 'text') {
    handleTextFile(f);
  }

  if (f.type === 'video') {
    handleMovieFile(f);
  }
};

const handleMovieFile = (f) => {
  // Set fps value by user
  gMovieFPS = parseFloat(window.prompt('Input movie fps: ', '29.97'));

  gVd = createVideo(f.data, () => {
    // Change layer order for user operation
    // gVd.parent('forVideo');
    resizeCanvas(gVd.width, gVd.height);
    gVd.hide();
    gVd.play();
    gIsPlaying = true;
    gVd.loop();
    setMovieControls(gMovieFPS);
    setframeIndex(getFrameIndex(gVd.duration()), onChangeFrameIndex);
  });
};

const onChangeFrameIndex = () => {
  if (gVd) {
    const totalFrames = getFrameIndex(gVd.duration());
    gVd.time((options.frameIndex / totalFrames) * gVd.duration());
  }
};

const handleTextFile = (f) => {
  let dataText = f.data.replaceAll('\r\n', ',');
  dataText = dataText.replaceAll('y', '');
  const dataArray = dataText.split(',');
  // console.log(dataArray);

  gPoints.length = 0;
  dataArray.forEach((e, i) => {
    if (i > 1 && i < dataArray.length - 1 && i % 4 === 0) {
      const pushObj = {
        pointIdx: Number(dataArray[i + 1]),
        x: Number(dataArray[i + 2]),
        y: Number(dataArray[i + 3]),
      };
      if (gPoints.length === Number(dataArray[i]) + 1) {
        gPoints[dataArray[i]].push(pushObj);
      } else {
        gPoints.push([pushObj]);
      }
    }
  });
  // console.log(gPoints);
};

const getFrameIndex = (frameTime) => {
  return Math.floor(frameTime * gMovieFPS);
};

function mousePressed() {
  if (gIsPlaying) {
    gVd?.pause();
    gIsPlaying = false;
  } else {
    gVd?.play();
    gIsPlaying = true;
  }
}

function mouseReleased() {
  // No op
}

function keyPressed() {
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
