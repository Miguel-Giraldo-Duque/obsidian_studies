

### Como funcionan?

En [[Cypress]] podemos usar `get`  una utilidad que nos permite consultar por valore en el doom y buscar donde quizas solo por la clase , o id no tenemos disponible

##### Metodos:

**Find** : Busca un texto , clase o valor dentro de un elemento especificado en el getter, devolviendo el elemento especifico que contiene ese valor

`cy.get(".producto").find(".precio")`
`// ↓ Esto retorna: <span class="precio">$50</span> y <span class="precio">$30</span>`


**Contains** : **Busca en TODO el contenido de los elementos encontrados** basado en get entregado

`cy.get("div").contains("Calavera roja compresion")`
`// ↓ Esto retorna: <div class="producto"> (el div completo)`



### Como compartir valores entre tests? 

Es clave compartir valores reciduales digmos de otro test para que el otro lo valide use o rpelique minimanzndo codigo repeditod en [[Cypress]] par logrrlo solo tenemos que :

cumplir estos requisitos:

- Debe usrse el this 
- Par ausr el this deemos usar funtion() y no arrow funtion y que las arrow no tienen contexto propio
  
```js
  it("D", function () {
  // Obtenemos el h1 le invocamos el vlor para poder guardarlo y compartirlo entre tests
    cy.get("h1").invoke("text").as("titulo");
  });

  it("Visit main prpduct page", function () {

// Obtenemos con el alias que le asignamos el valor correspondiente es importante que el alias es recomendable que gurde valores directamente y Jquery pra un mejor mnejo
    expect(this.titulo).to.eq("Tienda metalera");

    cy.visit("/auth/signup");

    cy.get("input")

      .parents("form")

      .then(function (element) {

        // Encontrar todos los labels

        const labels = element.find("input");

  

        // cy.pause();

        expect(labels.length).to.eql(5);

  

        cy.task("logger", `Test incomig ${this.titulo}`);

      });

  });
  
  
  // Tambien es util conciderar agregar el before o before eahc de ese modo nos aseguramos que los this siempre esten disponibles primeramente
  
   before(() => {

    cy.visit("/auth/signup");

    cy.get("h1").invoke("text").as("titulo");

  });
```
