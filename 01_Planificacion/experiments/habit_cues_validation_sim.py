# -*- coding: utf-8 -*-
"""
Mini-simulación: ¿el sistema de cues sube la consistencia de hábitos frágiles?

Diseño real: 6 días alternando cues ON/OFF, carga fija = 3 misiones.
Este script:
  1) Imprime el plan día a día + esquema de recolección.
  2) Corre una simulación Monte Carlo (datos sintéticos) para ver
     cómo se vería un efecto realista y el umbral de decisión.
  3) Con --real CSV, analiza tus filas reales.

Usage:
  python habit_cues_validation_sim.py
  python habit_cues_validation_sim.py --seed 7
  python habit_cues_validation_sim.py --real habit_cues_validation_log.csv
"""
from __future__ import annotations

import argparse
import csv
import random
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, List, Sequence


# --- Diseño fijo (pequeña escala) ------------------------------------------

FRAGILE = ("career", "read", "study", "hito1")
MISSIONS_CAP = 3
N_DAYS = 6
# Alternating: ON, OFF, ON, OFF, ON, OFF
CUES_PLAN = ["ON", "OFF", "ON", "OFF", "ON", "OFF"]

SLOTS_ON = {
    "career": "Break 1 post Bloque1 - alarma -> 15min apply/connect -> Shine -> check",
    "read": "Post Bloque 2 - 2+ pag -> Shine -> check",
    "study": "Post trastes almuerzo - 15min + 1 idea -> Shine -> check",
    "hito1": "Post trastes cena - 5min hito1 -> Shine -> check (sin OMA full)",
}

DELTA_SUCCESS = 0.8  # umbral: mean(Y_ON) - mean(Y_OFF)
DELTA_C = 0.25  # umbral: rate(C_ON) - rate(C_OFF)


@dataclass
class DayRow:
    day_index: int
    cues: str
    career: int
    read: int
    study: int
    hito1: int
    missions_planned: int
    missions_done: int
    b1_ok: int
    cue_adherence: float | None
    notes: str = ""

    @property
    def Y(self) -> int:
        return self.career + self.read + self.study + self.hito1

    @property
    def C(self) -> int:
        return 1 if self.Y >= 3 else 0

    @property
    def W(self) -> float:
        if self.missions_planned <= 0:
            return 0.0
        return self.missions_done / self.missions_planned


def print_protocol() -> None:
    print("=== Validacion cues x habitos fragiles (6 dias) ===\n")
    print("Hipotesis: cues ON => mayor Y / C que OFF, con max. 3 misiones/dia.\n")
    print(f"{'Dia':<5} {'cues':<5} | Que hacer")
    print("-" * 72)
    for i, cues in enumerate(CUES_PLAN, start=1):
        if cues == "ON":
            tip = "Loop Shine->check en 4 fragiles (slots del mapa)"
        else:
            tip = "Mismos minimos SIN Shine/campana; no inventes ritual nuevo"
        print(f"D{i:<4} {cues:<5} | carga={MISSIONS_CAP} misiones | {tip}")
    print("\nSlots fragiles (solo refuerzo en ON):")
    for k, v in SLOTS_ON.items():
        print(f"  - {k}: {v}")
    print("\nRecoleccion (1 fila/noche en habit_cues_validation_log.csv):")
    print(
        "  date, day_index, cues, career, read, study, hito1,"
        " missions_planned, missions_done, B1_ok, cue_adherence, notes"
    )
    print("  Y y C se calculan solos (Y=suma 0-4; C=1 si Y>=3).")
    print(
        f"\nExito: deltaY>={DELTA_SUCCESS}  OR  deltaC>={DELTA_C:.0%}"
        "  (+ adherence ON >=0.75 en >=2/3 dias ON)\n"
    )


def _bernoulli(p: float, rng: random.Random) -> int:
    return 1 if rng.random() < p else 0


