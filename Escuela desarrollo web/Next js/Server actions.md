
### Que es y cuando se usa?

Una server action, es un fragmento de codigo de tipo server que nos permite ejecutar funciones en [[Client components]], ests funciones se ejecutan del lado del servidor por lo que no exponemos sus implementación 

y por que no usar simplemente [[Apis Next js]] , el back for fronted lo usamos cuando requerimos si o si, ,manejar la lógica desde el lado del cliente por ejemplo integrase con una api como stripe o entornos donde requerimos si o si de esta interacción  

- Usar server actions para privacidad 

```js cp title:"server action"
"use server"

export const handleAddToCart = async (toAdd) => {
  console.log("compras", toAdd);
  // Logica de agregado al carrito
};

```

Ahora solo tenemos que importarlo y darle uso en nuestro client component
