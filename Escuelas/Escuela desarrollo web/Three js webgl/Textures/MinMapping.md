

## Que es?

Es un a técnica que s eusa con las [[Texturas]] para dividirlas en vericones mas pequeñas , mas manejables para la GPU , dependiendo de la division de la textura se vera mas o menos borrosa :

![[Adjuntos/Pasted image 20241001230302.png]]

Minmapping usa algoritmos como **minfilte**r que lo que hace es que toma la lista de tamaños de la textura y dependiendo del tamaño del pixel de la imagen y del render utilizara uno o otro tamaños

podemos cambiar el algoritmo que usa filter que normalmente usa el linearminmapLinearFilter que nos un pcoo este resultado borroso a un resultado mas fino y pulido

De por si min filter al encontrar un imagen demaciado grande no requiere de usar el minMapping para procesarla por loq ue podemos desactivarlo en este caso para que la GPU solo maneje es sola textura mejorando el performance 

```js
textureColor.generateMipmaps = false
textureColor.minFilter = THREE.NearestFilter
```


Funciona de la manera contraria a minFilter si nuestra texturas es demasiado pequeña , magMapping tomara esta textura y adaptara estos vértices para estar en la textura , si bien los resultados se podrian ver un poco borrosos , simplemente tendiramos que cambiar el algoritmo que se adpate a nuestras necesidades .

![[Adjuntos/Pasted image 20241001232246.png]]

Si quieremos border mas afilados podemos usar :


```js
textureColor.magFilter= THREE.NearestFilter
```

Resultando en bordes mas precisos ademas de un mejor performance

![[Adjuntos/Pasted image 20241001232419.png]]



