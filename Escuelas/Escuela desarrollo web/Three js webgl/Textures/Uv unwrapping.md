

### Que es?

Es la forma en que podemos tomar una textura e indicarle como queremos que se organice en nuestras [[Geomtrias]] teniendo instrucciones para cada vértice funcionado como envoltura para dulces , estas instrucciones vienen en 2D


![[Adjuntos/Pasted image 20241001215844.png]]


Finalmente para que [[Three js]] pueda procesar este imagen , usa el atributo nativo de uv que nos da la lista de la posicones de vertices en plano 2D para poder posicionar la imagen


### Técnicaspara UV unwrapping 


**Repeat** permite repetir la textura en una dirección x o y es una forma de dividir como queremos que se distrubya la imagen a lo largo de la geomtria similar a un grid
```

textureColor.repeat.x = 2

textureColor.repeat.y = 3
```
![[Adjuntos/Pasted image 20241001221842.png]]

Sin embargo por defecto  repeat no repite la textura como tal si no que estrecha y apreta en un punto.

Para solucionarlo usamos wrapS y wrapT que permite una repticion eficente


````js
textureColor.repeat.x = 2

textureColor.repeat.y = 3


// SI le pasamos directamente textureColor.repeat.y = 3 funciona por que de forma preterminada three js usuara alguna de la funcion como clamp dando resultados no deseados .



// WrapS y WrapT nos permite definirle a nuestra textura como se comporta  cuando se exede las posiones del uv cuando indicamos repetat wraping le decimos que en S(en lo ancho)  y T(en lo alto ) repite la misma textura visible inifinitamente
	textureColor.wrapS =  THREE.RepeatWrapping;
	
	textureColor.wrapT =  THREE.RepeatWrapping;
````



**MirroredRepeatWrapping** Lo que hace es que repite nuestros elementos sin embargo lo que hace es que invierte la direccion de la textura por cada repticion algo así :

![[Adjuntos/Pasted image 20241001224153.png]]

```js
textureColor.wrapS =  THREE.MirroredRepeatWrapping;

textureColor.wrapT =  THREE.MirroredRepeatWrapping;
```


**Offset** : Lo que hace offset es que crea espacios entre la misma textura  no sobre la textura como tal .


```js
// [0, 1] es el rango en que se mueve el offset si se ponen numeros como "9" supera el rango y float lo convierte en 0
textureColor.offset.x = 0.40
textureColor.offset.y = 0.40
```


![[Adjuntos/Pasted image 20241001224531.png]]


**Rotation** lo que hace es que rota la texturas  es un vec2 refriéndose al plano y la orientación de las texturas :

```js
textureColor.rotation = Math.PI / 4

// SI quieremos cambair el centro de pivot usamos
textureColor.center.x = 0.5
textureColor.center.y = 0.5
```
![[Adjuntos/Pasted image 20241001225611.png]]

