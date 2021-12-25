const { app, BrowserWindow } = require('electron');

const CUSTOM_SCHEME = 'custom-url';

/**
 * @param {() => Promise<BrowserWindow>} getMainWindow
 * @return {boolean} whether app should continue to start or not
 */
exports.setUrlListener = async (getMainWindow) => {
  if (process.platform === 'darwin') {
    // this event is emitted whether the app has already been started or not
    app.on('open-url', async (_event, url) => {
      const mainWindow = await getMainWindow();
      sendUrlToWindow(mainWindow, url);
      mainWindow.isMinimized() && mainWindow.restore();
    });
  } else if (process.platform === 'win32') {
    const gotTheLock = app.requestSingleInstanceLock();
    if (!gotTheLock) {
      // when the app has already been started
      app.quit();
      return false;
    }

    app.setAsDefaultProtocolClient(CUSTOM_SCHEME);

    // this event is emitted inside the primary app when a second app calls requestSingleInstanceLock
    app.on('second-instance', async (_event, commandLineArgs) => {
      const mainWindow = await getMainWindow();

      const url = commandLineArgs.find((arg) => arg.startsWith(`${CUSTOM_SCHEME}://`));
      url && sendUrlToWindow(mainWindow, url);

      mainWindow.isMinimized() && mainWindow.restore();
      mainWindow.focus();
    });

    // when the app has been started by clicking url
    const url = process.argv.find((arg) => arg.startsWith(`${CUSTOM_SCHEME}://`));
    url && getMainWindow().then((mainWindow) => sendUrlToWindow(mainWindow, url));
  }

  return true;
};

/**
 * @param {BrowserWindow} mainWindow
 * @param {string} url
 */
const sendUrlToWindow = (mainWindow, url) => {
  mainWindow.send('url-opened', url);
};
