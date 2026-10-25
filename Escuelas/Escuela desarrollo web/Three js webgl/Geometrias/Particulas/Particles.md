

## Como funcionan ?

En [[Three js]] tenemos la opción de crear nuestras propias particulas es  como el proceso de las [[Mesh]] con su propia geometría y materiales para hacerlo debemos :

```js
// Le pasamos la geometria que queramos 
const pointsGeometry = new THREE. (1, 32 , 32)

// Le pasamos un material para las particulas

const particlesMaterial =  new THREE.PointsMaterial()

// El tamaño de la particula
particlesMaterial.size = 0.02

// efecto de perpectiva elementos mas cerca mas grnades mas lejos mas pequeños
particlesMaterial.sizeAttenuation = true


// como paso final creamos el "mesh" de points 

const points = new THREE.Points(Pointsgeometry, particlesMaterial)
```

podemos también crear nuestras propias [[Geomtrias]] y pasárselas al  [[FloratArrays]]
por ejmplo :

````js
const count = 50000

const Pointsgeometry =  new THREE.BufferGeometry()

// Creamos un array de 3 filas que representan nuestras posiciones
const array = new Float32Array(count * 3)

  

for (let i = 0; i < array.length; i++) {

	// Centramos los valores con -0.5 y les damos mas rango de generacion con el 10
    array[i] = (Math.random() -0.5) * 10 ;

}

  

const atrr = new THREE.BufferAttribute(array, 3)

  

Pointsgeometry.setAttribute("position", atrr)
````


El motivo por el que Math.ramdom() da esta forma de cubo es causado por que se distribuyen unifórmenle en los 3 sentidos xyz


podemos agregarle [[Texturas]] a nuestras particulas aunque van a existir problemas con los bordes presentes en nuestras particulas pues alugnas de estas ocultaran lo que esta detras de ellas dado su psocicion en el alfa

![[Adjuntos/Pasted image 20240917171325.png]]


En el map "normal" se tienen estos bordes que ocultan lo que esta detrás de nuestra partícula restándole realismo incluso si le decimos al 
## Soluciones:

### 1. Usar `alphaTest`:

- **`alphaTest`** es una técnica que indica a la GPU no renderizar píxeles que tienen un valor alfa por debajo de un umbral específico. Esto reduce el problema de los bordes visibles, ya que los píxeles con un valor alfa bajo no serán dibujados.

`particlesMaterial.alphaTest = 0.01;`

- **Nota**: Esto solo funciona para eliminar píxeles completamente transparentes (alfa cercano a 0). Si necesitas transiciones suaves, no será la mejor opción.

### 2. Desactivar `depthTest`:

- **`depthTest: false`** desactiva la comprobación de profundidad, lo que significa que la GPU renderizará todas las partículas sin verificar si unas están delante o detrás de otras.

`particlesMaterial.depthTest = false;`

- **Uso recomendado**: Esta opción es útil si solo tienes partículas en la escena y no te preocupa el orden en el que se dibujan.

### 3. Desactivar `depthWrite`:

- **`depthWrite: false`** indica a la GPU que no escriba la información de profundidad (la posición en el espacio 3D) de las partículas en el buffer de profundidad. Esto significa que no influirán en otros objetos en la escena que también usen el buffer de profundidad.


`particlesMaterial.depthWrite = false;`

- **Uso recomendado**: Esta opción puede ser útil cuando tienes una mezcla de objetos 3D y partículas, ya que previene que las partículas afecten el renderizado de los objetos sólidos


Un estilo extra que podemos darle a nuestras particulas es  addtiveBlending

```js
particlesMaterial.depthWrite = false
particlesMaterial.blending = THREE.AdditiveBlending
```

crea un efecto de bloom  en nuestros elementos

![[Adjuntos/Pasted image 20240917185813.png]]

### Blending techines

DST El detino lo que ya estaba en mi esesna

src lo que estoy dibujando ensima