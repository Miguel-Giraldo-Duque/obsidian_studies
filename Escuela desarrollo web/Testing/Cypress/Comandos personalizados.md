
### Como usarlos?

En [[Cypress]] los comandos personalizados son útiles para reducir complejidad y centralizar operaciones repetitivas donde por ejemplo una llamada a  una API , una verificación a tablas, un extractor de rows etc. 

para construir un nuevo comando basta con 


```js
Cypress.Commands.add("checkWeatherMedellin", () => {

  cy.request({
    url: "https://api.open-meteo.com/v1/forecast?latitude=6.2518&longitude=-75.5636",
    method: "GET",
  });

});
```

Entonces para usarlo podemos

```js
describe("Custom Commands", () => {

  it("Deberia verificar el clima en Medellin", () => {

    cy.checkWeatherMedellin().then((response) => {

      console.log(response.body);

      expect(response.status).to.eq(200);

    });

  });

});
```


y que pasa si quiero mejorar un comando?


Aquí podemos usar overwirte que nos permite modificar una función nativa de cypress o directamente sobrescribirla

```js
// Solo tenemos que devolver la función original con las modificciones y nuevos valores

// Recibimos 4 elementos originalFn , element, text , options
Cypress.Commands.overwrite("type", (origanlFn, elment, text, options) => {
  if (options && options.sensitive) {
  // Podemos desactivar o activar propiedades de la función
    origanlFn.log = false;
    const formattedtext = String(text).toUpperCase();

  

    Cypress.log({

      $el: elment,

      name: "type",

      message: formattedtext,

    });

  

    return origanlFn(elment, formattedtext, options);

  }

  

  return origanlFn(elment, text, options);

});
```