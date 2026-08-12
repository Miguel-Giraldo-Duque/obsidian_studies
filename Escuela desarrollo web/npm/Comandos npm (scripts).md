
## Como se usan ?


En nuestro package.json  en la parte de scrpits podemos crear nuestros propios comandos para que realizen tareas especificas por ejemplo 

``

```js

"scripts": {

    "test": "echo \"Error: no test specified\" && exit 1",

    "oe": "node src/index.js" //Aqui nos estamos moviendo a src y ejecutando nuestro archivo
 
  },
```



````js

"scripts": {

    "test": "echo \"Error: no test specified\" && exit 1",

    "oe": "node src/index.js && node src/index2.js" // si quisieramos ejecutar varios comandos podemos usar && para juntar multiples funciones 

  },


```