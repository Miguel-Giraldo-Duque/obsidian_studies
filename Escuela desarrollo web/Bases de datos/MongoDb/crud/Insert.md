
## Como hacerlo ?


Para poder realizar [[Consultas mongo]] de tipo insert solo necesitaremos estar previamente conectados  a la base de datos y ahora en nuestro código usamos 



```` json

// Cuando ponemos aca un nombre del cual no exite en nuestra base de datos automaticamente la creara dandole el nombre que ingresamos en este caso "plazi_store"

use("plazi_store")

//Algo similar sucede aca, al poner db.products creamos la coleccion products y podemos insertarle nuestra informacion

db.products.insertOne({
  name:"juanito perez",
  objetivo: "Conquistar y dominar",
  skills: "Seductor experto 1000 horas de vuelo"
})
````

y para realizar múltiples inserciones podemos usar 
```` json
db.products.insertOne({
  name:"Steven lioner",
  objetivo: "Hombre mas fuerte del mundo",
  skills: "Levanta 100 kilos con una mano en curl de biceps"
})
````


y dado que queramos ver 