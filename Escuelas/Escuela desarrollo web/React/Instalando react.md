
## Que es [[Escuela desarrollo web/JS/React/React]] ?



React es una libreria creada por facebbok con el fin de optimizar el desarrollo de interfazes de usuario .

Su estrucutura se basa en los componentes que es en esencia una parte de la interfaz de usuario , por regla general estos componentes se crean de forma individual y reusable para facilitar el crecimiento de la interfaz 

Basandsose en que tenemos un componente raiz el cual tiene unos hijos y estos a su vez tambien , entiendiendo como una especie de arbol familiar

![[Pasted image 20230304113257.png]]


# Como instalar react a tus proyectoss


Existen dos metodos : 


1. El primer metodo se basa en tomar los scrips directamente de react 
	Primero es necesario crear un contenedor en el DOOM  como por ejemplo 

	``<div id = "cualquierCosa"></div``


2.  Luego crear el contenedor hemos de traer los script de react 

  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>


3.  Y listo ahora tenemos a react en nuestro proyecto ahora podemos crear nuestros primeros componentes [[Componentes_react]]



El segundo metodo y el mas usuado en el entorno profecional  es usarlo atravez del gestor de dependecias npm , para usar este metodo hacemos lo siguiente 


1. Abriremos la terminal  y escribiremos el siguiente comando 

``npx create-react-app nombreDeMiProyecto``

// Aqui es muy recomendable utilizar npx por que nos permite instalar temporalmente nuestras herramientas para ejecutarlas y posteriormente borrarlas , lo que nos permite tener simpre actualizada la herramienta que queramos utilizar 

por ello su diferencia entre npm y npx es que con npm instalamos la libreria , pero npx tenemos simepre asegurado de que vamos a instalar la vercion mas actualizada de herramienta que queremos utilizar 



2. y listo una vez finalizada la instalcion podremos inicar a trabajar con react . 


## Como inicarlo en el navegador 

Para iniciar cualquier proyecto de react en el navegador se usa el sigueinte comando


``npm start``

