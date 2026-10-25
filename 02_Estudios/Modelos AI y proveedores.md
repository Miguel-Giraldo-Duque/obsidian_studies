---
tags:
  - estudio
tema_iniciado: 2026-08-15
---
Preguntas y respuestas para fijar los conceptos de [[02_Estudios/Modelos AI y proveedores]]: qué es un modelo, sus características, grupos (LLM / imagen / multi / embeddings) y cómo elegir provider según costo y uso.


- **¿Qué es un modelo de AI?** -

    **Respuesta:**

    Un programa entrenado con grandes cantidades de texto cuyo objetivo es **predecir** texto, resultados u otros outputs.

un sistsema predictivo entrenado con leguaje 

- **¿Cuáles son las tres características clave de un modelo?** -

    **Respuesta:**

    1. **Context window** — memoria de trabajo / cuánto contexto mantiene.
    2. **Inteligencia** — calidad y creatividad del output.
    3. **Velocidad** — qué tan rápido responde.

- V, Intelgiencia, context 

- **¿Qué es el context window?** -

    **Respuesta:**

    Cuánta “memoria de trabajo” tiene el modelo contigo. Cuanto más grande, más contexto (docs, chat largo) puede sostener sin “olvidar”.

Cuanto peuden recibir
- **¿Para qué sirven los LLMs según la nota?**-

    **Respuesta:**

    Son modelos con **mucho context window**, ideales para **analizar documentos** y **conversaciones largas**.
para mantner conversaciones y relaizar interaciones input 

- **¿Qué hacen los generadores de imágenes?**

    **Respuesta:**

    Pueden **analizar y generar** imágenes a partir de un input.


- **¿Qué es un multi-content model?**

    **Respuesta:**

    Un modelo que recibe **varios tipos de medio** (audio, texto, etc.) y puede responder a partir de esa mezcla.


- **¿Qué son los embeddings?**

    **Respuesta:**

    Coordenadas de tu información: miden **qué tan cerca** están dos ideas. Cerca = relación fuerte (hamburguesa ↔ McDonald’s); lejos = poca relación (hamburguesa ↔ natación).


- **¿Qué implica el tradeoff velocidad / inteligencia / context window?**

    **Respuesta:**

    Mejorar esas tres cosas suele hacer el modelo **más caro**. No hay “el mejor” absoluto: hay el mejor **para tu caso**.


- **¿Cuándo priorizar un modelo liviano y veloz?**

    **Respuesta:**

    En apps **en tiempo real** donde el usuario espera respuestas rápidas (chat interactivo, feedback inmediato).


- **¿Cuándo conviene un modelo más lento?**

    **Respuesta:**

    Cuando priorizás **calidad** de respuesta (análisis profundo, escritura cuidada) y el usuario tolera más latencia.


- **¿Qué son los proveedores y qué los diferencia?**

    **Respuesta:**

    Empresas como OpenAI, Google, Anthropic. Cada una **entrena** con enfoques distintos; por eso el mismo “tipo” de tarea puede sentirse distinto según el provider.
