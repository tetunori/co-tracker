// dat GUI instance
let gui;
let controlFolder;
let hintsFolder;
let frameIndex;
let selectFrameCtrl;
let showCoordinate;
let showIndexNumber;
let overlayColor;
let copyDownloadData;
let backToMovieCtrl;

// Setting values for dat GUI
const options = new Object();

const utilities = {
  SelectFrame: () => {
    selectFrame();
  },
  BackToMovie: () => {
    backToMovie();
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
  options.showIndexNumber = opt.showIndexNumber;
  options.overlayColor = opt.overlayColor;
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
  showCoordinate = controlFolder.add(options, 'showCoordinate', false).name('Show Coordinate');
  showIndexNumber = controlFolder.add(options, 'showIndexNumber', true).name('Show Index');
  overlayColor = controlFolder
    .add(options, 'overlayColor', {
      None: '#00000000',
      'Opaque Black': '#000000C0',
      'Translucent Black': '#00000080',
      'Opaque White': '#ffffffC0',
      'Translucent White': '#ffffff80',
    })
    .name('Overlay Color')
    .setValue('#00000000');
  copyDownloadData = controlFolder.add(utilities, 'DownloadData').name('Copy & Download Data');
  hintsFolder.add(utilities, 'NoOp').name('[Click] Add');
  hintsFolder.add(utilities, 'NoOp').name('[Drag & Drop] Move');
  hintsFolder.add(utilities, 'NoOp').name('[Ctrl + Click] Remove');
  hintsFolder.add(utilities, 'NoOp').name('[Delete] Remove All');
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

const deleteImageControls = () => {
  controlFolder.remove(frameIndex);
  controlFolder.remove(showCoordinate);
  controlFolder.remove(showIndexNumber);
  controlFolder.remove(overlayColor);
  controlFolder.remove(copyDownloadData);
  controlFolder.remove(backToMovieCtrl);
  gui.removeFolder(hintsFolder)
  hintsFolder = gui.addFolder('Hints');
  hintsFolder.add(utilities, 'NoOp').name('[H] key to hide menu');
  hintsFolder.open();

};

const setGuiPos = (x, y) => {
  gui.domElement.style.left = x + 'px';
  gui.domElement.style.top = y + 'px';
  gui.domElement.style.position = 'absolute';
};

const setBackToMovie = () => {
  backToMovieCtrl = controlFolder.add(utilities, 'BackToMovie', true).name('Back to Movie');
};
