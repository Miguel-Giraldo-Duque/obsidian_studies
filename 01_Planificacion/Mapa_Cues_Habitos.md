---
tags: [habitos, cues, tiny-habits]
actualizado: 2026-08-03
---

# Mapa de cues — hábitos AM + breaks

Fuente de diseño de quests de celebración: [[02_Estudios/Quests_Postura_de_poder]].  
La quest del día vive en la **skill RPG Postura de poder** (no en una sección del diario).

## Orden fijo (Fogg + campana)

1. Terminar la acción del hábito  
2. **Celebración Shine** inmediata (2–4 s) — postura de la quest activa (UFC / General / Aperturas)  
3. **Check** Daily Ritual → `completeHabit` (XP / bosses)  
4. **Campana Toggl** — stop timer actual + start del siguiente (solo cadena AM)  

El check **no** sustituye el Shine.

## Cadena AM (campanas)

| Después de completar | Timer Toggl siguiente |
|----------------------|------------------------|
| 30min ejercicio | Meditacion / Atom-FOM |
| 10min meditación FOM y OM | Gratitud / diario-principios |
| Escribir 5 agradecimientos… | Meditacion / Metta |
| Meditación Metta | Plazi / Perply |
| 15min Perply | fin cadena → plan 3 / deep work (manual) |

## Lista consecutiva del día

1. Alarma 6:00 → ejercicio 30′ → **Shine** → check → timer Meditación  
2. Meditación → **Shine** → check → timer Gratitud  
3. 5 agradecimientos + frase 3ª + principios → **Shine** → check → timer Metta  
4. Metta 4′ → **Shine** → check → timer Perply (proyecto **Plazi**)  
5. 15′ Perply → **Shine** → check → **fin cadena AM**  
6. Planear 3 importantes (5′) → **Bloque 1 deep work 90′**  
7. Timer break 1 → **15′ carrera (apply/connect)** → Shine → check → 5′ break agradable → Bloque 2  
8. Post Bloque 2 → leer 2–10 pág → Shine → almuerzo  
9. Trastes almuerzo → estudio 15–30′ + 1 idea → Shine  
10. Trastes cena → hitos 5–10′ → Shine → ocio Premack  

## Versiones mínimas

- Carrera: 1 apply o 2 connects  
- Lectura: 2 páginas  
- Estudio: 1 concepto en 15′  
- Hitos: solo `hito1`  

## Reglas

- Prep de CV **no** cuenta como carrera.  
- Deep work / breaks de lectura-estudio: timers manuales por ahora.  
- Token Toggl en settings de vibe-rpg (`togglApiToken`, `togglWorkspaceId`).  
- Campana = API Track v9 (`stop` current + `start` siguiente) vía `chainTogglAfterHabit` en `completeHabit`.  
- Project IDs fijos: Meditaccion `207324607` · Gratitud `220114890` · Metta `221239625` · Perply `192159466` · wid `5221214`.  
