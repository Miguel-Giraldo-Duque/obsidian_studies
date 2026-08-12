## Que es ?


El comando git nos muestra los cambios que han existido en los ultimos dos commit con respecto a un archivo por ejemplo 

````
	git show miArchivo
`````

si se quiere comparar de forma especifica dos commit usamos el 

### git diff 

Para usarlo es recomandable hacer uso del [[git log]] para conocer el nombre o ideficador de los commit  por ejemplo

commit 1f32e4e1c0771772b1760e263023fc3b05e305c5

Este seria ideficador del  commit si quisieramos comparlo con otro commit especifico se usaria asi 


````
 git diff f834ab02e387f67003c840c748e1b12531d9d678 cc690dd41b91541a7658ad48b50180b2ab39e1a0


````
 Dandonos luego los cambios hechos  en el rango de un commit a otro permitiendo conocer de forma expecifica  cambios en la historia
