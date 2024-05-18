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
  NoOp: () => {
    // No Operation
  },

};

const prepareDatGUI = (opt) => {
  gui = new dat.GUI({ closeOnTop: true, hideable: true });
  controlFolder = gui.addFolder('Controls');

  // Set initial values
  DefaultOptions.frameIndex = opt.frameIndex;
  DefaultOptions.showCoordinate = opt.showCoordinate;
  initializeSettings();

  controlFolder.open();

  //  -- Appendix
  appendixFolder = gui.addFolder('Appendix');
  appendixFolder.add(utilities, 'SaveImage').name('Save Image');
  appendixFolder.add(utilities, 'GitHub').name('move To GitHub Repo');
  appendixFolder.close();

  gui.add(utilities, 'NoOp').name('[h] key to hide menu');

  // gui.close();
};

const setImageControls = ( maxFrameIndex = 10000, bEnable) => {
  frameIndex = controlFolder.add(options, 'frameIndex', 0, maxFrameIndex, 1)
  console.log(frameIndex);
  if(!bEnable){
    frameIndex.domElement.hidden = true;
    frameIndex.name('Frame: ' + options.frameIndex);
  }
  controlFolder.add(options, 'showCoordinate', false).name('Show Coordinate');
  controlFolder.add(utilities, 'DownloadData').name('Download Data');
}


const setMovieControls = (maxFrameIndex = 10000, callback) => {
  frameIndex = controlFolder.add(options, 'frameIndex', 0, maxFrameIndex, 1).name('Frame Index');
  frameIndex.onChange(callback);
  selectFrameCtrl = controlFolder.add(utilities, 'SelectFrame').name('Select Frame');
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
