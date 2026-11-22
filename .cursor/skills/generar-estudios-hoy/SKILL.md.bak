---
name: generar-estudios-hoy
description: Genera prácticas desde sesiones con estudio_estado=cornell (Raw→Cornell→Cards). Confirmación, campañas opcionales, commit chore allowlist. /generar-estudios-hoy
disable-model-invocation: true
---

# /generar-estudios-hoy — Cornell → Cards + commit chore

Actuá como **Maestro de Estudios**. Pipeline: **Raw → Cornell → Cards** ([[01_Planificacion/MVP_Habito_Estudio_20]]). Seguí los pasos EN ORDEN.

## Paso 0 — Cargar criterios

1. Leé [`.cursor/rules/maestro-estudios.mdc`](../../rules/maestro-estudios.mdc).
2. Empezá con **Remembering...** / **Recordando...**.
3. **NO** actualices `05_Mentor/Memoria_Mentor.md`.
4. Leé los proyectos con `estado: activo` en `03_Proyectos/` (Resultado, Métricas, Vow).

## Paso 1 — Diff de Escuela(s) / sesiones

Corré:

```bash
node .cursor/skills/generar-estudios-hoy/scripts/collect-diff.js
```

Usá el JSON de stdout (`date`, `empty`, `estudiosPath`, `preferred[]`, `files[]`, `hint`).

- Si `empty: true` → avisá y **pará**. No file vacío. No commit.
- Trabajá sobre **`preferred`**. Leé contenido completo de cada path.
- Si `preferredCount > 20` o `hint` de exceso: preguntá qué incluir (máx. ~8).

### Filtro de estado (obligatorio)

Para cada path en `preferred` (y cualquier `#sesion-estudio` sucia), leé `estudio_estado` del frontmatter:

| Estado | Acción |
|--------|--------|
| `cornell` | **Candidata** a generar cards (prioridad) |
| `raw` | **No generar** por defecto — falta Cornell |
| `cards` | Ya industrializada; skip salvo pedido explícito |
| `parking` / ausente | Tratar como mapa; no forzar cards |

- Si **solo** hay `raw` (ninguna `cornell`): AskQuestion avisando *“Pulí Cornell primero (estudio_estado: cornell). ¿Forzar igual?”* — **default: no generar**, pará.
- Si hay mezcla: proponé solo las `cornell`; listá las `raw` como “pendientes Cornell”.

### Dudas `?`

- Buscá en el diff (y commits de días anteriores) líneas nuevas que empiecen exactamente con `- ?` en `04_Libros/` y sesiones.
- Formatos: pegadas desde PDF++ como `- ? [[...]] — "texto"` o a mano como `- ? p. 23 ...`.
- Resuelta = la `?` cambió a `✓` o lleva su respuesta al lado.
- Una `?` sin resolver al día siguiente de aparecer pasa a pregunta de repaso en el file diario (aunque no haya cornell nuevo).

## Paso 2 — Leer fuentes cornell y clasificar

1. Leé cada path **cornell** (secciones **Cues / Notas / Summary**; Raw solo apoyo). Preferí bullets de **Cues** como semillas de flashcards. Ignorá `00_Plantillas/`, `Untitled`, `EJEMPLO_*`.
2. Corregí ortografía en fuente si hace falta.
3. Filtros Maestro: ¿accionable ≤7 días? ¿teoría/skill? Preguntas: **máx. 6 por tema**, que en total se respondan en **≤15 min**. Deben ser englobadoras: cada una cubre una parte grande del tema (qué, por qué, cómo se relaciona), no un dato suelto. Ante la duda, menos y más claras. El filtro accionable ≤7 días solo decide si se propone campaña; no recorta preguntas. Si la sesión o el libro tiene `proyecto:`, hacé preguntas de escenario/aplicación al Resultado y Vow del proyecto (ej. *¿cómo usarías la autoimagen en tu próxima conversación con un desconocido?*), no definiciones; enlazá el proyecto.
4. Campañas activas:

```bash
rg -l "estado:\\s*activa" "02_Estudios/Campanas" -g "*.md" 2>/dev/null || true
```

