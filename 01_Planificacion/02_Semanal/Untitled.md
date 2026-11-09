---
tags:
  - sprint/semanal
objetivo_norte: ""
---
# Agenda Semanal - Untitled

## Objetivos concretos


### Inbox
> [!abstract]- Fuente E·T·I (colapsado — no hace falta abrir)
> - [ ] Nueva tarea [e:: 3] [t:: 3] [i:: 3]
> - [ ] Nueva tarea [e:: 3] [t:: 3] [i:: 3]
> - [ ] Nueva tarea [e:: 3] [t:: 3] [i:: 3]
> - [ ] Nueva tarea [e:: 3] [t:: 3] [i:: 3]
> - [ ] Nueva tarea [e:: 3] [t:: 3] [i:: 3]
> - [ ] Nueva tarea [e:: 3] [t:: 3] [i:: 3]
> - [ ] Nueva tarea [e:: 3] [t:: 3] [i:: 3]
> - [ ] Nueva tarea [e:: 3] [t:: 3] [i:: 3]
> - [ ] Nueva tarea [e:: 3] [t:: 3] [i:: 3]
> - [ ] Nueva tarea [e:: 3] [t:: 3] [i:: 3]
> - [ ] Nueva tarea [e:: 3] [t:: 3] [i:: 3]
> - [ ] Nueva tarea [e:: 3] [t:: 3] [i:: 3]
> - [ ] Nueva tarea [e:: 3] [t:: 3] [i:: 3]
> - [ ] Nueva tarea [e:: 3] [t:: 3] [i:: 3]
> - [ ] Nueva tarea [e:: 3] [t:: 3] [i:: 3]
> - [ ] Nueva tarea [e:: 3] [t:: 3] [i:: 3]
## Priorizar 
```dataviewjs
/** Tabla E·I·T — UI local instantánea; guarda Inbox con debounce (sin scroll hacks). */
function clamp(n) {
    const x = Number(n);
    if (!Number.isFinite(x)) return null;
    return Math.max(1, Math.min(5, Math.round(x)));
}
function peso(e, t, i) {
    return i * (6 - e) * (6 - t);
}
function cleanText(raw) {
    return String(raw || "")
        .replace(/\[(\w+)::\s*[^\]]*\]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}
function uid() {
    return "r-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 6);
}

const filePath = dv.current().file.path;
const af = app.vault.getAbstractFileByPath(filePath);
const persistKey = "__prioPersist_" + filePath;

function getOpenEditor() {
    for (const leaf of app.workspace.getLeavesOfType("markdown")) {
        const view = leaf.view;
        if (view?.file?.path === filePath && view.editor) return view.editor;
    }
    return null;
}

async function readLines() {
    const editor = getOpenEditor();
    if (editor) return editor.getValue().split("\n");
    return (await app.vault.read(af)).split("\n");
}

async function writeContent(next) {
    const editor = getOpenEditor();
    if (editor) {
        editor.setValue(next);
        return;
    }
    await app.vault.modify(af, next);
}

const norte = (dv.current().objetivo_norte != null
    ? String(dv.current().objetivo_norte)
    : "").trim();
if (norte) dv.paragraph(`**Norte:** ${norte}`);

const tasks = dv.current().file.tasks.where((t) => {
    const sp = String(t.section?.subpath || "");
    return sp === "Inbox" || sp.startsWith("Inbox");
});

/** Estado local: pintar al toque; persistir después (evita esperar refresh de Dataview). */
let localRows = [];
for (const t of tasks) {
    const e = clamp(t.e) ?? 3;
    const tm = clamp(t.t) ?? 3;
    const i = clamp(t.i) ?? 3;
    localRows.push({
        key: uid(),
        done: !!t.completed,
        text: cleanText(t.text),
        e,
        t: tm,
        i,
        peso: peso(e, tm, i),
    });
}

function sortedRows() {
    return [...localRows].sort((a, b) => {
        if (a.done !== b.done) return a.done ? 1 : -1;
        return b.peso - a.peso;
    });
}

function scoreSelect(parent, value, onPick) {
    const sel = parent.createEl("select");
    sel.style.width = "52px";
    for (let n = 1; n <= 5; n++) {
        const opt = sel.createEl("option", { text: String(n), attr: { value: String(n) } });
        if (n === value) opt.selected = true;
    }
    sel.addEventListener("change", () => onPick(Number(sel.value)));
    return sel;
}

const wrap = dv.el("div");
const table = wrap.createEl("table");
table.style.width = "100%";
table.style.tableLayout = "fixed";
table.style.borderCollapse = "collapse";
table.style.fontSize = "0.95em";
const colgroup = table.createEl("colgroup");
for (const w of ["36px", "auto", "64px", "64px", "64px", "52px", "36px"]) {
    colgroup.createEl("col").style.width = w;
}
const hr = table.createEl("thead").createEl("tr");
for (const [label, align] of [
    ["#", "center"], ["Tarea", "left"], ["E", "center"], ["I", "center"],
    ["T", "center"], ["Peso", "right"], ["", "center"],
]) {
    const th = hr.createEl("th", { text: label });
    th.style.textAlign = align;
    th.style.padding = "6px 8px";
    th.style.borderBottom = "1px solid var(--background-modifier-border)";
}
const tbody = table.createEl("tbody");

function patchRow(key, partial) {
    const r = localRows.find((x) => x.key === key);
    if (!r) return;
    Object.assign(r, partial);
    r.peso = peso(r.e, r.t, r.i);
    paint();
    schedulePersist();
}

function paint() {
    tbody.empty();
    const view = sortedRows();
    if (view.length === 0) {
        const tr = tbody.createEl("tr");
        const td = tr.createEl("td", { text: "Sin filas — usá + Fila", attr: { colspan: "7" } });
        td.style.padding = "10px 8px";
        td.style.opacity = "0.7";
        return;
    }
    view.forEach((r, idx) => {
        const tr = tbody.createEl("tr");
        if (r.done) tr.style.opacity = "0.45";
        else if (idx < 3) tr.style.boxShadow = "inset 3px 0 0 var(--interactive-accent)";

        const tdRank = tr.createEl("td", { text: String(idx + 1) });
        tdRank.style.textAlign = "center";
        tdRank.style.padding = "6px 4px";
        tdRank.style.fontWeight = "600";

        const tdTask = tr.createEl("td");
        tdTask.style.padding = "6px 8px";
        const rowBox = tdTask.createEl("div");
        rowBox.style.display = "flex";
        rowBox.style.gap = "8px";
        rowBox.style.alignItems = "center";
        const chk = rowBox.createEl("input");
        chk.type = "checkbox";
        chk.checked = r.done;
        chk.addEventListener("change", () => patchRow(r.key, { done: chk.checked }));
        const inp = rowBox.createEl("input");
        inp.type = "text";
        inp.value = r.text;
        inp.placeholder = "Acción concreta…";
        inp.style.flex = "1";
        inp.style.width = "100%";
        inp.style.minWidth = "0";
        inp.style.padding = "6px 8px";
        inp.addEventListener("change", () => patchRow(r.key, { text: inp.value.trim() || "Nueva tarea" }));

        for (const [field, val] of [["e", r.e], ["i", r.i], ["t", r.t]]) {
            const td = tr.createEl("td");
            td.style.textAlign = "center";
            td.style.padding = "6px 4px";
            scoreSelect(td, val, (n) => patchRow(r.key, { [field]: n }));
        }

        const tdPeso = tr.createEl("td", { text: String(r.peso) });
        tdPeso.style.textAlign = "right";
        tdPeso.style.padding = "6px 8px";
        tdPeso.style.fontWeight = "600";

        const tdDel = tr.createEl("td");
        tdDel.style.textAlign = "center";
        const btnDel = tdDel.createEl("button", { text: "×" });
        btnDel.addEventListener("click", () => {
            localRows = localRows.filter((x) => x.key !== r.key);
            paint();
            schedulePersist();
        });
    });
}

async function persistInbox() {
    const lines = await readLines();
    const inboxIdx = lines.findIndex((l) => /^###\s+Inbox\b/.test(l));
    if (inboxIdx < 0) {
        new Notice("No se encontró la sección Inbox");
        return;
    }
    let sectionEnd = lines.length;
    for (let i = inboxIdx + 1; i < lines.length; i++) {
        if (/^##\s/.test(lines[i]) || /^###\s/.test(lines[i]) || /^---\s*$/.test(lines[i]) || /^```/.test(lines[i])) {
            sectionEnd = i;
            break;
        }
    }
    let keepUntil = inboxIdx + 1;
    let useCallout = false;
    for (let i = inboxIdx + 1; i < sectionEnd; i++) {
        if (/^>\s*\[!/.test(lines[i])) {
            useCallout = true;
            keepUntil = i + 1;
            break;
        }
        if (/^(?:>\s*)?- \[[ xX]\]/.test(lines[i])) break;
        keepUntil = i + 1;
    }
    const taskLines = localRows.map((r) => {
        const body = `- [${r.done ? "x" : " "}] ${r.text || "Nueva tarea"} [e:: ${r.e}] [t:: ${r.t}] [i:: ${r.i}]`;
        return useCallout ? "> " + body : body;
    });
    const next = lines.slice(0, keepUntil).concat(taskLines, lines.slice(sectionEnd)).join("\n");
    await writeContent(next);
}

