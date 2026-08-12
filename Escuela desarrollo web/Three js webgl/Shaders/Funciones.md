

### funciones matematicas 

### Cuales son? 
####  Modulo

**Módulo** (o **mod**) es una operación matemática que devuelve el **resto** de la división de un número entre un divisor. En programación, se usa para crear patrones repetitivos, ya que cuando un valor alcanza el límite especificado, vuelve a comenzar desde un valor inicial (generalmente 0). Esto permite definir un rango cíclico de valores.

![[Pasted image 20240924154818.png]]

Algo asi se ve la grafica una vez se alcanza un limite se vuelve a cero y se repite

```js
     float strength = mod(vUv.y) ;
```


### Step

La función **Step** se refiere a una condición que evalúa si un valor está por encima o por debajo de un umbral específico. Si el valor está por debajo del límite, se ajusta a un valor predeterminado (normalmente 0); si está por encima o igual al límite, se ajusta a otro valor (normalmente 1). Es una función escalón que fuerza el valor a uno de los dos extremos más cercanos según la comparación con el umbral.

![[Pasted image 20240924161012.png]]



### Abs


Permite devolver valores solo positivos transformando nuestros valores negativos  

````js

// Cuando vUv.x sea 0.5, el resultado será 0.0, ya que 0.5 - 0.5 = 0.0.
// Si vUv.x es 1.0, se resta con 0.5, obteniendo 0.5.
// Si vUv.x es 0.0, se resta con 0.5, dando -0.5, pero abs() convierte este valor negativo en positivo.

// Por lo tanto, abs(vUv.x - 0.5) genera un valor entre 0.0 (en el centro) y 0.5 (en los bordes).

float strength = abs(vUv.x - 0.5);

gl_FragColor = vec4(strength, strength, strength, 1.0);

````


![[Pasted image 20240925121544.png]]



### Min

Trae el valor minimo entre dos valores 

```js

// Esta línea toma el valor mínimo entre la distancia horizontal (vUv.x - 0.5)
// y la distancia vertical (vUv.y - 0.5) al centro de la coordenada UV (0.5, 0.5).
// Primero, se calculan las distancias absolutas desde el centro:
// abs(vUv.x - 0.5) y abs(vUv.y - 0.5).
// Luego, la función min() selecciona el menor de esos dos valores.

// El resultado es un gradiente que forma una "cruz", más oscuro en el centro
// y con los bordes más claros, ya que el valor de strength será menor en
// las áreas cercanas a los ejes x = 0.5 o y = 0.5.

float strength = min(abs(vUv.x - 0.5), abs(vUv.y - 0.5));

gl_FragColor = vec4(strength, strength, strength, 1.0);

```


### Max

Busca el valor maximo entre dos valores

```js
// La función max() selecciona el valor mayor entre la distancia horizontal (abs(vUv.x - 0.5))
// y la distancia vertical (abs(vUv.y - 0.5)) al centro de las coordenadas UV (0.5, 0.5).
// En este caso, el valor máximo es 0.5, lo que crea un efecto visual donde
// las esquinas (mayor distancia) son más claras, y el centro se ve más oscuro.

// Como el valor más alto siempre es 0.5 en los bordes de la textura, el resultado es 
// una especie de "desenfoque inverso", donde las zonas más alejadas del centro
// se ven más claras, mientras que las cercanas al centro permanecen oscuras.

float strength = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5));

gl_FragColor = vec4(strength, strength, strength, 1.0);

```

![[Pasted image 20240925124439.png]]


### Floor

Redondea los valores hacia abajo al numero mas cercano al que le dimos como valor

- Si `vUv.x * 10.0 = 4.7`, entonces `floor(4.7) = 4.0`.
- Si `vUv.x * 10.0 = 0.2`, entonces `floor(0.2) = 0.0`.

```js
// Este código utiliza la función floor() para reducir la precisión del valor de vUv.x.
// Multiplica vUv.x por 10.0, lo que lleva el rango [0.0, 1.0] a [0.0, 10.0].
// Luego floor() redondea hacia abajo al entero más cercano.
// Dividiendo el resultado por 10.0, se devuelve el valor al rango original de [0.0, 1.0],
// pero con menos precisión, "saltando" entre valores como 0.0, 0.1, 0.2, etc.

float strength = floor(vUv.x * 10.0) / 10.0;

gl_FragColor = vec4(strength, strength, strength, 1.0);

```



#### "Ramdom" para lograr resultados como este

![[Pasted image 20240925143129.png]]

ramdom en [[WebGl]] **no existe**  debemos crear nuestra propia función que realize este tipo de efecto , y es eso un efecto no hay ramdom realmente solo que sus valores son tan impredecibles que dan esa senacion de ramdom


```js
float random (vec2 st) { 
return fract(sin(dot(st.xy, 
					 vec2(12.9898, 78.233))) * 
					 
					 43758.5453123); 


}
```


### Lenght


Devuelve el largo de un elemento puede ser un vec , un uVu etc .

![[Pasted image 20240925150143.png]]


```js
// Lo que hace length es calcular la distancia desde mi posición actual en vUv 
// hasta el punto de origen (0.0, 0.0). El valor que retorna es la distancia 
// entre ambas posiciones.

float strength = length(vUv);

gl_FragColor = vec4(strength, strength, strength, 1.0); // Asigna este valor a los canales R, G y B, generando un tono de gris.
	
```

