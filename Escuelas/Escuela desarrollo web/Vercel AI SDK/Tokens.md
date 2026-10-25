### ¿Qué son?

Un **token** es la unidad mínima en la que el modelo “parte” el texto (no siempre una palabra completa: a veces es una palabra, un trozo, puntuación o espacio). El **tokenizer** del modelo convierte tu texto en una secuencia de tokens; con eso calcula, predice el siguiente token y mide cuánto contexto cabe.

Ejemplo aproximado (la partición real depende del tokenizer del modelo):

```text
"Vivo en Colombia"
→ ["Vivo", " en", " Colombia"]   // 3 tokens (ilustrativo)
```

Regla práctica (inglés): ~1 token ≈ 4 caracteres ≈ ¾ de palabra. En español suele variar un poco.

### Context window vs tokens

El [[Escuelas/Escuela desarrollo web/Vercel AI SDK/Modelos AI y proveedores|context window]] es el **máximo de tokens** que el modelo puede manejar de una vez (suele contar **input + output** juntos, según el provider).

Si superás ese límite:
- La API suele **rechazar** la request (`context length exceeded`), **o**
- Tu app debe **recortar / resumir / olvidar** mensajes viejos para hacer lugar a los nuevos.

### Tokens de input y de output

Cada modelo/provider publica una **tarifa** (precio) y un **límite** de contexto:

- **Tokens de input (prompt):** lo que enviás (system, user, historial, tools). Precio por token de entrada.
- **Tokens de output (completion):** lo que genera el modelo. Suele costar **más** por token que el input.

Más tokens = más costo y, a menudo, más latencia. Por eso modelos “baratos/rápidos” y “caros/inteligentes” se eligen según el caso (ver [[Escuelas/Escuela desarrollo web/Vercel AI SDK/Modelos AI y proveedores]]).