def simulate_day(day_index: int, cues: str, rng: random.Random) -> DayRow:
    """
    Generative model (solo para sandbox):
      OFF: p_frágil ≈ 0.35–0.45 (histórico: breaks se caen)
      ON:  p_frágil ≈ 0.70–0.80 si adherence alta
      Trabajo: W alto en ambos (carga fija pequeña); leve tradeoff si Y alto.
    """
    planned = MISSIONS_CAP
    if cues == "ON":
        adherence = round(rng.uniform(0.75, 1.0), 2)
        # fidelidad del cue empuja la probabilidad
        p = 0.55 + 0.35 * adherence  # ~0.81–0.90
        b1 = _bernoulli(0.85, rng)
    else:
        adherence = None
        p = 0.40
        b1 = _bernoulli(0.80, rng)

    career = _bernoulli(p, rng)
    read = _bernoulli(p - 0.05, rng)
    study = _bernoulli(p - 0.05, rng)
    hito = _bernoulli(p, rng)
    y = career + read + study + hito

    # leve fricción: más hábitos cumplidos → un poquito menos de margen mental
    done_p = 0.92 - 0.04 * max(0, y - 2)
    done = sum(_bernoulli(done_p, rng) for _ in range(planned))

    return DayRow(
        day_index=day_index,
        cues=cues,
        career=career,
        read=read,
        study=study,
        hito1=hito,
        missions_planned=planned,
        missions_done=done,
        b1_ok=b1,
        cue_adherence=adherence,
        notes="synthetic",
    )


def simulate_run(seed: int) -> List[DayRow]:
    rng = random.Random(seed)
    return [simulate_day(i, cues, rng) for i, cues in enumerate(CUES_PLAN, start=1)]


def analyze(rows: Sequence[DayRow], label: str) -> None:
    on = [r for r in rows if r.cues == "ON"]
    off = [r for r in rows if r.cues == "OFF"]

    def mean(xs: Iterable[float]) -> float:
        xs = list(xs)
        return sum(xs) / len(xs) if xs else float("nan")

    y_on, y_off = mean(r.Y for r in on), mean(r.Y for r in off)
    c_on, c_off = mean(r.C for r in on), mean(r.C for r in off)
    w_on, w_off = mean(r.W for r in on), mean(r.W for r in off)
    d_y, d_c = y_on - y_off, c_on - c_off

    adh_ok = [r for r in on if r.cue_adherence is not None and r.cue_adherence >= 0.75]
    fidelity = len(adh_ok) / len(on) if on else 0.0

    print(f"=== Analisis [{label}] n={len(rows)} ===\n")
    print(f"{'dia':<4} {'cues':<4} Y  C  W     B1  adh   carrera read study hito")
    print("-" * 70)
    for r in rows:
        adh = f"{r.cue_adherence:.2f}" if r.cue_adherence is not None else "  - "
        print(
            f"D{r.day_index:<3} {r.cues:<4} {r.Y}  {r.C}  {r.W:.2f}  {r.b1_ok}   {adh}  "
            f"{r.career}       {r.read}    {r.study}     {r.hito1}"
        )

    print("\nResumen")
    print(f"  mean Y | ON={y_on:.2f}  OFF={y_off:.2f}  dY={d_y:+.2f}  (umbral {DELTA_SUCCESS:+.1f})")
    print(f"  rate C | ON={c_on:.0%}  OFF={c_off:.0%}  dC={d_c:+.0%}  (umbral {DELTA_C:+.0%})")
    print(f"  mean W | ON={w_on:.0%}  OFF={w_off:.0%}  (trabajo no deberia derrumbarse)")
    print(f"  fidelidad cues ON (adh>=0.75): {fidelity:.0%} de dias ON")

    hyp = (d_y >= DELTA_SUCCESS) or (d_c >= DELTA_C)
    if fidelity < 2 / 3:
        print("\n-> INCONCLUSO: poca adherence en ON. Arregla el protocolo antes de juzgar cues.")
    elif hyp:
        print("\n-> HIPOTESIS SOSTENIDA (en esta muestra): cues asociados a mas consistencia.")
        print("  Siguiente: screening de slots (habit_routine_doe.py) con cues ON fijos.")
    else:
        print("\n-> HIPOTESIS NO SOSTENIDA aun: delta bajo el umbral.")
        print("  Revisa si OFF contamino con Shine igual, o si la carga 3 aun es alta.")

    # Correlación burda W vs Y (Pearson sin deps)
    if len(rows) >= 3:
        ys = [float(r.Y) for r in rows]
        ws = [r.W for r in rows]
        my, mw = mean(ys), mean(ws)
        num = sum((y - my) * (w - mw) for y, w in zip(ys, ws))
        den_y = sum((y - my) ** 2 for y in ys) ** 0.5
        den_w = sum((w - mw) ** 2 for w in ws) ** 0.5
        corr = num / (den_y * den_w) if den_y and den_w else float("nan")
        print(f"\n  corr(W, Y) ~= {corr:+.2f}  (negativo => mas checklist <-> menos habitos)")

    try_doekit_note()


