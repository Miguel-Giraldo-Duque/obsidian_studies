
## Como funciona?


Projection en [[MongoDb]] nos permite especificar cuales campos queremos que se muestren cuando hacemos un query por ejemplo

Si yo tengo esta estructura

````json

{ 
  name: "Sara", 
  code: 215,
  tags:["A", "B"]
  },
  
  {
   name: "Rengo",
   code: 300, 
   tags:["A", "B"]
   },

  { 
   name: "Aki",
   code: 500, 
   tags:["D", "X"]
   
 },
   
````

Y digamos que solo quiero traer los "code" mayores o iguales a 300 

````json

db.usuarios.find({code: {$gte: 300 } })

````

con el anterior código ya podríamos traer los elementos que cumplan la query , sim embargo digamos que yo solo quiero traer únicamente de los documentos que cumplieron la query el campo "name" ¿Cómo lo logro? 


````json
  

db.academias.find(
//Aqui tenemos nuestro query
{code: {$gte: 300}},

// Aca viene el segundo parametro conocido como projection que me permitira elegir que campos quiero traer usando el 0 o 1 o true o false

{name:1, _id:0 } // Podemos usar el 0 en el _id ya que dado si no lo usamos lo va a a traer la id a pesar de que le demos a "name" 1 

)
````

