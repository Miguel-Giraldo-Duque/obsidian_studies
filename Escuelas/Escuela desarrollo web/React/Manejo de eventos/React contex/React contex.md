


¿Que es el [[Escuela desarrollo web/JS/React/React]] Context?

- Es una herramienta de React que permite compartir estados a través de nuestros diferentes componentes de la app.
- Esto a partir de Providers y Consumer.
- Nos ayuda a reducir la cantidad de props que tengamos que compartir en todos los elementos de nuestros componentes.

Ejemplo:

```
//Archivo para usar React Context
const TodoContext = React.createContext();

//TodoContext se convierte asi en un Provider y un Consumer del método createContext.

function TodoProvider(props) {
	//Logica de tu app
	return (
		<TodoContext.Provider value={  { //propiedades (estados) que quieras compartir} }
			{props.children}
		</TodoContext.Provider>
}

export {TodoContext, TodoProvider};
```

Asi envovlviendo tu componente <AppUI> con <TodoProvider> compartes los estados que necesites con el restos de tu app (sin necesidad de recibirlas mediante props) de la siguinete manera:

```
//Dentro del componente App UI
<TodoContext.Consumer>
	{ value => { 
		//estados que tu componente va a necesitar 					usandando value.{estado}
		 }
	}
</TodoContext.Consumer>
```