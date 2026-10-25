# -*- coding: utf-8 -*-
"""One-shot: inject 60 Flow skill-challenges from banco MD into vibe-rpg data.json."""
import json
import random
import re
import string
import time
from pathlib import Path

root = Path(__file__).resolve().parents[2]
data_path = root / ".obsidian/plugins/soulhy/data.json"
bank_path = root / "001 banco de quest" / "001 banco de retos de Flow.md"

NODE = "node_1785983669892_tu8ccua1d"
SOURCE = "flow-bank"
SCHOOL = "Presencia"
GUILTMAL = "1786983444165"


def _rand_alnum(n=9):
    alphabet = string.ascii_lowercase + string.digits
    return "".join(random.choice(alphabet) for _ in range(n))


def _meta(n):
    if n <= 20:
        return {"difficulty": "easy", "skillLevel": 1, "xp": 10, "bossDamage": 10}
    if n <= 40:
        return {"difficulty": "medium", "skillLevel": 2, "xp": 15, "bossDamage": 15}
    return {"difficulty": "hard", "skillLevel": 3, "xp": 20, "bossDamage": 20}


def _strip_md(text):
    text = re.sub(r"\*\*([^*]+)\*\*", r"\1", text)
    text = re.sub(r"\*([^*]+)\*", r"\1", text)
    text = re.sub(r"_([^_]+)_", r"\1", text)
    bt = chr(96)
    text = re.sub(bt + r"([^" + bt + r"]+)" + bt, r"\1", text)
    return re.sub(r"\s+", " ", text).strip()


def parse_bank(md):
    pattern = re.compile(
        r"- \*\*Challenge (\d+) \[([^\]]+)\]\*\*:\s*(.+?)(?=\n- \*\*Challenge |\n### |\n## |\n---|\Z)",
        re.S,
    )
    quests = []
    for m in pattern.finditer(md):
        n = int(m.group(1))
        title = m.group(2).strip()
        body = m.group(3).strip()
        # Keep TSN line; flatten for game description
        desc = _strip_md(body)
        quests.append((n, title, desc))
    quests.sort(key=lambda x: x[0])
    nums = [q[0] for q in quests]
    if nums != list(range(1, 61)):
        raise SystemExit("Expected challenges 1-60, got %r (count=%d)" % (nums, len(nums)))
    return quests


def level_name(n, title):
    if n <= 20:
        return "Reto 1.%d [%s]" % (n, title)
    if n <= 40:
        return "Reto 2.%d [%s]" % (n - 20, title)
    return "Reto 3.%d [%s]" % (n - 40, title)


def inject():
    quests = parse_bank(bank_path.read_text(encoding="utf-8"))
    d = json.loads(data_path.read_text(encoding="utf-8"))

    node = next(
        (n for n in d.get("skillTree", {}).get("nodes", []) if n.get("id") == NODE),
        None,
    )
    if node is None:
        raise SystemExit("Skill node %s not found" % NODE)
    print("Node OK:", node.get("name"), "/", node.get("school"))

    before = len(d["quests"])
    d["quests"] = [q for q in d["quests"] if q.get("source") != SOURCE]
    removed = before - len(d["quests"])
    if removed:
        print("Removed %d previous %s quests" % (removed, SOURCE))

    ts = int(time.time() * 1000)
    for n, title, desc in quests:
        meta = _meta(n)
        d["quests"].append(
            {
                "id": "quest_%s_%s" % (ts, _rand_alnum()),
                "name": level_name(n, title),
                "description": "[%s] %s" % (title, desc),
                "xp": meta["xp"],
                "gold": 5,
                "domain": "psychologicalWellbeing",
                "difficulty": meta["difficulty"],
                "completed": False,
                "completedDate": None,
                "kind": "skill-challenge",
                "skillNodeId": NODE,
                "skillLevel": meta["skillLevel"],
                "school": SCHOOL,
                "linkedBossIds": [GUILTMAL],
                "bossDamage": meta["bossDamage"],
                "source": SOURCE,
            }
        )

    data_path.write_text(json.dumps(d, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("Injected %d Flow quests (source=%s) -> %s" % (len(quests), SOURCE, data_path))


if __name__ == "__main__":
    inject()
