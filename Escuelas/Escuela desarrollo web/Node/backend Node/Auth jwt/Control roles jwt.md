
## Como trabajar con ellos


Si queremos realizar la verificación de roles podemos utilizar los [[Closures]] que va a ser una función dentro de otra función para analizar los roles bastara con obtener la información de payload  


```js
  
// cuando usamos el "..." transformamos nuestros parametros en un array 
function checkRoles(...roles) {

  return(req, res , next) =>{

    const user = req.user

    console.log(user)
// Ahora solo demos saber si user resulta incluir el rol en los parametros el midelware continua   de otro modo lanza error
    if (roles.includes(user.role)) {

  

      next()

    }else{

      next(boom.unauthorized())

    }

  }

}
```
