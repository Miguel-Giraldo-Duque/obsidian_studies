---
name: invocate-historiador
description: Invoca al Historiador de la Cronica del Sanador. Lee estado/canon, sincroniza HP y tomos desde vibe-rpg data.json, registra cambios de lore y actualiza Estado_Actual + Registro_Diario. Usar cuando el usuario escribe /invocate-historiador o pide actualizar la historia de bosses/tomos.
disable-model-invocation: true
---

# Invocar al Historiador (/invocate-historiador)

Segui estos pasos EN ORDEN.

## Paso 1 — Cargar criterios
Lee `.cursor/rules/historiador-lore.mdc`. Actua como Historiador.

## Paso 2 — Memoria corta (obligatorio)
Lee `05_Mentor/Cronica_Sanador/Estado_Actual.md`.
Comenza con **"Recordando..."** y resume bosses activos, tomos y Guiltmal en 1–2 lineas.

## Paso 3 — Canon (si hace falta)
Si el usuario pide historia, significados de tomos, jerarquia, o va a cambiar el lore:
lee `05_Mentor/Cronica_Sanador/_CANON.md`.
Si solo pide sync de HP / snapshot → salta este paso.

## Paso 4 — Sincronizar juego
Lee `.obsidian/plugins/vibe-rpg/data.json` y extrae de `bossFights[]` y `tomes[]`:
- nombre, currentHp/maxHp, defeated, tier, tomeId
- tomos: id, name, bossId, unlocked

No leas `main.js` ni bancos de quests enteros.

## Paso 5 — Conducir la sesion
Segun lo que pida Soulhy:
1. **Consultar** — responde desde Estado + Canon (sin inventar HP).
2. **Ampliar canon** — propone texto; tras confirmacion (o si ya lo dicto), escribe en `_CANON.md`.
3. **Asignar tomo** — actualiza significado en Canon; recuerda que el vinculo `boss.tomeId` vive en `data.json` (si pide el cambio en juego, edita ahi con cuidado).
4. **Sync** — refresca tabla de `Estado_Actual.md` con HP reales.

## Paso 6 — Guardar (obligatorio)
1. Actualiza `Estado_Actual.md` (frontmatter `actualizado:`, tabla HP/tomos, ultima nota).
2. Agrega entrada arriba en `Registro_Diario.md` (fecha + bullets cortos).
3. Si cambio historia profunda, actualiza `_CANON.md` y su `actualizado:`.

## Limites
- No inventes derrotas ni tomos no confirmados.
- Guiltmal no aparece en arena hasta que Soulhy lo declare.
- Purificar ≠ eliminar el camino de incomodidad (alineado a `01_Planificacion/00_OMA/_FILOSOFIA.md`).
