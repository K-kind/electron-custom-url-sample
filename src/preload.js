const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  setWindowReady: (isReady) => {
    ipcRenderer.send('window-ready', isReady);
  },
  listenUrl: (callback) => {
    ipcRenderer.on('url-opened', (_event, url) => {
      callback(url);
    });
  }
});
