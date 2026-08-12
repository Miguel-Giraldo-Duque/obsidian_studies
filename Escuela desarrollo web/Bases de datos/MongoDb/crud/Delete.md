

## Como lo hago?

Para eliminar elementos en [[Consultas mongo]]  podemos usar 


````json
use("plazi_store")

db.products.deleteOne({_id: 1})

// o para eliminar varios


db.products.deleteMany({price: 100}) // elimina a todos los que coinciden con el query en este caso price:100


```


