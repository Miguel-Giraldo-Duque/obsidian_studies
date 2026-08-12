

## Que es?


La reactividad es un paradigma  que existe con el fin de otorgar resultados incluso en situaciones de error , ademas busca la forma de trbajao escalable en donde si incluso  cuando la cantidad de informacion o datos se aumenta nuestra aplicacion podra manter el funcionamiento y eficacia mientras crece 


Otra importante caracteristica de paradigma es sistema de aviso mensajes donde un emisor lanza mensaje y un receptor lo toma y guarda en un cola o tiempo de espera , luego le envia un emisor la informacion esto se logra atravez de observadores que capatan la informacion en el mensjaje como evento ejemplo 

![[Pasted image 20221020145757.png]]


donde los mensajes son lo primero que nos apareceria en nuestro twiter normal y el evento nuestra capacidad de interactuar con esta informacion dada 

## El State y render


State Es lugar donde guardamos la imformacion reactiva de nuetros [[Componentes]] , es decir nos permite conocer los cambios hechos en nuestros componentes y guardar esta informacion para actualizar un componente o informacion

Render es la forma en que actualizamos o renderizamos nuestros componentes en el Doom en base a una interactividad de usuario siendo esto realizado por js 

![[Pasted image 20221020144117.png



# Estrategias de render


## Que es el virtual doom 


Es un reprecentacion del doom en js que nos entender cuales comoponentes a renderizar o actualizar permitiendonos no tener que actualizar toda la aplicaion, siendo asi que permite la renderizacion de componentes especificos


## Que es No Virtual doom

Esta estrategia permite la creacion de pequeñas verciones del virtual doom especificas para un componente  para actualizar unicamente a este  , o tambien nos da la posibilidad de directamente actualizar el doom cuando sea necesesario


Estas estrategias dependen de los [[Frameworks]] a trabajar pues dependera de estos cual estrategia usar 