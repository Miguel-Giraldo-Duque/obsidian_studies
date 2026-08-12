

## Como logro ?


Por ejemplo cuando estamos trabajando con [[Apis]] es importante dividir las capas de acceso que tienen los usuarios a nuestros servicios 

Normalmente las apis profesionales como la de chatgtp te piden una api key 
para que accedas a las rutas 

Para usar estas podemos hacer un middleware que funcione como capa de analizis inicial a la ruta y verificarla existencia de la api key

````js
// Podemos usar boom para lanzar un error de unatoriazdo en caso de que la apikey sea diferente a "123"

const boom = require("@hapi/boom")

  

function checkApiKey(req, res, next) {

  const apikey = req.headers["api"]

  

  if (apikey === "123") {

    next()

  }else{

    next(boom.unauthorized())

  }

}
```` 

