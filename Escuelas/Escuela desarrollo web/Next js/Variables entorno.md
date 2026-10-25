
### Como usarlas con Next js?

Similar a [[Vite]] , Next js nos ofrece la posibilidad de manejar claves  secretas  que nuestro codigo requiera, de forma preterminada next js ya maneja la importación de estos dejándonos con dos tipos de variable 

 - **Server(privadas)** : Todas las variables de entorno sin el prefijo de ==NEXT_PUBLIC== son consideradas de lado del servidor es decir desde el client no es posible acceder a este recurso 


-  **Publicas**  : Algunas variables requieren ser publicas para su correcto manejo  en el cliente , para usarlas solo debemos agregar el prefijo ==NEXT_PUBLIC_MYVR== 


En el codigo para traerlas solo debemos

`console.log("env priv", process.env.NEXT_PUBLIC_ID);`