// dat GUI instance
let gui;
let controlFolder;
let frameIndex;
let hintsFolder;

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
  options.dataFPS = opt.dataFPS;
  options.movieFPS = opt.movieFPS;
  options.frameOffset = opt.frameOffset;
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
};

const setframeIndex = (maxFrameIndex, callback) => {
  frameIndex = controlFolder.add(options, 'frameIndex', 0, maxFrameIndex, 1).name('Frame Index');
  frameIndex.onChange(callback);
  controlFolder.open();
};

const setMovieControls = (movieFPS) => {
  options.dataFPS = movieFPS;
  options.movieFPS = movieFPS;

  controlFolder.add(options, 'dataFPS', 0, 120, 1).name('Data FPS');
  const movFPS = controlFolder.add(options, 'movieFPS', 0, movieFPS, 1);
  movFPS.domElement.hidden = true;
  movFPS.name('Mov FPS: ' + movieFPS);
  controlFolder.add(options, 'frameOffset', -5, 5, 1).name('Frame Offset');

  controlFolder.open();
  hintsFolder.add(utilities, 'NoOp').name('[Shift + mouseX]: bg alpha');
  hintsFolder.add(utilities, 'NoOp').name('[Ctrl + Click]: play/pause');
  hintsFolder.open();
};
