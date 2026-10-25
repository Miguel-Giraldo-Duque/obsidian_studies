### Por que hacer testing?

 Al principio también me lo preguntaba y decía por que crear un código que pruebe mi código cuando simplemente lo puedo hacer yo? , la respuesta la obtuve cuando mi UI hiso quedar mal a mi compañero en Qnow al fallar una renderización .

El este testing nace con el deseo de mejorar la confianza y calidad del código buscando distintos niveles de pruebas para el producto.



#### Y como lo hago?
**Lo primero que tenemos que entender es que el testing se debe enfocar en probar y mejorar la calidad de los fetures que mas impactan al negocio ejemplo** :

> Mi app es para una aplicación de citas donde personas se conocen unas a otras compartiéndose música.

**Errores que impactarían a mi negocio :**
- Que los usuarios no puedan recibir la música compartida
- Que el usuario no vea o pueda compartir música
- Que el usuario no pueda ver sus mensajes
- Que el usuario no reciba mensajes 

Cada uno de los anteriores errores implicaría un ticket para soporte, pero en el peor se pierden millones y la confianza en el producto.


Por ello en la materia del testing tenemos 3 niveles donde buscamos probar nuestra aplicación en diferentes tanto backend como fronted por ejemplo
[[Node]]
[[Componentes]]


##### Testing para el fronted

**Primer nivel pruebas unitarias**:  Las pruebas unitarias buscan tomar los componentes y probar sus comportamientos individuales , en caso de que estos requieran dependencias de otros se simula sus compartimientos 

**Segundo nivel pruebas integraciones**:  Buscamos probar interacciones entre distintos componentes de la aplicación,  apuntando a simulación mas cercana del comportamiento del usuario.

**Tercer nivel pruebas end to end**:  Aquí buscamos probar la aplicación en su total incluyendo APIS, servicios e interacciones reales por las que un usuario realmente pasaría estas dado que usan recursos reales hay que medir su uso .

Cada uno de estos escalones de pruebas nos dan cada vez mas confianza de nuestro producto y entre mas orientados nuestros reales objetivos y el usuario mejor.

![[Pasted image 20250614165046.png]]