```js

// Entiendo que 0.5 representa la mitad de mis coordenadas UV (vUv). Al restar 0.5 de vUv, 
// estoy trasladando el origen de las coordenadas desde (0.0, 0.0) al centro (0.5, 0.5). 
// Esto permite que la función length calcule la distancia desde el centro hasta la 
// posición actual en vUv.

float strength = length(vUv - 0.5); // Calcula la distancia desde el centro (0.5, 0.5).

```


Lo anterior también lo podrías hacer con

### Distance

Devuelve la distancia entre dos vectores  


```js
// Distance nos esta devolviendo la distancia desde nuestro punto de origen y 0.5 es decir nos da como un resultado 0.5 centrando nuestros elementos
 float strength = distance(vUv , vec2(0.5));
 gl_FragColor = vec4(strength, strength,strength , 1.0);
```



### Rotar

Para rotar en webgl es un poco laboriozo por ello se usa esta funcion .

```js

// Pare definir PI en nuestro codigo podemos usar #define que nos permite a acceder a su valor en todo nuestro codigo

#define PI 3.1415926535897932384626433832795

vec2 rotate(vec2 uv, float rotation, vec2 mid)
{
    return vec2(
      cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
      cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}

```


### SmoothStep 

SmoothSteep permite crear un paso suave entre valores de [0,1] su principal beneficio reside en que permite crear una transición suave entre los valores definidos  y su valor esta apretado o limitado a valores de 0 o 1 permitiendo que una vez alacanzado el limite designado su valor no aumenta 

la forma de  usarlo es le indicamos un valor del cual es donde queremos hacer la transicion a nuestro segundo valor el limite , mientras no se alcance el valor no se transicionara  hermite

![[Pasted image 20241116141625.png]]

como tercer valor le debemos entregar el valor a remapear

```js
// Valor desde el que tranciona , Valor al que se meuve , el elemento a remapear
  smoke = smoothstep(0.4, 1.0 , smoke);
```

`smoothstep(edge0, edge1, x)`

1. **`edge0`**: El inicio del rango donde la transición comienza.
2. **`edge1`**: El límite del rango donde la transición termina.
3. **`x`**: El valor que quieres remapear.

- Si `x` está **por debajo de `edge0`**, el resultado es **0**.
- Si `x` está **por encima de `edge1`**, el resultado es **1**.
- Si `x` está **entre `edge0` y `edge1`**, el resultado varía suavemente entre 0 y 1.


### Atan  

El arco tangente se refiere a como desde  la función tangente le pasamanos dos valores y atan nos devuelve el Angulo entre estos dos puntos y su Angulo en relacion a eje y positivo.

funciona como un gran circulo donde atan lo que hará es devolver ángulo que tiene que tomar para llegar al punto indicado girando de lado derecho hasta encontrar las posiciones devolviéndonos el ángulo que recorrió en radianes

¿Cuánto tengo que girar, desde el eje positivo Y, para llegar al punto `(position.x, position.y)` en el plano?


```js
// Nos devuelve el angulo entre nuestro vertice en el eje x en comparion al y 
float angle = atan(position.x, position.y) 
```

- **Punto (0, 1):** Estás directamente sobre el eje positivo Y → el ángulo es **0 radianes**.

- **Punto (1, 0):** Estás 90° hacia la derecha → el ángulo es radianes.

### Sin



### Cos 



### Pow 



### Dot 

Producto punto entre dos vectores , esta operación nos permite entender la similitud entre dos vectores , específicamente su alienación obtendremos un valor escalar basado en el ángulo donde

`1`: Están alineados los vectores Ejemplo: El **vector cámara** está perfectamente alineado con el **vector luz**, lo que podría significar que la luz está reflejándose directamente hacia la cámara (como en un brillo especular perfecto).

`0`: Los vectores son perpendiculares por ejemplo los vectores cámara y luz están de lado donde la luz esta golpeando de lado y cámara esta mirando al frente 

`-`1: Los vectores aputan a lado opuesto por ejemplo el vector luz apunta hacia pega desde atras pero la camara desde el frente

```js
dot(vectorA, vectorB)
```



### Sample 2D y texture 


Para ingresar texturas en[[WebGl]] lo único que debemos tener en cuenta necesitamos ingresa la textura con todas sus propiedades luego usamos un smaple2d Para referimos a esta textura y entonces y ingresamos la textura 
````js
// Primero la traemos con three js
const manager = new THREE.LoadingManager();

manager.onError = (e) => {
  console.log(e);
};

const textureLoader = new THREE.TextureLoader(manager);

const noises = [textureLoader.load("./pattern1.png")];

````

```js
// GLSL

varying vec2 vUv; 

// Es un tipo de variable en GLSL que representa una textura 2D. Permite acceder a los valores de color almacenados en la textura.

uniform sampler2D uPerlinTexture;
void main (){
	// Texture recibe dos parametros la textura ingresada las coordenadas de esta textura y un lugar donde debe poner esta textura puede ser en uv de un cubo , esfera o cualquier otra superficie con coordenadas UV
	vec4 perlinPatternTexture = texture(uPerlinTexture,vUv);
}
```


texture nos devuelve los valores RGBA (rojo, verde, azul, alfa) del píxel en las coordenadas UV especificadas.



### Reflect 

**Reflect** es una función que permite calcular el vector reflejado cuando un vector incidente golpea una superficie definida por una normal. La función sigue las leyes de reflexión y devuelve un vector que representa la dirección del reflejo.

La fórmula matemática es:

- III: Vector incidente (dirección del impacto).
- NNN: Vector normal (debe estar normalizado).
- RRR: Vector reflejado (dirección de salida).

```js
reflect(normal,vectorluzA)
```






