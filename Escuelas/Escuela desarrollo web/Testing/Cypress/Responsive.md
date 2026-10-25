### Como se maneja? 

Como [[Escuelas/Escuela desarrollo web/Testing/Cypress/Cypress]] maneja el responsive es utilizando la palabra clave  `´cy.viewport´` que recibe `(width, height)` , también permite recibir heights y anchos predefinidos

`

```js 
 it("Deberia traer la tarea en loclasotrage", () => {
    // Definimos el viewport antes de visitar
    cy.viewport("iphone-5");
    cy.visit("https://chat.deepseek.com/");
    // Realizamos las verificaciones responsive.
    cy.contains(
      "Only login via emai"
    ).should("exist");

  });



```