---
name: doekit-habits
description: Usa doekit como MCP mental para diseñar/evaluar la rutina de hábitos (screening de slots, Y diaria, sequential DoE). Activar cuando Soulhy pida optimizar rutina, cues, o revisar el experimento de 8 días.
---

# doekit-habits (MCP mental)

## Setup

```bash
pip install doekit==0.3.0
python 01_Planificacion/experiments/habit_routine_doe.py
```

Docs: https://alejandro-qnow.github.io/doekit/

## Factores del screening

| Factor | −1 | +1 |
|--------|----|----|
| career_slot | break 2 | break 1 (post Bloque 1) |
| read_slot | noche/libre | break 2 |
| study_dose | 15′ | 30′ |
| am_metta | a veces | siempre en rito |
| career_min | solo connect | apply obligatorio |

## Respuesta Y (0–4)

carrera hecha + lectura ≥2 pág + estudio ≥15′ + hito1.

**Restricción:** Bloque 1 ≤ ~09:15.

## Protocolo

1. Corré el script → matriz de 8 días.  
2. Logueá Y cada día.  
3. Interpretá qué factores mueven Y (anti-alias: prep CV ≠ apply).  
4. Fijá diseño ganador 2 semanas → solo entonces subir dosis.

## Antes del screening (validar cues)

Mini A/B 6 días cues ON/OFF (carga fija 3 misiones):  
`01_Planificacion/experiments/habit_cues_validation.md`  
`python 01_Planificacion/experiments/habit_cues_validation_sim.py`

## Canon de rutina

Ver [[01_Planificacion/Mapa_Cues_Habitos]]: Shine → check → campana Toggl AM.
