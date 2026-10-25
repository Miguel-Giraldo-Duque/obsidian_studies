---
tipo: registro-diario-cronica
actualizado: 2026-10-22
---

# Registro diario — Crónica del Sanador

> Entradas cortas, más nuevas arriba. El Historiador agrega una línea cuando cambia canon, tomo o estado relevante de bosses.

## 2026-10-22

- Campaña **Vendedor de calle**: 14 quests (`ventas-bank`) + roadmap 22/10–1/11. Recompensa: Flor Vereda (`flower8`). Daña a Guiltmal.

## 2026-08-26

- Campaña **La humildad de volver a empezar**: 30 quests de campo (`humildad-bank`) → Guiltmal. Script `_inject_humildad_quests.py`.

## 2026-08-17

- Plugin: categoría **Soberano** (10000 HP, tomo). Guiltmal en arena `1786983444165` — 10000/10000, Luz vinculada y cerrada. 5×2000 queda como mapa de lore, no fases.
- Quests **pendientes** de Autoridad / Presencia / Calidez redirigidas a Guiltmal (backup `soulhy/backups/data.json.2026-08-17-pre-guiltmal-quests`). Completadas y EveVacum no se tocaron.
- **Guiltmal revelado** (lore): salón / trono / aplauso arrogante; máscara de realista; absorbe (nube negra) en vez de expulsar; interior maestro; mesa sección por sección. Nombre canónico Guiltmal.
- Canon: guardianes = valentía (Fuego) + claridad (Tierra) que Guiltmal exige usar. Culpa → martillo de identidad, no cárcel. Ver [[_CANON]].

## 2026-08-13

- Plugin: id propio `soulhy` (antes `vibe-rpg`); carpeta `.obsidian/plugins/soulhy`; rebuild `main.js`. Evita overwrite de la tienda Life RPG.

## 2026-08-12

- vibe-rpg: wipe 11–12 ago (main/data a 0 → stock ruso); **restaurado** save Soulhy + plugin modular desde Cursor History; vault versionado con git.

## 2026-08-10

- vibe-rpg: **fases de boss** (editor en crear/editar): marco desde `RpgImages/borders/niveles`, maxHp + colores por fase; transición al 0 HP; barra rayada en fase ≥2; regen diaria si no hubo daño.

## 2026-08-05

- Banco **Flow** (Presencia): 60 quests (20×3) en [[001 banco de retos de Flow]]; mapa [[Quests_Flow]]; inject `flow-bank` → nodo Flow (`node_1785983669892_tu8ccua1d`), daño Phobos+Kryos. Script `_inject_flow_quests.py`.

## 2026-08-04

- **15 quests EveVacum** inyectadas en `data.json` (`source: evevacum-bank`), linkeadas a boss `1785816112558` (renombrado EyeVacum→EveVacum, HP 400/400, flowerId flower6). Script `_inject_evevacum_quests.py`.
- Historia completa de **EveVacum** en [[_CANON]]: no derrotar; Flor Rumen; llanto de ternura. Ficha [[Ecos_EveVacum]].

## 2026-08-01

- Boceto tomo **Light → Guiltmal**: iluminar con congruencia; expulsa quien daña páginas/tomo; protege origen y fortaleza; cálido pero hirviente ante calidez malintencionada; amable≠ingenuo, abierto+protegido, cómodo+real. Dark en reserva.
- Canon fundacional: Soulhy como sanador; bosses = dolores no procesados / ecos ancestrales; tomos = sabiduría preservada.
- Jerarquía: Kryos + Phobos = guardianes de **Guiltmal** (reflejo / arrepentimiento / lo no visto).
- Tomos asignados en juego: **Fire → Phobos**, **Earth → Kryos**.
- Lecturas de tomo fijadas: Fuego = sostener el ardor del conocimiento; Tierra = belleza de la imperfección y transparencia.
- Reserva: Dark (sombra/poder/decir no) · Wind (ligereza/presencia) — sin boss aún.
- Snapshot HP: Phobos 1300/2000 · Kryos 1290/2000 · CritisimGhost y Akrasia liberados sin tomo.
