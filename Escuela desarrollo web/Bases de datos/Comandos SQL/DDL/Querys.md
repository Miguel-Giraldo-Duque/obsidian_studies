### Como los uso para responder preguntas?

Los query en las [[Base de datos]] nos permiten responder preguntas de negocio , siendo factores definitivos para un negocio , ya que permiten dashbaord , progresos , y búsquedas que con los medios previos de  almaecanmeinto no se podia.

Y como los uso?...

Para usarlos usamos la palabra clave ´Select´ y ´from´ siendo la forma mas basica en que nos podemos traer informacion de una tabla 

-- Nos trae todos lo registros de nuestra tabla : Podria repsonder a quiero obtener todos lo productos de mi empresa

SELECT *  FROM mi tabla 


A veces las preguntas requieren casos mas específicos o contextos mas cerrados allí entra WHERE , que nos permite crear condicionales  para excluir o incluir datos 

-- Nos permite responder a : Quiero todos los productos que se encuentran sin stock o quiero todas las citas antes del día 24 

SELECT *  FROM mi tabla where  columna = condición 

SELECT *  FROM mi tabla where  columna < condicion 


Podemos también manejar la respuesta permitiéndonos cambiar los nombres de las columnas dadas por la consulta ejemplo

SELECT usuarios AS cliente  FROM usuarios where  id = 1 


####  Funciones extras 

**Count** : También podemos permitirnos crear nuestras columnas calculadas , entendiendo que no sus valores nativos de la tabla original pero que podemos manipular ejemplo

Digamos que quiero contar cuantos son los productos que cada proveedor me esta dando como empresa , podemos responder esa pregutna con:

SELECT count(product) as total_product_by_provider FROM database.products
WHERE proveedor_id = 2 