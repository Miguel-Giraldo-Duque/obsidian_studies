---
tags: [diario]
modo_override: ""
mision_salida: ""
evento1: ""
fecha_aar1: ""
intent1: ""
hechos1: ""
gap1: ""
whys1: ""
accion_inm1: ""
accion_sis1: ""
logre1: ""
influi1: ""
hito1: ""
bien1: ""
vowIds1: []
---
# 🧠 Dashboard Diario: <% tp.file.title %>

## Misiones pendientes días Anteriores
> [!warning] Tareas de esta semana que quedaron sin marcar 
```dataviewjs
function prioNivel(text) {
    const raw = String(text || "");
    if (/\^{3}/.test(raw)) return 3;
    if (/\^{2}/.test(raw)) return 2;
    if (/\^/.test(raw)) return 1;
    return 0;
}
function prioTag(n) {
    return n === 3 ? "^^^" : n === 2 ? "^^" : n === 1 ? "^" : "";
}
function prioClean(text) {
    return String(text || "")
        .replace(/\*{0,2}\^{1,3}\*{0,2}/g, "")
        .replace(/\s+/g, " ")
        .trim();
}
function normPath(p) {
    return String(p || "").replace(/\\/g, "/");
}
function normTaskText(s) {
    return String(s || "")
        .replace(/\*{0,2}\^{1,3}\*{0,2}/g, "")
        .replace(/\*\*/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();
}
function getMarkdownViewFor(path) {
    const target = normPath(path);
    for (const leaf of app.workspace.getLeavesOfType("markdown")) {
        const view = leaf.view;
        if (view?.file && normPath(view.file.path) === target) return view;
    }
    return null;
}
async function readSemanalLines(path) {
    const view = getMarkdownViewFor(path);
    if (view?.editor) return view.editor.getValue().split("\n");
    const af = app.vault.getAbstractFileByPath(normPath(path));
    if (!af) return null;
    return (await app.vault.read(af)).split("\n");
}
async function writeSemanalLines(path, lines) {
    const next = lines.join("\n");
    const view = getMarkdownViewFor(path);
    if (view?.editor) {
        view.editor.setValue(next);
        // Sin save, Dataview no reindexa y Live Preview puede revertir.
        if (typeof view.save === "function") await view.save();
        return true;
    }
    const af = app.vault.getAbstractFileByPath(normPath(path));
    if (!af) return false;
    await app.vault.modify(af, next);
    return true;
}
const TASK_RE = /^(\s*(?:>\s*)?- )\[[^\]]*\]/;
function applyToggle(line, done) {
    if (!TASK_RE.test(line)) return null;
    return line.replace(TASK_RE, `$1[${done ? "x" : " "}]`);
}
function lineMatchesTask(line, taskText) {
    if (!taskText) return true;
    const needle = normTaskText(taskText);
    if (!needle) return true;
    const body = normTaskText(line.replace(TASK_RE, ""));
    return body.includes(needle) || needle.includes(body);
}
async function toggleSemanal(path, line, done, taskText) {
    try {
        const lines = await readSemanalLines(path);
        if (!lines) {
            new Notice("No pude marcar la misión en la semanal");
            return false;
        }
        let i = line - 1;
        let next = null;
        if (i >= 0 && i < lines.length && TASK_RE.test(lines[i]) && lineMatchesTask(lines[i], taskText)) {
            next = applyToggle(lines[i], done);
        }
        if (next == null && taskText) {
            const needle = normTaskText(taskText);
            i = lines.findIndex((l) => TASK_RE.test(l) && normTaskText(l.replace(TASK_RE, "")) === needle);
            if (i < 0) {
                i = lines.findIndex((l) => {
                    if (!TASK_RE.test(l)) return false;
                    const body = normTaskText(l.replace(TASK_RE, ""));
                    return body.includes(needle) || needle.includes(body);
                });
            }
            if (i >= 0) next = applyToggle(lines[i], done);
        }
        if (next == null || i < 0) {
            new Notice("No pude marcar la misión en la semanal");
            return false;
        }
        lines[i] = next;
        const ok = await writeSemanalLines(path, lines);
        if (!ok) {
            new Notice("No pude marcar la misión en la semanal");
            return false;
        }
        return true;
    } catch (e) {
        console.error(e);
        new Notice("No pude marcar la misión en la semanal");
        return false;
    }
}
function stylePrioBadge(el, n) {
    el.style.fontFamily = "var(--font-monospace)";
    el.style.fontWeight = "800";
    el.style.flex = "0 0 auto";
    el.style.letterSpacing = "0.06em";
    el.style.fontSize = n === 3 ? "0.82em" : "0.78em";
    el.style.padding = "3px 9px";
    el.style.borderRadius = "999px";
    el.style.minWidth = "3em";
    el.style.textAlign = "center";
    el.style.lineHeight = "1.35";
    el.style.border = "1px solid transparent";
    if (n === 3) {
        el.style.background = "rgba(245, 197, 66, 0.22)";
        el.style.color = "#f0c14b";
        el.style.borderColor = "rgba(245, 197, 66, 0.75)";
        el.style.boxShadow = "0 0 10px rgba(245, 197, 66, 0.35)";
        el.title = "Main · máxima prioridad";
    } else if (n === 2) {
        el.style.background = "rgba(126, 184, 255, 0.18)";
        el.style.color = "#7eb8ff";
        el.style.borderColor = "rgba(126, 184, 255, 0.6)";
        el.style.boxShadow = "0 0 6px rgba(126, 184, 255, 0.22)";
        el.title = "Side · alta";
    } else if (n === 1) {
        el.style.background = "rgba(110, 207, 150, 0.16)";
        el.style.color = "#6bcf8e";
        el.style.borderColor = "rgba(110, 207, 150, 0.5)";
        el.title = "Quest · importante";
    } else {
        el.style.background = "transparent";
        el.style.color = "var(--text-faint)";
        el.style.borderColor = "var(--background-modifier-border)";
        el.style.opacity = "0.55";
        el.title = "Secundaria";
    }
}
function renderMisiones(tasks, path, opts = {}) {
    const removeWhenDone = !!opts.removeWhenDone;
    const list = [...tasks].sort((a, b) => {
        const d = prioNivel(b.text) - prioNivel(a.text);
        if (d !== 0) return d;
        return (a.line || 0) - (b.line || 0);
    });
    const wrap = dv.el("div");
    for (const t of list) {
        const n = prioNivel(t.text);
        const row = wrap.createEl("div");
        row.style.display = "flex";
        row.style.gap = "10px";
        row.style.alignItems = "center";
        row.style.margin = "4px 0";
        row.style.padding = n === 3 ? "5px 8px" : "3px 6px";
        row.style.borderRadius = "8px";
        if (n === 3) {
            row.style.background = "rgba(245, 197, 66, 0.07)";
            row.style.outline = "1px solid rgba(245, 197, 66, 0.22)";
        } else if (n === 2) {
            row.style.background = "rgba(126, 184, 255, 0.05)";
        }
        const chk = row.createEl("input");
        chk.type = "checkbox";
        chk.checked = !!t.completed;
        chk.addEventListener("change", async () => {
            const done = chk.checked;
            chk.disabled = true;
            const ok = await toggleSemanal(path, t.line, done, t.text);
            if (!ok) {
                chk.checked = !done;
                chk.disabled = false;
                return;
            }
            if (done && removeWhenDone) {
                row.remove();
                if (!wrap.querySelector("input[type='checkbox']")) {
                    wrap.createEl("p", { text: "✅ ¡Todo al día, no hay pendientes de días anteriores!" });
                }
                return;
            }
            chk.disabled = false;
        });
        const tag = row.createEl("span", { text: prioTag(n) || "·" });
        stylePrioBadge(tag, n);
        const label = row.createEl("span", { text: prioClean(t.text) || "(sin texto)" });
        label.style.flex = "1 1 auto";
        if (n === 3) label.style.fontWeight = "600";
        if (n === 0) label.style.opacity = "0.72";
    }
    return list.length > 0;
}

let hoyStr = dv.current().file.name;
let fechaNota = moment(hoyStr, "YYYY-MM-DD");

if (fechaNota.isValid()) {
    let numeroSemanaISO = String(fechaNota.isoWeek()).padStart(2, '0');
    let nombreSemana = fechaNota.format("YYYY") + "-W" + numeroSemanaISO;
    let sem = dv.pages("#sprint/semanal").find(p =>
        p.file.name.toLowerCase().includes(nombreSemana.toLowerCase())
    );

    if (sem) {
        let cache = app.metadataCache.getFileCache(
            app.vault.getAbstractFileByPath(sem.file.path)
        );

        let headingsAnteriores = (cache.headings || [])
            .map(h => h.heading)
            .filter(h => {
                let match = h.match(/^(\d{4}-\d{2}-\d{2})/);
                if (!match) return false;
                let fechaHeading = moment(match[1], "YYYY-MM-DD");
                return fechaHeading.isValid() && fechaHeading.isBefore(fechaNota, 'day');
            });

        if (headingsAnteriores.length === 0) {
            dv.paragraph("✅ No hay días anteriores en esta semana.");
        } else {
            let tareasPendientes = sem.file.tasks.where(t => {
                if (t.completed) return false;
                if (t.text.startsWith("habito")) return false;
                let subpath = t.section?.subpath || "";
                return headingsAnteriores.some(h => subpath.startsWith(h.substring(0, 10)));
            });

            if (!renderMisiones(tareasPendientes, sem.file.path, { removeWhenDone: true })) {
                dv.paragraph("✅ ¡Todo al día, no hay pendientes de días anteriores!");
            }
        }
    } else {
        dv.paragraph("❌ No se encontró la semana: " + nombreSemana);
    }
}
```

