

## Que es


En [[Three js]] un mesh es  objeto visible en nuestro navegador que se compone de una geometría es decir la forma del objeto  y el material como se va a ver

en three js para que crear ambos debemos 

Para la geometría debemos usar :

```js
const geometry = new THREE.BoxGeometry (1,1,1)// Estos parametros definen el tamañao del objeto donde esel ancho alto y la profundidad 
```

Ahora creamos el material como se va ver este nuevo objeto

```js
// Para crear el material le pasamos un objeo en este caso usamos la propiedad color	
const material = new THREE.MeshBasicMaterial({color: "red"})
```

Finalmente para construir nuestro cubo debemos juntar el geomtry con el material

```js
const object = new THREE.Mesh(geometry, material) 


// Lo agregamos a la esena para que exista en ella

scene.add()
```


***pero y si quiero verlo?


Para eso usamos las cámaras three js usa algo llamado renderer que rendizaraza en un canavas una especie de foto de nuestra esena basado en la posicion y propiedades de nuestra camara en este caso usaremos [[Perpective camera]]


```js
//Camera
const camera = new THREE.PerspectiveCamera(75 , 800 / 600)
  
scene.add(camera)
```

Ahora usamos renderer que nos permite tratar y renderizar ese cnavas creamos un canvas en el html y no lo traemos al js y se lo pasamos al renderer

```js
const renderer = new THREE.WebGLRenderer({
	canvas: canvas
})

//Ancho --- altura
renderer.setSize(800,600)

// seteamos la camara en z para poder ver nuestro cubo

camera.position.z= 3

// Ahora le decimos que renderize nuestra camra y scene

renderer.render(scene, camera)
```

Y nos aparece nuestro resultado


![[Adjuntos/Pasted image 20240727175728.png]]


Nuestro cubo que actualmente








