

En [[React]] los estados derivados se refieren a las variables que guardan la información de  los estados 

```js
const [notes, setNote] = useState([])


// Esto seria un estado deverivado
let lenghtOfNotes = notes.length 


// No se debe crear estados para los estados dervidos es una mala practica.

let lenghtOfNotes = useState(notes.length)


// Contraseña qnow
qnow_22?*jsreaper



```