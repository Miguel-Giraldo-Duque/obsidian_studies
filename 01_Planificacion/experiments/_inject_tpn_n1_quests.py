# -*- coding: utf-8 -*-
"""Ensure 42 tpn-n1 Flow quests exist in soulhy/data.json (idempotent)."""
import json
from datetime import date, timedelta
from pathlib import Path

root = Path(__file__).resolve().parents[2]
data_path = root / ".obsidian/plugins/soulhy/data.json"

NODE = "node_1785983669892_tu8ccua1d"
SOURCE = "tpn-n1"
GUILTMAL = "1786983444165"
START = date(2026, 8, 22)
HABIT_ID = "habit_tpn_protocol_pvt"
HABIT_NAME = "Protocolo TPN (PVT + sueño)"


def meta(dia):
    semana = min(6, (dia - 1) // 7 + 1)
    trataka = {1: 0, 2: 2, 3: 4, 4: 6, 5: 8, 6: 10}[semana]
    if semana >= 5:
        return semana, trataka, 3, 20, "hard", 20
    if semana >= 3:
        return semana, trataka, 2, 15, "medium", 15
    return semana, trataka, 1, 10, "easy", 10


def main():
    d = json.loads(data_path.read_text(encoding="utf-8"))
    quests = d.setdefault("quests", [])
    existing = {q.get("id") for q in quests}
    added = 0
    for dia in range(1, 43):
        qid = "quest_tpn_n1_d%02d" % dia
        if qid in existing:
            continue
        semana, trataka, skill_level, dmg, difficulty, xp = meta(dia)
        fecha = START + timedelta(days=dia - 1)
        trataka_text = "sin trataka (baseline)" if trataka == 0 else "trataka %d min" % trataka
        quests.append({
            "id": qid,
            "name": "TPN día %d [S%d · %s]" % (dia, semana, trataka_text),
            "description": "Protocolo N=1. Fecha %s. Registrar PVT + KSS en la Taberna. %s. Completar el formulario cuenta como completar esta quest." % (fecha.isoformat(), trataka_text),
            "xp": xp,
            "gold": 5,
            "domain": "psychologicalWellbeing",
            "difficulty": difficulty,
            "completed": False,
            "completedDate": None,
            "kind": "skill-challenge",
            "skillNodeId": NODE,
            "skillLevel": skill_level,
            "school": "Presencia",
            "linkedBossIds": [GUILTMAL],
            "bossDamage": dmg,
            "source": SOURCE,
            "tpnDia": dia,
            "tpnFecha": fecha.isoformat(),
        })
        added += 1

    habits = d.setdefault("habits", [])
    habit = next((h for h in habits if h.get("id") == HABIT_ID or h.get("name") == HABIT_NAME), None)
    if habit is None:
        habits.append({
            "id": HABIT_ID,
            "name": HABIT_NAME,
            "xp": 10,
            "gold": 5,
            "domain": "psychologicalWellbeing",
            "difficulty": "medium",
            "linkedSkillIds": [],
            "skillXp": 10,
            "linkedBossIds": [GUILTMAL],
            "bossDamage": 10,
            "completed": False,
            "streak": 0,
            "bestStreak": 0,
            "lastCompletedDate": None,
        })
        print("habit added")
    else:
        habit["id"] = HABIT_ID
        habit["linkedBossIds"] = [GUILTMAL]
        habit["bossDamage"] = 10
        print("habit updated")

    d.setdefault("tpnExperiment", {
        "config": {"start": "2026-08-22", "wake": "07:00", "bed": "22:00"},
        "entries": [],
    })

    data_path.write_text(json.dumps(d, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("quests added:", added, "total quests:", len(quests))


if __name__ == "__main__":
    main()
