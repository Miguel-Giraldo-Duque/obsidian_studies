


### Cuales son y como funcionan 

[[MongoDb]]  nos facilita una serie de operadores que nos permiten realizar verificaciones o condiciones que son :

| Operadores | Condición o comparcion |
| ---------- | ---------------------- |
| $eq        | =                      |
| $ne        | !=                     |
| $gt        | >                      |
| $gte       | >=                     |
| $lt        | <                      |
| $lte       | <=                     |



##### $eq como usarlo?

$eq ya lo habíamos usado previamente con la sintaxis de find digamos que tenemos esta estructura de datos 

````json
use("plazi_store")

 { 
  name: "Sara", 
  code: 215,
  tags:["A", "B"]
  },
  
  {
   name: "Rengo",
   code: 232, 
   tags:["A", "B"]
   },

  { 
   name: "Aki",
   code: 2112, 
   tags:["D", "X"]
   
   },


````

ahora solo quiero  encontrar los elementos que en sus tags contengan la letra B
lo podríamos hacer del siguiente modo

````json

use("plazi_store")

    
db.academias.find({tags: "B"}) // Aca de forma implicita usamos $eq por lo que no tendriamos que poner nada para que sea funcional
````


##### $ne como usarlo?

$ne me filtrara todos los elementos diferentes a la condición que les damos por ejemplo teniendo en cuenta la estructura de datos anterior todos  los elementos que no tengan "X "  



````json

use("plazi_store")

    
db.academias.find({tags: { $ne: "X" }})// Aca seguido de $ne ponemos la condicion donde quiero que encuentre todos los elementos diferentes a "X"

````


##### $gt como usarlo?

$gt me permitiría filtrar por el "mayor que" o  ">"  vamos a trabajar con la siguiente estructura de datos


````json
use("plazi_store")

 { 
  name: "Sara", 
  code: 215,
  edad: 20,
  tags:["A", "B"]
  },
  
  {
   name: "Rengo",
   code: 232, 
   edad: 14,
   tags:["A", "B"]
   },
   
  {
   name: "Loe",
   code: 232, 
   edad: 10,
   tags:["A", "B"]
   },

  {
   name: "Aleo",
   code: 232, 
   edad: 18,
   tags:["A", "B"]
   },

  { 
   name: "Aki",
   code: 2112, 
   edad: 20,
   tags:["D", "X"]
   
   },


````


Ahora digamos que yo  quiero filtrar todos los documentos cuya edad sean mayores a 18 esto lo podríamos lograr haciendo uso de $gt


````json

use("plazi_store")

db.academias.find({

  edad: {

    $gt: 18 // me filtra por todos los que son mayores que 18 

  }

})
````

Pero digamos que quiero encontrar a los mayores de 18 pero además quiero incluir todos los que también tengan 18


````json

use("plazi_store")

db.academias.find({

  edad: {

    $gte: 18 // me filtra por todos los que son mayores o iguales que 18 

  }

})
````



##### $lt como usarlo?

Este funciona como menor que , digamos que quiero  filtrar todos los documento en los cuales la edad sea menor a 18 


````json

use("plazi_store")

db.academias.find({

  edad: {

    $lt: 18 // me filtra por todos los que son menores que 18 

  }

})
````

ahora también podríamos ver quienes son menores a 18 y iguales a 18 de la siguiente forma 


````json

use("plazi_store")

db.academias.find({

  edad: {

    $lte: 18 // me filtra por todos los que son menores  y iguales que 18 

  }

})
````

