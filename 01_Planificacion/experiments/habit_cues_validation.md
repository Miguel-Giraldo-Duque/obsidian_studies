---
tipo: experimento-habitos
actualizado: 2026-08-01
estado: listo-para-correr
relacionado: [[Mapa_Cues_Habitos]] · [[doekit-habits]]
---

# Simulación pequeña — ¿los cues suben consistencia de hábitos frágiles?

## Hipótesis (falsable)

Si Soulhy ejecuta el **loop de cue** (acción → Shine 2–4s → check RPG → campana/alarma del siguiente) en los slots del [[Mapa_Cues_Habitos]], entonces la consistencia de hábitos frágiles (`Y≥3`) es **mayor** que en días sin cue explícito (solo “intentar” + checklist), con la **misma** carga de trabajo (máx. 3 misiones no-hábito).

**No** estamos optimizando slots todavía (eso es Oleada 1 PB). Acá solo validamos: *¿el sistema de cues mueve la aguja?*

## Diseño (6 días, pequeña escala)

| Día | Condición `cues` | Carga trabajo (fija) | Slots frágiles (si cues=ON) |
|-----|------------------|----------------------|-----------------------------|
| 1 | ON (+1) | 3 misiones max | carrera Break1 · lectura post-B2 · estudio post-trastes · hito1 post-cena |
| 2 | OFF (−1) | 3 misiones max | mismos mínimos, **sin** Shine/campana obligatoria; checklist mental libre |
| 3 | ON | idem | idem |
| 4 | OFF | idem | idem |
| 5 | ON | idem | idem |
| 6 | OFF | idem | idem |

Alternar ON/OFF reduce confusión con “lunes vs viernes”. Empezá el día que quieras; mantení el patrón.

**Fijo en ambos brazos:** rito AM puede seguir (no es el objeto). Versiones mínimas: 1 apply/2 connects · ≥2 pág · ≥15′ estudio · `hito1` 1 frase. Bloque 1 ≤ ~09:15 (flag).

## Respuestas

| Símbolo | Definición | Fuente |
|---------|------------|--------|
| `Y` (0–4) | suma binaria carrera + lectura + estudio + hito1 | Daily Ritual + frontmatter diario |
| `C` | 1 si `Y≥3`, else 0 | derivado |
| `W` | misiones checklist hechas / planeadas (máx 3) | semanal del día |
| `B1_ok` | Bloque 1 a tiempo (sí/no) | auto-reporte |
| `cue_adherence` | 0–1: ¿Shine+check en ≥3 de 4 frágiles? | solo días ON (fidelidad) |

**Criterio de éxito de la simulación real:** media `Y` (ON) − media `Y` (OFF) ≥ **+0.8** **o** tasa `C` ON − OFF ≥ **+25 pp**, con al menos 2/3 días ON con `cue_adherence≥0.75`. Si adherence baja, el fallo es de **ejecución del protocolo**, no de la hipótesis de cues.

## Recolección (2 min/noche)

1. Completá checks RPG de los 4 frágiles (o anotá en CSV).
2. Llená `hito1` si aplica.
3. Una fila en `habit_cues_validation_log.csv` (plantilla abajo / generada por el script).
4. No hagas OMA full en noches OFF a propósito: eso sesga el brazo.

## Análisis

```bash
pip install doekit==0.3.0   # opcional; el script corre sin él
python 01_Planificacion/experiments/habit_cues_validation_sim.py
python 01_Planificacion/experiments/habit_cues_validation_sim.py --real 01_Planificacion/experiments/habit_cues_validation_log.csv
```

1. Comparar media `Y` y tasa `C` ON vs OFF.  
2. Scatter / correlación simple: `W` vs `Y` (¿más trabajo ⇒ menos hábitos?).  
3. Si la hipótesis se sostiene → pasar a screening de **slots** (`habit_routine_doe.py`) con cues ON fijos.

## Qué no es esta simulación

- No barre “número óptimo de misiones” (Oleada 2).  
- No optimiza Metta/AM.  
- No sustituye `/oma-evaluar`.
