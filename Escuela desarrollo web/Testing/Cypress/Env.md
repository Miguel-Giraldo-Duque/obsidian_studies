
### Como se usa?

En [[Cypress]] podemos utilizar y crear variables de entorno de diferentes formas:

1. Ir al archivo config y agregar ls variable para acceder con Cypress.env()
   
```js
import "dotenv/config";

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
    env: {
// Sera accesible con Cypres.env()
      apiUrl: "https://api.open-meteo.com/v1/forecast",
    },
  },
});
```

2.  Agregarlas en el comando del package JSON tener en cuenta que debemos ser cuidadosos con los espacios entre variables
   
   ```json
  "scripts": {

    "test": "echo \"Error: no test specified\" && exit 1",

    "server": "json-server --watch db.json",
// Declaramos con el flag --env
    "cypress:env": "cypress open --env apiUrl=https://api.open-meteo.com/v1/forecast,latitude=6.2518,longitude=-75.5636,environment=staging"

  },
   ```
   
   3. Importarlas desde el file env  y crearla en el setup del config de cypress:
   
```js
import "dotenv/config";

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
	  config.env.DB_URL = process.env.DB_URL || "";
      config.env.DB_NAME = process.env.DB_NAME || "";
      config.env.DEBUG = process.env.DEBUG || "False";
      
      // Es clave retornar el config para aplicar los cambios
     return config
  },
});
```