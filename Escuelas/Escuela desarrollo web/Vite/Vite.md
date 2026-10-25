
### Que es?


Es una herramienta de 3 generación para un mejor experiencia de desarrollo fronted , ofreciendo rapidez y versatilidad al momento de desarrollar aplicativos , una delos principales beneficios del uso de vite es su capaciad de realizar buldles


![[Adjuntos/Pasted image 20240924173542.png]]

Lo que hace es minizar tu código en un gran archivo principal el cual mediante diferentes procesos habrá eliminado todos los espacios y otros elementos  que le permiten al motor trabajar mas eficientemente 

resultando en mejores **performances**


yeoman generator
prettier
eslint


### Caracterizticas

-  **Prebulding** : Vite se encarga de estandarizar todas tu dependecias a es modules un formato en común de ECMAScript  los esModules , evitando incompatibilidades

- **Dependency resolving** : Una vez estandarizado tu codigo te permite exponer tus archivos por url ademas utiliza un chache fuerte que permite acelear la velocidad enq ue se sirven los archivos

- **Hot module**: permite actualizar como nodemon los archivos html una vez guardados con la caracteristica que solo actualizara los elementos actualizados no todo el estado general de la pagina

 + **Personalizacion despliege** : Se puede agregar nuestra propia configuracion para personalizar como queremos que compilen , ademas de ello vite al usar roullup permit un bundle muy optimo para nuestrso proyectos dado que al encontrar un archivo que depende de otro descargara ese archivo para que cuando sea solicitado pueda ser usado rapidamente

### Como funciona internamente ?


```js
// nos traera la ultima vercion y ejectura actumaticamente las preguntas para la creacion de neustro proyecto . 
 npm create vite@latest 
```

Nos creeara un package.json que contiene nuestros comandos .

```json
"scripts": {

    "dev": "vite",
	// Desplegar
    "build": "vite build",

    "lint": "eslint .",
	// previsualizar como se ve el build
    "preview": "vite preview"

  }
```

Vite compila nuestro codigo y lo organiza pro url que se disponibilizan en todo nuestro archivos
```js
import {createHotContext as __vite__createHotContext} from "/@vite/client";
import.meta.hot = __vite__createHotContext("/src/App.css");
import {updateStyle as __vite__updateStyle, removeStyle as __vite__removeStyle} from "/@vite/client"
const __vite__id = "C:/Users/migue/OneDrive/Escritorio/Escritorio/Escuela de desarrollo web/curso_vite/src/App.css"
const __vite__css = "#root {\n  max-width: 1280px;\n  margin: 0 auto;\n  padding: 2rem;\n  text-align: center;\n}\n\n.logo {\n  height: 6em;\n  padding: 1.5em;\n  will-change: filter;\n  transition: filter 300ms;\n}\n.logo:hover {\n  filter: drop-shadow(0 0 2em #646cffaa);\n}\n.logo.react:hover {\n  filter: drop-shadow(0 0 2em #61dafbaa);\n}\n\n@keyframes logo-spin {\n  from {\n    transform: rotate(0deg);\n  }\n  to {\n    transform: rotate(360deg);\n  }\n}\n\n@media (prefers-reduced-motion: no-preference) {\n  a:nth-of-type(2) .logo {\n    animation: logo-spin infinite 20s linear;\n  }\n}\n\n.card {\n  padding: 2em;\n}\n\n.read-the-docs {\n  color: #888;\n}\n"
__vite__updateStyle(__vite__id, __vite__css)
import.meta.hot.accept()
import.meta.hot.prune( () => __vite__removeStyle(__vite__id))
  }
```

Dando este tipo de estructuras , es importante tener en cuenta que vite usa cache por lo que si en nuestro codigo no llegamos a ver nuestros cambios debemos ir a
![[Adjuntos/Pasted image 20240924184212.png]]

Vite crea archivos de cache para no tner que recargar todos los archivos previos dandoles un t

![[Adjuntos/Pasted image 20240924191017.png]]

Y si creamos un cambio solo reejecuta lo diferente 
![[Adjuntos/Pasted image 20240924191136.png]]

Lo que nos termina dando un chache en general con su identificador por cambio


Facilidad exesiva para los preprocesadores


Dependiedno de la forma en que importamos nuestros archivos vite nos ayudara a opmitizarlo si solo importamos un obejtopor ejmplo  . 


```js
// file name data
user={
 nanme: "Miguel"
}
user2={
 nanme: "Miguel"
}
user3={
 nanme: "Miguel"
}


// Si lo imprtamos asi :

import data from "./data/data.js"

<p>data<p>

// vite opmitizara el uso para todo el manejo del objeto pero si lo importamos individualmente 


import {user1} from "./data/data.js"


// solo traera ese valor no el resto del archivo
```


Permite importacion global de archivos :


 ```js
// modulo1 
user={
 nanme: "Miguel"
}
user2={
 nanme: "Miguel"
}
user3={
 nanme: "Miguel"
}
// modulo2 
user={
 nanme: "Miguel"
}
user2={
 nanme: "Miguel"
}
user3={
 nanme: "Miguel"
}


// Si lo imprtamos asi :

const modules =  import.meta.glob("./modules/*.js")

// solo traera ese valor no el resto del archivo
```


### Variables de entorno 


Para usarlas en nuestros archivos .env , debemos indicardo VITE_MIVAR

```
// Variable entorno

VITE_PORT = 3000


// Nos trae todas las varibles
export default defineConfig(({command, mode}) => {

  

  const env = loadEnv(mode , process.cwd())

  
  

  return{server:{ port: env.VITE_PORT}  ,  plugins: [react()]}

  

})
```


### Librerías 


Podemos crear nuestras propias librerías desde el mismo vite , solo cambiando su archivo de configuración y usando [[npm]] link para crear un libreria de forma global en nuestro dispositivo para ello :


```js
import { defineConfig } from "vite"

import {resolve , dirname} from "path"

export default defineConfig (() =>{

  

  const __dirname = resolve(dirname(""))

    return{

      build:{

        lib: {
		// Le pasamos nuestro archivo
          entry: resolve(__dirname , "index.js") ,
		// Debemos indicarle siempre el nombre
          name: "Demo",
		// Y aqui personalizamos el nombre de archivo para ajuste al modulo que usamos
          fileName: (module) => `demo${module}.js`

  

        }

      }

    }

})

```


Luego en nuestro packega JSON 

```js
  "name": "poema_tu_chica",

  "private": true,

  "version": "0.0.0",

  "type": "module",

// En caso de que use require para la importacion usamos es "umd"
  "main": "./dist/demo.umd.js",
// Si usamos imports de EmmaScrpit modules -->
  "module": "./dist/demo.umd.js",

  "exports":{

    ".":{
	// Le indamos las direciones dependiendo de tipo de importacion y a que archivo hacer solicitud .
	
      "import": "./dist/demo.es.js",

      "require": "./dist/demo.umd.js"

    }

  },
```


Por ultimo lo hacemos disponible globalmente en nuestro dispositivo con npm link

```npm 
// En nuestra carpeta 
npm link

// Luego en el archivo externo llamamos link con el nombre nuestro paquete ser cuidadoso con los typos

npm link poema_tu_chica


```

