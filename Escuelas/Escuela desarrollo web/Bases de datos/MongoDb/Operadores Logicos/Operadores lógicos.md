

## Que es ?


| Operador | equivalente                          |
| -------- | ------------------------------------ |
| $and     | &                                    |
| $or      | \|\|                                 |
| $nor     | Los que no cumplen ninguna condicion |
| $not     | Excluye un elemento                  |


## $and 

Ya lo habíamos trabajado previamente de forma implícita cuando hacíamos la búsqueda con find() por ejemplo tengamos en cuenta este data set 



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
   name: "Sara",
   code: 500, 
   tags:["D", "X"]
   
 },
   
````


Nuestra consulta normalmente se vería así 
````json
use("plazi_store")

db.usuarios.find(
{
// Aqui de forma automatica usamos el "and" por el name y code donde si o si tiene que estar el code y name pero de forma implicita 
	name: "Aki",
	code: "500"
}
)

````


## $or

Si  este operador nos permite filtrar por el or que quiere decir que cumpla esta condicion o la otra por ejemplo teniendo en cuenta el data set anterior


````json
  

db.usuarios.find({
// Entonces lo que le estoy diciendo es traiagame todos los elementos que tengan de campo y valor sara o los que tienen "A"o "B"

  $or:[

	{name: "sara"},
	{ $in: ["A","B"] }

  ]

})
````





## $nor

$nor nos permitirá excluir todos los elementos que no cumplan con nuestra query digamos que yo no quiero ver los documentos con campo tags con "A" y "B" o "sara"
lo lograríamos así: 

````json 
db.usuarios.find({
// Entonces lo que le estoy diciendo es traiagame todos los elementos que NO tengan de campo y valor "sara" o los que tienen "A"o "B"

  $nor:[

	{name: "sara"},
	{ $in: ["A","B"] }

  ]

}
````


## $not

Similar al anterior solo que no recibe arrays quiero excluir todos los que no tengan de nombre "sara"

````json 
db.usuarios.find({
// Entonces lo que le estoy diciendo es excluyame todos los elementos que tengan sara como nombre 
 
name:{$not : $regex:/sara/i}
}
````



## $expr

Me da la posibilidad de comparar múltiples elementos  de nuestro documento por ejemplo compara un campo con otro



````json 
db.usuarios.find({
// Aqui por ejmplo pude comparar dos campos y sus valores y aplicarles esa condicion unicamente a esos campos de ahi el poder de expr
   $expr:{
    $eq:["$start station id", "$end station id"]
  },
````