---

## Misiones de hoy
> [!info] Bloque de hoy 
```dataviewjs
function prioNivel(text) {
    const raw = String(text || "");
    if (/\^{3}/.test(raw)) return 3;
    if (/\^{2}/.test(raw)) return 2;
    if (/\^/.test(raw)) return 1;
    return 0;
}
function prioTag(n) {
    return n === 3 ? "^^^" : n === 2 ? "^^" : n === 1 ? "^" : "";
}
function prioClean(text) {
    return String(text || "")
        .replace(/\*{0,2}\^{1,3}\*{0,2}/g, "")
        .replace(/\s+/g, " ")
        .trim();
}
function normPath(p) {
    return String(p || "").replace(/\\/g, "/");
}
function normTaskText(s) {
    return String(s || "")
        .replace(/\*{0,2}\^{1,3}\*{0,2}/g, "")
        .replace(/\*\*/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();
}
function getMarkdownViewFor(path) {
    const target = normPath(path);
    for (const leaf of app.workspace.getLeavesOfType("markdown")) {
        const view = leaf.view;
        if (view?.file && normPath(view.file.path) === target) return view;
    }
    return null;
}
async function readSemanalLines(path) {
    const view = getMarkdownViewFor(path);
    if (view?.editor) return view.editor.getValue().split("\n");
    const af = app.vault.getAbstractFileByPath(normPath(path));
    if (!af) return null;
    return (await app.vault.read(af)).split("\n");
}
async function writeSemanalLines(path, lines) {
    const next = lines.join("\n");
    const view = getMarkdownViewFor(path);
    if (view?.editor) {
        view.editor.setValue(next);
        // Sin save, Dataview no reindexa y Live Preview puede revertir.
        if (typeof view.save === "function") await view.save();
        return true;
    }
    const af = app.vault.getAbstractFileByPath(normPath(path));
    if (!af) return false;
    await app.vault.modify(af, next);
    return true;
}
const TASK_RE = /^(\s*(?:>\s*)?- )\[[^\]]*\]/;
function applyToggle(line, done) {
    if (!TASK_RE.test(line)) return null;
    return line.replace(TASK_RE, `$1[${done ? "x" : " "}]`);
}
function lineMatchesTask(line, taskText) {
    if (!taskText) return true;
    const needle = normTaskText(taskText);
    if (!needle) return true;
    const body = normTaskText(line.replace(TASK_RE, ""));
    return body.includes(needle) || needle.includes(body);
}
async function toggleSemanal(path, line, done, taskText) {
    try {
        const lines = await readSemanalLines(path);
        if (!lines) {
            new Notice("No pude marcar la misión en la semanal");
            return false;
        }
        let i = line - 1;
        let next = null;
        if (i >= 0 && i < lines.length && TASK_RE.test(lines[i]) && lineMatchesTask(lines[i], taskText)) {
            next = applyToggle(lines[i], done);
        }
        if (next == null && taskText) {
            const needle = normTaskText(taskText);
            i = lines.findIndex((l) => TASK_RE.test(l) && normTaskText(l.replace(TASK_RE, "")) === needle);
            if (i < 0) {
                i = lines.findIndex((l) => {
                    if (!TASK_RE.test(l)) return false;
                    const body = normTaskText(l.replace(TASK_RE, ""));
                    return body.includes(needle) || needle.includes(body);
                });
            }
            if (i >= 0) next = applyToggle(lines[i], done);
        }
        if (next == null || i < 0) {
            new Notice("No pude marcar la misión en la semanal");
            return false;
        }
        lines[i] = next;
        const ok = await writeSemanalLines(path, lines);
        if (!ok) {
            new Notice("No pude marcar la misión en la semanal");
            return false;
        }
        return true;
    } catch (e) {
        console.error(e);
        new Notice("No pude marcar la misión en la semanal");
        return false;
    }
}
function stylePrioBadge(el, n) {
    el.style.fontFamily = "var(--font-monospace)";
    el.style.fontWeight = "800";
    el.style.flex = "0 0 auto";
    el.style.letterSpacing = "0.06em";
    el.style.fontSize = n === 3 ? "0.82em" : "0.78em";
    el.style.padding = "3px 9px";
    el.style.borderRadius = "999px";
    el.style.minWidth = "3em";
    el.style.textAlign = "center";
    el.style.lineHeight = "1.35";
    el.style.border = "1px solid transparent";
    if (n === 3) {
        el.style.background = "rgba(245, 197, 66, 0.22)";
        el.style.color = "#f0c14b";
        el.style.borderColor = "rgba(245, 197, 66, 0.75)";
        el.style.boxShadow = "0 0 10px rgba(245, 197, 66, 0.35)";
        el.title = "Main · máxima prioridad";
    } else if (n === 2) {
        el.style.background = "rgba(126, 184, 255, 0.18)";
        el.style.color = "#7eb8ff";
        el.style.borderColor = "rgba(126, 184, 255, 0.6)";
        el.style.boxShadow = "0 0 6px rgba(126, 184, 255, 0.22)";
        el.title = "Side · alta";
    } else if (n === 1) {
        el.style.background = "rgba(110, 207, 150, 0.16)";
        el.style.color = "#6bcf8e";
        el.style.borderColor = "rgba(110, 207, 150, 0.5)";
        el.title = "Quest · importante";
    } else {
        el.style.background = "transparent";
        el.style.color = "var(--text-faint)";
        el.style.borderColor = "var(--background-modifier-border)";
        el.style.opacity = "0.55";
        el.title = "Secundaria";
    }
}
function renderMisiones(tasks, path, opts = {}) {
    const removeWhenDone = !!opts.removeWhenDone;
    const list = [...tasks].sort((a, b) => {
        const d = prioNivel(b.text) - prioNivel(a.text);
        if (d !== 0) return d;
        return (a.line || 0) - (b.line || 0);
    });
    const wrap = dv.el("div");
    for (const t of list) {
        const n = prioNivel(t.text);
        const row = wrap.createEl("div");
        row.style.display = "flex";
        row.style.gap = "10px";
        row.style.alignItems = "center";
        row.style.margin = "4px 0";
        row.style.padding = n === 3 ? "5px 8px" : "3px 6px";
        row.style.borderRadius = "8px";
        if (n === 3) {
            row.style.background = "rgba(245, 197, 66, 0.07)";
            row.style.outline = "1px solid rgba(245, 197, 66, 0.22)";
        } else if (n === 2) {
            row.style.background = "rgba(126, 184, 255, 0.05)";
        }
        const chk = row.createEl("input");
        chk.type = "checkbox";
        chk.checked = !!t.completed;
        chk.addEventListener("change", async () => {
            const done = chk.checked;
            chk.disabled = true;
            const ok = await toggleSemanal(path, t.line, done, t.text);
            if (!ok) {
                chk.checked = !done;
                chk.disabled = false;
                return;
            }
            if (done && removeWhenDone) {
                row.remove();
                if (!wrap.querySelector("input[type='checkbox']")) {
                    wrap.createEl("p", { text: "✅ ¡Todo al día, no hay pendientes de días anteriores!" });
                }
                return;
            }
            chk.disabled = false;
        });
        const tag = row.createEl("span", { text: prioTag(n) || "·" });
        stylePrioBadge(tag, n);
        const label = row.createEl("span", { text: prioClean(t.text) || "(sin texto)" });
        label.style.flex = "1 1 auto";
        if (n === 3) label.style.fontWeight = "600";
        if (n === 0) label.style.opacity = "0.72";
    }
    return list.length > 0;
}

let hoyStr = dv.current().file.name;
let numeroSemana = String(moment(hoyStr).isoWeek()).padStart(2, '0');
let nombreSemana = moment(hoyStr).format("YYYY") + "-W" + numeroSemana;

let sem = dv.pages("#sprint/semanal").find(p => p.file.name.toLowerCase().includes(nombreSemana.toLowerCase()));

if (sem) {
    let cache = app.metadataCache.getFileCache(app.vault.getAbstractFileByPath(sem.file.path));
    let encabezadoHoy = cache.headings?.find(h => h.heading.startsWith(hoyStr));

    if (encabezadoHoy) {
        const tasksHoy = sem.file.tasks.where(t =>
            !String(t.text || "").startsWith("habito") &&
            (t.section?.subpath || "").startsWith(hoyStr)
        );
        if (!renderMisiones(tasksHoy, sem.file.path)) {
            dv.paragraph("_Sin tareas en el bloque de hoy._");
        }
    } else {
        dv.paragraph("✅ ¡No tienes bloques de trabajo asignados para hoy, manito!");
    }
} else {
    dv.paragraph("❌ No se encontró la semana: " + nombreSemana);
}
```

