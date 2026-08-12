
## Que es?

Es una de las  [[Apis]] de JavaScript  que te otorga una serie de métodos con los que trabajar y avanzar  , el uso de esta librería es para crear triángulos a una velocidad conciderable , webGl dibujara multiples triangulos y de diferenetes tipos en la web


Esta api utiliza la GPU que es muchísimo mas rápida en procesamiento en comparacion con la cpu con la normalmente trabaja JS


Un elemento 3d se compone de multiples triangulos que colorizamos y organizamos para que se vean como deseamos


Para lograr esto usamos puntos 

![[Pasted image 20240709182831.png]]

Estos puntos nos permiten indicarle a webgl como debe contruir esos triangulos
![[Pasted image 20240709182918.png]]
Que a medida que se unen forman figuras complejas como

![[Pasted image 20240709183012.png]]


Lo que sucede por detrás es que la GPU crea todos los puntos al mismo tiempo  y en base a los pixeles de la pantalla en que se ubican este pintara las intercepciones entre puntos , la forma en que pinten esas intersepciones es con lo que llamamos shaders 
![[Pasted image 20240709183743.png]]


Trabajar con webgl reusltaba muy complejo por ello nace three js por Mr boob 



Con webgl se pueden crear experiencias 2d  con librerias como pixi.js 

