

### Que es un render?

En [[React]] al renderizar nos referimos a ejecutar una serie de funciones(Componentes) y ejecutar las funciones anidadas es decir decir los componentes hijos, dependiendo del tipo de los [[Elementos y componentes]]  determinara que debe renderizar si es component o un etiqueta normal.
![[Pasted image 20260321104034.png]]

Y hara esto recursivamente hasta que todo el DOOM este completo.

### Por que pasa un re-render?

Un componente se reconstruye por estos tres motivos principales:

- **El padre componente se actualiza**:  
```jsx
const Component = ({props}) => {
const [state, setState] = useState()
// Aqui el estado del padre se acutaliza, entonces react lanza un rerender que va recorrer todos los demas componentes hijos y revisa por cada uno si su "type" cambio de referencia causando que todos los hijos se reactualizen
return <>
<button onClick={setState((prev) => prev + 1)}/> 
<Child1 />
<Child2 />
<Child3 />
</> 
}
```
 
 **Sus props cambian**:  
```jsx
// Si las props que recibe component son diferentes en REFERENCIA en memoria react generara ejecutara todo el componente y subHijos , es decir aunque nombre="Miguel" apellido="Giraldo" siguen teniendo el mismo valor si su objeto de referencia de props cambio entonces recontuye todo su arbol interno
const Component = ({nombre, apellido }) => {
return <>
<Child1 />
<Child2 />
<Child3 />
</> 
}
```

- **El state cambia**:
  
```jsx
const Component = ({props}) => {
const [state, setState] = useState()
// Al cambiar el estado este componente se re evaluara y recontruira obteniendo el nuevo valor
return <>
<button onClick={setState((prev) => prev + 1)}/> 
<p>{state}</p>
</> 
}
```  

#### Como es este ciclo de verificación de re-render?

Inicia desde el punto origen del cambio en react y  baja en el arbol haciendo lo siguiente

1. Reconstruye los objetos de element  
![[Pasted image 20260321105805.png]]
2. Va a revisar con verificación shallow que las referencias entre el anterior objeto y nuevo objeto element sean la misma referencia sin ver los valores internos
   
 3.  Si la referencia es la misma react no re-renderiza ese componente y se salta todo los componentes internos a su vez 
```jsx
const ComponentContent = ({children}) => {
return <>
	{children}
</> 
}

const Component = ({props}) => {
const [state, setState] = useState()
return <>

// Llega aqui lo revisa ve que es un boton normal y simplemente lo comparte al DOOM
<button onClick={setState((prev) => prev + 1)}/>

//Al disparase la actualización react llega aqui y pregunta a ¿ComponentContent tienes un prevElementObj === nextElementObj? si este responde que la referencia es la misma es decir true, react no lo recontruye y tampoco a los hijos de ComponentContent, y simplemente sigue con los demas elementos.
<ComponentContent> 
	<Child1 />
	<Child2 />
	<Child3 />
<ComponentContent/> 

// Al react recontruir todos los element objects por cada trigger cuando llega a este componente revisa el nuevo vs el viejo objeto y concluye que son distintos por referencia recontruyendo todos los hijos de Component2 y a este mismo  
<Component2 />
</> 
}
```



### Como se diferencia un Re-render a un Re-mouting?

[[Re-mounting]]  se refiere cuando reconstruimos un componente desde 0, incluso cuando ninguna de sus props o valores de interés le hallan llegado,  es un proceso costoso que fuerza a [[React]] a trabajar innecesariamente.

Por otro lado Re-render, es una estrategia que aplica React para que cuando tiene un elemento, y cambio algun estado asociado, solo buscara cambiar unicamente las props del componente solo si los types coinciden.

Si los types coinciden solo re ejecuta la función del componente con lo nuevo que devuelva, permitiendo mantener el estado al no desmontar el componente



```jsx
const Input = () => {
const [state, setState] = useState()
return <>
<input value={state}, onChage={(e) => setState(e.target.value)}/>
</> 
}

const Component = ({props}) => {
return <>

// React compara las referencias, las cuales seran diferentes los types === types nuevo, si es el mismo, entonces compara los valores de regreso, si difieren entonces 
    <Input />
</> 
}
```



### Re-render arrays 