---

## 🧠 Acciones de estudio
```dataviewjs
const hoyStr = dv.current().file.name;
const hoy = moment(hoyStr, "YYYY-MM-DD").startOf("day");
const cur = dv.current();
const override = (cur.modo_override != null ? String(cur.modo_override) : "").trim().toLowerCase();
const mision = (cur.mision_salida != null ? String(cur.mision_salida) : "").trim();

function estadoSesion(p) {
    return (p.estudio_estado != null ? String(p.estudio_estado) : "").trim().toLowerCase();
}

function esSesionReal(p) {
    const path = String(p.file.path).replace(/\\/g, "/");
    const name = String(p.file.name);
    if (path.includes("00_Plantillas/")) return false;
    if (name.startsWith("Plantilla_")) return false;
    if (name === "Untitled" || name.startsWith("Untitled ")) return false;
    if (name.startsWith("EJEMPLO_")) return false;
    const tags = (p.file.tags || []).map(t => String(t).replace(/^#/, ""));
    if (tags.includes("ejemplo")) return false;
    return true;
}

function fueraDeRepaso(p) {
    const v = p.fuera_de_repaso;
    if (v === true) return true;
    const s = (v != null ? String(v) : "").trim().toLowerCase();
    return s === "true" || s === "yes" || s === "1";
}

function prioridadDe(p) {
    return (p.prioridad != null ? String(p.prioridad) : "").trim().toLowerCase();
}

function enColaEvaluar(p) {
    if (fueraDeRepaso(p)) return false;
    if (prioridadDe(p) === "standby") return false;
    const e = estadoSesion(p);
    return e === "" || e === "raw" || e === "cornell" || e === "cards";
}

const sesiones = dv.pages("#sesion-estudio").where(esSesionReal);
const colaEvaluar = sesiones.where(enColaEvaluar);

let repasarHoy = [];
if (hoy.isValid()) {
    repasarHoy = dv.pages("#estudio").where(p => p.tema_iniciado).filter(p => {
        const path = String(p.file.path).replace(/\\/g, "/");
        if (path.includes("00_Plantillas/") || String(p.file.name).startsWith("EJEMPLO_")) return false;
        if (fueraDeRepaso(p)) return false;
        if (prioridadDe(p) === "standby") return false;
        const inicio = moment(p.tema_iniciado.toString()).startOf("day");
        const d = hoy.diff(inicio, "days");
        return [1, 2, 7, 15, 31].includes(d);
    });
}

// Modo calendario (Plazi | Lectura | Repaso). Override: modo_override
const validModes = ["plazi", "lectura", "output"];
let modoKey;
if (validModes.includes(override)) {
    modoKey = override;
} else if (hoy.isValid()) {
    const iso = hoy.isoWeekday();
    if (iso === 1 || iso === 4) modoKey = "plazi";
    else if (iso === 2 || iso === 5) modoKey = "lectura";
    else modoKey = "output";
} else {
    modoKey = "output";
}

const modoLabel = modoKey === "plazi" ? "Plazi" : modoKey === "lectura" ? "Lectura" : "Repaso";
const hayBacklog = colaEvaluar.length > 0 || repasarHoy.length > 0;

dv.paragraph(`**Modo:** \`${modoLabel}\``);

