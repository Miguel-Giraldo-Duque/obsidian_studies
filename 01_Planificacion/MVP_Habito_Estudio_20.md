---
tags: [habitos, estudio, mvp]
actualizado: 2026-10-11
---

# MVP — Raw → Cornell → Cards (hábito 20′)

## Solo 3 pasos

| # | Paso | Qué | `estudio_estado` |
|---|------|-----|------------------|
| 1 | **Raw** | Plazi/lectura + voz → transcript | `raw` |
| 2 | **Cornell** | Cues + Notas + Summary (de memoria) | `cornell` |
| 3 | **Cards** | Generar → Q&A en curva | `cards` |

Plantilla: [[00_Plantillas/Plantilla_Sesion_Estudio]]. Diaria: **Acciones de estudio** (modo + colas + repasos juntos).

### Días mixtos (estudiar + repasos + Cornell)

En los 20′ **no hacés todo**: la diaria lista todo en orden. Prioridad:

1. **Cornell** (1 raw)  
2. **Generar** (si hay `cornell`)  
3. **Repasos** (hasta ~4–5)  
4. **Nuevo Raw** solo si el modo es Plazi/Lectura **y sobra tiempo**

El **Modo** (`Plazi` \| `Lectura` \| `Repaso`) es la intención del día; el backlog no lo borra — si hay cola, el input nuevo queda como “si sobra”.

## Rutina del hábito

1. Cue: trastes almuerzo + cepillado → escritorio  
2. 2′ pared  
3. 18′ según **cola de la diaria**  
4. Shine → check **Bloque estudio 20′**  
5. If-then → `mision_salida` ~16:00  

Prioridad: Cornell (`raw`) → Generar (`cornell`) → Cards → nuevo Raw.

## Semana ejemplo

| Día | Calendario | En los 20′ | Al cerrar |
|-----|------------|------------|-----------|
| Lun | plazi | Raw A | A = `raw` |
| Mar | lectura | Raw B + `mision_salida` | B = `raw` |
| Mié | output | **Ritual Cornell** A → Generar | A = `cards` |
| Jue | plazi | Cornell B o Raw C | … |
| Vie | lectura | Generar B o Raw | … |
| Sáb–Dom | output | Cards / buffer | — |

---

## Ritual Cornell (día siguiente)

Una sección: **Cues** → **Notas** → **Summary**.

### Minuto a minuto (~18′)

| Min | Qué |
|-----|-----|
| 0–2 | Pared. Abrí 1 nota de Acciones de estudio. Sin Raw al inicio. |
| 2–12 | De memoria: Cues + Notas + Summary. |
| 12–15 | Mirá Raw; corregí huecos. |
| Cierre | `estudio_estado: cornell` + `fecha_cornell` |

### Después

Generar estudios · curva 1/2/7/15/31 · if-then → `mision_salida`.

### Errores

1. Escribir Cornell mirando Raw.  
2. Cues vacíos (sin retrieval).  
3. Generar cards desde Raw sin Cornell.

---

## Estados

| Evento | Frontmatter |
|--------|-------------|
| Nueva sesión | `raw` |
| Ritual OK | `cornell` + `fecha_cornell` |
| Generar OK | skill → `cards` |

## Caps / herramientas

- 1 campaña social + 1 técnica. ≤5 cards/tema.  
- Raw: Voice Scribe / Win+H.  
- Cornell: callouts plegables (`[!abstract]-`) — podés desactivar **Cornell Marginalia** si lo tenías.

Campañas: [[02_Estudios/Campanas/_TEMPLATE_campana]]. [[Mapa_Cues_Habitos]].
