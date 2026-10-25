
### Como funciona?

Cuando trabajamos con HTML en aplicaciones tradicionales, el navegador hace una solicitud al servidor cada vez que cargamos una nueva página. Esto significa que con cada clic en un enlace, el servidor debe responder con un archivo HTML completo, lo cual es manejable en aplicaciones pequeñas. Sin embargo, a medida que el número de páginas o la complejidad del contenido crece, estas solicitudes pueden volverse difíciles de gestionar, afectando el rendimiento y la experiencia del usuario.
![[Adjuntos/Pasted image 20250122192731.png]]


[[React]], como librería para construir interfaces, utiliza el enfoque de aplicaciones de una sola página (SPA, Single Page Applications). **En una SPA toda la estructura principal de la aplicación se carga una vez, y las actualizaciones posteriores solo modifican el contenido necesario** con javascript sin recargar la página completa.

![[Adjuntos/Pasted image 20250122194058.png]]

Aquí es donde entra React Router: en lugar de permitir que el navegador haga una nueva solicitud al servidor para cada ruta, React Router intercepta los eventos de navegación (como clics en enlaces) y utiliza el historial del navegador para actualizar la interfaz de usuario. Esto se logra renderizando dinámicamente los componentes asociados con cada ruta.

Esto lo logra usando la History Api del navegador que le permite conocer los eventos que suceden en la navegación y en que pagina se encuentran.


Para usarlo solo debemos 


```npm
npx create-react-router@latest
```


