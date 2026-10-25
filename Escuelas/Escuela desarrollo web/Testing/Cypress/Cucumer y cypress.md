
### ¿Como usarlos?


Para usar [[Cucumber]] en [[Escuelas/Escuela desarrollo web/Testing/Cypress/Cypress]] solo requerimos dos librerías principales, el preprocesador de cucumber para Cypress y de transpilador webpack que nos ayudara a funcionar como un traductor que cuando se encuentre la sintaxis:

**/*.feture: Pueda entender que es el Given, Then etc.

hacemos la instalación de:

```npm
npm i @cypress/webpack-preprocessor @simonsmith/cypress-image-snapshot
```

entonces en el archivo de config de cypress 

```js
import * as webpack from "@cypress/webpack-preprocessor";

import * as prepocesor from "@badeball/cypress-cucumber-preprocessor";


await prepocesor.addCucumberPreprocessorPlugin(on, config);

// Aqui indicamos que antes de transpilr esperamos que este codigo sea traducido al js que el navegdor puede ejecutar para entender la prueba.

  on(
    "file:preprocessor",
    webpack.default({
      webpackOptions: {
        resolve: {
          extensions: [".js", ".ts"],
        },

        module: {
          rules: [
            {
              test: /\.feature$/,
              use: [
                {
                  loader: "@badeball/cypress-cucumber-preprocessor/webpack",
                  options: config,
                },
              ],
            },
          ],
        },
      },
    }),
  );
```


Luego dbeemos cambair el spec pattern para que cypress ahora busque este nuevo patron para sus pruebas:

    specPattern: "**/*.feature",
