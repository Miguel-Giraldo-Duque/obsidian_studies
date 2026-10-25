

### Que son?

Son imágenes que podemos poner sobre nuestras [[Mesh]] para darles efectos de textura o formas  . Existen varios tipo de texturas que se usan para crear estos efectos.


### Tipos de texturas 



## Color 

Es una textura que solamente toma el color de una imagen 

![[Pasted image 20241001185723.png]]


## Alhpa

Es un grey scale con blanoc sy negrso , depediendo del color la textura se pintara diferente  si es blanco se pintara y lo negro no y sies gris sera medianamente visible

![[Pasted image 20241001190022.png]]


### Height map


Se basa en crear detalles para una geometría dada la cantidad de subdiviones que esta tiene , generando movimientos en los vértices del plano por ello  entre mas vértices mas se podrá ver los detalles de la textura el movimiento estara determinado por el color  si es color blanco los vértices irán arriba , si son negros hacia abajo , si son grises permeasen quietos 

![[Pasted image 20241001190552.png]]
Creando un reliebe
![[Pasted image 20241001190632.png]]


### Normals 

Los normals no usan subdiviones se le pasar a un objeto un noral como texura a un plano sin subdiviones por medio de las luces de la esena este tipo de textura de agrega a las diferentes partes de la textura la sencion de profundidad
![[Pasted image 20241001190929.png]]


### Ambient oclucion

Es un grey scalae que toma ángulos pintados en negro y les sombreado a estas zonas mientras que al blanco no lo tocara

![[Pasted image 20241001191643.png]]


### Metalness

Se al efecto metálico de nuestras texturas por que  toma que solo colores blancos el negro no conciderara metálico , siendo mas metalico tendrás refracción de lo que tiene su entorno 

![[Pasted image 20241001191852.png]]

	
### Roughness

Se refiere a la dispersión de la luz en la superficie de un material. A mayor **roughness** (rugosidad), la luz se difumina más y refleja menos, dando como resultado un aspecto mate, como el de un metal oxidado o envejecido. A menor roughness, la luz se refleja de manera más precisa, resultando en una superficie más brillante o pulida.

![[Pasted image 20241001192347.png]]


#### PRB

La mayor parte del tiempo los artistas de blender y otras plataformas a través de cálculos algoritmos etc tratan de crear elementos lo mas parecidos posibles a su comportamiento en la vida real  


### Como usar las texturas?


Primero necesitamos importar las imanes , instaciamos clase nativa de js Image y le pasamos la ruta donde se ubica nuestra imagen . Si estamos usando [[Vite]] podemos poner nuestras imagnes en el static y darnos una mas clara que si lo importásemos

```js

// instacimos
let image= new Image();

// Traemos la clase texture de three js
const texture = new THREE.Texture(image)

// Esperamos el evento de load de imagen 
image.onload = () =>{

	//  Le indicamos three js que como el nombre indica se actualize si es necesario
    texture.needsUpdate = true
}

image.src = "./textures/door/color.png"
```

Es una opción sin embargo, podemos hacerlo mas fácilmente

```js
// Instamos la clase
const loaderTextures = new THREE.TextureLoader()    
// le pasamos nuestra ruta , esta funcion ademas recibe un error progress start
const textureColor = loaderTextures.load("/textures/door/color.jpg")
// Le indicamos el encodeSrgrb para evitar perdidas de color en la textura dado que por defecto three js maneja los colores de forma lineal cuando le indicamos a SRGB estamos adaptando esos colores a la sesiviliad de lo humanos el linear es usado para los normals y data
texture.colorSpace = THREE.SRGBColorSpace

```

Si quisiéramos el estado de carga de nuestras texturas incluso modelos fuentes etc podriamos usar   loaderTextures sin embargo no es tan eficiente como si usamos la clase loaderManager() de [[Three js]]

```js
// Nos ofrece onStart , onLOad; onProgress, onError para indentificar diferentes estados de carga
const managerPapa = new THREE.LoadingManager()

managerPapa.onStart = () =>{
    console.log("Iniciando carga")
}

managerPapa.onLoad = () =>{
    console.log("exito en la operacion de importacion")
}

managerPapa.onProgress = () =>{
    console.log("Cargando bb")
}

managerPapa.onError = () =>{
    console.log("Error en la carga revisa la direccion")
}

const loaderTextures = new THREE.TextureLoader(managerPapa)    
```
