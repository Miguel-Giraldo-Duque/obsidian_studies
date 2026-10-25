
### Que es?

Sucede cuando [[React]], determina que el componente necesita ser reconstruido desde 0, incluso cuando no cambio en esencia, esto sucede normalmente por que definimos el componente hijo dentro del padre, creando una referencia inestable en la función y su retorno `type`, al re ejecutarse la función del componente React.createElement() entonces:
	
```js
const Padre = () => {
  const Hijo = () => <input />; // Se crea una FUNCIÓN NUEVA en cada render  
  return <Hijo /> ;
}

 {
   type: Input ... // la referencia al componente en el objeto retornado ser distinto entregando un nuevo entonces para react al ser componentes distintos ejecuta todoa el proceso de unMount y mount de vuelta perdiendo todo el estado interno. 
  }
```