function schedulePersist() {
    clearTimeout(window[persistKey]);
    window[persistKey] = setTimeout(() => {
        persistInbox().catch((e) => {
            console.error(e);
            new Notice("No se pudo guardar Inbox");
        });
    }, 400);
}

paint();

const bar = wrap.createEl("div");
bar.style.display = "flex";
bar.style.gap = "10px";
bar.style.alignItems = "center";
bar.style.marginTop = "10px";
const btnAdd = bar.createEl("button", { text: "+ Fila" });
btnAdd.addEventListener("click", () => {
    localRows.push({
        key: uid(),
        done: false,
        text: "Nueva tarea",
        e: 3,
        t: 3,
        i: 3,
        peso: peso(3, 3, 3),
    });
    paint();
    schedulePersist();
});
const hint = bar.createEl("span", { text: "Top 3 del día → ^^^ / ^^ / ^ abajo" });
hint.style.opacity = "0.65";
hint.style.fontSize = "0.85em";
```

## 💼 Bloques de Trabajo y Experimentos

### 2026-11-02 - Lunes
- [ ] **^^^** 
- [ ] **^^**  
- [ ] **^**  

### 2026-11-03 - Martes
- [ ] **^^^** 
- [ ] **^^**  
- [ ] **^**  

### 2026-11-04 - Miércoles
- [ ] **^^^** 
- [ ] **^^**  
- [ ] **^**  

### 2026-11-05 - Jueves
- [ ] **^^^** 
- [ ] **^^**  
- [ ] **^**  

### 2026-11-06 - Viernes
- [ ] **^^^** 
- [ ] **^^**  
- [ ] **^**  

### 2026-11-07 - Sábado
- [ ] **^^^** 
- [ ] **^^**  
- [ ] **^**  

### 2026-11-08 - Domingo
- [ ] **^^^** 
- [ ] **^^**  
- [ ] **^**  


---
## 🏆 Hitos de la Semana  

```dataviewjs
let nombreArchivo = dv.current().file.name.trim();
let match = nombreArchivo.match(/(\d{4})-W(\d{2})/i);

