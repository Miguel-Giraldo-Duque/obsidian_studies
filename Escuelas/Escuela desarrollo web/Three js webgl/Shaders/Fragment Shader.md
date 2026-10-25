
### Como funciona a profundidad?


Fragment shader pinta  las interceociones generadas por cada [[Vertex Shader]]  

```js
precision mediump float;

  

void main(){

    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0) ;

  

}
```


utiliza las mismos tipos de valor [[Shaders]] ,  pero con ciertas diferencias que le permiten ser mejor en el pintado de los fragmentos y mas optimo como son :

---
- Precisión: se refiere a la precisión de nuestros float , si es muy alta tendrá problemas en el performance y si es muy baja generara cambios de golpe y ciertos bugs por ello usamos ==medium== 


```js 
precision mediump float;
```


---
-  gl_FragColor: Es una variable que nos permite definir el color de pintado de nuestros elementos

```js
// Para activar la opasidad debemos ir a shaderMaterial trasparent true

// RGBA (rojo, azul , verde, opasidad)
 gl_FragColor= vec4(1.0, 0.0, 0.0, 1.0) ;
```


