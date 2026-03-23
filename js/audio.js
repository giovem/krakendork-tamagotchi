/**
 * Krakendork - Sonidos retro (Web Audio API)
 */
(function(window) {
  'use strict';
  let ctx = null;

  function init() {
    if (ctx) return ctx;
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      return ctx;
    } catch (e) {
      return null;
    }
  }

  function beep(freq = 880, duration = 0.05, type = 'square') {
    const ac = init();
    if (!ac) return;
    try {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.frequency.value = freq;
      osc.type = type;
      gain.gain.setValueAtTime(0.15, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration);
      osc.start(ac.currentTime);
      osc.stop(ac.currentTime + duration);
    } catch (e) {}
  }

  function btnBeep() { beep(660, 0.03); }
  function successBeep() { beep(880, 0.08); beep(1100, 0.06); }
  function failBeep() { beep(220, 0.1); }
  function eatBeep() { beep(440, 0.04); beep(550, 0.04); }

  window.KrakendorkAudio = {
    init, beep, btnBeep, successBeep, failBeep, eatBeep
  };
})(window);
