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

  const STAGE_TINTS = [
    {1:'#0f380f', 2:'#6a6a6a', 3:'#c8c8c8'},
    {1:'#0f380f', 2:'#5a3060', 3:'#c08acc'},
    {1:'#0f380f', 2:'#1a5050', 3:'#5ac8c8'},
    {1:'#0f380f', 2:'#4a3a00', 3:'#c8a800'},
    {1:'#0f380f', 2:'#1a3a1a', 3:'#5acc5a'},
    {1:'#0f380f', 2:'#3a1a00', 3:'#c87a00'},
  ];

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

  window.KrakendorkSprites = {
    SPRITES,
    COLORS,
    STAGE_TINTS,
    drawSprite,
    getSpriteForState,
    getTintForStage
  };
})(window);
