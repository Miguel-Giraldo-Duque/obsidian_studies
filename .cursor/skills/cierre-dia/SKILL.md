---
name: cierre-dia
description: Cierra el día leyendo la nota diaria de hoy (hitos + OMA light opcional), valida hito1, y si hubo práctica de skill corre evaluación OMA corta con parche. Se dispara con /cierre-dia.
disable-model-invocation: true
---

# /cierre-dia — Cierre diario (hitos + OMA light)

Procesá el bloque **Cierre del Día** de la nota diaria de hoy. Seguí los pasos EN ORDEN.

## Paso 1 — Abrir la nota de hoy

1. Determiná la fecha de hoy en formato `YYYY-MM-DD` (zona del usuario / contexto).
2. Abrí `01_Planificacion/03_Diario/YYYY-MM-DD.md`.
3. Si no existe, avisá y pará (no inventes la nota).

Leé frontmatter y cuerpo. Los campos Meta Bind viven en frontmatter:

- `hito1` / `bien1` / `mejorar1` / `proxima1` (obligatorio al menos hito1; escena = qué pasó)
- `hito2`–`hito5` / `bienN` / `mejorarN` / `proximaN` (opcionales)
- Legacy: `logroN` / `dificultadN` si aún existen
- `energia`
- `hubo_practica_skill` (boolean)
- `skill`, `evento`, `bien`, `mejorar`, `proxima_mision`

También aceptá inline legacy (`hito1::`, etc.) si el frontmatter está vacío.

## Paso 2 — Validar hitos

1. Si `hito1` está vacío → pedí que complete el Hito 1 en Obsidian y pará.
2. Listá los hitos presentes (1–3) con logro y dificultad.
3. Confirmá brevemente al aprendiz lo que quedó registrado (no reescribas hitos salvo typo obvio que el usuario pida corregir).

## Paso 3 — OMA light (condicional)

Si `hubo_practica_skill` es `false` / ausente / vacío → **saltá** este paso. El cierre con hitos ya cuenta.

Si es `true`:

1. Resolvé la skill desde `skill` (carpeta bajo `01_Planificacion/00_OMA/success_metrics_definitions/<skill>/`). Si no hay match claro, preguntá.
2. Sin `definicion.md` → derivá a `/oma-metrica` y no inventes métrica.
3. Corré el flujo de [`.cursor/skills/oma-evaluar/SKILL.md`](../oma-evaluar/SKILL.md) en **modo corto**:
   - Usá `evento`, `bien`, `mejorar`, `proxima_mision` como borrador de O / éxitos / mejoras / próxima.
   - Pedí tensión (1–10) y tasa de éxito (%) solo si faltan; si el usuario está en cierre rápido, estimá a partir del texto y marcá la estimación.
   - Generá/actualizá evaluación en `<skill>/evaluaciones/AAAA-MM-DD.md` y un parche activo (un solo ajuste = `proxima_mision` cuando sea concreto).
   - Actualizá log en `definicion.md` si hay calibración.
4. Paso 2.5 NotebookLM de `/oma-evaluar`: solo si la skill está en `notebook_mapping.json` o es dominio spirit — y solo si no alarga demasiado el cierre; si falla el MCP, seguí sin briefing.

## Paso 4 — Confirmar

Respondé con un bloque corto:

- Hitos del día (lista)
- Energía (si hay)
- Si hubo OMA: skill, enlace a evaluación, parche activo, cómo se medirá
- Si no hubo OMA: “Sin práctica de skill hoy — ok”

## Límites

- No redefinir métricas base (eso es `/oma-metrica`).
- No forzar OMA profundo todas las noches.
- No tocar el Dataview semanal; los hitos en frontmatter ya lo alimentan.
