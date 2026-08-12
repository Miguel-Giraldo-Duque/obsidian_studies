
Es un gestor de  [[Bases de datos]] relacional que utiliza SQL para la realización de  solicitudes como `SELECT`, `INSERT`, `UPDATE`, y `DELETE` el crud en general para nuestras bases de datos 


### Como lo uso con node ?

En node necesitaremos dos cosas express js y Pg 

````bash
npm i express pg
````

Para empezar vamos a crear la base de datos con pg  vamos a crear un 
[[Pool de conexiones]] 


````js
// Sacamos al constructor Pool de pg 
const {Pool} = require("pg")

  
// Ahora en nuestra isntancia deberemos incarle
const pool = new Pool({
    host: "db", // Direcccion de nuestra base de datos
    port: 5432, // En que puerto va correr la base de datos
    user: "Reaper", // El nombre del  usuario de la base de datos
    password: "2244", // La contraseña
    database: "supp_trackerDB" // Nombre base de datos

})

  
// Exportamos pool
module.exports = pool

````

