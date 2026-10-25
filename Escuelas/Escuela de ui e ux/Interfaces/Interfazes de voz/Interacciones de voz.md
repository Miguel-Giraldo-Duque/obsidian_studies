

## Como funcionan ?

En los seres humanos, la interacción se basa en un proceso cíclico: primero tenemos un pensamiento, luego emitimos ese pensamiento a través de un mensaje (habla, gestos, etc.) que es recibido por un interlocutor. Este receptor procesa el mensaje con la ayuda de sus otros sentidos, genera una respuesta mental y finalmente la emite.

![[Pasted image 20241021181252.png]]

Este flujo de interacción es crucial porque refleja cómo nos comunicamos de manera natural. Si lo aplicamos al diseño de una interfaz de usuario, podríamos replicar esta dinámica humana para hacer la interacción con el sistema más intuitiva y cercana al usuario.

Por ejemplo, podríamos implementar estados visuales como **"pensando"** o **"hablando"** en la interfaz. Estos estados proporcionarían feedback visual inmediato, haciendo que el usuario sienta que el sistema está procesando su solicitud o respondiendo en tiempo real, de una manera más humana y comprensible. Esto no solo mejora la experiencia de usuario, sino que también genera una sensación de empatía y conexión con la interfaz.


### A nivel tecnológico 

Primero inicialmente necesitamos reconocer la voz 

Luego aplicamos un NLP permite entender el contexto y incluso un analisis de emociones

![[Pasted image 20241021182728.png]]


1.  Usuario inicia una instruccion
2.  Recibe una varible
3. Respuesta del promt

### Principios para un buena interfaz de voz


El sistema de voz debe sentirse cooperativo , para que percibamos algo cooperativo existen ciertos principios:


#### Lenguaje simple

El uso de un lenguaje claro y sencillo permite que la interfaz sea accesible para un mayor número de personas, asegurando que las respuestas sean comprensibles para todo tipo de usuario, independientemente de su nivel de conocimiento o experiencia.

![[Pasted image 20241021190629.png]]

#### Apoyo
Las respuestas cortas y secas, como un simple **"no"**, pueden resultar frustrantes. En su lugar, ofrecer respuestas más completas, como **"No, pero creo que..."**.


#### No entregar toda la información

Para evitar la **sobrecarga mental**, es esencial que, cuando la respuesta sea extensa, la interfaz ofrezca opciones para ver más información si el usuario lo desea, en lugar de abrumarlo con todo el contenido de una sola vez.
![[Pasted image 20241021190254.png]]

#### Veracidad 
El sistema debe proporcionar información **veraz y comprobable**. La entrega de datos inexactos o falsos impacta negativamente en la confianza del usuario

#### Interrupciones del usuario 

Es importante que el sistema permita al usuario interrumpir el flujo de la conversación, ya sea para detener el habla del asistente de voz o para tomar la palabra al volver a hablar. También es esencial indicar claramente los **estados de la conversación**, como "hablando", "escuchando", "pensando" o "deteniéndose".

 
#### Preguntar

Cuando la instrucción del usuario no es del todo clara, el sistema debe indagar con preguntas adicionales. Preguntar de forma adecuada ayuda a cubrir las necesidades del usuario sin confusión.

![[Pasted image 20241021190502.png]]


#### RePreguntar
Es común que existan situaciones impredecibles, como ruido ambiental o el uso de jerga que el sistema no comprenda. En estos casos, es importante manejar la situación con respuestas claras y respetuosas, como **"No te entiendo, ¿podrías explicarlo de nuevo?"**, para mantener la interacción fluida y agradable.


#### Personalización

La interfaz debe recordar quién está hablando y otros datos básicos de contexto, lo que genera una experiencia más cercana y personalizada. Esto ayuda al usuario a sentirse más comprendido y valorado por el sistema.
![[Pasted image 20241021191546.png]]


Creo además que podría ser una buena idea que la interfaz repita parte de la instrucción que le dices esto genera una sensación de empatía y confianza en el receptor motivándolo a seguir hablando  , como dice el libro de Chris Voss "rompe la barrera de No"

ejemplo
- **Usuario**: "Quiero generar un reporte mensual de ventas."

- **Interfaz**: "Entendido, quieres generar un reporte mensual de ventas. ¿Te gustaría incluir algún dato específico?"


