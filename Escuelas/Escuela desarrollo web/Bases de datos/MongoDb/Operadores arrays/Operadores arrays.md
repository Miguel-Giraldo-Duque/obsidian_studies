
## Cuales son?


En [[MongoDb]] existen diferentes operadores de arrays como lo podrían ser el foereach ,for , filter etc.


| Operador   |
| ---------- |
| $in        |
| $nin       |
| $all       |
| $elemMatch |
| $size      |




## $in


Supongamos que quiero hacer un query que solo me traiga los documentos que en su array contenga x valores que yo le quiero ingresar por ejemplo tomemos esta estructura de datos 


````json

{
 _id: 1, 
 item: { 
 name: "ab", code: "123", 
 description : "Single line description."    }, 
 qty: 15,
 tags: ["book", "headphone", "appliance" ] 
},

{
 _id: 2, 
 item: { 
 name: "ab", code: "123", 
 description : "Single line description."    }, 
 qty: 15,
 tags: [ "bag", "appliance" ] 
},

{
 _id: 3, 
 item: { 
 name: "ab", code: "123", 
 description : "Single line description."    }, 
 qty: 15,
 tags: [ "school", "bag", "headphone", "appliance" ] 
},
````

Lo que yo quiero es traer todos los elementos que en tags dentro del array contengan "book" o "school" lo podríamos hacer así


````json

// Aqui le decimos que si en el array tag hay book o school me traiga el documento que coincidio con la busqueda 

db.inventory.find({tags:{ $in:["book", "school"]}})


````


## $nin

Este operador es el contrario a $in trae los documentos que no coincidieron con la query de búsqueda digamos que quiero encontrar todos los elementos que no tienen "book o shcool" en el array 


````json

// Este codigo me devolveria el _id 2 que NO contiene "book" o "School"
db.inventory.find({tags:{ $nin:["book", "school"]}})

````



## $all

Funcionaria  como el  "y"  en programación es decir si yo quiero encontrar los elementos que tengan "book"  y  "School" se usa de  la siguiente forma


````json

// Este codigo me devolveria los elementos que en el array contengan dentro sin importar el orden "book" y "school"
db.inventory.find({tags:{ $all:["book", "school"]}})

````



## $size

Nos permite filtrar elementos en base al tamaño del array

````json

// Este codigo me devolveria los elementos que tengan un tamaño de 3 elementos
db.inventory.find({tags:{$size: 3}})

````



## $ElememMacth


Digamos que tenemos un array de objetos 

````json
{
	name:"juaan",
	EmpresasTrabajadas: [
		{
			name : "microsoft"
		},
		{
			name : "Yotube"
		}
	
	]
}

{
	name:"Miguel",
	EmpresasTrabajadas: [
		{
			name : "Jardin Botanico"
		},
		{
			name : "Yotube"
		}
	
	]
}



````

y lo que quiero es traer todos los usuarios que  trabajaron en YouTube  


````json
//Y esto nos devulve todos los usuarios
db.usuarios.find(
{ 
results: {$elemMatch: { name: "Yotube"} 
})

````


