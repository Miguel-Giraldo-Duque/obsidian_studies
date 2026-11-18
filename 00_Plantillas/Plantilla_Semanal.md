---
tags:
  - sprint/semanal
objetivo_norte: ""
cssclasses:
  - semana-wide
---
# Agenda Semanal - <% tp.file.title %>

## Objetivos concretos

<%*
let match = tp.file.title.match(/(\d{4})-W(\d{2})/i);
let lunesSemana;
if (match) {
    let año = parseInt(match[1]);
    let semana = parseInt(match[2]);
    lunesSemana = moment().year(año).isoWeek(semana).startOf('isoWeek');
} else {
    lunesSemana = moment().startOf('isoWeek');
}
let lunes     = lunesSemana.clone().format("YYYY-MM-DD");
let martes    = lunesSemana.clone().add(1, 'days').format("YYYY-MM-DD");
let miercoles = lunesSemana.clone().add(2, 'days').format("YYYY-MM-DD");
let jueves    = lunesSemana.clone().add(3, 'days').format("YYYY-MM-DD");
let viernes   = lunesSemana.clone().add(4, 'days').format("YYYY-MM-DD");
let sabado    = lunesSemana.clone().add(5, 'days').format("YYYY-MM-DD");
let domingo   = lunesSemana.clone().add(6, 'days').format("YYYY-MM-DD");
_%>

## Priorizar

> Inbox por **id** · cola **por organizar** (`estado:: inbox`) vs **activas** · E·T·I + `scheduled` + `estim_min` · carga = estim×2 · cupo = bloques calendario con `proyecto:`.

