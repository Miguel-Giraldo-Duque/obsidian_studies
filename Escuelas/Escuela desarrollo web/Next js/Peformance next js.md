
### Como logra ese performance ?

[[Next.js]] y los [[Server components]] son una herramienta clave en el performance , next js cuando usa server componentes construye html desde el lado del servidor , esto combinado con las siguientes tecnicas lo convierten en una herramienta poderosa:

- Chunking: Next js particiona el html que envia al navegador lo que le permite ir cargando diferentes partes del codigo poco a poco esto ayuda que en la cargas inciales next js mejore su respuesta entregando resultados mas rapido
  
- Carga párela : Next js en lugar de cargar un archivo a la vez permite enviar de forma paralela diferentes archivos lo que permite respuestas aun mas rapida entre los diferentes componentes 

 