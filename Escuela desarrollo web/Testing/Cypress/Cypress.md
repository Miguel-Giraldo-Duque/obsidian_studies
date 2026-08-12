

### Que es ? 

Cypress es una herramienta para  el [[Testing]] que nos permite de forma eficiente y de robusta implementar pruebas de tipo e2e , o pruebas end to end donde nos permite directamente interactuar con el doom y crear pruebas siguiendo una estructura muy similar  a vists


```js

// Tenemos un describe para el suit de pruebas
describe("Sign up validations", () => {

// Los its 
  it("Visit main prpduct page", () => {

// Podemos usar Cy sin importar y directamente para enviar a una pagina en especifico usamos visit
    cy.visit("/auth/signup", {

      failOnStatusCode: false, // Esto permite que continue aunque de 500

    });

	
  // Obtener todos los labels y validar que esten 
  // todos os campos y get nos facilita esta tare en su gran medida.l
    cy.get("input")

      .parents("form")

      .then((element) => {

        // Encontrar todos los labels

        const labels = element.find("input");

// Al usar el then obtenemos el input o inputs obtenido como un 
// Jquery al cual por ejemplo podemos obtner una lista de todos los inputs 
        expect(labels.length).to.eql(5);

      });

  });

});

```