```dataviewjs
const INBOX_PATH = "01_Planificacion/02_Semanal/Inbox.md";
const CAL_ROOT = "01_Planificacion/04_Calendario";
function weekFile() {
    const cur = dv.current();
    if (cur?.file) return cur.file;
    const af = app.workspace.getActiveFile();
    if (af) return { path: af.path, name: af.basename };
    return { path: "", name: "" };
}
const WEEK_FILE = weekFile();
const WEEK_PATH = WEEK_FILE.path;
const SKIP_SECTIONS = new Set(["Hecho", "Backlog"]);
const DEFAULT_PROJECTS = ["Qnow web", "Qnow marketing", "Emprendimiento", "Ventas", "Lina", "Zora", "Pasaporte", "BTZ", "Familia", "Vida social"];
const CARGA_FACTOR = 2;

function clamp(n) {
    const x = Number(n);
    if (!Number.isFinite(x)) return null;
    return Math.max(1, Math.min(5, Math.round(x)));
}
function peso(e, t, i) { return i * (6 - e) * (6 - t); }
function cleanText(raw) {
    return String(raw || "").replace(/\[(\w+)::\s*[^\]]*\]/g, "").replace(/\s+/g, " ").trim();
}
function field(raw, key) {
    const m = String(raw || "").match(new RegExp("\\[" + key + "::\\s*([^\\]]*)\\]", "i"));
    return m ? m[1].trim() : "";
}
function newId() {
    return "t_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}
function escapeRe(s) {
    return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function stampNow() {
    const d = new Date();
    const p = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}
function parseMin(t) {
    const m = String(t || "").match(/^(\d{1,2}):(\d{2})$/);
    if (!m) return null;
    return Number(m[1]) * 60 + Number(m[2]);
}
function taskLine(r, done) {
    const text = (r.text || "Nueva tarea").trim();
    const id = r.id || newId();
    const parent = r.parent ? ` [parent:: ${r.parent}]` : "";
    const estado = done ? "hecha" : (r.estado || "inbox");
    const origen = r.origen ? ` [origen:: ${r.origen}]` : "";
    const cuando = r.cuando ? ` [cuando:: ${r.cuando}]` : "";
    const scheduled = r.scheduled ? ` [scheduled:: ${r.scheduled}]` : "";
    const prioDia = r.prio_dia ? ` [prio_dia:: ${r.prio_dia}]` : "";
    const estim = (r.estim_min != null && r.estim_min !== "") ? ` [estim_min:: ${r.estim_min}]` : "";
    const proy = (done && r.proyecto) ? ` [proy:: ${r.proyecto}]` : "";
    const doneF = done ? ` [done:: ${r.done || stampNow()}]` : "";
    return `- [${done ? "x" : " "}] ${text} [id:: ${id}]${parent} [estado:: ${estado}]${origen}${cuando}${scheduled}${prioDia}${estim}${proy}${doneF} [e:: ${r.e}] [t:: ${r.t}] [i:: ${r.i}]`;
}
function getEditorFor(path) {
    for (const leaf of app.workspace.getLeavesOfType("markdown")) {
        if (leaf.view?.file?.path === path && leaf.view.editor) return leaf.view.editor;
    }
    return null;
}
async function readPath(path) {
    const ed = getEditorFor(path);
    if (ed) return ed.getValue().split("\n");
    return (await app.vault.read(app.vault.getAbstractFileByPath(path))).split("\n");
}
async function writePath(path, next) {
    const af = app.vault.getAbstractFileByPath(path);
    if (!af) return;
    await app.vault.modify(af, next);
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
function scoreSelect(parent, value, onPick) {
    const sel = document.createElement("select");
    parent.appendChild(sel);
    sel.style.cssText = "height:28px;padding:2px 6px;border-radius:6px;border:1px solid var(--background-modifier-border);background:var(--background-primary);color:var(--text-normal)";
    for (let n = 1; n <= 5; n++) {
        const opt = document.createElement("option");
        opt.value = String(n);
        opt.textContent = String(n);
        if (n === value) opt.selected = true;
        sel.appendChild(opt);
    }
    sel.addEventListener("mousedown", (e) => e.stopPropagation());
    sel.addEventListener("click", (e) => e.stopPropagation());
    sel.addEventListener("change", () => onPick(Number(sel.value)));
    return sel;
}
function projectSelect(parent, value, onPick) {
    const sel = document.createElement("select");
    parent.appendChild(sel);
    sel.style.cssText = "height:28px;max-width:140px;padding:2px 6px;border-radius:6px;border:1px solid var(--background-modifier-border);background:var(--background-primary);color:var(--text-normal)";
    for (const name of DEFAULT_PROJECTS) {
        const opt = document.createElement("option");
        opt.value = name;
        opt.textContent = name;
        if (name === value) opt.selected = true;
        sel.appendChild(opt);
    }
    if (value && !DEFAULT_PROJECTS.includes(value)) {
        const opt = document.createElement("option");
        opt.value = value;
        opt.textContent = value;
        opt.selected = true;
        sel.appendChild(opt);
    }
    sel.addEventListener("mousedown", (e) => e.stopPropagation());
    sel.addEventListener("click", (e) => e.stopPropagation());
    sel.addEventListener("change", () => onPick(sel.value));
    return sel;
}

const weekMatch = (WEEK_FILE.name || "").match(/(\d{4})-W(\d{2})/i);
let weekStart = moment().startOf("isoWeek");
if (weekMatch) weekStart = moment().year(Number(weekMatch[1])).isoWeek(Number(weekMatch[2])).startOf("isoWeek");
const weekDays = [];
for (let i = 0; i < 7; i++) {
    const d = weekStart.clone().add(i, "days");
    weekDays.push({ iso: d.format("YYYY-MM-DD"), label: d.format("ddd DD"), moment: d });
}
function daySelect(parent, value, onPick) {
    const sel = document.createElement("select");
    parent.appendChild(sel);
    sel.style.cssText = "height:28px;padding:2px 6px;border-radius:6px;border:1px solid var(--background-modifier-border);background:var(--background-primary);color:var(--text-normal)";
    const blank = document.createElement("option");
    blank.value = "";
    blank.textContent = "—";
    if (!value) blank.selected = true;
    sel.appendChild(blank);
    for (const d of weekDays) {
        const opt = document.createElement("option");
        opt.value = d.iso;
        opt.textContent = d.label;
        if (d.iso === value) opt.selected = true;
        sel.appendChild(opt);
    }
    if (value && !weekDays.some((d) => d.iso === value)) {
        const opt = document.createElement("option");
        opt.value = value;
        opt.textContent = value;
        opt.selected = true;
        sel.appendChild(opt);
    }
    sel.addEventListener("mousedown", (e) => e.stopPropagation());
    sel.addEventListener("click", (e) => e.stopPropagation());
    sel.addEventListener("change", () => onPick(sel.value));
    return sel;
}

function loadCapacityMap() {
    const cupo = {};
    for (const d of weekDays) cupo[d.iso] = {};
    const folder = app.vault.getAbstractFileByPath(CAL_ROOT);
    if (!folder || !folder.children) return cupo;
    const files = [];
    const walk = (node) => {
        if (node.children) for (const c of node.children) walk(c);
        else if (node.path && node.path.endsWith(".md") && !node.path.includes("/ActivityWatch/")) files.push(node);
    };
    walk(folder);
    for (const f of files) {
        const cache = app.metadataCache.getFileCache(f);
        const fm = cache?.frontmatter;
        if (!fm || !fm.proyecto) continue;
        const proy = String(fm.proyecto).trim();
        if (!proy) continue;
        const a = parseMin(fm.startTime);
        const b = parseMin(fm.endTime);
        if (a == null || b == null || b <= a) continue;
        const mins = b - a;
        const skip = new Set((fm.skipDates || []).map(String));
        const dowLetters = ["U", "M", "T", "W", "R", "F", "S"];
        const daysFilter = Array.isArray(fm.daysOfWeek) && fm.daysOfWeek.length
            ? new Set(fm.daysOfWeek.map(String))
            : null;
        if (fm.fcrDaily || fm.type === "recurring" || daysFilter) {
            for (const d of weekDays) {
                if (skip.has(d.iso)) continue;
                if (fm.startRecur && d.iso < String(fm.startRecur).slice(0, 10)) continue;
                if (daysFilter) {
                    const letter = dowLetters[d.moment.day()];
                    if (!daysFilter.has(letter)) continue;
                } else if (!fm.fcrDaily && fm.type !== "recurring") {
                    continue;
                }
                if (!cupo[d.iso][proy]) cupo[d.iso][proy] = 0;
                cupo[d.iso][proy] += mins;
            }
        } else if (fm.date || fm.startDate) {
            const iso = String(fm.date || fm.startDate).slice(0, 10);
            if (cupo[iso]) {
                if (!cupo[iso][proy]) cupo[iso][proy] = 0;
                cupo[iso][proy] += mins;
            }
        }
    }
    return cupo;
}

if (!app.vault.getAbstractFileByPath(INBOX_PATH)) {
    dv.paragraph("_Falta Inbox global._");
} else {
(async () => {
const PRIO_CACHE = "__prioInboxSession";
function savePrioSession(rows, isDirty) {
    window[PRIO_CACHE] = {
        path: WEEK_PATH,
        dirty: !!isDirty,
        stickId: window.__prioStickBottomId || null,
        rows: rows.map((r) => ({ ...r })),
    };
}
function stopEditorSteal(el) {
    for (const ev of ["pointerdown", "mousedown", "mouseup", "click", "keydown", "keyup", "keypress", "beforeinput", "input"]) {
        el.addEventListener(ev, (e) => e.stopPropagation());
    }
}
const lines0 = await readPath(INBOX_PATH);
let current = "";
let localRows = [];
const cached = window[PRIO_CACHE];
if (cached && cached.path === WEEK_PATH && Array.isArray(cached.rows) && cached.rows.length) {
    localRows = cached.rows.map((r) => ({ ...r }));
    if (cached.stickId) window.__prioStickBottomId = cached.stickId;
} else {
for (const line of lines0) {
    const hm = line.match(/^##\s+(.+?)\s*$/);
    if (hm) { current = hm[1].trim(); continue; }
    if (!current || SKIP_SECTIONS.has(current)) continue;
    if (!/^\s*- \[ \]/.test(line)) continue;
    const body = line.replace(/^\s*- \[ \]\s*/, "");
    const e = clamp(field(body, "e")) ?? 3;
    const t = clamp(field(body, "t")) ?? 3;
    const i = clamp(field(body, "i")) ?? 3;
    const estimRaw = field(body, "estim_min");
    localRows.push({
        id: field(body, "id") || newId(),
        parent: field(body, "parent"),
        text: cleanText(body),
        proyecto: current,
        estado: field(body, "estado") || "inbox",
        origen: field(body, "origen"),
        cuando: field(body, "cuando"),
        scheduled: field(body, "scheduled"),
        prio_dia: field(body, "prio_dia"),
        estim_min: estimRaw === "" ? "" : Number(estimRaw),
        e, t, i, peso: peso(e, t, i),
    });
}
}
const capacity = loadCapacityMap();

function cargaOf(r) {
    if (r.estim_min !== "" && Number.isFinite(Number(r.estim_min))) return Number(r.estim_min) * CARGA_FACTOR;
    const kids = localRows.filter((x) => x.parent === r.id && x.estado !== "hecha");
    if (!kids.length) return 0;
    return kids.reduce((s, k) => s + cargaOf(k), 0);
}
function usadoDiaProy(iso, proy, excludeId) {
    let sum = 0;
    for (const r of localRows) {
        if (r.parent) continue;
        if (r.scheduled !== iso) continue;
        if (r.proyecto !== proy) continue;
        if (excludeId && r.id === excludeId) continue;
        sum += cargaOf(r);
    }
    return sum;
}
function cupoDiaProy(iso, proy) {
    return (capacity[iso] && capacity[iso][proy]) || 0;
}
function suggestDays(proy, carga, preferIso) {
    const opts = [];
    for (const d of weekDays) {
        const cupo = cupoDiaProy(d.iso, proy);
        const usado = usadoDiaProy(d.iso, proy, preferIso ? preferIso : null);
        const libre = cupo - usado;
        if (cupo > 0 && libre >= carga) opts.push({ iso: d.iso, label: d.label, libre, cupo });
    }
    opts.sort((a, b) => b.libre - a.libre);
    return opts;
}
function warnCapacity(r, iso) {
    if (!iso) return true;
    const carga = cargaOf(r);
    if (carga <= 0) return true;
    const cupo = cupoDiaProy(iso, r.proyecto);
    if (cupo <= 0) {
        new Notice(`Sin cupo de calendario para «${r.proyecto}» el ${iso}. Se asigna igual.`);
        return true;
    }
    const usado = usadoDiaProy(iso, r.proyecto, r.id);
    if (usado + carga <= cupo) return true;
    const sug = suggestDays(r.proyecto, carga, r.id).filter((s) => s.iso !== iso).slice(0, 3);
    const sugTxt = sug.length ? sug.map((s) => `${s.label} (${s.libre}m libres)`).join(", ") : "ningún día con hueco esta semana";
    new Notice(`Sobrecarga ${r.proyecto} ${iso}: ${usado + carga}m > cupo ${cupo}m. Sugeridos: ${sugTxt}. Se asigna igual.`, 10000);
    return true;
}

let filterMode = "all";
let filterProjects = new Set(); // vacío = todos los proyectos
const wrap = dv.el("div");
wrap.style.cssText = "width:100%;max-width:100%;box-sizing:border-box";
const filt = wrap.createEl("div");
filt.style.cssText = "display:flex;gap:6px;flex-wrap:wrap;margin:0 0 8px;align-items:center";
for (const [mode, label] of [["all", "Todas"], ["inbox", "Por organizar"], ["activa", "Activas"]]) {
    const b = filt.createEl("button", { text: label });
    b.style.cssText = "height:28px;padding:2px 10px;border-radius:6px;border:1px solid var(--background-modifier-border);background:var(--background-primary);color:var(--text-normal);cursor:pointer";
    b.addEventListener("click", () => { filterMode = mode; paint(); });
}
let dirty = !!(cached && cached.path === WEEK_PATH && cached.dirty);
const saveBtn = filt.createEl("button", { text: "Guardar" });
saveBtn.style.cssText = "height:28px;padding:2px 14px;border-radius:6px;border:none;background:#3b82f6;color:#fff;font-weight:600;cursor:pointer;margin-left:auto;opacity:.55";
saveBtn.disabled = true;
saveBtn.title = "Aplica día, E·T·I, estim y texto al Inbox";
function setDirty(on) {
    dirty = !!on;
    saveBtn.disabled = !dirty;
    saveBtn.style.opacity = dirty ? "1" : ".55";
    savePrioSession(localRows, dirty);
}
setDirty(dirty);
async function saveEdits() {
    if (!dirty) return;
    for (const r of localRows) {
        if (r.scheduled) warnCapacity(r, r.scheduled);
    }
    await persistInbox();
    setDirty(false);
    window.__prioStickBottomId = null;
    window.__prioStickFocusOnce = false;
    delete window[PRIO_CACHE];
    paint();
    paintCapacityHint();
    new Notice("Priorizar guardado en Inbox");
}
saveBtn.addEventListener("click", () => saveEdits().catch((e) => { console.error(e); new Notice("No se pudo guardar"); }));
const undoBtn = filt.createEl("button", { text: "↩ Deshacer" });
undoBtn.style.cssText = "height:28px;padding:2px 10px;border-radius:6px;border:1px solid var(--background-modifier-border);background:var(--background-secondary);color:var(--text-normal);cursor:pointer";
undoBtn.title = "Restaura la última tarea completada por id";
undoBtn.addEventListener("click", () => restoreLast().catch(console.error));

const proyFilt = wrap.createEl("div");
proyFilt.style.cssText = "display:flex;gap:6px;flex-wrap:wrap;margin:0 0 8px;align-items:center";
const msWrap = proyFilt.createEl("div");
msWrap.style.cssText = "position:relative;display:inline-block";
const msBtn = msWrap.createEl("button", { text: "Proyectos: todos ▾" });
msBtn.style.cssText = "height:28px;padding:2px 10px;border-radius:6px;border:1px solid var(--background-modifier-border);background:var(--background-primary);color:var(--text-normal);cursor:pointer;min-width:170px;text-align:left";
msBtn.title = "Filtrar por uno o más proyectos";
const msPanel = msWrap.createEl("div");
msPanel.style.cssText = "display:none;position:absolute;z-index:50;top:32px;left:0;min-width:220px;max-height:260px;overflow:auto;padding:8px;border-radius:8px;border:1px solid var(--background-modifier-border);background:var(--background-primary);box-shadow:0 8px 24px rgba(0,0,0,.18)";
const projectOptions = [...new Set([
    ...DEFAULT_PROJECTS,
    ...localRows.map((r) => r.proyecto).filter(Boolean),
])].sort((a, b) => String(a).localeCompare(String(b), "es"));
function syncMsBtnLabel() {
    if (!filterProjects.size) {
        msBtn.textContent = "Proyectos: todos ▾";
        return;
    }
    const names = [...filterProjects];
    const label = names.length <= 2 ? names.join(", ") : `${names.length} proyectos`;
    msBtn.textContent = `Proyectos: ${label} ▾`;
}
function syncMsChecks() {
    for (const cb of msPanel.querySelectorAll("input[type=checkbox]")) {
        cb.checked = filterProjects.has(cb.value);
    }
    syncMsBtnLabel();
}
for (const name of projectOptions) {
    const row = msPanel.createEl("label");
    row.style.cssText = "display:flex;align-items:center;gap:8px;padding:4px 2px;cursor:pointer;font-size:.9em";
    const cb = row.createEl("input");
    cb.type = "checkbox";
    cb.value = name;
    cb.addEventListener("change", () => {
        if (cb.checked) filterProjects.add(name);
        else filterProjects.delete(name);
        syncMsBtnLabel();
        paint();
    });
    row.createEl("span", { text: name });
}
const msActions = msPanel.createEl("div");
msActions.style.cssText = "display:flex;gap:6px;margin-top:8px;padding-top:6px;border-top:1px solid var(--background-modifier-border)";
const clearProyBtn = msActions.createEl("button", { text: "Limpiar" });
clearProyBtn.style.cssText = "height:26px;padding:2px 8px;border-radius:6px;border:1px solid var(--background-modifier-border);background:var(--background-secondary);color:var(--text-normal);cursor:pointer";
clearProyBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    filterProjects.clear();
    syncMsChecks();
    paint();
});
msBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    msPanel.style.display = msPanel.style.display === "none" ? "block" : "none";
});
wrap.addEventListener("click", (e) => {
    if (!msWrap.contains(e.target)) msPanel.style.display = "none";
});

const capBox = wrap.createEl("div");
capBox.style.cssText = "font-size:.8em;opacity:.85;margin:0 0 10px;line-height:1.45;overflow-wrap:anywhere";
function paintCapacityHint() {
    const bits = [];
    for (const d of weekDays) {
        const map = capacity[d.iso] || {};
        const parts = Object.entries(map).map(([p, m]) => {
            const u = usadoDiaProy(d.iso, p);
            return `${p} ${u}/${m}m`;
        });
        if (parts.length) bits.push(`<strong>${d.label}</strong>: ${parts.join(" · ")}`);
    }
    capBox.empty();
    if (!bits.length) {
        capBox.createEl("span", { text: "Sin bloques con frontmatter proyecto: en calendario (esta semana)." });
        return;
    }
    capBox.createEl("div", { text: "Cupo semana (usado/cupo por proyecto):" }).style.fontWeight = "600";
    for (const b of bits) {
        const line = capBox.createEl("div");
        line.innerHTML = b;
    }
}

const list = wrap.createEl("div");
list.style.cssText = "display:flex;flex-direction:column;gap:10px;width:100%";

async function persistInbox() {
    const lines = await readPath(INBOX_PATH);
    const projects = listProjectHeads(lines);
    const byProj = {};
    for (const p of projects) byProj[p] = [];
    for (const r of localRows) {
        const p = r.proyecto || projects[0] || "Qnow web";
        if (!byProj[p]) byProj[p] = [];
        byProj[p].push(r);
    }
    let next = lines.slice();
    for (const name of Object.keys(byProj)) {
        let bounds = sectionBounds(next, name);
        if (!bounds) {
            const hechoIdx = next.findIndex((l) => /^##\s+Hecho\b/.test(l));
            const insertAt = hechoIdx >= 0 ? hechoIdx : next.length;
            next = next.slice(0, insertAt).concat([`## ${name}`, ...byProj[name].map((r) => taskLine(r, false)), ""], next.slice(insertAt));
            continue;
        }
        next = next.slice(0, bounds.headIdx + 1).concat(byProj[name].map((r) => taskLine(r, false)), next.slice(bounds.sectionEnd));
    }
    await writePath(INBOX_PATH, next.join("\n"));
}
function schedulePersist() {
    clearTimeout(window.__inboxPersist);
    window.__inboxPersist = setTimeout(() => {
        persistInbox().catch((e) => { console.error(e); new Notice("No se pudo guardar Inbox"); });
    }, 250);
}

