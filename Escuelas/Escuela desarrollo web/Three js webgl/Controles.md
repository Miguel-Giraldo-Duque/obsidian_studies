

## Cuales son?


En JavaScript nativo con los addEventListeners podemos crear una logica que nos permita traformar con [[Operaciones de transformacion]] de [[Three js]] un ejecto de cambio dinámico 


````js
window.addEventListener("mousemove", (event) =>{

    mousePosition.x = event.clientX / sizes.width -0.5

    mousePosition.y = - (event.clientY / sizes.width -0.5)

})
````


donde obtengo esos valores con el event que luego puedo usar ,  para girar entorno a un cubo podemos usar el cos y sin que cuando se juntan en mismo ángulo me dan la posición en un circulo 


````js

  // Usamos math Math.PI para crear una vuelta comleta perfecta 
    camera.position.x = Math.cos(mousePosition.x * Math.PI * 2) * 3

    camera.position.z = Math.sin(mousePosition.x * Math.PI * 2) * 3

````


Sin embargo three js ofrece multplies alternativas nativas de la libreria para solventar algunos de estos problemas ofreciendo multilpes opciones


### Firts person controls

Se refiere a una vista como de un pájaro útil para el recorrido de entornos que no ofrece rotación como tal


### Pointer lock controls

Quita el mause y te permite un movimiento mas paronímico e inmersivo 


### Orbit controls 

Como el nombre indica nos permite orbitar y movernos en nuestro entorno en múltiples maneras  pero tiene limitaciones en la rotación para los ángulos

para usarlo debemos tener en cuenta que no esta en la clase principal de THREE js
hay que importalo con

```js
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

// Lo instanciamos debemos pasarle nuestra camara y canvas 

const controls = new OrbitControls(camera, canvas)

// si el movimimiento resulta muy agrsivo podemos usar damping que suavisa estos moviemintos
controls.enableDamping = true

// Para que se aplicado correctamente el damping de debe estar en render de frames 

controls.update()
```


### TrackBall control

Es como orbit controls sin embargo no presenta limites en el movimiento de ángulos


### TranformControls


Permite mover y editar  elementos no la camara 



### DragControls

Permite mover agarrar  efecto en three js