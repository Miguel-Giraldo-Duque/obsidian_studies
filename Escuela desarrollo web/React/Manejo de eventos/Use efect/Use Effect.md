

## Que es ?


Use Effect hace parte del [[Manejo de eventos]] de [[Escuela desarrollo web/JS/React/React]]  , este nos permite ejecutar un efecto especifico dada una condición pasada a  la función normalmente  esta función   debe cumplir una una única misión ejemplo : 


````js
const [actual , SetCambio ] = React.useState("Migue")
const [actual2 , SetCambio2 ] = React.useState("Lina")

 useEffect(() =>{
	console.log("Me ejecute") 
})

// Cuando no Ponemos nada como segundo argumento a la funcion esta se ejecutara cada vez que se rendirize el componente  

// Podemos pasar como segundo argumento una dependencia que cada vez que cambie un  valor se ejecute la funcion 

SetCambio("Juan")

 useEffect(() =>{
	console.log("Se cambio el valor") 
} [actual])
 
// Se pueden Poner mas dependencias al useEffect para que no escuche solo un cambio si no que sea resecptivo a otros

 
SetCambio("Juan")
SetCambio2("Kia")

 useEffect(() =>{
	console.log("Se cambio el valor") 
} [actual , actual2 ])
 

```