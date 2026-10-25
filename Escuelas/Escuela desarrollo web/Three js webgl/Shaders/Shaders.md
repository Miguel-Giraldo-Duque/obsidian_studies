
## Que son?

Son la principal estrucutura que [[WebGl]] nos ofrece para la creación de nuestros elementos 3d sin ellos no podríamos crear nuestros render , [[Three js]] esta basado en estos y hacen el trabajo mas sencillo  .

esta escrito en [[GSL]] , y le podemos enviar mutiples propiedades como :

- Coordenadas de los vertices
- Porpiedades de la camara como Fov
- Colores para cada veritice
- luces
- texturas
- Fog


La idea es que cuando enviamos toda esta informacion , la GPU organizara las posiciones de los vertices y pintara todos los fragementos visibles entre los vertices 



> Exiten dos tipos de shaders 
### Vertex Shader y Fragment Shader


Un vertex shader tiene un estrutura simple recibe una data de nuestra camara, posicion de vertices etc , y a partir de ello generamos un programa que se ejecuta en paralelo por cada vértice presente en nuestro render  y se enfoca en el posicionamiento de estos vertices

![[Pasted image 20240920114647.png]]

Si bien nuestro vertex shader ejecuta un mismo programa para cada vetice , algunos de ellos permanecerán con las mismas propiedades a los cuales nos referimos como uniform y otros cambiaran individualmente lo que conocemos con attributes  

Una vez terminado nuestro posionamiento la gpu  usara el shader **Fragment Shader** que encarga  de pintar los fragmentos visibles en el render 

![[Pasted image 20240709183743.png]]

en este caso solo recibe propiedades **uniform**  en nuestra data
![[Pasted image 20240920115923.png]]

Si bien no podemos recibir atrributes que estan mas ascociados a un concepto de vertices , podemos pasarle a fragment  varying que indique las propiedades "unicas" de ciertos vertices 

![[Pasted image 20240920120231.png]]


Los shaders son claves , por que en esencia son increiblemente eficientes en el performance nuestros aplicativos


