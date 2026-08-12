---
tags:
  - estudio
  - codigo
tema_iniciado: 2026-07-27
---
Preguntas, respuestas y ejercicios de código para fijar [[GenerateText]] del [[Vercel AI SDK]]: `generateText`, provider y route API.

> Curva del olvido del vault: días **1, 2, 7, 15, 31** desde `tema_iniciado`. Cada día de repaso tiene un ejercicio distinto (~60% reto: sin mirar la nota fuente al primer intento).


## Flashcards

- **¿Qué necesitás para generar texto con un prompt usando el AI SDK?**

    **Respuesta:**

    1. Un **SDK/provider del modelo** (o el router de Vercel).
    2. La función `generateText` del paquete `ai`.


- **¿Qué hace `generateText`?**

    **Respuesta:**

    Llama al LLM, **espera la respuesta completa** y te devuelve el texto ya estructurado (se encarga de hablar con el provider). Ideal para automatización / agentes no interactivos; para chat en vivo suele preferirse `streamText`.


- **¿Cómo se importa el provider de Google y `generateText`?**

    **Respuesta:**

    ```js
    import { google } from "@ai-sdk/google";
    import { generateText } from "ai";
    ```


- **¿Dónde suele vivir la llamada a `generateText` en una app Next.js y por qué?**

    **Respuesta:**

    En una **Route Handler** (`POST`), del lado del servidor. Así la API key no se expone al cliente; el cliente solo hace `fetch`/`axios` a esa route.


- **¿Qué desestructurás del resultado de `generateText` en el ejemplo básico?**

    **Respuesta:**

    `{ text }` — el string generado por el modelo.


- **¿Qué parámetros mínimos pasás a `generateText` en el ejemplo de la nota?**

    **Respuesta:**

    `model` (p. ej. `google("gemini-...")`) y `prompt` (el texto de instrucción).


## Ejercicios por día de repaso

### Día 1 — Reproducción guiada (scaffold)

Sin copiar-pegar ciego: en un `app/api/.../route.ts`, implementá un `POST` que:
1. Importe `google` y `generateText`.
2. Llame al modelo con un prompt fijo corto.
3. Devuelva `Response.json({ text })` y maneje `try/catch` devolviendo `{ error }`.

**Éxito (~60%):** el route responde JSON con `text` sin mirar la nota más de una vez.

### Día 2 — Variación: prompt desde el body

Partí del día 1 y cambiá el prompt fijo por el body:
```js
const { prompt } = await request.json();
```
Validá que `prompt` exista; si no, respondé `400`.

**Éxito:** el cliente puede mandar distintos prompts y recibir texto distinto.

### Día 7 — Transferencia: otro provider / mismo contrato

Reescribí el mismo route cambiando **solo** el provider (p. ej. OpenAI u otro que ya uses) manteniendo la misma forma `{ text }`. Anotá en 2 líneas qué import y qué `model(...)` cambió.

**Éxito:** mismo contrato HTTP, otro backend de modelo, sin romper el cliente.

### Día 15 — Diagnóstico (errores reales)

Forzá a propósito 2 fallos (API key ausente / modelo inválido) y mejorá el `catch` para devolver un mensaje útil al cliente **sin** filtrar secretos. Agregá un log server-side mínimo.

**Éxito:** distinguís fallo de config vs fallo de request; el cliente ve error claro.

### Día 31 — Mini-reto integrado

Armá un flujo mínimo: botón/cliente → `fetch` POST → muestra el `text` en UI. Prompt: rol + instrucción corta (como el ejemplo de “experto negociante”). Opcional: deshabilitar el botón mientras espera.

**Éxito:** end-to-end funciona; podés explicar oralmente Core vs dónde vive la key vs qué hace `generateText`.
