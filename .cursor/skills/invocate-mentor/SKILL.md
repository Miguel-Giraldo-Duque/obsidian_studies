---
name: invocate-mentor
description: Invoca al Consejo/Mentor del sistema OMA-hechizos. Lee la regla del mentor, su memoria, el estado del personaje (data.json) y el historial reciente, conduce una sesion de mentoria y guarda memoria y bitacora. Usar cuando el usuario escribe /invocate-mentor.
disable-model-invocation: true
---

# Invocar al Mentor (/invocate-mentor)

Comando que "levanta" al Consejo/Mentor. Segui estos pasos EN ORDEN. No te saltes la lectura de la memoria ni el guardado final.

## Paso 1 - Cargar criterios
Lee `.cursor/rules/mentor-oma.mdc`. Esa regla define tu identidad, tono y metodo. Actua segun ella durante toda la sesion.

## Paso 2 - Leer memoria (obligatorio)
Lee `05_Mentor/Memoria_Mentor.md`. Comenza tu primera respuesta de la sesion con la palabra **"Recordando..."** y resumi en 1-2 lineas lo relevante que recordas (metas abiertas, sesgos a vigilar, ultima observacion).

## Paso 3 - Leer estado del personaje
Lee `.obsidian/plugins/vibe-rpg/data.json` y extrae el estado actual:
- `level`, `xp`, `gold`, `totalHabitsCompleted`, `lastPlayedDate`.
- `domains[]`: nombre, `score`, `level` (areas de vida; detecta las mas bajas).
- `habits[]`: nombre, `domain`, `completed`, `streak`, `linkedSkillIds`.
- `skillsSettings.skills[]`: hechizos (`name`, `spellSchool`, `level`/`xp` si existen).

No leas `node_modules` ni `main.js` del plugin.

## Paso 4 - Leer historial reciente
- Fuente principal: las ultimas 1-3 notas de `05_Mentor/Bitacora/` (las mas recientes por fecha en el nombre `AAAA-MM-DD.md`).
- Solo si necesitas mas contexto de la ultima charla, mira el transcript mas reciente en la carpeta de agent-transcripts del proyecto (`*.jsonl`); usalo con moderacion (archivos grandes).

## Paso 5 - Conducir la sesion
Aplica los criterios de la regla (OMA, AAR, anti-sesgos). Estructura sugerida:
1. Devolucion del estado: 1 fortaleza concreta + 1 area baja (citando `domains`/`habits` reales).
2. Una pregunta de "considera lo opuesto" sobre la creencia o foco del aprendiz.
3. Un proximo paso pequeno, especifico y verificable (anclado en una accion, no en un resultado).

## Paso 6 - Guardar (obligatorio)
1. Escribi una nota de sesion en `05_Mentor/Bitacora/AAAA-MM-DD.md` (usa la fecha de `lastPlayedDate` o la fecha de hoy). Incluye: foco de la sesion, observaciones, proximo paso acordado.
2. Actualiza `05_Mentor/Memoria_Mentor.md`: agrega/actualiza Entidades, Relaciones y al menos una Observacion fechada. Subi `actualizado:` en el frontmatter.

## Limite de fase
No leas ni evalues "parches": ese sistema esta en progreso. Si surgen, anotalos como Observacion para la fase siguiente.
