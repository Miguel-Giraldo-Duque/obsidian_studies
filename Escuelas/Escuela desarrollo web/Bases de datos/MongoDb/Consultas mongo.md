
## Como puedo hacer una consulta a mongo DB 


Hay varias formas en las que podemos hacer una consulta a [[MongoDb]] hoy expondre dos maneras desde compass DB y VCS code  


Para hacer la consulta en compass debemos inicialmente conectarnos a nuestra base datos para logarlo debemos hacer lo siguiente 

1. Haremos clic en nueva conexión 

![[Pasted image 20240310114208.png]]

2.  Luego nos va a pedir que pongamos una url otorgada en la pagina web

![[Pasted image 20240310114332.png]]

3. para obtener esa url vamos a 
 ![[Pasted image 20240310114419.png]]

Le damos click y nos abrirá este nuevo menú donde estara el link que debemos usar

![[Pasted image 20240310114509.png]]

en password debemos usar la contraseña creada para la base de datos podemos ver nuestras contraseñas de acceso en database access 


4.  ahora pegamos la url con nuestra contraseña y oficialmente estamos conectamos !

![[Pasted image 20240310114743.png]]

5.  para hacer nuestra primera query vamos a una de nuestras colecciones y  en filter podemos hacer nuestra primera solicitud
 ![[Pasted image 20240310114930.png]]

en este caso nuestra query es para una colección de documentos de Airbnb

![[Pasted image 20240310115106.png]]


Vamos a filtrar de todos los documentos los que en el campo "beds" tenga "2"como valor dándonos el siguiente resultado

![[Pasted image 20240310115244.png]]

Lo que quiere decir es que 1381 documentos coinciden con nuestra condición de búsqueda de dos camas y listo así logramos  nuestra primera consulta en 
compass !




#### Pero y lo podríamos lograr en VSC?

Claro en vcs tenemos una extensión especifica llamada  



![[Pasted image 20240310115733.png]]




La cual instalaremos  y la forma de conectarnos en vcs  es muy similar que con compass iremos al nuevo icono en nuestro editor  y buscaremos conexiones le daremos al +  y le daremos al  "connection String" el cual nos pedirá la misma url que utilizamos en nuestro compass para ingresar 



![[Pasted image 20240310120154.png]]

Presionar la tecla enter y listo ahora tendremos la estructura similar a la que teníamos en compass con nuestras colecciones y documentos  ahora vamos a  hacer nuestra primera consulta!

````js
use("sample_airnb")

  

db.listingsAndReviews.find({beds:2})

````


y listo le damos al botón play y nos traerá todos los resultados como lo hacia compass 


![[Pasted image 20240310121856.png]]


