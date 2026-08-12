

### Que es ? 

Es una clase que representa los selectores de interacciones o los elementos claves que requerimos de al aplicación y los centralizamos en un espacio, donde al existir un cambio en el sistema y cambia los selectores solo tenemos que cambiar en un lugar creando también un código mas limpio 


```js
export class LoginPage {
// Definimos los elementos
  elements = {

    usernameInput: () => cy.get("#user_login"),

    passwordInput: () => cy.get("#user_password"),

    loginButton: () => cy.contains("Sign in"),

  };

  

  visit() {

    cy.visit("http://zero.webappsecurity.com/login.html");

  }

  

  newLogin(username, password) {

//Verficamos disponibilidad y entonces interactuamos
 this.elements.usernameInput().should("not.be.disabled").type(username);

    this.elements.passwordInput().should("not.be.disabled").type(password);

    this.elements.loginButton().should("not.be.disabled").click();

  }

}


```