def try_doekit_note() -> None:
    try:
        import doekit as ed  # noqa: F401

        print("\n(doekit disponible: para Oleada 1 de slots usa habit_routine_doe.py)")
    except ImportError:
        print("\n(doekit no instalado - no hace falta para esta mini-validacion A/B)")


def load_real_csv(path: Path) -> List[DayRow]:
    rows: List[DayRow] = []
    with path.open(encoding="utf-8", newline="") as f:
        reader = csv.DictReader(
            (line for line in f if line.strip() and not line.lstrip().startswith("#"))
        )
        for raw in reader:
            cues = (raw.get("cues") or "").strip().upper()
            if cues not in ("ON", "OFF"):
                continue
            adh_raw = (raw.get("cue_adherence") or "").strip()
            adh = float(adh_raw) if adh_raw else None
            rows.append(
                DayRow(
                    day_index=int(raw["day_index"]),
                    cues=cues,
                    career=int(raw["career"]),
                    read=int(raw["read"]),
                    study=int(raw["study"]),
                    hito1=int(raw["hito1"]),
                    missions_planned=int(raw.get("missions_planned") or MISSIONS_CAP),
                    missions_done=int(raw.get("missions_done") or 0),
                    b1_ok=int(raw.get("B1_ok") or raw.get("b1_ok") or 0),
                    cue_adherence=adh,
                    notes=(raw.get("notes") or "").strip(),
                )
            )
    if not rows:
        raise SystemExit(f"No hay filas válidas en {path}")
    return rows


def write_blank_template(path: Path) -> None:
    if path.exists():
        return
    path.write_text(
        "date,day_index,cues,career,read,study,hito1,Y,C,missions_planned,"
        "missions_done,W,B1_ok,cue_adherence,notes\n",
        encoding="utf-8",
    )


def main() -> None:
    ap = argparse.ArgumentParser(description="Mini-validación cues vs hábitos frágiles")
    ap.add_argument("--seed", type=int, default=42, help="Semilla Monte Carlo")
    ap.add_argument(
        "--real",
        type=Path,
        default=None,
        help="CSV con datos reales (habit_cues_validation_log.csv)",
    )
    ap.add_argument(
        "--monte-carlo",
        type=int,
        default=1,
        help="Cuántas corridas sintéticas mostrar (default 1)",
    )
    args = ap.parse_args()

    print_protocol()

    if args.real:
        analyze(load_real_csv(args.real), label=f"REAL {args.real.name}")
        return

    for k in range(args.monte_carlo):
        seed = args.seed + k
        rows = simulate_run(seed)
        analyze(rows, label=f"SIM seed={seed}")
        if k + 1 < args.monte_carlo:
            print("\n" + "=" * 70 + "\n")

    here = Path(__file__).resolve().parent
    log = here / "habit_cues_validation_log.csv"
    print(f"\nPlantilla de log: {log}")
    print("Cuando tengas 6 filas reales:")
    print(f"  python {Path(__file__).name} --real {log.name}")


if __name__ == "__main__":
    main()
