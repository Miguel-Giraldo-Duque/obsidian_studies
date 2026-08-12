## ¿Qué son las API keys?

Las [[Apis]] keys (claves de API) son métodos de autenticación utilizados para verificar la identidad de quien realiza una solicitud a una API.

Es importante distinguir dos conceptos fundamentales:

1. Autenticación: Se refiere al proceso de verificación de la identidad del solicitante. Responde a la pregunta "¿Quién eres?" y se utiliza para asegurar que el usuario o la aplicación que realiza la solicitud es quien dice ser.
    
2. Autorización: Se refiere a los permisos otorgados a cada usuario o aplicación para actuar en el contexto de la API. Define qué acciones están permitidas y restringidas para cada entidad autenticada.
    

Estos dos conceptos trabajan en conjunto para controlar el acceso y proteger los recursos de la API. Al utilizar API keys, se proporciona al backend de la API información sobre la identidad del solicitante, lo cual facilita la autenticación y la toma de decisiones de autorización.

En resumen, las API keys son claves de autenticación utilizadas para verificar la identidad de los solicitantes de una API. Estas claves permiten al backend de la API identificar quién está realizando la solicitud y tomar decisiones sobre qué acciones están permitidas o restringidas para esa entidad.




### Métodos usos 

1. Encabezado de autenticación (Authentication Header): En este método, la API key se incluye en el encabezado de la solicitud HTTP. Normalmente se utiliza el encabezado "Authorization" y el valor de la API key se coloca como un token de acceso. Por ejemplo: `Authorization: API_KEY`.
    
2. Parámetro de consulta (Query Parameter): En este método, la API key se incluye como un parámetro en la URL de la solicitud. Por ejemplo: `https://api.example.com/endpoint?api_key=API_KEY`.
