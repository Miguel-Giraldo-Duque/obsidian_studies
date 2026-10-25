

## Cuales son

En [[Three js]] tenemos cuatro parámetros principales bajo los que podemos trasformar elementos 

- posicion
- scale
- rotacion
- quaternion


### Transformar posición

Se puede usar medidas como metros , cm pies etc, estas medidas estan el uso que y el caso donde queramos usarlas , laforma prterminada en la que three js se mueve es con z comola profundidad de un objeto , x como moverse a la derecha
y arriba 

```js
camera.position.x = 0.5

camera.position.y = -0.9

camera.position.z = 1
```

me resulta en que 

![[Adjuntos/Pasted image 20240727183818.png]]


pero estos valores son albitrarios cambian dependiendo de donde esta la cámara ubicada el efecto de estos valores se intercambiaran 



### Transformar tamaño


Para trasnformar tamaños de nuestras [[Mesh]] debemos indicarle los mismo valores previos de x y z pero con el fin de escalarlos en  ese sentido en especifico 

Usamos el atributo para vector 3 [[Set]]
```js
mesh.scale.set(2, 1, 2)
```


### Rotar elemento 


Cuando rotamos elementos en three js  podemos usar PI , dado que PI por i mismo indica la mitad de una rotacion para rotar completamente un elemento multiplicariamos PI * 2

En js se veria asi

````js
// , pi en radianes  es igual a la mitad de la circunferencia de un circulo multiplicado por ... nos da una mejor manera de controlar los elementos

mesh.rotation.y = Math.PI * 0.3
````

Exiten algunos bugs con esto al yo cambiar la rotacion de mi elemento implica ademas que el sentido de estos elementos cambia por ello existe un problema gimball lock para solcuionar esto usamos reorder

````js
// nos permite indicarle el orden a moverse si primero a y luego x y z
mesh.rotation.reorder("YXZ")
````


**quaternion** para usarlo debemos :

```js
// La posicion en la que vamos a rotar como un lapiz atravezando al elemento , luego el angulo de rotacion
quaternion.setFromAxisAngle(
new CANNON.Vec3(-1, 0, 0),
Math.PI * 0.5
);
```