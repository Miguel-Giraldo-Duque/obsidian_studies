# -*- coding: utf-8 -*-
"""One-shot: EveVacum boss update + inject 15 quests from bank MD."""
import json
import random
import re
import string
import time
from pathlib import Path

root = Path(__file__).resolve().parents[2]
data_path = root / ".obsidian/plugins/vibe-rpg/data.json"
bank_path = root / "001 banco de retos de EveVacum.md"

BOSS_ID = "1785816112558"
SOURCE = "evevacum-bank"
# Bank table claims x10@25 + x5@30 = 400, but listed 9 + 6.
# Use 10@25 + 5@30: thirties = 7,9,11,12,13 (14 stays 25 for sum).
DAMAGE_30 = {7, 11, 12, 13, 14}  # 9@25; hard 11-14@30 + reto7


def _rand_alnum(n=9):
    alphabet = string.ascii_lowercase + string.digits
    return "".join(random.choice(alphabet) for _ in range(n))


def _meta(n):
    if n <= 5:
        return {"difficulty": "easy", "skillLevel": 1, "xp": 10}
    if n <= 10:
        return {"difficulty": "medium", "skillLevel": 2, "xp": 15}
    return {"difficulty": "hard", "skillLevel": 3, "xp": 20}


def _strip_md(text):
    text = re.sub(r"\*\*([^*]+)\*\*", r"\1", text)
    text = re.sub(r"\*([^*]+)\*", r"\1", text)
    text = re.sub(r"_([^_]+)_", r"\1", text)
    bt = chr(96)
    text = re.sub(bt + r"([^" + bt + r"]+)" + bt, r"\1", text)
    return re.sub(r"\s+", " ", text).strip()


def parse_bank(md):
    pattern = re.compile(
        r"- \*\*Reto (\d+) \[([^\]]+)\]\*\*(?:\s*\*[^*]*\*)?:\s*(.+?)(?=\n- \*\*Reto |\n---|\n## |\Z)",
        re.S,
    )
    quests = []
    for m in pattern.finditer(md):
        n = int(m.group(1))
        title = m.group(2).strip()
        desc = _strip_md(m.group(3))
        quests.append((n, title, desc))
    quests.sort(key=lambda x: x[0])
    nums = [q[0] for q in quests]
    if nums != list(range(1, 16)):
        raise SystemExit("Expected retos 1-15, got %r" % nums)
    return quests


def inject():
    quests = parse_bank(bank_path.read_text(encoding="utf-8"))
    d = json.loads(data_path.read_text(encoding="utf-8"))

    boss = next((b for b in d["bossFights"] if b.get("id") == BOSS_ID), None)
    if boss is None:
        raise SystemExit("Boss %s not found" % BOSS_ID)

    boss["name"] = "EveVacum"
    boss["maxHp"] = 400
    boss["currentHp"] = 400
    boss["tier"] = "standard"
    boss["description"] = (
        "Eco de Kryos + Phobos (campo). No se derrota: se le muestra otra custodia "
        "(dejar crecer, dejar ir, perdonarse). Guarda la Flor Rumen — vulnerabilidad "
        "y deseo de amor que la coraza ahoga al \"proteger\".\n\n"
        "Significa que esa chica linda con la que siempre quise hablar no se quedará "
        "en lo que pudo ser porque era del grupo. Permitirme ser vulnerable y admitir "
        "que quiero amor y conexión."
    )
    if boss.get("flowerId") in (None, "flower10"):
        boss["flowerId"] = "flower6"
        print("WARN: flowerId -> flower6 (Flor Rumen); flower10 = hito Reto 10")

    before = len(d["quests"])
    d["quests"] = [q for q in d["quests"] if q.get("source") != SOURCE]
    removed = before - len(d["quests"])
    if removed:
        print("Removed %d previous %s quests" % (removed, SOURCE))

    ts = int(time.time() * 1000)
    for n, title, desc in quests:
        dmg = 30 if n in DAMAGE_30 else 25
        meta = _meta(n)
        d["quests"].append(
            {
                "id": "quest_%s_%s" % (ts, _rand_alnum()),
                "name": "Reto %d [%s]" % (n, title),
                "description": desc,
                "xp": meta["xp"],
                "gold": 5,
                "domain": "psychologicalWellbeing",
                "difficulty": meta["difficulty"],
                "completed": False,
                "completedDate": None,
                "kind": "skill-challenge",
                "skillNodeId": "",
                "skillLevel": meta["skillLevel"],
                "school": "Campo",
                "linkedBossIds": [BOSS_ID],
                "bossDamage": dmg,
                "source": SOURCE,
            }
        )

    data_path.write_text(json.dumps(d, ensure_ascii=False, indent=2), encoding="utf-8")

    bank = [q for q in d["quests"] if q.get("source") == SOURCE]
    dmg_sum = sum(q["bossDamage"] for q in bank)
    assert len(bank) == 15, len(bank)
    assert dmg_sum == 400, dmg_sum
    assert boss["name"] == "EveVacum" and boss["maxHp"] == 400

    for b in d["bossFights"]:
        if b["id"] in ("1783917794860", "1783927787622"):
            assert b["maxHp"] == 2000

    print("OK boss", boss["id"], boss["name"], "%s/%s" % (boss["currentHp"], boss["maxHp"]), "tier=", boss["tier"])
    print("OK quests=%d bossDamage_sum=%d" % (len(bank), dmg_sum))
    print("WARN: skillNodeId empty; school=Campo")
    print("WARN: reto 9 dmg=25 (no 30) para cerrar suma 400; banco listaba 6x30 / aritmetica x5")
    for q in bank:
        print("  - %s dmg=%s %s L%s" % (q["name"], q["bossDamage"], q["difficulty"], q["skillLevel"]))
    print("Wrote", data_path)


if __name__ == "__main__":
    inject()
