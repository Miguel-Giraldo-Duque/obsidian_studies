

## Como se logran?


En [[Three js]] tenemos la posibilidad de crear escenas muy parecidas a la realidad , si bien esto puede afectar el [[Performance]] dado la necesidad del proyecto podemos usar las siguientes técnicas si buscamos una sensación realista

#### ToneMapping 

Su idea principal es tomar [[Textures]] LDR o low dinamic range y transformarlas en un HDR , no es un cambio explícitamente en una simulación del proceso  para usarlo debemos:

```js 
// Da un resultado un poco mas liminosoy acentuando mas las sombras
renderer.toneMapping = THREE.ACESFilmicToneMapping;

// Podemos controlar ademas el exposure del tone mapping
renderer.toneMappingExposure = 3;

```


![[Adjuntos/Pasted image 20241022201925.png]]

Sin embargo existen  mas tone mapping de forma preterminada tenemos un NoToneMapping , pero podemos elegir opciones como 


 ``Linear`` : THREE.LinearToneMapping : es igual al HDR por default

  ``Reinhard``: THREE.ReinhardToneMapping : un efecto grisáceo como foto de no muy buena calidad. 
 ![[Adjuntos/Pasted image 20241022202352.png]]
 
  ``Cineon``: THREE.CineonToneMapping : mas cámara antigua  con luces muy ricas .
 ![[Adjuntos/Pasted image 20241022202433.png]]

#### Que es Alasing?


El aling es un efecto que sucede cuando la GPU  pinta los bordes de una geometría esto pasa por que la gpu solo pinta los pixeles que esten dentro del limite de la geometría de otro modo no lo hace, dando una pintado con forma de de cuadricula  

![[Adjuntos/Pasted image 20241023122402.png]]
![[Adjuntos/Pasted image 20241023123354.png]]


Este efecto solo sucede en pantallas de un [[Pixel ratio]]  de 1 , en adelante este efecto no será muy necesario solucionar este problema pues los pixeles serán prácticamente imperceptibles  .


##### Que soluciones existen?


1. Super sampling : Permite tomar el tamaño de nuestro map size y doblarlo por altura y ancho  para luego comprimir ese tamaño al que ya teníamos definido  permitiéndole generar 4 veces mas pixeles , tiene problemas de [[Performance]] dado que estamos haciendo 4 renders para crear las subdivisiones de los pixeles

2. Multi smapling : Es una técnica de anti-aliasing que se centra específicamente en los bordes de los objetos. En lugar de renderizar toda la escena a una resolución mayor como en SSAA, MSAA identifica las áreas donde hay transiciones o bordes geométricos y solo aplica el suavizado en esos píxeles pero no hace esto en el interior de la geometría.

![[Adjuntos/Pasted image 20241023123916.png]]


```js
const renderer = new THREE.WebGLRenderer({

  canvas: canvas,

  antialias: true,

});
```


### Shadow Acne

[[Shadows]] pueden presentar un problema como este en nuestro proyecto cuando nuestra superficie castea sombra sobre si misma debido que cuando la sombra calcula la profundiad entre pixeles dara este efecto:

![[Adjuntos/Pasted image 20241023234509.png]]
Y en esos espacios existiran esas sombras dando el efecto sahdow acne

![[Adjuntos/Pasted image 20241023234059.png]]
para solcuionarlo usamos bias y normal bias

```js

gui.add(
directionalLight.shadow, 'normalBias').min(- 0.05).max(0.05).step(0.001)
gui.add(directionalLight.shadow, 'bias').min(- 0.05).max(0.05).step(0.001)
```