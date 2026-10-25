---
tags:
  - estudio
tema_iniciado: 2026-08-16
---
Preguntas y respuestas para fijar los conceptos de [[02_Estudios/Tokens]]: qué es un token, tokenizer, context window, input vs output y costo.


- **¿Qué es un token?** - 

    **Respuesta:**

    La **unidad mínima** en la que el modelo parte el texto. No siempre es una palabra completa: puede ser palabra, trozo, puntuación o espacio.



- **¿Qué hace el tokenizer?** -

    **Respuesta:**

    Convierte tu texto en una **secuencia de tokens**. Con eso el modelo calcula, predice el siguiente token y mide cuánto contexto cabe.



- **¿Una palabra siempre = un token?** 

    **Respuesta:**

    **No.** Depende del tokenizer del modelo. El ejemplo “Vivo en Colombia” → tres trozos es solo **ilustrativo**.


- **¿Qué regla práctica sirve para estimar tokens (inglés)?**

    **Respuesta:**

    ~1 token ≈ **4 caracteres** ≈ **¾ de palabra**. En español suele variar un poco.


- **¿Cómo se relaciona el context window con los tokens?** -

    **Respuesta:**

    El context window es el **máximo de tokens** que el modelo maneja de una vez (suele contar **input + output** juntos, según el provider).



- **¿Qué pasa si superás el límite de contexto?** -

    **Respuesta:**

    La API suele **rechazar** la request (`context length exceeded`), **o** tu app debe **recortar / resumir / olvidar** mensajes viejos. El modelo **no borra solo** la conversación.


- **¿Qué son los tokens de input?** -

    **Respuesta:**

    Lo que **enviás**: system, user, historial, tools. Tienen un **precio por token** de entrada.


- **¿Qué son los tokens de output?** -

    **Respuesta:**

    Lo que **genera** el modelo (completion). Suele costar **más** por token que el input.


- **¿Cuál es la diferencia entre tarifa y límite?**

    **Respuesta:**

    **Tarifa** = cuánto **cuesta** cada token (input/output). **Límite** = cuántos tokens **caben** en el context window. Son dos cosas distintas.


- **¿Por qué importa cuidar la cantidad de tokens?**-

    **Respuesta:**

    Más tokens = más **costo** y, a menudo, más **latencia**. Por eso elegís modelos baratos/rápidos o caros/inteligentes según el caso ([[02_Estudios/Modelos AI y proveedores]]).