async function deleteRow(r) {
    const kids = localRows.filter((x) => x.parent === r.id);
    const label = (r.text || "esta tarea").slice(0, 80);
    const extra = kids.length ? `\nTambién se borrarán ${kids.length} subtarea(s).` : "";
    const ok = window.confirm(`¿Borrar «${label}»?${extra}\n\nEsto no se puede deshacer con el botón Deshacer.`);
    if (!ok) return;
    const idSet = new Set([r.id, ...kids.map((k) => k.id)]);
    localRows = localRows.filter((x) => !idSet.has(x.id));
    if (window.__prioStickBottomId && idSet.has(window.__prioStickBottomId)) {
        window.__prioStickBottomId = null;
    }
    await persistInbox();
    setDirty(false);
    paint();
    paintCapacityHint();
    new Notice(`Borrada · ${r.id}`);
}

async function completeRow(r) {
    const idSet = new Set([r.id]);
    paint();
    let lines = await readPath(INBOX_PATH);
    const stamp = stampNow();
    for (const line of lines) {
        if (!/^\s*- \[ \]/.test(line)) continue;
        const body = line.replace(/^\s*- \[ \]\s*/, "");
        const pid = field(body, "parent");
        const iid = field(body, "id");
        if (pid && idSet.has(pid) && iid) idSet.add(iid);
    }
    const openByParent = {};
    for (const line of lines) {
        if (!/^\s*- \[ \]/.test(line)) continue;
        const body = line.replace(/^\s*- \[ \]\s*/, "");
        const pid = field(body, "parent");
        const iid = field(body, "id");
        if (pid && iid) {
            if (!openByParent[pid]) openByParent[pid] = [];
            openByParent[pid].push(iid);
        }
    }
    for (const [pid, kids] of Object.entries(openByParent)) {
        if (kids.every((k) => idSet.has(k))) idSet.add(pid);
    }
    localRows = localRows.filter((x) => !idSet.has(x.id));
    const moved = [];
    const nextLines = [];
    let section = "";
    for (const line of lines) {
        const hm = line.match(/^##\s+(.+?)\s*$/);
        if (hm) section = hm[1].trim();
        if (!/^\s*- \[ \]/.test(line)) { nextLines.push(line); continue; }
        const body = line.replace(/^\s*- \[ \]\s*/, "");
        const iid = field(body, "id");
        if (iid && idSet.has(iid)) {
            const proyName = SKIP_SECTIONS.has(section) ? (field(body, "proy") || "Qnow web") : section;
            moved.push(taskLine({
                id: iid, parent: field(body, "parent"), text: cleanText(body),
                estado: "hecha", origen: field(body, "origen"), cuando: field(body, "cuando"),
                scheduled: field(body, "scheduled"), prio_dia: field(body, "prio_dia"),
                estim_min: field(body, "estim_min"),
                proyecto: proyName,
                e: clamp(field(body, "e")) ?? 3, t: clamp(field(body, "t")) ?? 3, i: clamp(field(body, "i")) ?? 3,
                done: stamp,
            }, true));
            continue;
        }
        nextLines.push(line);
    }
    let bounds = sectionBounds(nextLines, "Hecho");
    if (!bounds) nextLines.push("", "## Hecho", ...moved);
    else nextLines.splice(bounds.sectionEnd, 0, ...moved);
    await writePath(INBOX_PATH, nextLines.join("\n"));
    window.__lastCompletedIds = [...idSet];
    paint();
    paintCapacityHint();
}

async function restoreByIds(ids) {
    if (!ids || !ids.length) {
        new Notice("Nada para deshacer");
        return;
    }
    const idSet = new Set(ids);
    let lines = await readPath(INBOX_PATH);
    const restored = [];
    const next = [];
    let section = "";
    for (const line of lines) {
        const hm = line.match(/^##\s+(.+?)\s*$/);
        if (hm) section = hm[1].trim();
        if (!/^\s*- \[[xX]\]/.test(line)) { next.push(line); continue; }
        const body = line.replace(/^\s*- \[[xX]\]\s*/, "");
        const iid = field(body, "id");
        const pid = field(body, "parent");
        if (!(iid && idSet.has(iid)) && !(pid && idSet.has(pid))) { next.push(line); continue; }
        if (iid) idSet.add(iid);
        const proy = field(body, "proy") || (section !== "Hecho" ? section : "Qnow web");
        const scheduled = field(body, "scheduled");
        const estado = scheduled ? "activa" : "inbox";
        restored.push({
            id: iid,
            parent: field(body, "parent"),
            text: cleanText(body),
            proyecto: proy,
            estado,
            origen: field(body, "origen"),
            cuando: field(body, "cuando"),
            scheduled,
            prio_dia: field(body, "prio_dia"),
            estim_min: field(body, "estim_min") === "" ? "" : Number(field(body, "estim_min")),
            e: clamp(field(body, "e")) ?? 3,
            t: clamp(field(body, "t")) ?? 3,
            i: clamp(field(body, "i")) ?? 3,
        });
    }
    if (!restored.length) {
        new Notice("No encontré esas ids en Hecho");
        return;
    }
    const byProy = {};
    for (const r of restored) {
        if (!byProy[r.proyecto]) byProy[r.proyecto] = [];
        byProy[r.proyecto].push(r);
        r.peso = peso(r.e, r.t, r.i);
        localRows.push(r);
    }
    let out = next.slice();
    for (const [proy, rows] of Object.entries(byProy)) {
        let bounds = sectionBounds(out, proy);
        const block = rows.map((r) => taskLine(r, false));
        if (!bounds) {
            const hechoIdx = out.findIndex((l) => /^##\s+Hecho\b/.test(l));
            const insertAt = hechoIdx >= 0 ? hechoIdx : out.length;
            out = out.slice(0, insertAt).concat([`## ${proy}`, ...block, ""], out.slice(insertAt));
        } else {
            out = out.slice(0, bounds.sectionEnd).concat(block, out.slice(bounds.sectionEnd));
        }
    }
    await writePath(INBOX_PATH, out.join("\n"));
    window.__lastCompletedIds = null;
    new Notice(`Deshecho · ${restored.length} tarea(s)`);
    paint();
    paintCapacityHint();
}
async function restoreLast() {
    await restoreByIds(window.__lastCompletedIds);
}

function patchRow(id, partial, ui) {
    const r = localRows.find((x) => x.id === id);
    if (!r) return;
    Object.assign(r, partial);
    if (partial.e != null || partial.t != null || partial.i != null) {
        r.peso = peso(r.e, r.t, r.i);
        if (r.estado === "inbox") r.estado = "activa";
    }
    if (partial.scheduled != null && partial.scheduled !== "" && r.estado === "inbox") r.estado = "activa";
    if (partial.estim_min != null && ui?.cargaEl) ui.cargaEl.textContent = String(cargaOf(r) || "—");
    if (ui?.pesoEl) ui.pesoEl.textContent = String(r.peso);
    if (ui?.estEl) ui.estEl.textContent = r.estado;
    setDirty(true);
}
function bindTextarea(inp, r, ui) {
    inp.setAttribute("data-prio-id", r.id);
    stopEditorSteal(inp);
    inp.addEventListener("focus", () => {
        clearTimeout(window.__prioBlurTimer);
        window.__prioFocus = { id: r.id, start: inp.selectionStart, end: inp.selectionEnd };
    });
    inp.addEventListener("input", () => {
        const raw = inp.value.replace(/\s*⌂\s*$/, "").trim();
        r.text = raw || "Nueva tarea";
        window.__prioFocus = { id: r.id, start: inp.selectionStart, end: inp.selectionEnd };
        setDirty(true);
        inp.style.height = "auto";
        inp.style.height = Math.max(52, Math.min(inp.scrollHeight + 2, 240)) + "px";
    });
    inp.addEventListener("change", () => patchRow(r.id, { text: inp.value.replace(/\s*⌂\s*$/, "").trim() || "Nueva tarea" }, ui));
    // Delay: remount Dataview dispara blur; no borrar el foco antes de poder restaurarlo.
    inp.addEventListener("blur", () => {
        clearTimeout(window.__prioBlurTimer);
        window.__prioBlurTimer = setTimeout(() => {
            if (window.__prioFocus?.id === r.id && document.activeElement !== inp) {
                delete window.__prioFocus;
            }
        }, 280);
    });
}
function paint() {
    list.empty();
    const stickId = window.__prioStickBottomId || null;
    let view = [...localRows];
    if (filterMode === "inbox") view = view.filter((r) => r.estado === "inbox");
    if (filterMode === "activa") view = view.filter((r) => r.estado === "activa");
    if (filterProjects.size) view = view.filter((r) => filterProjects.has(r.proyecto));
    view.sort((a, b) => {
        if (stickId) {
            if (a.id === stickId && b.id !== stickId) return 1;
            if (b.id === stickId && a.id !== stickId) return -1;
        }
        if (a.estado !== b.estado) return a.estado === "inbox" ? -1 : 1;
        return b.peso - a.peso;
    });
    if (!view.length) {
        const empty = list.createEl("div", { text: "Sin pendientes en este filtro" });
        empty.style.cssText = "padding:12px;opacity:.7";
        return;
    }
    view.forEach((r, idx) => {
        const card = list.createEl("div");
        if (stickId && r.id === stickId) card.setAttribute("data-prio-stick", "1");
        const accent = r.estado === "inbox"
            ? "var(--text-warning)"
            : (idx < 3 ? "var(--interactive-accent)" : "var(--background-modifier-border)");
        card.style.cssText = `position:relative;display:flex;gap:10px;align-items:flex-start;padding:10px 36px 10px 12px;border:1px solid var(--background-modifier-border);border-radius:10px;border-left:3px solid ${accent};background:var(--background-primary);width:100%;box-sizing:border-box`;

        const delBtn = card.createEl("button", { text: "🗑" });
        delBtn.title = "Borrar tarea";
        delBtn.style.cssText = "position:absolute;top:8px;right:8px;height:28px;width:28px;padding:0;border-radius:6px;border:1px solid transparent;background:transparent;color:var(--text-muted);cursor:pointer;line-height:1;font-size:14px;opacity:.55;transition:color .15s,background .15s,opacity .15s,border-color .15s";
        delBtn.addEventListener("mouseenter", () => {
            delBtn.style.color = "#ef4444";
            delBtn.style.background = "rgba(239,68,68,.12)";
            delBtn.style.borderColor = "rgba(239,68,68,.35)";
            delBtn.style.opacity = "1";
        });
        delBtn.addEventListener("mouseleave", () => {
            delBtn.style.color = "var(--text-muted)";
            delBtn.style.background = "transparent";
            delBtn.style.borderColor = "transparent";
            delBtn.style.opacity = ".55";
        });
        delBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            deleteRow(r).catch(console.error);
        });

        const chk = card.createEl("input");
        chk.type = "checkbox";
        chk.title = "Completar";
        chk.style.marginTop = "8px";
        chk.addEventListener("change", () => { if (chk.checked) completeRow(r).catch(console.error); });

        const main = card.createEl("div");
        main.style.cssText = "flex:1;min-width:0;display:flex;flex-direction:column;gap:8px";

        const inp = main.createEl("textarea");
        inp.rows = 2;
        inp.value = r.text + (r.parent ? ` ⌂` : "");
        inp.title = (r.text || "") + " | " + r.id + (r.parent ? ` · parent:${r.parent}` : "");
        inp.style.cssText = "width:100%;box-sizing:border-box;padding:8px 10px;resize:vertical;min-height:52px;line-height:1.4;white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word;border-radius:8px;border:1px solid var(--background-modifier-border);background:var(--background-secondary);color:var(--text-normal);font:inherit";
        const ui = { pesoEl: null, estEl: null, cargaEl: null };
        bindTextarea(inp, r, ui);
        requestAnimationFrame(() => {
            inp.style.height = "auto";
            inp.style.height = Math.max(52, Math.min(inp.scrollHeight + 2, 240)) + "px";
        });

        const controls = main.createEl("div");
        controls.style.cssText = "display:flex;flex-wrap:wrap;gap:8px;align-items:center";

        const addLabeled = (label, build) => {
            const box = controls.createEl("div");
            box.style.cssText = "display:flex;align-items:center;gap:4px";
            const lab = box.createEl("span", { text: label });
            lab.style.cssText = "font-size:.75em;opacity:.65";
            build(box);
            return box;
        };

        addLabeled("Proy", (box) => projectSelect(box, r.proyecto, (name) => patchRow(r.id, { proyecto: name }, ui)));
        for (const [fieldName, val, lab] of [["e", r.e, "E"], ["i", r.i, "I"], ["t", r.t, "T"]]) {
            addLabeled(lab, (box) => scoreSelect(box, val, (n) => patchRow(r.id, { [fieldName]: n }, ui)));
        }
        const pesoBox = addLabeled("Peso", (box) => {
            const el = box.createEl("span", { text: String(r.peso) });
            el.style.cssText = "font-weight:700;min-width:1.5em";
            ui.pesoEl = el;
        });
        addLabeled("Estim", (box) => {
            const estimInp = box.createEl("input");
            estimInp.type = "number";
            estimInp.min = "0";
            estimInp.step = "5";
            estimInp.placeholder = "min";
            estimInp.value = r.estim_min === "" || r.estim_min == null ? "" : String(r.estim_min);
            estimInp.style.cssText = "width:64px;height:28px;padding:2px 4px;border-radius:6px;border:1px solid var(--background-modifier-border);background:var(--background-primary);color:var(--text-normal)";
            stopEditorSteal(estimInp);
            estimInp.addEventListener("change", () => {
                const v = estimInp.value.trim();
                patchRow(r.id, { estim_min: v === "" ? "" : Number(v) }, ui);
            });
        });
        const carga = cargaOf(r);
        addLabeled("Carga", (box) => {
            const el = box.createEl("span", { text: carga ? String(carga) : "—" });
            el.title = "estim_min × 2 (o suma hijas)";
            ui.cargaEl = el;
        });
        addLabeled("Día", (box) => daySelect(box, r.scheduled, (iso) => patchRow(r.id, { scheduled: iso }, ui)));
        addLabeled("Est", (box) => {
            const el = box.createEl("span", { text: r.estado });
            el.style.cssText = "font-size:.85em;opacity:.85";
            ui.estEl = el;
        });
        void pesoBox;
    });
    const foc = window.__prioFocus;
    if (foc?.id) {
        const el = list.querySelector(`textarea[data-prio-id="${foc.id}"]`);
        if (el) {
            requestAnimationFrame(() => {
                el.focus();
                try {
                    const len = el.value.length;
                    el.setSelectionRange(Math.min(foc.start ?? len, len), Math.min(foc.end ?? len, len));
                } catch (_) {}
            });
        }
    } else if (window.__prioStickFocusOnce) {
        const stuck = list.querySelector('[data-prio-stick="1"]');
        if (stuck) {
            window.__prioStickFocusOnce = false;
            requestAnimationFrame(() => {
                stuck.scrollIntoView({ behavior: "smooth", block: "nearest" });
                const ta = stuck.querySelector("textarea");
                if (ta) { ta.focus(); ta.select(); }
            });
        }
    }
}
paint();
paintCapacityHint();



const bar = wrap.createEl("div");
bar.style.cssText = "display:flex;gap:8px;align-items:center;margin-top:10px;flex-wrap:wrap";
const addProySel = document.createElement("select");
bar.appendChild(addProySel);
addProySel.style.cssText = "height:28px;padding:2px 6px;border-radius:6px;border:1px solid var(--background-modifier-border);background:var(--background-primary);color:var(--text-normal)";
for (const name of DEFAULT_PROJECTS) {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    addProySel.appendChild(opt);
}
bar.createEl("button", { text: "+ Pendiente" }).addEventListener("click", () => {
    const id = newId();
    localRows.push({
        id, parent: "", text: "Nueva tarea", proyecto: addProySel.value || "Qnow web",
        estado: "inbox", origen: "yo", cuando: "7d", scheduled: "", prio_dia: "",
        estim_min: "",
        e: 3, t: 3, i: 3, peso: peso(3, 3, 3),
    });
    window.__prioStickBottomId = id;
    window.__prioStickFocusOnce = true;
    if (filterMode === "activa") filterMode = "all";
    if (filterProjects.size) {
        filterProjects.add(addProySel.value || "Qnow web");
        syncMsChecks();
    }
    setDirty(true);
    paint();
});
const hint = bar.createEl("span", { text: "Editá libre · Guardar (azul) escribe Inbox · check completa al toque" });
hint.style.cssText = "opacity:.65;font-size:.85em";
})().catch((e) => { console.error(e); dv.paragraph("_Error Priorizar._"); });
}

