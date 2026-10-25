

### Como usarlos?

el patron recomendando para los archivos de typescript y archivos html es tener una carpeta src que centralize los archivos ts, y dentro la carpeta public un scripts donde compilamos los archivos ts en ese espacio configurando en tsconfig:

 ````js
     "outDir": "../Public/Scripts",
 ````

Entonces hecho esto simplemente nuestro archivo html tiene que apuntar al archivo main o archivos esperados js generados en la carpeta scripts 

````html
<!doctype html>

<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <h1 id="title">HI</h1>
    <p>
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Omnis repellat,
      voluptates nobis quam sequi minima dignissimos at numquam eligendi ducimus
      natus mollitia ullam distinctio voluptatem id saepe amet quae? Rerum!
    </p>
  </body>
  
     <!-- Archivos generados al compilar con tsc -p tsconfig.json  -->
  <script src="./Scripts/main.js"></script>
</html>
````

