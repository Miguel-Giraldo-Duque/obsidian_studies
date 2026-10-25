

### Que es?

Es un herramienta que [[Three js]] nos ofrece para poder proyectar en una dirección  un laser que nos otorga información sobre la intercepción de elementos , dándonos la posibilidad de crear eventos de mouse en nuestro canvas a los elementos 3D y demas fetures

![[Adjuntos/Pasted image 20241016211055.png]]

Un raycater puede pasar múltiples veces sobre una misma [[Geomtrias]]


#### Como usarlo? 

Demos instanciar raycaster y pasarle el origen desde nace el rayo , la dirección normalizada :
```js

const rayCaster = new THREE.Raycaster();

// Le pasamos el origen
const rayOrigin = new THREE.Vector3(-3, 0, 0);
// Le decimos en que direccion
const rayDirection = new THREE.Vector3(10, 0, 0);

// Es importante normalizar el rayo para evitar errores , despeus de todo buscamos que sea 1 o 0

rayDirection.normalize();

rayCaster.set(rayOrigin, rayDirection);

// Intercepta

// Le pasamos el objeto que queremos que reacciona

const interactObjRay = rayCaster.intersectObject(object2);

console.log(interactObjRay);

  

//// Le pasamos los objetos que queremos que reaccione

const interactObjsRay = rayCaster.intersectObjects([object1, object2, object3]);

console.log(interactObjsRay);

// Rayscaster form camera es util para normalizar la direccion desde la camara

```


Como usarlo con [[GLFT]] models :


```js

const loaderModels = new GLTFLoader(manager);

let model = null;

loaderModels.load("/models/Duck/glTF/Duck.gltf", (modelGlft) => {
  model = modelGlft.scene;
  scene.add(modelGlft.scene);
});



const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  rayCaster.setFromCamera(mouse, camera);

// Esperamos a que se ingrese el modelo
  if (model) {
  // Le pasamos al raycaster el modelo , de forma preterminada recorrera el objeto bucando los children por lo que en la importacion no es necesario pasarle los children
    const intersectModel = rayCaster.intersectObject(model);

    console.log(intersectModel);
  }
  
};

tick();
```






