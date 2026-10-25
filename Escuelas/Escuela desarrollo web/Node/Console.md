
## Console

Con console podemos imprimir todo tipo de valores por  
nuestra terminal.

- **console.log**: recibe cualquier tipo y lo muestra en el consola.
- **[console.info](http://console.info/)**: es equivalente a log pero es usado para informar.
- **console.error**: es equivalente a log pero es usado para errores.
- **console.warn**: es equivalente a log pero es usado para warning.
- **console.table**: muestra una tabla a partir de un objeto.
- **console.count**: inicia un contador autoincremental.
- **console.countReset**: reinicia el contador a 0.
- **console.time**: inicia un cronometro en ms.
- **console.timeEnd**: Finaliza el cronometro.
- **console.group**: permite agrupar errores mediante identación.
- **console.groupEnd**: finaliza la agrupación.
- **console.clear**: Limpia la consola.


La función **console.time(‘nombre’)** inicia un temporizador que se puede usar para rastrear cuánto tiempo dura una operación. El temporizador sera identificado por el _nombre_ dado a la consola. Ese mismo nombre se utilizara cuando se llame a **console.timeEnd(_‘nombre’_)** para detener el temporizador y obtener el tiempo demorado durante el proceso.

```
console.time("Temporizador");
for (var i = 0; i < 10000; i++) {
  // Nuestro codigo entre los temporizadores puede ser cualquier cosa.
}
console.timeEnd("Temporizador");
```