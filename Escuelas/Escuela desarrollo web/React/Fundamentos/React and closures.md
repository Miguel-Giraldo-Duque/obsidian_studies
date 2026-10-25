### ¿Como interactúan? 

[[Closures]] es un mecanismo de JS que dice que mientras la referencia de la función sea la misma tomara una captura de los valores cuando se definió encapsulando su propio contexto interno inaccessible desde afuera.

Ejemplo 
```jsx
const MemoButton = React.memo(<Button > , (before, after) => before.label === after.title)

const Calculator = () => {
	// Me siento solo
	const [values, setValues] = useState()
	
	//
	const calculate = () => {
		return values.a + values.b 
	}
	
	return  <MemoButton label={"calcular"} onClick={calculate}>
	  
}

const onClick = => { useCallback(() // state will always be the initial state value here // the closure is never refreshed console. log( state); // forgot about dependencies }, []); };
```


Básicamente lo que pasa es que use Memo , no obtiene la función recreada, se queda con la primera función con sus valores congelados,  ello causa un error pues no estamos al dia con los estados reales perdiendo sentido la memorización si lo agregamos a la verificación por que en cada render la funcion va a cambiar.


Para solcuionr esto podemos usar refs, las refs no son reactivas , son un objeto que el hook useRef devuelve, por ello si las usamos para representar nuestra función podemos modificar su objeto interno ya que los closures si bien toman una captura del estado actual 

Al moficar el objeto y acceder  su current  podemos obtner la ultima version de la función sin problemas

```jsx
   const [searchParams, setSearchParams] = useSearchParams();
  const setSearchParamsRef = useRef(setSearchParams);

  useEffect(() => {
    setSearchParamsRef.current = setSearchParams;
  }, [setSearchParams]);


// Esta función se mantiene, estable durante el tiempo y siempre puede accder al ultimo actualizador del estado sin causar una redifinición de la misma función ya que solo cambio el valor que ejeucta current, entonces no importa en si, estar atrapado en un closure natural de JS
 const updateSearchParams = useCallback((tempFilters) => {
    setSearchParamsRef.current(
      (prev) => {
        const newParams = new URLSearchParams(prev);
        ...
        return newParams;
      },
      { replace: true },
    );
  }, []);
```






Carisma es una person muy poderosa que gusta de ti.