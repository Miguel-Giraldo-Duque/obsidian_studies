
### Como implementarlo?

El seo es una herramienta clave para poder  posicionar nuestras paginas en el navegador , [[Next.js]] provee dos maneras de que de forma granular pagina a pagina podamos indicar los metados de forma estatico o dinamica.


-  Estático: En esta estrategia buscamos implementar un objeto fijo del cual ya conocemos como va a funcionar y simplmente tenemos que en nuestro archivo `page.js` ingresemos el objeto
  

 ```cpp title:"Static"
 
 export const metadata = {

  title: "Productos",

  description: "Lista de productos metaleros",

  keywords: ["productos", "metaleros", "shop", "etc"],

  // Otras propiedades como author , images etc.

};
 ```


-  Dinámico: En esta estrategia la metadata es dinamica por ejemplo como lo podrida ser nuestra pagina de productos que contiene una lista de productos y queremos que estos generen las keywors usando su titulo para eso usamos

 ```cpp title:"Dinamic"
export async function generateMetadata() {
  const products = await getProducts();
  // Extraer solo los títulos de los productos
  const productTitles = products?.map((product) => product.title) ?? [];
  
  return {
    title: "Productos",
    description: "Lista de productos metaleros",
    keywords: [...productTitles],
  };
}
 ```
