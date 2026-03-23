/**
 * Krakendork - Persistencia con localStorage
 */
(function(window) {
  'use strict';
  const KEY = 'krakendork_save';
  const SAVE_INTERVAL = 10000; // 10 segundos
  let saveTimer = null;

  function save(G) {
    try {
      const data = {
        hunger: G.hunger, happy: G.happy, energy: G.energy, clean: G.clean, weight: G.weight,
        age: G.age, stage: G.stage, health: G.health, sick: G.sick, sickTime: G.sickTime,
        neglectHunger: G.neglectHunger, neglectHappy: G.neglectHappy,
        dayTick: G.dayTick, tick: G.tick, lastSave: Date.now(),
        sleeping: G.sleeping, poop: G.poop, poopCount: G.poopCount,
        happyCount: G.happyCount, frame: G.frame, walkDir: G.walkDir, walkX: G.walkX,
        name: G.name || 'Krakendork',
        feedCount: G.feedCount || 0, gameWins: G.gameWins || 0, cleanCount: G.cleanCount || 0,
        traits: G.traits || { tail: 0, tentacles: 0, extraEyes: 0 },
      };
      localStorage.setItem(KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      return false;
    }
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  function scheduleSave(G) {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => save(G), SAVE_INTERVAL);
  }

  function clearSave() {
    try {
      localStorage.removeItem(KEY);
      return true;
    } catch (e) {
      return false;
    }
  }

  window.KrakendorkStorage = { save, load, scheduleSave, clearSave };
})(window);
