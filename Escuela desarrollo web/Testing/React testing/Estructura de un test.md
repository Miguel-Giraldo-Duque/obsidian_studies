
#### Como se conforma?

Un test usando el runner de testing vitest , nos permite escribir los test teniendo en cuenta tres elementos

- **Describe** : Agrupa un conjuntos de test por ejemplo para un componente, recibiendo como parámetro  `describe("Nombre de mis test o componente", () => {}) `  y callback conteniendo los test
  
- **It** : Este  bloque representa el test en cuestión que vamos a realizar y este contendremos toda la lógica de testeo reibiendo el nombre y su callback
- ```js  
  it("Existencia del boton", () => {
    render(<Button label="test" />);
    const button = screen.getByText("test");
    expect(button).toBeInTheDocument();
  });

- **Expect** : Este  bloque representa  lo que esperamos que el testeo resulte, y aquí es donde reluce [[React testing]] por que nos ofrece una serie de herramientas de macthing y búsqueda para asegurarnos de resultados, `expect(mi elemento a probar).miMacther()` 
