
## Child Process

En node podemos crear procesos hijos que ejecuten cualquier accion de nuestro sistema operativo, como si nos encontraramos en la linea de comandos.

Podemos llamar a `exec` para ejecuciones sencillas:

```js
const { exec } = require('child_process')
exec('ls', (e, stdout) => {
    (e) ?
    console.log(e) :
    console.log(stdout)
})
```

Podemos llamar a `spawn` para obtener el proceso: _La ventaja de este enfoque es que obtienes mayor control del proceso, y del estado en el que se encuenta_

```js
const { spawn } = require('child_process')
const myprocess = spawn('ls')

process.stdout.on("data", data => console.log(data.toString()));
process.on("exit", () => console.log("process end"));
```