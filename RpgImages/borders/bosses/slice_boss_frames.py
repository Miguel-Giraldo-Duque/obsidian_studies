#!/usr/bin/env python3
"""Slice art_jitsu_blanko.png into individual boss-frame PNGs via grid cells."""

from __future__ import annotations

import shutil
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent
SOURCE_NAME = "art_jitsu_blanko.png"
SOURCE = ROOT / SOURCE_NAME
OUT = ROOT / "frames"
SOURCES_DIR = ROOT / "_sources"

BLACK_LUMA = 25
MIN_CELL_PIXELS = 100
MIN_ISLAND_PIXELS = 80

COL_BANDS = [
    (0, 142),
    (144, 191),
    (194, 237),
    (242, 285),
    (289, 334),
    (341, 378),
    (385, 430),
    (437, 474),
    (481, 574),
]


def black_to_alpha(im: Image.Image) -> Image.Image:
    arr = np.array(im.convert("RGBA"))
    luma = arr[:, :, 0].astype(np.int16) + arr[:, :, 1] + arr[:, :, 2]
    arr[luma <= BLACK_LUMA * 3, 3] = 0
    return Image.fromarray(arr, "RGBA")


def detect_row_bands(content: np.ndarray) -> list[tuple[int, int]]:
    h = content.shape[0]
    row_density = content.sum(axis=1)
    is_gutter = row_density <= 30
    cuts = []
    i = 0
    while i < h:
        if is_gutter[i]:
            j = i
            while j < h and is_gutter[j]:
                j += 1
            cuts.append((i + j - 1) // 2)
            i = j
        else:
            i += 1
    edges = [-1] + cuts + [h]
    bands = []
    for a, b in zip(edges, edges[1:]):
        start, end = a + 1, b - 1
        if end >= start and content[start : end + 1].any():
            bands.append((start, end))
    return bands


def islands_in_mask(mask: np.ndarray) -> list[tuple[int, int, int, int, int]]:
    """Return list of (minx,miny,maxx,maxy,count) for connected islands in local coords."""
    h, w = mask.shape
    visited = np.zeros((h, w), dtype=bool)
    out = []
    ys, xs = np.where(mask)
    for y0, x0 in zip(ys, xs):
        if visited[y0, x0]:
            continue
        q = deque([(y0, x0)])
        visited[y0, x0] = True
        minx = maxx = x0
        miny = maxy = y0
        count = 0
        while q:
            y, x = q.popleft()
            count += 1
            minx = min(minx, x)
            maxx = max(maxx, x)
            miny = min(miny, y)
            maxy = max(maxy, y)
            for ny, nx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
                if 0 <= ny < h and 0 <= nx < w and mask[ny, nx] and not visited[ny, nx]:
                    visited[ny, nx] = True
                    q.append((ny, nx))
        if count >= MIN_ISLAND_PIXELS:
            out.append((minx, miny, maxx, maxy, count))
    return out


def merge_nested_islands(islands: list[tuple[int, int, int, int, int]], pad: int = 3):
    """Merge smaller islands contained in larger ones (glow inside frame)."""
    if len(islands) <= 1:
        return islands
    keep = [True] * len(islands)
    for i, a in enumerate(islands):
        for j, b in enumerate(islands):
            if i == j or not keep[i]:
                continue
            # if a inside b (expanded), drop a
            if (
                a[4] <= b[4]
                and a[0] >= b[0] - pad
                and a[2] <= b[2] + pad
                and a[1] >= b[1] - pad
                and a[3] <= b[3] + pad
            ):
                # expand b to include a
                islands[j] = (
                    min(b[0], a[0]),
                    min(b[1], a[1]),
                    max(b[2], a[2]),
                    max(b[3], a[3]),
                    b[4] + a[4],
                )
                keep[i] = False
                break
    return [isl for isl, k in zip(islands, keep) if k]


def main() -> None:
    if not SOURCE.exists():
        raise SystemExit(f"Missing source: {SOURCE}")

    SOURCES_DIR.mkdir(parents=True, exist_ok=True)
    dest = SOURCES_DIR / SOURCE_NAME
    if not dest.exists():
        try:
            shutil.copy2(SOURCE, dest)
        except PermissionError:
            pass

    im = Image.open(SOURCE).convert("RGBA")
    arr = np.array(im)
    h, w = arr.shape[:2]
    lum = arr[:, :, 0].astype(np.int16) + arr[:, :, 1] + arr[:, :, 2]
    content = (lum > BLACK_LUMA) & (arr[:, :, 3] > 10)

    row_bands = detect_row_bands(content)
    print("row bands:", row_bands)

    exports = []
    for ri, (y0, y1) in enumerate(row_bands):
        for ci, (x0, x1) in enumerate(COL_BANDS):
            x0c, x1c = max(0, x0), min(w - 1, x1)
            y0c, y1c = max(0, y0), min(h - 1, y1)
            sub = content[y0c : y1c + 1, x0c : x1c + 1]
            if int(sub.sum()) < MIN_CELL_PIXELS:
                continue
            islands = merge_nested_islands(islands_in_mask(sub))
            # Nature column (ci==1): vines disconnect the frame — keep one bbox per cell
            if ci == 1 and len(islands) > 1:
                minx = min(i[0] for i in islands)
                miny = min(i[1] for i in islands)
                maxx = max(i[2] for i in islands)
                maxy = max(i[3] for i in islands)
                px = sum(i[4] for i in islands)
                islands = [(minx, miny, maxx, maxy, px)]
            for si, (lx0, ly0, lx1, ly1, px) in enumerate(islands):
                bw = lx1 - lx0 + 1
                bh = ly1 - ly0 + 1
                # drop tiny leftover vine scraps (not thin white frames which are ~44px)
                if (bw < 34 or bh < 34) and px < 600:
                    continue
                exports.append(
                    {
                        "ri": ri,
                        "ci": ci,
                        "si": si,
                        "minx": x0c + lx0,
                        "miny": y0c + ly0,
                        "maxx": x0c + lx1,
                        "maxy": y0c + ly1,
                        "bw": bw,
                        "bh": bh,
                        "px": px,
                    }
                )

    if OUT.exists():
        for old in OUT.glob("frame_*.png"):
            old.unlink()
    OUT.mkdir(parents=True, exist_ok=True)

    pad = 1
    for i, c in enumerate(exports):
        left = max(0, c["minx"] - pad)
        top = max(0, c["miny"] - pad)
        right = min(w, c["maxx"] + 1 + pad)
        bottom = min(h, c["maxy"] + 1 + pad)
        crop = black_to_alpha(im.crop((left, top, right, bottom)))
        name = f"frame_{i:03d}_r{c['ri']}_c{c['ci']}.png"
        if c["si"] > 0:
            name = f"frame_{i:03d}_r{c['ri']}_c{c['ci']}_s{c['si']}.png"
        crop.save(OUT / name, "PNG")
        print(f"{name}: {c['bw']}x{c['bh']} px={c['px']}")

    print(f"Done: {len(exports)} frames -> {OUT}")


if __name__ == "__main__":
    main()
