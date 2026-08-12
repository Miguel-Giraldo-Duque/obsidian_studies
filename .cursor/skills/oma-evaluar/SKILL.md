---
name: oma-evaluar
description: Evalua una experiencia/evento de una skill del sistema OMA con el feedback loop Oportunidad-Motivacion-Habilidad, y genera o actualiza el parche correspondiente. Se dispara con /oma-evaluar.
disable-model-invocation: true
---

# /oma-evaluar — Especialista en evaluación de experiencias

Corre el After-Action Review de un evento y lo convierte en un parche accionable. Segui los pasos EN ORDEN.

## Paso 1 — Cargar criterios
Lee `.cursor/rules/oma-especialista.mdc` y actua segun esa regla. Lee tambien `01_Planificacion/00_OMA/_FILOSOFIA.md`.

## Paso 2 — Ubicar la skill
Pregunta o deduce qué skill se evalúa. Lee su `success_metrics_definitions/<skill>/definicion.md` (métrica de éxito, nivel actual, log). Sin métrica definida → derivá a `/oma-metrica` primero.

## Paso 2.5 — Consulta NotebookLM (automático si skill social)
Si la skill está listada en `01_Planificacion/00_OMA/_config/notebook_mapping.json`, o su `definicion.md` tiene `dominio: spirit` / tags sociales:
1. Ejecutá el flujo completo de [`.cursor/skills/socialnotebook-evaluate/SKILL.md`](../socialnotebook-evaluate/SKILL.md) con el evento que el usuario describió.
2. Leé el briefing guardado en `<skill>/evaluaciones/_consultas/AAAA-MM-DD-notebook.md`.
3. Presentá al usuario un bloque corto **"Lo que dice tu notebook"** (2–4 bullets + citas) antes del O-M-H.

Si la consulta falla (MCP no disponible, sin auth), seguí con el O-M-H usando solo el vault y anotá la limitación en la evaluación.

## Paso 3 — Evaluación O-M-H
Guía al aprendiz con `_plantillas/_TEMPLATE_evaluacion_experiencia.md`:
- Si hay briefing NotebookLM (Paso 2.5): usalo para **proponer** clasificaciones iniciales en el cuadrante O-M-H — el usuario confirma o corrige.
- Nombrá anti-sesgos con vocabulario del vault (ej. "retrasado social" → CritisimGhost en `05_Mentor/Memoria_Mentor.md`).
- **Oportunidad:** qué evento fue.
- **Motivación:** primero **éxitos** (real / espurio), luego **mejoras** (fracaso espurio / real) — cuadrante 2x2, con auto-compasión.
- **Habilidad:** ¿Qué hizo bien Soulhy? ¿Qué mejorar? ¿Qué hará la próxima?

## Paso 4 — Ajuste del Punto de Reto (OCP) — obligatorio
Pregunta **tensión (1–10)** y **tasa de éxito (%)**. Aplica la regla (>90% subir · <50% bajar · ~60% mantener) y **registra la fila** en el Log de progreso de la `definicion.md`.

## Paso 5 — Generar/actualizar el parche
Un solo ajuste concreto → crea/actualiza un archivo en `<skill>/parches/` (desde `_plantillas/_TEMPLATE_parche.md`): hipótesis, cambio a probar, métrica falsable, y re-calibración de dificultad. Si hubo briefing NotebookLM, el parche puede citar un insight del notebook como hipótesis ("según [fuente], probar X"). **Un parche activo por vez**: si ya hay uno activo, ciérralo o reemplázalo antes de abrir otro.

## Paso 6 — Guardar
Escribe la evaluación en `<skill>/evaluaciones/AAAA-MM-DD.md`, enlaza el parche, y actualiza `definicion.md` (log + calibración). Confirma al aprendiz el parche activo y cómo se medirá.

## Límite
No redefinas la métrica base aquí (eso es `/oma-metrica`). Ante duda de nivel/dificultad, deriva a re-calibrar con `/oma-metrica`.
