
### ¿Que es? 


Las keys en [[React]], tienen la función de identificar componentes dentro de el [[Virtual DOM]], y poder comparar de forma segura, el nuevo arbol y sus elementos con los anteriores.
![[Adjuntos/Pasted image 20260414184717.png]]
ejemplo 

```js

const Component = () => {
	return (
	<h1>¡Hola!<h1/>
	{
	  data.map((e) => {
		 <User data={e}>
	  })
	}
	)
}

Lo anterior generaria un nuevo three 

[
 {
  type: h1
  ...
 },
 
// Al definir el map dentro del componente recibimos estos elementos, React necesita verificarlos con el nuevo arbol, este array puede ser borrado, reorganizado, o modificado, causando que si se sortea el array en un nuevo orden, al comparar referencias seran distintas, entonces React simplemente actualizara las props a componentes equivocados  
[
{
  type: User
  ...
 },
 {
  type: User
  ...
 },
 {
  type: User
  ...
 }
]
]

// Al usar una key le decimos a React incluso reordenado, que objeto corresponde a cual entre el nuevo arbol y el viejo, manteniendo la integridad de los componentes. 

[
{
  type: User,
  key: "123ersfASFasf"
  ...
 },
 {
  type: User,
  key: "101ersfASKas"
  ...
 },
 {
  type: User,
  key: "2032larsf2rKas"
  ...
 }
]
]
```


