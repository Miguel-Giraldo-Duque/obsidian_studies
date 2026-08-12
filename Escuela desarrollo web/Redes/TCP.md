

## Como funciona?

Es un modelo de [[Redes computaciones]] altamente común que usa paquetes para la transmiccion de información basada en la conexion donde se busca asegurar el buen estado de la informacion enviada a la otra computadora , udp en el contrario prioriza el envio de datos con rapides y sin conexion : 

![[Pasted image 20240918185758.png]]


La mayor parte del tiempo cuando entramos a una pagina web usamos el modelo DNS que se encarga de traducir ese dominio en una ip a la que nos podemos conectar


**Niveles de las capas:**

- Capa 1 (Interfaz de red): La primera capa es el nivel más bajo de comunicación que está conformado por pulsaciones eléctricas o trasporte físico. Solo transmite la información por medio físico.
- 
- Capa 2 (internet): Se encarga de comunicar dos host para que transmitir los datos, estable la ruta para que llegue la información al punto deseado.
-
- Capa 3 (Transporte): Se encarga de transferir los archivos entre los dos host, para esto existen varios protocolos, por ejemplo el protocolo “TCP” que se encarga de transmitir los datos priorizando la fiabilidad de los mismos (que no se pierda información en el camino) y el protocolo “UDP” que se encarga de la velocidad de transmisión de datos antes que la fiabilidad del mismo (prefiere mandar los datos lo más rápido posible aun que pierda algo de información en el camino).

- Capa 4 (Aplicación): Ofrece a las aplicaciones (de usuario o no) la posibilidad de acceder a los servicios de las demás capas y define los protocolos que utilizan las aplicaciones para intercambiar datos, como correo electrónico (POP y SMTP), gestores de bases de datos y protocolos de transferencia de archivos (FTP).