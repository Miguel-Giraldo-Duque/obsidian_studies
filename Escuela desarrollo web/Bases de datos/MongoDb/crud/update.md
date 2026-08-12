
## Como hacerlo?


Para hacer updates en [[Consultas mongo]] podemos usar 

````js
use("plazi_store")

db.prospectos.updateOne(
{"_id": Objectid("63e91131ae0786ce88df4944")},
{ $set: {ventajas : "valiente y picara" } }
)
````

Utilizamos el objectid dado que para acceder a las ids que [[MongoDb]] nos otorga automáticamente no es posible acceder a como si las ids las hiciéramos nosotros ejemplo


````js
use("plazi_store")

db.prospectos.updateOne(
//aqui no es necesario usar el objectId para encontrar nuestro elemento dado que fuimos nosotros quienes creamos la id
{"_id" : 2},
$set: {ventajas : "valiente y picara" } }
)
````

### Es posible actualiza multiples elementos a la vez?


La respuesta corta es si y se puede lograr del siguiente modo

````js
use("sample_training")

db.zips.updateMany(
//Query o condcion para aplicar el update en este caso todos los documentos que coincidan con es ALPINE seran cambiados

  {city: "ALPINE"},

//Nuestro cambio
  {
    $set:{
// Creara un nuevo campo y valor en todos los elementos que // coincidieron con city:ALPINE
      opinionPersonal: "La mejor ciudad del mundo"
    }
  }
)


//resultado :
  {

    "_id": {
      "$oid": "5c8eccc1caa187d17ca6ed16"
	},
    "city": "ALPINE",
    "zip": "35014",
    "loc": {
      "y": 33.331165,
      "x": 86.208934
    },
    "pop": 3062,
    "state": "AL",
    "opinionPersonal": "La mejor ciudad del mundo"

  },
````

también podemos modificar el valor numérico de algún campo por ejemplo la población 

````js
use("sample_training")


db.zips.updateMany(
//Query o condcion para aplicar el update en este caso todos los documentos que coincidan con es ALPINE seran cambiados

  {city: "ALPINE"},

//Nuestro cambio incrementamos un valor de 1000

  {
// Como sucedio con $set todos los elementos que cumplan el query que ingresamos previamente en este caso con $inc aumentamos el valor de pop en 1000

    $inc:{
      pop: 1000

    }

  }

  

)
//resultado :
  {

    "_id": {
      "$oid": "5c8eccc1caa187d17ca6ed16"
	},
    "city": "ALPINE",
    "zip": "35014",
    "loc": {
      "y": 33.331165,
      "x": 86.208934
    },
    "pop": 4062, // Previamente el valor de pop 3062 paso a 4062 
    "state": "AL",
    "opinionPersonal": "La mejor ciudad del mundo"

  },
````

Podriamos cambiar el nombre del campo

````js
use("sample_training")

  
  

db.zips.updateMany(
//Query o condcion para aplicar el update en este caso todos los documentos que coincidan con es ALPINE seran cambiados

  {city: "ALPINE"},

// Para poder cambiar el nombre de nuestro campo lo unico que tenemos que hacer es llamar al nombre de nuestro campo y en el valor ingresar el nuevo nombre al campo y este procedimiento lo va a realizar con todos los documentos que cumplieran el query ingresado !

  {

    $rename:{
	// Cambiamos pop a poblacion :)
      pop: "poblacion"

    }

  }

  

)


//resultado :
  {

    "_id": {
      "$oid": "5c8eccc1caa187d17ca6ed16"
	},
    "city": "ALPINE",
    "zip": "35014",
    "loc": {
      "y": 33.331165,
      "x": 86.208934
    },
    "poplacion": 4062, // Previamente pop
    "state": "AL",
    "opinionPersonal": "La mejor ciudad del mundo"

  },
````



### Como hago updates a arrays


con los siguientes operadores podremos modificar los documentos que dentro contengan un array:

- $push: Agrega un elemento en el array.
- $pull: Remueve todos los elementos del array que hagan match con un query especifico.
- $in: Hace match con algunos de los valores especificados en un arreglo.




#### $Push   

Cuando tenemos estructuras de datos como la siguiente 
````json

{
	_id : 2,
	name: "juan",
	skills: ["Js","Css", "node"]
}


````

Digamos que queremos agregar un nuevo elemento en el array con $set tendríamos que redefinir el campo y valor para  ponerle nuestra información y con $inc no habría forma de agregarle ese nuevo elemento por eso podemos usar $push que nos permitirá agregar nuevos elementos en ese array

````json

db.inventory.updateOne(
//Agregamos nuestra query para seleccionar unicamente al elemento con la _id:3 
  {_id:3},
  
//Ahora utilizamos push para que en el campo skills agregarle un nuevo elemento en este caso "three js"
  {
  $push: {
    skills:"three js"
  }

})

// Dandonos el siguiente resultado 


{
	_id : 2,
	name: "juan",
	skills: ["Js","Css", "node", "three js"] // Agregando nuestro nuevo valor a final de la lista 
}


````




#### $pull 

Nos permite eliminar elementos específicos en ese array  por ejemplo digamos que queremos eliminar a Js
````json

{
	_id : 2,
	name: "juan",
	skills: ["Js","Css", "node"]
}


````

Para logarlo podemos aplicar el siguiente código donde ingresamos nuestro campo skills seguido del valor Js 

````json

db.inventory.updateOne(
//Agregamos nuestra query para seleccionar unicamente al elemento con la _id:3 
  {_id:3},
  
//Ahora utilizamos pull para que en el campo skills eliminar el elemento especifico Js
  {
  $pull: {
    skills:"js"
  }

})

// Dandonos el siguiente resultado 


{
	_id : 2,
	name: "juan",
	skills: ["Css", "node", "three js"] // Eliminamos el valor js que estaba previamente en la poscion [0]
}


````

Pero digamos que yo quiera eliminar múltiples elementos de ese array por js y node , lo anterior lo podríamos lograr  con el operador  $in   que nos permite hacer un array con los elementos que queremos eliminar el del array de la siguiente forma :

````json

db.inventory.updateOne(
//Agregamos nuestra query para seleccionar unicamente al elemento con la _id:3 
  {_id:3},
  
//Ahora utilizamos pull para que en el campo skills agregemos nuestro operador atomotico $in al cual ingresamos nuestro array de elementos a eliminar
  {
  $pull: {
    skills:{
	    $in:["js","node"] 
    }
  }

})

// Dandonos el siguiente resultado 


{
	_id : 2,
	name: "juan",
	skills: ["Css", "three js"] // Eliminamos los valores "js" y "node" que estaba previamente en la poscion [0] y [2]
}


````