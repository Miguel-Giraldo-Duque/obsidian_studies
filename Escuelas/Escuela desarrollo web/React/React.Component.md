

## Que es?


Es una forma de trabajar un poco antigua en react absada en clases por ejemplo

```js

 constructor(props) {

        super(props)

  

        this.state = {

            error: false

        }

    }

    render(){

        return(

            <div>

                <h2>{this.props.name}</h2>

                <p>Codigo de seguridad con clases </p>

  

                <input placeholder='Codigo aca'></input>

                <button>Enviar!</button>

            </div>

        )

    }

}
```

Usamos el this para acceder a props y this.state() para trabajar con [[use State]]
Le pasamos super para inicializar las propiedades  de react component  y pasarle nuestras propias props

Para actualizar el estado 
````js
  <button onClick={() => this.setState(prev => ({error: !prev.error}))}>Enviar!</button>
````

Usamos setState de ahi la convencion de usar set En todos los estados en react


Si queremos hace efecto en [[React]] en la vercion antigua usamos


````js
    componentDidUpdate(){

  

        console.log("Actualizando")

  

        if (this.state.error) {

            setTimeout(console.log("Exisitio un error en la validacion ") , "3000")  

        }

    }
   // solo se actualiza si la condion es verdad de otro modo se actualiza infitamente
````

Por ello son como los parametros el [[Use Effect]] tradicional