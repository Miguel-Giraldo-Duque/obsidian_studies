

### Como crear una fuente en Next js?

Next js ofrece una integración rápida para usar las fuentes google fonts , donde basta con importarla y agregarla como clase donde centralizamos la carga de la fuentes 1 sola vez :

`import { Archivo } from "next/font/google";`

`// define your variable fonts`

`const archivo = Archivo({`

  `weight: ["100", "200", "300"],`

  `subsets: ["latin"],`

`});`

Para cuando queramos usar esa fuente
  

"use client";

import styles from "./Card.module.sass";

import { useState } from "react";

import { archivo } from "@/fonts";

export const Card = ({ id }) => {

  const [count, setCount] = useState(0);

  console.log(styles["card__titulo"]);

  console.log(archivo.className);

  return (

    <>

      <h1 className={`${styles["card__titulo"]} ${archivo.className}`}>

        Producto {id} {count}

      </h1>

      <button

        onClick={() => setCount((prev) => prev + 1)}

        className={archivo.className}

      >

        Agregar!{" "}

      </button>

    </>

  );

};