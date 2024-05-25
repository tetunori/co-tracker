// dat GUI instance
let gui;
let controlFolder;
let hintsFolder;

// Setting values for dat GUI
const options = new Object();

const utilities = {
  SelectFrame: undefined,
  BackToMovie: undefined,
  DownloadData: undefined,
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

const prepareDatGUI = (opt, cbs) => {
  gui = new dat.GUI({ closeOnTop: true, hideable: true });
  // h key to hide menu

  // Regist callbacks
  utilities.SelectFrame = cbs.selectFrame;
  utilities.BackToMovie = cbs.backToMovie;
  utilities.DownloadData = cbs.downloadData;

  // Set initial values
  options.frameIndex = opt.frameIndex;
  options.showCoordinate = opt.showCoordinate;
  options.showIndexNumber = opt.showIndexNumber;
  options.overlayColor = opt.overlayColor;

  // Controls
  initControlFolder();

  // Appendix
  const appendixFolder = gui.addFolder('Appendix');
  appendixFolder.add(utilities, 'SaveImage').name('Save Image');
  appendixFolder.add(utilities, 'GitHub').name('move To GitHub Repo');
  appendixFolder.close();

  // Hint text
  hintsFolder = gui.addFolder('Hints');
  addToHintsFolder('[H] key to hide menu');
  hintsFolder.open();

  gui.updateDisplay();
};

const initControlFolder = () => {
  if (controlFolder) {
    controlFolder.children.forEach((element) => {
      controlFolder.remove(element);
    });
  } else {
    controlFolder = gui.addFolder('Controls');
  }
  controlFolder.children = [];
  controlFolder.open();
};

const setImageControls = (maxFrameIndex = 10000, bEnable) => {
  const fI = addToCtrlFolder(options, 'frameIndex', 0, maxFrameIndex, 1);
  if (!bEnable) {
    fI.domElement.hidden = true;
    fI.name('Frame: ' + options.frameIndex);
  }
  addToCtrlFolder(options, 'showCoordinate', false).name('Show Coordinate');
  addToCtrlFolder(options, 'showIndexNumber', true).name('Show Index');
  addToCtrlFolder(options, 'overlayColor', {
    None: '#00000000',
    'Opaque Black': '#000000C0',
    'Translucent Black': '#00000080',
    'Opaque White': '#ffffffC0',
    'Translucent White': '#ffffff80',
  })
    .name('Overlay Color')
    .setValue('#00000000');
  addToCtrlFolder(utilities, 'DownloadData').name('Copy & Download Data');
  controlFolder.open();

  addToHintsFolder('[Click] Add');
  addToHintsFolder('[Drag & Drop] Move');
  addToHintsFolder('[Ctrl + Click] Remove');
  addToHintsFolder('[Delete] Remove All');
  addToHintsFolder('[Ctrl + Z/Y] History');
  addToHintsFolder('[Drop Data File] Load data');
  hintsFolder.open();
};

const deleteImageControls = () => {
  initControlFolder();

  gui.removeFolder(hintsFolder);
  hintsFolder = gui.addFolder('Hints');
  addToHintsFolder('[H] key to hide menu');
  hintsFolder.open();
};

const setMovieControls = (maxFrameIndex = 10000, callback) => {
  addToCtrlFolder(options, 'frameIndex', 0, maxFrameIndex, 1)
    .name('Frame Index')
    .onChange(callback);
  addToCtrlFolder(utilities, 'SelectFrame').name('Select Frame');
  controlFolder.open();
};

const deleteMovieControls = () => {
  initControlFolder();
};

const setBackToMovie = () => {
  addToCtrlFolder(utilities, 'BackToMovie').name('Back to Movie');
};

const setGuiPos = (x, y) => {
  const styl = gui.domElement.style;
  styl.left = x + 'px';
  styl.top = y + 'px';
  styl.position = 'absolute';
};

const addToCtrlFolder = (...params) => {
  const retVal = controlFolder.add(...params);
  controlFolder.children.push(retVal);
  return retVal;
};

const addToHintsFolder = (nameText) => {
  hintsFolder.add(utilities, 'NoOp').name(nameText);
};
