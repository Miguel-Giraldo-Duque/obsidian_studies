## Como funcionan?

Cuando habilitamos **sombras** en [[Three js]] lo que realmente está sucediendo es que se genera un **shadow map**. Este shadow map es esencialmente una textura que contiene información sobre la distancia entre la luz y los objetos en la escena. El proceso ocurre en dos pasos principales:

1. **Primero**, la luz "toma una foto" de la escena desde su punto de vista. Este proceso captura la profundidad de los objetos que la luz puede ver, creando una textura llamada shadow map. Esta textura almacena la información sobre qué partes de los objetos están obstruyendo la luz y, por lo tanto, proyectarán sombras.
    
2. **Segundo**, durante el renderizado principal, Three.js utiliza este shadow map para calcular dónde deben aparecer las sombras. En función de la posición de los objetos y la luz, Three.js compara la distancia de los objetos con la luz (almacenada en el shadow map) para determinar qué partes de la escena están en sombra.
    

Este proceso de renderizado de sombras ocurre **antes** del renderizado final de la escena, lo que implica que en cada frame en el que las sombras están habilitadas, Three.js realiza un render adicional específicamente para calcular las sombras. Este es el motivo por el cual el uso de sombras puede impactar el rendimiento, ya que esencialmente se están realizando dos renderizados: uno para generar las sombras y otro para renderizar la escena final con las sombras aplicadas.

![[Pasted image 20241006174242.png]]


Para emepezar a usar sombras demos tener en cuenta dos elementos claves : castShadow y receiveShadow , cuando usamos cast le indicamos que este elemento puede emitir sombra a los demas elementos en la esena , cuando le decimos receive le decimos que el objeto puede recibir sombras


Existe el core shadow que refiere a nuestra y sus sombras [[Mesh]]  y el drop shadow que es su interaccion con otros elementos y como castea sombras.

---- 

 Habilitamos el shadowMap en el renderer
`
```js
renderer.shadowMap.enabled = true;

// Luego dependiendo de como queramos que funcionen las sombras configuramos nuestros objetos . Las luces simepre deben funcionar como castShadow para asegurar su efecto.
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.castShadow = true;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.5;

plane.receiveShadow = true;

scene.add(sphere, plane);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(2, 2, -1);

directionalLight.castShadow = true;

scene.add(directionalLight);
```

![[Pasted image 20241006181014.png]]

Solo exiten tres tipos de [[Lights]] que permiten el manejo con sombras spotlight, pointLight , directionalLightt

Nuestras sombras pueden agregar buenos detalles pero su costo es alto por ello existen técnicas que nos permiten mejorar el [[Performance]] de nuestra esena.


### Cámara interna luces  

Las luces usan esta cámara interna que les permite tomar un foto de lo que pueden ver y a partir de ello generar las sombras . Para opmizarlo debemos tener cuenta varios campos que nos ofrece el objeto de camra


**MapSize** : Es el tamaño de vision que tiene nuestra camara con respecto  a nuestra esena , es importnate que si vamos a modificar este valor que sea divisivble por 2 para que el [[MinMapping]] pueda hacer bien su trabajo. 

```js
// Entre mas tamaño mejor se podra ver el efecto de las sombras pero sera muy costoso , en menor medida sera menos la claidad de la sombra.

directionalLight.shadow.mapSize.width = 800;
directionalLight.shadow.mapSize.height = 800;
```


**Camera** :  Dependiendo de la luz , tendrá una cámara  interna  distinta en este caso directionalLight usa una ortográfica para  mantener su luz paralela , podemos evitar bugs si configuramos bien el near y far  para que cubran solo necesario de nuestra esena. Sin configurar normalmente se veria asi :

![[Pasted image 20241006183718.png]]
un far muy alejado para configrar esto podemos accder a shadow.camera y usar un helper de camera para ver su funcionamiento.


```js
// Cubrimos lo unico que necesitamos de la esena.
directionalLight.shadow.camera.far = 6;
directionalLight.shadow.camera.near = 2;

  

const cameraShadowHelper = new THREE.CameraHelper(

  directionalLight.shadow.camera

);

  

scene.add(cameraShadowHelper);
```

![[Pasted image 20241006183857.png]]

**Amplitude** : Como podemos ver nuestra [[Cámara ortográfica]] es demasiado amplia lo que causa que perdamos detalle de la sombra de la esfera pues la sombra terminan viéndose demasiado pequeña en comparación de lo que la cámara esta tomando si reducimos el tamaño permitimos ver mas detalles de sombra quitando un poco los bordes blurry
![[Pasted image 20241006185347.png]]


```js
directionalLight.shadow.camera.left = -2;

directionalLight.shadow.camera.top = 2;

directionalLight.shadow.camera.right = 2;