5. Propuesta interna: cards, if-then, campaña sí/no, stub `practicas/` si técnica.

## Paso 2.5 — Confirmación (obligatorio)

AskQuestion **antes** de escribir:

1. Temas cornell a incluir.
2. Preguntas (máx. 6/tema, ≤15 min) — aceptar/matar.
3. If-then / `mision_salida` (o ninguno).
4. Campaña: crear / actualizar / ninguna.
5. Si ya hay activa del mismo `tipo`: pausar anterior o descartar nueva.

Sin confirmación → no generes ni commit.

En corrida automática (sin Miguel presente), la confirmación se reemplaza por escribir las preguntas directo; las campañas solo se proponen, nunca se crean ni activan.

## Paso 3 — File diario `02_Estudios/YYYY-MM-DD.md`

Creá o actualizá (`date` del JSON) en la **raíz** de `02_Estudios`.

`estudiosPath` sigue siendo `02_Estudios/YYYY-MM-DD.md`. No escribas en `02_Estudios/_archivo/`. Al listar cards vigentes, ignorá esa carpeta. No archives un `AAAA-MM-DD` salvo que `hoy > tema_iniciado + 31` (el día 31 todavía se repasa). El diario sigue filtrando `#estudio` en los días 1, 2, 7, 15 y 31. No edites `Plantilla_Diaria` ni las carpetas de mensual, semanal y diario.

```yaml
---
tags:
  - estudio
  # - codigo
tema_iniciado: YYYY-MM-DD
---
```

- `tema_iniciado` = **fecha del run** (día Cornell+Generar). Primer repaso Dataview = día +1 (slot 1 de la curva).
- Intro + wikilinks a sesiones fuente.
- Máx. 6 preguntas/tema desde **cues Cornell** (no desde raw largo), en formato:
  `- ¿Pregunta englobadora?`  y debajo  `  Respuesta:`  con los puntos clave que Aprendiz usará para ver qué te faltó mencionar.
- Aprendiz hace estas preguntas en voz alta en los repasos; si una se falla mucho, en el próximo run se parte en preguntas más chicas.
- Código: tag `codigo` + ejercicios 1/2/7/15/31 **o** link a campaña/`practicas/`.
- No inventes fuera de fuentes.

## Paso 3b — Campaña / stub (si se aprobó)

Igual que antes: `02_Estudios/Campanas/<slug>.md` desde `_TEMPLATE_campana.md`; técnica → `practicas/<slug>/prompt.md` + `STATUS.md`.

Toda campaña lleva `proyecto: [[...]]`.

## Paso 3c — Actualizar estado de sesiones (obligatorio)

Para cada sesión Escuela/`#sesion-estudio` que usaste para generar cards:

1. Frontmatter: `estudio_estado: cards`
2. Si falta `fecha_cornell`, poné la fecha del run.

Incluí estos paths en el commit (allowlist).

## Paso 4 — Commit chore

Allowlist **estricta**:

1. Paths `preferred` / sesiones tocadas (incl. cambio a `cards`).
2. `02_Estudios/YYYY-MM-DD.md`.
3. Campanas tocadas.
4. Stubs `practicas/` si se crearon.

Guardrails: nunca `git add -A`; nunca `.obsidian/`, `magus/`, `data.json`, `.env`, `Memoria_Mentor.md`; no push; no amend; no `--no-verify`.

```bash
git add -- "…/sesion.md" "02_Estudios/YYYY-MM-DD.md"
git commit -m "$(cat <<'EOF'
chore(estudios): prácticas del YYYY-MM-DD (Tema A)

EOF
)"
git status
```

## Paso 5 — Reportar

- Temas generados / raw omitidos (motivo)
- Path estudios + `tema_iniciado`
- Sesiones pasadas a `cards`
- Campaña / practicas si hubo
- If-then sugerido
- Hash corto del commit

## Límites

- Un file diario de estudios; máx. 1 campaña social + 1 técnica activas.
- No generar desde `raw` sin confirmación explícita de forzar.
- No Anki. No push.
