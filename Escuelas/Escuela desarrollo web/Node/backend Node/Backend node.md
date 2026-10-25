



### Como trabajar con el?

Para trabajar con [[Node]] de backend podemos usar express una librería que nos permitirá levantar nuestro propio servidor  y desarrollar nuestras propias Apis


`````js
npm i express
`````


Para usarlo correctamente creamos una instancia del objeto inicial y creamos un puerto 


```js
const express = require("express")

const app = express()

const port= 3000 // El puerto es ideal usarlo desde el 3000 al 9000 por buenas practicas


//Ahora escuchamos el puerto que dijimos y listo ahi tenemos nuestro primer sevidor 

  

app.listen(port , () =>{

  console.log("Servidor activo!!")

})
```


este es una librería que trabaja con el método [[Api rest]] cuyos métodos básicos son pach , delete , create ,get 

para usar el  método get 


````js

// Aqui ingresamos en la instacia app y le debemos pasar dos parametros 
// app.get("laRutaQueDevolveraLaInfo" , callback)

app.get("/infoPersonas", (req, res) =>{

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

// Esto funcionara en que si se escribe la ruta indicada en el servidor ya levantado esto nos devolvera el array de objetos como repsuesta tal cual como una api normal 
````

### Como recibir parámetros con get

El uso de parámetros con get nos sirve para tomar elementos específicos de una respuesta  atreves de los EndPoints 

ejem 


````js

app.get("/infoPersonas", (req, res) =>{

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

// Cuando usamos el /: les estamos diciendo a express estamos esperando un parametro 

app.get("/infoPersonas/:id" (req, res) =>{
	res.json(
	{

      name : "Pepe",

      edad: 22

    })
})

// Si dado el caso que quisieramos recojer el id ingresado lo que tenemos que hacer es 

app.get("/infoPersonas/:id" (req, res) =>{
// Vamos a usar el req para usar los parametros

const {nombreMiparametro} = req.params //con la destructuracion  le estamos dicciendo que al unico parametro que escuchando es que queramo indica
	res.json(
	{
	// y si quisieramos enviar el id como repsuesta podemos hacer

	  id ,
	 
      name : "Pepe",

      edad: 22

    })
})

````