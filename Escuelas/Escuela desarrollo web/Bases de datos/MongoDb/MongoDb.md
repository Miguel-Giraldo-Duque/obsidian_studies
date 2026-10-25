

## Que es?


Mongo DB es una [[Bases de datos]] no relacional que se organiza de manera tal en que en vez de utilizar el modelo relacional que únicamente usa columnas y filas utiliza el campo-valor o clave-valor lo que  le permite una mayor flexibilidad y eficiencia , Mongo DB usa los "documentos" que no son mas que un conjunto de datos similar a JSON donde se guarda la información con el campo-valor ejm:


![[Adjuntos/Pasted image 20240308170927.png]]

Donde por ejemplo "id" funcionaria como nuestro campo   y   su valor seria el seguido por los dos puntos 



### Que es una colección

Una colección es la que almacena los documentos con campos comunes entre si por ejemplo  podríamos tener una colección de productos  donde cada documento representaría un producto 

![[Adjuntos/Pasted image 20240308172548.png]]



### Que es un clúster 

Dentro de las Tecnologías de la Información (TI), Clúster significa integrar dos o más computadoras para que trabajen simultáneamente en el procesamiento de una determinada tarea. . Saber qué es un Clúster consiste en entender que se trata de la conexión entre dos o más computadoras con el propósito de mejorar el rendimiento de los sistemas en la ejecución de diferentes tareas. . En el Clúster, cada computadora se llama “nodo”, y no hay límites sobre cuántos nodos se pueden interconectar. . Con esto, las computadoras comienzan a actuar dentro de un solo sistema, trabajando juntas en el procesamiento, análisis e interpretación de datos e información, y/o realizando tareas simultáneas


#### Por que es útil usar este tipo de bases de datos no relacionales 

Digamos que somos una empresa distribuidora de vegetales , nuestro proveedores nos pueden mandar paquetes de comida con diferentes valores como

````json

{
	nombreProvedor: "Juan",
	CantidadProductos : 200,
	Productos : "Manzana",
	PrecioPagar : 2000 

}

````

Pero no todos nuestros proveedores nos van a mandar la misma información de la misma forma digamos que nuestro proveedor de peras nos manda un nuevo campo como contacto

````json

{
	nombreProvedor: "Juan",
	CantidadProductos : 200,
	Productos : "Manzana",
	PrecioPagar : 2000 ,
	Contacto:31945790
	

}

````

Si utilizamos el modelo relacional tendríamos que crear una nueva tabla  para almacenar contacto y  dado la posibilidad en que nuestros proveedores nos envíen la información de diferentes maneras las nuevas tablas se verían en blanco o sin llenar viéndonos sobre cargados

Pero con los documento en el modelo no relacional podemos tener documentos con propiedades similares o diferentes sin tener que reconstruir la tabla cada vez en base a  diferentes solicitudes



