
### Que es?


La gui es una interfaz que nos permite cambiar propiedades de nuestros objetos como colores , animaciones efecto etc permite crear showcases para los diseñadores y general incluso hacer un "debug" increíblemente util con [[WebGl]]

Existen librerías como lil-gui para lograr este objetivo que lo podmeos intalar con [[npm]]


```npm
npm i lil-gui
```

La importamos como :
```js
import GUI from "lil-gui"

// La instanciamos, le podemos pasar un objeto con propiedades como colores tamños y demas al gui

const gui = new GUI({
    width: 300,
    title: "Configuraciones"
	// etc.
})

```



---

### Que Twueks ofrece?


+ Rango de mínimos a mayores valores
+ Colores 
+ CheckBox Booleanos (true o false)
+ Texto
+ Select
+ buttons



### Rango

Permite cambiar a una propiedad de un objeto :

```js
// range objeto , propiedadAmodificar, min, max , step
gui.add(mesh.position , "y", 0.3, 3, 0.01)
```

Usar funciones para clarificar en código como en [[Shaders Paterns]]

```js
gui.add(mesh.position , "x").min(-3).max(3).step(0.01)
```


### Checkbox

Permite afectar a los valores booleanos funciona igual pasamos el objeto y luego la propiedad que queremos modificar

```js
// Checkbox

gui.add(mesh , "visible")

gui.add(material , "wireframe")
```


### Color

En three js existen algunos problemas con la modificación de problemas debido a la forma en three js trabaja los colores , los cambios en nuestro gui no son los mismos que tiene three js internamente para solucionarlo 
```js
// Creamos un objeto 

let objectGui = {

    color: "#c42121"

}

// Actualizamos al objectGui NO a three js directamente

gui.addColor(objectGui , "color").onChange(() =>{
		// Usamos el metodo set para mandar el nuevo color  
    material.color.set(objectGui.color)

})

```


### Funtions / button

Es improtnate tener en cuenta que para usar funciones deben exitir dentro de un objeto actuando como método para la función

```js

// Buttons o funcines
objectGui.spin = () =>{

  

    gsap.to(mesh.rotation, { duration: 1 , y: mesh.rotation.y + Math.PI * 2,})

    mesh.rotation.z = Math.PI * 2

}

  

gui.add(objectGui, "spin")
```




### Folders

Para mejor organizacion podemos crear deplegable nombrados para agrupar nuestros tweks

```js

let cubeConfig = gui.addFolder("CubeConfig")
// range

cubeConfig.add(mesh.position , "y", 0.3, 3, 0.01)

cubeConfig.add(mesh.position , "x").min(-3).max(3).step(0.01)


// Podemos usar gui.close() para cerrar toda la gui

// Tambien podemos ocultar la ui con

gui.hide()

// Y para volverla a abrir
window.addEventListener("keydown", (e) =>{

    if (e.key == "h") {

        gui.show(gui._hidden)

    }

})



```