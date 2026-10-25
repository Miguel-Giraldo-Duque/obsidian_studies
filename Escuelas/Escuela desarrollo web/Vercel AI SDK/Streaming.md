### ¿Cómo se hace?

Se hace porque queremos **prevenir que el usuario tenga que esperar muchos minutos** para ver su respuesta completa. En realidad queremos **empezar a enviar respuestas** mientras el backend se encarga de generarlas.

En [[Escuelas/Escuela desarrollo web/Vercel AI SDK/Vercel AI SDK|Vercel AI SDK]] podemos usar el módulo de **stream** y `useCompletion` para obtener las respuestas del backend y manejar la renderización.

```js
import {
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
} from "ai";

import { google } from "@ai-sdk/google";

export async function POST(req: Request) {
  // 1. Recibe the request
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return { message: "No prompt sended" };
    }
    const result = streamText({
      model: google("gemini-3.1-flash-lite"),
      prompt,
    });

    // Creamos la response que el hook entenderá en su formato y traducirá a su contrato.
    return createUIMessageStreamResponse({
      stream: toUIMessageStream({ stream: result.stream }),
    });
  } catch (error) {
    console.error(error);
  }
}
```

```js
// Completion: acá llegan las respuestas con el texto ya disponible.
// El hook pega a la API local de Next.js y maneja el resto.
const { completion, handleInputChange, input, handleSubmit } = useCompletion({
  api: "api/streaming",
});
```
