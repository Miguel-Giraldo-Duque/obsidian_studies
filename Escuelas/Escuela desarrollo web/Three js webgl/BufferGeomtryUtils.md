
## Cuales son? 


mergeVertices(): Normalente cuando tenemos una geometria en three js la cuadricula de vertices que tiene se va lgo asi

![[Adjuntos/Pasted image 20240930205253.png]]

Tenemos muchos vertices superpuestos unos ensima de otros lo que nos puede dar raros resultados,  el buffer nos otorga el mergeVertice() para que la grilla se vea asi:
![[Adjuntos/Pasted image 20240930205349.png]]

```js
// Geometry

let geometry = new THREE.IcosahedronGeometry(2.5, 50)

geometry = mergeVertices(geometry)
```

Reduciendo significativamente la cantidad de vertices que tenemos ademas ello terminamos devolviendo un "index", es realmente eficiente pero si nuestras geomtrias resultan tener demaciados vertices tomara mas tiempo que se realize la opereracion afectando en dispositivos IOS por ello es mas util importar nuestro propio modelo desde blender con un sahder smoth que creea este mismo efecto BufferGeomtryUtils

