
## Que es? 

Cors es una prevencion de seguridad del navegador para evitar ataques de tipo Mac poofing  que son ataques en los que te haces pasar por alguien que no eres cambiando tu MAC que es como tu identificador único , antes las paginas web no contaban con tal tecnologia lo que debejaba acecible a cualquiera que quisiera ingresar a una api la posibilidad de facilificar su identidad 


Este metodo de seguridad en [[Node]]  funciona igual , si nosotros quisiéramos conectarnos desde nuestro cliente a una api y esta no contara con CORS el mismo navegador nos daria error de red 


Por ello en Node en nuestros servidores podemos darle una serie de configuración a CORS de quienes permitimos realizar solicitudes y a quienes no


Para instalar usamos


````bash

npm i cors

````


Luego si digamos lo estamos usando con express le indicamos 

````js
const cors = require("cors")


app.use(cors())
````


Ahora le estamos diciendo que permitimos el ingreso de cualquier de cualquier entidad para hacer solicitud , sin embargo cors ofrece la opcion de otorgar permisos en nuestras [[Apis]] dependiendo de quien (dominio del request )y de donde se hace el request ejemplo 


````js

const cors = require("cors")


app.use(cors())

// Creamos una whiteList de dominios que permito hacer request


const whiteList = ["http://localhost:3000"]

// Configuramos en la propiedad origin los sigueintes parametros :   origin (Dominio que hace la solicitud) , callback(Lo que devolvemos)
const options = {
	origin: funtion(origin, callback){
		// Si ese dominio esta en nuestra lita lo deja pasar de lo contrario lanza error
		if(whiteList.indeOf(origin) =! 1){
		
			callback(null, true)
		}else{
			callback(new Error("Not allowed"))
		}
			
	
	}
}

````

Digamos que queremos filtrar por pais

````js

app.use(async (req, res, next) => {
  try {
    const ip = req.ip; // obtener la IP de la solicitud
    const response = await axios.get(`https://ipinfo.io/${ip}/json`);
    const country = response.data.country;

    // Permitir solo solicitudes desde un país específico
    if (country === 'US') { // ejemplo: permitir solo desde EE.UU.
      next();
    } else {
      res.status(403).json({ error: 'Acceso denegado desde tu país.' });
    }
  } catch (error) {
    console.error('Error al filtrar por país:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});
````

