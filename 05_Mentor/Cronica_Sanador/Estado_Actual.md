---
tipo: estado-cronica
actualizado: 2026-08-12
fuente_juego: .obsidian/plugins/vibe-rpg/data.json
---

# Estado actual — Crónica del Sanador

> **Leé esto primero** (ahorra tokens). Canon completo solo si hace falta: [[_CANON]].
> HP y `defeated` se sincronizan desde `data.json` al invocar `/invocate-historiador` o al cerrar lore.

## Premisa (1 línea)

Soulhy **sana** bosses (no los borra): libera dolores no procesados y guarda su sabiduría en **tomos**.

## Jerarquía viva

`Guiltmal` (oculto) ← protegido por `Kryos` (hielo) + `Phobos` (auto-rechazo). Misma pared; calidez + valentía la derriten.

## Bosses (snapshot 2026-08-12 — restore post-wipe)

| Boss | Tier | HP | Estado | Tomo | Significado del tomo (corto) |
|------|------|-----|--------|------|------------------------------|
| CritisimGhost | standard | 0/100 | liberado | — | — |
| Akrasia | standard | 0/200 | liberado | — | — |
| **Kryos** | primordial | **230/2000** | activo | Earth | Imperfection / vulnerabilidad real |
| **Phobos Aliénos** | primordial | **130/2000** | activo | Fire | Sostener el ardor; aprender en el dolor |
| EveVacum | eco | 0/400 | liberado | — | Flor Rumen |
| Guiltmal | legendario | — | no revelado | Light *(boceto)* | Cálido/protegido; hirviente ante malicia; amable≠ingenuo |

Daño aprox.: Kryos ~1770 · Phobos ~1870 (de 2000). Save restaurado desde Cursor History (`75py.json`, 10 ago).

## Armas activas

- Phobos ← Sommelier + Empatía (+ hábitos duales)
- Kryos ← Benevolencia + Empatía (+ hábitos duales)

## Ecos de campo (activos)

| Eco | HP | Estado | Recompensas | Pack |
|-----|-----|--------|-------------|------|
| **EveVacum** | 400/400 | activo (ago 2026) | Ch10 → Centro al sol · purificar → **Flor Rumen** | [[Ecos_EveVacum]] · [[001 banco de retos de EveVacum]] |

## Última nota de lore

2026-08-10 — Sistema de **fases de boss** en vibe-rpg: N fases (marco `borders/niveles`, maxHp, colores barra/card); al 0 HP entra la siguiente; fase ≥2 barra rayada; regen diaria idle opcional.
2026-08-05 — Skill **Flow** (Presencia): banco 60 quests + inject `flow-bank` → nodo `node_1785983669892_tu8ccua1d`. Ver [[001 banco de retos de Flow]] · [[Quests_Flow]].
2026-08-04 — Historia completa de **EveVacum** en canon + **15 quests** cargadas en vibe-rpg (`evevacum-bank`, boss id 1785816112558, 400/400, Flor Rumen). Script: `01_Planificacion/experiments/_inject_evevacum_quests.py`.
2026-08-01 — Luz refinada: expulsa daño al tomo; cálido pero hirviente ante malicia; amable/abierto/cómodo sin ingenuidad. Ver [[Registro_Diario]].
