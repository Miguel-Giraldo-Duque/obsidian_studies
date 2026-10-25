---

> [!hito] Hito 2
>
> ```meta-bind
> INPUT[textArea(title(Qué pasó), placeholder(Ej. Envié 2 aplicaciones tailored), class(meta-bind-full-width), class(meta-bind-hito-area)):hito2]
> ```
>
> ```meta-bind
> INPUT[textArea(title(Qué hice bien), placeholder(Éxito real o espurio), class(meta-bind-full-width), class(meta-bind-compact-area)):bien2]
> ```
>
> ```meta-bind
> INPUT[textArea(title(Qué mejorar), placeholder(Qué falló o sesgo), class(meta-bind-full-width), class(meta-bind-compact-area)):mejorar2]
> ```
>
> ```meta-bind
> INPUT[text(title(Próxima acción), placeholder(Cuando X, hago Y), class(meta-bind-full-width)):proxima2]
> ```

```meta-bind-button
label: Vincular a vow
style: default
tooltip: Vincula un hito del diario a un vow (revela celda)
action:
  type: command
  command: soulhy:link-hito-to-vow
```
