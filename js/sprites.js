/**
 * Krakendork - Sprites pixel art y renderer
 * Cada sprite: array 2D [rows][cols], 0=transparente, 1=oscuro, 2=medio, 3=claro
 */
(function(window) {
  'use strict';

  const SPRITES = {
    egg: [
      [0,0,1,1,1,0,0], [0,1,2,2,2,1,0], [1,2,2,3,2,2,1],
      [1,2,3,2,2,2,1], [1,2,2,2,2,2,1], [0,1,2,2,2,1,0], [0,0,1,1,1,0,0],
    ],
    egg_crack: [
      [0,0,1,1,1,0,0], [0,1,2,1,2,1,0], [1,2,1,3,2,2,1],
      [1,2,3,1,2,2,1], [1,2,2,2,1,2,1], [0,1,2,2,1,1,0], [0,0,1,1,1,0,0],
    ],
    baby: [
      [0,1,1,1,0], [1,2,3,2,1], [1,2,2,2,1],
      [1,1,2,1,1], [0,1,1,1,0],
    ],
    baby2: [
      [0,1,1,1,0], [1,2,2,2,1], [1,3,2,3,1],
      [1,2,2,2,1], [0,1,1,1,0],
    ],
    child: [
      [0,0,1,1,1,0,0], [0,1,2,2,2,1,0], [1,2,1,3,1,2,1],
      [1,2,2,2,2,2,1], [0,1,2,3,2,1,0], [0,0,1,2,1,0,0], [0,1,0,0,0,1,0],
    ],
    child2: [
      [0,0,1,1,1,0,0], [0,1,2,2,2,1,0], [1,2,1,2,1,2,1],
      [1,2,2,2,2,2,1], [0,1,3,2,3,1,0], [0,0,1,2,1,0,0], [0,1,0,0,0,1,0],
    ],
    teen: [
      [0,1,1,1,1,1,0], [1,2,2,2,2,2,1], [1,2,1,3,1,2,1],
      [1,2,1,3,1,2,1], [1,2,2,3,2,2,1], [0,1,2,2,2,1,0],
      [0,1,0,0,0,1,0], [1,1,0,0,0,1,1],
    ],
    teen2: [
      [0,1,1,1,1,1,0], [1,2,2,2,2,2,1], [1,2,2,3,2,2,1],
      [1,2,1,2,1,2,1], [1,2,2,2,2,2,1], [0,1,3,2,3,1,0],
      [0,1,0,0,0,1,0], [1,1,0,0,0,1,1],
    ],
    adult: [
      [0,0,1,1,1,1,0,0], [0,1,2,2,2,2,1,0], [1,2,2,2,2,2,2,1],
      [1,2,1,3,3,1,2,1], [1,2,1,2,2,1,2,1], [1,2,2,3,3,2,2,1],
      [0,1,2,2,2,2,1,0], [0,1,0,1,1,0,1,0], [1,1,0,1,1,0,1,1],
    ],
    adult2: [
      [0,0,1,1,1,1,0,0], [0,1,2,2,2,2,1,0], [1,2,2,2,2,2,2,1],
      [1,2,2,3,3,2,2,1], [1,2,1,2,2,1,2,1], [1,2,2,2,2,2,2,1],
      [0,1,3,2,2,3,1,0], [0,1,0,1,1,0,1,0], [1,1,0,1,1,0,1,1],
    ],
    elder: [
      [0,1,1,1,1,1,1,0], [1,2,2,2,2,2,2,1], [1,2,1,1,1,1,2,1],
      [1,2,1,3,3,1,2,1], [1,2,3,2,2,3,2,1], [1,2,2,1,1,2,2,1],
      [0,1,2,2,2,2,1,0], [0,1,1,0,0,1,1,0], [0,1,0,0,0,0,1,0],
    ],
    sick_face: [
      [0,0,1,1,1,0,0], [0,1,2,2,2,1,0], [1,2,1,2,1,2,1],
      [1,2,2,1,2,2,1], [1,2,1,2,1,2,1], [0,1,2,2,2,1,0], [0,0,1,1,1,0,0],
    ],
    sleep_face: [
      [0,0,1,1,1,0,0], [0,1,2,2,2,1,0], [1,2,1,1,1,2,1],
      [1,2,2,2,2,2,1], [1,2,2,1,2,2,1], [0,1,2,2,2,1,0], [0,0,1,1,1,0,0],
    ],
    sad_face: [
      [0,0,1,1,1,0,0], [0,1,2,2,2,1,0], [1,2,1,2,1,2,1],
      [1,2,2,2,2,2,1], [1,2,1,2,1,2,1], [0,1,2,1,2,1,0], [0,0,1,1,1,0,0],
    ],
  };

  const COLORS = { 1: '#0f380f', 2: '#306230', 3: '#8bac0f', 0: null };

  // San Bernardo: blanco/marrón. Pulpo: tonos más oscuros en etapas avanzadas
  const STAGE_TINTS = [
    {1:'#0f380f', 2:'#6a6a6a', 3:'#c8c8c8'},           // egg - gris
    {1:'#4a3020', 2:'#8b6914', 3:'#f5e6d3'},           // baby - San Bernardo (marrón/blanco)
    {1:'#4a3020', 2:'#8b6914', 3:'#f5e6d3'},           // child
    {1:'#3d2817', 2:'#7a5512', 3:'#e8d4b8'},           // teen - máscara más oscura
    {1:'#2d1f10', 2:'#5a3d0a', 3:'#d4c4a8'},           // adult - más definido
    {1:'#1a1208', 2:'#3d2a08', 3:'#a89878'},           // elder/krakendork
  ];

  // Rasgos: cola peluda, tentáculos (sprites overlay)
  const TRAIT_SPRITES = {
    tail: [[0,1,1],[0,2,2],[1,2,2],[0,1,1]],
    tentacle: [[1,2,2,1],[0,1,2,1],[0,0,1,2]],
  };

  function drawSprite(ctx, sprite, ox, oy, scale = 4, tint = null) {
    const colors = tint || COLORS;
    for (let r = 0; r < sprite.length; r++) {
      for (let c = 0; c < sprite[r].length; c++) {
        const v = sprite[r][c];
        if (v === 0) continue;
        ctx.fillStyle = colors[v];
        ctx.fillRect(ox + c * scale, oy + r * scale, scale, scale);
      }
    }
  }

  function getSpriteForState(G) {
    const f = Math.floor(G.frame / 20) % 2;
    const stage = G.stage;

    if (stage === 0) return f ? SPRITES.egg : SPRITES.egg_crack;
    if (G.sleeping) return SPRITES.sleep_face;
    if (G.sick) return SPRITES.sick_face;

    const hungry = G.hunger < 25;
    const sad = G.happy < 25;
    if (hungry || sad) return SPRITES.sad_face;

    if (stage === 1) return f ? SPRITES.baby : SPRITES.baby2;
    if (stage === 2) return f ? SPRITES.child : SPRITES.child2;
    if (stage === 3) return f ? SPRITES.teen : SPRITES.teen2;
    if (stage === 4) return f ? SPRITES.adult : SPRITES.adult2;
    return f ? SPRITES.elder : SPRITES.adult2;
  }

  function getTintForStage(G) {
    return STAGE_TINTS[Math.min(G.stage, 5)];
  }

  function drawTraitOverlay(ctx, G, ox, oy, scale) {
    const traits = G.traits || {};
    const f = Math.floor(G.frame / 15) % 2;
    if (traits.tail > 0 && G.stage >= 2) {
      const tailSprite = TRAIT_SPRITES.tail;
      const tx = ox + 4 * scale;
      const ty = oy + 3 * scale + (f ? 1 : 0);
      drawSprite(ctx, tailSprite, tx, ty, Math.floor(scale * 0.8), getTintForStage(G));
    }
    if (traits.tentacles > 0 && G.stage >= 4) {
      const t = TRAIT_SPRITES.tentacle;
      const n = Math.min(traits.tentacles, 2);
      for (let i = 0; i < n; i++) {
        const tx = ox + (i === 0 ? -scale * 2 : 6 * scale);
        drawSprite(ctx, t, tx, oy + 4 * scale, Math.floor(scale * 0.6), getTintForStage(G));
      }
    }
  }

  window.KrakendorkSprites = {
    SPRITES,
    COLORS,
    STAGE_TINTS,
    TRAIT_SPRITES,
    drawSprite,
    getSpriteForState,
    getTintForStage,
    drawTraitOverlay
  };
})(window);
