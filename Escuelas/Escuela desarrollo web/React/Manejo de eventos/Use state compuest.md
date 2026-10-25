

## Como funciona ?

En [[React]] podemos hacer que los estados puedan manejar múltiples variables como en react component .


````js
	    const [state, setState] = useState({

        error:false,

        loading: false,

        valueInput: "",

    })
// para acceder al elemento state.miElemento  y para setear nuevos valores podemos usar el setState({miCampo: nuevoValor })

		// Para prevenir erroes copia el   setState({...state, loading: true})con el spread operator para copiar los otros valores y nos se elimine la existencia
		      

````