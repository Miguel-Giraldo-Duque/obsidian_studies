# -*- coding: utf-8 -*-
"""One-shot: write Quests MD + inject Lv1 quests + career habit into vibe-rpg data.json."""
import json
import random
import time
from pathlib import Path

root = Path(__file__).resolve().parents[2]
data_path = root / ".obsidian/plugins/soulhy/data.json"
quests_md_path = root / "02_Estudios/Quests_Postura_de_poder.md"

NODE = "node_1784952949938_smn8n1yyu"
PHOBOS = "1783917794860"
KRYOS = "1783927787622"
GUILTMAL = "1786983444165"

LV1 = [
    (
        "Q1.1 UFC — Primer salto del campeón",
        "Al terminar el primer hábito AM: 1 salto (o talones) + pecho abierto + frase BUENA CAMPEON SIIII antes de tocar el teléfono.",
    ),
    (
        "Q1.2 UFC — Doble reclamo",
        "Tras el primer hábito: 2 saltos cortos + pecho + frase UFC en el segundo salto.",
    ),
    (
        "Q1.3 UFC — Pecho primero, voz después",
        "1s pecho máximo → 1 salto → frase UFC con SIIII alargada.",
    ),
    (
        "Q1.4 UFC — Cámara mental del octágono",
        "1s imagen acabo de ganar → salto + frase UFC mirando al frente (no al piso).",
    ),
    (
        "Q1.5 UFC — Shine sin ensayo",
        "Max 2s entre termine y movimiento UFC + frase completa en automático.",
    ),
    (
        "Q1.6 General — Postura de briefing",
        "Pies a ancho de hombros, pecho abierto, mentón nivelado: Hoy comando mi mañana.",
    ),
    (
        "Q1.7 General — Tres órdenes",
        "Postura de general + 3 micro-órdenes concretas para las próximas horas.",
    ),
    (
        "Q1.8 General — Voz que baja el ruido",
        "Postura + Atencion. Ejecutamos el plan. Voz más grave y lenta que lo habitual.",
    ),
    (
        "Q1.9 General — Señal con la mano",
        "Postura + Avanzamos. + gesto de mando corto; mirada al frente.",
    ),
    (
        "Q1.10 General — Briefing sin guion",
        "Postura de general + 1 frase improvisada de estrategia real del próximo paso.",
    ),
    (
        "Q1.11 Aperturas — Arriba, laterales, sonrisa",
        "Brazos arriba → laterales → inhalar pecho → mirar arriba → mejor sonrisa → relajar.",
    ),
    (
        "Q1.12 Aperturas — Doble respiración",
        "Dos ciclos de Aperturas; en el segundo sonrisa al menos 2s mirando arriba.",
    ),
    (
        "Q1.13 Aperturas — Frase de apertura",
        "Apertura completa y durante la sonrisa: Estoy abierto a crecer.",
    ),
    (
        "Q1.14 Aperturas — Sin espejo, sin juicio",
        "Aperturas de espaldas a espejos; al relajar nombra 1s el juicio y sueltalo en la exhalación.",
    ),
    (
        "Q1.15 Aperturas — Shine automático",
        "Aperturas en max 2s sin checklist mental; secuencia fluida + sonrisa + relajar.",
    ),
]


