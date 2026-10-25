
### Que es ?


React-Fiber es un nuevo sistema de reconciliación que permite gran mejora, su principal objetivo es mejorar las capacidades de [[React]] para manejar prioridad en el momento de actualizar elementos.

**¿Por que es esto importante?**

[[javascipt]] es un lenguaje de single thread, que quiere decir que trabaja solo una misma linea, cualquier cambio o nuevo solicitud no sera realizada hasta que la tarea actual sea terminada.

Imaginando el main thread como un solo trabajador fullstack y nuestro codigo como el lead

![[Pasted image 20260415201906.png]]


Este comportamiento implica una antigua limitación muy importante de React, y es que en su stack de reconciliación no podia priorizar cambios urgentes, como:

- Escribir en un input
- Presionar el boton

Quedando envueltos en algunos casos en trabajos de baja prioridad creando una mal responsive 

#### Como Fiber lo solventa?

Fiber utiliza el `requestIdleCallback` del navegador que entrega React un espacio pequeño en el thread para que React procese la reconciliación

![[Pasted image 20260415202331.png]]

Es en esos pequeños espacios donde Fiber entra en juego.

Un **Fiber es una unidad de trabajo, asociada a una instancia de un componente o elemento**, esta unidad puede ser de 3 tipos

- **Padre**: Este es el punto mas alto de todo el three o Subthree
- **Child**: Los hijos del padre
- **Siblings**: Los hermanos que básicamente son hijos del mismo padre  
![[Pasted image 20260415205655.png]]
Si el hijo no tiene mas hijos, entonces se marca como CompleteWork() y se mueve hacia el silbing repitiendo este 
Fiber ira de arriba hacia abajo 
![[Pasted image 20260415203807.png]]

1. Recorre el `<Continer />` tiene al hijo `<Card />`
2. `<Card />`  tiene un hermano `<Input />` 
3. `<Input />`  tiene a su vez el hijo `<Text />` 

Fiber inicia así
**Fase de reconciliación**: Ira a la unidad de trabajo ejemplo `<Card />` y iniciaría el proceso reconciliación verificara si requiere actualizarse, si así lo requiere lo etiquetara y guardara e la `lista de cambios`
 
  - **Reconciliation**:  Luego se moverá al hijo  si este hijo no tiene mas subhijos entonces, se mueve hacia el sibling y así por todo el nuevo three que en realidad se llama  
  
	**Work In Progress Three**
	Funciona de modo que fiber clona los objetos de la previa version del [[Virtual DOM]] y crea este Three de trabajo donde realizara las revisiones y verificaciones, que al finalizar su trabajo simplemente cambia al puntero en memoria para que se convierta el current three.

-  **Commit**: Aquí es donde empezamos aplicar los cambios marcados en la  `lista de cambios` en esta fase se vuelve ininterrumpida 
 
 
### Pero entonces como Fiber maneja la prioridad aquí?

Cuando indicamos un cambio de alta prioridad Fiber moverá rápidamente a todos de la fila, y llevara los cambios urgentes al incio, lanzando todo el previo trabajo por el workInProgress y priorizando generar los cambios para este cambio para que se reflejen tan pronto como sea posible.

![[Pasted image 20260415204125.png]]


En esencia Fiber es una arquitectura mas eficiente para trabajar el proceso de reconciliación de React, dando la opción de parar interrumpir y continuar.





Info de la prenda de reciclar. 


Info del usuario que creamos de la prenda y materiales de esa prenda.  De cuantos dueños han tenido


Quizas como camisas de ropa  firmadas 

pasaporte digitales 

 - Usuarios.
 - Ultima ubicación a nivel general ciudad pais.

Como gano como usuario al comprar esa prenda ?

 - Revender el usuario para ganar un beneficio revender prenda  Zora. 

 - Navegador.
      
- No es modificable inmutabilidad de los datos de origen
 

¿ Como usar blockchain para asegurar inmutabilidad. ?
¿Existen algoritmos para modificar  y encriptar. ?


