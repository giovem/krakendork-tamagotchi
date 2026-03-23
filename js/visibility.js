/**
 * Krakendork - Page Visibility API (dormir cuando pestaña inactiva)
 */
(function(window) {
  'use strict';

  let wasHidden = false;
  let hiddenTime = 0;
  const SLEEP_AFTER_MS = 30000; // 30 segundos inactivo

  function init(onHide, onShow) {
    if (typeof document.hidden === 'undefined') return;

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        wasHidden = true;
        hiddenTime = Date.now();
        if (onHide) onHide();
      } else {
        if (wasHidden && hiddenTime && (Date.now() - hiddenTime) > 5000) {
          if (onShow) onShow(Date.now() - hiddenTime);
        }
        wasHidden = false;
        hiddenTime = 0;
      }
    });
  }

  window.KrakendorkVisibility = { init };
})(window);
