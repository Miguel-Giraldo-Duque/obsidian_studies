
### Que es ?

Sanity es un CRM, es decir un dashboard que nos permite editar contenidos, permitiendo aplicar cosas como [[Content-driven-application]], normalmente integrado con [[Next.js]],  soluciona el reto del manejo de bases de datos CDNS etc.  

Centrándolo en un solo lugar llamado content lake empoderado con un CDN que permite realizar consultas rápidas y eficientes.

Esto permite cambios en mutuas direcciones desde el dashboard a la app y app al lake, ejemplo escritura de comentarios , likes etc.


Nos comunicamos a este lake con un lenguaje de consulta llamado [[GROQ]] 


Como nos integrmos? 

`client.ts`:  Primero al instalar la librería sea un espacio aparte o en un monorreno, este file nos sirve como un cliente que se conecta con la plataforma de Sanity permitiendo una integración completa

`fetchclient`: Trabaja automáticamente con el sistema de cache basado en tag de Nextjs,  permitiendo realizar querys 

`SanityLive` : Es un servicio de suscripción que permite subcribirse a cambios de contenido en tiempo real permitiendo a la app reaccionar cuando el contenido sin tener que recargar manualmente: 
-  Los clientes mediante **Sync Tags** se vinculan a consultas específicas con cambios en el dataset

- Cuando el contenido cambia se detectan ls tags invalidas y solo los clientes subscritos a esa tag vuelven a realizar la request para obtener una nueva tag y el contenido fresco 

 