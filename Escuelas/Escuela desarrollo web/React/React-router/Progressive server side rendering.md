
## Que es ? 

En [[React]] usamos el single page aplication donde creamos una renderización solo una vez y luego dinámicamente lo cambiamos a medida que se interactúa con el ,y en el proceso tradicional de server side rendering , donde creamos una peticion al backend que nos pase el html por cada una de las interacciones  este siendo muy rápido en la carga inicial pero mas lento a medida que aumneta la complejidad de la aplicacicon .


Pero que pasaria si combinamos ambas?
![[Pasted image 20250122194852.png]]

Entonces el flujo seria tenemos una carga inicial que nos trae el HTML completo de backend y a ese HTML es que empezamos a modificar dinámicamente convirtiéndolo en un SPA , esto con el objetivo de tener velocidad en la carga inicial y uso inteligente de la modificación con js para reducir mucho mas el tiempo 