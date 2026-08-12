

## Que son?

Es una librería de [[Three js]] que nos permite crear nuestros propios efectos de materiales sin la necesidad de usar el material comun, esta libreria utiliza variables para ser usados en nuestros [[Shaders]] con ciertas libertades que nos facilitan el proceso

--- 
*Instalacion*

```js
npm i three-custom-shader-material
```

Para usalo solo demos hacer un uso de el material fisic y traer **SOLO** la clase
de pyhcic material:

```js
const material = new CustomMaterialShader({

    // CSM

	 baseMaterial : THREE.MeshPhysicalMaterial,

    vertexShader : vertexShaderSphere,

    fragmentShaderSphere: fragmentShaderSphere,

  
  
  

    // Phycal material

    metalness: 0,

    roughness: 0.5,

    color: '#ffffff',

    transmission: 0,

    ior: 1.5,

    thickness: 1.5,

    transparent: true,

    wireframe: false

})



// Shaders usmos csm para las variables 
#include ../includes/simplexNoise4d.glsl

void main (){
    float wobble =  simplexNoise4d(vec4(
        csm_Position,
        0.0

    ));

    csm_Position += wobble * normal;
}

```

