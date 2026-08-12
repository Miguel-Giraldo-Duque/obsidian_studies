#!/usr/bin/env python3
"""Slice border sprite sheets in RpgImages/borders/niveles/ into individual PNGs."""

from __future__ import annotations

import shutil
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent
NIVELES = ROOT / "niveles"
SOURCES = NIVELES / "_sources"

# All three sheets are 680x544 with a 10x8 grid (68px pitch).
COLS = 10
ROWS = 8
CELL = 68

# alias -> source filename already placed in niveles/
SHEETS = {
    "A": "Starter.png",
    "C": "Part 2 C.png",
    "F": "Intermediate level.png",
    "H": "Final level.png",
}

BLACK_LUMA = 30  # pixels at/under this become transparent


def black_to_alpha(im: Image.Image) -> Image.Image:
    arr = np.array(im.convert("RGBA"))
    luma = arr[:, :, 0].astype(np.int16) + arr[:, :, 1] + arr[:, :, 2]
    arr[luma <= BLACK_LUMA * 3, 3] = 0
    return Image.fromarray(arr, "RGBA")


def slice_sheet(src: Path, out_dir: Path) -> int:
    im = Image.open(src).convert("RGBA")
    w, h = im.size
    expected = (COLS * CELL, ROWS * CELL)
    if (w, h) != expected:
        raise SystemExit(
            f"{src.name}: size {w}x{h}, expected {expected[0]}x{expected[1]} "
            f"for {COLS}x{ROWS} @ {CELL}px"
        )

    out_dir.mkdir(parents=True, exist_ok=True)
    # clear previous slices
    for old in out_dir.glob("border_r*_c*.png"):
        old.unlink()

    count = 0
    for row in range(ROWS):
        for col in range(COLS):
            left = col * CELL
            top = row * CELL
            cell = im.crop((left, top, left + CELL, top + CELL))
            cell = black_to_alpha(cell)
            name = f"border_r{row}_c{col}.png"
            cell.save(out_dir / name, "PNG")
            count += 1
    return count


def main() -> None:
    SOURCES.mkdir(parents=True, exist_ok=True)

    for alias, filename in SHEETS.items():
        src = NIVELES / filename
        if not src.exists():
            raise SystemExit(f"Missing source: {src}")

        dest_src = SOURCES / filename
        if not dest_src.exists() or dest_src.stat().st_mtime < src.stat().st_mtime:
            shutil.copy2(src, dest_src)

        out_dir = NIVELES / alias
        n = slice_sheet(src, out_dir)
        print(f"{alias}: {n} PNGs -> {out_dir.relative_to(ROOT)}  (from {filename})")

    print("Done.")


if __name__ == "__main__":
    main()
