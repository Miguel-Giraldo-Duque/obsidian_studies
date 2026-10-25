

### Como se usa?

Para usar el redirecionamiento solo tenemos qu ehacer uso en [[Next.js]] las funcionalidades de `next/navigate`  y redirect o hacer uso de useRouter() para [[Client components]] 


[[Server components]] :

```cpp title:"Redirect server" 
import { Card } from "app/Components/Card";

import { CardWrapper } from "app/Components/Card/CardWrapper";

import { getAllByIdCollection } from "app/services/shopify/collections";

import { redirect } from "next/navigation";

const Category = async (props) => {

  const { category } = await props.params;

  const products = await getAllByIdCollection(category[0]);

  

  redirect("/products");

  

  return (

    <div>

      {products.length > 0 ? (

        <CardWrapper products={products} />

      ) : (

        <p>No products available</p>

      )}

      ;

    </div>

  );

};

  

export default Category;
```
 
 
 
```cpp title:"Redirect client" 
"use client";

  

import styles from "./Card.module.sass";

import { archivo } from "app/sass/fonts";

import Image from "next/image";

import DOMPurify from "isomorphic-dompurify";

import { useState } from "react";

import { useRouter } from "next/navigation";

  

export const Card = ({

  id,

  productTitle,

  nameVendedor,

  description,

  price,

  imageUrl,

  colorVariants,

}) => {

  const sanitizedDescription = DOMPurify.sanitize(description);

  const navigate = useRouter();

  const [selectedVariant, setSelectedVariant] = useState(() => {

    if (!Array.isArray(colorVariants)) {

      return {};

    }

    console.log(colorVariants);

  

    return colorVariants[0];

  });

  const handleChangeVariant = (idVariant) => {

    if (!idVariant) {

      return;

    }

    const match = colorVariants.find((variant) => variant.id === idVariant);

    console.log("Found", match);

    setSelectedVariant(match);

  };

  return (

    <div className={styles.card}>

      <h3 className={`${styles["card__titulo"]} ${archivo.className}`}>

        {productTitle}

      </h3>

      <div className={styles.card__image} onClick={() => navigate.push("/")}>

        <Image

          priority="high"

          fill={true}

          src={imageUrl}

          alt={`Imagen de ${nameVendedor} ${productTitle}`}

        />

      </div>

      {Array.isArray(colorVariants) && colorVariants.length > 0 && (

        <div className={styles["card__colorVariants"]}>

          {colorVariants.map((variant) => {

            return (

              <span

                key={variant.id}

                style={{

                  background: variant?.option1 ?? "grey",

                  opacity: selectedVariant.id != variant.id && 0.6,

                }}

                onClick={() => handleChangeVariant(variant.id)}

              />

            );

          })}

        </div>

      )}

      <div className={styles["card__detail"]}>

        <b>Vendedor {nameVendedor}</b>

        <span className={styles["card__higthLight"]}>

          {"$" + selectedVariant?.price || ""}

        </span>

      </div>

      <div

        className={styles.card__description}

        dangerouslySetInnerHTML={{ __html: sanitizedDescription }}

      />

    </div>

  );

};
```