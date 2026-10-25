

## Como funciona 

En [[Three js]] la camara con perpectiva funciona de modo tal en que si un objeto este muy cerca se vea mas grande y si esta maslejos mas pequeño la ide ade esta camara es acercase a una experienciaa similar al que tenemos en la vida real 

Esta camara usa field of view que le pemrite acercase y  moverse de modo tal en que puedas percibir multiples elementos a tu alrededor , tiene un sentido vertical y no paronomico por su mejor adaptacion al contexto de la web 

el segundo parametro apect ratio nos habla del tamaño dle render



para usarlo 


```js

// Definimos un tamaño con el que trabajar
const sizes = {
	width: 800,
	height: 600
}

// El primer parametro el field of view es en angulos , el segundo es el aspect ratio que es la altura dividida por el ancho
const camera = new THREE.PerpectiveCamera(75 , sizes.with / sizes.height)
```


Existen dos parametro mas near Y far que me indican a que distancia maxima quiero mis elementos se renderizen near me habla que tan cerca mis elementos dejan de ser renderizados poniendo un limite far habla de que tan lejos mis elemntos de ser renderizados

```js

// Definimos un tamaño con el que trabajar
const sizes = {
	width: 800,
	height: 600
}

// El primer parametro el field of view es en angulos , el segundo es el aspect ratio que es la altura dividida por el ancho
const camera = new THREE.PerpectiveCamera(75 , sizes.with / sizes.height, 1 , 1000)
```