from __future__ import annotations

import os
import sys


def main() -> int:
    root = os.path.dirname(os.path.abspath(__file__))
    src = os.path.join(root, "assets", "logo.jpg")

    if not os.path.exists(src):
        print(f"ERROR: No encuentro el archivo: {src}")
        return 2

    try:
        from PIL import Image  # type: ignore
    except Exception:
        print(
            "ERROR: Falta Pillow para generar el favicon.\n"
            "Instalalo con: python -m pip install pillow\n"
        )
        return 3

    img = Image.open(src).convert("RGBA")

    # Center-crop to square
    w, h = img.size
    side = min(w, h)
    left = (w - side) // 2
    top = (h - side) // 2
    img = img.crop((left, top, left + side, top + side))

    # Gentle padding so it doesn't touch edges
    pad = int(side * 0.10)
    canvas = Image.new("RGBA", (side + pad * 2, side + pad * 2), (255, 255, 255, 0))
    canvas.paste(img, (pad, pad))
    img = canvas

    def save_png(size: int, name: str) -> None:
        out = img.resize((size, size), Image.Resampling.LANCZOS)
        out.save(os.path.join(root, name), format="PNG", optimize=True)

    save_png(32, "favicon-32x32.png")
    save_png(180, "apple-touch-icon.png")
    save_png(192, "android-chrome-192x192.png")

    ico_sizes = [(16, 16), (32, 32), (48, 48)]
    ico_base = img.resize((48, 48), Image.Resampling.LANCZOS)
    ico_base.save(os.path.join(root, "favicon.ico"), format="ICO", sizes=ico_sizes)

    print("OK: favicon.ico + PNGs generados")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
