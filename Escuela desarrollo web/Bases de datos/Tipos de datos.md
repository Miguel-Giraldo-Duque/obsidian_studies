### Cuales son?


En la [[Bases de datos]] nos permiten contruir, en nuestro modelos de [[Entidades]] y [[Relaciones]]  un claridad frente a los datos que usuaran los atributos siendo dividas por 

Tipo texto

| Valor   | Descripcion                                                                                                                                                                           |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CHAR    | Nos permtie ingresar caracteres limitados que definiamos una primera estancia exjemplo userName max 20 caracteres , resulta mas performante al evitar el re calaculo a varchar        |
| VARCHAR | Varchar es un espacio dinamico en memoria que se estira y mueve dependidendo del largo del texto, su deventaja es que una escala muy amplia este recalculo en memoria resulta costoso |
| TEXT    | Esta pensado para almacenar grandes cantidades de texto cosas como blogs ,  libros etc.                                                                                               |
|         |                                                                                                                                                                                       |
Numérico

| Valor    | Descripcion                                                                                                    |
| -------- | -------------------------------------------------------------------------------------------------------------- |
| INTEGER  | Nos permite solo ingresar valores enteros que después con la base de datos podemos modificar                   |
| BIGINT   | Son valores numericos significativamente masivos , y este tipo de datos nos permite manejarlo performantemente |
| SMALLINT | Es pensado para numeros pequeños de un rango de 99 como maximo ideal                                           |
| DECIMAL  | Recibe dos parametros el (entero , fracionario )                                                               |
| BOOLEAN  | True o false                                                                                                   |
| NUMERIC  | Recibe dos parametros el (entero , fracionario ) util para calculo de monedas                                  |


COntrains

| Valor       | Descripcion                                                                                                                                                                                     |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NOT NULL    | Nos permite asegurar que el valor no pueda estar vacio , ejemplo donde nombre si o si debe estar                                                                                                |
| UNIQUE      | Nos permite indicar que un registro es unico y que nouy ninguno mas como el , ejemplo un correo electronico                                                                                     |
| PRIMARY KEY | Es un identificador unico de cada fila que nos permtie usarlo para relaiconarse con otras tablas                                                                                                |
| FOREING KEY | Es un primary key de otra tabla que usamos con nuestra tabla local para relaiconar ambas ejmplo , key de estuadinte como foregin key de casillero                                               |
| INDEX       | Nos permite indexar para evitar recalcular busquedas muy frecuentes , no se debe usar si la base de datos requiere de una amplia creacion de nuevos reigstros ejemplo de suo supermercado pagos |
| CHECK       | Es un tipo contraint que nos permite crear condciones personalizadas que rechazen o se encarguen de controlar los nuevos registro si esperamos que cumplan con cierta regla , cierto texto etc. |
| Default     | Valores precreados y caragdos en la base de datos                                                                                                                                               |
Time

| Valor     | Descripcion                 |
| --------- | --------------------------- |
| DATE      | Permite guardar fechas      |
| TIME      | Permite guardar horas       |
| DATETIME  | Fehca y hora                |
| TIMESTAMP | Fehca y hora , milisegundos |
|           |                             |
|           |                             |
