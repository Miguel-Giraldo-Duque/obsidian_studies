---
tags:
  - estudio
prioridad: critica
tema_iniciado: 2026-11-25
etapa_repaso: 0
ultimo_repaso: ""
proximo_repaso: 2026-11-26
fuente: "[[Escuelas/Escuela de AI/Agentes/Agentes|Agentes]]"
---
Práctica de [[Escuelas/Escuela de AI/Agentes/Agentes|Agentes]] (Escuela de AI, prioridad critica). Generada el 2026-11-25 (America/Buenos_Aires) a pedido de Miguel, sin Cornell previo. Contraste con [HF Agents Course · What is an Agent?](https://huggingface.co/learn/agents-course/unit1/what-are-agents), [HF · What are LLMs?](https://huggingface.co/learn/agents-course/unit1/what-are-llms) y [Anthropic · Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) (consultadas 2026-11-25). Hermanas: [[Tools — Agentes]], [[Think Act Observe ReAct — Agentes]], [[Contexto — Agentes]].

## Preguntas

- **1. Definí un agente con la metáfora cerebro/cuerpo y decí qué lo hace «agente».**
    - **Respuesta:** Tu nota dice: entidad con agencia que actúa de forma autónoma usando un LLM como cerebro y tools/acciones como cuerpo. La fuente dice: un modelo de AI capaz de razonar, planear e interactuar con su entorno; el cerebro es el modelo y el cuerpo son las tools y capacidades. Anthropic: el LLM dirige dinámicamente su propio proceso y el uso de tools, en un loop con feedback del entorno.
    - **Puntos clave:** razonar + planear + actuar · cerebro = LLM · cuerpo = tools · loop con feedback del entorno

- **2. Un cliente te pide «un chatbot que responda sobre el stock de hoy». ¿Por qué un chatbot puro no alcanza y qué tendría que tener el agente?**
    - **Respuesta:** Un chatbot solo predice el siguiente token con lo que aprendió en el entrenamiento: no conoce el stock de hoy. El agente necesita una tool (consultar la DB/API de stock), ejecutar la acción, observar el resultado y recién ahí responder (ciclo de [[Think Act Observe ReAct — Agentes|ReAct]]).
    - **Puntos clave:** chatbot = texto desde entrenamiento · sin info reciente · agente = tool + acción + observación

- **3. Ordená los niveles de agencia de menor a mayor con un ejemplo de cada uno (usá tu ejemplo del café).**
    - **Respuesta:** Tu nota: solo genera texto → condiciones lógicas (si pasa X, hace Y) → elige qué tool usar → varias llamadas encadenadas (azúcar → café → leche, evaluando cada resultado) → multi-agente. La fuente ([HF]({HF}/what-are-agents)) usa la misma escala: procesador simple, router, tool caller, agente multi-paso, multi-agente.
    - **Puntos clave:** texto → router/condicional → elige tool → multi-paso con loop → multi-agente

- **4. Encoder, decoder y seq2seq: ¿qué hace cada uno y cuál usa un LLM tipo GPT o Llama?**
    - **Respuesta:** Tu nota dice (raw): el modelo «tradicional que conocemos como ChatGPT» es secuencia a secuencia. La fuente dice ([HF]({HF}/what-are-llms)): encoder (p. ej. BERT) produce una representación densa/embedding (clasificación, búsqueda semántica); decoder (p. ej. GPT, Llama) genera el siguiente token y es el tipo más común de LLM; seq2seq (T5, BART) combina ambos (traducción, resumen). Corrección: GPT/Llama son decoder-only, no seq2seq.
    - **Puntos clave:** encoder → embeddings · decoder → siguiente token (GPT, Llama) · seq2seq → T5/BART · no confundir

- **5. ¿Cómo genera texto un decoder, qué es un token y cuándo para?**
    - **Respuesta:** Tokeniza el input, predice el token más probable dado los anteriores, lo agrega y repite (autorregresivo) hasta emitir el token EOS. Tu nota dice: «Miguel» puede ser cuatro tokens, M uno, i otro… La fuente dice: los tokenizers usan subpalabras (p. ej. «interest» + «ing»), no letra por letra. Corrección: un token suele ser un pedazo de palabra; un nombre común puede ser 1–2 tokens. Hay estrategias de decodificación: elegir el más probable o beam search.
    - **Puntos clave:** autorregresivo · token = subpalabra · EOS = fin · greedy / beam search

- **6. ¿Por qué cambiar unas pocas palabras del prompt cambia tanto la respuesta?**
    - **Respuesta:** Por la atención del transformer: no todas las palabras pesan lo mismo para predecir el siguiente token. El prompt condiciona qué tokens son probables, así que las palabras elegidas guían la predicción. Por eso importa redactar bien (y el fine-tuning especializa el modelo en tareas concretas).
    - **Puntos clave:** atención = peso distinto por token · el prompt condiciona la predicción · fine-tuning especializa
