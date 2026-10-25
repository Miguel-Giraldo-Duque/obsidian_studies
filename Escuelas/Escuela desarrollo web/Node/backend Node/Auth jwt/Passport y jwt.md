
## Como trabajan juntos

Bueno sabemos que con[[Passport.js]]  hicimos el login y con [[JWT]] sacamos el token , ahora el reto nace en como aplicar una verificación de este token en nuestras rutas para ello haremos uso de la librería 


````bash
npm i passport-jwt
````

Esta librería nos proporciona un método `fromAuthHeaderAsBearerToken()`, que extrae el token del encabezado de la solicitud y verifica si se desencripta correctamente con nuestra clave secreta.


Para empezarlo a usar debemos de :

````js
// Llamos a Strategy y a la proiedad "ExtractJwt" 
const {Strategy, ExtractJwt} = require("passport-jwt")
require("dotenv").config()
const secret = process.env.JWT_SECRET
// Le inidcamos que vamos a extraer el token del header de nuestra solicitud y le pasamos el secret que creamos para los token
const options = {

  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey : secret

}

// Luego como el passport local creamos una instancia de una nueva estrategia con tres parametros las opciones para que obtenga el token y lo verifique ademas del el payload y el done 

const JwtStrategy = new Strategy(options, (payload, done) =>{

  return done(null , payload)

})

  

module.exports = JwtStrategy

````


Para usarlo en la ruta al igual que con passport local solo demos indicar 
````js
// Antes indicabamos el local ahora para hacer referencia al jwt debmos ingresar el nombre 
 passport.authenticate("jwt", {session:false}),
````


Usamos `passport-jwt` debido a sus ventajas para trabajar con tokens. Al recibir el token desde el encabezado, podemos analizar y verificar su contenido de manera eficiente sin tener que crear toda la estructura de Bearer Token por nosotros mismos

Ademas 