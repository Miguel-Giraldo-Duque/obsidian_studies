---
tags:
  - estudio
tema_iniciado: 2026-07-27
---
Preguntas y respuestas para fijar los conceptos de [[02_Estudios/Vercel AI SDK]]: qué es la librería y cómo se parten sus capas (Core, UI, RSC).


- **¿Qué es el Vercel AI SDK?**

    **Respuesta:**

    Es una **librería** para trabajar con herramientas de AI de forma fácil, integrando de antemano muchas funcionalidades complejas (providers, generación, tools, UI, etc.).


- **¿Qué cubre AI SDK Core (Vercel AI Core)?**

    **Respuesta:**

    La capa de **lógica AI**: tools, generación de texto, RAG e incluso agentes. Ahí viven funciones como `generateText` y `streamText`.


- **¿Para qué sirve AI SDK UI?**

    **Respuesta:**

    Para crear **hooks** y construir **chats** y **UI generativa** en el cliente (experiencia interactiva sobre la capa Core).


- **¿En qué se especializa AI SDK RSC?**

    **Respuesta:**

    En **Server Components**: Generative UI del lado del servidor (p. ej. `streamUI` y estado AI/UI en el server).


- **¿Cómo se relacionan Core, UI y RSC?**

    **Respuesta:**

    **Core** habla con el modelo; **UI** consume esa capacidad en el cliente con hooks/chats; **RSC** hace lo equivalente anclado en Server Components. Misma familia, distinto lugar de la app.


- **¿Por qué usar el SDK en lugar de llamar al provider a mano?**

    **Respuesta:**

    Porque el SDK **unifica** providers, maneja request/respuesta y estructura el resultado, sin que vos configures cada API a mano.
