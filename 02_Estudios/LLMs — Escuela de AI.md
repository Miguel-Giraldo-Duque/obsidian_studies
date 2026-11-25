---
tags:
  - estudio
prioridad: normal
tema_iniciado: 2026-11-25
etapa_repaso: 0
ultimo_repaso: ""
proximo_repaso: 2026-11-26
fuente: "[[Escuelas/Escuela de AI/LLMS|LLMS]]"
---
Práctica de [[Escuelas/Escuela de AI/LLMS|LLMS]] (Escuela de AI, prioridad normal). Generada el 2026-11-25 (America/Buenos_Aires) a pedido de Miguel, sin Cornell previo. Contraste con [HF · What are LLMs?](https://huggingface.co/learn/agents-course/unit1/what-are-llms), [Anthropic · Prompt caching](https://docs.claude.com/en/docs/build-with-claude/prompt-caching) y [Anthropic · Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) (consultadas 2026-11-25). Hermanas: [[Agentes — Escuela de AI]], [[Contexto — Agentes]].

## Preguntas

- **1. ¿Qué significa que un LLM es autorregresivo y por qué decís que es «una calculadora de probabilidades»?**
    - **Respuesta:** Genera un token, lo agrega al input y predice el siguiente más probable, una y otra vez, hasta el final (EOS). Todo es una distribución de probabilidad sobre el próximo token; los modelos instruidos están ajustados para responder preguntas y seguir conversaciones.
    - **Puntos clave:** token a token · cada salida vuelve al input · distribución de probabilidad · EOS

- **2. ¿Por qué pedirle que razone paso a paso mejora la respuesta, si sigue siendo predicción de tokens?**
    - **Respuesta:** Porque generar pasos intermedios le da más contexto propio antes de la respuesta final: cada paso condiciona mejor la predicción del siguiente. Sigue siendo generación de tokens, pero más gastados en pensar.
    - **Puntos clave:** sigue siendo tokens · pasos intermedios = más contexto · mejor predicción

- **3. «La memoria del agente no existe». ¿Qué significa y qué la reemplaza?**
    - **Respuesta:** El modelo no recuerda entre llamadas: en cada llamada recibe todo el input (prompt, historial, resultados de tools, conocimiento previo) y predice desde ahí. La «memoria» es lo que el software decide volver a meter en el contexto (ver [[Contexto — Agentes]]).
    - **Puntos clave:** sin estado entre llamadas · todo se reenvía · memoria = lo que el software mete al contexto

- **4. Tokens, ventana de contexto y caché: ¿cómo afectan el costo? Corregí lo del «más o menos 1 hora».**
    - **Respuesta:** Todo se mide en tokens (input y output tienen precio). La ventana de contexto es cuántos tokens entran en total: más ventana, más historial. Tu nota dice: algunos modelos abaratan llamadas seguidas por alrededor de 1 hora antes de perder el caché. La fuente dice (Anthropic): el prompt caching dura 5 minutos por defecto y se renueva cada vez que se usa; existe una opción de 1 hora que cuesta más al escribir. Corrección: depende del proveedor; en Anthropic el default es 5 min, no 1 h.
    - **Puntos clave:** precio por token · ventana = límite total · caché reutiliza prefijos · Anthropic: 5 min default, 1 h opcional

- **5. ¿Qué es un agente según tu nota y por qué el LLM no ejecuta las tools?**
    - **Respuesta:** Un agente es un LLM envuelto en software, en un loop, con acceso a tools, para lograr un objetivo. El LLM decide qué tool llamar y con qué argumentos; el software ejecuta las búsquedas/consultas y le devuelve el resultado. Anthropic: LLMs que usan tools según el feedback del entorno, en un loop.
    - **Puntos clave:** LLM + loop + tools + objetivo · LLM decide · software ejecuta

- **6. Te piden optimizar costos de un producto con LLM que todavía no tiene usuarios. ¿Qué respondés?**
    - **Respuesta:** Primero resolver el problema de negocio y validar con feedback real; recién después optimizar tokens y costos. Optimizar temprano es malo porque todavía no sabés qué importa. Coincide con Anthropic: empezar por la solución más simple y sumar complejidad solo si hace falta.
    - **Puntos clave:** primero resolver y validar · después optimizar · optimización prematura = mala
