


## Que es ?


El local storage es un espacio en el cual el navegador nos permite guardar informacion de forma local  , permitiendo perdurar esta infroamcion en el tiempo incluso si se cierra una pagina  ,  aactualiza etc 


## Como lo uso 

Para agregar un elemento al localStorage  utilizamos el localStorage.setItem("key" , valorAGuardar) este valor a guardar siempre debe ir como un string 


```js

let peter = localStorage.setItem("Persona1" , "peter")

```



Para obtener un elemento previamente guardado en el localStorage se usa el localStorage.getItem() a este se le pasa un unico argumento y es el key o el nombre del espacio donde guardamos nuestra informacion previamente .

```js

let peter = localStorage.getItem("Persona1")

// peter 

```
