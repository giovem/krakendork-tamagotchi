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
})();
