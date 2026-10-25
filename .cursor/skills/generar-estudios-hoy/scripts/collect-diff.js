#!/usr/bin/env node
/**
 * Lista notas .md sucias bajo Escuela* / Escuelas/ para /generar-estudios-hoy.
 * Sin dependencias. Imprime JSON a stdout (paths + status; sin diffs — el agente lee los files).
 *
 * Uso: node .cursor/skills/generar-estudios-hoy/scripts/collect-diff.js
 * Opcional: --date YYYY-MM-DD
 */
"use strict";

const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function findRepoRoot(startDir) {
  let dir = startDir;
  for (;;) {
    try {
      return execFileSync("git", ["rev-parse", "--show-toplevel"], {
        cwd: dir,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      }).trim();
    } catch {
      const parent = path.dirname(dir);
      if (parent === dir) return null;
      dir = parent;
    }
  }
}

function parseArgs(argv) {
  const out = { date: null };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === "--date" && argv[i + 1]) {
      out.date = argv[++i];
    }
  }
  return out;
}

function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function normalizePath(p) {
  return p.replace(/\\/g, "/").replace(/^\.\//, "");
}

function isEscuelaNote(p) {
  const n = normalizePath(p);
  if (!n.toLowerCase().endsWith(".md")) return false;
  if (n.startsWith("Escuelas/")) return true;
  if (n.startsWith("Escuela")) return true;
  return false;
}

function isExcluded(p) {
  const n = normalizePath(p);
  if (n.startsWith(".obsidian/")) return true;
  if (n.startsWith("magus/")) return true;
  if (n.startsWith("01_Planificacion/")) return true;
  if (n.startsWith("00_Plantillas/")) return true;
  const base = n.split("/").pop() || "";
  if (base.startsWith("Plantilla_")) return true;
  if (base === "Untitled.md" || base.startsWith("Untitled ")) return true;
  if (base.startsWith("EJEMPLO_")) return true;
  if (n.endsWith("data.json")) return true;
  if (/\.(png|jpg|jpeg|gif|webp|svg|ico)$/i.test(n)) return true;
  return false;
}

/**
 * Parse git status --porcelain -z (NUL-separated).
 * Rename/copy: XY old\0new\0
 */
function parsePorcelainZ(buf) {
  const entries = [];
  const parts = buf.split("\0").filter((s) => s.length > 0);
  let i = 0;
  while (i < parts.length) {
    const chunk = parts[i];
    if (chunk.length < 3) {
      i++;
      continue;
    }
    const xy = chunk.slice(0, 2);
    const rest = chunk.slice(3);
    const isRenameOrCopy =
      xy[0] === "R" ||
      xy[0] === "C" ||
      xy[1] === "R" ||
      xy[1] === "C";
    if (isRenameOrCopy) {
      const newPath = parts[i + 1] || rest;
      entries.push({ path: newPath, status: xy.trim() || "R" });
      i += 2;
      continue;
    }
    entries.push({ path: rest, status: xy.trim() || xy });
    i++;
  }
  return entries;
}

function isPureDelete(status) {
  const s = (status || "").replace(/\s/g, "");
  // D, DD — sin contenido nuevo. Renames (R) y modifies (M) pasan.
  return s === "D" || s === "DD";
}

function localDateFromMtime(mtimeMs) {
  const d = new Date(mtimeMs);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function main() {
  const args = parseArgs(process.argv);
  const date =
    args.date && /^\d{4}-\d{2}-\d{2}$/.test(args.date) ? args.date : todayISO();

  const repoRoot = findRepoRoot(__dirname) || findRepoRoot(process.cwd());
  if (!repoRoot) {
    process.stdout.write(
      JSON.stringify({ error: "not a git repo", date, empty: true, files: [] }, null, 2) +
        "\n"
    );
    process.exit(1);
  }

  let porcelain;
  try {
    // -uall: expand untracked dirs (e.g. ?? Escuelas/) into file paths
    porcelain = execFileSync(
      "git",
      ["status", "--porcelain", "-z", "-uall"],
      {
        cwd: repoRoot,
        encoding: "utf8",
        maxBuffer: 32 * 1024 * 1024,
      }
    );
  } catch (err) {
    process.stdout.write(
      JSON.stringify(
        { error: String(err.message || err), date, empty: true, files: [] },
        null,
        2
      ) + "\n"
    );
    process.exit(1);
  }

  const raw = parsePorcelainZ(porcelain);
  const files = [];
  const todayTouched = [];
  const seen = new Set();
  let deletedSkipped = 0;

  for (const entry of raw) {
    const p = normalizePath(entry.path);
    if (!p || seen.has(p)) continue;
    if (isExcluded(p)) continue;
    if (!isEscuelaNote(p)) continue;
    if (isPureDelete(entry.status)) {
      deletedSkipped++;
      continue;
    }
    seen.add(p);

    let mtimeDate = null;
    try {
      const st = fs.statSync(path.join(repoRoot, p));
      mtimeDate = localDateFromMtime(st.mtimeMs);
    } catch {
      // missing on disk
    }

    const item = { path: p, status: entry.status, mtimeDate };
    files.push(item);
    if (mtimeDate === date) todayTouched.push(item);
  }

  const preferred = todayTouched.length > 0 ? todayTouched : files;
  const result = {
    date,
    empty: files.length === 0,
    count: files.length,
    todayTouchedCount: todayTouched.length,
    preferredCount: preferred.length,
    deletedSkipped,
    estudiosPath: `02_Estudios/${date}.md`,
    preferred,
    files,
    hint:
      preferred.length > 20
        ? "Muchas notas en preferred. Priorizá las que Soulhy estudió hoy; preguntá si el set no es obvio (máx. ~8 por run)."
        : todayTouched.length > 0
          ? "Usá preferred (mtime = hoy)."
          : null,
  };

  process.stdout.write(JSON.stringify(result, null, 2) + "\n");
}

main();
