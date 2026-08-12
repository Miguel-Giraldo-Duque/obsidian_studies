#!/usr/bin/env python3
"""Organize school borders + generate lv1/lv2/lv3 color variants."""

from __future__ import annotations

import shutil
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent
NIVELES = ROOT / "niveles"
OUT = ROOT / "escuelas"

# school -> (niveles letter, filename)
SCHOOLS = {
    "Autoridad": ("A", "border_r5_c6.png"),
    "Presencia": ("C", "border_r2_c6.png"),  # bronze/silver from Part 2 C
    "Calidez": ("A", "border_r2_c9.png"),
}

# (dark, light) for diagonal tint — keeps a bit of depth like the originals
LEVEL_COLORS = {
    1: ((0x8B, 0x69, 0x14), (0xC4, 0xA3, 0x5A)),  # café / bronce
    2: ((0xA8, 0xB0, 0xBC), (0xE8, 0xEC, 0xF0)),  # plateado
    3: ((0x6B, 0x1E, 0x4A), (0xC9, 0x4B, 0x6A)),  # rojo-morado
}

# Per-school lv3 colors — dark = sombra, light = highlight (como el base oro→magenta)
SCHOOL_LEVEL_OVERRIDES = {
    "Autoridad": {
        3: ((0x8A, 0x5A, 0x00), (0xFF, 0xE8, 0x66)),  # sombra oro → highlight
    },
    "Presencia": {
        3: ((0x0A, 0x3A, 0x9A), (0xC0, 0xF8, 0xFF)),  # azul profundo → diamante
    },
    "Calidez": {
        # neon lime like Part_2_D: sombra aún verde brillante → highlight lima
        3: ((0x14, 0x78, 0x3A), (0xE0, 0xFF, 0x8A)),
    },
}

LV3_LABELS = {
    "Autoridad": "dorado brillante",
    "Presencia": "azul diamante",
    "Calidez": "verde brillante claro",
}


def colors_for(school: str, level: int) -> tuple[tuple[int, int, int], tuple[int, int, int]]:
    override = SCHOOL_LEVEL_OVERRIDES.get(school, {}).get(level)
    if override:
        return override
    return LEVEL_COLORS[level]


def tint_frame(
    im: Image.Image,
    dark: tuple[int, int, int],
    light: tuple[int, int, int],
    *,
    boost: float = 1.0,
    preserve_base_shade: bool = False,
    shade_floor: float = 0.0,
) -> Image.Image:
    """Keep alpha; map shade to dark→light.

    If preserve_base_shade, follow the base PNG's own luminance (like the
    gold→magenta diagonal on the originals) instead of a flat fill.
    shade_floor: lift shadows toward highlight (neon look); 0 = full range.
    """
    arr = np.array(im.convert("RGBA"), dtype=np.float32)
    rgb = arr[:, :, :3]
    alpha = arr[:, :, 3]
    opaque = alpha > 0
    lum = (0.299 * rgb[:, :, 0] + 0.587 * rgb[:, :, 1] + 0.114 * rgb[:, :, 2]) / 255.0
    h, w = lum.shape
    yy, xx = np.mgrid[0:h, 0:w]
    diag = 1.0 - ((xx + yy) / max(w + h - 2, 1))

    if preserve_base_shade and opaque.any():
        lo = float(lum[opaque].min())
        hi = float(lum[opaque].max())
        if hi > lo:
            shade = (lum - lo) / (hi - lo)
        else:
            shade = lum
        t = np.clip(0.75 * shade + 0.25 * diag, 0.0, 1.0)
        t = np.power(t, 0.9)
    else:
        t = np.clip((0.45 * lum + 0.55 * diag) * boost, 0.0, 1.0)
        t = np.power(t, 0.85)

    # keep neon shadows bright (don't sink into forest green)
    if shade_floor > 0:
        t = shade_floor + (1.0 - shade_floor) * t

    t = t[:, :, None]
    dark_a = np.array(dark, dtype=np.float32)
    light_a = np.array(light, dtype=np.float32)
    out_rgb = dark_a + (light_a - dark_a) * t
    out = np.zeros_like(arr)
    out[:, :, :3] = np.clip(out_rgb, 0, 255)
    out[:, :, 3] = alpha
    return Image.fromarray(out.astype(np.uint8), "RGBA")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)

    for school, (letter, filename) in SCHOOLS.items():
        src = NIVELES / letter / filename
        if not src.exists():
            raise SystemExit(f"Missing: {src}")

        school_dir = OUT / school
        school_dir.mkdir(parents=True, exist_ok=True)

        shutil.copy2(src, school_dir / "base.png")
        label = LV3_LABELS[school]
        if school == "Calidez":
            label = "verde neon lima (estilo Part_2_D)"
        (school_dir / "SOURCE.txt").write_text(
            f"source: niveles/{letter}/{filename}\n"
            f"school: {school}\n"
            f"levels: lv1 cafe/bronce, lv2 plateado, lv3 {label}\n",
            encoding="utf-8",
        )

        base_im = Image.open(src).convert("RGBA")
        for level in (1, 2, 3):
            dark, light = colors_for(school, level)
            tinted = tint_frame(
                base_im,
                dark,
                light,
                preserve_base_shade=(level == 3),
                # Calidez lv3: sombra suave para no apagar el neon
                shade_floor=0.40 if (school == "Calidez" and level == 3) else 0.0,
            )
            tinted.save(school_dir / f"lv{level}.png", "PNG")
            print(f"{school}/lv{level}.png")

    print(f"Done -> {OUT}")


if __name__ == "__main__":
    main()
