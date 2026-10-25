


## Como hacerlo ?

Para instalar una dependencia  con npm se tiene que hacer lo siguiente 

```js

npm install nombreDependencia 
```



Lo anterior es la opción  predeterminada que pondría nuestra dependencia para producción  , sin embargo si quisiéramos instalar una dependencia únicamente para el desarrollo debemos usar   :

```js

npm install nombreDependencia --save-dev
```


o para una versión mas abreviada 

```
		npm install nombreDependencia -D
```


Si quisiéramos mandar nuestra dependencia a produccion podemos usar 

```
	npm install nombreDependencia --save 
```



#### Paquetes globales 


Para instalar uno utilizamos el comando 

```
	npm install -g nombreDependencia
```


### Como saber cuantos paquetes tengo instalado?


npm list 




## otros comandos 

- `npm install package-name -o` → Instalar una dependencia opcional
- Se pueden generar conflictos cuando se tienen paquetes que usan la misma dependencia pero en versiones diferentes. Para evitar esto se puede simular una instalación con `npm install package-name —dry-run`. Con esto se simula la instalación pero sin agregar ningún paquete, si no hay ningún conflicto se procede a instalar de la manera convencional.
- `npm install package-name@0.15.0` → Instalar la versión especifica de un paquete. Si luego se quiere instalar la versión más reciente se usa `npm install package-name@latest`.
- `npm install` → Instala las dependencias que estén dentro de un _package.json_.



### Que es un paquete opcional ?


Son las dependencias que el proyecto  no necesita para su funcionamiento , dependencias como decoradores de la terminal , del código etc , donde si la instalación de estas falla no afectara a la funcionalidad del proyecto .



#### Por que debería instalar mis dependencias unas en producción y otras en desarrollo ?

Es importante por que nos ayuda y ayuda a [[npm]]  a comprender el objetivo de esa dependencia donde si la instalamos en producción hablara que esa dependencia es esencial para la funcionalidad de nuestro proyecto, por otro lado cuando lo instalamos en desarrollo  habla de dependencias que nos ayudan a desarrollar nuestro aplicativo como programadores por tanto no terminan siendo necesarias para la funcionalidad del aplicativo .




