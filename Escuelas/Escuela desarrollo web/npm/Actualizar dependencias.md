

## Como se si tengo desactualizadas mis dependencias ?

En [[npm]]  se puede actualizar dependencias previamente instaladas para saber si nuestras o las dependencias de un proyecto externo descargado tienen nuevas versiones mas actualizadas podemos usar 

````js
// Este comando nos mostrara la vercion mas reciente de todos los paquetes en nuestro proyecto
npm outdate 
````

Mostrándonos un resultado como este

![[Adjuntos/Pasted image 20240307164738.png]]


Ahora que sabemos que nuestra dependencia de express se encuentra desactualizada optamos por actualizarla con el siguiente comando 


```npm 
npm i express@latest
```




### Como instalo una versión especifica de un paquete ?

Se puede lograr esto utilizando el @ seguido del nombre de nuestra dependencia


```js
npm i express@laVercionQuequiero
```


