# Krakendork — Diseño del proyecto

## Concepto

**Krakendork** es una mascota virtual personal inspirada en la fusión de:

- **Murdock** — mascota perro del creador
- **Kraken** — bestia mitológica del mar

El resultado: un ser que comienza como perro y evoluciona con rasgos de kraken (tentáculos, múltiples ojos, tamaño creciente), manteniendo siempre un espíritu divertido y creativo.

---

## Principios clave

1. **No muere** — Nunca hay game over. Si las estadísticas caen mucho o el usuario está inactivo, Krakendork simplemente **duerme**. Al volver, se despierta.
2. **Evolución casi infinita** — Crece y cambia sin límite claro en el tiempo.
3. **Base: perro** — Después del huevo, la forma base es un perro (como Murdock).

---

## Ciclo de vida y evolución

```
🥚 Huevo misterioso
    ↓ eclosiona
🐕 Cachorro (perro bebé)
    ↓ +días
🐕 Perro con cola
    ↓ +días  
🐕🦑 Perro + tentáculos (1-2)
    ↓ +días
👀 Más ojos
    ↓ +días
📏 Mayor tamaño
    ↓ +días
…evoluciones creativas y divertidas…
```

### Rasgos que se agregan con el tiempo
- **Colas** — Una o más
- **Tentáculos** — Como el kraken
- **Ojos** — Múltiples ojos
- **Tamaño** — Crece con la edad
- Ideas futuras: aletas, escamas, variaciones de color, etc.

---

## Sueño en lugar de muerte

| Antes (Tamagotchi clásico) | Ahora (Krakendork) |
|----------------------------|--------------------|
| Hambre extrema → muerte | Hambre extrema → sueño profundo |
| Enfermedad sin curar → muerte | Enfermedad sin curar → sueño profundo |
| Pantalla de muerte | Pantalla: "Krakendork duerme..." |
| "Nuevo huevo" (reset) | "Despertar" (revive con stats recuperadas) |

### Inactividad del usuario
- Cuando la pestaña está in segundo plano o el usuario no interactúa por un tiempo, Krakendork se duerme.
- Al volver y tocar/interactuar, se despierta.

---

## Stack técnico
- Aplicación web estática (HTML + CSS + JS)
- Sin backend (por ahora)
- Estética retro Game Boy / pixel art

---

## Roadmap (ideas)
- [ ] Sprites de perro (base Murdock)
- [ ] Sistema de rasgos acumulativos (colas, tentáculos, ojos)
- [ ] Detección de inactividad (Page Visibility API)
- [ ] Persistencia (localStorage)
- [ ] Sonidos y música
