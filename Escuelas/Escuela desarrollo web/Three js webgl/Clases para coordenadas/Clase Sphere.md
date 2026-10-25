### Como funciona?


Normalmente cuando trabajamos con nuestras propias [[Geomtrias]] repartimos de forma uniforme en xyz los elementos cuando trabajamos con [[Particles]] sin embargo podemos usar Sphere para repartir las posiciones a lo largo de un esfera 

```js
// spherical recibe 3 parametros el radio ,PHiI, THETA 
const spherical = new THREE.Spherical(
      1,
      Math.random() * Math.PI,
      Math.random() * Math.PI * 2
    );

```

El radio refriéndose a  la distancia que tenemos desde cualquier borde de la circunferencia en Relacion al centro de esta , PHI se refiere a la linea que recorre verticalmente a la esfera , THETA a la linea que recorre horizontalmente  
![[Pasted image 20241126171756.png]]
En español podríamos verlo así: PHI recorre verticalmente de polo a polo la esfera funcionando como una naranja cuando la partes a la mitad solo necesita volver a unir los dos lados para crear una naranja completa pues son simétricos ahora para unirlo usamo thteta que recorre toda la circunfencia para juntar ambos lados

Ahora para poder usar esta clase la debemos trasformar a posición  de 3 vectores 
```js
// Le pasamos al vector la esfera creada y usamos el metodo setFromSpherical para converitlo a posiciones xyz en un vector3 

    const sphereCood = new THREE.Vector3();

    sphereCood.setFromSpherical(spherical);

```