---

> [!hito] Hito 3
>
> ```meta-bind
> INPUT[textArea(title(Qué logré), placeholder(Ej. Conversación de 10 min en la plaza), class(meta-bind-full-width), class(meta-bind-hito-area)):hito3]
> ```
>
> ```meta-bind
> INPUT[textArea(title(Cómo lo logré), placeholder(Qué hice concretamente para lograrlo), class(meta-bind-full-width), class(meta-bind-compact-area)):logro3]
> ```
>
> ```meta-bind
> INPUT[slider(title(Dificultad), minValue(1), maxValue(10), addLabels, class(meta-bind-full-width)):dificultad3]
> ```

```meta-bind-button
label: Vincular a vow
style: default
tooltip: Abre lista dinámica de vows y suma este hito como grano
action:
  type: command
  command: life-rpg:link-hito-to-vow
```
