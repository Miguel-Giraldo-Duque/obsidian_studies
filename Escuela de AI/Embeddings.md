

### Que son?


Un embedding son un conjunto de vectores que representan una posicion en espacio de múltiples dimensiones por cada uno de los vectores , normalmente son representados en tres dimensiones similar  un render de [[Three js]] 


Los embedding normalmente son usados por modelos de inteligencia artificial para realizar predicciones , recomendar y responder input basados en un conocimiento . 

La idea de un flujo de un embeddig de un texto(puede ser cualquier tipo de data) por ejemplo 

![[Pasted image 20241105000451.png]]


// Estos son representaciones en xy dependiendo de lo cerca que este un vector de otro podemos decir que esas palabras están relacionadas o no  
Rey ---> [0,3]
Mujer ---> [2,3]
Hombre ---> [1,3]
Agua ---> [5,9]

![[Pasted image 20241105000544.png]]

![[Pasted image 20241105000701.png]]

Internamente los modelos de inteligencia artificial hacen operación vectoriales entre vectores para encontrar las mejores posibles respuestas ante un input

y cuando el modelo calcula un vector lo que hace es en realidad es que sustraemos o adicionamos a los vectores para quitar  añadir contextos ejemplo

// Quitamos el contexto hombre y le adicionamos el contexto mujer que nos resulta en una posición
Rey ---> [2,5] -Hombre ---> [1,3] + Mujer ---> [1,4] = [2,4]  Si ahora buscamos "queen" encontramos que en la operación que hicimos hay una gran Relacion posible entre rey y mujer una reina.

![[Pasted image 20241105001215.png]]

![[Pasted image 20241105001945.png]]

