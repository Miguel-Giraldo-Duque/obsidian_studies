
### Que son ? 

Los client server component se refieren a compontes que se rendirizan basado en el JS del navegador que aplica cambios de forma dinamica al HTML basado en la interacción del usuario ejemplo [[React]] , su principal ventaja radica es crear interacciones y la rapida velocidade respuesta al interactuar con el servidor 


#### Uso en Next js

En next se puede utilizar haciendo uso de "use client", que nos permite indicar que es un componente de tipo cliente y que todos los hijos de ese componente también lo son , por lo anterior siempre es muy importante  que solo los componentes que realmente necesitan la logica interaction usen "use client" de otro modo arruinaríamos la ventaja técnica de los [[Server components]] 