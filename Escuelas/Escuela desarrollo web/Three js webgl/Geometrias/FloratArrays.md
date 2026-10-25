

## Que son?

Son array que solo reciben como parámetros elementos flotantes y solo pueden alcanzar un rango definido , son altamente eficientes  dado que le permiten a la computadora no sufrir en exeso con el procemiento de las posicione por ejemplo de los elementos 3d su estrcutura aplicada a un posicionamiento dado que el array es de una sola dimencion le pasamos los tres valores por cada vertice : 

![[Adjuntos/Pasted image 20240916212330.png]]

Si son tres vertices por ejemplo un triangulo le definimos solo esos tres valores con las posiciones

```js
const positions = new Float32Array([
// x, y , z
    0,0,0,

    0,1,0,

    1,0,0

])
```


Luego instamciamos la clase buffer que nos permite crear estas geomtrias :


```js
const geometry = new THREE.BufferGeometry()


// Ahora de demos creaer el atributo que le vamos a pasar al buffer , atributo que contendra las posicicones del float 33
  

const attributeBuffer = new THREE.BufferAttribute(positions, 3)

  

geometry.setAttribute("position", attributeBuffer)

Listo ahora solo debemos agregar nuestra geometria y listo
	

```
