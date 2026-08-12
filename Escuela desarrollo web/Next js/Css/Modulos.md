
### Como se hace?

En [[Next.js]] podemos usar modulos de css para modularizar el css de cada [[Componentes]] , evitando colisiones entre estilo y manteniendo un codigo mas manejable.

Para usarlo dentro del componente que queremos estilizar creamos un file `style.module.css`  y para que nuestro componente lo pueda usar es simplemente importar 

`import styles from "./style.module.css"`

Ahora recibiremos un objeto tal que así , donde recibimos el claseName que tenemos mas un id que genera Next js para evitar colicciones de css

 `json 
 {`
   `hero: "Uudaa2___1aaa"` 
`}`

y podemos asignárselo a la etiqueta que queramos ejemplo

`"use client";

import styles from "./Card.module.sass";

import { useState } from "react";

  

export const Card = ({ id }) => {

  const [count, setCount] = useState(0);

  console.log(styles["card__titulo"]);

  return (

    <>
	// Le asingamos la clase del objeto
      <h1 className={styles["card__titulo"]}>

        Producto {id} {count}

      </h1>

      <button onClick={() => setCount((prev) => prev + 1)}>Agregar! </button>

    </>

  );

};`