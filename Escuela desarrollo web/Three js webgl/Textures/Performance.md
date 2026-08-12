
## Como lo opmizo 

Hay tres puntos principales a abordar cuando se trata de optimizacion de [[Texturas]]

**Primer punto  peso**
1. JPG  es mas liviano , pero pierde mas calidad
2. PNG Prioriza calidad pero puede ser mas pesado
3. basis es hiper Liviano ideal  para el procesamiento de la GPU  

En general podemos usar compresores para minificar los tamaños de nuestros archivos pueden perder calidad en las compresiones por lo hay que estar mosca 


**Segundo punto  resolución**

Dado que [[MinMapping]] divide las texturas en 2 hasta llegar a un 1x1 , si el tamaño de resolución de nuestra textura no es divisible por 2 , [[Three js]] comprimirá la imagen para cumplir la condición y generara resultados no muy buenos ademas de una mala performance


**Segundo punto  tamaño textura

Si el tamaño de la textura es demasiado grande tomara mas tiempo descargarla a los usuarios por ello optar por texturas mas pequeñas facilita la vida de la gpu siendo mas eficiente

**Tercer punto data** 

Dependiendo de la data de la textura por ejemplo si es png trasparente puede resultar mas costoso en performaces que enviar dos jpg uno tipo alhfa y el otro la textura para lograr el mismo efecto
