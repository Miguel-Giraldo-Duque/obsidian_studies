
## Error First Callbacks

---

Un patrón que se sigue siempre en cualquier lenguaje y programa de devs es **Error First Callbacks**, esto quiere decir que siempre que tengamos un callback el primer parámetro debería ser el error.

> 😭 Esto se usa por la convención de que todo puede fallar.

Otro patrón típico es tener el callback es tener en el callback como la última función que se pasa. Aunque depende del caso.

```jsx
function asincrona(callback) {
    setTimeout(() => {
        try {
            let a = 3 + w
            callback(null, a)
        } catch (error) {
            callback(error)
        }
    }, 1000)
}

asincrona((err, dato) => {
    if (err) {
        console.error('Tenemos un error')
        console.error(err)
        return false

        // throw err
    }

    console.log(`Todo ha ido bien, mi dato es ${dato}`)
})
```