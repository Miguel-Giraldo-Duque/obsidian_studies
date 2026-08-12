---
name: oma-metrica
description: Crea o refina la definicion y las metricas de exito de una skill/quest del sistema OMA, calibrando la dificultad al punto optimo de reto y registrando el progreso en el tiempo. Se dispara con /oma-metrica.
disable-model-invocation: true
---

# /oma-metrica — Especialista en métricas de éxito

Crea o refina la `definicion.md` de una skill del sistema OMA. Segui los pasos EN ORDEN.

## Paso 1 — Cargar criterios
Lee `.cursor/rules/oma-especialista.mdc` y actua segun esa regla toda la sesion. Lee tambien `01_Planificacion/00_OMA/_FILOSOFIA.md`.

## Paso 2 — Base de conocimiento
Lee antes de escribir métricas:
- `Escuela habilidades blandas/El mito del carisma/Manejo de errores/Método de aprendizaje éxitos y errores OMA optimizado.md` (5 reglas)
- `Escuela habilidades blandas/El mito del carisma/Manejo de errores/Ciencia del dominio de habilidades.md` (4 señales de graduación)
- `Escuela habilidades blandas/El mito del carisma/Manejo de errores/Challenge Point Framework.md` (calibración)

## Paso 3 — Identificar la skill
Pregunta o deduce qué skill se trabaja. Su carpeta es `01_Planificacion/00_OMA/success_metrics_definitions/<skill>/`.
- Si NO existe: crea la carpeta con `definicion.md` (desde `_plantillas/_TEMPLATE_quest_metrica.md`) y subcarpetas `evaluaciones/` y `parches/`.
- Si existe: vas a **refinar/re-calibrar** la `definicion.md` existente.

## Paso 4 — Definir/refinar la métrica
Completa con el aprendiz: Oportunidad, Motivación, métrica de éxito (5 reglas OMA), escalera de dificultad (niveles nominales) y criterio de graduación (4 señales).

## Paso 5 — Ajuste del Punto de Reto (OCP) — obligatorio
1. Pregunta **tensión (1–10)** y **tasa de éxito percibida (%)** de la última práctica.
2. Aplica:
   - **> 90%** → "Soulhy está estancado, necesitamos más dificultad funcional" → subir al siguiente nivel de la escalera.
   - **< 50%** → reducir dificultad para volver cerca del óptimo.
   - **~60%** → mantener nivel.
3. Actualiza el campo *Calibración del reto* y agrega una fila al **Log de progreso en el tiempo** (fecha, nivel, tensión, éxito, ajuste, nota).

## Paso 6 — Guardar
Escribe/actualiza `success_metrics_definitions/<skill>/definicion.md` y sube `actualizado:`. Confirma al aprendiz el nivel actual y el próximo criterio de graduación.

## Límite
No evalúes eventos aquí (eso es `/oma-evaluar`). Este comando define y calibra; el otro evalúa y parchea.
