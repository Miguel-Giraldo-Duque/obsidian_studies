

## Cuales son?



**Ambient light** : En [[Three js]] tenemos esta luz que nos permite crear una luz general que rodea todos nuestros elementos  y a su vez todas las partes del mismo  dando resultados como Perfomace bueno:

![[Pasted image 20241005222303.png]]

Se ve como este color uniforme por que la luz esta iluminando todas las partes de la mesh dándole esa uniformidad.

uso :
```js
const ambientLight = new THREE.AmbientLight("white", 1);

scene.add(ambientLight);

gui.add(ambientLight, "intensity").min(0).max(3).step(0.01);
```


**Directional light** : a diferencia del ambient light este nos permite posicionar desde donde queremos que la luz golpee en Relacion al centro de nuestras  mesh , la forma en que las líneas de luz afectan al mesh es de forma paralela. 

La de forma pregerminada estará en encima de las mesh  y digiera la luz hacia el centro de la esena. performance moderado
![[Pasted image 20241005223327.png]]


```js
const ambientLight = new THREE.AmbientLight("white", 1);
scene.add(ambientLight);
```


Si queremos mover la luz debemos tener en cuenta que esta luz si bien se mueva de posición la dirección de los rayos de luz estarán relacionados siempre al centro de la escena  p
![[Pasted image 20241005224146.png]]

```js

const directionLight = new THREE.DirectionalLight("red", 5);

directionLight.position.set(1, 0.25, 0);
```

**Hemisfere light** : permite iluminar la escena dividiéndola en dos donde toma la parte inferior y la parte superior de esta y los medios de la iluminación creara un mix entre ambos performace bueno .


![[Pasted image 20241005225833.png]]

el plano toma el color del cielo por que solo toma una cara pero en los medios 

```js
  
// Sky , ground , intensity
const hemisphereLight = new THREE.HemisphereLight("blue", "green", 0.9);

scene.add(hemisphereLight);
```


**Point light** : Es un punto en la esena que ilumina en todas las direcciones , y son los rayos de estas que cuando chocan con nuestra escena entre mas cerca el elemento a estos mas sera iluminado .performance moderado

![[Pasted image 20241005230654.png]]

dependiendo de como la posicionamos en nuestra escena iluminara ciertos elementos o no , además podemos indicar en que distancia se deja de iluminar , y la velocidad en que se difumina la luz .
![[Pasted image 20241005231349.png]]

```js
// Color, intensity, distance, decay
const pointLight = new THREE.PointLight("yellow", 2);

pointLight.position.set(1, 0.9, 0);
```

SI cambiamos la distance nuestros objetos fuera del rango que le indiquemos no serán iluminados ni afectados por el sombreado en otras palabras, a medida que el valor aumenta, el rango efectivo de la luz se reduc

el decay define cómo disminuye la intensidad de la luz conforme aumenta la distancia (también conocido como atenuación).

 
**RectAreaLight** En Three.js, `THREE.RectAreaLight` es una luz que emite desde una fuente rectangular, proporcionando un tipo de iluminación más suave y difusa en comparación con luces puntuales o direccionales. Esta luz es particularmente útil para simular fuentes de luz como ventanas, pantallas o paneles luminosos.

performance alto costo
![[Pasted image 20241005234741.png]]

```js
const areaLight = new THREE.RectAreaLight("blue", 1, 3, 3);

areaLight.position.set(-0.5, 0, 0);

areaLight.lookAt(new THREE.Vector3());

scene.add(areaLight);
```


**Spotlight** : funciona con una linterna que ilumina en un angulo esta luz es cosotosa en performance 

![[Pasted image 20241006001543.png]]
```js

// el angulo representa que tanto de la luz llega a los demas elmentos  usa la idstancia , y dist y penubra que representa lo afilado o borrosos del borde de la luz
const spotlight = new THREE.SpotLight("green", 3, 2, Math.PI * 0.9, 0.25, 2);
// pAra mover la luz dbemos agregar el target a la esena para poder moverla, por defecto no hereda las propiedades de la clase 3D por lo que debemos actualizarla desde el target de esta

spotLight.target.position.x = -0.75;

scene.add(spotLight);
```

![[Pasted image 20241006001840.png]]
![[Pasted image 20241006002233.png]]


### Lights helper


Existen ayudadores para poder ver mejor la posicion de nuestras luces , que solo viendo el efecto de estas luces resulta dificil posionarlas 

```js
// Luz , tamaño , color(defecto los colores de la luz)
const directionLightHelper = new THREE.DirectionalLightHelper(
  directionLight,
  0.2
);
scene.add(directionLightHelper);

// Luz , tamaño , color(defecto los colores de la luz)
const hemisphereLightHelper = new THREE.HemisphereLightHelper(
  hemisphereLight,
  0.2
);
scene.add(hemisphereLightHelper);

// Luz , tamaño , color(defecto los colores de la luz)
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
scene.add(pointLightHelper
		
// Luz , tamaño , color(defecto los colores de la luz)
const spotLightHelper = new THREE.SpotLightHelper(spotLight, 0.2, "red");

scene.add(spotLightHelper);


```