/**
 * Krakendork - Motor de juego y framework de animaciones
 * Game loop con requestAnimationFrame, delta time, state machine
 */
(function(window) {
  'use strict';

  const TARGET_FPS = 60;
  const TICK_RATE = 20;  // game logic updates per second
  const MS_PER_TICK = 1000 / TICK_RATE;

  let rafId = null;
  let lastTime = 0;
  let accumulator = 0;

  /**
   * Game Loop con tiempo delta y lógica a tick fijo
   * @param {number} timestamp - requestAnimationFrame timestamp
   * @param {Function} updateFn - (dt) => void, se llama cada tick
   * @param {Function} renderFn - (alpha) => void, se llama cada frame
   */
  function gameLoop(timestamp, updateFn, renderFn) {
    if (!lastTime) lastTime = timestamp;
    const frameTime = Math.min((timestamp - lastTime) / 1000, 0.25); // cap para evitar saltos
    lastTime = timestamp;
    accumulator += frameTime;

    while (accumulator >= 1 / TICK_RATE) {
      updateFn(1 / TICK_RATE);
      accumulator -= 1 / TICK_RATE;
    }

    const alpha = accumulator / (1 / TICK_RATE);
    renderFn(alpha);

    rafId = requestAnimationFrame(ts => gameLoop(ts, updateFn, renderFn));
  }

  function startGameLoop(updateFn, renderFn) {
    lastTime = 0;
    accumulator = 0;
    rafId = requestAnimationFrame(ts => gameLoop(ts, updateFn, renderFn));
  }

  function stopGameLoop() {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  /**
   * State Machine para animaciones del creature
   */
  const AnimationState = {
    IDLE: 'idle',
    WALK: 'walk',
    SLEEP: 'sleep',
    EAT: 'eat',
    HAPPY: 'happy',
    SAD: 'sad',
    SICK: 'sick',
    HATCH: 'hatch',
    DEEP_SLEEP: 'deepSleep'
  };

  class AnimationController {
    constructor() {
      this.state = AnimationState.IDLE;
      this.frame = 0;
      this.frameDuration = 20;  // ticks por frame de sprite
      this.stateStartTime = 0;
    }

    setState(state) {
      if (this.state !== state) {
        this.state = state;
        this.frame = 0;
        this.stateStartTime = performance.now();
      }
    }

    getFrameIndex(spriteFrames = 2) {
      return Math.floor(this.frame / this.frameDuration) % spriteFrames;
    }

    tick(dt) {
      this.frame++;
    }

    reset() {
      this.frame = 0;
      this.state = AnimationState.IDLE;
    }
  }

  /**
   * Easing functions para transiciones suaves
   */
  const Easing = {
    linear: t => t,
    easeIn: t => t * t,
    easeOut: t => t * (2 - t),
    easeInOut: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    bounce: t => {
      if (t < 1/2.75) return 7.5625 * t * t;
      if (t < 2/2.75) return 7.5625 * (t -= 1.5/2.75) * t + 0.75;
      if (t < 2.5/2.75) return 7.5625 * (t -= 2.25/2.75) * t + 0.9375;
      return 7.5625 * (t -= 2.625/2.75) * t + 0.984375;
    }
  };

  /**
   * Tween simple para animar valores
   * @param {Object} opts - { from, to, duration, onUpdate, easing }
   */
  function tween(opts) {
    const { from, to, duration = 1, onUpdate, easing = Easing.linear } = opts;
    const start = performance.now();

    function update(now) {
      const elapsed = (now - start) / 1000;
      const t = Math.min(elapsed / duration, 1);
      const eased = easing(t);
      const value = from + (to - from) * eased;
      onUpdate(value);
      if (t < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  window.KrakendorkEngine = {
    startGameLoop,
    stopGameLoop,
    AnimationState,
    AnimationController,
    Easing,
    tween,
    TARGET_FPS,
    TICK_RATE,
    MS_PER_TICK
  };
})(window);
