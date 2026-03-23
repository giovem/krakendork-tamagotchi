/**
 * Krakendork - Teclado, vibración, caricias (tap)
 */
(function(window) {
  'use strict';

  function initKeyboard() {
    document.addEventListener('keydown', (e) => {
      if (e.repeat) return;
      const K = window.Krakendork;
      if (!K) return;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') { e.preventDefault(); K.pressA(); }
      else if (e.code === 'KeyB' || e.code === 'KeyM') { e.preventDefault(); K.pressB(); }
      else if (e.code === 'KeyC' || e.code === 'ArrowRight') { e.preventDefault(); K.pressC(); }
    });
  }

  function vibrate(pattern = 30) {
    if (navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {}
    }
  }

  function initPetting(canvasOrArea, onPet) {
    if (!canvasOrArea || !onPet) return;
    let lastPet = 0;
    canvasOrArea.addEventListener('click', (e) => {
      if (Date.now() - lastPet < 500) return;
      lastPet = Date.now();
      onPet(e);
    });
    canvasOrArea.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (Date.now() - lastPet < 500) return;
      lastPet = Date.now();
      onPet(e);
    }, { passive: false });
  }

  window.KrakendorkInput = { initKeyboard, vibrate, initPetting };
})(window);
