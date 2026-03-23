/**
 * Krakendork - Lógica del juego
 */
(function(window) {
  'use strict';

  const UI = window.KrakendorkUI;
  const Engine = window.KrakendorkEngine;
  const Sprites = window.KrakendorkSprites;
  const Storage = window.KrakendorkStorage;
  const Audio = window.KrakendorkAudio;
  const Input = window.KrakendorkInput;
  const $ = UI.$;

  let G = {};
  const menuItems = ['food', 'snack', 'game', 'light', 'medicine', 'clean', 'stats'];
  let currentMenu = 0;
  let menuOpen = false;

  const C = () => document.getElementById('creature-canvas');
  const ctx = () => C() && C().getContext('2d');

  function getDefaultState() {
    return {
      hunger: 80, happy: 80, energy: 80, clean: 80, weight: 5,
      age: 0, stage: 0, health: 100, sick: false, sickTime: 0, dead: false, deepSleep: false,
      neglectHunger: 0, neglectHappy: 0,
      dayTick: 0, tick: 0,
      sleeping: false, autoLight: true, poop: false, poopCount: 0,
      happyCount: 0, name: 'Krakendork',
      feedCount: 0, gameWins: 0, cleanCount: 0,
      menuOpen: false, menuSel: 0, statsOpen: false, gameOpen: false,
      hatching: true, hatchTick: 0,
      frame: 0, walkDir: 1, walkX: 0, mood: 'happy',
      miniGame: null, needsAttention: false,
      traits: { tail: 0, tentacles: 0, extraEyes: 0 },
    };
  }

  function initGame(forceNew = false) {
    if (Engine && Engine.stopGameLoop) Engine.stopGameLoop();
    if (forceNew && Storage && Storage.clearSave) Storage.clearSave();
    const saved = !forceNew && Storage && Storage.load();
    if (saved && saved.stage > 0) {
      G = Object.assign(getDefaultState(), saved);
      G.hatching = false;
      G.miniGame = null;
      if (!G.traits) G.traits = { tail: 0, tentacles: 0, extraEyes: 0 };
      const z1 = $('sleep-z'), z2 = $('sleep-z2');
      if (z1) z1.style.display = G.sleeping ? 'block' : 'none';
      if (z2) z2.style.display = G.sleeping ? 'block' : 'none';
      const pi = $('poop-icon');
      if (pi) pi.style.display = G.poop ? 'block' : 'none';
      const so = $('sick-overlay');
      if (so) so.style.display = G.sick ? 'flex' : 'none';
    } else {
      G = getDefaultState();
    }

    const c = C();
    if (c) {
      const cx = c.getContext('2d');
      if (cx) cx.imageSmoothingEnabled = false;
    }

    UI.hideAll();
    const ds = $('dead-screen');
    if (ds) ds.style.display = 'none';
    G.deepSleep = false;
    const sb = $('status-bars');
    if (sb) sb.style.opacity = G.stage > 0 ? '1' : '0';
    const sbot = $('screen-bottom');
    if (sbot) sbot.style.display = 'flex';

    if (saved && saved.stage > 0) {
      Engine.startGameLoop(update, render);
      UI.showMsg('¡Bienvenido de nuevo, ' + (G.name || 'Krakendork') + '!', 2000);
    } else {
      Engine.startGameLoop(update, render);
      UI.showMsg('Un huevo misterioso... 🥚', 2500);
    }

    if (window.KrakendorkVisibility) {
      window.KrakendorkVisibility.init(
        () => {
          if (G.stage > 0 && !G.deepSleep) {
            G.sleeping = true;
            const z1 = $('sleep-z'), z2 = $('sleep-z2');
            if (z1) z1.style.display = 'block';
            if (z2) z2.style.display = 'block';
          }
        },
        () => {
          if (G.stage > 0 && G.sleeping) {
            G.sleeping = false;
            const z1 = $('sleep-z'), z2 = $('sleep-z2');
            if (z1) z1.style.display = 'none';
            if (z2) z2.style.display = 'none';
            UI.showMsg('¡' + (G.name || 'Krakendork') + ' despertó! 😊', 2000);
          }
        }
      );
    }
    if (Input) Input.initPetting($('creature-area') || C(), onPet);
  }

  function onPet() {
    if (G.dead || G.hatching || G.deepSleep || G.gameOpen) return;
    if (G.sleeping) { UI.showMsg('¡Está dormido!', 800); return; }
    G.happy = Math.min(100, G.happy + 8);
    UI.showEffect('💕');
    UI.showMsg('¡Qué rico! 🐕', 800);
    if (Audio) Audio.eatBeep();
    if (Input) Input.vibrate(20);
  }

  function update(dt) {
    if (G.dead) return;
    if (G.deepSleep) {
      if (G.tick % 10 === 0) {
        G.hunger = Math.min(50, G.hunger + 2);
        G.energy = Math.min(70, G.energy + 5);
        G.health = Math.min(50, G.health + 3);
      }
      G.tick++;
      return;
    }

    G.frame++;
    G.tick++;

    if (G.hatching) {
      G.hatchTick++;
      if (G.hatchTick === 60) UI.showMsg('¡El huevo se mueve!', 1500);
      if (G.hatchTick >= 120) {
        G.hatching = false;
        G.stage = 1;
        const sb = $('status-bars');
        if (sb) sb.style.opacity = '1';
        UI.evolutionFlash();
        UI.showMsg('¡Nació Krakendork! 🐕', 2000);
      }
      return;
    }

    if (!G.sleeping) {
      G.walkX += 0.4 * G.walkDir;
      if (G.walkX > 12) G.walkDir = -1;
      if (G.walkX < -12) G.walkDir = 1;
    }

    G.dayTick++;
    if (G.dayTick >= 120) {
      G.dayTick = 0;
      G.age++;
      checkEvolution();
      checkPoopRandom();
    }

    if (G.autoLight && G.stage > 1) {
      const gameHour = Math.floor((G.dayTick / 120) * 24);
      if (gameHour >= 22 || gameHour < 7) {
        if (!G.sleeping) {
          G.sleeping = true;
          const z1 = $('sleep-z'), z2 = $('sleep-z2');
          if (z1) z1.style.display = 'block';
          if (z2) z2.style.display = 'block';
        }
      } else {
        if (G.sleeping) {
          G.sleeping = false;
          const z1 = $('sleep-z'), z2 = $('sleep-z2');
          if (z1) z1.style.display = 'none';
          if (z2) z2.style.display = 'none';
        }
      }
    }

    if (G.tick % 5 === 0) {
      if (!G.sleeping) {
        G.hunger = Math.max(0, G.hunger - 1.5);
        G.happy = Math.max(0, G.happy - 1);
        G.clean = Math.max(0, G.clean - 0.8);
      } else {
        G.energy = Math.min(100, G.energy + 3);
      }
      if (!G.sleeping) G.energy = Math.max(0, G.energy - 0.5);

      if (G.sick) {
        G.health = Math.max(0, G.health - 2);
        G.sickTime++;
      }
      if (G.hunger < 20) G.neglectHunger++;
      if (G.happy < 20) G.neglectHappy++;

      if (!G.sick && (G.hunger < 10 || G.clean < 10) && Math.random() < 0.1) {
        G.sick = true;
        const so = $('sick-overlay');
        if (so) so.style.display = 'flex';
        UI.showMsg('¡Krakendork se enfermó!', 2000);
        triggerAttention();
      }

      if (G.sick && G.health <= 0) { enterDeepSleep(); return; }
      if (G.hunger <= 0 && G.neglectHunger > 20) { enterDeepSleep(); return; }

      checkAttention();
      UI.updateBars(G);
    }

    if (G.happy > 70 && G.hunger > 50 && G.tick % 30 === 0) G.happyCount++;

    if (Storage) Storage.scheduleSave(G);
  }

  function render(alpha) {
    UI.updateClock(G);
    drawCreature();
  }

  function drawCreature() {
    const canvas = C();
    const cx = ctx();
    if (!canvas || !cx) return;

    cx.clearRect(0, 0, canvas.width, canvas.height);
    const sprite = Sprites.getSpriteForState(G);
    const tint = Sprites.getTintForStage(G);

    const scale = G.stage >= 4 ? 4 : G.stage >= 2 ? 5 : G.stage === 0 ? 5 : 6;
    const sw = sprite[0].length * scale;
    const sh = sprite.length * scale;
    let ox = Math.floor((canvas.width - sw) / 2);
    let oy = Math.floor((canvas.height - sh) / 2);

    if (!G.sleeping && !G.hatching && G.stage > 0) {
      ox += Math.floor(G.walkX);
      if (G.frame % 20 < 10) oy += 1;
    }

    if (!G.sleeping && G.stage > 0) {
      cx.fillStyle = 'rgba(60,58,53,0.25)';
      cx.beginPath();
      cx.ellipse(ox + sw/2, oy + sh + 2, sw/3, 3, 0, 0, Math.PI*2);
      cx.fill();
    }

    Sprites.drawSprite(cx, sprite, ox, oy, scale, tint);
    if (Sprites.drawTraitOverlay) Sprites.drawTraitOverlay(cx, G, ox, oy, scale);

    if (G.hatching && G.hatchTick > 60) {
      cx.fillStyle = tint[1];
      cx.fillRect(ox + sw/2 - 1, oy, 2, sh);
    }
  }

  function checkAttention() {
    const needsAttn = G.hunger < 30 || G.happy < 30 || G.energy < 20 || G.sick || G.poop;
    const att = $('attention');
    if (att) att.style.display = needsAttn ? 'block' : 'none';
    G.needsAttention = needsAttn;
  }

  function triggerAttention() {
    const att = $('attention');
    if (att) att.style.display = 'block';
  }

  function checkPoopRandom() {
    if (G.stage > 1 && Math.random() < 0.4) {
      G.poop = true;
      G.poopCount++;
      const pi = $('poop-icon');
      if (pi) pi.style.display = 'block';
      triggerAttention();
      UI.showMsg('¡Krakendork hizo pipí!', 1500);
    }
  }

  function checkEvolution() {
    const stages = [0, 1, 3, 6, 12, 20, 30, 50];
    const names = ['','San Bernardo bebé','San Bernardo joven','Con cola peluda','Tentáculos de pulpo','Krakendork','Krakendork+','Gran Krakendork'];
    for (let i = stages.length - 1; i >= 0; i--) {
      if (G.age >= stages[i] && G.stage < i + 1 && i + 1 <= 7) {
        G.stage = i + 1;
        if (!G.traits) G.traits = { tail: 0, tentacles: 0, extraEyes: 0 };
        if (i >= 2) G.traits.tail = Math.min(2, (G.traits.tail || 0) + 1);
        if (i >= 4) G.traits.tentacles = Math.min(4, (G.traits.tentacles || 0) + 1);
        UI.evolutionFlash();
        UI.showMsg('¡Evolucionó a ' + names[G.stage] + '!', 2500);
        break;
      }
    }
  }

  function enterDeepSleep() {
    G.deepSleep = true;
    const ds = $('dead-screen');
    const ageEl = $('dead-age');
    if (ds) ds.style.display = 'flex';
    if (ageEl) ageEl.textContent = 'Toca Luz para despertar';
  }

  function wakeFromSleep() {
    G.deepSleep = false;
    const ds = $('dead-screen');
    if (ds) ds.style.display = 'none';
    G.hunger = Math.min(100, G.hunger + 30);
    G.energy = Math.min(100, G.energy + 40);
    G.health = Math.min(100, G.health + 50);
    G.sick = false;
    const so = $('sick-overlay');
    if (so) so.style.display = 'none';
    UI.showMsg('¡Krakendork despertó! 😊', 2000);
  }

  function highlightMenu() {
    menuItems.forEach((item, i) => {
      const el = $('mi-' + item);
      if (el) el.className = 'menu-item' + (i === currentMenu ? ' selected' : '');
    });
  }

  function executeMenu(action) {
    if (G.sleeping && action !== 'light' && action !== 'stats') {
      UI.showMsg('¡Está dormido!', 1200);
      return;
    }
    switch (action) {
      case 'food': feedMeal(); break;
      case 'snack': feedSnack(); break;
      case 'game': startMiniGame(); break;
      case 'light': toggleLight(); break;
      case 'medicine': giveMedicine(); break;
      case 'clean': cleanUp(); break;
      case 'stats': openStats(); break;
    }
  }

  function feedMeal() {
    if (G.hunger >= 100) { UI.showMsg('¡No tiene hambre!', 1200); return; }
    G.hunger = Math.min(100, G.hunger + 30);
    G.weight += 0.5;
    G.clean = Math.max(0, G.clean - 5);
    G.feedCount = (G.feedCount || 0) + 1;
    UI.showEffect('🍙');
    UI.showMsg('¡Ñam ñam!', 1000);
    UI.spawnFood('🍙');
    if (Audio) Audio.eatBeep();
  }

  function feedSnack() {
    if (G.hunger >= 100) { UI.showMsg('¡No tiene hambre!', 1200); return; }
    G.hunger = Math.min(100, G.hunger + 15);
    G.happy = Math.min(100, G.happy + 15);
    G.weight += 1;
    G.feedCount = (G.feedCount || 0) + 1;
    UI.showEffect('🍬');
    UI.showMsg('¡Dulce! 😋', 1000);
    UI.spawnFood('🍬');
    if (Audio) Audio.eatBeep();
  }

  function startMiniGame() {
    if (G.energy < 15) { UI.showMsg('¡Está muy cansado!', 1200); return; }
    G.gameOpen = true;
    const ga = $('game-area');
    if (ga) ga.style.display = 'flex';

    const games = ['leftRight', 'simon', 'number', 'reflex'];
    const pick = games[Math.floor(Math.random() * games.length)];

    if (pick === 'leftRight') startLeftRightGame();
    else if (pick === 'simon') startSimonGame();
    else if (pick === 'number') startNumberGame();
    else startReflexGame();
  }

  function startLeftRightGame() {
    const target = Math.random() < 0.5 ? '⬅️' : '➡️';
    G.miniGame = { type: 'leftRight', target, answered: false };
    const gp = $('game-prompt'), gt = $('game-target'), gr = $('game-result'), gi = $('game-input');
    if (gp) gp.textContent = '¿Izq o Der?';
    if (gt) gt.textContent = '❓';
    if (gr) gr.textContent = '';
    if (gi) gi.innerHTML = `<div class="game-btn" onclick="Krakendork.answerGame('left')">⬅️</div><div class="game-btn" onclick="Krakendork.answerGame('right')">➡️</div>`;
  }

  function startSimonGame() {
    const seq = ['🔴','🟢','🔵','🟡'];
    const len = 3 + Math.floor(Math.random() * 2);
    const pattern = [];
    for (let i = 0; i < len; i++) pattern.push(seq[Math.floor(Math.random() * 4)]);
    G.miniGame = { type: 'simon', pattern, step: 0, showing: true, answered: false };
    const gp = $('game-prompt'), gt = $('game-target'), gr = $('game-result'), gi = $('game-input');
    if (gp) gp.textContent = '¡Simón dice! Repite la secuencia';
    if (gt) gt.textContent = pattern[0];
    if (gr) gr.textContent = '';
    if (gi) gi.innerHTML = seq.map((s,i)=>`<div class="game-btn" onclick="Krakendork.answerSimon(${i})">${s}</div>`).join('');
    let idx = 0;
    const iv = setInterval(() => {
      idx++;
      if (idx >= pattern.length) {
        clearInterval(iv);
        if (G.miniGame && G.miniGame.type === 'simon') G.miniGame.showing = false;
        return;
      }
      if (gt) gt.textContent = pattern[idx];
    }, 600);
  }

  function answerSimon(idx) {
    if (!G.miniGame || G.miniGame.type !== 'simon' || G.miniGame.showing || G.miniGame.answered) return;
    const seq = ['🔴','🟢','🔵','🟡'];
    const expected = G.miniGame.pattern[G.miniGame.step];
    const chosen = seq[idx];
    if (chosen !== expected) {
      G.miniGame.answered = true;
      G.happy = Math.max(0, G.happy - 5);
      G.energy = Math.max(0, G.energy - 10);
      if ($('game-result')) $('game-result').textContent = 'Perdiste...';
      if (Audio) Audio.failBeep();
      setTimeout(() => { G.gameOpen = false; if ($('game-area')) $('game-area').style.display = 'none'; }, 1500);
      return;
    }
    G.miniGame.step++;
    if (G.miniGame.step >= G.miniGame.pattern.length) {
      G.miniGame.answered = true;
      G.happy = Math.min(100, G.happy + 25);
      G.energy = Math.max(0, G.energy - 10);
      G.happyCount++; G.gameWins = (G.gameWins || 0) + 1;
      if ($('game-result')) $('game-result').textContent = '¡Perfecto! +25😊';
      UI.showHearts();
      if (Audio) Audio.successBeep();
      setTimeout(() => { G.gameOpen = false; if ($('game-area')) $('game-area').style.display = 'none'; }, 1500);
    }
  }

  function startNumberGame() {
    const target = 1 + Math.floor(Math.random() * 9);
    G.miniGame = { type: 'number', target, answered: false };
    const gp = $('game-prompt'), gt = $('game-target'), gr = $('game-result'), gi = $('game-input');
    if (gp) gp.textContent = '¿Qué número es? (1-9)';
    if (gt) gt.textContent = '❓';
    if (gr) gr.textContent = '';
    const others = [1,2,3,4,5,6,7,8,9].filter(n => n !== target).sort(()=>Math.random()-0.5).slice(0,5);
    const nums = [target, ...others].sort(()=>Math.random()-0.5);
    if (gi) gi.innerHTML = nums.map(n=>`<div class="game-btn" onclick="Krakendork.answerNumber(${n})">${n}</div>`).join('');
  }

  function answerNumber(n) {
    if (!G.miniGame || G.miniGame.type !== 'number' || G.miniGame.answered) return;
    G.miniGame.answered = true;
    const gt = $('game-target'), gr = $('game-result');
    if (gt) gt.textContent = G.miniGame.target;
    const correct = n === G.miniGame.target;
    if (correct) {
      G.happy = Math.min(100, G.happy + 25);
      G.energy = Math.max(0, G.energy - 10);
      G.happyCount++; G.gameWins = (G.gameWins || 0) + 1;
      if (gr) gr.textContent = '¡Correcto! +25😊';
      UI.showHearts();
      if (Audio) Audio.successBeep();
    } else {
      G.happy = Math.max(0, G.happy - 5);
      G.energy = Math.max(0, G.energy - 10);
      if (gr) gr.textContent = 'Era ' + G.miniGame.target;
      if (Audio) Audio.failBeep();
    }
    setTimeout(() => { G.gameOpen = false; if ($('game-area')) $('game-area').style.display = 'none'; }, 1500);
  }

  function startReflexGame() {
    G.miniGame = { type: 'reflex', startTime: null, answered: false };
    const gp = $('game-prompt'), gt = $('game-target'), gr = $('game-result'), gi = $('game-input');
    if (gp) gp.textContent = '¡Espera... Toca cuando veas GO!';
    if (gt) gt.textContent = '...';
    if (gr) gr.textContent = '';
    if (gi) gi.innerHTML = '<div class="game-btn" id="reflex-btn" style="width:80px">Esperar</div>';
    const delay = 1500 + Math.random() * 2000;
    setTimeout(() => {
      if (!G.miniGame || G.miniGame.answered) return;
      G.miniGame.startTime = Date.now();
      const btn = $('reflex-btn');
      if (btn) { btn.textContent = '¡GO!'; btn.onclick = () => answerReflex(); }
      if (gt) gt.textContent = '¡AHORA!';
    }, delay);
  }

  function answerReflex() {
    if (!G.miniGame || G.miniGame.type !== 'reflex' || G.miniGame.answered) return;
    G.miniGame.answered = true;
    const elapsed = G.miniGame.startTime ? Date.now() - G.miniGame.startTime : 0;
    const gt = $('game-target'), gr = $('game-result');
    if (gt) gt.textContent = elapsed + 'ms';
    const good = elapsed < 500 && elapsed > 50;
    if (good) {
      G.happy = Math.min(100, G.happy + 30);
      G.energy = Math.max(0, G.energy - 10);
      G.happyCount++; G.gameWins = (G.gameWins || 0) + 1;
      if (gr) gr.textContent = '¡Increíble! +30😊';
      UI.showHearts();
      if (Audio) Audio.successBeep();
    } else if (elapsed < 100) {
      G.happy = Math.max(0, G.happy - 10);
      if (gr) gr.textContent = '¡Muy pronto!';
      if (Audio) Audio.failBeep();
    } else {
      G.happy = Math.min(100, G.happy + 15);
      G.energy = Math.max(0, G.energy - 10);
      if (gr) gr.textContent = 'Bien: ' + elapsed + 'ms';
    }
    setTimeout(() => { G.gameOpen = false; if ($('game-area')) $('game-area').style.display = 'none'; }, 1500);
  }

  function answerGame(choice) {
    if (!G.miniGame || G.miniGame.answered) return;
    if (G.miniGame.type && G.miniGame.type !== 'leftRight') return;
    G.miniGame.answered = true;

    const correct = (choice === 'left' && G.miniGame.target === '⬅️') || (choice === 'right' && G.miniGame.target === '➡️');
    const gt = $('game-target');
    const gr = $('game-result');
    if (gt) gt.textContent = G.miniGame.target;

    if (correct) {
      G.happy = Math.min(100, G.happy + 25);
      G.energy = Math.max(0, G.energy - 10);
      G.happyCount++;
      G.gameWins = (G.gameWins || 0) + 1;
      if (gr) gr.textContent = '¡Ganaste! +25😊';
      UI.showHearts();
      if (Audio) Audio.successBeep();
    } else {
      G.happy = Math.max(0, G.happy - 5);
      G.energy = Math.max(0, G.energy - 10);
      if (gr) gr.textContent = 'Perdiste...';
      if (Audio) Audio.failBeep();
    }

    setTimeout(() => {
      G.gameOpen = false;
      const ga = $('game-area');
      if (ga) ga.style.display = 'none';
    }, 1500);
  }

  function handleGameInput(btn) {
    if (G.miniGame && G.miniGame.type === 'simon') {
      if (btn === 'A') answerSimon(0);
      else if (btn === 'B') answerSimon(1);
      else if (btn === 'C') answerSimon(2);
      return;
    }
    if (G.miniGame && G.miniGame.type === 'leftRight') {
      if (btn === 'A') answerGame('left');
      else if (btn === 'C') answerGame('right');
    }
    if (btn === 'B') {
      G.gameOpen = false;
      const ga = $('game-area');
      if (ga) ga.style.display = 'none';
    }
  }

  function toggleLight() {
    if (G.deepSleep) { wakeFromSleep(); return; }
    G.sleeping = !G.sleeping;
    const z1 = $('sleep-z'), z2 = $('sleep-z2');
    if (G.sleeping) {
      if (z1) z1.style.display = 'block';
      if (z2) z2.style.display = 'block';
      UI.showMsg('Buenas noches... 💤', 1200);
    } else {
      if (z1) z1.style.display = 'none';
      if (z2) z2.style.display = 'none';
      UI.showMsg('¡Buenos días! ☀️', 1200);
    }
  }

  function giveMedicine() {
    if (!G.sick) { UI.showMsg('¡Está sano!', 1200); return; }
    G.sick = false;
    G.health = Math.min(100, G.health + 50);
    G.sickTime = 0;
    const so = $('sick-overlay');
    if (so) so.style.display = 'none';
    UI.showEffect('💊');
    UI.showMsg('¡Se curó! 💪', 1500);
  }

  function cleanUp() {
    if (G.clean >= 90 && !G.poop) { UI.showMsg('¡Ya está limpio!', 1200); return; }
    G.clean = 100;
    G.cleanCount = (G.cleanCount || 0) + 1;
    if (G.poop) {
      G.poop = false;
      const pi = $('poop-icon');
      if (pi) pi.style.display = 'none';
    }
    UI.showEffect('🛁');
    UI.showMsg('¡Limpio y fresquito!', 1200);
    checkAttention();
  }

  function openStats() {
    G.statsOpen = true;
    const sp = $('stats-panel');
    if (sp) sp.style.display = 'flex';

    const s = (id, w) => { const e = $(id); if (e) e.style.width = w + '%'; };
    s('ps-hunger', G.hunger);
    s('ps-happy', G.happy);
    s('ps-energy', G.energy);
    s('ps-clean', G.clean);
    s('ps-weight', Math.min(100, (G.weight/30)*100));

    const t = (id, v) => { const e = $(id); if (e) e.textContent = v; };
    t('psv-hunger', Math.round(G.hunger));
    t('psv-happy', Math.round(G.happy));
    t('psv-energy', Math.round(G.energy));
    t('psv-clean', Math.round(G.clean));
    t('psv-weight', Math.round(G.weight));
    t('ps-age', G.age);
    t('ps-hc', G.happyCount);
    t('ps-sick', G.sick ? '⚕️ ENFERMO' : '');
    const ach = $('ps-achievements');
    if (ach) ach.innerHTML = '🍙' + (G.feedCount||0) + ' 🎮' + (G.gameWins||0) + ' 🛁' + (G.cleanCount||0);
    const nameInput = $('ps-name');
    if (nameInput) nameInput.value = G.name || 'Krakendork';
  }

  function setName(name) {
    const n = (name || '').trim();
    if (n.length > 0 && n.length <= 12) {
      G.name = n;
      UI.showMsg('¡Te llamas ' + G.name + '!', 1500);
    }
  }

  function closeStats() {
    G.statsOpen = false;
    const sp = $('stats-panel');
    if (sp) sp.style.display = 'none';
  }

  function pressA() {
    if (Audio) Audio.btnBeep();
    if (Input) Input.vibrate(15);
    if (G.dead || G.hatching) return;
    if (G.deepSleep) { wakeFromSleep(); return; }
    if (G.gameOpen) { handleGameInput('A'); return; }
    if (G.statsOpen) { closeStats(); return; }
    if (menuOpen) {
      currentMenu = (currentMenu + 1) % menuItems.length;
      highlightMenu();
    }
  }

  function pressB() {
    if (Audio) Audio.btnBeep();
    if (Input) Input.vibrate(15);
    if (G.dead || G.hatching) return;
    if (G.deepSleep) { wakeFromSleep(); return; }
    if (G.gameOpen) { handleGameInput('B'); return; }
    if (G.statsOpen) { closeStats(); return; }
    menuOpen = !menuOpen;
    const mo = $('menu-overlay');
    if (mo) {
      mo.style.display = menuOpen ? 'flex' : 'none';
      if (menuOpen) highlightMenu();
    }
  }

  function pressC() {
    if (Audio) Audio.btnBeep();
    if (Input) Input.vibrate(15);
    if (G.dead || G.hatching) return;
    if (G.deepSleep) { wakeFromSleep(); return; }
    if (G.gameOpen) { handleGameInput('C'); return; }
    if (G.statsOpen) { closeStats(); return; }
    if (menuOpen) {
      executeMenu(menuItems[currentMenu]);
      menuOpen = false;
      const mo = $('menu-overlay');
      if (mo) mo.style.display = 'none';
    }
  }

  function selectMenu(item) {
    menuOpen = false;
    const mo = $('menu-overlay');
    if (mo) mo.style.display = 'none';
    executeMenu(item);
  }

  window.Krakendork = {
    G: () => G,
    initGame,
    pressA,
    pressB,
    pressC,
    selectMenu,
    answerGame,
    answerSimon,
    answerNumber,
    answerReflex,
    wakeFromSleep,
    closeStats,
    setName,
  };
})(window);
