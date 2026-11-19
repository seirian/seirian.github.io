#!/usr/bin/env python3
"""Generate the KakaoTalk/Open Graph image from the real Notion profile photo.

The portrait is the only person photo; the rest is original typography and
non-photographic decoration. Output is a baseline JPEG for crawler compatibility.
"""
from __future__ import annotations

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "site/assets/avatar-yeop.webp"
OUTPUT = ROOT / "site/assets/og-portfolio.jpg"
WIDTH, HEIGHT = 1200, 630


def font(size: int, *, bold: bool = False):
    name = "DejaVuSans-Bold.ttf" if bold else "DejaVuSans.ttf"
    paths = [
        Path("/usr/share/fonts/truetype/dejavu") / name,
        Path("/usr/share/fonts/truetype/liberation2") / (
            "LiberationSans-Bold.ttf" if bold else "LiberationSans-Regular.ttf"
        ),
    ]
    for path in paths:
        if path.is_file():
            return ImageFont.truetype(str(path), size)
    return ImageFont.truetype(name, size)


def main():
    if not SOURCE.is_file() or SOURCE.is_symlink():
        raise RuntimeError("Original Notion photo not found")
    photo = Image.open(SOURCE)
    if photo.width < 120 or photo.height < 120:
        raise RuntimeError("Profile photo is unexpectedly small")
    image = Image.new("RGB", (WIDTH, HEIGHT), "#f3f7f0")
    canvas = ImageDraw.Draw(image)
    canvas.rounded_rectangle((36, 36, 1164, 594), 32, fill="#f9fbf7", outline="#dce8de", width=2)

    # Subtle geometric background, with the portrait remaining the focal point.
    canvas.ellipse((685, -205, 1370, 492), fill="#e4efe5")
    canvas.ellipse((868, 125, 1320, 580), fill="#d5e8db")
    canvas.line((78, 506, 660, 506), fill="#c9d7cb", width=2)

    # Brand label, name and role are Latin for predictable rendering across hosts.
    green = "#254c36"
    quiet = "#55725f"
    canvas.rounded_rectangle((80, 82, 290, 128), 23, fill="#e1ede2")
    canvas.text((101, 94), "DEVELOPER PORTFOLIO", fill=green, font=font(17, bold=True))
    canvas.text((76, 172), "YEOP.", fill=green, font=font(105, bold=True))
    canvas.text((82, 309), "SUNGYEOP JUNG", fill="#1d3023", font=font(35, bold=True))
    canvas.text((82, 367), "BACKEND ENGINEER", fill=quiet, font=font(27, bold=True))
    canvas.text((82, 532), "Java  /  Spring Boot  /  Systems", fill=green, font=font(23))

    # The original photo, large enough to be clearly recognizable in link previews.
    with Image.open(SOURCE) as original:
        portrait = ImageOps.fit(
            original.convert("RGB"),
            (402, 402),
            method=Image.Resampling.LANCZOS,
            centering=(0.5, 0.34),
        )
    mask = Image.new("L", (402, 402), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, 401, 401), fill=255)
    canvas.ellipse((740, 119, 1160, 539), fill="#c8d8ca")
    image.paste(portrait, (744, 105), mask)
    canvas.ellipse((742, 103, 1148, 509), outline="#ffffff", width=8)

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    for quality in (88, 82, 76):
        image.save(OUTPUT, "JPEG", quality=quality, optimize=True, progressive=False, subsampling=1)
        if OUTPUT.stat().st_size < 175_000:
            break
    if not (10_000 < OUTPUT.stat().st_size < 175_000):
        raise RuntimeError("Open Graph JPEG outside permitted limits")
    with Image.open(OUTPUT) as check:
        if check.size != (WIDTH, HEIGHT) or check.format != "JPEG":
            raise RuntimeError("Unexpected social image dimensions or format")
    print(f"Created {OUTPUT.relative_to(ROOT)} (1200x630, {OUTPUT.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
