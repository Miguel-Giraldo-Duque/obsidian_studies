
## Que es ?

Es un lenguaje para la creación de [[Shaders]]  , que se comunica directamente con la GPU sus principales funciones son:


- *Posicionar*: Se encarga de posicionar nuestros vértices en el render como la imagen que vimos en  [[WebGl]]
![[Pasted image 20240709182831.png]]

- Colorear : Se encarga de pintar cada fragmento de las [[Geomtrias]] que le pasamos , decimos fragmento por que en webgl un fragmento  es la representación del render de los "pixeles"  



### Sintaxis


Glsl es un lenguaje tipado , lo que quiere decir que debemos indicarle los tipos de variables , ser cuidadosos con los puntos y comas exiten diferentes tipos de variables que podemos usar :

- **Float**:  Recibe números flotantes 
```js
float a = 0.1;
// para transformar un elemento a flotante usamos : 
    int b = 4;

    float c = float(b);
```


 -  Int : recibe números enteros , no muy recomendado usarlo

```js
    int b = 4;
```
 
-  Boolean : recibe números booleanos

```js
    bool b = true;
```

- v2 : guarda propiedades de xy :


```js
// x --- Y
    v2 position = v2(1.0, 2.0); // Para valores 0 asginamos 0.0 

// Para acceder a nuestras propiedades de v2


position.x = 1.5;
position.y = 4.5;

// Podemos multiplicar ambos con (x, y) seran afectados por la multiplicacion

position *= 5.0

```

- v3 : guarda propiedades de xyz :


```js
// x --- Y
    v3 position = v3(1.0, 2.0, 1.0); // Para valores 0 asginamos 0.0 

// Para acceder a nuestras propiedades de v3

position.x = 1.5;
position.z = 4.5;

// Podemos multiplicar todos (x, y, z) seran afectados por la multiplicacion

position *= 5.0


// Tambien puede ser usado para el RGB :
 v3 position = v3(1.0, 2.0, 0.0); // Para valores 0 asginamos 0.0 

// Para acceder a nuestras propiedades de v3

position.r = 1.5;
position.g = 4.5;


// Podemos pasarle un vec2 como parametro de (x,y)
v2 position = v2(1.0, 2.0);

v3 bar = v3(position , 1.0)

// Swizzle
v3 bar = v3(1.0, 2.9 , 1.0)


v2 position = bar.xy

```

- v4 : guarda propiedades de xyzw o rgba :

```js
// x --- Y
    v4 position = v3(1.0, 2.0, 1.0, 2.0); // Para valores 0 asginamos 0.0 

// Para acceder a nuestras propiedades de v3

position.x = 1.5;
position.z = 4.5;

// Podemos multiplicar todos (x, y, z, w) seran afectados por la multiplicacion

position *= 5.0


// Tambien puede ser usado para el RGBA :
 v4 position = v4(1.0, 2.0, 0.0, 1.0); // Para valores 0 asginamos 0.0 

// Para acceder a nuestras propiedades de v4

position.r = 1.5;
position.g = 4.5;


// Podemos pasarle un vec2 como parametro de (x,y)
v2 position = v2(1.0, 2.0);

v4 bar = v4(position , 1.0 , 1.0)

// Swizzle
v4 bar = v3(1.0, 2.9 , 1.0, 2.0)


v2 position = bar.xy

```


- **Funciones 

```js
// Podemos recibir parametros y debemos indicarle a glsl el tipo de valor de retorno


float calc (float a , float b ){

	return a + b;
}


float result = clac(2.0,1.0);
 
```


