


## Que es ?

Scope es la capacidad de accesibilidad  de variables , objetos , funciones desde las diferentes partes del código 

#### Global Scope

Son todas aquellas variables a las que todo el código puede acceder gracias a que se encuentran escritas en el termino general del codigo 



####  Function Scope

Todas las variables asignadas dentro de una función  solo podrán ser usadas dentro de esta función y las demás funciones anidadas dentro de la función
pero el resto del código no podrá acceder a la variable 



### Let , const  , var

Let y const solo funcionaran con un Scope de bloque es decir solo podrán ser accedidos en el entorno donde se encuentren y no afuera ejem

![[Pasted image 20230907114650.png]]

Donde si mis variables let y const están dentro del if si yo intentara acceder a ellas desde el Scope de  la función me aparecería error pero si dado casi usara el var todo la función y sus funciones anidadas podrían acceder a el incluso con el Scope de bloque 



#### Características de let y const 

let no permite la Re declaración 
```js 
let miNombre ="migue"
let  miNombre = "lina" //Aqui nos marcara un error 
```
pero si podemos resignar 

``````js
let miNombre = "Sagitario"
MiNombre = "Migue" // Esto no nos marcaria error 
``````` 

Con const no podemos ni re declarar , ni reasignar la unica forma en que podríamos cambiar su valor podrían son métodos push , pop 


#### *Notas 

hay que tener cuidado cuando asignamos una variable sin haberla declarado previamente ya que el código de forma automática tomara este variable como global además si no se usa la practica de declarar y luego asignar, podría crear problemas luego al momento de depurar además  de que JavaScript queda ambiguo al no sabe que hacer con la variable