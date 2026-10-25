
### Como usarlas?


Las [[Particles]] es una de las [[Geomtrias]] a la cual atreves del material que ya nos daba ya [[Three js]] *PointsMaterial*  , sin embargo este material no nos otorga toda la flexibilidad que hacer nuestros propios [[Shaders]] en cuanto transformación , figuras etc 

Para trabajar con puntos en los shader :


```js
// Nuestra gometria puede ser el buffer o un geomtry ya disponible
  geometry = new THREE.BufferGeometry()
  const geometrySphere = new THREE.BufferGeometry();

// Creamos el ShaderMaterial 


const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    depthWrite: false,
    transparent: true,
});


```


ahora tenemos mas capacidad para modificar el comportamiento y formas de las particulas una de ella seria darles tamaños ramdomicos para cierto realismo 

````js
 const ramdomScales = new Float32Array(parameters.count * 1)

 for(let i = 0; i < parameters.count; i++)
    {
        ramdomScales[i] =  Math.random()
    }

 geometry.setAttribute('aScale', new THREE.BufferAttribute(ramdomScales, 1))

// Ahora se lo pasamos a nuestro vertex , y con gl_PointSize le pasamos el randomico
  

attribute float aScales;

gl_PointSize = 2.0 * aScales


````




### Como rendondear las particulas?

POdemos usarlo aprendido en [[Shaders Paterns]]  la unica diferencia en es que ne el fragment shader hacemos uso gl_coord  tomamos la distancia del centro de nuestro plano y le agregamos un step para separar los borde
![[Pasted image 20240930173149.png]]

Obtenemos el coord 0.4 y lo relacionamos con el centro del cirulo le agregamos el step para que cree el limite de cuando pintar y no

```js
 float strength = distance(gl_PointCoord , vec2(0.5));
strength = 1.0 -  step(0.5 , strength );


gl_FragColor = vec4(vec3(strength), 1.0);
```

![[Pasted image 20240930174416.png]]

Dandonos como resultado estas esferas pero que tal si las volvemos un poco mas interesantes ?:



### Difuse particles

Usemos la técnica de defuse, normalmente nuestros valores siempre quedan en 0.5 en el borde si lo multiplicamos por dos hacemos que sea 1 en el borde en breves palabras aceleramos el pintado

![[Pasted image 20240930175128.png]]


````js

    float strength = distance(gl_PointCoord , vec2(0.5));
	
    strength *= 2.0;

    strength = 1.0 - strength;
   
````

- **`distance(gl_PointCoord, vec2(0.5))`:**  
    Esta línea calcula la distancia entre cada fragmento de la partícula y el centro de la partícula, que está en la coordenada `(0.5, 0.5)`. Esta distancia nos da una idea de qué tan lejos estamos del centro: cuanto mayor es la distancia, más cerca estamos del borde.
    
- **`strength *= 2.0;`:**  
    Multiplicamos el valor de la distancia por 2. Esto "acelera" el cambio de intensidad de los píxeles de la partícula. En otras palabras, aumenta la tasa de transición desde el centro (donde la intensidad es máxima) hacia los bordes (donde la intensidad es mínima). Multiplicarlo por 2 hace que la transición sea más rápida.
    
- **`strength = 1.0 - strength;`:**  
    Restar el valor de `strength` de 1 invierte el gradiente. Antes de esta operación, el valor es 0 en el centro (máxima distancia) y 1 en los bordes. Al invertirlo, hacemos que el valor sea 1 en el centro y 0 en los bordes. Esto crea un efecto donde las partículas tienen un centro más brillante que se va atenuando hacia los bordes, lo que resulta en un desvanecimiento suave.
![[Pasted image 20240930181720.png]]

