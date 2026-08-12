
## Que son?

Con un conjunto de clases que [[Three js]] nos ofrece para poder propiedad físicas a nuestras [[Geomtrias]] como color , opacidad , [[Textures]] , metales ,vidrios etc.

#### Tipos de materiales 

**Basic Material** : Es una clase de three js que contiene parámetros como :

```js
const material = new THREE.MeshBasicMaterial({
	color, // colores
    map: doorColorTexture // Para Texturas
	alhpaMap , // Para texutras tipo alhpa map
	opasity , // opasidad de la geometria se debe convinar con uso de transparent
	transparent : true , // Crea transparencia a los objetos
	side : // permite ver determinas cuantos caras queremos que se vean double side por ejemplo permite ver las dos caras de la geometria
	wireframe ; // permite ver los triangulos internos de la geometria


```

**MeshNormalMaterial**  Es especialmente útil para cuando trabajamos con texturas normals , las normales representa la direccion  que estan apuntando nuestras caras de la geometria .

![[Pasted image 20241002142027.png]]

Este material recibe las mismas propiedades como opasity etc. son una nueva que se llama flatShading 

```js
material.flatShading = true
```
![[Pasted image 20241002141932.png]]

Dándonos esta vision de las caras de nuestra mesh

**MeshMatcapMaterial**  : Es un material que que tomas las caras de una geometria y en base al pixel de la imagen que le pasamos pintara esa cara en relaciona ese pixel de la imagen como un color picker de google pero para cada cara 

![[Pasted image 20241002143010.png]]

El problema es que estas luces son artificiales y no podemos controlarlas 
para usarlo
```js
const matcapTexture = textureLoader.load('./textures/matcaps/8.png')
const material = new THREE.MeshMatcapMaterial()

material.matcap = matcapTexture

```


**MeshDepthMaterial** : cambia los colores dependiendo de la cercania y lejania en relacion a un elemento ,es util para el manejo de sombras 

```js
  const material = new THREE.MeshDepthMaterial()

// THREE js usa depthpaking para almacenar de manera mas eficiente los colores !  
const depthMaterial = new THREE.MeshDepthMaterial({
	depthPacking: THREE.RGBADepthPacking
})  
```

![[Pasted image 20241002152129.png]]


**MeshLambertMaterial** Es un material que utiliza las propias luces presentes en la escena para la crear efectos sobre la geometría de los elementos no es muy realista pero el que tiene mejor perfomance de todos los materiales que usan luces

```js 
const material = new THREE.MeshLambertMaterial()

// Demos agregarle luces para que funcionen
const light = new THREE.SpotLight("yellow", 400)

light.position.set(2,4,-3)

const ambient = new THREE.AmbientLight("white",1 )

scene.add(ambient)

scene.add(light)
```

![[Pasted image 20241002154027.png]]

**Mesh Phong** Es como el anterior pero no sufre los problemas de los gliches  y permite crear reflaccion de luz etc.

```js
const material = new THREE.MeshPhongMaterial()



material.shininess = 100

material.specular = new THREE.Color("black")
```


**MeshToonMaterial** : Proviene de una técnica llamada cellShading que te permite pintar de forma mas tipo caricatura no enfocado tanto en lo real dando resultados como 
![[Pasted image 20241002155926.png]]
Le pasamos es un gradiente que usara como textura para ponerla sobr eel geometria

```js
// Si la imagen es muy pequeña se estrechara por ello es importante usar mag filter para poder adaptarse a mayor tamaño
const material = new THREE.MeshToonMaterial()

material.gradientMap = gradientTexture

gradientTexture.magFilter =  THREE.NearestFilter
```

![[Pasted image 20241002160443.png]]


**MeshStandardMaterial** Es el estándar en cuanto buscamos hacer renders realistas y queremos cumplir el PRB permite modificar propiedades como el metálico la rudeza de los elementos y mas , además permite usar texturas en el para crear efectos aun mas realistas

```js
const material = new THREE.MeshStandardMaterial()

material.metalness = 0.7

material.roughness = 0.2

```

![[Pasted image 20241002170317.png]]



## Como usar MeshStandardMaterial  y texturas


**Color**:

```js
material.map = doorColorTexture
```

![[Pasted image 20241002170538.png]]

**Ambient ocluccion**: los bordes negros les otorgara mas sombra o delineado fuerte

```js
material.aoMap = doorAmbientOcclusionTexture
// le podemos cambiar la intencidad
material.aoMapIntensity = 1
```

![[Pasted image 20241002171316.png]]

**DisplacementMap**:  Crea profundidad en las geometrías *nota es importante tener múltiples subdivisiones para asegurar que este map sea eficiente* .


````js
material.displacementMap = doorHeightTexture

// Le cambiamos el nivel de impacto .
material.displacementScale = 0.1
````

![[Pasted image 20241002171908.png]]

**Roughness y metalness**:

```js
material.metalnessMap = doorMetalnessTexture
material.roughnessMap  = doorRoughnessTexture
```


![[Pasted image 20241002173123.png]]


**Normals** Permite crear detalles en la mesh  sin la necesiad de necesariamente tener muchas subdivisiones permite crear profundidad en los detalles  y es realmente optimo.

```js
material.normalMap = doorNormalTexture
```

![[Pasted image 20241002173343.png]]


**Alhpaamp**: permite quitar bordes de la textura.

```js
material.transparent = true

material.alphaMap = doorAlphaTexture
```

![[Pasted image 20241002173559.png]]



MeshPychalMaterial:

Es una extencion de MeshStandardMaterial que ofrece algunas propiedades para agregar extra realismo, no es el mejor en el perfomance  . 


clearCoat

Crea una capa de vidrio alredor del objeto esta capa puede tener sus propias propiedades , este tiene cierto costo en performance.

![[Pasted image 20241002175220.png]]

```js
const material = new THREE.MeshPhysicalMaterial()

material.clearcoat =1

material.clearcoatRoughness = 0
```


Sheen : sirve para crear efectos de almuadas sillones dandole esta sensacion a "algodon"

![[Pasted image 20241002175650.png]]

```js
material.sheen = 1

material.sheenRoughness = 9

material.sheenColor.set(1,1,1)
```



iridescence son como las buirbujas o patrones genrados por discos como arcoiris deformados en metal o gasolina, si el entorno es demaciado brillante opaca o quita el efecto asi que hay quetner cuidadp especialmente cuando el material esmuy metalico.
```js
material.iridescence = 1

material.iridescenceIOR = 1

material.iridescenceThicknessRange = [ 100, 800 ]

  

gui.add(material, 'iridescence').min(0).max(1).step(0.0001)

gui.add(material, 'iridescenceIOR').min(1).max(2.333).step(0.0001)

gui.add(material.iridescenceThicknessRange, '0').min(1).max(1000).step(1)

gui.add(material.iridescenceThicknessRange, '1').min(1).max(1000).step(1)

```

![[Pasted image 20241002221432.png]]

![[Pasted image 20241002223156.png]]
![[Pasted image 20241002223615.png]]



Transmisiion : Sirve para crear nuestros materiales tipo vidrios a los cuales queremos atravesar visualmente 

![[Pasted image 20241002181314.png]] 

```js
const material = new THREE.MeshPhysicalMaterial()
material.metalness = 0
material.roughness = 0
material.transmission = 1
// El ior viene de indice de reflacion de los objetos en relacion a su ambiente cad aobjeto tiene su propio indise
material.ior= 1.5
material.thickness= 0.5
```