/**
 * Smoke tests for AAR/Hito pure helpers (no Obsidian runtime).
 * Run: node .obsidian/plugins/soulhy/_test_aar_hito_helpers.mjs
 */

function mergeAarGapWhys(gap, whys) {
  const g = (gap || "").trim();
  const w = (whys || "").trim();
  if (!w) return gap || "";
  if (!g) return whys || "";
  if (g.includes(w)) return gap || "";
  return `${g}\n\n${w}`;
}

function scoreAccionDraft(a) {
  const impacto = Math.max(1, Math.min(5, Number(a.impacto) || 3));
  const esfuerzo = Math.max(1, Math.min(5, Number(a.esfuerzo) || 3));
  const rapida = !!a.rapida;
  return impacto * (6 - esfuerzo) * (rapida ? 1.5 : 1);
}

function headerLabel(n, titulo) {
  const preview = String(titulo || "").trim();
  return preview
    ? `Evento ${n} · ${preview.slice(0, 48)}${preview.length > 48 ? "…" : ""}`
    : `Evento ${n}`;
}

function pickElegidas(acciones) {
  const elegidas = (acciones || []).filter(
    (a) => a.elegida && String(a.texto || "").trim(),
  );
  const ranked = [...elegidas].sort(
    (a, b) => scoreAccionDraft(b) - scoreAccionDraft(a),
  );
  return {
    inm: ranked[0] || null,
    sis: ranked[1] || null,
    parking: (acciones || [])
      .filter((a) => !a.elegida && String(a.texto || "").trim())
      .map((a) => String(a.texto).trim()),
  };
}

let failed = 0;
function assert(cond, msg) {
  if (!cond) {
    failed += 1;
    console.error("FAIL:", msg);
  } else {
    console.log("ok:", msg);
  }
}

assert(mergeAarGapWhys("gap", "") === "gap", "merge: only gap");
assert(mergeAarGapWhys("", "why") === "why", "merge: only whys");
assert(
  mergeAarGapWhys("gap", "why") === "gap\n\nwhy",
  "merge: both concatenated",
);
assert(
  mergeAarGapWhys("gap\nwhy", "why") === "gap\nwhy",
  "merge: no duplicate if already included",
);

assert(scoreAccionDraft({ impacto: 5, esfuerzo: 2 }) === 20, "score base 5×4");
assert(
  scoreAccionDraft({ impacto: 5, esfuerzo: 2, rapida: true }) === 30,
  "score <7d ×1.5",
);

assert(headerLabel(1, "") === "Evento 1", "header empty title");
assert(
  headerLabel(1, "Cita con Vicky") === "Evento 1 · Cita con Vicky",
  "header mirrors input value",
);
assert(
  headerLabel(2, "x".repeat(60)).startsWith("Evento 2 · ") &&
    headerLabel(2, "x".repeat(60)).endsWith("…"),
  "header truncates long titles",
);

const pick = pickElegidas([
  { texto: "A", elegida: true, impacto: 3, esfuerzo: 3 },
  { texto: "B", elegida: true, impacto: 5, esfuerzo: 1 },
  { texto: "C", elegida: false, impacto: 5, esfuerzo: 1 },
]);
assert(pick.inm?.texto === "B", "pick top score as first elegida");
assert(pick.sis?.texto === "A", "pick second elegida");
assert(pick.parking.join("|") === "C", "parking keeps non-elegidas");

const pickMax = pickElegidas([
  { texto: "1", elegida: true, impacto: 5, esfuerzo: 1 },
  { texto: "2", elegida: true, impacto: 4, esfuerzo: 1 },
  { texto: "3", elegida: true, impacto: 3, esfuerzo: 1 },
]);
assert(
  pickMax.inm?.texto === "1" && pickMax.sis?.texto === "2",
  "only top 2 elegidas persist as inm/sis",
);

if (failed) {
  console.error(`\n${failed} failed`);
  process.exit(1);
}
console.log("\nAll helper tests passed.");
