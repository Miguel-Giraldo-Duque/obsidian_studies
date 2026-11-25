---
tags:
  - estudio
prioridad: normal
tema_iniciado: 2026-11-25
etapa_repaso: 0
ultimo_repaso: ""
proximo_repaso: 2026-11-26
fuente: "[[Escuelas/Escuela de AI/Harness|Harness]]"
---
Práctica de [[Escuelas/Escuela de AI/Harness|Harness]] (Escuela de AI, prioridad normal). Generada el 2026-11-25 (America/Buenos_Aires) a pedido de Miguel, sin Cornell previo. Contraste con [Anthropic · Effective harnesses for long-running agents](https://www.anthropic.com/research/effective-harnesses-for-long-running-agents) y [Anthropic · Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) (consultadas 2026-11-25). Hermanas: [[Tools — Agentes]], [[Errores de arquitectura — Escuela de AI]].

## Preguntas

- **1. ¿Qué es un harness y qué pasa cuando el agente pide usar una tool?**
    - **Respuesta:** Es la «correa»: el software alrededor del LLM que le da un entorno donde actuar. Cuando el modelo pide una tool (p. ej. revisar stock), el harness la ejecuta, chequea lo que corresponda y devuelve el resultado al prompt invocando de nuevo al LLM, en loop, hasta cumplir la tarea. Anthropic llama al Claude Agent SDK un agent harness de propósito general, con manejo de contexto (p. ej. compactación).
    - **Puntos clave:** software alrededor del LLM · ejecuta tools · checks · loop hasta la tarea · manejo de contexto

- **2. Nombrá las partes del harness que listaste y para qué sirve cada una.**
    - **Respuesta:** 1) Entorno/sandbox: espacio limitado, con aprobación para ciertas acciones. 2) Tools: a qué tiene acceso. 3) Checks/seguridad y human in the loop. 4) Contexto y loop: qué entra al prompt (memoria larga, system, input, docs, historial, resultados) y en qué momento del ciclo actúa el harness. 5) Subagentes/delegación de tareas grandes. 6) Automejora (recursiva o no). 7) Estado compartido entre partes, más observabilidad.
    - **Puntos clave:** sandbox · tools · checks / human in the loop · contexto + loop · subagentes · automejora · estado + observabilidad

- **3. El agente se salió del plan. Según tu nota, ¿cuál es la respuesta de harness engineering?**
    - **Respuesta:** Cada vez que sale de lo planteado es una oportunidad para mejorar el software alrededor, de forma que no vuelva a ser posible. El agente actúa solo, pero siempre bajo nuestro liderazgo: la regla queda en el código, no solo en el prompt.
    - **Puntos clave:** desvío = oportunidad · regla en el software · autonomía bajo nuestro liderazgo

- **4. Describí tu flujo de automejora con improve.md y qué lo vuelve recursivo.**
    - **Respuesta:** Al terminar una sesión de dev: 1) identificar errores que se desalinean del plan; 2) causa raíz (5 porqués); 3) estrategias para que no se repitan; 4) implementarlas; 5) crear validaciones para comprobar que el problema era real y quedó resuelto; 6) guardar en un registro. Se vuelve recursivo cuando otro archivo/estrategia revisa y mejora el propio improve (mejorar cómo detecta problemas): se mejora para aprender a mejorar.
    - **Puntos clave:** errores vs plan · 5 porqués · estrategia · implementar · validar · registrar · mejorar el mejorador

- **5. ¿Cuándo vale la pena un agente y cuándo es mejor un flujo fijo?**
    - **Respuesta:** Tu nota: el agente rinde cuando el siguiente paso depende de algo que descubre o tiene que elegir entre opciones según lo que devuelven las tools. Si los pasos son predecibles, el agente gasta más llamadas y evaluaciones sin mejor resultado. Anthropic: workflows (caminos predefinidos en código) para tareas bien definidas; agentes cuando hace falta flexibilidad y decisión del modelo.
    - **Puntos clave:** paso depende de lo descubierto → agente · predecible → workflow · costo