```

## Agenda (proyección Inbox por `scheduled`)

> No edites checklists sueltos: las misiones viven en Inbox. Asigná el **Día** arriba.

```dataviewjs
const INBOX_PATH = "01_Planificacion/02_Semanal/Inbox.md";
const SKIP = new Set(["Hecho", "Backlog"]);
function field(raw, key) {
    const m = String(raw || "").match(new RegExp("\\[" + key + "::\\s*([^\\]]*)\\]", "i"));
    return m ? m[1].trim() : "";
}
function cleanText(raw) {
    return String(raw || "").replace(/\[(\w+)::\s*[^\]]*\]/g, "").replace(/\s+/g, " ").trim();
}
function weekFile() {
    const cur = dv.current();
    if (cur?.file) return cur.file;
    const af = app.workspace.getActiveFile();
    if (af) return { path: af.path, name: af.basename };
    return { path: "", name: "" };
}
const name = (weekFile().name || "").trim();
const match = name.match(/(\d{4})-W(\d{2})/i);
let lunes = match
    ? moment().year(parseInt(match[1])).isoWeek(parseInt(match[2])).startOf("isoWeek")
    : moment().startOf("isoWeek");
const af = app.vault.getAbstractFileByPath(INBOX_PATH);
if (!af) {
    dv.paragraph("_Falta Inbox._");
} else {
(async () => {
    const lines = (await app.vault.read(af)).split("\n");
    let current = "";
    const byDay = {};
    for (let i = 0; i < 7; i++) {
        const iso = lunes.clone().add(i, "days").format("YYYY-MM-DD");
        byDay[iso] = [];
    }
    for (const line of lines) {
        const hm = line.match(/^##\s+(.+?)\s*$/);
        if (hm) { current = hm[1].trim(); continue; }
        if (!current || SKIP.has(current)) continue;
        if (!/^\s*- \[ \]/.test(line)) continue;
        const body = line.replace(/^\s*- \[ \]\s*/, "");
        const scheduled = field(body, "scheduled");
        if (!scheduled || !byDay[scheduled]) continue;
        byDay[scheduled].push({
            text: cleanText(body),
            id: field(body, "id"),
            proyecto: current,
            parent: field(body, "parent"),
            prio: field(body, "prio_dia"),
        });
    }
    for (let i = 0; i < 7; i++) {
        const d = lunes.clone().add(i, "days");
        const iso = d.format("YYYY-MM-DD");
        dv.header(3, `${iso} — ${d.format("dddd")}`);
        const items = byDay[iso];
        if (!items.length) {
            dv.paragraph("_Sin tareas con scheduled este día._");
            continue;
        }
        dv.table(
            ["Tarea", "Proyecto", "id", "parent"],
            items.map((t) => [
                (t.prio === "3" ? "^^^ " : t.prio === "2" ? "^^ " : t.prio === "1" ? "^ " : "") + t.text,
                t.proyecto,
                t.id || "—",
                t.parent || "—",
            ])
        );
    }
})().catch((e) => { console.error(e); dv.paragraph("_Error Agenda._"); });
}
```

---
## 🏆 Hitos de la Semana  

```dataviewjs
function weekFile() {
    const cur = dv.current();
    if (cur?.file) return cur.file;
    const af = app.workspace.getActiveFile();
    if (af) return { path: af.path, name: af.basename };
    return { path: "", name: "" };
}
let nombreArchivo = (weekFile().name || "").trim();
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
