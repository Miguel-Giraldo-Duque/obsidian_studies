

## Que son?


Una geometría esta compuesta por vertices  o conexiones que permiten crear nuestras figuras , en los medio de estos verticen estan las caras o tringulos como lo vimos en [[WebGl]] son estas caras o triangulos las que le dan forma a nuestros elementos 

![[Pasted image 20240903210747.png]]


Cuando se trabaja con partículas se trabaja es con los vértices del elemento en cuestión , con los vertices podemos conocer informacion de su posicion uv normalsizes etc

Existen múltiples geometrías como esferas , beziers , cubos , triángulos etc. , sin embargo siempre es mejor idea construir nuestros elementos en programas 3d como blender 


### Manipulación de geometrías 

Similar a [[Mesh]] podemos aplicar trasformaciones a nuestras geometrías , pero para que ? , bueno es útil cuando queremos cambiar el punto de origen 0.0 a otras posiciones  para ello podemos usar translate para mover un la geometría de un plano y luego movemos la posición de la mesh para que en el bode del plano sea 0.0 o scale para cambiar el tamaño de la geomtria y no de la mesh como tal

**Translate**:

```js
const planeGeometry = new THREE.PlaneGeometry(1, 1, 16, 64);
planeGeometry.translate(0, 0.5, 0.0);
```

![[Pasted image 20241114213430.png]]
Movimos la geometria pero el origen de nuestra mesh sigue estando en el origen
![[Pasted image 20241114213513.png]]

Para ello debemos mover la posicion de la mesh con una [[Operaciones de transformacion]] de posicion para estar en el mismo punto y asi obtenemos un punto de origen reposicionado

**Scale**

```js
const planeGeometry = new THREE.PlaneGeometry(1, 1, 16, 64);
planeGeometry.translate(0, 0.5, 0.0);

planeGeometry.scale(1.5, 6, 1.5);

```

![[Pasted image 20241114213720.png]]


