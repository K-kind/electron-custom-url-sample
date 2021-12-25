window.onload = () => {
  window.api.listenUrl((url) => {
    document.getElementById('url').textContent = url;
  });

  window.api.setWindowReady(true);
};
