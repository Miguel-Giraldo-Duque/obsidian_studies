# -*- coding: utf-8 -*-
"""
Screening DoE for habit-routine placement (doekit mental MCP).

Y daily (0-4) = career + read>=2p + study>=15m + hito1
Constraint: Block1 start <= ~09:15

Usage:
  pip install doekit==0.3.0
  python habit_routine_doe.py
"""
from __future__ import annotations

try:
    import doekit as ed
except ImportError:
    raise SystemExit("Install: pip install doekit==0.3.0")


FACTORS = [
    ("career_slot", "break2_late", "break1_after_B1"),
    ("read_slot", "night_free", "break2_post_B2"),
    ("study_dose", "15min", "30min"),
    ("am_metta", "sometimes", "always_in_rite"),
    ("career_min", "connect_only", "apply_required"),
]


def main() -> None:
    n_factors = len(FACTORS)
    design = ed.plackett_burman(n_factors)
    mat = design.matrix  # pandas DataFrame
    # First n_factors columns are the real factors (PB may add dummies)
    cols = list(mat.columns)[:n_factors]

    print("=== Habit routine screening (Plackett-Burman) ===\n")
    print(f"Factors (active): {n_factors} | Runs: {design.n_runs} | Matrix cols: {design.n_factors}\n")
    print(f"{'Day':<6} | " + " | ".join(f"{name:<14}" for name, _, _ in FACTORS))
    print("-" * (8 + n_factors * 17))

    for i, (_, row) in enumerate(mat.iterrows(), start=1):
        cells = []
        for j, (name, low, high) in enumerate(FACTORS):
            level = float(row[cols[j]])
            label = high if level > 0 else low
            cells.append(f"{label:<14}")
        print(f"D{i:<5} | " + " | ".join(cells))

    print("\nResponse Y (log daily 0-4):")
    print("  +1 career done | +1 read>=2 pages | +1 study>=15m | +1 hito1 filled")
    print("Hard constraint: Block1 deep work starts by ~09:15.")
    print("After 8 days: lock factors that move Y for 2 weeks before raising dose.")

    try:
        report = ed.evaluate(design, effect_size=1.0, sigma=1.0)
        summary = report.summary() if hasattr(report, "summary") else str(report)
        print("\n=== doekit.evaluate summary ===")
        print(summary)
    except Exception as exc:
        print(f"\n(evaluate skipped or API differs: {exc})")


if __name__ == "__main__":
    main()
