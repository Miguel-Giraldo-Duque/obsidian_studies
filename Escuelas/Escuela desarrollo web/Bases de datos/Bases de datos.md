

## Que es una base de datos?


  
Una base de datos es un sistema organizado para almacenar y gestionar información de manera estructurada, eficiente y segura. En ella podemos almacenar una variedad de tipos de datos, como texto, números, imágenes, entre otros. Las bases de datos son fundamentales para muchas aplicaciones y sitios web, ya que permiten una interacción fluida con los usuarios al proporcionar acceso rápido a la información almacenada y facilitar la realización de consultas y actualizaciones.


### Que tipos de bases de datos existen?


* **Base de datos relacionales(SQL)** : Organizan los datos en forma de columnas y filas utilizando el modelo relacional ejemplos como MySQL, Oracle, SQL Server etc.


* **Bases de datos no SQL**:  Estas bases de  datos no utilizan el modelo relacional y son mas funcionales para manejar grandes volúmenes de información de datos no estructurados o semiestructurados la eficiencia de estas tablas se halla en la escalabilidad horizontal que permite distribuir los datos recibidos en  múltiples nodos o servidores acelerando el proceso y obteniendo una mejora en la capacidad de carga además ofrecen flexibilidad al no tener que mantener estructuras fijas como los modelos (SQL) , existen varios tipos de bases de datos no SLQ como :

Documentales : Estas almacenan los datos similar a un JSON y  se organiza con el clave-valor y puede representar una entidad , objeto o registro

Grafos : Se utilizan para representar la información almacenada en forma de conexión de datos ejemplos como neo4j


Este tipo de bases de datos no relacionales permiten tener una estructura como esta 
![[Adjuntos/Pasted image 20240308164302.png]]

EL punto central se le conoce como load balance  asigna las peticiones a cada uno de los nodos de una forma ordenada , además tiene la ventaja que si uno de sus hijos cae o muere las replicas podrán cubrirlo y mantener en pie el funcionamiento de la base datos  