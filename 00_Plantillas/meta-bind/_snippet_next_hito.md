<%*
const path = tp.file.path(true);
const file = app.vault.getAbstractFileByPath(path);
const content = file ? await app.vault.read(file) : "";
const has2 = /\[!hito\]\s*Hito 2/.test(content);
const has3 = /\[!hito\]\s*Hito 3/.test(content);
const has4 = /\[!hito\]\s*Hito 4/.test(content);
const has5 = /\[!hito\]\s*Hito 5/.test(content);

function block(n, ph) {
  return `---

> [!hito] Hito ${n}
>
> \`\`\`meta-bind
> INPUT[textArea(title(Qué pasó), placeholder(${ph}), class(meta-bind-full-width), class(meta-bind-hito-area)):hito${n}]
> \`\`\`
>
> \`\`\`meta-bind
> INPUT[textArea(title(Qué hice bien), placeholder(Éxito real o espurio), class(meta-bind-full-width), class(meta-bind-compact-area)):bien${n}]
> \`\`\`
>
> \`\`\`meta-bind
> INPUT[textArea(title(Qué mejorar), placeholder(Qué falló o sesgo), class(meta-bind-full-width), class(meta-bind-compact-area)):mejorar${n}]
> \`\`\`
>
> \`\`\`meta-bind
> INPUT[text(title(Próxima acción), placeholder(Cuando X, hago Y), class(meta-bind-full-width)):proxima${n}]
> \`\`\`

\`\`\`meta-bind-button
label: Vincular a vow
style: default
tooltip: Vincula un hito del diario a un vow (revela celda)
action:
  type: command
  command: soulhy:link-hito-to-vow
\`\`\`

`;
}

if (has5) {
  new Notice("Máximo 5 hitos por día");
  tR = "";
} else if (has4) {
  tR = block(5, "Ej. Una escena más del día");
} else if (has3) {
  tR = block(4, "Ej. Conversación breve en el camino");
} else if (has2) {
  tR = block(3, "Ej. Conversación de 10 min en la plaza");
} else {
  tR = block(2, "Ej. Envié 2 aplicaciones tailored");
}
%>