// Todo lo pendiente, en orden de prioridad dentro de los 20′
const acciones = [];
for (const p of colaEvaluar) acciones.push(`**Generar evaluación** — ${p.file.link}`);
for (const p of repasarHoy) acciones.push(`**Hacer las preguntas** — ${p.file.link}`);

if (modoKey === "plazi" || modoKey === "lectura") {
    if (hayBacklog) {
        acciones.push(
            modoKey === "plazi"
                ? "_Si sobra tiempo:_ Nuevo Raw Plazi"
                : "_Si sobra tiempo:_ Nuevo Raw lectura + `mision_salida`"
        );
    } else {
        acciones.push(
            modoKey === "plazi"
                ? "**Input** — Nuevo Raw Plazi"
                : "**Input** — Nuevo Raw lectura + `mision_salida`"
        );
    }
} else if (!hayBacklog) {
    acciones.push("_Nada en cola — buffer / campaña_");
}

dv.list(acciones);

if (mision) dv.paragraph(`**misión_salida:** ${mision}`);

const campanas = dv.pages("#campana").where(p => {
    const path = String(p.file.path).replace(/\\/g, "/");
    const name = String(p.file.name);
    if (name.startsWith("_TEMPLATE") || name.startsWith("Plantilla_")) return false;
    if (path.includes("00_Plantillas/")) return false;
    const e = p.estado != null ? String(p.estado).toLowerCase() : "";
    return e === "activa";
});
if (campanas.length > 0) {
    dv.paragraph("**Campañas**");
    dv.list(campanas.map(p => {
        const ifThen = p.if_then != null ? String(p.if_then) : "";
        return ifThen ? `${p.file.link} — ${ifThen}` : p.file.link;
    }));
}
```

```meta-bind-button
label: Generar evaluación de hoy
style: primary
tooltip: Sesiones raw/cornell/cards (prioridad critica/normal). Ejercicios y preguntas de práctica; sin esperar Cornell.
action:
  type: open
  link: cursor://anysphere.cursor-deeplink/prompt?text=%2Fgenerar-estudios-hoy
