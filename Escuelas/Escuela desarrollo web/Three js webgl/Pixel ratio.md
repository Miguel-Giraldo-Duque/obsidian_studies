

## Que es ?

Reasenta la cantidad de pixeles por sección de pixel en el render dependiendo de la cantidad del pixel ratio se dibujaran mas micro pixeles por unidad de pixel
donde si es uno solo se ve asi:

![[Adjuntos/Pasted image 20240813205357.png]]

Se pinta únicamente ese pixel  pero digamos que tengo un pixel ratio de 2
obtienes 4 pixeles por unidad de pixel entre mas se aumenta mas el ratio mas difícil resulta para la gpu el render de estos elementos 
![[Adjuntos/Pasted image 20240813205454.png]]

y consecutivamente ira aumento dependiendo del ratio de pixeles 
la forma en que se dibujan estos pixeles pude resultar engorrosa y algo fea  para solventar este problema

```js
// invocamos window que nos duelve nuestro pixel ratio
renderer.setPixelRatio(window.devicePixelRatio)
```


EL problema aparece cuando en dipositivos como en mobile donde hay demaciado pixel ratio tomara muchos renders y podria afectar el funcionamiento por ello limitarnos a dos pixel ratio es suficiente podemos usar Math.min() para es cometido

```js
// Min buscara el valor mas pequeño en relacion a dos valores ingresados
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
```



### Como trabajarlo con los shaders?

Con los [[Shaders]] lo usamos para que la cantidad de particulas generadas por nuestros [[Fragment Shader]]  sean las mismas sin importar la plataforma y su pixel ratio .


```js
// uSize funciona para el tamño de las particulas aqui obtenemos el pixelratio y lo multplicamos para que se adaptable .

 uniforms:{
  uSize : {value : 8 * renderer.getPixelRatio()}

 }

// Vertex 
  uniform float uSize;

   gl_PointSize = uSize 
```


Ahora tendremos un problema con el render y es que nuestras particulas permanecerán con el  mismo tamaño independientemente de la distancia que tengamos con la cámara, normalmente three js no activa esta parte del codigo si nuestra [[Perpective camera]] existe . Para solucionarlo podmeos :


```js
// NodeModules Shaderlib Points ahi estara el "Size attunietion"

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    vPosition = normalize(position); // Normalizamos la posición para que esté en la superficie de la esfera
    gl_PointSize = 10.0 * aScales; // Tamaño de cada punto (partícula)

// Este es el codigo que nos copiamos para logralo le pasamos viewPosition  y listo podremos trabajar con diferntes tamaños en el render

    gl_PointSize *= (1.0 / -viewPosition.z);

```