

## Como lo uso?


Digamos que queremos hacer un buscador de texto en base a patrones en nuestros documentos en [[MongoDb]]  podríamos utilizar los [[Métodos  de comparación mongodb]] pero estos podrían verse cortos frente a la capacidad que tiene el operador atómico regex 

Este operador permite la creación de patrones búsqueda de texto  , digamos que tenemos esta estructura de datos 


````json
  {

    "name": "Ana",

    "lastname": "Martínez",

	"description": "Apasionada por la música y la pintura, siempre buscando nuevas formas de expresión artística."

  },

  {

    "name": "Carlos",

    "lastname": "González",

    "description": "Apasionado de los deportes al aire libre, especialmente del senderismo y el ciclismo de montaña."

  }

  ,

  {

    "name": "Elena",

    "lastname": "Ramírez",

    "description": " Apasionada ingeniera de software con experiencia en el desarrollo de aplicaciones web y móviles."

  },

  {

    "name": "Pedro",

    "lastname": "Sánchez",

    "description": "Viajero empedernido y amante de la gastronomía,  siempre en busca de nuevos sabores y experiencias culinarias."

  },

```` 

Digamos que  quiero encontrar a todos los elementos que en su descripción contengan "Apasionada"  lo que podría hacer es lo siguiente 


```json
use("plazi_store")

  

db.entrevistados.find({ description : { $regex : /Apasionada/}})



// Lo anterior me lanzaria dos resultados el de elena y ana las conicidieron con la busqueda
```


Otros métodos útiles 

- /line/ => nos devuelve los doc que tengan la palabra line, exactamente como esta escrita.
    
- /line/i => nos devuelve los doc que tengan la palabra line, ignorando minus-mayus.
    
- /line$/ => nos devuelve los doc que terminen con la palabra line.
    
- /^Single/ => nos devuelve los doc que empiecen con la palabra Single.
    
- /^S/m => nos devuelve los doc que empiecen por S, ignorando los saltos de linea. Ej: ( Single line Second line ).