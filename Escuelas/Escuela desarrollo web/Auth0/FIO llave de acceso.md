
Si usamos el [[Multifactor authentication]] podemos usar una herramienta llamada las llaves de acceso que on un dispositivo fisico que nos permite autenticarnos a un servicio al ser una medida extra para la autenticación permite reducir el posible riesgo de una vulnerabilidad su uso en Auth0 es :


  1.  Inicialmente tenemos la key , el browser , servidor de autorización  ejm(Auth0)
  - Entonces nos  registramos, el browser enviaría al servidor  un challenge,
  - El server crearía dos elementos la llave publica y privada 
  - Por ultimo devolvemos el challenge con la llave privada y el challenge firmado 
  - El server no guardaría la llave privada , solo la llave publica que mas tarde se usa para verificar la validez de una firma
    ![[Adjuntos/Pasted image 20250824231500.png]]
     
  1. Ahora  si no queremos logger  usamos password y la llave de acceso que contendrá la clave privada, cuando hagamos esto el servidor recibirá un challenge firmado por nuestra llave privada y revisara la validez de la firma.
   
