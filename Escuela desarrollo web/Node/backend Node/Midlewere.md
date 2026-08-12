
Espero les sirvan mis apuntes:  
**Crear middleware de tipo error:**

```jsx
//Creamos función que nos hará llegar a un middleware de tipo error:
function logErrors(err, req, res, next) {
  console.error(err); //mostrar el error en servidor para poder monitorearlo
  next(err); //importante para saber que se esta enviando a un middleware de tipo error, si no tiene el error dentro entonces se esta mandando a uno normal
}

// Crear formato para devolverlo al cliente que se complementa con la función anterior:
function errorHandler(err, req, res, next) { //así no se utilice next en el código se debe poner aqui, ya que un middleware de error tiene los cuatro parámetros
  res.status(500).json({ //indicar que el error es estatus 500 Internal Server Error
    message: err.message, //mostrar al cliente el mensaje de error
    stack: err.stack, //mostrar info del error
  })
}

module.exports = { logErrors, errorHandler }; //exportarlo como modulo
```

**Implementar middleware:**

```jsx
// Importar middleware
const { logErrors, errorHandler } = require('./middlewares/errorHandler'); //importar las funciones que se uilizarán
```

Los middlewares de tipo error siempre deben ir después de definir el **_routing._**

```jsx
routerApi(app);
// Utilizamos los middleware. Siempre deben ir después del routing:
app.use(logErrors);
app.use(errorHandler);
```

> _Es importante el orden en que se coloquen porque es el orden en que se ejecutarán. En este caso el logErrors es el único con un next, por lo tanto, si se colocará el errorHandler antes, ahí terminaría el proceso._

Además de lo anterior, el error se debe capturar de forma explicita en el router:

```jsx
// Encontrar un producto por su id:
router.get('/:id', async (req, res, next) => { //se agrega el next
  try {
    const { id } = req.params;
    const product = await service.findOne(id);
    res.json(product);
  } catch (error) {
    next(error); //se agrega el next para atrapar de forma explicita el error con el middleware
  }
});
```