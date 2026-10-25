
### ¿Que es?

Es un lenguaje de query que busca dar mayor flexibilidad al trabajar con [[Apis]] y otorgar una solución mas flexible de consulta para los clientes que solo requieren ciertas partes de la respuesta y quieren combinar con otras en un sistema centralizado.

Ejemplo digamos que tengo mi [[Api rest]] de star wars, y mi objetivo es obtener todas las peliculas y todos los planetas, ello tradicionalmente implica dos request a las cuales luego tendriamos que merger sus repuestas.

Ahi es donde GraphQl brilla permite obtener los datos en un solo query de ambos contextos obteniendo una repuesta unificada:
```js
// Tambien al acceder a sus subhijos nos permite especifciar que campos especificos requerimos evitando traer respuestas con datos sin usar.
query MyQuery {
  allFilms {
    films {
      id
    }
  }
  allPlanets{
    planets{
      name
    }
  }
}
```


### ¿Como funciona?

GrahpQl es mas como intermediario entre el cliente y el servidor, no busca conectarse directamente a los servicios en su lugar funciona como un sistema de consulta que reúne todo el poder y conocimiento que se le integra.

![[Adjuntos/Pasted image 20251222222540.png]]