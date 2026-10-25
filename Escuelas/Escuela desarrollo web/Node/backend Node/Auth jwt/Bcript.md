
## Que es ?

Bcript es una Liberia de [[Node]] que nos permite el cifrado de contraseñas y se puede usar de la siguiente manera

Lo instalamos
````npm
npm i bcrypt
````


y para usarlo 
```node
	// Llamamos la libreria
	const bcrypt  = require("bcrypt")
	// Para hacer el cifrado usamos bcrypt.hash(elementoAcifrar, CuantasVeces lo cifro)

	async function hashinPassword(params) {

  const hash = await bcript.hash(params, 10) // Aqui le estoy diciendo que cifre 10 veces el valor traido por los parametros de la funcion

  console.log(hash)
// return $2b$10$zHpJocHMQ29VnK7zwdcM5OikbMhX5j4IYoyFPuntve96Evs2yaspm
}
	
```

Si quiero comparar o saber si mi contraseña es correcta uso brycpt.compare() para realizar la verificacion entre la contraseña ingresada y el hash


````js

const password =  "21123123q"

  

async function verify() {

  const mypassowrd = password

  const hash = "$2b$10$zHpJocHMQ29VnK7zwdcM5OikbMhX5j4IYoyFPuntve96Evs2yaspm"

  // el primer valor como la contraseña a comprobar y el hash de la contraseña
  const compare = await bcript.compare(mypassowrd, hash)

  console.log(compare)

}

  
  

verify(password)
````