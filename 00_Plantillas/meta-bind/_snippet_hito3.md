---

> [!hito] Hito 3
>
> ```meta-bind
> INPUT[textArea(title(Qué pasó), placeholder(Ej. Conversación de 10 min en la plaza), class(meta-bind-full-width), class(meta-bind-hito-area)):hito3]
> ```
>
> ```meta-bind
> INPUT[textArea(title(Qué hice bien), placeholder(Éxito real o espurio), class(meta-bind-full-width), class(meta-bind-compact-area)):bien3]
> ```
>
> ```meta-bind
> INPUT[textArea(title(Qué mejorar), placeholder(Qué falló o sesgo), class(meta-bind-full-width), class(meta-bind-compact-area)):mejorar3]
> ```
>
> ```meta-bind
> INPUT[text(title(Próxima acción), placeholder(Cuando X, hago Y), class(meta-bind-full-width)):proxima3]
> ```

```meta-bind-button
label: Vincular a vow
style: default
tooltip: Vincula un hito del diario a un vow (revela celda)
action:
  type: command
  command: soulhy:link-hito-to-vow
```
