
Es modulo de Node que nos permite leer , escribir y borrar archivos 


Leeyendo archivos de texto 
````js

// Fs exite de forma preterminada en Node por lo que no es necesario realizar instalaciones extra

const fs = require("fs")

  
  // Fs.readline recibe una (RutaDelArchivoAleer , callback)

const leeido = fs.readFile(__dirname + "/index.txt" , (err ,data) =>{
	// creamos la funcion donde podemos recibir el error o los datos si todo salio bien
	
    console.log(data.toString())

})

  

console.log(leeido)
```` 

En todos los métodos disponibles de Node existe una versión síncrona para cada uno por ejemplo para escribir un archivo es fs.writeLine() pero existe su versión en síncrono  fs.writeFileSync pero no es recomendable su uso al bloquear el hilo de trabajo de [[Node]]


#### Escribir archivos

````js
// Fs.writeLine recibe 3 parametros (RutaAcrearElArchivo , contenido , callback)

const crearArchivo = fs.writeFile(__dirname +"/nombreDelArchivoACrear.txt", "Soy el rey" , (err, data) =>{

    console.error(err)

})

  
  

console.log(crearArchivo)
````

#### Borrar archivos 


````js
	  
// fs.unlik recibe (archivoAborrar , callback)
const borrar = fs.unlink(__dirname + "/nombreDelArchivoACrear.txt" , (err) =>{

    console.log(err)

})

  
  

console.log(borrar)
	
```