```

---
Los 3 mas importantes
- [ ] a
- [ ] b
- [ ] c
El mas importante
- [ ] b

- [ ] Acciones de estudio (20′)
- [ ] 



4:00pm
- [ ] Plan salida / ejecutar `mision_salida` 

## Captura del día
> ≤2 min → hacer · >1 paso → romper · inesperado hoy → 1:30H
> **Se guarda en** [[01_Planificacion/02_Semanal/Inbox|Inbox global]] por proyecto → Priorizar semanal (E·T·I allá).

```dataviewjs
/** Captura → Inbox.md. Sin dv.page(Inbox) para no re-render al guardar. */
const INBOX_PATH = "01_Planificacion/02_Semanal/Inbox.md";
const SKIP_SECTIONS = new Set(["Hecho", "Backlog"]);
const DEFAULT_PROJECTS = ["Qnow", "Emprendimiento", "Ventas", "Lina", "Zora", "Pasaporte", "BTZ", "Familia", "Social"];
const CUANDOS = ["hoy", "7d", "luego"];
const ORIGENES = ["yo", "pedido"];
const CACHE_KEY = "__capturaInboxSession";

function uid() {
    return "c-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 6);
}
function cleanText(raw) {
    return String(raw || "").replace(/\[(\w+)::\s*[^\]]*\]/g, "").replace(/\s+/g, " ").trim();
}
function field(raw, key) {
    const m = String(raw || "").match(new RegExp("\\[" + key + "::\\s*([^\\]]*)\\]", "i"));
    return m ? m[1].trim() : "";
}
function escapeRe(s) {
    return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function taskLine(r, done) {
    const text = (r.text || "Nueva tarea").trim();
    const origen = r.origen ? ` [origen:: ${r.origen}]` : "";
    const cuando = r.cuando ? ` [cuando:: ${r.cuando}]` : "";
    const e = r.e ?? 3;
    const tm = r.t ?? 3;
    const i = r.i ?? 3;
    return `- [${done ? "x" : " "}] ${text}${origen}${cuando} [e:: ${e}] [t:: ${tm}] [i:: ${i}]`;
}
function getEditorFor(path) {
    for (const leaf of app.workspace.getLeavesOfType("markdown")) {
        const view = leaf.view;
        if (view?.file?.path === path && view.editor) return view.editor;
    }
    return null;
}
async function readPath(path) {
    const ed = getEditorFor(path);
    if (ed) return ed.getValue().split("\n");
    const af = app.vault.getAbstractFileByPath(path);
    if (!af) return null;
    return (await app.vault.read(af)).split("\n");
}
async function writePath(path, next) {
    const af = app.vault.getAbstractFileByPath(path);
    if (!af) return;
    saveSession();
    await app.vault.modify(af, next);
}
function saveSession() {
    window[CACHE_KEY] = { rows: localRows.map((r) => ({ ...r })) };
}
function listProjectHeads(lines) {
    const heads = [];
    for (const l of lines) {
        const m = l.match(/^##\s+(.+?)\s*$/);
        if (!m) continue;
        const name = m[1].trim();
        if (SKIP_SECTIONS.has(name)) continue;
        heads.push(name);
    }
    return heads.length ? heads : DEFAULT_PROJECTS.slice();
}
function sectionBounds(lines, name) {
    const re = new RegExp("^##\\s+" + escapeRe(name) + "\\s*$");
    const headIdx = lines.findIndex((l) => re.test(l));
    if (headIdx < 0) return null;
    let sectionEnd = lines.length;
    for (let i = headIdx + 1; i < lines.length; i++) {
        if (/^##\s/.test(lines[i]) || /^#\s/.test(lines[i])) { sectionEnd = i; break; }
    }
    return { headIdx, sectionEnd };
}
function parseInboxRows(lines) {
    const rows = [];
    let current = "";
    for (const line of lines) {
        const hm = line.match(/^##\s+(.+?)\s*$/);
        if (hm) {
            current = hm[1].trim();
            continue;
        }
        if (!current || SKIP_SECTIONS.has(current)) continue;
        if (!/^\s*- \[ \]/.test(line)) continue;
        const body = line.replace(/^\s*- \[ \]\s*/, "");
        const text = cleanText(body);
        if (!text) continue;
        const e = Number(field(body, "e"));
        const tm = Number(field(body, "t"));
        const i = Number(field(body, "i"));
        rows.push({
            key: uid(),
            text,
            proyecto: current,
            cuando: field(body, "cuando") || "7d",
            origen: field(body, "origen") || "yo",
            e: Number.isFinite(e) && e > 0 ? e : 3,
            t: Number.isFinite(tm) && tm > 0 ? tm : 3,
            i: Number.isFinite(i) && i > 0 ? i : 3,
            done: false,
        });
    }
    return rows;
}

let localRows = [];
const wrap = dv.el("div");
const tip = wrap.createEl("div", {
    text: "Alta → Inbox por proyecto. Prioridad (E·T·I) en Priorizar semanal.",
});
tip.style.opacity = "0.7";
tip.style.fontSize = "0.85em";
tip.style.marginBottom = "8px";

function styleSelect(sel, wide) {
    sel.style.cssText = [
        wide ? "max-width:140px" : "width:72px",
        "height:28px",
        "padding:2px 4px",
        "font-size:12px",
        "border-radius:6px",
        "border:1px solid var(--background-modifier-border)",
        "background:var(--background-primary)",
        "color:var(--text-normal)",
    ].join(";");
}
function optionSelect(parent, value, options, onPick, wide) {
    const sel = document.createElement("select");
    parent.appendChild(sel);
    styleSelect(sel, wide);
    for (const name of options) {
        const opt = document.createElement("option");
        opt.value = name;
        opt.textContent = name;
        if (String(name) === String(value)) opt.selected = true;
        sel.appendChild(opt);
    }
    sel.value = String(value || options[0]);
    for (const ev of ["pointerdown", "mousedown", "mouseup", "click"]) {
        sel.addEventListener(ev, (e) => e.stopPropagation());
    }
    sel.addEventListener("change", (e) => {
        e.stopPropagation();
        onPick(sel.value);
    });
    return sel;
}

const table = wrap.createEl("table");
table.style.width = "100%";
table.style.tableLayout = "fixed";
table.style.borderCollapse = "collapse";
table.style.fontSize = "0.92em";
const cg = table.createEl("colgroup");
for (const w of ["36px", "auto", "130px", "80px", "90px"]) {
    cg.createEl("col").style.width = w;
}
const hr = table.createEl("thead").createEl("tr");
for (const [label, align] of [
    ["✓", "center"], ["Tarea", "left"], ["Proyecto", "center"],
    ["Cuando", "center"], ["Origen", "center"],
]) {
    const th = hr.createEl("th", { text: label });
    th.style.textAlign = align;
    th.style.padding = "6px 4px";
    th.style.borderBottom = "1px solid var(--background-modifier-border)";
}
const tbody = table.createEl("tbody");

async function persistOpen() {
    const lines = await readPath(INBOX_PATH);
    if (!lines) { new Notice("Falta Inbox global"); return; }
    const projects = listProjectHeads(lines);
    const byProj = {};
    for (const p of projects) byProj[p] = [];
    for (const r of localRows.filter((x) => !x.done)) {
        const p = r.proyecto || projects[0] || "Qnow";
        if (!byProj[p]) byProj[p] = [];
        byProj[p].push(r);
    }
    let next = lines.slice();
    for (const name of Object.keys(byProj)) {
        let bounds = sectionBounds(next, name);
        if (!bounds) {
            const hechoIdx = next.findIndex((l) => /^##\s+Hecho\b/.test(l));
            const insertAt = hechoIdx >= 0 ? hechoIdx : next.length;
            next = next.slice(0, insertAt).concat(
                [`## ${name}`, ...byProj[name].map((r) => taskLine(r, false)), ""],
                next.slice(insertAt)
            );
            continue;
        }
        const { headIdx, sectionEnd } = bounds;
        next = next.slice(0, headIdx + 1).concat(
            byProj[name].map((r) => taskLine(r, false)),
            next.slice(sectionEnd)
        );
    }
    await writePath(INBOX_PATH, next.join("\n"));
}

function schedulePersist() {
    clearTimeout(window.__capturaInboxPersist);
    window.__capturaInboxPersist = setTimeout(() => {
        persistOpen().catch((e) => { console.error(e); new Notice("No se pudo guardar en Inbox"); });
    }, 400);
}

async function completeRow(r) {
    localRows = localRows.filter((x) => x.key !== r.key);
    saveSession();
    paint();
    await persistOpen();
    const lines = await readPath(INBOX_PATH);
    if (!lines) return;
    let bounds = sectionBounds(lines, "Hecho");
    const doneLine = taskLine(r, true);
    let next = lines;
    if (!bounds) {
        next = lines.concat(["", "## Hecho", doneLine]);
    } else {
        next = lines.slice(0, bounds.sectionEnd).concat([doneLine], lines.slice(bounds.sectionEnd));
    }
    await writePath(INBOX_PATH, next.join("\n"));
    new Notice("Movida a Inbox · Hecho");
}

function patchRow(key, partial) {
    const r = localRows.find((x) => x.key === key);
    if (!r) return;
    Object.assign(r, partial);
    saveSession();
    schedulePersist();
}

function paint() {
    tbody.empty();
    const view = [...localRows].sort((a, b) => String(a.proyecto).localeCompare(String(b.proyecto)) || a.text.localeCompare(b.text));
    if (!view.length) {
        const tr = tbody.createEl("tr");
        const td = tr.createEl("td", { text: "Inbox vacío — + Tarea", attr: { colspan: "5" } });
        td.style.padding = "10px 8px";
        td.style.opacity = "0.7";
        return;
    }
    view.forEach((r) => {
        const tr = tbody.createEl("tr");
        const tdChk = tr.createEl("td");
        tdChk.style.textAlign = "center";
        const chk = tdChk.createEl("input");
        chk.type = "checkbox";
        chk.title = "Completar → ## Hecho en Inbox";
        for (const ev of ["pointerdown", "mousedown", "click"]) {
            chk.addEventListener(ev, (e) => e.stopPropagation());
        }
        chk.addEventListener("change", () => {
            if (chk.checked) completeRow(r).catch(console.error);
        });

        const tdTask = tr.createEl("td");
        tdTask.style.padding = "4px 6px";
        const inp = tdTask.createEl("input");
        inp.type = "text";
        inp.value = r.text;
        inp.placeholder = "Qué surgió…";
        inp.style.width = "100%";
        inp.style.padding = "5px 6px";
        for (const ev of ["pointerdown", "mousedown", "click"]) {
            inp.addEventListener(ev, (e) => e.stopPropagation());
        }
        inp.addEventListener("change", () => patchRow(r.key, { text: inp.value.trim() || "Nueva tarea" }));

        const tdProy = tr.createEl("td");
        tdProy.style.textAlign = "center";
        optionSelect(tdProy, r.proyecto, DEFAULT_PROJECTS, (v) => patchRow(r.key, { proyecto: v }), true);

        const tdCuando = tr.createEl("td");
        tdCuando.style.textAlign = "center";
        optionSelect(tdCuando, r.cuando, CUANDOS, (v) => patchRow(r.key, { cuando: v }));

        const tdOrigen = tr.createEl("td");
        tdOrigen.style.textAlign = "center";
        optionSelect(tdOrigen, r.origen, ORIGENES, (v) => patchRow(r.key, { origen: v }));
    });
}

async function loadFromFile() {
    const lines = await readPath(INBOX_PATH);
    if (!lines) {
        dv.paragraph("_Falta Inbox global._");
        return false;
    }
    localRows = parseInboxRows(lines);
    saveSession();
    paint();
    return true;
}

const bar = wrap.createEl("div");
bar.style.display = "flex";
bar.style.gap = "8px";
bar.style.alignItems = "center";
bar.style.flexWrap = "wrap";
bar.style.marginTop = "10px";
const openBtn = bar.createEl("button", { text: "Abrir Inbox" });
openBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    app.workspace.openLinkText(INBOX_PATH, dv.current().file.path, false);
});
const btnAdd = bar.createEl("button", { text: "+ Tarea" });
btnAdd.addEventListener("click", (e) => {
    e.stopPropagation();
    localRows.unshift({
        key: uid(),
        text: "Nueva tarea",
        proyecto: "Qnow",
        cuando: "7d",
        origen: "yo",
        e: 3,
        t: 3,
        i: 3,
        done: false,
    });
    saveSession();
    paint();
    schedulePersist();
});
const btnReload = bar.createEl("button", { text: "Recargar" });
btnReload.title = "Leer de nuevo desde Inbox (descarta sesión en memoria)";
btnReload.addEventListener("click", (e) => {
    e.stopPropagation();
    delete window[CACHE_KEY];
    loadFromFile().then(() => new Notice("Captura recargada desde Inbox"));
});
const hint = bar.createEl("span", { text: "Proyecto · cuando · origen" });
hint.style.opacity = "0.65";
hint.style.fontSize = "0.85em";

(async () => {
    const af = app.vault.getAbstractFileByPath(INBOX_PATH);
    if (!af) {
        dv.paragraph("_Falta [[01_Planificacion/02_Semanal/Inbox|Inbox global]]._");
        return;
    }
    // Sesión en memoria: no pisar con índice Dataview viejo al re-render
    const cached = window[CACHE_KEY];
    if (cached && Array.isArray(cached.rows)) {
        localRows = cached.rows.map((r) => ({ ...r }));
        paint();
        return;
    }
    await loadFromFile();
})().catch((e) => {
    console.error(e);
    dv.paragraph("_Error cargando Inbox en Captura._");
});
```

## Cierre del Día

### After Review + Hitos

```meta-bind-button
label: Cuéntame la historia de hoy
style: primary
tooltip: Abre After Review (eventos) + Hitos (qué logré / cómo influí)
action:
  type: command
  command: soulhy:hito-story-editor
```

```dataviewjs
const p = dv.current();
const aars = [];
for (let n = 1; n <= 5; n++) {
    const evento = p[`evento${n}`];
    if (!evento || String(evento).trim() === "") continue;
    const intent = p[`intent${n}`] != null && String(p[`intent${n}`]).trim() !== "" ? String(p[`intent${n}`]) : "—";
    const hechos = p[`hechos${n}`] != null && String(p[`hechos${n}`]).trim() !== "" ? String(p[`hechos${n}`]) : "—";
    const inm = p[`accion_inm${n}`] != null && String(p[`accion_inm${n}`]).trim() !== "" ? String(p[`accion_inm${n}`]) : "—";
    const sis = p[`accion_sis${n}`] != null && String(p[`accion_sis${n}`]).trim() !== "" ? String(p[`accion_sis${n}`]) : "—";
    aars.push([`E${n}`, String(evento), intent, hechos, inm, sis]);
}
if (aars.length === 0) {
    dv.paragraph("_Sin After Review aún. Abrí el editor con el botón de arriba._");
} else {
    dv.header(4, "After Review");
    dv.table(["#", "Evento", "Intent", "Hechos", "Acción inmediata", "Acción sistemática"], aars);
}

const filas = [];
for (let n = 1; n <= 5; n++) {
    const logre = (p[`logre${n}`] != null && String(p[`logre${n}`]).trim() !== "")
        ? String(p[`logre${n}`])
        : (p[`hito${n}`] != null ? String(p[`hito${n}`]) : "");
    if (!logre || logre.trim() === "") continue;
    const influi = (p[`influi${n}`] != null && String(p[`influi${n}`]).trim() !== "")
        ? String(p[`influi${n}`])
        : (p[`bien${n}`] != null && String(p[`bien${n}`]).trim() !== "" ? String(p[`bien${n}`]) : "—");
    filas.push([`Hito ${n}`, logre, influi]);
}
if (filas.length === 0) {
    dv.paragraph("_Sin hitos aún._");
} else {
    dv.header(4, "Hitos");
    dv.table(["#", "Qué logré", "Cómo influí"], filas);
}
```

```meta-bind-button
label: Cerrar día
style: primary
tooltip: Abre Cursor con /cierre-dia (valida hitos del diario)
action:
  type: open
  link: cursor://anysphere.cursor-deeplink/prompt?text=%2Fcierre-dia%0A%0ALee%20la%20nota%20diaria%20de%20hoy%20%2801_Planificacion%2F03_Diario%2F%29%2C%20valida%20hitos%20y%20confirm%C3%A1%20que%20escribiste%20en%20el%20vault.
```

