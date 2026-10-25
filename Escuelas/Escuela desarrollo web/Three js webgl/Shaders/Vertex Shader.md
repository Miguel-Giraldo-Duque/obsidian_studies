
### Como funciona a profundidad?


```js


	uniform mat4 projectionMatrix;
	
	uniform mat4 viewMatrix;
	
	uniform mat4 modelMatrix;

  
// Los atributos que modificabamos con nuestro buffer por ejemplo position se representan como este position , color o cualquier otro atrr
	attribute vec3 position ;

  
// En void no tenemos que "retornar"algo de por si el executa lo que tiene internamente
void main(){
// gl_Position es un variable ya asginada que podemos modifcar contiene 
// la informacion de posicionamiento de los veritices

    gl_Position = projectionMatrix * viewMatrix *modelMatrix * vec4(position, 1.0);
  // Son cuatro valores que crear un "clip space" un espacio de cubo donde se puede analizar un esena con x ,y ,z ,w este ultimo w es para la perpectiva 

}
```

![[Adjuntos/Pasted image 20240920163955.png]]



#### Projection matrix, model matrix, view matrix


- **Model matrix** : cuando hacemos [[Operaciones de transformacion]] afectamos nuestra [[Mesh]] , el objetivo de model matrix es adapatar el posionamiento , escala y rotacion a nuestros elementos 

- **View Matrix** : Se adapta a la data de la cámara el field of view , la posicion el ancho y el largo 

-  Projection Matrix : define cómo se proyectan los objetos en el espacio de la cámara al **clip space**. Esta matriz realiza la transformación de perspectiva, que es esencial para convertir el espacio de vista en una proyección 2D, simulando el efecto de la distancia.


### Proceso creacio clip space
- **`modelMatrix`**:
    
    - Define la **posición, rotación y escala** de cada objeto en la escena. Transforma los vértices del objeto desde su **espacio local** al **espacio mundial**.
    - Esto permite "identificar" o situar cada objeto en el espacio de la escena.
- **`viewMatrix`**:
    
    - Toma las posiciones del espacio mundial (resultado de `modelMatrix`) y **ajusta las posiciones de todos los objetos** en función de la posición y orientación de la cámara.
    - Filtra o ajusta la visión desde la perspectiva de la cámara, esencialmente limitando el espacio a lo que la cámara podría ver.
- **`projectionMatrix`**:
    
    - Aplica una **proyección en perspectiva** (o en ortográfica, si ese es el caso) a la escena tal como se ve desde la cámara.
    - Convierte el espacio de vista en **clip space**, donde cada vértice se normaliza dentro de un cubo de `-1` a `1` en todos los ejes, lo que permite que los elementos más lejanos se reduzcan en tamaño, simulando profundidad.

- **Resultado (`gl_Position`)**:
    
    - Finalmente, `gl_Position` recibe el resultado de `projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);`, y los vértices están listos para el proceso de recorte y rasterización en pantalla.
    
### Model matrix


```js
// podemos dividir la creacion de nuestro clip space para tener mas control y dominio : 


  vec4 pos = modelMatrix * vec4(position, 1.0);

// Aceddemos el modelMatrix para efectuar cambios en nuestra mesh
    pos.z += sin(pos.x * 20.0) * 0.1;

  

    vec4 viewMatrix =  viewMatrix * pos ;

  

    vec4 projectionMatrix = projectionMatrix * viewMatrix;

  

    gl_Position = projectionMatrix ;

```




### Como usar varying?


Como explique en [[GSL]] es una forma en la podemos comunicarnos con el [[Fragment Shader]] , en este caso ademas podemos crear nuestro propio atributo y pasarselo a nuestro fragment para que lo pinte


1  paso creamos nuestro propio atributo
````js

const geometry = new THREE.PlaneGeometry(1, 1, 32, 32)

  

const count = geometry.attributes.position.count

  

const ramdomPos = new Float32Array(count)

  

for (let i = 0; i < ramdomPos.length; i++) {

    ramdomPos[i] = Math.random() ;

}
// Seguimos la convencion de tomar la primera letra del tipo dato que estamos usando a de atribute v varying etc..
geometry.setAttribute("aRandom" , new THREE.BufferAttribute(ramdomPos, 1))


````
2 Paso le damos uso en nuestro vertex Shader

Con el exacto mismo nombre nos traemos el atributo que creamos "aRandom"
y podemos empezar a modificarlo y pasarselo a un varying

```js

uniform mat4 projectionMatrix;

uniform mat4 viewMatrix;

uniform mat4 modelMatrix;

  

attribute vec3 position ;

attribute float aRandom;

varying float vRandom;

  
  
  

void main(){

    vec4 pos = modelMatrix * vec4(position, 1.0);

    pos.z += aRandom* 0.1  ;

  

    vec4 viewMatrix =  viewMatrix * pos ;

  

    vec4 projectionMatrix = projectionMatrix * viewMatrix;

  

    gl_Position = projectionMatrix ;

  
  
	// Le pasamos los valores del atributo
    vRandom= aRandom;

}
```


3paso le damos uso a la data de varyng para cambiar nuestros colores de manera aleatoria 


```js
precision mediump float;

varying float vRandom;

void main(){
	// Podra ser 0 , 1 y dependiendo de como lo posiciones nos da diferentes colores:
    gl_FragColor = vec4(vRandom, 0.0,vRandom, 1.0) ;
}
```

![[Adjuntos/Pasted image 20240920191155.png]]

