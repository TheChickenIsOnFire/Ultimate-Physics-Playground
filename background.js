chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html', {
    id: 'main',
    innerBounds: {
      width: 800,
      height: 600,
      minWidth: 400,
      minHeight: 400
    }
  });
});