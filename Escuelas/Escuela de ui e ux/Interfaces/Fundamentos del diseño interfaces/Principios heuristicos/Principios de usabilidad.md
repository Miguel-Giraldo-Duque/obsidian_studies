



###  1 Relacionado al mundo real

Jacob Nielsen dice que el lenguaje y conceptos en nuestra paginas nos dice que debemos buscar que nuestra interfaces tengan un lenguaje acercado a diario vivir de los usuarios un lenguaje y conceptos muy técnico dificulta la interacción al usuario , por ejemplo un botón para comprar una fruta resulta mas fácil de entender al usuario "comprar" a "integrar" buscar un lenguaje simple para un entendimiento.


### 2 Visibilidad en el estado del sistema 

Debemos indicarle al usuario que esta pasando tras bambalinas si se están procesando documentos , o se realiza una acción automática de autoguardado, llevado al diseño lo podríamos entender como pantallas de carga que anticipan una acción.

Se be buscar secciones donde mostrar este estado y definir zonas de mensaje , diseñar pantallas intermedias entre una y otra


### 3  Control en el sistema

El usuario debe tener el poder de volver atras de usar una salida de emgercia cuando se equivoque en la interacción "un volver atras" o incluso si se le sale el proceso un "borrador" que almacene su trabajo y le evite volver a empezar mejora su experiencia .

1. concicderar una opcion para volver atras
2. Un borrador del trabajo

### 4 Consistencia y estándares 

El usuario debe reconocer patrones , no debería preguntarse si un boton hace lo mismo que otro , lo que el usuario debe entender es que por ejemplo todos los "botones azules " son para confirmar la acción , que todos los "botones rojos" para cancelar la acción , no deben existir inconsitencia cuando vuelva aparecer los botones si determinamos que el boton azul es para confirmar entonces el color rojo no deberia ser el botón para confirmar.

Debemos definir un uso para los colores para diferentes mensajes
Debemos definitr un estilo en botones para los diferentes interacción
Debemos buscar definir un terminología antes de diseñar y consistencia a lo largo de la interfaz

### 5 Prevención de errores

Es clave indicarle al usuario exactamente que esperamos que haga en nuestro elemento, si es un input para ingresar su información un plasholder que le diga "escribe aqui.." si es un drag and drop "Arrasta  hasta 5 documentos"

Debemos asegurarnos que nuestros elementos tramitan la intension queremos trasmitir con el elemento

Podemos bloquear los elementos que no son requeridos
![[Adjuntos/Pasted image 20241201191856.png]]


### 6 Reconocer , no recordar

Es importante que el usuario no tenga que recordar información de previas pantallas , cuando usa acción es compleja no solo conviene dividirla si no mantener al usuario cuales son las instrucciones que debe seguir por ejemplo en una compra tenemos "1 Confirmar carrito", "2 Datos facturación", "3 Éxito" el usuario debe tener de forma accesible las instrucciones actuales .

Integrar pasos actuales 
Campos de ayuda cuando necesitemos informacion

![[Adjuntos/Pasted image 20241201191919.png]]

### 7 Flexibilidad en el sistema

Nuestro sistema se debe adaptar al momento en que tengamos usuarios mas experimentados y queramos acelerar su procedimiento , cosas como autor rellenar formularios , uso de plantillas para que el usuario no tenga que realizar las mismas acciones que cuando empezó su uso


### 8 Diseño minimalista 

Entre mas simple el lenguaje estructura y acciones , y elementos innecesarios reducimos su carag mental permitiendole tomar acciones mas faciles y rapidas

Debmos evitar elementos que no cumplan una funcion especifica y que no trasmitan la informacion que que queramos

Evitar la complejidad inesesaria

Eliminar lo que puede ser una distracción para cumplir una acción
![[Adjuntos/Pasted image 20241201192006.png]]


### 9 Documentación y enseñanza

Cuando nuestras interfaces son muy complejas conviene hacer uso de una documentación de su uso ,  cosas como un chat en vivo para solucionar dudas, un documento donde se explique como usar la aplicación  , preguntas frecuentes todo para que llevar facilitar la curva de aprendizaje del usuario 
![[Adjuntos/Pasted image 20241201192049.png]]

### 10 Ayudar al recocimiento y diagnostico de errores

Cuando existan errores en la aplicación  como los vamos a manejar?, deberemos por buenas practicas entregarle al usuario cual fue el error + un posible solución , ejemplo "no se pudo enviar la transferencia inténtalo de nuevo "  

Los mensajes de error deben ser claro y entrguen soluciones
Mostrar los errores que suceden en el contexto input con errores especficos ser marcados como los errores por ejemplo
