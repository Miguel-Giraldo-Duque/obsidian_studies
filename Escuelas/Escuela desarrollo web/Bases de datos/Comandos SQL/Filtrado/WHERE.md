
### Como lo aprovecho?
´Where´  te permite filtrar y aplicar condicionales utiles para organizar y crear una obtencionde datos mas itnelgiente entre algunos metodos tenemso


**Like** : Like nos permite indicar bajo un patron de busqueda  palabras parecidas a la que estamos buscando donde dependiendo del regex puede cmabiar su busqueda por ejmploc uando ingresamos "%miTexto%" le indicamos a la [[Base de datos]] que busque "mitexto" sea al principio o final de una celda 
`SELECT * FROM hospital_mendez.doctores as d where d.nombre LIKE "%r%"`

**Between**: Aqui buscamos los elementos por un rango entre medio donde definimos con el primer valor el punto inicial y el con el segundo argumento hasta donde  y lo que nos devulve es el intermedio que cumple la condicional 

`SELECT * FROM hospital_mendez.doctores as d where d.fecha_registro between "2024-01-01" AND  "2025-09-01";`