if (!match) {
    dv.paragraph("_(Este bloque muestra los hitos una vez que la plantilla es aplicada a una nota semanal con formato YYYY-WXX)_");
} else {
    let lunes  = moment().year(parseInt(match[1])).isoWeek(parseInt(match[2])).startOf('isoWeek');
    let domingo = lunes.clone().endOf('isoWeek');

    let dias = dv.pages('"01_Planificacion/03_Diario"')
        .where(p => {
            let f = moment(p.file.name, "YYYY-MM-DD");
            return f.isValid()
                && !f.isBefore(lunes, 'day')
                && !f.isAfter(domingo, 'day');
        })
        .sort(p => p.file.name, 'asc');

    let filas = [];

    dias.forEach(p => {
        [1, 2, 3, 4, 5].forEach(n => {
            let hito = p[`hito${n}`];
            let logre = p[`logre${n}`];
            let texto = (logre != null && String(logre).trim() !== "")
                ? String(logre)
                : (hito != null ? String(hito) : "");
            if (texto.trim() === "") return;
            let bien = p[`influi${n}`] != null && String(p[`influi${n}`]).trim() !== ""
                ? String(p[`influi${n}`])
                : (p[`bien${n}`] != null && String(p[`bien${n}`]).trim() !== ""
                    ? String(p[`bien${n}`])
                    : (p[`logro${n}`] ? String(p[`logro${n}`]) : "—"));
            let proxima = p[`proxima${n}`] != null && String(p[`proxima${n}`]).trim() !== ""
                ? String(p[`proxima${n}`])
                : "—";
            filas.push([
                p.file.link,
                texto,
                bien,
                proxima
            ]);
        });
    });

    if (filas.length === 0) {
        dv.paragraph("Todavía no hay hitos esta semana. Completá el cierre con «Cuéntame la historia de hoy» (`logre` / `influi` o legacy `hito` / `bien`).");
    } else {
        dv.table(
            ["Día", "Qué logré / pasó", "Cómo influí / bien", "Próxima"],
            filas
        );
    }
}
```
