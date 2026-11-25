---
tags:
  - estudio
prioridad: critica
tema_iniciado: 2026-11-25
etapa_repaso: 0
ultimo_repaso: ""
proximo_repaso: 2026-11-26
fuente: "[[Escuelas/Escuela de AI/Agentes/Contexto|Contexto]]"
---
Práctica de [[Escuelas/Escuela de AI/Agentes/Contexto|Contexto]] (mensajes, system prompt y chat templates). Escuela de AI, prioridad critica. Generada el 2026-11-25 (America/Buenos_Aires) a pedido de Miguel, sin Cornell previo. Contraste con [HF · Messages and Special Tokens](https://huggingface.co/learn/agents-course/unit1/messages-and-special-tokens) (consultada 2026-11-25). Hermanas: [[Agentes — Escuela de AI]], [[LLMs — Escuela de AI]].

## Preguntas

- **1. Mandás a la API una lista JSON de mensajes (system, user, assistant). ¿Qué recibe realmente el modelo?**
    - **Respuesta:** Un solo texto: el chat template convierte la lista de mensajes en un prompt con los tokens especiales del modelo (inicio y fin de turno, rol). El modelo no tiene memoria: en cada turno se le vuelve a pasar toda la conversación como prompt, hasta el límite de la ventana de contexto.
    - **Puntos clave:** lista de mensajes → chat template → un prompt · tokens especiales · sin memoria, se reenvía todo

- **2. ¿Qué va en el system message y qué en los mensajes de usuario?**
    - **Respuesta:** System: cómo queremos que se comporte el agente a nivel general: rol, procedimientos, tools disponibles, formato y contexto. User/assistant: los turnos concretos de la conversación.
    - **Puntos clave:** system = comportamiento global + tools · user/assistant = turnos

- **3. Base vs instruct: ¿qué es cada uno y cuál usás para un agente conversacional?**
    - **Respuesta:** Tu nota dice: los instruct son modelos orientados a procesos concretos como reservas o soporte técnico. La fuente dice: el base se entrena con texto crudo para predecir el siguiente token; el instruct se ajusta (fine-tuning) para seguir instrucciones y conversar. Corrección: «instruct» no significa de un dominio específico, significa entrenado para seguir instrucciones/diálogo. Para un agente usás un instruct.
    - **Puntos clave:** base = texto crudo · instruct = sigue instrucciones y conversa · no es «de dominio»

- **4. ¿Por qué usar el chat template equivocado degrada al modelo? ¿Y si querés usar un modelo base?**
    - **Respuesta:** Cada modelo aprendió un formato propio (tokens especiales y estructura) para saber quién habla, dónde empieza y termina un turno y dónde van las tools. Con otro formato se confunde y rinde peor. Para que un base converse, tenés que darle la estructura con un template (p. ej. ChatML) de forma consistente. En la práctica, el tokenizer del modelo trae su template (`apply_chat_template`).
    - **Puntos clave:** cada modelo = su formato · formato incorrecto = confusión · base necesita template consistente

- **5. Escenario: un agente tuyo tiene una conversación muy larga. ¿Qué pasa con el contexto y qué tendrías que cuidar?**
    - **Respuesta:** Como todo el historial se reenvía en cada turno, crece el costo en tokens y en algún momento se pasa la ventana de contexto: lo más viejo se pierde o hay que resumirlo/compactarlo. Hay que decidir qué entra al prompt (historial, docs, resultados de tools) para no degradar la respuesta (ver [[Harness — Escuela de AI]]).
    - **Puntos clave:** historial se reenvía · costo crece · límite de ventana · resumir/compactar · elegir qué entra
