

## Como funciona?


En [[React]] se usa esta herramienta en conjunto con [[Use state compuest]]   para manejar múltiples estados y tendremos algo llamado actions que seran la que le indicaran al estado que estado actualizar 

![[Adjuntos/Pasted image 20240913120251.png]]

![[Adjuntos/Pasted image 20240913120341.png]]

La logica general es :


```js
// usamos useReducer que necesita de la funcion que actualiza los estados y un estado incial paralos mismos 


  const [state , dispatch] = useReducer(reducer, initialState)


// Necesitamos un estado inicial para todas nuestros estados 
const initialState = {

    error:false,

    loading: false,

    valueInput: "",

    deleted: false,

    confirmed: false,

}


// Tenemos un objeto con keys para identificar cada cambio en nuestros estados 

    

const reducerObject=   (state , payload)  =>({

    "ERROR": {...state, error:true, loading: false },

    "LOGIN": {...state, loading: false , error: false , confirmed: true},

    "CHECK":{...state ,loading:true},

    "WRITE":{...state, valueInput: payload},

    "DELETE": {...state ,deleted:true},

    "CANCEL": {...state ,confirmed:false}

})

// luego creamos una funcion que retorne la key que coincide con le valor de busqueda asignado por un type y podemos pasarle tambien el payload o el contenido del estado :
const reducer = (state, action) =>{

    if (reducerObject(state)[action.type]) {

        return reducerObject(state, action.payload)[action.type]

    }else{

        return state

    }

}

```


Sin embargo podemos enfrentar una problematica si dejamos las keys sin protección por ello hacemos loq ue se llaman actionTypes :


```js

// un conjunto de nuestras acciones que le pasmos a nuestros actualizadore y nuestro objeto de recuducers
const actionTypes = {

    error : "ERROR",

    login: "LOGIN",

    check: "CHECK",

    write:"WRITE",

    cancel :  "CANCEL",

    delete: "DELETE"

}
```

Existe un manera de ser aun mas declarativo y es usar custom hooks combinado con las anteriores tecnicas :
```js

// Creamos el hook al que vamos usar para los elementos de la ui lo llamen mas legibelmente  le pasamos el dispatch con la accion en cuestion y listo !
const onError = () =>{

        dispatch({type: [actionTypes.error]})

    }
  // Ademas podemos destructurar la informacion que nos entregan los eventos sin tener que hacer arrow funtions
  const onWrite= ({target})=>{

        dispatch({type: [actionTypes.write], payload: target.value})

    }
```
