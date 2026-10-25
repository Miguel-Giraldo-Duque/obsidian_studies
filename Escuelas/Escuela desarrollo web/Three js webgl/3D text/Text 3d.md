

## Como funciona?


en [[Three js]] tenemos esta [[Geomtrias]] que nos permite crear texto 3d en nuestro render , para usarla debemos tener en cuenta dos cosas nuestras fuentes deben venir en formato fontface

```js
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'

import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

const fontLoader = new FontLoader()
  

fontLoader.load(

    "/fonts/Montserrat Medium_Regular.json",

    (font) =>{

        const geomtryText = new TextGeometry(

            `En un mundo de ahogados me diste ....

            `,

            {

                font: font,

                size: 0.5, // tamaño 

                depth: 0.3, // Profundidad letra

                curveSegments: 3, // Cantidad de segmentos en curvas bjar para resultados mas optimos

                bevelEnabled: true, // para cear bevel

                bevelThickness: 0.03, // el grosor del bevel

                bevelSize: 0.02, 

                bevelOffset : 0,

		                bevelSegments: 5 // segmentos del bevel

            }

  

        )

  

        const textMaterial = new THREE.MeshBasicMaterial({color : "blue"})

        const text = new THREE.Mesh(geomtryText, textMaterial)

  

        scene.add(text)

    }

)
```

![[Adjuntos/Pasted image 20241003195009.png]]
De forma preterminada nuestro texto no esta centrado. existen diferentes métodos que nos permiten lograr centrar nuestro texto por ejemplo


### Bounding

El **bounding** es una caja invisible que utiliza Three.js para gestionar el **frustum culling**, es decir, un renderizado inteligente de los objetos en nuestra escena. El bounding funciona como una caja o esfera alrededor de nuestros objetos, que Three.js emplea para calcular la posición de estos elementos. Basado en si los objetos son visibles o no desde la perspectiva de nuestra cámara, el motor decide renderizarlos o no, optimizando así el rendimiento.


![[Adjuntos/Pasted image 20241003195457.png]]


```js
	// Trasformamos del bounding de esfera a box
      geomtryText.computeBoundingBox()
	// acedemos a los vertices y posicones de la box de la geometria y buscamos centrarlas.
        geomtryText.translate(
            - geomtryText.boundingBox.max.x * 0.5,
            - geomtryText.boundingBox.max.y * 0.5,
            - geomtryText.boundingBox.max.z * 0.5
        )
```


o tambien podemos centrar con :

```
// hahaha :(

geomtryText.center()
```


