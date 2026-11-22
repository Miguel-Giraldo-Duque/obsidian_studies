---
tags:
  - estudio
prioridad: critica
tema_iniciado: 2026-11-22
etapa_repaso: 0
ultimo_repaso:
proximo_repaso: 2026-11-23
fuente: "[[Escuelas/Escuela de AI/Embeddings]]"
---
Práctica de [[Escuelas/Escuela de AI/Embeddings|Embeddings]] (Escuela de AI, prioridad critica). Generada el 2026-11-22 tras el cambio a práctica/evaluación sin Cornell. Contraste con [Gemini API · Embeddings](https://ai.google.dev/gemini-api/docs/embeddings) (consultada 2026-11-22).

## Preguntas

- **1. ¿Qué es un embedding, en una frase?**
    - **Respuesta:** Tu nota dice: un conjunto de vectores que representan una posición en un espacio de múltiples dimensiones. La fuente dice: una representación numérica que captura significado semántico (búsqueda, clasificación, clustering, RAG). Corrección: suele ser UN vector por texto/ítem, no un "conjunto" suelto.
    - **Puntos clave:** vector numérico · significado · un vector por ítem

- **2. ¿Para qué se usan los embeddings en sistemas de AI?**
    - **Respuesta:** Tu nota dice: predicciones, recomendar y responder con conocimiento. La fuente dice: búsqueda semántica, clasificación, clustering y pieza clave de RAG.
    - **Puntos clave:** búsqueda semántica · clasificación/clustering · RAG

- **3. Si dos textos quedan cerca en el espacio de embeddings, ¿qué implica?**
    - **Respuesta:** Tu nota dice: más cerca = más relacionados. La fuente dice: la similitud (p. ej. coseno) mide cercanía de significado; valor alto = más parecido.
    - **Puntos clave:** cercanía = significado parecido · similitud coseno

- **4. Con el ejemplo rey/hombre/mujer: ¿qué operación ilustra y qué busca mostrar?**
    - **Respuesta:** Rey − Hombre + Mujer ≈ cerca de "reina". Muestra suma/resta de contextos en el espacio vectorial (analogía clásica de word2vec; no hace falta memorizar los números de la nota).
    - **Puntos clave:** resta/suma de contextos · rey−hombre+mujer≈reina · operaciones vectoriales

- **5. Tu nota compara embeddings con un render 3D tipo Three.js. ¿Qué hay que corregir?**
    - **Respuesta:** Tu nota dice: normalmente en 3D. La fuente dice: vectores de alta dimensión (cientos/miles). Corrección: el 3D es solo visualización didáctica.
    - **Puntos clave:** alta dimensión · 3D = visualización

- **6. En un flujo RAG básico, ¿dónde entran los embeddings?**
    - **Respuesta:** Los documentos se trocean (chunking), se embeddean y se indexan; el query también se embeddea; se recuperan los chunks más similares y van como contexto al LLM ([Gemini File Search](https://ai.google.dev/gemini-api/docs/file-search)).
    - **Puntos clave:** chunk + embed docs · embed query · retrieve por similitud · contexto al LLM
