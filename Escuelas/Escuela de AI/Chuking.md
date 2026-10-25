### Que es?

Es una tecnica que nos permite separar un texto en pequeñas partes mas faciles de procesar y significativas para los LLM que a su vez permiten la creacion eficiente de [[Escuelas/Escuela de AI/Embeddings|Embeddings]] a entregar informacion reducida facilitando la genracion


En laingchain podemos usar

```js

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import fs from "fs/promises"; // Importamos el módulo fs con promesas

async function main() {
  console.log("Inicio de la función main");
  try {
    // Leemos el contenido del archivo directamente con fs
    const texto = await fs.readFile("./contenido.txt", "utf-8");
// Le indicamos con el chunk size desde cuantos caracteres divide el texto y que separadores de usar entre los elementos , chunk overlap es para evitar que los parrafos generados se sobrepongan en misma linea en menor medida menor la sobreposicion
    const cortador = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      separators: ["n/n", "/n", " ", ""],
      chunkOverlap: 50,
    });

// Le pasamos el texto
    const ChunksTexto = await cortador.createDocuments([texto]);

    console.log(ChunksTexto);
  } catch (error) {
    console.log("Error:", error);
  }
}

main();

```
