

### Cuales son?

Los seres humanos exigimos una respuesta rápida y tenemos una [[Percepción]] altamente influida por lo tiempos de respuesta siendo esta la mas importante de las cosas que crean en los usuarios la sensación de una buena experiencia.

Sin embargo ser muy rápido no es lo que busca el ser humano, las personas identificamos un sistema como eficiente cuando estamos al tanto del estado y claridad de las acciones que esta tomando el sistema , ello implica que aunque el performance del sistema , no es necesariamente lo único importante.



Algunos elementos claves son :

- Tenemos feedback inmediato de la acción que acabamos de hacer
- Te informacion sobre que cuanto demorara la interacción
- te deja hacer otras cosas mientras realiza el proceso

![[Pasted image 20250202130709.png]]


#### Tiempo de respuesta humanos

El ser humano tiene diferentes tiempos de respuesta dado los diferentes grupos de neuronas en el cerebro, si logramos entender como diseñadores las necesidades de cada uno de los tiempo de respuesta podremos desarrollar mejores interfaces .


`1 milisegundo` : Es nuestra reacción mas rápida nos permite percibir el mas mínimo espacio de silencio, estas vibraciones son procesadas y le permiten al cerebro estimar de donde vino el sonido .

`10 milisegundos` : Es el tiempo que nos toma detectar que existe un retraso en la acción que acabamos de hacer 

`100 milisegundos` : Es el tiempo que nos tarda entender nuestra acción reacción esperada en el sistema , digamos apretó un botón , si después de 100 milisegundos no me responde , considerare que mi acción no tuvo efecto

`1000 milisegundos` : Son aquellas acciones que toman mas tiempo de notar 


### Implicaciones en el diseño 

Dado que los seres humanos tenemos una exigencia muy seria por la sensibilidad del sistema frente a sus respuestas tiempos existen algunas soluciones de diseño que nos ayudan a resolver estas necesidades :


- **Barras de progreso** : Funcionales para notificar al usuario que existe un progreso hacia su meta , **su aparición existe después de que el usuario tome una acción por lo que debe aparecer en el rango de 100 milisegundos para considerarse una respuesta** , es importante mencionar que es clave además asegurarse  que el valor inicie 1% a 100% para que los usuarios sientan seguridad , además si llega al 100% la respuesta del sistema debe ser inmediata para ser considera terminada

- **Indicadores de ocupado** : Simbología o animaciones que notifican que el sistema se encuentra haciendo un proceso, siempre y cuando estos permanezcan en la visión del usuario  y tengan contexto, no son los mas eficientes para tareas largas dada su falta informacion en el progreso general de procedimiento , el tiempo de esperado para su aparición es de 1 segundo .

- **Progreso vía tiempo o restante** : Es crucial informar al usuario cuanto tiempo puede durar una acción , estaremos mucho mas abiertos a esperar felizmente esos minutos , de ello debemos tener en cuenta para los indicadores que (Faltan 2 documentos para terminar 2/4 , o si podemos usar el tiempo 2 "minutos restantes aproximadamente para que se finalice el proceso" )

- **Cancelar proceso** : Parte de una excelente percepción de sensibilidad por parte de los usuarios a un sistema es gracias a la sensación de control que les da poder "cancelar descarga", les da un certeza y tranquilidad frente sus acciones

- **Previzualicion de contenido** : Es muy útil poder crear una previsualización del contenido incluso si no esta del todo cargado ello nos permite que el usuario no vea interrumpida su tarea unitaria permitiéndole planear sus próximas acciones con seguridad , incluso siendo percibido como mejores para las personas que las mismas barras de carga siendo mejor ir mostrando poco a poco que todo el contenido , solucion como el skeeleton.
![[Pasted image 20250203202628.png]]

- **Precarga de acciones o contenido importante**: Si podemos tener una predicción de cual son las acciones mas importantes bajo las cuales un usuario va usar ,  es una manera inteligente preparar estas solicitudes para ser mas rápidas ("una solicitud de documentos" , la [[Apis]] ya precargo parte de los documentos),  o si el usuario requiere una informacion importante tenerla preparada ("estoy leyendo un blog " , la siguiente paginas ya debe estar cargada), esto genera sensación de rapidez .


- **Reducir al máximo la demora entre micro tareas** : Los usuarios dividen las grandes tareas como "agendar un viaje" en [[Objetivos]] , y estos en micro tareas que los acercan a completar esa tarea , dado que nuestra [[Memoria]] de trabajo hace limpiezas de informacion al completar cada uno de estos pequeños pasos, si existe un delay o un lag en estas pequeñas acciones se vuelve excesivamente molesto cosas como " tiempo en exceso demorado para escribir un carácter o lentitud para mover un objeto en figma"  causan un dolor en la [[Economía de la experiencia]] de la persona.

- **Render por enzima de 20 fps** : Si un elemento se mueve en un rango menor , se le considera poco fluido , es clave mantener las interacción en este rango aunque quizás implique sacrificar algunos detalles .



 
#### El tiempo sobre el performance de las nuevas computadores