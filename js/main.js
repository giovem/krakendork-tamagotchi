/**
 * Krakendork - Entry point
 */
(function() {
  'use strict';

  if (window.KrakendorkUI) {
    window.KrakendorkUI.initStars();
  }
  if (window.Krakendork) {
    window.Krakendork.initGame();
  }
  if (window.KrakendorkInput) {
    window.KrakendorkInput.initKeyboard();
  }
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(function() {});
  }
})();
