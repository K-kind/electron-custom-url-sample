const path = require('path');
const { app, BrowserWindow } = require('electron');

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  });

  mainWindow.loadFile(path.join(__dirname, './index.html'));
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  app.quit();
});
