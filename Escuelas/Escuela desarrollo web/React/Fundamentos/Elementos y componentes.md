
### ¿Como funcionan?


Un componente en [[React]] es una función que puede recibir en su primer parámetro las props, y que devuelve un elemento de react algo como esto

```jsx
// Esto es una funcion destructuramos las props, pero al final sigue siendo una función
const Component = ({props}) => {
	
// Aqui estamos retornando un React.createElement(child, null, null), pero usamos el sugar sintax de <Child />
return <Child />
}
```

Al final `<Child/>`  es un element, que al final se traduce a un objeto, que hasta que no ser devuelto en el render función no se convierte en el elemento visible en el doom,  que se puede ver algo asi: 
```jsx
// Child
 {
 type: Child // Basado este campo react determina si dee renderizar esto, al ser un componente lo renderizara y si es un "div" comun o otra etiqueta la convierte al doom directamente.
 props:{...}
}
```




