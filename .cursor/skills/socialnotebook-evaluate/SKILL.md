---
name: socialnotebook-evaluate
description: Consulta el notebook de habilidades sociales en NotebookLM y devuelve un briefing con citas para enriquecer evaluaciones OMA. Se dispara con /socialnotebook-evaluate o automaticamente desde /oma-evaluar.
disable-model-invocation: true
---

# /socialnotebook-evaluate — Subagente SocialNotebook

Consulta NotebookLM sobre un evento social y produce un briefing con citas para el Especialista OMA. Segui los pasos EN ORDEN.

## Paso 1 — Cargar criterios
Lee `.cursor/rules/socialnotebook-especialista.mdc` y actua segun esa regla.
Lee `01_Planificacion/00_OMA/_config/notebook_mapping.json`.

## Paso 2 — Verificar MCP
Llama `server_health` (MCP `user-notebooklm`).
- Si `authenticated: false` → llama `auth_setup` y espera que el usuario complete el login.
- Si falla el servidor → informa al usuario y detente.

## Paso 3 — Recopilar contexto
Necesitas antes de consultar:
- **Skill** evaluada (carpeta en `success_metrics_definitions/<skill>/`).
- **Evento** descrito por el usuario (que paso, donde, con quien).
- Lee `success_metrics_definitions/<skill>/definicion.md` (metrica activa, nivel, contexto de practica).

Si la skill no esta en `notebook_mapping.json` y no tiene `dominio: spirit` ni tags sociales, informa que este subagente no aplica y detente.

Resuelve el notebook desde el mapping cuya clave contenga la skill en `skills[]` (ej. `habilidades-sociales`).

## Paso 4 — Consultar NotebookLM
Avisa al usuario: *"Consultando tu notebook de habilidades sociales (puede tardar 30–60 s)..."*

Llama `notebook_ask` con:
- `question`: prompt estructurado (ver abajo)
- `notebook_url`: del mapping (preferido) o `notebook_id` de la library
- `source_format`: `expanded` (citas completas)

### Prompt tipo para `notebook_ask`

```
Dado este evento social: [evento del usuario].
Skill en practica: [nombre de la skill, ej. Carisma de Foco / 2-segundos].
Metrica activa: [resumen de definicion.md — metrica A/B y nivel actual].

Responde en espanol con estas secciones numeradas:
1) Marcos aplicables del material (carisma, silencios, autoetiquetas, OMA, escucha).
2) Clasificacion O-M-H sugerida: exito real vs espurio vs fracaso real vs espurio.
3) Anti-sesgos detectados (ej. etiqueta identitaria social, ilusion de control).
4) Un micro-parche concreto alineado al Challenge Point (~60% exito).
5) Limitaciones — que el material no cubre.

Cita fuentes del notebook en cada seccion donde aplique.
```

## Paso 5 — Guardar briefing
Escribe en `success_metrics_definitions/<skill>/evaluaciones/_consultas/AAAA-MM-DD-notebook.md` con frontmatter:

```yaml
---
tipo: consulta-notebooklm
skill_vinculada: ""
fecha: AAAA-MM-DD
evento: ""
notebook_url: ""
---
```

Cuerpo: las 5 secciones del briefing + respuesta completa de NotebookLM (o resumen fiel con citas).

## Paso 6 — Devolver al agente padre
Si `/oma-evaluar` te invoco, devolve un resumen de 5 bloques (max 8 bullets total) para el Paso 3.
Si el usuario invoco `/socialnotebook-evaluate` solo, presenta el briefing completo y sugiere `/oma-evaluar` para el AAR.

## Limite
No corras el AAR completo ni generes parches aqui (eso es `/oma-evaluar`). No redefinas metricas (eso es `/oma-metrica`).
