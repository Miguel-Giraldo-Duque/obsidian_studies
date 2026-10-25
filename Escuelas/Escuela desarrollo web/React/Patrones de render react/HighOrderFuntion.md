
## Que es ? 

-- Las funciones como las conocemos pueden devolvernos un valor en sus returns, pero estas funciones de "orden superior", son funciones que devuelven otras funciones.

-- Si llamamos a la high order function y le enviamos un parámetro no tendremos todavía un resultado, como está devolviendo otra función tenemos que llamar a esa función que obtenemos luego de llamar a la de orden superior, enviarle los nuevos parámetros que necesita la función de retorno y entonces si, obtendremos nuestro resultado.


```js

funtion highOrderFuntion (){
	return funtion suma (a, b){
	console.log(a + b)
}
}
```


![[Adjuntos/Pasted image 20231004112138.png]]



Para el caso en react estas funciones son referidas como Hoc donde podemos utilizarlas para darle características especiales a nuestros componentes cons estas funciones ejemplo 



````js

```
