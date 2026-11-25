---
tags:
  - estudio
prioridad: critica
tema_iniciado: 2026-11-25
etapa_repaso: 1
ultimo_repaso: 2026-11-25
proximo_repaso: 2026-11-26
fuente: "[[Escuelas/Escuela de AI/Agentes/Tools|Tools (Agentes)]]"
---
Práctica de [[Escuelas/Escuela de AI/Agentes/Tools|Tools]] del curso de agentes (Escuela de AI, prioridad critica). No es la nota de Tools del arco Vercel AI SDK, que sigue fuera de repaso. Generada el 2026-11-25 (America/Buenos_Aires) a pedido de Miguel, sin Cornell previo. Contraste con [HF · What are Tools?](https://huggingface.co/learn/agents-course/unit1/tools), [HF · Actions](https://huggingface.co/learn/agents-course/unit1/actions), [Anthropic · Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) y [Model Context Protocol](https://modelcontextprotocol.io/introduction) (consultadas 2026-11-25). Hermanas: [[Agentes — Escuela de AI]], [[Think Act Observe ReAct — Agentes]].

## Preguntas

- **1. ¿Qué problema resuelve darle tools a un LLM? Dame 3 ejemplos.**
    - **Respuesta:** El LLM solo sabe lo que vio en el entrenamiento. Una tool es una función que le da acceso al mundo real: clima, reservas actuales, noticias, búsquedas, consultas a bases de datos, APIs u otros modelos. Con eso decide mejor.
    - **Puntos clave:** info posterior al entrenamiento · función con objetivo claro · búsqueda / DB / API

- **2. Diseñá una tool para tu app de finanzas («rendimiento de los últimos N meses»). ¿Qué tiene que tener la definición?**
    - **Respuesta:** Tu nota y la fuente coinciden: nombre, descripción clara de lo que hace, argumentos con tipos y output con tipo. Ej.: `calcular_rendimiento(meses: int) -> float`. Anthropic agrega: escribila como un buen docstring para un junior, con ejemplos y bordes claros, y hacé que sea difícil usarla mal (poka-yoke).
    - **Puntos clave:** nombre · descripción · args tipados · output tipado · docstring claro / poka-yoke

- **3. Paso a paso: ¿cómo llega una tool desde tu código hasta que el modelo la «usa»?**
    - **Respuesta:** 1) La descripción de la tool se pasa como texto en el system prompt. 2) El LLM detecta que la necesita y escribe la llamada como texto estructurado (JSON con nombre + argumentos). 3) Deja de generar (stop and parse). 4) El agente/framework parsea ese texto y ejecuta la función. 5) El resultado vuelve al prompt como observación y se vuelve a invocar al LLM.
    - **Puntos clave:** descripción en system prompt · LLM escribe la llamada · stop and parse · el agente ejecuta · resultado = observación

- **4. ¿Quién ejecuta realmente la tool: el LLM o el agente? ¿Por qué importa?**
    - **Respuesta:** El LLM solo produce texto: describe qué tool quiere y con qué argumentos. Quien ejecuta es el software del agente (el harness). Importa porque ahí ponés validaciones, permisos y checks antes de ejecutar (ver [[Harness — Escuela de AI]]).
    - **Puntos clave:** LLM = texto · agente/harness ejecuta · ahí van los checks

- **5. Tu nota llama a los MCP «librerías de herramientas». ¿Qué hay que precisar?**
    - **Respuesta:** Tu nota dice: los MSP son como librerías de herramientas. La fuente dice: MCP (Model Context Protocol) es un protocolo abierto que estandariza cómo una aplicación le expone tools y contexto a un LLM; un servidor MCP publica tools que cualquier cliente compatible puede usar. Corrección: se escribe MCP y es un protocolo/interfaz estándar, no una librería. La idea de «interfaz para info con la que no fue entrenado» está bien.
    - **Puntos clave:** MCP = protocolo estándar · servidor expone tools · cliente compatible las usa

- **6. ¿Para qué sirve un decorador `@tool` en un framework?**
    - **Respuesta:** Para no escribir la descripción a mano: el framework toma la firma de la función (nombre, tipos de los argumentos y del retorno) y el docstring, y arma automáticamente el texto de la tool que va al prompt (así lo muestra el curso de HF con `@tool`).
    - **Puntos clave:** firma + docstring → descripción automática · menos errores de formato

## Repaso

- **Fecha:** 2026-11-25 (America/Buenos_Aires). Formato opción múltiple (A/B/C + D respuesta libre): las opciones miden reconocimiento, no recuerdo libre.
- **Día de curva:** etapa 0 (primera práctica). Las dos preguntas evaluadas correctas por reconocimiento. Avanza a etapa 1, próximo 2026-11-26.
- **Orden 3, cómo llega una tool y quién la ejecuta:** resultado correcto (opción C) · ayuda ninguna · autocorreccion false.
- **Orden 4, definición de la tool «rendimiento de los últimos N meses»:** resultado correcto (opción B) · ayuda ninguna · autocorreccion false.
