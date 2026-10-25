

### Que son?

Son tesst poco confiables que resultan en fallo no perce por un error en codigo, si no por facotes externos  la prueba en si, como la api falla, un texto cambia y no se reintenta, es clave que para contruir test duraderos y adaptables debemos pensar en reitentos y mejores pracgticas como:



##### Single query

Debemos buscar resumir en un query de obtención de un elemento y  su búsqueda de contenido para facilitar  cypress el reintento de la búsqueda

```js 
 it("Deberia traer la tarea en loclasotrage", () => {
    // Mal X
    cy.get("#iphone-5");
    cy.contains("Nuevo iphone");
    
    // Cypress reintentaara todo el query en conjunto, desde obtenerlo hasta verificar ele contenido, mejorando :
    // Debbuing, Y tolerancia a largo plazo.
        cy.contains(
     // Definimos el elemento 
	 "#iphone-5",     
      "Nuevo iphone"
    ).should("exist");

  });

```


##### Evitar alternar entre obtención y interacción

Es importante evitar alternar entre búsqueda e interacción inmediata, esto puede causar interacciones prematuras antes de que el sistema pueda interactuar correctamente

```js 
 it("Deberia traer la tarea en loclasotrage", () => {
    // Obtenemos el elemento al asegurar la integridad de la interacción continuamos
 cy.contains(
	 "#iphone-5",     
      "Nuevo iphone"
    ).should("not.be.disabled").click();
  });

```

##### Retries 

Podemos configurar a cypress para que realize reintentos de la prueba en general dándonos mas robustez cuando el problema excede nuestro código , como errores de conexión , api etc.

```js 
    retries: {
    // Cuando lo corremos en modo headless
      runMode: 2,
    // Cuando lo corremos desde la UI. 
      openMode: 2,
    },
```

