---
tags:
  - estudio
  - codigo
tema_iniciado: 2026-09-15
---
Preguntas, respuestas y ejercicios de código para fijar [[Chat]] del [[02_Estudios/Vercel AI SDK]]: `useChat`, `sendMessage`, `DefaultChatTransport`, `convertToModelMessages`, `UIMessage.parts` y el contrato UI del stream.

  
Relacionado: [[02_Estudios/Streaming]] (misma tubería de stream; distinto contrato de datos: `prompt` vs `messages`).

> Curva del olvido del vault: días **1, 2, 7, 15, 31** desde `tema_iniciado`. Cada día de repaso tiene un ejercicio distinto (~60% reto: sin mirar la nota fuente al primer intento).

  
Docs de referencia: [Chatbot](https://ai-sdk.dev/docs/ai-sdk-ui/chatbot) · [convertToModelMessages](https://ai-sdk.dev/docs/reference/ai-sdk-ui/convert-to-model-messages) · [Migration 5.0](https://ai-sdk.dev/docs/migration-guides/migration-guide-5-0)

---
  
## Flashcards

  

- **¿En qué se diferencia Chat de Completion/Streaming con un solo prompt?**

  

    **Respuesta:**

  

    Completion manda un **`prompt`** (un turno). Chat manda un array de **`messages`** (historial user + assistant). El modelo **no guarda memoria** entre requests: sin historial, “¿y en Python?” no tiene contexto.

  

- **¿Qué piezas del AI SDK usa el patrón chat (server + client)?**

  

    **Respuesta:**

  

    **Server (`ai`):** `streamText`, `convertToModelMessages`, `toUIMessageStream`, `createUIMessageStreamResponse`.  

    **Client (`@ai-sdk/react` + `ai`):** `useChat`, `DefaultChatTransport`, `sendMessage`, render de `messages[].parts`.

  

- **¿Qué te da `useChat` y cómo se conecta a la route?**

  

    **Respuesta:**

  

    Al menos `{ messages, sendMessage }` (y a menudo `status`). Lo conectás con:

  

    ```ts

    useChat({

      transport: new DefaultChatTransport({

        api: "/api/practice_chat_v1",

      }),

    });

    ```

  

    `messages` es el historial en UI; `sendMessage` añade el turno user y dispara el POST.

Que es un transport 

- **¿Por qué el input ya no viene del hook (`input` / `handleInputChange`)?**

  

    **Respuesta:**

  

    En el AI SDK moderno, **`useChat` no gestiona el input**. Vos tenés `useState` para el textarea y en el submit llamás `sendMessage` + `setInput("")`. El hook se ocupa del **historial y del stream**, no del campo del formulario.

  

- **¿Cómo queda el submit del form con `sendMessage`?**

  

    **Respuesta:**

  

    ```ts
  const [input, setInput] = useState("");
    const handleSubmit = (e: React.FormEvent) => {

      e.preventDefault();

      if (!input.trim()) return;

      sendMessage({ text: input }); // atajo ≈ parts: [{ type: "text", text: input }]

      setInput("");

    };

    ```

  

    `preventDefault` evita reload; `sendMessage` habla con el transport; limpiar `input` no borra `messages`.

  const sumbit =  (event :evetn) => {
	const message = event?.target?.value		//Tipó de message

  if meesage  
   sendMessage({text: |message})
   }
 
- **¿Qué es un `UIMessage` y por qué usa `parts` en vez de `content`?**

  

    **Respuesta:**

  

    Mensaje pensado para la **UI**. `parts` es un array de piezas (`text`, tools, files, …) para mensajes compuestos. Antes (v4) había `content: string`; ahora renderizás filtrando `part.type === "text"` y usando `part.text`.

  

- **¿Por qué TypeScript obliga a `part.type === "text"` antes de `part.text`?**

  

    **Respuesta:**

  

    `parts` es una **unión discriminada**. No todos los parts tienen `.text`. El literal `type` **estrecha** el tipo; sin el check, acceder a `.text` sería inseguro.

  

- **¿Qué hace `convertToModelMessages` y por qué es obligatorio en el route de chat?**

  

    **Respuesta:**

  

    Traduce `UIMessage[]` (con `parts`) → `ModelMessage[]` que entiende `streamText`. El cliente habla en formato UI; el modelo habla en formato modelo. Sin esa conversión, el historial no entra bien al LLM.

  

- **¿Qué parámetros mínimos pasás a `streamText` en un chat (vs completion)?**

  

    **Respuesta:**

  

    `model` + **`messages: await convertToModelMessages(messages)`**.  

    En completion/streaming de un turno: `model` + **`prompt`**.

  

- **¿Para qué sirven `toUIMessageStream` y `createUIMessageStreamResponse` en chat?**

  

    **Respuesta:**

  

    Igual que en [[02_Estudios/Streaming]]: traducen el stream del modelo al **contrato UI** que el hook parsea, y lo envuelven en una **Response HTTP**. `useChat` espera ese protocolo; un JSON único con el texto final no actualiza el chat token a token.

  

- **¿Dónde vive `streamText` / la API key y por qué?**

  

    **Respuesta:**

  

    En un **Route Handler `POST`** (server). La key no sale al browser. El cliente solo llama a la route vía `DefaultChatTransport` / `useChat`.

  

- **¿Qué body espera el `POST` de chat por defecto?**

  

    **Respuesta:**

  

    JSON con **`{ messages }`** (historial `UIMessage[]`), no `{ prompt }`. Se lee con `await req.json()`.

  

- **¿Qué pasa si el back solo recibe el último mensaje y no el historial?**

  

    **Respuesta:**

  

    Cada request es amnésica: el modelo no “recuerda” turnos previos. Frases como “explicámelo más corto” fallan porque no hay contexto previo en `messages`.

  # Mensajes, memoria y modelos stateless — Vercel AI SDK

  

Preguntas, respuestas y ejercicios para fijar **cómo se “arma” la memoria** en chats con [[02_Estudios/Modelos AI y proveedores]]: por qué el modelo “olvida”, qué es `stateless`, el array de `messages`, `role` / `parts`, `UIMessage` vs formato del modelo, y el **context window**.

  

Relacionado: [[02_Estudios/Streaming]] (un turno, un `prompt`) · [[Chat]] (mismo cable de stream, pero con historial) · [[02_Estudios/Vercel AI SDK]].

  

> Curva del olvido del vault: días **1, 2, 7, 15, 31** desde `tema_iniciado`. Cada día de repaso tiene un ejercicio distinto (~60% reto: sin mirar la nota fuente al primer intento).

  

Docs: [Chatbot](https://ai-sdk.dev/docs/ai-sdk-ui/chatbot) · [UIMessage](https://ai-sdk.dev/docs/reference/ai-sdk-core/ui-message) · [convertToModelMessages](https://ai-sdk.dev/docs/reference/ai-sdk-ui/convert-to-model-messages)

  

---

  

## Flashcards (maquinaria > sintaxis)

  

- **¿Por qué en el 2º turno el modelo “no sabe” cómo te llamás si en el 1º dijiste “Soy Miguel”?**

  

    **Respuesta:**

  

    Porque el modelo es **stateless**: cada request es un mundo nuevo. No hay sesión mágica en el LLM. Si el 2º POST solo manda *“¿cómo me llamo?”* sin el historial, para el modelo esa es la **única** información del universo.

  

- **Si el modelo no tiene memoria, ¿quién “recuerda” la conversación en una app con Vercel AI SDK?**

  

    **Respuesta:**

  

    **Tu aplicación** (casi siempre el cliente con `useChat` / estado, o una DB/servidor si persistís). El historial se **reenvía** en cada llamada. El SDK facilita el formato y el transporte; **no inventa memoria dentro del provider**.

  

- **Analogía rápida: ¿chat con LLM es más parecido a un compañero que te conoce o a un examen a libro abierto?**

  

    **Respuesta:**

  

    **Examen a libro abierto**: cada vez le entregás el “libro” (el array `messages`). Si omitís páginas, no puede “acordarse”. Streaming solo cambia *cómo llega la tinta*; no cambia que el libro hay que mandarlo entero otra vez.

  

- **¿Qué problema resuelve el array de `messages` frente a un solo `prompt` string?**

  

    **Respuesta:**

  

    Codifica **quién dijo qué y en qué orden** (`role` + contenido). Un string plano pierde turnos, roles y (más adelante) tools/multimodal. El array es el **contexto conversacional** que el modelo necesita para continuar con coherencia.

  

- **¿Qué significa `role: "user" | "assistant" | "system"` en la práctica del modelo?**

  

    **Respuesta:**

  

    - **`user`**: lo que aportó el humano (preguntas, datos).  

    - **`assistant`**: lo que ya “dijo” el modelo (para no contradecirse y seguir el hilo).  

    - **`system`**: instrucciones de comportamiento / políticas (voz, límites, formato), no un turno de chat típico en la UI.  

    El modelo usa esos roles como **señales de autoridad y procedencia**, no como decoración.

  

- **¿Por qué la UI del SDK usa `parts` y el formato “de modelo” suele verse con `content`?**

  

    **Respuesta:**

  

    Son **dos capas**:  

    - **UI (`UIMessage`)**: enriquecida para React — `id`, `parts` (texto, archivos, tools…).  

    - **Modelo (`ModelMessage`)**: lo que el provider entiende — a menudo `content` (texto o lista de partes compatibles).  

    `convertToModelMessages` es el **adaptador** entre capas. Sin él, mandás estructura de UI a un motor que espera estructura de modelo.

  

- **¿Por qué `parts` y no un solo string `content` en la UI?**

  

    **Respuesta:**

  

    Un mensaje real no siempre es “solo texto”: puede mezclar texto + imagen + resultado de tool. `parts[]` con `type` permite **composición** y narrowing en TypeScript (`part.type === "text"` → `part.text`). Es el mismo motivo por el que un email no es solo un string: tiene adjuntos.

  

- **En el ejemplo Miguel / lirios / “¿cómo me llamo?”, ¿qué debe ir en el 2º request para que acierte?**

  

    **Respuesta:**

  

    Como mínimo el historial previo + el nuevo user message, p. ej. los dos turnos anteriores (user + assistant) **y** el nuevo `"Genial, ¿cómo me llamo?"`. Si recortás el primer user message, el nombre “Miguel” **no existe** para el modelo en esa generación.

  

- **¿El streaming hace que el modelo recuerde mejor entre mensajes?**

  

    **Respuesta:**

  

    **No.** Streaming solo entrega tokens **mientras se generan**. La memoria entre turnos depende de **reenviar `messages`**, no de streamear. Podés streamear y seguir siendo amnésico si el body no trae historial.

  

- **¿Qué es el context window y qué pasa cuando la conversación lo llena?**

  

    **Respuesta:**

  

    Es el **presupuesto de tokens** (entrada + a menudo salida según el proveedor/modelo) que el modelo puede considerar de una vez. Si el historial crece de más: truncás, resumís, o falla/se degrada la calidad. “Más context window” ≠ memoria infinita; es **más capacidad por request**.

  

- **Si mandás 200 mensajes de historial en cada click, ¿qué costos/riesgos hay aunque “funcione”?**

  

    **Respuesta:**

  

    Más **tokens de entrada** → más costo y latencia; más cerca del **límite del context window**; más ruido (el modelo puede “perderse” en detalles viejos). Por eso en prod aparecen estrategias: ventana deslizante, resumen, memoria externa (RAG/DB), no “mandar todo siempre”.

  

- **¿Dónde “vive” el historial entre dos requests HTTP en el patrón típico `useChat` + route?**

  

    **Respuesta:**

  

    En el **estado del cliente** (`messages` del hook) mientras no recargues / no persistás. El server route suele ser **stateless** también: recibe `messages`, llama al modelo, stremea, y listo. Si cerrás la pestaña, sin DB se pierde — igual que el modelo, tu server no “guarda” la charla por magia.

  

- **¿Por qué el assistant anterior debe ir en el historial y no solo los mensajes del user?**

  

    **Respuesta:**

  

    Porque el siguiente turno a menudo depende de **lo que el modelo ya afirmó** (“dijiste que haga X…”). Sin las respuestas assistant, el modelo no ve su propio compromiso previo y puede contradecirse o reinventar pasos.

  

- **¿Quién decide el `id` de un `UIMessage` y para qué sirve?**

  

    **Respuesta:**

  

    Lo asigna el stack de UI/SDK al crear mensajes. Sirve para **React keys**, actualizar el mensaje que está streameando, y correlacionar partes. El modelo en sí no “piensa” en esos ids como memoria; son de **aplicación**.

  

- **Pensá en capas: ¿qué viaja en el cable HTTP vs qué “entiende” Gemini/OpenAI?**

  

    **Respuesta:**

  

    **HTTP (tu app):** JSON con `UIMessage[]` (`role` + `parts` + `id`).  

    **Tras `convertToModelMessages`:** `ModelMessage[]` listos para `streamText`.  

    **Provider:** tokens derivados de ese historial + system/instructions.  

    Si algo falla “de memoria”, casi siempre es: historial incompleto, conversión mal hecha, o te pasaste del context window — no que “Gemini se olvidó solo”.

  

- **¿System prompt / `instructions` reemplazan al historial de user/assistant?**

  

    **Respuesta:**

  

    **No.** El system fija **reglas de juego**. El historial fija **hechos de esta conversación** (nombre, tema, decisiones). Sin historial, el system no sabe que te llamás Miguel; sin system, el historial no impone el tono/rol que querías.

  

---

  

## Contraste rápido

  

| Idea | Un solo `prompt` ([[02_Estudios/Streaming]]) | Historial `messages` (este tema / [[Chat]]) |

|---|---|---|

| Unidad de contexto | Un string | Secuencia de turnos con `role` |

| “Memoria” entre clicks | Ninguna, salvo que vos la metas en el prompt | La que **reinyectás** en el array |

| Formato UI SDK | N/A o completion string | `UIMessage` + `parts` |

| Formato modelo | `prompt` o messages simples | `ModelMessage` (`content`, …) vía conversión |

| Límite duro | Largo del prompt | **Context window** del modelo |

  

---

  

## Ejercicios por día de repaso

  

### Día 1 — Reproducción del fallo (entender el síntoma)

  

Sin mirar la nota: escribí en papel el JSON del **2º request** en dos versiones:

  

1. Solo el último mensaje user (“¿cómo me llamo?”).  

2. Historial completo (Miguel + respuesta lirios + nueva pregunta).

  

Predicí qué responde el modelo en cada caso. Luego probalo en tu route.

  

**Éxito:** podés explicar el olvido **sin** decir “porque es IA”; decís “porque el contexto no viajó”.

  

---

  

### Día 2 — Quién guarda qué

  

Dibujá 3 cajas: **Browser (`useChat`)**, **Route POST**, **Provider**. Flechas: qué datos salen de cada una en el turno 1 y en el turno 2. Marcá con ❌ dónde **no** hay persistencia por defecto.

  

**Éxito:** señalás que tanto modelo como route suelen ser stateless; la “memoria” está en el array que reenvía el cliente (o en una DB si la agregás).

  

---

  

### Día 7 — UIMessage vs ModelMessage (transferencia)

  

1. Tomá un `UIMessage` con `parts: [{ type: "text", text: "..." }]`.  

2. Escribí a mano cómo se vería tras pensar en formato modelo (`role` + `content`).  

3. En código: usá `convertToModelMessages` y logueá (dev) la diferencia.

  

**Éxito:** explicás *por qué* existe el convertidor (dos consumidores: UI vs LLM), no solo *que* hay que llamarlo.

  

---

  

### Día 15 — Context window (diagnóstico mental)

  

Inventá una charla de 50 turnos. Respondé:

  

1. ¿Qué romperías primero si mandás todo siempre? (costo, latencia, límite, calidad)  

2. Proponé **una** estrategia de recorte (últimos N turns / resumen / borrar system viejo) y su tradeoff.  

3. ¿Streaming mitiga el context window? (respuesta esperada: no)

  

**Éxito:** hablás de tokens y presupuesto, no de “la IA se cansa”.

  

---

  

### Día 31 — Mini-reto oral + código

  

Implementá o revisá un chat mínimo donde:

  

- Turno 1: el user dice su nombre.  

- Turno 2: pregunta el nombre.  

- Debe acertar **solo** porque el historial viaja.

  

Extras: un `system`/`instructions` de rol; un caso donde **borrás** a propósito el primer mensaje y demostrás el fallo.

  

**Éxito (2 min oral):** stateless → historial reenviado → roles → parts/UI vs content/modelo → context window como techo.

  

---

  

## Auto-chequeo oral (sin mirar)

  

1. ¿El modelo “guarda” algo entre requests HTTP? ¿Quién sí?  

2. ¿Por qué el assistant anterior tiene que viajar en el array?  

3. ¿`parts` es un capricho de React o un modelo de datos multimodal?  

4. ¿Qué falla primero en una charla eterna: la “memoria del modelo” o el context window / tu estrategia de historial?

  

Si las cuatro salen fluidas → el tema de **cómo se construye la memoria** está asentado; después volvé a [[Chat]] solo para el cable `useChat` / stream UI.

---

  

## Contraste rápido (para no mezclar temas)

  

| | [[02_Estudios/Streaming]] / completion | [[Chat]] |

|---|---|---|

| Hook | `useCompletion` | `useChat` |

| Body | `{ prompt }` | `{ messages }` |

| Estado UI | `completion` (string) | `messages` (array) |

| Envío | `handleSubmit` del hook | `sendMessage` + input propio |

| Server | `streamText({ prompt })` | `streamText({ messages: convert… })` |

| Respuesta HTTP | UI message stream | UI message stream (mismo cable) |

  

---

  

## Ejercicios por día de repaso

  

### Día 1 — Reproducción guiada (scaffold server)

  

En `app/api/practice_chat_v1/route.ts` (o `/api/chat`), implementá un `POST` que:

1. Importe `streamText`, `convertToModelMessages`, `toUIMessageStream`, `createUIMessageStreamResponse` y el provider.

2. Lea `{ messages }` con `await req.json()`.

3. Llame `streamText({ model, messages: await convertToModelMessages(messages) })`.

4. Devuelva `createUIMessageStreamResponse` con `toUIMessageStream`.

  

**Éxito (~60%):** el route stremea historial (no un JSON único; no usa `prompt`) sin mirar la nota más de una vez.

  

---

  

### Día 2 — Variación: validar messages + system

  

Partí del día 1.

1. Si `messages` no es un array o está vacío → **HTTP 400**.

2. Si es válido → stream igual, pero agregá un `system` corto (ej. “Respuestas en español, ≤3 oraciones”).

  

**Éxito:** body inválido → 400; body ok → stream con tono del system. El cliente puede mandar varios turnos.

  

---

  

### Día 7 — Transferencia: cliente con `useChat`

  

Conectá un form con:

- `useState` para `input`

- `useChat` + `DefaultChatTransport({ api: "/api/..." })`

- `sendMessage({ text: input })` en el submit

- Lista de `messages` renderizando solo `part.type === "text"`

  

Anotá en 3 líneas: qué hace `messages`, qué hace `sendMessage`, por qué el `key={message.id}`.

  

**Éxito:** escribís dos mensajes seguidos y el segundo tiene contexto del primero; el assistant aparece **de a poco**.

  

---

  

### Día 15 — Diagnóstico (errores + narrowing)

  

1. Forzá 2 fallos (API key ausente / modelo inválido). Completá el `catch`: log server + respuesta de error **sin** filtrar secretos.

2. En el cliente, mostrá algo cuando `status` no es `'ready'` (deshabilitar submit).

3. Escribí (sin código) por qué `part.text` sin check de `type` falla en TypeScript.

  

**Éxito:** distinguís fallo antes de streamear vs corte a mitad; el narrowing te sale oralmente en 30s.

  

---

  

### Día 31 — Mini-reto integrado

  

Flujo mínimo end-to-end:

`form → useChat/sendMessage → POST messages → convertToModelMessages → streamText → UI stream → messages[].parts`

  

Extras:

- Alinear user a la derecha / assistant a la izquierda.

- Deshabilitar submit mientras `status !== 'ready'`.

- Prompt de rol en `system`.

  

**Éxito:** funciona; explicás oralmente (2 min): chat vs completion, por qué `parts`, por qué `convertToModelMessages`, por qué la key vive en el server, qué traduce `toUIMessageStream`.

  

---

  

## Auto-chequeo oral (sin mirar)

  

Respondé en voz alta:

  

1. ¿Qué mandaría el cliente si usara `useCompletion` por error contra tu route de chat?

2. ¿Dónde se pierde el contexto si olvidás `convertToModelMessages` o mandás solo el último mensaje?

3. ¿Qué pieza es compartida con [[02_Estudios/Streaming]] y cuál es exclusiva de [[Chat]]?

  

Si las tres salen fluidas → tema asentado; si no → repetí Día 7 + flashcards de `parts` / `convertToModelMessages`.