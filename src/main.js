const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');
const { setUrlListener } = require('./lib/set-url-listener');

let mainWindow;
let windowReady = false;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, './preload.js')
    }
  });

  mainWindow.loadFile(path.join(__dirname, './index.html'));

  ipcMain.once('window-ready', () => {
    windowReady = true;
  });
};

const getMainWindowWhenReady = async () => {
  if (!windowReady) {
    await new Promise((resolve) => ipcMain.once('window-ready', resolve));
  }
  return mainWindow;
};

const main = () => {
  const shouldContinue = setUrlListener(getMainWindowWhenReady);
  if (!shouldContinue) return;

  app.on('ready', createWindow);

  app.on('window-all-closed', () => {
    app.quit();
  });
}

main();
