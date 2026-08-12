
### Cuales son y para que?

```ts
	
let miguel: string = "Jun";
let edad: number = 18;

// Es importante no abusar del uso de any, por que quita capacidad al manejo de ts de los tipos, en casos donde desconocemos el tipo de datos usamos unknow 
let id : any 
// Mejor, son valores desconocidos en tiempo compilacion permite asignar cualquier valor pero fuerza al dev de crear valdiaciones par realizar operaciones 
let id: unknown;

// Usado cunaod una funcion no devulve nada
function logger(message: string): void {
  console.log(message);
}

// Cuando la funcion no tiene fin o este rompe cilos o errores.
function logger(message: string): never {
	throw new Error("ERROR TEST") 
} 

// Tambien podemos  definir en una funcion lo que va devolver sse string number arrray etc. 
const sendAMessage = (message: number): string => {
  const firma: string = "MGSW";
  return `Tu mensaje aquí. ${firma} ${message}`; //

};

// Tambien podemos definir valores por defecto o opcionales en TS
  
const sendAMessage = (message: number , language: string = "spanish", country?: string  ): string => {

  const firma: string = "MGSW";

  return `Tu mensaje aquí. ${firma} ${message}`; //

};

console.log(`Soy ${miguel}
 ${edad} ${fantasia} ${accion()}`);
```