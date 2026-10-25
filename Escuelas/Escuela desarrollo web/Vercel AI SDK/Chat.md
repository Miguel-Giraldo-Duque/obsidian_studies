
### Como se construye?

Cuando trabajamos con los [[Escuelas/Escuela desarrollo web/Vercel AI SDK/Modelos AI y proveedores|Modelos AI y proveedores]] nos encontramos que al enviar el prompt con [[Escuelas/Escuela desarrollo web/Vercel AI SDK/Streaming|Streaming]], recibimos la repuesta pero el modelo parece haber olvidado todo lo que le dijimos. 

```js
// 👨‍💻 Soy Miguel como puedo plantar liros en un cuarto oscuro?

// ✨ Puedes hacer x para entonces y

// 👨‍💻 Genial gracias, como me llamo?

// ✨ Uh no se crack, decime tú nombre
```  

Esto pasa por que el modelo es [[stateless]] es decir cada generación es independiente y espera recibir todo el contexto necesario en cada request.

```json
// role: representa quien mando el mensaje en el chat  `"user"` | `"assistant"` | `"system"`

// parts: Representa lo que el mensaje envio, se usa asi por que diferentes tipos de input o otupt pueden ser recibidos, sea audio, imagenes , texto. 
[
  {
    "id": "msg_1",
    "role": "user",
    "parts": [{ "type": "text", "text": "Soy Miguel, ¿cómo plantar lirios en un cuarto oscuro?" }]
  },
  {
    "id": "msg_2",
    "role": "assistant",
    "parts": [{ "type": "text", "text": "Puedes hacer X y luego Y..." }]
  }
]

```  

Este array de messages es pasado como parte del prompt a modelo, la longitud de cuantos mensajes el modelo puede manejar depende del context window que este permita. Entre mayor context window mas largas conversaciones sin perder memoria.

El anterior JSON es el formato que [[Escuelas/Escuela desarrollo web/Vercel AI SDK/Vercel AI SDK|Vercel AI SDK]] facilita para [[React]] y otros frameworks de UI puedan tener una version enriquecida de la estructura de datos que usan los modelos

```js
// Dependiendo del contenido puede cambair a un array con iamagens recursos y demas.
[
{ "role": "user", "content": "Soy Miguel, ¿cómo plantar lirios en un cuarto oscuro?" },

{ "role": "assistant", "content": "Puedes hacer X y luego Y..." },

{ "role": "user", "content": "Genial, ¿cómo me llamo?" }

]
``` 


### Como lo implemento 