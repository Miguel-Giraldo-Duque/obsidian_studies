

##  Que es ?


Node es un entorno de ejecución de JavaScript sin necesidad de un navegador
su principal beneficio es su capacidad para permitirte ejecutar tu código de JavaScript en cualquier lugar además de permitirte crear herramientas de servidor etc.

Permite crear servidores asíncronos

### Características del lenguaje
 *  Concurrencia :  Se refiere a la optimización de procesos de ejecución  en la CPU
 para manejar múltiples hilo esto queriendo decir que permite dividir las tareas entre diferentes entidades como por ejemplo el navegador para realizar múltiples tareas de forma paralela 

* Concurrente:  esto queriendo decir que es un lenguaje capaz de tener las estructuras necesarias para  definir  y manejar diferentes hilos 

* Hilo  : La forma en la que se ejecutan los procesos en un lenguaje ejm : un solo hilo quiere decir que solo puede ejecutar una cosa a la vez y hasta que no acabe la anterior ejecución no podra continuar , y multihilo quiere decir  que es capaz de realizar diferentes procesos de forma concurrente pudiendo finalizar diferentes tareas al tiempo

Node.js es un entorno de ejecución de JavaScript que utiliza un modelo de programación no bloqueante y asíncrono. Aquí hay una descripción más detallada de sus características:

    
1. **Concurrencia y Monohilo:** Node.js utiliza un modelo de ejecución monohilo, lo que significa que todo el código se ejecuta en un solo hilo de proceso. Sin embargo, es concurrente en el sentido de que puede manejar múltiples solicitudes o tareas al mismo tiempo gracias a su bucle de eventos y su arquitectura no bloqueante. Esto permite un alto grado de eficiencia y escalabilidad para aplicaciones con muchas conexiones simultáneas.
    
2. **Funcionamiento Asíncrono:** Una de las características clave de Node.js es su capacidad para realizar operaciones de entrada/salida (E/S) de manera asíncrona. Esto significa que Node.js puede manejar múltiples solicitudes o tareas sin bloquear el hilo principal de ejecución. En lugar de esperar a que una operación se complete, Node.js continúa ejecutando otras tareas y devuelve los resultados de las operaciones asíncronas cuando están listos.
    
3. **Devuelve un Resultado a la Vez:** Node.js no devuelve necesariamente solo un resultado a la vez. Puede manejar múltiples tareas simultáneamente y devolver resultados de manera asíncrona. Sin embargo, la gestión de estas tareas se realiza de manera eficiente y no bloqueante, lo que permite un alto rendimiento y escalabilidad.



### Como es el proceso de ejecución


* Se abre un proceso que toma nuestro código y lo convierte en código maquina después realiza las preparaciones para ejecutarla  y eventualmente nos entrega el resultado

* Hay que tener en cuenta que Node en cuanto note un error parara toda la ejecución al ser monohilo 


