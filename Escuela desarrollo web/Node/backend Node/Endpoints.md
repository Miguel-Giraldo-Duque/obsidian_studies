

## Que son ? 


En [[Backend node]] podemos usar  parámetros para renderizar  información especifica por ejemplo digamos que quiero recibir una id de un elemento lo podríamos hacer con req 


````js
// aqui agregamos una sueccion a la url el "/:" para indicar un parametro a ingresar en este caso id

app.get("/infoPersonas/:id", (req, res) =>{
// Para hacer uso del parametro utilizamos el req.id , id es solo un ejemplo si quiesieramos usar cualquier otro elemnto como req.nombre este debera conicidir con el valor de la ruta

  res.json(req.params.id)


````

