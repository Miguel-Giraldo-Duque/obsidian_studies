### Que es  y para que sirve ?

La normalización en las bases datos nos sirve para organizar nuestra bases de datos de forma organizada y estructurada buscando estado zen donde interdependencia de tablas se manejable , mantiendo la flexibilidad , usanod las [[Reglas de Edgar]] para oganizar nuestra tablas.

### 1FN Descomposición  de atributos

La idea este normalizacion es desconer atributos compuetos en pequeñas partes mas manejables olo y solo si al descomponer el atributo no comprete su funcion ejemplo 

Nombre_completo -->  Primer_nombre , Segundo_Nombre




atributos atómicos 
Buscamos evitar a toda costa atributos que se repiten ejemplo

| id_carro | Modelo | Proveedor_1 | Proveedor_2    |
| -------- | ------ | ----------- | -------------- |
| 22       | ford   | China       | Estados unidos |
El que proveedor se repite 2 veces se convierte en el paso del tiempo en una propiedad poco flexible y escalable pues para agregar un nuevo valor a "proveedor" implicaría cambiar todos los registros
 
**Solución**:  Crear una [[Entidades]] externa que maneje las materias y asociarla con nuestra 

| id_carro(fk) | Proveedor      |
| ------------ | -------------- |
| 22           | China          |
| 22           | Estados unidos |
| 1            | Estados unidos |
### 2FN Atributos entidad

![[Pasted image 20250509205550.png]]

Existen entidades como la del ejemplo donde tenemos atributos que fácilmente podrían ser otras entidades la idea es dividir estos atributos en nuestras entidades o sus propias keys 

![[Pasted image 20250509205705.png]]


### 3FN Entidades purista

Todas los atributos que no hagan parte esencial de la entidad deben ser separados como su propia entidad y campos 
![[Pasted image 20250509205831.png]]
![[Pasted image 20250509205838.png]]


### 4FN Datos repetidos


Como se ve en la anterior tabla ahora logramos independizar de  carro el proveedor podemos manejarlo mas inteligentemente ahora , tenemos el reto que estamos duplicando datos por ejemplo 22 estados unidos y 1 estados unidos
esto causa un exeso en memoria  

**Solución** : Crearemos un tabla intermedia o pivote que nos permita relacionar ambas entidades 

Convención de tabla intermedio : Entidad1_Entidad2

Carro_Proveedor

| id_carro(fk) | id_proveedor(fk) |
| ------------ | ---------------- |
| 22           | 55               |
| 22           | 1                |
| 1            | 1                |

| id_proveedor(pk) | Proveedor      |
| ---------------- | -------------- |
| 55               | China          |
| 1                | Estados unidos |


Ahora agregar un proveedor seria significativamente mas facil ya que para agreuar un nuevo proveedor basta con generarlo con la entidad proveedor y no tendremos problemas
![[Pasted image 20250509210038.png]]

 ![[Pasted image 20250509210044.png]]