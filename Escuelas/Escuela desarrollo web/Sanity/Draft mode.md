	
### Que es?

Es un moo donde le indicamos a [[Next.js]], que cambie de srrg o renderización estatica [[Progressive server side rendering]] , basicament epor queremos que la pagina sea dinamica a un CRM como [[Sanity]],

### Como funciona?

Draftmode es una función que cundo llamad setea un cookie segura en el navegador que le permite a Nextjs cuando debe cambiar de modo, entonces ahor nextjs logra traer el contenido draft de afuera.

Ok entonces draft mode permite autenticar al navegdor para que tenga permtisos de abrir el studio.

El token es necesario para que el cleinte tenga los permisos para el browsertoken y sevr de ese modo el navegaador peuda conectrse al cliente de forma correcta.

  

export const { GET } = defineEnableDraftMode({

  client: client.withConfig({ token: process.env.SANITY_API_READ_TOKEN }),

});

paara que cuando se ingrese a la api studio anity peuda idependitifcr lso pemrisos y si es un usuario valido, y luego tmbien se le paa al rchivo live para que se peuda establecer la concecion en vivo con el server desde el server y browser no? 








1. El token se le pasa a define config por que basicamente es el que permite, es para poder validar el secreto entonces el cliente de snity llama la api y lo valida , si el secreto es valido se crea la cookie del draft mode al notificar nextjs del extio


2. El server token es usado para que el cliente de server peuda leer drfs, y  contenido no publicdo si tiene permisos de lector 
   
   
3. El browser lo recibe para que el nvegador pueda subcirbirse a actualizacones autenticadas


SanityLive escuha los mensjes proveniente de content lake y entonces si la tag asociada a una request cambio invalid esa tag forzndo a nextjs rehcer la solicitud.