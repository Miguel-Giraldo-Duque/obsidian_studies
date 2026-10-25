

## Que son ?

Son como entornos dentro de las mismas funciones que permiten acceder a las diferentes variables que existen en el contexto de una funcion

ejem

`````js
funtion nme(){
	const oe = "Manito"
	console.log(oe)
	funtion(){
		const res = "contameelo menor"
		console.log(res, oe)

		funtion(){
			const pregunta = "Entonces que como va? "
		console.log(oe, res , pregunta) // Cada vez que crean {} estamos contryendo un closures que nos permiten acceder a cada varible dentro de la funcion
		}
	}
}
`````