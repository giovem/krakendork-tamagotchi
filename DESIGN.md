# Krakendork — Diseño del proyecto

## Concepto

**Krakendork** es una mascota virtual personal inspirada en la fusión de:

- **Murdock** — mascota del creador, **San Bernardo**: perro grande, peludo, manchas blancas y marrones, cara bondadosa y orejas caídas
- **Kraken** — **pulpo gigante** del mar: 8 tentáculos, ventosas, cuerpo de cefalópodo

El resultado: un ser que comienza como cachorro San Bernardo y evoluciona con rasgos de pulpo gigante (tentáculos con ventosas, múltiples ojos, tamaño creciente), manteniendo un espíritu divertido y creativo.

---

## Referencias visuales

### San Bernardo (base del cuerpo)
- Cuerpo grande y robusto
- Pelaje blanco con manchas marrón/rojizo (común: máscara oscura, orejas marrones)
- Orejas caídas, cara amable
- Patas anchas y peludas

### Pulpo gigante (rasgos kraken)
- 8 brazos/tentáculos
- Ventosas (círculos) en cada tentáculo
- Cabeza bulbosa (manto)
- Ojos grandes y expresivos

---

## Principios clave

1. **No muere** — Nunca hay game over. Si las estadísticas caen mucho o el usuario está inactivo, Krakendork simplemente **duerme**. Al volver, se despierta.
2. **Evolución casi infinita** — Crece y cambia sin límite claro en el tiempo.
3. **Base: San Bernardo** — Después del huevo, la forma base es un perro San Bernardo (como Murdock).

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
- **Cola** — Cola de San Bernardo (peluda, gruesa)
- **Tentáculos** — Como el pulpo gigante: 8 brazos con ventosas, que emergen progresivamente
- **Ojos** — Múltiples ojos de pulpo (grandes, expresivos)
- **Tamaño** — Crece con la edad (San Bernardo es grande)
- Ideas futuras: manto de pulpo, variaciones de color pelaje/manchas

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
- [ ] Sprites de San Bernardo (base Murdock: pelaje blanco/marrón, orejas caídas)
- [ ] Sistema de rasgos acumulativos (colas, tentáculos, ojos)
- [ ] Detección de inactividad (Page Visibility API)
- [ ] Persistencia (localStorage)
- [ ] Sonidos y música
