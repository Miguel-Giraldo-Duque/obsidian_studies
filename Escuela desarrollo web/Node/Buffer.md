
# Que es?

Un buffer es un espacio de memoria (en la memoria ram), en el que se almacenan datos de manera temporal.

Es la forma mas cruda en la que se pueden almacenar los datos. (Se guardan en **bytes** y no se especifica el tipo de dato)

En la consola, **los datos se muestran en formato hexadecimal**.


Para crear un buffer, con 4 espacios por ejemplo, podemos hacerlo con la siguiente sintaxis.

```javascript
let buffer = Buffer.alloc(4);
console.log(buffer); 
// Output:
//<Buffer 00 00 00 00>
```

<h3>Otras formas de crear un buffer</h3>

Datos en un arreglo

```javascript
let buffer2 = Buffer.from([1,2,3]);
console.log(buffer2);
```

Datos de tipo string

```javascript
let buffer3 = Buffer.from('Hola');
console.log(buffer3);
console.log(buffer3.toString());
```

Guardar el abecedario en un buffer

```javascript
let abc =  Buffer.alloc(26);
console.log(abc);

for (let i = 0; i< abc.length; i++){
  abc[i] = i + 97;
}

console.log(abc);
console.log(abc.toString())
	```