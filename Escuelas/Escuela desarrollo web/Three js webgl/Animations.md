

## Como usarlas

Una animación en [[Three js]] es como una foto por cada momento que en base a la cantidad de frames que tengamos este cambio se vera mas o rápidamente  aplicado en el [[Mesh]]


Dependiendo de la capacidad de cada pc pueden existir diferentes cantidades ffps
que indican cuantos frames se ejecutan por segundo 


Para trabajar con ella nos creamos una funcion que use requestAnimationFrame() esta se encarga de llamar a una funcion en el siguiente frame

````js
  

const tick = () =>{

    mesh.rotation.y += 0.01

  
	// Volvemos a renderizar el cambio para la camara y la esena por cada frame con los cambios pertinentes
    renderer.render(scene,camera)

// Le requestAnimationFrame que ejecute tick por cada frame
    window.requestAnimationFrame(tick)

}

tick()
````

Lo anterior funciona , sin embargo si esto es ejecutado en otra computadora como y en que velocidad se mueve el elemento dependera de los ffps de esa pc , para que a todos los dispositivos sea igual usamos Date o la fecha acutal  para igualar la velociad delos frames a esta


````js
  

let date = new Date()

const tick = () =>{

    let currentTime= new Date()

    let delta = date - currentTime

    mesh.rotation.y += 0.001 * delta

  

    renderer.render(scene,camera)

    window.requestAnimationFrame(tick)

}

tick()
````


### Elapsed time clock three js

Es una forma de crear un movimiento universal para todos los dispositivos en three js con una clase nativa de three js


````js

let clock = new THREE.Clock()

const tick = () =>{
// Te devuelve un contador de segundos no milisegundos como el anterior
    const elapseptime = clock.getElapsedTime()

  

    mesh.rotation.y = elapseptime

  

    renderer.render(scene,camera)

    window.requestAnimationFrame(tick)

}

tick()

````

## Usando gasp

Gasp es una libreria que nos permite animar elementos de una maneramas completa con delays tiempos etc 

````js
npm install --save gsap@3.12
````

Para usarla 
````js
import gsap from 'gsap'

gasp.to("elementoQueAnimamos", {duration: "" , delay : "", x:"" etc})
````





