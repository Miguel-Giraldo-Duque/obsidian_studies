

### Cuales con?

En [[TypeScript]] podemos realizar tipos que esencialmente aunque no se traducen a js concreto permiten realizar transformaciones utiles, o dejar estrutura para el manejo de datos

```ts
  type Note = {

    id: number;

    title: string;

    content: string;

    image_url: string;

  };

  

  // Modificamos solo una parte por ello usamos  el mapping de las keys, nos permite realizar cambios, digamso que el notes del backend viene pero queremos transformar su formato al nuestro interno.

  type NoteUpdate = {

		      ?: Note[K];

  };

  // Literal types permiten determinar tipos de valores mas que un array, que solo condidera un grupo de valores, ENTONCES cualquier valor fuera de esos tipos ser marcado como error.
  type NotificationStates = "SUCCESS" | "FAILD" | "WARNING";
  
	type Dado = 1 | 2 | 3 | 4 | 5 | 6;
	let tirada: Dado = 7; // ❌ Error

```