---
tags: [habitos, cues, tiny-habits]
actualizado: 2026-10-11
---

# Mapa de cues — hábitos AM + breaks

Fuente de diseño de quests de celebración: [[02_Estudios/Quests_Postura_de_poder]].  
La quest del día vive en la **skill RPG Postura de poder** (no en una sección del diario).  
Hábito estudio unificado (Raw → Cornell → Cards): [[01_Planificacion/MVP_Habito_Estudio_20]].

## Orden fijo (Fogg + campana)

1. Terminar la acción del hábito  
2. **Celebración Shine** inmediata (2–4 s) — postura de la quest activa (UFC / General / Aperturas)  
3. **Check** Daily Ritual → `completeHabit` (XP / bosses)  
4. **Campana AM** — al completar el bloque: stop/start ciclo WinClock + Toggl en paralelo  

El check **no** sustituye el Shine.

## Cadena AM (campanas WinClock + Toggl)

Al completar **todos** los hábitos del bloque → para ciclo actual + arranca el siguiente + cambia Toggl.

| Bloque completado | Ciclo WinClock siguiente | Toggl siguiente |
|-------------------|--------------------------|-----------------|
| 30min ejercicio + 10min meditación FOM y OM | `gratitud-y-principios` | Gratitud / diario-principios |
| 5 agradecimientos… + Lectura de mis principios | `meditacci-n-calidez` | Metta |
| Meditación Metta + Imaginar mi funeral | `organize-and-conquer` | Organize and conquer |
| Organización interna y externa | `deep-work` | Plazi / Deep Work |

`startRoutine.ps1` abre WinClock + ciclo `meditation-om` (y Toggl ejercicio). Perply queda fuera de la cadena automática.

## Lista consecutiva del día

1. Alarma / `startRoutine` → WinClock `meditation-om` + Toggl ejercicio → ejercicio 30′ → **Shine** → check  
2. Meditación FOM/OM → **Shine** → check → (ambos hechos) ciclo `gratitud-y-principios` + Toggl Gratitud  
3. 5 agradecimientos + frase 3ª + lectura principios → **Shine** → check → ciclo `meditacci-n-calidez` + Metta  
4. Metta + Imaginar funeral → **Shine** → check → ciclo `organize-and-conquer`  
5. Organización interna y externa → **Shine** → check → ciclo `deep-work` + Toggl Deep Work  
6. Deep work (loop) — breaks / carrera / lectura fuera de la campana automática  
7. Post Bloque 2 → (opcional) 2 pág mapa / no sustituye Bloque estudio → almuerzo  
8. Trastes almuerzo + cepillado → **Bloque estudio 20′** (`modo_hoy`: plazi | lectura | output) → Shine → check Soulhy  
9. ~16:00 → ejecutar `mision_salida` si hay campaña/if-then social  
10. Trastes cena → hitos 5–10′ → Shine → ocio Premack  
11. 15′ Perply / carrera — hábitos RPG sin campana automática  

## Bloque estudio 20′ (Fogg)

1. **Cue:** terminar trastes almuerzo + cepillado → sentarse al escritorio  
2. **Rutina:** 2′ punto fijo → 18′ según **cola** de la diaria → Shine → check `Bloque estudio 20′`  
3. **Recompensa:** Shine 2–4 s + XP; Premack opcional  
4. **Versión mínima:** 2′ pared + 1 cue Cornell en voz **o** 1 frase if-then  

**Pipeline:** input `plazi`/`lectura` = solo **Raw** (voz → `#sesion-estudio`); output = prioridad **Cornell** (`raw`) → **Generar** (`cornell`) → **Cards** (curva). Detalle: [[MVP_Habito_Estudio_20]].

## Versiones mínimas

- Carrera: 1 apply o 2 connects  
- Lectura (fuera del bloque): 2 páginas  
- Estudio: versión mínima arriba; full = 20′ modo del día  
- Hitos: solo `hito1`  

## Reglas

- Prep de CV **no** cuenta como carrera.  
- Campana AM = bloques completos → WinClock `POST /api/runtime/stop` + `POST /api/cycles/:id/start` + Toggl stop/start en paralelo (`chainAmAfterHabit`).  
- Token Toggl en settings de vibe-rpg (`togglApiToken`, `togglWorkspaceId`).  
- Ciclos: `meditation-om` · `gratitud-y-principios` · `meditacci-n-calidez` · `organize-and-conquer` · `deep-work`.  
- Project IDs Toggl: Gratitud `220114890` · Metta `221239625` · Deep Work/Plazi `192159466` · wid `5221214`.  
- Recargar plugin Soulhy en Obsidian tras rebuild de `main.js`. 
