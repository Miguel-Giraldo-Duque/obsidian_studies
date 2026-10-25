
### Como usarlas?

[[Next.js]]  permite una gran facilidad en el manejo de las rutas simplificando aplicmaente la configuracion de las rutas basta con usar alias como 

    `"paths": {`

      `"app/*": ["./src/*"]`

    `}`

  `}`  
 
 De este modo next js siempre reconocera a todos las carptetas dentro  src como rutas disponibles en la pagina , teniendo en cuenta lo anterior podemos hacer uso de dos diferentes tipos de rutas
 
 **Rutas fijas** : Una ruta fija se refiere a un ruta que en tiempo no deberia cambiar ejemplo "home" o "products", para que next js pueda reconocer el contenido basta con agregar el nombre page y el [[React]] que queremos renderizar 

![[Adjuntos/Pasted image 20250909205653.png]]


**Rutas dinamicas** : Son utiles cuando sabemos que una ruta no es estática y vamos a necesitar que se este actualizando consistentemente ejemplo en un log post seria el "blog" , o una "categoria" , para usarlas hacemos uso de [rutaDinamica] y con este mismo nonmbre podemos acceder a los valores ingresados en la ruta 

  `const Category = (props) => {

  return <h1>Tienda metalera {props.params.agrupacion}</h1>;

};
export default Category;`