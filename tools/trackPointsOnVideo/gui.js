// dat GUI instance
let gui;
let controlFolder;
let frameIndex;

// Setting values for dat GUI
const options = new Object();

const utilities = {
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
  gui.updateDisplay();

  // Controls
  controlFolder = gui.addFolder('Controls');
  controlFolder.open();

  // Appendix
  const appendixFolder = gui.addFolder('Appendix');
  appendixFolder.add(utilities, 'SaveImage').name('Save Image');
  appendixFolder.add(utilities, 'GitHub').name('move To GitHub Repo');
  appendixFolder.close();
};

const setframeIndex = (maxFrameIndex, callback) => {
  frameIndex = controlFolder.add(options, 'frameIndex', 0, maxFrameIndex, 1).name('Frame Index');
  frameIndex.onChange(callback);
  controlFolder.open();
};
