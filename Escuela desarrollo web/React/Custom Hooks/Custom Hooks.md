

## Como se hacen 


Siempre para crear nuestros propios hooks necesitamos empezar con la palabra use,
esots son utiles por que nos permiten crear nuestras porpias funciones de renderizacion aprevechando al maximo los mismos hooks de [[Escuela desarrollo web/JS/React/React]] 


`````js

funtion useChangeMyName(params){

const [name , setNewName] = React.useState(parmas)

funtion change(){
	setNewName("Miguelito ")
}

return{
	name,
	change

}
}

funtion app {
	const cambiadorDeNombres =  useChangeMyname("No tengo nombre ")
	const cambiadorDeNombres2  = useChangeMyName("Quisiera tener nombre")

	<p>{cambiadorNombres.name}</p>,

    <button onClick={cambiadorNombres.change}>Cambia mi nombre</button>,
   
   <p>{cambiadorNombres2.name}</p>,

    <button onClick={cambiadorNombres.change}>Cambia mi nombre</button>,

}
}
````` 



// Las principlaes ventajas de utilizar nuestros propios hooks es que nos permite  reutilizar un codigo y reutilizarlo en diferentes partes de nuestra paginas sin tener que afectar la legibilidad de nuestro codigo  acelerando el proceso de desarrollo :) 