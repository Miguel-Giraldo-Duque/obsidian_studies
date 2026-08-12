
## ¿Qué es Passport?

Passport es una librería que proporciona un conjunto de estrategias para la autenticación. Aunque podríamos crear nuestros propios métodos de inicio de sesión, Passport ofrece múltiples maneras de hacerlo, permitiéndonos usar autenticaciones a través de GitHub, Google, LinkedIn, y métodos locales, entre otros.

En este caso, vamos a usar la estrategia local de Passport, que funciona con el tradicional nombre de usuario y contraseña.
Para instalarlo :


````npm
//Para hacer uso de cualquier estrategia de passport debemos instalar passport y seguido de la estrategia que queramos usar 

npm i passport passport-local

````

Para empezarlo a usar

````js
// Nos traemos el módulo passport-local que es un objeto con diferentes propiedades a usar.
// Utilizamos la desestructuración para obtener únicamente la propiedad {Strategy} del módulo passport-local.
const {Strategy} = require("passport-local")

  
  
// Ahora creamos una instancia de strategy dado que es un contructor 
const localStrategy = new Strategy()

  
  
// Exportamos la varible instaciada
module.exports = localStrategy

````

Ahora podemos empezar a usar el local passport 

```js

// Para usar la instancia tenemos 3 parametros username, password , done donde "done" funcionara para las respuestas correctas  y para los errores

// "A través de done(), proporcionamos los siguientes parámetros: `done(error, user, info)`. Primero, el parámetro 'error' se establece en `null` si la autenticación fue exitosa o se pasa el error específico en caso de fallo. Para el parámetro 'user', se proporciona `false` si la autenticación falla, indicando que no se encontró el usuario, o se envía la información del usuario si la autenticación es correcta. El parámetro opcional 'info' se utiliza para incluir detalles adicionales, como mensajes de error específicos, como 'nombre de usuario incorrecto'."

const localStrategy = new Strategy(async(email, password, done)=>{

try {
      const user= service.findByEmail(email)
// Digamos que falla la verificacion le pasamos el error en este caso no autorizado  y le decimos que la validacion fallo 
      if(!user){

        done(boom.unauthorized() , false)

      }
// Si salio todo bien debemos devolver null y el usuario en cuestion
      done(null, user)

  } catch (error) {
    done(error,false)

  }
})
````



Listo sabiendo lo anterior si queremos usarlo podemos utilizar la siguiente lógica

````js
// Traemos a todo el modulo de passport 
const passport = require("passport")

// Traemos la instacia de estrategia previamente hecha 
const loca_strategy = require("./strategies/loca_strategy")

// Le decimos a passport la estrategia a usar la ventaja de trabajar de este modo es que si quisieramos usar otras estrategias simplemente le tendriamos que pasar la instacia  a passport.use() y funcionaria

passport.use(loca_strategy)
````



Una vez hecho nuestro passport ahora lo unico que debemos hacer es incluirlo en nuestro router para que nuestra aplicacion pueda 