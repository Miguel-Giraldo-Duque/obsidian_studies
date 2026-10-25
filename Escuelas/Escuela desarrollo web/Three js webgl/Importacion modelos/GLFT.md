
### Como funciona?


Nos permite pasar la información de nuestros modelos a [[Three js]], y este usa 4 diferentes tipos de archivos:

**GLTF**: En este tipo de archivo recibimos un archivo JSON, un archivo BIN y una imagen como textura. Es útil si queremos tener flexibilidad, pues en el JSON tendremos información de la cámara, material, etc. En el archivo BIN estará la información de la geometría, y una textura para el modelo.
````js
// solo tenemos que importar el duck glft y se encarga de traer automaticamente las texturas y el binario.

// Importamos el glft loader

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

loaderModels.load(
  "/models/Duck/glTF/Duck.gltf",

  (model) => {
    scene.add(model.scene.children[0]);
  }
);

````



**GLTF-Binary**: Utiliza un solo archivo para transmitir toda la información mencionada anteriormente. No es fácil de manipular dado que la información de la textura estará dentro del binario. Sin embargo, todavía tendremos el JSON. Es más liviano.
````js
// solo tenemos que importar el duck glft y se encarga de traer automaticamente las texturas y el binario.

// Importamos el glft loader

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

loaderModels.load(
  "/models/Duck/glTF-Binary/Duck.glb",

  (model) => {
    scene.add(model.scene.children[0]);
  }
);

````


**GLTF Draco**: Nos entrega los mismos archivos que GLTF, pero con la diferencia de que es mucho más liviano, ya que comprime la información de los binarios. Para este, necesitamos el decodificador de Draco para poder ver nuestro modelo.
````js
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

// Podemos usar el decoder que nodemodules contiene de draco .  y se lo pasamos como un path
const dracoLoader = new DRACOLoader();

dracoLoader.setDecoderPath("/draco/");

// Le seteamos el dracoLoader al loader manager
const loaderModels = new GLTFLoader(manager);

loaderModels.setDRACOLoader(dracoLoader);


````

Usar Draco loader puede ser más útil cuando traemos modelos de mucho peso o múltiples geometrías, ya que nos permite tener formatos más livianos. Sin embargo, su peso y cantidad de código no es tan eficiente si solo es una geometría que no requiere mucho.

**GLTF Embedded**: Nos entrega un solo archivo JSON que contiene toda la información, pero en binario.

````js
// solo tenemos que importar el duck glft y se encarga de traer automaticamente las texturas y el binario.

// Importamos el glft loader

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

loaderModels.load(
  "/models/Duck/glTF-Embedded/Duck.gltf",

  (model) => {
    scene.add(model.scene.children[0]);
  }
);
````


## Importar animaciones :

- Cargamos el modelo GLTF.
- Creamos un `AnimationMixer` que actúa como controlador de las animaciones del modelo.
- Utilizamos el método `clipAction()` para seleccionar una animación específica del modelo.
- Reproducimos la animación llamando a `play()`.
- Actualizamos la animación en cada frame mediante el método `mixer.update()`, que avanza la animación de acuerdo con el tiempo transcurrido.

````js

// glft nos ofrece esta clase clip la cual es donde se alamacena la anima cion , ahora podemos usar el animation mixer para ejecutarlo como un video 

   mixer = new THREE.AnimationMixer(model.scene);
   // lo transformamos en un action para que pueda ejecturar la funcion
   const action = mixer.clipAction(model.animations[2]);

    action.play();
    
    scene.add(model.scene);

// en la funcion animate para ver la animacion a lo largo de los frames.
mixer.update()

````


### Sombras en modelos 

[[Shadows]] le pasamos un traverse por todos los hijos en la esena y les activamos el resiveShadow y castShadow , tener cuidado puede tener problemas en [[Performance]] 
 ```js 
const updateAllMaterials = () => {

  scene.traverse((child) => {

    if (child.isMesh) {

      child.castShadow = true;

      child.receiveShadow = true;

    }

  });

};
```