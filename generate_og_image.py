from __future__ import annotations

import os


def main() -> int:
    root = os.path.dirname(os.path.abspath(__file__))
    logo_path = os.path.join(root, "assets", "logo.jpg")
    out_path = os.path.join(root, "og-image.png")

    try:
        from PIL import Image, ImageChops, ImageDraw  # type: ignore
    except Exception:
        print("ERROR: Falta Pillow. Instalalo con: python -m pip install pillow")
        return 2

    if not os.path.exists(logo_path):
        print(f"ERROR: No encuentro el logo en: {logo_path}")
        return 3

    # Match CSS --bg: #fbf3e3
    bg = (251, 243, 227, 255)
    canvas = Image.new("RGBA", (1200, 630), bg)

    logo = Image.open(logo_path).convert("RGBA")

    # Center-crop to square
    w, h = logo.size
    side = min(w, h)
    left = (w - side) // 2
    top = (h - side) // 2
    logo = logo.crop((left, top, left + side, top + side))

    # Circular mask
    mask = Image.new("L", logo.size, 0)
    ImageDraw.Draw(mask).ellipse((0, 0, logo.size[0] - 1, logo.size[1] - 1), fill=255)

    # Resize to fit in OG card
    logo_size = 360
    logo = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
    mask = mask.resize((logo_size, logo_size), Image.Resampling.LANCZOS)

    # Subtle ring (uses brand-ish dark brown with alpha)
    ring_color = (43, 29, 22, 60)
    ring_size = logo_size + 28
    ring = Image.new("RGBA", (ring_size, ring_size), (0, 0, 0, 0))

    ring_mask = Image.new("L", (ring_size, ring_size), 0)
    ImageDraw.Draw(ring_mask).ellipse((0, 0, ring_size - 1, ring_size - 1), fill=255)

    inner = Image.new("L", (ring_size, ring_size), 0)
    inset = 14
    ImageDraw.Draw(inner).ellipse((inset, inset, ring_size - inset - 1, ring_size - inset - 1), fill=255)

    ring_mask = ImageChops.subtract(ring_mask, inner)
    ring.paste(ring_color, (0, 0), ring_mask)

    cx, cy = 600, 315
    canvas.alpha_composite(ring, (cx - ring_size // 2, cy - ring_size // 2))
    canvas.paste(logo, (cx - logo_size // 2, cy - logo_size // 2), mask)

    canvas.convert("RGB").save(out_path, format="PNG", optimize=True)
    print(f"OK: creado {out_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
