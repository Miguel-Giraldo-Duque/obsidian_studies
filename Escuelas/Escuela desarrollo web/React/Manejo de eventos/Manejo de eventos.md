	

## Que es un estado 


Un estado  en [[Escuela desarrollo web/JS/React/React]] es la forma en que podemos crear en react una interactividad en nuestras paginas permitiendonos modificar , construir y generar cambios en la renderizacion en base a las desiciones de nuestros usuarios .



## Como usarlo 


Para utilizarlo es simple 


1 . Existen dos partes para utilizar un estado 



Donde el **estado inicial** habla de un estado preterminado que ya tiene algun elemento 

mientras que el segundo argumento habla de nuestra capacidad de decirle al estado anterior preterminado que cambie 

```js
	const [estadoInicial ,  setearUnNuevoEstado] = React.useState("")

````


Ejemplo

```js
	const [estadoInicial ,  nuevoValor] = React.useState("Pepe")

	<p>{estadoInicial}</p>

	// Aqui inicialmente va a tener el estado preterminado "pepe"

// Pero si podemos un event listener que nos permita escuchar los cambios hechos por el usuario podremos modificar el valor previo "pepe" a "Juan"
	
 <button onClick={() => nuevoValor("Juan")}>oe</button>,

````


 
// Se usa el "() =>" en funciones como nuevoValor()   debido a que al existir  parentisis al final react renderizara la funcion incluso sin existir ningun tipo de interaccion por parte del usuario   .