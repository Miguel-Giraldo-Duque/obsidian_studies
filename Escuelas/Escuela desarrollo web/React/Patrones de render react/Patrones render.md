

## Que son?


Como programadores de [[Escuela desarrollo web/JS/React/React]] nuestras tareas de diseño son : 

- *Depuración* :  React nos facilitara pistas para encontrar nuestros errores en código mas fácilmente 


### Qué es composición de componentes y colocación del estado?

.  
Es un patrón para crear componentes que nos da libertad para elegir dónde y cómo usamos nuestros componentes. Cada componente debe cumplir una tarea muy específica pero no debe de decirnos exactamente como usar esa solución que nos provee, debe ser muy flexible dándonos libertad para usar la información como queramos.

Esto nos permite hacer a los componentes más fáciles de integrar al resto de componentes, y agiliza el proceso de reutilizar o hacer cambios en los componentes.  
.  
Colocación del estado

¿Dónde los guardamos? Este problema también se conoce como state colocation.

- Máxima cercanía a la relevancia: El estado debe estar tan cerca como sea posible de donde lo estemos usando y actualizando.
- Stateful vs stateless: Separar lógica y estado de componentes que manejan UI.

.  
Ir de lo grande a lo específico.  
.  
Hay que examinar que componentes manejan su propio estado, asumiendo que todos los componentes consumen el estado general de la app queremos encontrar a los componentes que crean un estado aparte del general. De esta manera podemos dividir componentes, de un lado tendremos a los componentes que solo consumen el estado general de la app y esos son componentes stateless(de interfaz, de UI), y del otro lado a los componentes que crean su propio código interno (estado) serán los stateful y siguiendo el principio de separar al estado de la UI podemos dividir a estos componentes con su propio estado en 2 uno stateful, y el otro en stateless.