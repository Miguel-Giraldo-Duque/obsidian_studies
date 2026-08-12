

## Que es ?

Habla de que cada funcionalidad que creamos debe tener solo una función a ejecutar por ejemplo si tengo una funciona llamada sumar yo solo espero que esa funcion sume y nada mas , en el caso de [[Backend node]] podemos usar el enrutamiento de express para dividir estas tareas en diferentes archivos 


### Como hacerlo?


Teniendo en cuenta la metodología anterior express permite crear rutas en base a archivos que cumplan esa función en especifico que buscamos 



````js
// Primero tomamos una funcion que quermos modularizar y ahora debemos inicializar 
const express = require("express")
  
const router = express.Router()

// Ahora en vez de pasarle la ruta normal simplemente la dejaremos en / por que router se encargara de devolver la ruta deseada despues

router.get("/", (req, res) =>{

  res.json([

    {

      name : "juana",

      edad: 22

    },

    {

      name : "Caroli",

      edad: 22

    },

    {

      name : "Pepe",

      edad: 22

    }

  ])

})

// Ahora exportamos el router 

module.exports = router


// Ahora creamos el archivo encargado de manejar rutas y a este le crearemos una funcion que importe los archivos y creamos los endpoints para cada uno de los archivos a usar

const productsRouter = require('./products.router')

  

function routerApi (app) {

  app.use("/products" , productsRouter)

}

  

module.exports = routerApi


// Y listo ahora podemos la funcion routerApi() y ejecutarla desde el archivo donde inicializamos el servidor y listo


````

