
##  Que es?

En el contexto de la [[Autentificación y autorización]], primero nos autenticamos ante un guardián, como por ejemplo utilizando [[Passport.js]] y sus métodos de login. Sin embargo, ¿Cómo gestionamos los permisos una vez autenticados?

Anteriormente, se empleaban cookies para manejar las sesiones. Estas cookies contenían la información de inicio de sesión que se enviaba al backend para su verificación. El problema surgía cuando usábamos múltiples nodos; por ejemplo, si el nodo A almacenaba la información de sesión de un usuario y el cliente se conectaba al otro día al nodo B, este último no tendría acceso a la sesión y podría cerrarla involuntariamente.

Es aquí donde entra JWT (JSON Web Token). Esta herramienta nos proporciona un token de acceso que normalmente se guarda en el local storage del cliente. El token contiene información sobre los permisos del usuario en la aplicación y tiene una duración definida por nosotros. Una vez que expira, se cierra la sesión, lo que obliga al usuario a iniciar sesión nuevamente para obtener un nuevo token.

La estructura de un JSON Web Token se divide en tres partes:

- **Header**: Indica el algoritmo de encriptación utilizado.

- **Payload**: Contiene la información encriptada, como los detalles del usuario sin embargo no conviene ingresar información sensible basta con ingresar un identificador y  los permisos mas información como contraseñas podría verse comprometida al ser desencriptado .

- **Verify Signature**: Proporciona una clave única o un "secret "para la verificación. Esta clave nunca debe ser expuesta y solo debe ser manejada por el backend.

Para trabajar con el firmado de nuestros tokens podemos utilizar otras librerias pero jwt ya nos recomienda algunas como:

````bash
npm install jsonwebtoken
```` 

Ahora teniendo en cuenta los anteriores tres parámetros podemos generar nuestro propio token 


````js
// Nos traemos dtenv para administrar las variables de entorno

require("dotenv").config()

// Traemos la libreria
 const jwt = require("jsonwebtoken")

// Tambien le podemos decir en que tiempo expira nuestro token con
const jwtConfig = { expiresIn: '30s', };


// Aqui ingresamos la informacion del usuario normalmente el minimo de sintaxis necesario es poniendo el campo "sub" que funciona como indetificador del usuario universalmente

const payload = {

  sub: 1,
  role: "cliente"

}



function signToken(payload, secret, config) {
// Usamos sign le pasamos nuestro payload y el secret 
  return jwt.sign(payload, secret,config)

}

// Le pasamos el secret como varible de entorno por seguridad

const token = signToken(payload,  process.env.JWT_SECRET , jwtConfig)

  

console.log(token)

//(Header)eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.(Payload)eyJzdWIiOjEsInJvbGUiOiJjbGllbnRlIiwiaWF0IjoxNzE4ODIxNDczfQ.(Verify Signature)R5tg7GVwR9SO571pNyt0zZQj3qjK17q7y09KNfJKzoU

```` 

Para verificar el token  

`````js
require("dotenv").config()
const jwt = require("jsonwebtoken")

  

const secret = "mydog";

  

function verifyToken(token, secret) {
	// Muy similar con sing solo que le pasamos el token y no el payload
  return jwt.verify(token, secret)

}

  
  

const verify = verifyToken(token,  process.env.JWT_SECRET)

  

console.log(verify)
// Nuestra infromacion desencriptada gracias a la clave secreta :
//{ sub: 1, role: 'cliente', iat: 1718821473 }
`````
