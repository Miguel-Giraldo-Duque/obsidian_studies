
## Que es la programación orientada a objetos? 


Es una metodología de [[javascipt]] que nos permite organizar elementos de modular siguiendo por una clase , un objeto y sus atributos

Ejemplo

Una clase puede ser una fabricante de autos , esta puede tener varios modelos  de carros (instancias) cada uno de ellos con propiedades que  heredan de la fabrica pero con sus propias características. 

```js
// Se trabaja con PascalCase
// Al usar "this" le pasamos el contexto de la variable a toda la clase
class FerrariClass {
  constructor(nameModel, price) {
    this.nameModel = nameModel;
    this.price = price;
  }
}

let auto = new FerrariClass("coupé", 200);

```


Una clase puede heredar propiedades de otra clase 

```js
class AutoClass {
  constructor(nameCompany, ubication) {
    this.nameCompany = nameCompany;
    this.ubication = ubication;
  }
}


class FerrariClass extends AutoClass {
  constructor(nameCompany, ubication, nameModel, price) {
    // Llamamos al constructor de la clase padre para inicializar las propiedades heredadas
    super(nameCompany, ubication);
    this.nameModel = nameModel;
    this.price = price;
  }
}
// Ahora podemos pasarle las propiedades de 
let auto = new FerrariClass("ferrari", "italia", "coupei", 200);



```

Metodos permiten ejecutar funciones para que estan almacenadas dentro de la clase


```js
class AutoClass {
  constructor(nameCompany, ubication) {
  // Podemos AutoClass en la consola para debbugin
   window.AutoClass = this;
    this.nameCompany = nameCompany;
    this.ubication = ubication;
  }

changeUbication(){
	console.log(`new ubication ${ubication} `)
}
}
```


Ejecutar métodos sin perder contexto :

```js
// Las arrow funtion heredan el contexto de su entorno permitiendoles que no se redifina el contexto como en una funcion normal
this.sizes.on("rezise", () => {
    this.resize();
});
```

