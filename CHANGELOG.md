# Changelog - krakendork-tamagotchi

Registro de cambios del proyecto Krakendork.

---

## [2025-03-23] - Refactor diseño + framework de animaciones

### Cambios
- **Estructura modular**: CSS en `css/main.css` y `css/animations.css`
- **Motor de juego** (`js/engine.js`): Game loop con `requestAnimationFrame`, delta time, tick fijo (20/s)
- **AnimationController**: State machine para estados (idle, walk, sleep, eat, happy, sad, sick, hatch)
- **Easing & Tween**: Funciones de interpolación (linear, easeIn, easeOut, bounce) para transiciones
- **Módulos JS**: `sprites.js`, `game.js`, `ui.js` separados
- **Entry point**: `index.html` como principal; `tamagotchi.html` redirige
- **60 FPS** de renderizado con lógica a 20 ticks/segundo

---

## [2025-03-23] - Krakendork: San Bernardo + pulpo gigante

### Cambios
- **Referencias**: Murdock = San Bernardo (pelaje blanco/marrón, orejas caídas). Kraken = pulpo gigante (8 tentáculos, ventosas)
- **DESIGN.md**: Nueva sección de referencias visuales para sprites futuros
- **Evolución**: Etapas renombradas a San Bernardo bebé → San Bernardo joven → Con cola peluda → Tentáculos de pulpo → Krakendork

---

## [2025-03-23] - Krakendork: concepto y mecánicas base

### Cambios
- **DESIGN.md**: Documentación del concepto (Murdock + Kraken → Krakendork)
- **Sin muerte**: Reemplazada por sueño profundo cuando stats críticas
- **Despertar**: Botón "Despertar" y botón Luz despiertan de sueño profundo
- **Rebrand**: Tama → Krakendork en todos los mensajes
- **Evolución**: Etapas renombradas a Cachorro, Perro joven, Con cola, Con tentáculos, Krakendork
- **Recuperación**: En sueño profundo las stats se recuperan lentamente
- Título: "Krakendork 🐕🦑"

---

## [2025-03-23] - Configuración inicial

### Cambios
- Repositorio inicial con `tamagotchi.html` (juego Tamagotchi virtual)
- `.gitignore` para OS y editor
- Regla de workflow: subir a GitHub y documentar tras cada cambio
- `CHANGELOG.md` creado para registrar el proceso
