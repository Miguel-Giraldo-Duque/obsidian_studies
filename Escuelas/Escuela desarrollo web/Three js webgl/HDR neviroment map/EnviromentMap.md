
### que son?

Son imagenes que nos permiten simular luces reales de una foto o escena que le pasamos a nuestro fondo para que afecte nuestros [[Materiales]] u otros elementos en nuestra escena

```js
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'


/*Env HDR*/

const rgbeLoader = new RGBELoader()

rgbeLoader.load("textures/environmentMap/satara_night_4k.hdr", (e) =>{
    e.mapping =  THREE.EquirectangularReflectionMapping
    scene.background = e

    scene.environment = e
})

```

Los anterior son los HDR(high dimanic range) pero también existen los LDR (low dinamic range) que funcionan como un conjunto de imagenes en forma de cubo que ponemos en disposición para la esena. 

funciona asi

```js
let cubeTextureLoader = new THREE.CubeTextureLoader(manager);

// P como positivo N como negativo px "x positivo" nx "x negativo"
const cubeTexture = cubeTextureLoader.load([
  "environmentMaps/2/px.png",
  "environmentMaps/2/nx.png",
  "environmentMaps/2/py.png",
  "environmentMaps/2/ny.png",
  "environmentMaps/2/pz.png",
  "environmentMaps/2/nz.png",
]);

scene.background = cubeTexture;


// Tenemos propidades extras para la esena :
scene.environmentIntensity = 4; // la intesidad de las luces
scene.backgroundBlurriness = 1; // Crea un ambiente borroso
scene.backgroundIntensity = 1; // la intesidad del fondo a menor mas ocuro
scene.environmentRotation.y = Math.PI * 0.5; // Desde donde pegan las luces en rotacion.
```

![[Adjuntos/Pasted image 20241019160055.png]]

SI quieramos que nuestro ambiente este pegado al suelo podemos : 

``` js

// Nos da como resultado un ambiente tipo esfera aplanado abajo para
// dar sensacion de suelo 
import { GroundedSkybox } from 'three/addons/objects/GroundedSkybox.j

    
  groundedSkybox.position.y = 15;

  const skybox = new GroundedSkybox(environmentMap, 15, 70)
    scene.add(skybox)

```


![[Adjuntos/Pasted image 20241020170952.png]]

Funcionando como circulo applacando en la parte inferior :

![[Adjuntos/Pasted image 20241020171120.png]]

