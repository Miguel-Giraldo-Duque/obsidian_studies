

### Como se hace?

Para ejecutar el headless en Cypres podemos simplemente indicarle 
`{`
 `"test:chrome": "cypress run --browser {navegador desedo}"`
`}`

podemos configurarlo en el pipeline de ci/cd para que se ejecute en diferentes navegadores .

Si queremos que algun test solo se ejecute en ciertos navegadores podemos

`describe(`

  `"Sign up validations",`

  `{`

    `browser: "chrome",`

  `},`
  
  y si solo queremos que se ejecute en todos menos en el indicado 

describe(`

  `"Sign up validations",`

  `{`

    `browser: "!chrome",`

  `},

