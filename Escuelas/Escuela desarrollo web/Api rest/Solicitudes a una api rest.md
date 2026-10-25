


## Cómo hacer una solicitud a una API REST

Para realizar una solicitud a una [[Api rest]], sigue estos pasos:

1. Encuentra una API a la que deseas hacer una solicitud. Puedes buscar Apis  públicas en sitios como GitHub. En este ejemplo, utilizaremos el API Waifu.im, que proporciona imágenes de personajes de anime.
    
2. Consulta la documentación de la API, donde generalmente encontrarás la URL a la que debes realizar la solicitud. Por ejemplo, en el caso del API de nuestra práctica, utilizaremos "[https://api.waifu.im/search](https://api.waifu.im/search)".
    
3. Para realizar la solicitud, puedes utilizar la función `fetch` en JavaScript. Aquí tienes un ejemplo de cómo hacerlo:

```js

const apiUrl = 'https://api.waifu.im/search';  // Puede ser cualquier api que quieras usar 

  

fetch(apiUrl)

  .then(response => {

    if (response.ok) {
      return response.json();

    } else {

      throw new Error('Request failed with status code: ' + response.status);

    }

  })

  .then(data => {
	// La accion que quieras hacer con tu codigo 
    const img = document.querySelector("img")

    img.src = data.images[0].url

    console.log(data.images[0].url);

  })

  .catch(error => {

    console.error('An error occurred:', error.message);

  });

```

Este código utiliza `fetch` para realizar una solicitud GET a la URL de la API. Luego, maneja la respuesta verificando si la solicitud fue exitosa y, en caso afirmativo, convierte los datos de respuesta en formato JSON. Por último, puedes utilizar los datos obtenidos para realizar acciones en tu aplicación, como mostrar imágenes en el ejemplo anterior.

Recuerda adaptar el código a la API específica que estés utilizando, considerando las rutas, los parámetros y los datos esperados de respuesta.