directionalLight.shadow.camera.bottom = -2;
```

![[Pasted image 20241006185307.png]]
Nuestros bordes mejoraron : 
![[Pasted image 20241006185430.png]]

Podríamos usar radius si quisiéramos bordes mas suaves , tener en cuenta que esto borde no toman en cuenta la luz son generados artificialmente .

```js
directionalLight.shadow.radius = 10;
```

![[Pasted image 20241006185553.png]]
### Cambiar el punto de target de la luz

Normalmente el target de la luz esta en el centro de la escena por que para algunos contextos se requiera mover este target para ello podemos:

```js

//THREE js trabaja con matrices aunque setemos la nueva posicion ello no actualizara la matrix dado que el objeto target usara las matrixes para psocionar rotar etc , antes de renderizar el objeto por ello podemos actualizar los valores manualmente.

directionalLight.target.position.set(0, 4, 0);

scene.add(directionalLight.target)
directionalLight.target.updateMatrixWorld();

```
![[Pasted image 20241023223138.png]]

#### Algoritmos de shadowMap

Dependiendo del algoritmo que elijamos tendremos diferentes resultados 


**PCFShadowMap**

Es el que usamos preterminado y nos pemite que nos permite una sombra un poco mas difuminada .

**PCFSoftShadowMap** : No es un bueno en performance esta en un nivel medio , este quitara el radius y le dara una sensación mas afilada a la sombra

```js
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
```

![[Pasted image 20241006191554.png]]

**Spot Light**
Al igual que con el directional podemos crear nuestras sombras a partir de este 

```js
const spotLight = new THREE.SpotLight("red", 3.6, 10, Math.PI * 0.9);
spotLight.position.set(0, 2, 2);

  
// Indicamos que emita luz
spotLight.castShadow = true;


// Le pasamos un mapsize divisble por 2
spotLight.shadow.mapSize.width = 1024;

spotLight.shadow.mapSize.height = 1024;

// a diferencia de directionallight spotlight usaperpective camera por lo que moficamos el ancho de esta con el fov.
spotLight.shadow.camera.fov = 16;

// mismos valores de near y far no exgerar mejora los resultados.
spotLight.shadow.camera.near = 1;

spotLight.shadow.camera.far = 6;

const helperSpot = new THREE.CameraHelper(spotLight.shadow.camera);

scene.add(helperSpot);

  

scene.add(spotLight.target);

  

scene.add(spotLight);


```

![[Pasted image 20241006224017.png]]

**Point light** : Es como los anteriores con cierta diferencia , spot light emite una luz en todas las direcciones  y por cada una de estas direccion 6 en total va crear un render por cada una. Cuando queremos ver la camara o la direccion de esta veremos la ultima posicion de emision la que ve hacia abajo 

Nota: no es recomendable manipular el fov , pues afectaríamos no solo a la cámara visible si no a todas las demás.

![[Pasted image 20241006225624.png]]

```js
  

const pointLight = new THREE.PointLight("blue", 3.6);

pointLight.position.set(1, 1, 0);

pointLight.castShadow = true;

  

pointLight.position.set(-1, 1, 0);

pointLight.shadow.mapSize.width = 1024;

pointLight.shadow.mapSize.height = 1024;

pointLight.shadow.camera.near = 1;

pointLight.shadow.camera.far = 3;

  

const pointLightShadowCamera = new THREE.CameraHelper(pointLight.shadow.camera);

  

scene.add(pointLightShadowCamera);

  

scene.add(pointLight);
```

![[Pasted image 20241006230507.png]]


### Baking shadows

Hay dos maneras de hacerlo podría tener una textura que funcione como shadow y que sea esta la que le pasamos al plano como un colormap o usamos un alfa map sobre un plano extra que podamos mover 


1. **Medoto 1** : a partir de la imagen le pasamoa nuestro material  la textura da buenos resultados pero no es dinámico:
```js

const plane = new THREE.Mesh(

  new THREE.PlaneGeometry(5, 5),

  new THREE.MeshBasicMaterial({ map: bakedShadow })

);
```
![[Pasted image 20241006233055.png]]


2. **Metodo 2** : Le pasamos un alhpa map a un segundo plano a una altura levemente mayor a la de nuestro plano de suelo y asi lo podremos mover dinámicamente en la escena: 
```js
const plane2 = new THREE.Mesh(

  new THREE.PlaneGeometry(1, 1),

  new THREE.MeshBasicMaterial({

    color: "black",

    alphaMap: simpleShadow,

    transparent: true,

  })

);

// en el render lo igualamos  la poscion de la esfera y podemos crear esta luz dinamica.:
 const elapsedTime = clock.getElapsedTime();

  sphere.position.x = Math.cos(elapsedTime) * 0.5;
  sphere.position.z = Math.sin(elapsedTime) * 0.5;
  sphere.position.y = Math.abs(Math.sin(elapsedTime * 3));

  plane2.position.x = sphere.position.x;
  plane2.position.z = sphere.position.z;
  plane2.material.opacity = (1 - sphere.position.y) * 0.3;

```

![[Pasted image 20241006235358.png]]