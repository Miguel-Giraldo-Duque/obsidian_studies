

### Cuales son?

En [[React router]] son 3 tipos de rutas que podemos usar en nuestras aplicaciones :

- **Browser router** : `/` Con esta barra dividimos los links de la interfaz por `https:miguelito/inicio/contacto`  par dividir las pantallas esto viene con la desventaja de cuando desplegamos la aplicación en github pages por ejemplo , si el github pages no encuentra ningún archivo o carpeta que coincida con el nombre de la ruta nos daría un error , esta opción tiene un impacto en el ceo por url amigable , y en produccion necesitamos un servidor de verdad que administre las diferentes rutas.

- **Hash router** : `/#/`  Cumple la misma función de crear división y navegación en la interfaz , con la diferencia que nos permite indicar que siempre queremos renderizar un mismo HTML funcionando con el single page aplication .

- **Memory router** : Nos permite guardar en memoria las rutas , pero no nos especifica de forma especifica en cual nos encontramos es útil para aplicaciones de celular donde la ruta no es necesaria que sea visible. 



 