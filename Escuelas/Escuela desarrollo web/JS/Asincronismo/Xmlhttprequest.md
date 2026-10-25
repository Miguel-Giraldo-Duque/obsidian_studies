
## Que es?

Es un objeto de js que nos permite hacer peticiones  a la nube (urls o Apis)


// AL momento de nombrar un api o un xmlhtprequest por convencion el nombre de esta se nombra en mayuscula señalando que este no va a cambaiar en el futuro

	  
📪 **Existen 5 estados en un llamado XMLHttpRequest:**  
.

-   **`0`** → Se ha inicializado.
-   **`1`** → Loading (cargando).
-   **`2`** → Se ha cargado.
-   **`3`** → Procesamiento si existe alguna descarga.
-   **`4`** → Completado.  
    .

📫 **Métodos y propiedades:**  
.  
**`xmlhttp.open()`** → Prepara la petición para ser enviada tomando tres parámetros: prótocolo, url, asíncrono (true).  

**`xmlhttp.readyState`** → Retorna el estado de la petición.  

**`xmlhttp.onreadystatechange`** → Un eventHandler que es llamado cuando la propiedad readyState cambia.  

**`xmlhttp.status`** → Retorna el estado de la respuesta de la petición. (200,400,500)  

**`xmlhttp.send`()** → Envía la petición.