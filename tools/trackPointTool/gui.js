// dat GUI instance
let gui;

// Setting values for dat GUI
const DefaultOptions = {};
const options = new Object();

const utilities = {
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
  const optionFolder = gui.addFolder('Options');

  // Set initial values
  DefaultOptions.frameIndex = opt.frameIndex;
  DefaultOptions.movieFPS = opt.movieFPS;
  initializeSettings();

  optionFolder.add(options, 'frameIndex', 0, 10000, 1);
  optionFolder.add(options, 'movieFPS', 0, 200, 0.01);
  optionFolder.open();

  //  -- Utilities
  gui.add(utilities, 'DownloadData');
  gui.add(utilities, 'SaveImage');
  gui.add(utilities, 'GitHub');

  // gui.close();
};

// Initialize with default values
const initializeSettings = () => {
  options.frameIndex = DefaultOptions.frameIndex;
  options.movieFPS = DefaultOptions.movieFPS;
  gui.updateDisplay();
};
