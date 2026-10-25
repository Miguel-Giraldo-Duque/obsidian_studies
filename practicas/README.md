---
tags: [practicas, estudio]
---

# practicas/ — ejercicios técnicos de campañas

Usado por campañas `tipo: tecnica` en `02_Estudios/Campanas/`.  
Se abren en Cursor/VS Code (no editor embebido en Obsidian).

## Convención de carpeta

```
practicas/
  <slug>/
    prompt.md      # enunciado + criterio de éxito (~60%)
    index.js       # u otro entry (intento del aprendiz)
    STATUS.md      # open | done | deferred
```

### STATUS.md

```markdown
---
status: open
due: YYYY-MM-DD
campana: "[[02_Estudios/Campanas/Nombre]]"
---

# Estado

- **open** — misión activa (máx. 1 open de código a la vez en MVP)
- **done** — criterio de éxito cumplido
- **deferred** — pospuesta; poner nueva `due` y no generar otra misión hasta cerrar o deferir
```

## Reglas MVP

1. Una sola práctica `open` a la vez.
2. Días **output** del [[01_Planificacion/MVP_Habito_Estudio_20|Bloque estudio 20′]]: avanzar aquí 8–10′.
3. No vistas / no terminadas → `deferred` o dejar `open` con `due` mañana (no cuentan como fallo de flashcard).
4. `/generar-estudios-hoy` puede crear el stub (`prompt.md` + `STATUS.md`) al aprobar una campaña técnica.
