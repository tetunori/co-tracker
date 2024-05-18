// dat GUI instance
let gui;
let controlFolder;
let frameIndex;
let selectFrameCtrl;

// Setting values for dat GUI
const DefaultOptions = {};
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
};

const prepareDatGUI = (opt) => {
  gui = new dat.GUI({ closeOnTop: true });
  controlFolder = gui.addFolder('Controls');

  // Set initial values
  DefaultOptions.frameIndex = opt.frameIndex;
  DefaultOptions.showCoordinate = opt.showCoordinate;
  initializeSettings();

  controlFolder.open();

  //  -- Appendix
  appendixFolder = gui.addFolder('Appendix');
  appendixFolder.add(utilities, 'SaveImage');
  appendixFolder.add(utilities, 'GitHub');
  appendixFolder.close();


  // gui.close();
};

const setImageControls = () => {
  frameIndex = controlFolder.add(options, 'frameIndex', 0, 10000, 1);
  controlFolder.add(options, 'showCoordinate', false);
  controlFolder.add(utilities, 'DownloadData');
}


const setMovieControls = (maxFrameIndex = 10000, callback) => {
  frameIndex = controlFolder.add(options, 'frameIndex', 0, maxFrameIndex, 1);
  frameIndex.onChange(callback);
  selectFrameCtrl = controlFolder.add(utilities, 'SelectFrame');
}

const deleteMovieControls = () => {
  controlFolder.remove(frameIndex)
  controlFolder.remove(selectFrameCtrl)
}

// Initialize with default values
const initializeSettings = () => {
  options.frameIndex = DefaultOptions.frameIndex;
  options.showCoordinate = DefaultOptions.showCoordinate;
  gui.updateDisplay();
};
