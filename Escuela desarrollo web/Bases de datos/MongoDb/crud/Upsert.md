
## Como lo logro?


Normalmente cuando estamos trabajando en [[Bases de datos]] necesitamos reconocer cuando lo que se nos pide es una nueva inserción o es un actualización
en [[MongoDb]]  podríamos hacer que nuestro código se viera algo así 


````json

use("plazi_store")

// Digamos que tenemos un sensor "A001" y queremos asegurarnos de que una vez hecho el registro de lecturas no existan dos "A001" con la  misma fecha si no que en readings se actualize el valor de las nuevas lecturas de "A001"

  
// De la forma normal incialmente creamos el sensor junto con el primer registro 
db.iot.insertOne({

  sensor: "A001",

  date: "2022-01-03",

  readings:[1212]

})

  
// y si lo queremos acutulizar y añadir el nuevo elemento usamos el update
db.iot.updateOne({

  sensor: "A001",

  date: "2022-01-03",

},

 {

  readings:[2323]

 }

)

````

Hasta aquí todo bien  podríamos ejecutar una bloque de de código cuando queramos actualizar o crear un nuevo sensor pero realmente no estaríamos usando el máximo potencial de mongodb con el campo "upsert" al darle el valor true podemos realizar algo como esto :


````js
use("plazi_store")  


// Aqui hacemos algo similar a lo anterior solo que aqui gracias al campo upsert nuestro codigo podra reconocer cuando nuestro sensor no ha sido creado y si ya ha sido creado permitira modificarlo


db.iot.updateOne(

// Buscamos si existe un resgistro previo de "A001" dado que no lo creara el nuevo resgitro del sensor
  {

    sensor: "A001",

    date: "2022-01-04",

  },

  {

    $push:{

      readings: 1223 // Por ejemplo este sera el primer valor que se creara cuando hagamos el primer registro , pero si ya existe el registro creara los nuevos valores ingresados 

    }

  },

  {

    upsert: true

  }

)

````

y así cumpliríamos nuestro reto de un upsert en un mismo bloque de datos


