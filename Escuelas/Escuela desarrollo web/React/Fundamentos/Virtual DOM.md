

### Que es?

El virtual dom en [[React]] , es una version de react del dom real, construdio a partir de objetos traduciendo etiquetas o components en lo que finalmente nos permite mostrar lo elementos en la UI

pero por que un virtual Dom? , tradicionalmente crear un componente y modificar sus valore con la api del dom era complejo, react busca ser inteligente y en lugar de recontruir por ejemplo todo un  elemento si puede solo actualiza su atributo es decri tenemos estos tres estados


**Mount**: Es la primera vez que react monta el elemento `<div/>` o mi `<Componente/>` aqui el determina como contruir el doom donde:

 - String  `div` : Cuando ve el string literal guardado de la etiqueta la renderiza y convierte directamente al dom
 
 - Componente  `<Componente/>` : Un componente es una función, que react va a ejecutar y recorrer todo el arbol de objetos que retorna, y llendo a profundidad de cada una de las ramas
   

**Unmount**: Sucede cuando React detecta que el componente deja de estar visible, cambio su type, o su `key` es diferente, por ejemplo 

 ```jsx
  {
   isOpen === true ? <Modal /> : null
  }
 ```

React compara por posicion en el arbol de objetos entonces, de forma ordenada uno con otro.
![[Pasted image 20260331115404.png]]
Entonces  al comparar el nuevo arbol con el anterior el modal no esta en la misma posición entonces  ¡Ah!, `<Modal/>` ya no esta!, lo desmonta y elimina directamente del arbol de objetos.
![[Adjuntos/Pasted image 20260331115623.png]]

![[Adjuntos/Pasted image 20260331120049.png]]
**[[Re-renders]]**:  Al Cambiar un estado o una prop React disparara una orden para reconstruir el arbol completo desde el punto donde se inicio el trigger, comparando sus valores internos y finalmente determinar si debe desmontarlos, montar, o solo actualizar  es la intension original de los rerenders.

React comparara por posición los componentes y elementos el array, si:

1. type Igual: Si es igual solo actualiza el componente y sigue ejecutando el subtree
2. type diferente: Lo marca como que requiere unmount



![[Adjuntos/Pasted image 20260414160214.png]]

![[Adjuntos/Pasted image 20260414160153.png]]



