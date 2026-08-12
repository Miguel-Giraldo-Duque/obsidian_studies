
### Como funcionan en Next ?


Las cookies en [[Next.js]] , nos permitene guardar informacion sensible y clave como lo puede ser accesos de token , y nos permite configurar sus uso de lado del servidor de una forma simple :


```cpp title:"Cache" 
import { cookies } from "next/headers";

let valorAGuardar = "Clave23" 

//Nombre de la key
cookies.set("miKey", valorAGuardar , {
	sameSite: "sctric" // Al server component permite mantener las cookies y sus manejo solo para nuestro propio dominio
	httpOnly : true // mantenemos la obtencion y manejo de cookies del lado del server
	path: "/" // La rutas donde la cookie sera accesible como home , prodcuts etc. 

})
```


