### ¿Cómo funciona?

Si queremos generar un texto basado en un prompt necesitamos un SDK del modelo que queremos (o usar el router de Vercel), luego la función de la librería `ai` de Vercel.

Del lado del cliente:

```js
// El SDK nos permite conectar con la API de Google sin problema con la API key,
// sin que nosotros manualmente tengamos que hacer la request y configuración.

import { google } from "@ai-sdk/google";
// Llama al LLM, espera la respuesta completa y dame el texto
// (se encarga de comunicarse con el provider, esperar la respuesta
// y finalmente devolverla estructurada).
import { generateText } from "ai";

// Lo exponemos como route al cliente para que el cliente pueda hacer
// la request con fetch o axios desde un componente tipo cliente.
export async function POST() {
  try {
    const { text } = await generateText({
      model: google("gemini-3.1-flash-lite"),
      prompt:
        "Actúa como experto negociante y lanza un reto a mi marco en la conversación, corto y sucinto. Ejemplo: (¿por qué hiciste eso?, ¿quién te crees?, qué baja está la vara últimamente)",
    });
    return Response.json({ text });
  } catch (error) {
    console.log(error);
    return Response.json({ error });
  }
}
```
