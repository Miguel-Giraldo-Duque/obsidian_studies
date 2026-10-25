
## Como se logra?


Cuando trabajamos con  materiales modificados buscamos tomar los [[Materiales]] nativos entregados por [[Three js]] y inyectarle nuestros propio código [[Shaders]]  , de este modo nos apoyamos en el trabajo hecho por la libreria y no tenemos que reacer todo el shader para poder lograr aplicar nuestros propios efectos!

Para lograrlo debemos entender que en three js utiliza el "#include" para traer chunks de codigo shader para realizar ciertas acciones , para poder acceder a los valores internos podemo hacer

```js
//Tenemos un material de referia en este caso MeshStandardMaterial
const material = new THREE.MeshStandardMaterial({
  map: mapTexture,
  normalMap: normalTexture,
});
// Ahora antes de que compile el material cambiamos el include que este caso nos trae la "position" y nos da la opcion en segundo valor de cambiar los valores.
material.onBeforeCompile = (shader) => {
  shader.vertexShader = shader.vertexShader.replace(
	// El chunk que queremos modificar
    "#include <begin_vertex>",
    // El nuevo contenido
    "#include <begin_vertex> ....."
  );
	};
```