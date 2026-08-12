

### Que es?

Es un herramienta que soporta el framework de [[DBB]] o desarrollo basado en comportamientos, este usa el lenguaje Gherkin para expresar en lenguje natural como se espera que se comporte el software, facilitando involucramiento de partes no técnicas en el trabajo  y mejorando colaboración


```js
// Feature
Feature: Login

    Scenario: Login with a valid credentials

        Given I am on the login page

        When I fill my "miguelgiradu" and "password"

        Then I should validate login
```