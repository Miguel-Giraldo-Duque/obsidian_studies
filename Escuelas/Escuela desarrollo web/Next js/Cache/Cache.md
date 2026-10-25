

### ¿Como funciona?

El cache es una herramienta clave para manejar altos niveles de perfomarce en nuestras aplicaciones, el cahce busca en resumidas cuentas no recalcular información que ya tenemos disponible guardandola en memoria, en local storage o herramientas externas como redis.

En [[Next.js]] usa una version integrada de chache que le permite manejar integraciones de cache automáticamente usando la funcion `fetch`  de [[javascipt]] , **de forma automática next js utiliza `force-cache` que fuerza el cache en todas las peticiones que se solicitan**.

Esto  puede llegar a ser un problema , pues si requerimos de un manejo mas dinámico del cache podemos 


#### ¿Como invalidar cache y sus métodos en Next js?

- **Tiempo** :   Podemos indicarse a Next js con el campo `revalidate` que recibe el tiempo en segundos ,que al acabar el cache debe ser invalidado, permitiendo nuestra request la version mas reciente. 
  
```cpp title:"Función request con revalidate"  
export const getAllByIdCollection = async (id) => {

  const data = await fetch(`${shopify.collection.getById(id)}`, {

    headers: new Headers({

      "X-Shopify-Access-Token": env.ACCESS_TOKEN_SHOPIFY,

    }),

	// Le indicamos que cada 10s debe invalidar el anterior cache
    next: { revalidate: 10 },

  });

  if (!data) {

    return { message: "Error" };

  }

  const { products } = await data.json();

  console.log("Dat", products);

  return products;

};
```



- **Tag** : Next js ofrece la opción de manejar tags personalizadas que nos permiten de forma programática invalidar o revalidar un cache dándonos total  control cuando neutra app debe buscar nuevos datos. 
  
  Usos: Estamos en Argentina los precios de nuestros proveedores de harina, suben y bajan dada la naturaleza volatil del mercado local debemos encontrar un metodo rapido y eficiente para actulizar de forma especifica el precio de los panes que dependen de este harina 
  
  Podemos asignar cache `'harina-depedent'`  a mi producto  `'Pizza-peperoni'`  entonces para mi cliente en mi ecomerse la actualizacion de precio seria practiamente instanea pues si tenemos el evento no tendria por que preocuparse por un  cambio total de la pagina solo de la zona correpondiente
  
```cpp title:"Función request con tag"
export const getAllCollections = async () => {

  const data = await fetch(`${shopify.collection.all}`, {

    headers: new Headers({

      "X-Shopify-Access-Token": env.ACCESS_TOKEN_SHOPIFY,

    }),

    next: {

      tags: ["collections-list"],

      revalidate: 60,

    },

  });

  if (!data) {

    return { message: "Error" };

  }

  return data.data.custom_collections;

};
```
 
 Revalidate nos permite indicar  a la funcion que debe resetear sus valores
 `revalidateTag("collections-list")`