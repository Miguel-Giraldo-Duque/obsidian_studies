
## Que es? 

Sirve para eliminar viejas geometrías se us en [[WebGl]] para limpiar geometrías de la gpu 

```js 
// Le pasamos nuestra mesh y elminara la geometria guardada en la gpu

scene.traverse((child) => {
      console.log(child);
      for (const key in child) {
        if (child instanceof THREE.Mesh) {
        // Si es una mesh quitamos la vieja geometria
          child.geometry.dispose();

          const value = child.material[key];
// Si es un material verificamos si tiene un metodo dipose si es asi lo eliminamos
	if (value && typeof value.dispose === "funtion") {
	
            value.dispose();
          }
        }
// Accedemos al orbit controls y podemos eliminarlo y lo mismo que el renderer
       camera.orbit.dispose();
      renderer.instance.dispose();

// y con lil gui tambien podemos hacer el dispose .
          debug.gui.destroy();

      }
    });
```


Para quitar materiles y geomtrias 
````js
  const destroy = () => {

    scene.remove(fireWorks);

    material.dispose();

    geometry.dispose;

	 };
```

