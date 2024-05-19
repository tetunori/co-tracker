// dat GUI instance
let gui;
let controlFolder;
let hintsFolder;
let frameIndex;
let selectFrameCtrl;

// Setting values for dat GUI
const options = new Object();

const utilities = {
  SelectFrame: () => {
    selectFrame();
  },
  DownloadData: () => {
    downloadData();
  },
  SaveImage: () => {
    saveImage();
  },
  GitHub: () => {
    window.open('https://github.com/tetunori/co-tracker', '_blank');
  },
  NoOp: () => {
    // No Operation
  },
};

const prepareDatGUI = (opt) => {
  gui = new dat.GUI({ closeOnTop: true, hideable: true });
  // h key to hide menu

  // Set initial values
  options.frameIndex = opt.frameIndex;
  options.showCoordinate = opt.showCoordinate;
  gui.updateDisplay();

  // Controls
  controlFolder = gui.addFolder('Controls');
  controlFolder.open();

  // Appendix
  const appendixFolder = gui.addFolder('Appendix');
  appendixFolder.add(utilities, 'SaveImage').name('Save Image');
  appendixFolder.add(utilities, 'GitHub').name('move To GitHub Repo');
  appendixFolder.close();

  // Hint text
  hintsFolder = gui.addFolder('Hints');
  hintsFolder.add(utilities, 'NoOp').name('[H] key to hide menu');
  hintsFolder.open();
};

const setImageControls = (maxFrameIndex = 10000, bEnable) => {
  frameIndex = controlFolder.add(options, 'frameIndex', 0, maxFrameIndex, 1);
  if (!bEnable) {
    frameIndex.domElement.hidden = true;
    frameIndex.name('Frame: ' + options.frameIndex);
  }
  controlFolder.add(options, 'showCoordinate', false).name('Show Coordinate');
  controlFolder.add(utilities, 'DownloadData').name('Download Data');
  hintsFolder.add(utilities, 'NoOp').name('[Click] Add');
  hintsFolder.add(utilities, 'NoOp').name('[Drag & Drop] Move');
  hintsFolder.add(utilities, 'NoOp').name('[Ctrl + Click] Remove');
  hintsFolder.add(utilities, 'NoOp').name('[Ctrl + Z/Y] History');
  controlFolder.open();
  hintsFolder.open();
};

const setMovieControls = (maxFrameIndex = 10000, callback) => {
  frameIndex = controlFolder.add(options, 'frameIndex', 0, maxFrameIndex, 1).name('Frame Index');
  frameIndex.onChange(callback);
  selectFrameCtrl = controlFolder.add(utilities, 'SelectFrame').name('Select Frame');
  controlFolder.open();
};

const deleteMovieControls = () => {
  controlFolder.remove(frameIndex);
  controlFolder.remove(selectFrameCtrl);
};
