

# Que es? 


Es una forma de trabajo que busca unificar equipos no técnicos con el equipo técnico, en un puente en común que permite a testers y devs, comunicar la funcionalidad real del producto y que se valida, esto se logra con [[Cucumber]]  y Genkis que permiten un lenguaje simple:

```js
// Feature
Feature: Login

    Scenario: Login with a valid credentials

        Given I am on the login page

        When I fill my "miguelgiradu" and "password"

        Then I should validate login
```


Entonces la idea de este sistema es :

- Permitir a equipos no técnicos y product owners involucrarse mas y asegurar mejor satisfacción al cliente con el comportamiento esperado.
  
- Permite notar huecos o casos edge que a nivel de negocio que preocupan y se expresan en un lenguaje en común.
  
