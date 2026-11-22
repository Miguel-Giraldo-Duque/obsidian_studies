---
name: generar-estudios-hoy
description: Genera evaluaciones, ejercicios y preguntas de práctica desde sesiones raw|cornell|cards (sin esperar Cornell). Filtra standby, fuera_de_repaso y el arco Vercel AI SDK. Confirmación, campañas opcionales, commit chore allowlist. /generar-estudios-hoy
disable-model-invocation: true
---

# /generar-estudios-hoy — práctica/evaluación + commit chore

Actuá como **Maestro de Estudios**. Toda sesión de estudio (`raw`, `cornell` o `cards`) entra directo a **práctica/evaluación**. El Cornell manual de Miguel **no** es prerequisito. Seguí los pasos EN ORDEN.

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

### Filtro de estado y cola (obligatorio)

Para cada path en `preferred` (y cualquier `#sesion-estudio` sucia), leé el frontmatter (`estudio_estado`, `prioridad`, `fuera_de_repaso`) y el path.

**Excluir siempre** (no generar, no proponer, no van a cola de repaso):

- `fuera_de_repaso: true`
- `prioridad: standby`
- Arco **Vercel AI SDK**: cualquier nota bajo `Escuelas/**/Vercel AI SDK/` o práctica en `02_Estudios/` de ese mismo arco (GenerateText, Streaming, Tokens, Modelos AI y proveedores, Chat — Vercel AI SDK, Objects — Vercel AI SDK, Vercel AI SDK, Tools). Aunque no tengan el campo, no entran.

**Candidatas** a generar evaluación: `estudio_estado` en `raw`, `cornell`, `cards`, o vacío. Leé la sesión tal cual está: si hay Cornell (Cues/Notas/Summary), preferí esas semillas; si está en raw, generá igual desde el raw. No pidas pulir Cornell primero.

| Estado | Acción |
|--------|--------|
| `raw` / `cornell` / `cards` / vacío | **Candidata** a evaluación (ejercicios y preguntas de aplicación con claves) |
| `parking` | Tratar como mapa; no forzar evaluación |

- Si no hay candidatas tras el filtro: avisá y **pará**. No file vacío. No commit.

### Dudas `?`

- Buscá en el diff (y commits de días anteriores) líneas nuevas que empiecen exactamente con `- ?` en `04_Libros/` y sesiones.
- Formatos: pegadas desde PDF++ como `- ? [[...]] — "texto"` o a mano como `- ? p. 23 ...`.
- Resuelta = la `?` cambió a `✓` o lleva su respuesta al lado.
- Una `?` sin resolver al día siguiente de aparecer pasa a pregunta de repaso en el file diario (aunque no haya sesión nueva).

## Paso 2 — Leer fuentes y clasificar

1. Leé cada path **candidata**. Si hay secciones **Cues / Notas / Summary**, preferí bullets de **Cues** como semillas. Si está en raw, usá el raw. Ignorá `00_Plantillas/`, `Untitled`, `EJEMPLO_*`.
2. Corregí ortografía en fuente si hace falta.
3. Filtros Maestro: ¿accionable ≤7 días? ¿teoría/skill? Preguntas: **máx. 6 por tema**, que en total se respondan en **≤15 min**. Deben ser englobadoras: cada una cubre una parte grande del tema (qué, por qué, cómo se relaciona), no un dato suelto. Ante la duda, menos y más claras. El filtro accionable ≤7 días solo decide si se propone campaña; no recorta preguntas. Si la sesión o el libro tiene `proyecto:`, hacé preguntas de escenario/aplicación al Resultado y Vow del proyecto (ej. *¿cómo usarías la autoimagen en tu próxima conversación con un desconocido?*), no definiciones; enlazá el proyecto. **Contraste AI:** si dos conceptos cercanos se pueden mezclar, incluí una pregunta o nota breve de contraste (qué no es / en qué se diferencia).
4. Campañas activas:

```bash
rg -l "estado:\\s*activa" "02_Estudios/Campanas" -g "*.md" 2>/dev/null || true
```

5. Propuesta interna: evaluaciones/ejercicios/preguntas de aplicación con claves, if-then, campaña sí/no, stub `practicas/` si técnica.

## Paso 2.5 — Confirmación (obligatorio)

AskQuestion **antes** de escribir:

1. Temas/sesiones a incluir.
2. Preguntas (máx. 6/tema, ≤15 min) — aceptar/matar.
3. If-then / `mision_salida` (o ninguno).
4. Campaña: crear / actualizar / ninguna.
5. Si ya hay activa del mismo `tipo`: pausar anterior o descartar nueva.

Sin confirmación → no generes ni commit.

En corrida automática (sin Miguel presente), la confirmación se reemplaza por escribir las preguntas directo; las campañas solo se proponen, nunca se crean ni activan.

## Paso 3 — File diario `02_Estudios/YYYY-MM-DD.md`

Creá o actualizá (`date` del JSON) en la **raíz** de `02_Estudios`.

`estudiosPath` sigue siendo `02_Estudios/YYYY-MM-DD.md`. No escribas en `02_Estudios/_archivo/`. Al listar cards vigentes, ignorá esa carpeta. No archives un `AAAA-MM-DD` salvo que `hoy > tema_iniciado + 31` (el día 31 todavía se repasa). El diario sigue filtrando `#estudio` en los días 1, 2, 7, 15 y 31 (y excluye `fuera_de_repaso` / `prioridad: standby`). No edites `Plantilla_Diaria` ni las carpetas de mensual, semanal y diario.

```yaml
---
tags:
  - estudio
  # - codigo
tema_iniciado: YYYY-MM-DD
---
```

- `tema_iniciado` = **fecha del run** (día en que se genera la evaluación). Primer repaso Dataview = día +1 (slot 1 de la curva).
- Intro + wikilinks a sesiones fuente.
- Máx. 6 preguntas/tema desde la sesión (cues Cornell si existen; si no, desde raw), en formato:
  `- ¿Pregunta englobadora de aplicación?`  y debajo  `  Respuesta:`  con los puntos clave que Aprendiz usará para ver qué te faltó mencionar.
- El producto es **evaluación/práctica** (ejercicios y preguntas de aplicación con claves), no un Cornell intermedio.
- Aprendiz hace estas preguntas en voz alta en los repasos; si una se falla mucho, en el próximo run se parte en preguntas más chicas.
- Código: tag `codigo` + ejercicios 1/2/7/15/31 **o** link a campaña/`practicas/`.
- No inventes fuera de fuentes.

## Paso 3b — Campaña / stub (si se aprobó)

Igual que antes: `02_Estudios/Campanas/<slug>.md` desde `_TEMPLATE_campana.md`; técnica → `practicas/<slug>/prompt.md` + `STATUS.md`.

Toda campaña lleva `proyecto: [[...]]`.

## Paso 3c — Actualizar estado de sesiones (obligatorio)

Para cada sesión Escuela/`#sesion-estudio` que usaste para generar la evaluación:

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

- Temas generados / omitidos (motivo: standby, fuera_de_repaso, arco Vercel AI SDK, parking, etc.)
- Path estudios + `tema_iniciado`
- Sesiones pasadas a `cards`
- Campaña / practicas si hubo
- If-then sugerido
- Hash corto del commit

## Límites

- Un file diario de estudios; máx. 1 campaña social + 1 técnica activas.
- No generar notas con `fuera_de_repaso: true`, `prioridad: standby`, ni el arco Vercel AI SDK.
- No Anki. No push.
