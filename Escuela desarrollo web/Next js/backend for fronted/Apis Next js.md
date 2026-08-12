
### Como funciona?

La estructura back for fronted busca proponer una forma nueva para trabajar de forma mas segura cuando queremos consumir un enpoint en un [[Componentes]] de tipo [[Client components]], donde puede ser riesgoso que esta request se vea por ejemplo: 

 - Un header delicado : Tokens de acceso  [[JWT]]
 - Rutas internas: Enpoints reales de nuestra aplicación  


Es importante aclarar que el back for fronted es util para los compoenntes de tipo cliente , pues los del servidor nunca exponen sus request ![[Pasted image 20250914060927.png]]

 ```cpp title:"Proxy API for client"  
 import { getProducts } from "app/services/shopify/products";`
 
export async function GET() {

  const response = await getProducts();

  
  const { products } = response;

  if (!products) {

    `return new Response("No products found", { status: 404 });`

  }

  return Response.json(products);
}
```

