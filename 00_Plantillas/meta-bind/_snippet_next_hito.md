<%*
const path = tp.file.path(true);
const file = app.vault.getAbstractFileByPath(path);
const content = file ? await app.vault.read(file) : "";
const has2 = /\[!hito\]\s*Hito 2/.test(content);
const has3 = /\[!hito\]\s*Hito 3/.test(content);

function block(n, ph) {
  return `---

> [!hito] Hito ${n}
>
> \`\`\`meta-bind
> INPUT[textArea(title(Qué logré), placeholder(${ph}), class(meta-bind-full-width), class(meta-bind-hito-area)):hito${n}]
> \`\`\`
>
> \`\`\`meta-bind
> INPUT[textArea(title(Cómo lo logré), placeholder(Qué hice concretamente para lograrlo), class(meta-bind-full-width), class(meta-bind-compact-area)):logro${n}]
> \`\`\`
>
> \`\`\`meta-bind
> INPUT[slider(title(Dificultad), minValue(1), maxValue(10), addLabels, class(meta-bind-full-width)):dificultad${n}]
> \`\`\`

\`\`\`meta-bind-button
label: Vincular a vow
style: default
tooltip: Abre lista dinámica de vows y suma este hito como grano
action:
  type: command
  command: soulhy:link-hito-to-vow
\`\`\`

`;
}

if (has3) {
  new Notice("Máximo 3 hitos por día");
  tR = "";
} else if (has2) {
  tR = block(3, "Ej. Conversación de 10 min en la plaza");
} else {
  tR = block(2, "Ej. Envié 2 aplicaciones tailored");
}
%>
