---
tags:
  - estudio
  - codigo
tema_iniciado: 2026-08-14
---
Preguntas, respuestas y ejercicios de código para fijar [[02_Estudios/Streaming]] del [[02_Estudios/Vercel AI SDK]]: `streamText`, el contrato UI del stream y `useCompletion`.

> Curva del olvido del vault: días **1, 2, 7, 15, 31** desde `tema_iniciado`. Cada día de repaso tiene un ejercicio distinto (~60% reto: sin mirar la nota fuente al primer intento).


## Flashcards

- **¿Para qué sirve el streaming en vez de esperar el texto completo?** -

    **Respuesta:**

    Para **no hacer esperar** al usuario hasta que el modelo termine. Se **empieza a enviar** trozos de respuesta mientras el backend sigue generando.
Como el browser con la simagenes.

- **¿Qué piezas del AI SDK usa la nota para stream + UI?**

    **Respuesta:**

    En el server: `streamText`, `toUIMessageStream` y `createUIMessageStreamResponse` (paquete `ai`). En el cliente: el hook `useCompletion` para obtener el texto y renderizarlo.


- **¿Qué hace `streamText` frente a `generateText`?**

    **Respuesta:**

    `generateText` **espera el texto completo**. `streamText` **emite un stream** mientras el modelo genera. Para chat/UI en vivo conviene stream; para un job que necesita el resultado entero, generate.


- **¿Qué parámetros mínimos pasás a `streamText` en el ejemplo?**-

    **Respuesta:**

    `model` (p. ej. `google("gemini-...")`) y `prompt` (viene del body de la request).


- **¿Para qué sirven `toUIMessageStream` y `createUIMessageStreamResponse`?**

    **Respuesta:**

    Traducen el stream del modelo al **formato/contrato que el hook entiende** y lo envuelven en una **Response** HTTP que el cliente puede consumir.


- **¿Qué te da `useCompletion` y cómo se conecta a la route?**

    **Respuesta:**

    `{ completion, handleInputChange, input, handleSubmit }`. Lo apuntás a la API local, p. ej. `api: "api/streaming"`. `completion` es el texto que va llegando; el hook maneja el resto del request.


- **¿Dónde vive `streamText` y por qué?**

    **Respuesta:**

    En un **Route Handler `POST`** (server). La API key no sale al cliente; el cliente solo usa el hook contra esa route.


## Ejercicios por día de repaso

### Día 1 — Reproducción guiada (scaffold)

En un `app/api/streaming/route.ts`, implementá un `POST` que:
1. Importe `streamText`, `toUIMessageStream`, `createUIMessageStreamResponse` y el provider.
2. Lea `{ prompt }` del body.
3. Llame a `streamText` y devuelva `createUIMessageStreamResponse` con `toUIMessageStream`.

**Éxito (~60%):** el route stremea (no un JSON único con todo el texto) sin mirar la nota más de una vez.*

### Día 2 — Variación: validar el prompt

Partí del día 1. Si no hay `prompt`, respondé **HTTP 400** (no un objeto suelto). Si hay prompt, el stream sigue igual.

**Éxito:** sin prompt → 400; con prompt → stream. El cliente puede mandar textos distintos.

### Día 7 — Transferencia: cliente con `useCompletion`

Conectá un input + submit con `useCompletion({ api: "api/streaming" })` y mostrá `completion` en pantalla. Anotá en 2 líneas qué campos del hook usás y qué hace cada uno.

**Éxito:** tipeás, mandás, y ves el texto **aparecer de a poco** (no un spinner hasta el final).

### Día 15 — Diagnóstico (errores reales)

Forzá 2 fallos (API key ausente / modelo inválido). Completá el `catch`: log server-side + respuesta de error **sin** filtrar secretos. Compará qué ve el usuario si el stream se corta a mitad vs si falla antes de empezar.

**Éxito:** distinguís fallo de config vs fallo a mitad de stream; el cliente ve un error claro.

### Día 31 — Mini-reto integrado

Flujo mínimo: form → `useCompletion` → route con `streamText` → UI que muestra `completion`. Prompt de rol corto. Extra: deshabilitar submit mientras stremea.

**Éxito:** end-to-end funciona; podés explicar oralmente por qué stream vs `generateText`, qué traduce `toUIMessageStream`, y dónde vive la key.
