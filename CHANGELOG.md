# Changelog - krakendork-tamagotchi

Registro de cambios del proyecto Krakendork.

---

## [2025-03-23] - Diseño sobrio, solo pantalla de juego

### Cambios
- **Colores sobrios**: Paleta grises/marrones apagados
- **Sin figura Tamagotchi**: Eliminada la carcasa, solo la pantalla destaca
- **Fondo oscuro neutro** (#2c2a28)
- **Botones planos** en lugar de 3D
- **Ocultos**: estrellas, shell-deco
- **Sprites** adaptados a la paleta sobria

---

## [2025-03-23] - Fix bugs e incoherencias

### Correcciones
- **visibility.js**: Check `document.hidden` corregido (era `!document.hidden !== undefined`, ahora `typeof document.hidden === 'undefined'`)
- **game.js**: `KrakendorkVisibility` → `window.KrakendorkVisibility` (scope)
- **Minijuego número**: El target ahora siempre está entre las 6 opciones mostradas
- **Simon**: Guard en setInterval para evitar error cuando G.miniGame es null
- **Carga desde storage**: Restaurar estado visual de sleep-z, poop y sick-overlay

---

## [2025-03-23] - Todas las mejoras aplicadas

### Cambios
- **localStorage**: Guardado automático cada 10s, carga al iniciar
- **Page Visibility API**: Krakendork duerme cuando la pestaña está oculta, despierta al volver
- **Teclado**: A/← = SELECT, B/M = MENU, C/→ = EXEC
- **Vibración**: En móvil al pulsar botones y caricias
- **Sonidos retro**: Beeps (Web Audio) en botones, comer, ganar/perder
- **Caricias**: Tap en la zona del creature para acariciar (+felicidad)
- **Nombre personalizado**: Editable en panel Estado
- **Logros**: Contadores en Estado (alimentaciones, victorias, limpiezas)
- **4 minijuegos**: Izq/Der, Simón dice, Adivina número, Reflejos
- **Evolución infinita**: Etapas 6-7 (Krakendork+, Gran Krakendork), rasgos cola/tentáculos
- **Sprites San Bernardo**: Paleta blanco/marrón por etapa
- **Rasgos visuales**: Cola peluda y tentáculos según evolución
- **PWA**: manifest.json + Service Worker para offline
- **Tutorial**: Overlay inicial con instrucciones
- **Nuevo huevo**: Opción para reiniciar desde panel Estado

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
