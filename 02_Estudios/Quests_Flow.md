---
tags: [quest-design, presencia, flow]
skill: Flow
school: Presencia
status: 60-en-juego
nodo_vibe_rpg: node_1785983669892_tu8ccua1d
fuente_banco: 001 banco de quest/001 banco de retos de Flow.md
actualizado: 2026-08-05
---

# Quests: Flow (Presencia)

> **60 quests** (20 por nivel × 3) cargadas en el skill tree. Banco completo: [[001 banco de retos de Flow]].

## Marco

TPN vs DMN · Ratio Señal/Ruido · saturación sensorial. Protocolos: TSN + anclaje / suspiro cíclico.

## Cómo se juega

1. Ejecutás el reto del bloque activo (misma familia, más duración/intensidad).
2. Registrás la métrica del nivel (S/R, clústers, “Así es”, latencia, carga).
3. Completás la quest en el nodo **Flow**.
4. No subís de nivel hasta el gate.

| Nivel | Regla | Quests | Gate |
|-------|--------|--------|------|
| Lv1 Hardware | Pared / sonidos / microfocos / kit TSN | 20 | ≥80% S/R en 3×20 min + 20 min audio + ≥40 microfocos |
| Lv2 Software social | Retratista + Voss + Jordan en público | 20 | ≥5 clústers + 10 “Así es” |
| Lv3 Caos | Detalle ridículo + latencia + transferencia | 20 | Latencia &lt;10 s + carga ≤3 |

## Nivel 1 — Hardware (20)

### Bloque A Pared (8)
- Q1.1 El Punto de 2 Minutos
- Q1.2 Cinco Minutos de Hardware
- Q1.3 Diez Minutos Neutros
- Q1.4 Quince Sin Dopamina
- Q1.5 Pared de 20 — Baseline
- Q1.6 Pared de 20 — Setenta
- Q1.7 Pared de 20 — Gate Ochenta
- Q1.8 Media Hora de Hardware

### Bloque B Sonidos (6)
- Q1.9 Vendaje de 3 Minutos
- Q1.10 Cinco Minutos Auditivos
- Q1.11 Diez Minutos de Oído
- Q1.12 Quince Auditivos
- Q1.13 Veinte Minutos de Sonido
- Q1.14 Sonido Sostenido — Gate

### Bloque C Foco dinámico (4)
- Q1.15 Cinco Microfocos
- Q1.16 Diez Microfocos
- Q1.17 Veinte Microfocos
- Q1.18 Cuarenta Microfocos — Gate Dinámico

### Bloque D Kit soporte (2)
- Q1.19 TSN: Noto el Pensamiento
- Q1.20 Cable a Tierra

## Nivel 2 — Software social (20)

### Bloque A Retratista Límbico (8)
- Q2.1–Q2.8: 1→5 clústers + galería del día (ver banco)

### Bloque B Escucha Operativa Voss (8)
- Q2.9–Q2.16: silenciar respuesta → 10 “Así es” + doble espejo

### Bloque C Jordan → social (4)
- Q2.17 Cepillo en Público
- Q2.18 Sorbo Observado
- Q2.19 Puerta y Umbral
- Q2.20 Micro-observación en Tránsito

## Nivel 3 — Caos (20)

### Bloque A Detalle Ridículo (8)
- Q3.1–Q3.8: reto 6→10 + karaoke/boss + doble freno

### Bloque B Latencia vagal (6)
- Q3.9–Q3.14: baseline → &lt;10 s → cadena

### Bloque C Transferencia de Responsabilidad (6)
- Q3.15–Q3.20: avatar → carga ≤3 → maestría integrada

## Cheat sheet

| Familia | Métrica | Target |
|---------|---------|--------|
| Pared / Sonidos | S/R | ≥80% / ≥75% |
| Microfocos | cantidad | ≥40 |
| Retratista | clústers | ≥5 / ~3 min |
| Voss | “Así es” | 10 acumulados |
| Panic button | ancla visual | bajo spike |
| Suspiro | latencia s | &lt;10 |
| Transferencia | carga 1–10 | ≤3 |

**Mantra:** saturá señal externa → el ego se queda sin ancho de banda → amenaza social = problema técnico de observación.

Script inject: `01_Planificacion/experiments/_inject_flow_quests.py` · source: `flow-bank`.
