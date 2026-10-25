
## Que es y como lo podemos aplicar?



En [[WebGl]] se usa normalmente el rgb como una representación de posiciones en un espacio tridimensional como xyz donde 

- `x` es R rojo
- `y` es G verde
-  `Z`  es B azul 

Dependiendo del caso nos puede ser útil para debugear dándonos informacion pro ejemplo donde apuntan las normales ?, o donde se están posicionando los fragmentos para todo ello podemos usar el [[Fragment Shader]]  

```js
// Un ejemplo usando una normal para lograrlo
  gl_FragColor = vec4(normal, 1.0);
```

Vemos que todas las normales apuntan hacia afuera por el verde representación de `y`

![[Adjuntos/Pasted image 20241223183452.png]]


