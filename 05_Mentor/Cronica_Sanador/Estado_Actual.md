---
tipo: estado-cronica
actualizado: 2026-10-22
fuente_juego: .obsidian/plugins/soulhy/data.json
---

# Estado actual — Crónica del Sanador

> **Leé esto primero** (ahorra tokens). Canon completo solo si hace falta: [[_CANON]].
> HP y `defeated` se sincronizan desde `data.json` al invocar `/invocate-historiador` o al cerrar lore.

## Premisa (1 línea)

Soulhy **sana** bosses (no los borra): libera dolores no procesados y guarda su sabiduría en **tomos**.

## Jerarquía viva

Pared derretida. `Kryos` + `Phobos` **purificados** (Tierra + Fuego en mano). `Guiltmal` **en arena** (soberano, 10000/10000). Tomo Luz vinculado y cerrado.

## Bosses (snapshot 2026-08-17)

| Boss | Tier | HP | Estado | Tomo | Significado del tomo (corto) |
|------|------|-----|--------|------|------------------------------|
| CritisimGhost | standard | 0/100 | liberado | — | — |
| Akrasia | standard | 0/200 | liberado | — | — |
| Kryos | primordial | **0/2000** | **purificado** (14 ago) | Earth ✓ | Imperfection / claridad para sanarte |
| Phobos Aliénos | primordial | **0/2000** | **purificado** (13 ago) | Fire ✓ | Sostener el ardor; valentía para avanzar |
| EveVacum | eco | 0/400 | liberado (8 ago) | Flor Rumen | No tomo; remedio de campo |
| **Guiltmal** | **soberano** | **10000/10000** | **en arena** (salón) | Light *(cerrado)* | Nube → secciones; culpa como martillo, no cárcel |

Tomos en juego: Fire `unlocked` 13 ago · Earth `unlocked` 14 ago · Light `bossId: 1786983444165`, `unlocked: false`.

## Armas activas

- En el salón de Guiltmal: **Fuego** (quedarse en la nube) + **Tierra** (no fingir que ya está sano) → camino hacia **Luz**.
- Escuelas que abrieron la pared: Sommelier + Empatía (Phobos); Benevolencia + Empatía (Kryos); hábitos duales.
- Quests **pendientes** de Autoridad / Presencia / Calidez ahora dañan a Guiltmal (`1786983444165`). Completadas siguen con Kryos/Phobos (historial). EveVacum no se tocó.

## Ecos de campo

| Eco | HP | Estado | Recompensas | Pack |
|-----|-----|--------|-------------|------|
| EveVacum | 0/400 | liberado (8 ago) | Flor Rumen al herbario | [[Ecos_EveVacum]] · [[001 banco de retos de EveVacum]] |

## Última nota de lore

2026-10-22 — Campaña **Vendedor de calle**: 14 retos (`ventas-bank`, `quest_ventas_d01`–`d14`) y roadmap activo hasta el 1/11. Flor de cierre: **Flor Vereda** (`flower8`), se abre al completar el roadmap. Dañan a Guiltmal. No suben el Árbol. Script: `01_Planificacion/experiments/_inject_ventas_quests.py`.
2026-08-26 — Campaña **La humildad de volver a empezar**: 30 retos de campo (`humildad-bank`, `quest_humildad_d01`–`d30`) inyectados en `data.json`. Passing → direcciones → false time → conversación. Dañan a Guiltmal. No suben el Árbol. Script: `01_Planificacion/experiments/_inject_humildad_quests.py`.
2026-08-17 — Quests pendientes de Autoridad/Presencia/Calidez (309) redirigidas a Guiltmal. Backup: `.obsidian/plugins/soulhy/backups/data.json.2026-08-17-pre-guiltmal-quests`. Completadas y EveVacum intactos.
2026-08-17 — Categoría **Soberano** en el plugin (10000 HP, puede llevar tomo). Guiltmal ficha en arena: 10000/10000, `tome-of-light` vinculado y cerrado. Las 5 secciones de la nube siguen siendo mapa de lore, no fases de juego. No usar `legendary` (300 HP).
2026-08-17 — **Guiltmal revelado.** Soulhy entra al salón (escaleras negras, tapete rojo, trono). Guiltmal aplaude: arrogante, “realista”, absorbe (nube) en vez de expulsar. Interior: maestro. Mesa: sección por sección, miedo por miedo; liberar la culpa de su carga negativa (martillo de identidad). Ver [[_CANON]].
2026-08-13 — Plugin propio: id `soulhy` (carpeta `.obsidian/plugins/soulhy`). Deja de usar el id de tienda `vibe-rpg` para que Obsidian no lo pise.
2026-08-10 — Sistema de **fases de boss** en vibe-rpg: N fases (marco `borders/niveles`, maxHp, colores barra/card); al 0 HP entra la siguiente; fase ≥2 barra rayada; regen diaria idle opcional.
2026-08-05 — Skill **Flow** (Presencia): banco 60 quests + inject `flow-bank` → nodo `node_1785983669892_tu8ccua1d`. Ver [[001 banco de retos de Flow]] · [[Quests_Flow]].
2026-08-04 — Historia completa de **EveVacum** en canon + **15 quests** cargadas en vibe-rpg (`evevacum-bank`, boss id 1785816112558, 400/400, Flor Rumen). Script: `01_Planificacion/experiments/_inject_evevacum_quests.py`.
2026-08-01 — Luz refinada: expulsa daño al tomo; cálido pero hirviente ante malicia; amable≠ingenuo. Ver [[Registro_Diario]].
