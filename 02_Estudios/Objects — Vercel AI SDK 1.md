---
tags:
  - estudio
  - codigo
tema_iniciado: 2026-08-25
---
# Structured Object Streaming — Vercel AI SDK

  

Preguntas, respuestas y ejercicios de código para fijar [[Structured Output]] / streaming de objetos del [[02_Estudios/Vercel AI SDK]]: `Output.object`, `streamText`, schema Zod, `useObject`, y el contrato de **text stream** (no el de chat UI).

  

Relacionado: [[02_Estudios/Streaming]] (texto libre) · [[Chat]] (historial + UI message stream). Acá la salida es un **objeto tipado** que se va completando por partes.

  

> Curva del olvido del vault: días **1, 2, 7, 15, 31** desde `tema_iniciado`. Cada día de repaso tiene un ejercicio distinto (~60% reto: sin mirar la nota fuente al primer intento).

  

Docs de referencia: [Object generation](https://ai-sdk.dev/docs/ai-sdk-ui/object-generation) · [useObject](https://ai-sdk.dev/docs/reference/ai-sdk-ui/use-object) · [Generating structured data](https://ai-sdk.dev/docs/ai-sdk-core/generating-structured-data) · [Migration 6.0](https://ai-sdk.dev/docs/migration-guides/migration-guide-6-0)

  

---

  

## Flashcards

  

- **¿Para qué sirve stream de objeto en vez de texto libre o chat?**

  

    **Respuesta:**

  

    Cuando necesitás **datos con forma fija** (JSON tipado) para renderizar UI, guardar en DB o encadenar lógica — no un párrafo libre. El stream deja ver el objeto **parcial** mientras se genera (campos van apareciendo), sin esperar el JSON completo.

  

- **¿`streamObject` sigue siendo el API correcto?**

  

    **Respuesta:**

  

    **No.** Está **deprecado**. Se reemplaza por:

  

    ```ts

    streamText({

      model,

      prompt, // o messages

      output: Output.object({ schema }),

    })

    ```

  

    El par no-stream: `generateObject` → `generateText({ output: Output.object({ schema }) })`.

  

- **¿Qué piezas usa el patrón object streaming (server + client)?**

  

    **Respuesta:**

  

    **Server (`ai`):** `streamText`, `Output`, schema (Zod), y para el hook: `createTextStreamResponse` + `toTextStream`.  

    **Client (`@ai-sdk/react`):** `useObject({ api, schema })` → `{ object, submit, isLoading, error, stop, clear }`.

  

- **¿Qué te da `useObject` y cómo se conecta a la route?**

  

    **Respuesta:**

  

    ```ts

    const { object, submit } = useObject({

      api: "/api/structured-data",

      schema: afterReviewSchema,

    });

    ```

  

    `object` es el valor parcial/final tipado (o `undefined` al inicio). `submit(input)` hace POST a `api` con ese input como body JSON. El schema del cliente debe **alinearse** con el del server.

  

- **¿Cómo se dispara la generación desde el form?**

  

    **Respuesta:**

  

    ```ts

    submit(input); // o submit({ prompt: input }) según lo que lea tu route

    setInput("");

    ```

  

    No es `sendMessage` (`useChat`) ni `handleSubmit` de `useCompletion`. Es **`submit`** de `useObject`. El body que llega al `POST` es lo que pasaste a `submit`.

  

- **¿Por qué mientras stremea conviene escribir `object?.campo`?**

  

    **Respuesta:**

  

    Durante el stream, `object` es **`DeepPartial`**: campos y ítems de arrays pueden ser `undefined` hasta que el JSON parcial los complete. Optional chaining evita crashes en el render.

  

- **¿Qué hace `Output.object({ schema })` dentro de `streamText`?**

  

    **Respuesta:**

  

    Le dice al modelo/SDK que la salida debe **ajustarse al schema** (p. ej. Zod). Validás forma y tipos; en el result podés usar `partialOutputStream` (server) o, con el hook, el text stream que `useObject` parsea a `object`.

  

- **¿Para qué sirve `.describe()` en los campos Zod?**

  

    **Respuesta:**

  

    Guía al modelo sobre **qué significa cada campo** (mejor que solo el nombre). No reemplaza tipos; mejora calidad/consistencia del JSON generado.

  

- **¿Qué Response HTTP debe devolver la route para `useObject`?**

  

    **Respuesta:**

  

    Un **text stream** del objeto, p. ej.:

  

    ```ts

    return createTextStreamResponse({

      stream: toTextStream({ stream: result.stream }),

    });

    ```

  

    **No** el contrato de chat (`createUIMessageStreamResponse` + `toUIMessageStream`). Ese es para `useChat`. Mezclarlos es el bug más común al pasar de chat a object.

  

- **¿Qué body suele esperar el `POST` con `useObject`?**

  

    **Respuesta:**

  

    Lo que mandaste en `submit(...)`. Muy común: un **string** (contexto/prompt) o un objeto. En el route: `const prompt = await req.json()` (si mandaste string) o `const { prompt } = await req.json()` (si mandaste objeto). Tiene que **coincidir** client ↔ server.

  

- **¿Dónde vive el schema y por qué se importa en client y server?**

  

    **Respuesta:**

  

    Idealmente un archivo compartido (p. ej. `schema.ts`). **Server:** fuerza/valida la generación. **Client (`useObject`):** tipa y parsea el stream parcial. Misma forma = menos sorpresas.

  

- **¿Object streaming vs Chat vs Completion — cuándo cada uno?**

  

    **Respuesta:**

  

    - **Completion / [[02_Estudios/Streaming]]:** un texto libre (`prompt` → string).  

    - **[[Chat]]:** diálogo con historial (`messages` → UI stream).  

    - **Object:** una **estructura fija** (`schema` → objeto parcial/final). No es un hilo de mensajes; es “generame este JSON”.

  

- **¿Qué reemplaza a `partialObjectStream`?**

  

    **Respuesta:**

  

    Con `streamText` + `Output.object`: **`partialOutputStream`**. En el cliente con hook, no lo iterás a mano: `useObject` te expone **`object`** actualizado.

  

---

  

## Contraste rápido (para no mezclar temas)

  

| | [[02_Estudios/Streaming]] | [[Chat]] | [[Structured Output]] |

|---|---|---|---|

| Hook | `useCompletion` | `useChat` | `useObject` |

| Disparo | `handleSubmit` | `sendMessage` | `submit` |

| Estado UI | `completion` (string) | `messages[]` | `object` (parcial tipado) |

| Body típico | `{ prompt }` | `{ messages }` | lo que pases a `submit` (string u objeto) |

| Server core | `streamText({ prompt })` | `streamText({ messages })` | `streamText({ output: Output.object({ schema }) })` |

| Response HTTP | UI message stream (o text, según hook) | UI message stream | **Text stream** (`createTextStreamResponse` / `toTextStream`) |

| API deprecada | — | — | `streamObject` / `generateObject` |

  

---

  

## Ejercicios por día de repaso

  

### Día 1 — Reproducción guiada (scaffold server)

  

En `app/api/structured-data/route.ts`:

1. Schema Zod en `schema.ts` (3–4 campos con `.describe()`).

2. `POST`: leer el body que mandará `useObject`.

3. `streamText` + `Output.object({ schema })` + `prompt` (o contexto).

4. Devolver **`createTextStreamResponse` + `toTextStream`** (no UI message stream).

  

**Éxito (~60%):** la route stremea JSON/texto del objeto; no un JSON único “de golpe”; no usás `streamObject`.

  

---

  

### Día 2 — Variación: validar input + instructions

  

Partí del día 1.

1. Si no hay prompt/contexto → **HTTP 400**.

2. Agregá `instructions` (rol corto: coach, reviewer, etc.).

3. Asegurate de que el shape del body coincida con lo que manda `submit` en el client.

  

**Éxito:** sin input → 400; con input → objeto parcial coherente con el rol.

  

---

  

### Día 7 — Transferencia: cliente con `useObject`

  

Página `"use client"`:

- `useObject({ api: "/api/structured-data", schema })`

- Form: `submit(input)` + limpiar input

- Render: `object?.campo` / map de arrays con `?.`

- Anotá en 3 líneas: qué es `object`, qué hace `submit`, por qué no usás `messages` aquí

  

**Éxito:** al mandar, ves campos aparecer de a poco (parcial), no un spinner hasta el final con el objeto completo.

  

---

  

### Día 15 — Diagnóstico (contrato + deprecación)

  

1. Rompé a propósito: devolvé `createUIMessageStreamResponse` y observá qué falla con `useObject`.

2. Arreglá volviendo a text stream.

3. Forzá schema mismatch (client schema ≠ server) y anotá el síntoma.

4. Explicá oralmente: `streamObject` → `streamText` + `Output.object`.

  

**Éxito:** distinguís “mal contrato HTTP” vs “schema distinto” vs “API key/modelo”; oral de 60s sobre la deprecación.

  

---

  

### Día 31 — Mini-reto integrado

  

Flujo E2E: form → `useObject.submit` → route `streamText` + `Output.object` → text stream → UI con `object?.…`.

  

Extras:

- Deshabilitar submit con `isLoading`

- `onFinish` / `onError` con mensaje claro (sin secretos)

- Botón `stop` o `clear`

  

**Éxito:** funciona; explicás por qué object ≠ chat, por qué text stream ≠ UI message stream, y por qué `.describe()` / DeepPartial importan.

  

---

  

## Auto-chequeo oral (sin mirar)

  

1. ¿Qué hook y qué Response usás para objeto vs para chat?

2. ¿Qué ponés en `streamText` hoy en lugar de llamar `streamObject`?

3. ¿Por qué `object?.to_improve` y no `object.to_improve` a secas mientras stremea?

  

Si las tres salen fluidas → tema asentado; si no → repetí Día 7 + flashcard del contrato HTTP.