def write_md() -> None:
    lines = [
        "---",
        "tags: [quest-design, autoridad, postura-de-poder]",
        "skill: Postura de poder",
        "school: Autoridad",
        "status: propuesta",
        "fuente_canon: Escuela habilidades blandas/El mito del carisma/Autoridad.md",
        "nodo_vibe_rpg: Postura de poder (node_1784952949938_smn8n1yyu)",
        "actualizado: 2026-08-01",
        "---",
        "",
        "# Quests: Postura de poder",
        "",
        "Arbol de **45 quests** (3 niveles x 3 familias x 5) para cablear celebracion corporal sentida (Shine / Tiny Habits) como entrenamiento de Autoridad.",
        "",
        "## Fundamento (psicologia)",
        "",
        "- **Fogg / Tiny Habits:** la emocion crea el habito; celebrar 1-2s despues; debe sentirse.",
        "- **Habit stacking / implementation intentions:** despues de [ancla], hare [celebracion].",
        "- **Woolley & Fishbach:** rewards inmediatos predicen persistencia.",
        "- **Cognicion corporeizada:** ensayo + confianza subjetiva. Cuddy hormonal = evidencia mixta; no es el pilar.",
        "- **Challenge Point ~60%** y transfer privado → cadena AM → social.",
        "",
        "**Familias:** UFC · General · Aperturas (canon Autoridad).",
        "",
        "## Como se juega",
        "",
        "1. Terminar habito ancla → 2. Celebrar (quest) → 3. Check Daily Ritual → 4. Campana Toggl (si aplica).",
        "",
        "| Nivel | Ancla | Meta |",
        "|-------|--------|------|",
        "| Lv1 | Primer habito AM | 1 celebracion no generica/dia |",
        "| Lv2 | Una familia en toda la cadena AM | N Shines consistentes |",
        "| Lv3 | Fuera del ritual privado | Transferencia social leve |",
        "",
        "## Nivel 1 — Crear el habito (cargado en vibe-rpg)",
        "",
    ]
    for name, desc in LV1:
        lines.append(f"### {name}")
        lines.append(f"- **Objetivo / criterio:** {desc}")
        lines.append("- **Duracion:** < 2 min")
        lines.append("")
    lines.extend(
        [
            "## Nivel 2 — Vivir el comando (cadena AM) — solo en este MD por ahora",
            "",
            "### Familia UFC",
            "- **Q2.1** Cadena minima limpia",
            "- **Q2.2** Misma firma, cero degradacion",
            "- **Q2.3** Escalera de volumen emocional",
            "- **Q2.4** Fallo y reenganche",
            "- **Q2.5** Piloto automatico AM",
            "",
            "### Familia General",
            "- **Q2.6** Cadena de briefing",
            "- **Q2.7** Misma base, misma voz",
            "- **Q2.8** Mapa estrategico",
            "- **Q2.9** Recuperacion de postura",
            "- **Q2.10** Dia de cuartel",
            "",
            "### Familia Aperturas",
            "- **Q2.11** Cadena abierta",
            "- **Q2.12** Sonrisa no negociable",
            "- **Q2.13** Aire como recompensa",
            "- **Q2.14** Micro-resistencia",
            "- **Q2.15** Fluidez",
            "",
            "## Nivel 3 — Transferencia social — solo en este MD por ahora",
            "",
            "### Familia UFC",
            "- **Q3.1** Plaza/vereda semi-sola",
            "- **Q3.2** Pre-umbral",
            "- **Q3.3** Micro-win publico",
            "- **Q3.4** Dos personas a la vista",
            "- **Q3.5** Campeon sin pedir permiso",
            "",
            "### Familia General",
            "- **Q3.6** Estrategia en banco de plaza",
            "- **Q3.7** Pre-interaccion",
            "- **Q3.8** Post micro-win social",
            "- **Q3.9** Orden audible a ~2m",
            "- **Q3.10** Briefing 20s bajo leve mirada",
            "",
            "### Familia Aperturas",
            "- **Q3.11** Estirarse como si nada en publico",
            "- **Q3.12** Umbral abierto",
            "- **Q3.13** Tras micro-win publico",
            "- **Q3.14** Sonrisa al cielo con testigos",
            "- **Q3.15** Integracion 3 toques en una salida",
            "",
            "## Progresion / unlock",
            "",
            "Lv1 (15/15) → currentLevel 1 → Lv2; Lv2 → Lv3; Lv3 → max y prereq Accion confiada.",
            "",
            "## Cheat sheet",
            "",
            "| Familia | Cuerpo | Frase |",
            "|---------|--------|-------|",
            "| UFC | Salto/talones + pecho | BUENA CAMPEON SIIII |",
            "| General | Erguido, pecho, voz firme | Orden/briefing corto |",
            "| Aperturas | Arriba→laterales→aire→arriba→sonrisa→relajar | Estoy abierto a crecer |",
            "",
            "**Mantra:** Termine → celebre sentido → check. Si no se sintio, no conto.",
            "",
        ]
    )
    quests_md_path.write_text("\n".join(lines), encoding="utf-8")
    print("Wrote", quests_md_path)


def inject_data() -> None:
    d = json.loads(data_path.read_text(encoding="utf-8"))
    d["quests"] = [q for q in d["quests"] if q.get("source") != "postura-poder-lv1"]
    ts = int(time.time() * 1000)
    for i, (name, desc) in enumerate(LV1):
        d["quests"].append(
            {
                "id": f"quest_{ts}_{i}_{random.randint(1000, 9999)}",
                "name": name,
                "description": desc,
                "xp": 10,
                "gold": 5,
                "domain": "psychologicalWellbeing",
                "difficulty": "easy",
                "completed": False,
                "completedDate": None,
                "kind": "skill-challenge",
                "skillNodeId": NODE,
                "skillLevel": 1,
                "school": "Autoridad",
                "linkedBossIds": [GUILTMAL],
                "bossDamage": 10,
                "source": "postura-poder-lv1",
            }
        )

    if not any(h.get("name") == "15min carrera (apply/connect)" for h in d["habits"]):
        d["habits"].append(
            {
                "name": "15min carrera (apply/connect)",
                "xp": 15,
                "gold": 5,
                "domain": "livingStandards",
                "difficulty": "medium",
                "linkedSkillIds": [],
                "skillXp": 10,
                "completed": False,
                "streak": 0,
                "bestStreak": 0,
                "lastCompletedDate": None,
                "id": f"habit_{ts}_carrera_{random.randint(1000, 9999)}",
                "linkedBossIds": [PHOBOS],
                "bossDamage": 10,
            }
        )
        print("Added career habit")

    d["habitTimerChainEnabled"] = True if "habitTimerChainEnabled" not in d else d["habitTimerChainEnabled"]
    d.setdefault("togglApiToken", "")
    d.setdefault("togglWorkspaceId", "5221214")
    # Block-based AM chain lives in DEFAULT_HABIT_CYCLE_CHAIN (plugin code), not data.json
    d["habitTimerChain"] = {}

    for node in d.get("skillTree", {}).get("nodes", []):
        if node.get("id") == NODE and not node.get("description"):
            node["description"] = (
                "Celebracion corporal sentida (UFC / General / Aperturas). Lv1 = primer Shine AM."
            )

    data_path.write_text(json.dumps(d, ensure_ascii=False, indent=2), encoding="utf-8")
    n = sum(1 for q in d["quests"] if q.get("source") == "postura-poder-lv1")
    print(f"postura lv1 quests={n} total_quests={len(d['quests'])}")


if __name__ == "__main__":
    write_md()
    inject_data()
