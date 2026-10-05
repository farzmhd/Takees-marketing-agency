(() => {
  try {
    if (localStorage.getItem('takees-theme') === 'dark') {
      document.documentElement.dataset.theme = 'dark';
    }
  } catch {
    // Storage can be unavailable for some local file origins.
  }
})();
