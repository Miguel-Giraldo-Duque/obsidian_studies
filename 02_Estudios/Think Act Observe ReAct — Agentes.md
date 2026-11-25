---
tags:
  - estudio
prioridad: critica
tema_iniciado: 2026-11-25
etapa_repaso: 0
ultimo_repaso: ""
proximo_repaso: 2026-11-26
fuente: "[[Escuelas/Escuela de AI/Agentes/Think Act Observe ReAct|Think Act Observe ReAct]]"
---
Práctica de [[Escuelas/Escuela de AI/Agentes/Think Act Observe ReAct|Think Act Observe ReAct]] (Escuela de AI, prioridad critica). Generada el 2026-11-25 (America/Buenos_Aires) a pedido de Miguel, sin Cornell previo. Contraste con [HF · Thought-Action-Observation](https://huggingface.co/learn/agents-course/unit1/agent-steps-and-structure), [HF · Thoughts](https://huggingface.co/learn/agents-course/unit1/thoughts), [HF · Actions](https://huggingface.co/learn/agents-course/unit1/actions), [HF · Observations](https://huggingface.co/learn/agents-course/unit1/observations) y el paper [ReAct (Yao et al., 2022)](https://arxiv.org/abs/2210.03629) (consultadas 2026-11-25). Hermanas: [[Agentes — Escuela de AI]], [[Tools — Agentes]].

## Preguntas

- **1. Con tu ejemplo del presupuesto en pesos argentinos, recorré el ciclo Thought → Action → Observation hasta la respuesta final.**
    - **Respuesta:** Thought: divido el pedido en pasos (traer presupuesto, traer cotización, convertir). Action: llamo `get_presupuesto`. Observation: leo el resultado. Thought: ¿alcanza para responder? No, falta la cotización → Action: tool de currency → Observation. Thought: ya puedo responder → respuesta final. Es un while loop que corta cuando el modelo decide que tiene suficiente.
    - **Puntos clave:** pensar → actuar → observar → repetir · corta cuando hay respuesta final · while loop

- **2. Tu cue pregunta «¿Cuál es la diferencia con ReAct?». ¿Con qué hay que comparar realmente?**
    - **Respuesta:** Tu nota dice: «se diferencia por su enfoque en que piense paso a paso, pero en medio tome acción». La fuente dice: ReAct = Reasoning + Acting, intercala razonamiento con acciones y observaciones; Chain-of-Thought (CoT) es solo razonamiento interno paso a paso, sin acciones. Corrección: la nota ES ReAct; el contraste es ReAct vs CoT.
    - **Puntos clave:** ReAct = razonar + actuar · CoT = solo pensar paso a paso · el contraste es con CoT

- **3. ¿Cuándo conviene ReAct y cuándo no?**
    - **Respuesta:** Conviene en tareas complejas que piden juntar info de varias fuentes del mundo real y donde el siguiente paso depende de lo que se observa. No conviene si los pasos ya son predecibles: más llamadas = más costo y latencia sin mejor resultado (Anthropic: usá workflows para pasos predefinidos y agentes cuando no se pueden prever).
    - **Puntos clave:** multi-fuente / paso depende de observación · predecible → workflow · costo y latencia

- **4. JSON agent, code agent y function-calling: ¿en qué se diferencian y por qué el code agent es más potente pero más riesgoso?**
    - **Respuesta:** JSON agent: escribe la acción en JSON y un parser la ejecuta. Function-calling: variante de JSON con modelos ajustados para emitir una llamada por mensaje. Code agent: escribe un bloque de código (p. ej. Python) que se ejecuta afuera: más expresivo (loops, condicionales, reutilizar funciones), pero ejecutar código generado tiene riesgos de seguridad (prompt injection, código dañino), por eso se usan sandboxes.
    - **Puntos clave:** JSON / function-calling / code · code = expresivo y reutilizable · riesgo → sandbox

- **5. Tu nota dice que «el LM lo ejecuta» y le pasa el resultado como observación. ¿Qué hay que corregir y qué pasa con la observación?**
    - **Respuesta:** Tu nota dice: el LLM ejecuta la acción. La fuente dice: el LLM deja de generar tras escribir la acción (stop and parse); el framework la parsea y ejecuta, y agrega el resultado al final del prompt como observación. Corrección: el que ejecuta es el agente, no el LLM. La observación (logs, respuesta de API, filas de DB) es el nuevo input para el siguiente Thought.
    - **Puntos clave:** stop and parse · el agente ejecuta · observación se agrega al prompt · alimenta el próximo Thought
