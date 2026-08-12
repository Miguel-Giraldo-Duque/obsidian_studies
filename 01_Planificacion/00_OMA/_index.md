---
tipo: indice-oma
actualizado: 2026-07-04
---

# Sistema OMA (manual)

Sistema de aprendizaje deliberado basado en el método [[Método de aprendizaje éxitos y errores OMA optimizado|OMA]] (Oportunidad – Motivación – Habilidad). Fase 1: manual, operado por dos subagentes especialistas invocados desde Cursor.

## Filosofía

Leer siempre primero: [[_FILOSOFIA]] — *el dominio es un camino, no un destino*.

## Estructura

```
00_OMA/
├── _index.md                       (este archivo)
├── _FILOSOFIA.md                   nucleo: mentalidad del reto eterno
├── _config/
│   └── notebook_mapping.json       vinculo skills sociales ↔ NotebookLM
├── _plantillas/                    plantillas base
│   ├── _TEMPLATE_quest_metrica.md
│   ├── _TEMPLATE_evaluacion_experiencia.md
│   └── _TEMPLATE_parche.md
└── success_metrics_definitions/    UNA CARPETA POR SKILL
    └── 2-segundos_responder/
        ├── definicion.md           metrica de exito + calibracion + log de progreso
        ├── evaluaciones/           After-Action Review por evento (O-M-H)
        │   └── _consultas/         briefings NotebookLM (Paso 2.5)
        └── parches/                un parche activo por vez
```

## Flujo manual

1. **Definir una skill / quest** → comando `/oma-metrica`. Crea `success_metrics_definitions/<skill>/definicion.md` con la métrica de éxito (reglas OMA + SMART), el criterio de graduación (4 señales) y la calibración de dificultad (Challenge Point).
2. **Practicar** en la vida real (la Oportunidad).
3. **Evaluar un evento** → comando `/oma-evaluar`. Para skills sociales (ver `_config/notebook_mapping.json`), consulta automáticamente el notebook NotebookLM antes del O-M-H. Corre el feedback loop O-M-H, guarda un AAR en `<skill>/evaluaciones/` y genera/actualiza un parche en `<skill>/parches/`.
4. **Re-calibrar en el tiempo:** cada revisión, el subagente pregunta **tensión (1–10)** y **tasa de éxito (%)** y ajusta la dificultad al punto óptimo (~60%). Si el éxito supera 90% → sube el reto; si baja de 50% → lo reduce.

## Base de conocimiento

- Método: [[Método de aprendizaje éxitos y errores OMA optimizado]]
- ¿Existe el dominio?: [[Ciencia del dominio de habilidades]]
- Calibrar el reto: [[Challenge Point Framework]]
- Sesgos a vigilar: [[Obstaculos a aprender tus errores]]
