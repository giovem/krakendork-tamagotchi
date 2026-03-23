/**
 * Krakendork - Capa de UI y efectos visuales
 */
(function(window) {
  'use strict';

  const $ = id => document.getElementById(id);

  function showMsg(text, dur = 1500) {
    const mb = $('msg-bubble');
    if (!mb) return;
    mb.textContent = text;
    mb.style.display = 'block';
    clearTimeout(mb._t);
    mb._t = setTimeout(() => { mb.style.display = 'none'; }, dur);
  }

  function updateBars(G) {
    const ids = ['bar-hunger', 'bar-happy', 'bar-energy', 'bar-clean'];
    const keys = ['hunger', 'happy', 'energy', 'clean'];
    keys.forEach((k, i) => {
      const el = $(ids[i]);
      if (el) el.style.width = G[k] + '%';
    });
  }

  function updateClock(G) {
    const pct = G.dayTick / 120;
    const h = Math.floor(pct * 24);
    const m = Math.floor((pct * 24 - h) * 60);
    const timeEl = $('time-display');
    const ageEl = $('age-display');
    if (timeEl) timeEl.textContent = String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
    if (ageEl) ageEl.textContent = 'Día ' + G.age;
  }

  function showEffect(emoji) {
    const el = $('effect-layer');
    if (!el) return;
    const span = document.createElement('span');
    span.textContent = emoji;
    span.className = 'effect-rise';
    span.style.fontSize = '20px';
    el.appendChild(span);
    setTimeout(() => span.remove(), 800);
  }

  function spawnFood(emoji) {
    const screen = $('main-screen');
    if (!screen) return;
    const fi = document.createElement('div');
    fi.className = 'food-item';
    fi.textContent = emoji;
    fi.style.left = (30 + Math.random() * 40) + '%';
    screen.appendChild(fi);
    setTimeout(() => fi.remove(), 1000);
  }

  function showHearts() {
    const el = $('effect-layer');
    if (!el) return;
    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        const h = document.createElement('span');
        h.className = 'heart-particle';
        h.textContent = '♥';
        h.style.cssText = `font-size:10px;color:#c04040;position:absolute;left:${25+Math.random()*50}%;top:50%;animation:rise 1s forwards;pointer-events:none`;
        el.appendChild(h);
        setTimeout(() => h.remove(), 1000);
      }, i * 150);
    }
  }

  function evolutionFlash() {
    const fl = $('evo-flash');
    if (!fl) return;
    fl.style.display = 'block';
    let n = 0;
    const iv = setInterval(() => {
      fl.style.opacity = n % 2 === 0 ? '1' : '0';
      n++;
      if (n > 6) { clearInterval(iv); fl.style.display = 'none'; }
    }, 150);
  }

  function hideAll() {
    ['menu-overlay', 'stats-panel', 'game-area', 'sick-overlay', 'evo-flash'].forEach(id => {
      const el = $(id);
      if (el) el.style.display = 'none';
    });
  }

  function initStars() {
    const sc = $('stars');
    if (!sc) return;
    sc.innerHTML = '';
    for (let i = 0; i < 40; i++) {
      const s = document.createElement('div');
      s.className = 'star animate-twinkle';
      s.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;animation-delay:${Math.random()*3}s;animation-duration:${2+Math.random()*3}s`;
      sc.appendChild(s);
    }
  }

  window.KrakendorkUI = {
    $,
    showMsg,
    updateBars,
    updateClock,
    showEffect,
    spawnFood,
    showHearts,
    evolutionFlash,
    hideAll,
    initStars
  };
})(window);
