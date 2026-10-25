### Funcionamiento?

Es una librería que nos permite crear un mundo 3D  para usarla :


 ```js
npm i cannnon
```


Existen conceptos calves si queremos agregar nuestras [[Mesh]] a este mundo 3d descrito en [[Fisicas]]  

Demos primero definir una gravedad :

```js
const world = new CANNON.World();

world.gravity.set(0, -9.61, 0);
```

Agregar a la escena usamos un concepto de necesitamos definir una [[Geomtrias]] o forma que tiene nuestro elemento un "shape" , este shape para que interactúe con el mundo 3D creamos un "body"

```js 
const bodySphere = new CANNON.Body({
  mass: 1, //definimos la masa con la que inderactuar
  position: CANNON.Vec3(0, 2, 0), // su posicion
  sh ape: shapeSphere, // EL shape
});

world.addBody(bodySphere);
```


Actualizar nuestro mundo por cada frame en [[Three js]] en nuestra función tick

```js
  const elapsedTime = clock.getElapsedTime();

  const deltaTime = elapsedTime - oldElapsedTime;

  oldElapsedTime = elapsedTime;

  //World update
// Time step , cuanto paso desde el ultimo step, iteraccion para alcanzar el delay
  world.step(1 / 60, deltaTime, 3);
  
  // Update controls

  controls.update();
// Le igualamos nuestra posicion en three que es un vector 3 a la posicion de cannon que un vec3
// copy nos permite tramitir la informacion idependiendemente si es vec3 o vector 3
 sphere.position.copy(bodySphere.position);

// podemos incluso pasarle el quaternion para efectos mas realistas

 sphere.quaternion.copy(bodySphere.quaternion);
  



```



### Interacciones con otros objetos

Para que nuestros elementos de la escena interactúen entre si podemos jugar con la masa por ejemplo si quisiéramos que neustra esfera chocase con un plano  simplemente usaríamos en nuestro shape plane usaríamos  mass : 0  

```js
// creamos nuestro shape plano 

const floorShape = new CANNON.Plane();

const floorBody = new CANNON.Body();
// le agregamos el mass 0
floorBody.mass = 0;
floorBody.addShape(floorShape);

// Para que nuestras rotaciones hechas en three js puedan relacionarse a las del mundo de cannon debemos usar quaternion de otro modo no se acutalizara
floorBody.quaternion.setFromAxisAngle(
new CANNON.Vec3(-1, 0, 0),
Math.PI * 0.5
);

world.addBody(floorBody);

```

Ahora digamos que quiero no solo que se detenga si no que rebote ademas o tenga cierta friccion para ello usamos los materiales de cannon que nos permiten indicar como interactúan estos materiales 

```js
// Definimos que material queremos
const planeMaterial = new CANNON.Material("concrete");
const sphereMaterial = new CANNON.Material("plastic");

// Le pasamos los materiales que van a interactuar. 
const contactMaterialPlaneSphere = new CANNON.ContactMaterial(
  planeMaterial,
  sphereMaterial,
  {
    friction: 0.7,
    restitution: 0.9,
  }
);

world.addContactMaterial(contactMaterial);
```

Si bien podemos usar los materiales así , lo que podemos hacer es que crear un material por defecto que usemos en todo nuestros código        
```js
// creamos un material compartido 
const defaultMaterial = new CANNON.Material("default");

const contactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 0.7,
    restitution: 0.9,
  }
);

world.addContactMaterial(contactMaterial);

const shapeSphere = new CANNON.Sphere(0.5);

const bodySphere = new CANNON.Body({
  mass: 1,
  position: CANNON.Vec3(0, 3, 0),
  shape: shapeSphere,
  material: defaultMaterial,
});

// o tambien se lo podemospasar de forma general a todos otros elementos

const defaultMaterial = new CANNON.Material("default");

const contactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 0.7,
    restitution: 0.9,
  }
);

world.defaultContactMaterial = contactMaterial;

```


#### Forces 

Podemos aplicar fuerzas sobre nuestros elementos en cannon teniendo en cuenta dos conceptos desde dirección queremos aplicar nuestra fuerza x,y,z y  en que parte del cuerpo de nuestro obejto queremos que se vea afectado nuevamente un x,y,z


````js
// Aplicamos una fuerza en x y le indicamos que se a en el centro del elemento .

bodySphere.applyForce(new CANNON.Vec3(150, 0, 0), new CANNON.Vec3(0, 0, 0));
````


![[Adjuntos/Pasted image 20241009205659.png]]



### Performance 


Es importante ner en cuenta que las fisicas son trabajadas por la cpu no la gpu , la gpu se encarga de three js y cannon es trabajado por cpu por lo que podria tener problemas de optimizacion sin la configuracion por defecto

cannon usa de forma pro dafult native, que lo hace es que testea cada objeto con todos los demas sin importar la distancia para analizar si exite un colisión o interacción esto lo llamamos broadPhase

![[Adjuntos/Pasted image 20241009210057.png]]

Esto es util si en nuestra esena existen elementos que viajan a muy alta velocidad y aun asi queremos ver la colisión de estos con nuestros elementos . Sin emebargo de otro modo a solucion nativa no es buena para performance


**Opciones**:

GridBroadphase : crea una grilla donde por secciona agrupara nuestros objetos entonces en la misma celda evaluara a si misma y junto la celda de al lado y la de la parte superior  pero las que esten muy lejos no las testeara .

![[Adjuntos/Pasted image 20241009210619.png]]


	SAPBroadphase: Es muchisimo mejor que native y GridBroadphase










