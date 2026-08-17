"""Crop web-ready photos from GraphixEye Profile brochure spreads."""
from pathlib import Path
from PIL import Image

Image.MAX_IMAGE_PIXELS = None

SRC = Path(r"d:\GraphixEye Website Main\public\brochure\images")
OUT = Path(r"d:\GraphixEye Website Main\public\images")
OUT.mkdir(parents=True, exist_ok=True)
(OUT / "works").mkdir(exist_ok=True)


def save_web(im: Image.Image, dest: Path, max_w=1800, quality=82):
    im = im.convert("RGB")
    w, h = im.size
    if w > max_w:
        im = im.resize((max_w, int(h * max_w / w)), Image.Resampling.LANCZOS)
    dest.parent.mkdir(parents=True, exist_ok=True)
    im.save(dest, "JPEG", quality=quality, optimize=True, progressive=True)
    print(f"  {dest.name} {im.size} {dest.stat().st_size // 1024}kb")


def crop_frac(im: Image.Image, l, t, r, b):
    w, h = im.size
    return im.crop((int(w * l), int(h * t), int(w * r), int(h * b)))


# Full-bleed cinematic / divider uses
full_uses = {
    2: "hero-journey.jpg",
    3: "divider-design.jpg",
    8: "divider-signage.jpg",
    14: "divider-printing.jpg",
    18: "divider-packaging.jpg",
    22: "divider-gifting.jpg",
}

# Service photo crops: page -> [(slug, side)]
# side: left | right
services = {
    4: [("logo-design", "left"), ("branding-identity", "right")],
    5: [("print-design", "left"), ("digital-design", "right")],
    6: [("packaging-design", "left"), ("illustration-infographics", "right")],
    7: [("virtual-reality", "left"), ("augmented-reality", "right")],
    9: [("exterior-signage", "left"), ("interior-signage", "right")],
    10: [("directional-signage", "left"), ("wall-branding", "right")],
    11: [("display-stand", "left"), ("digital-signage", "right")],
    12: [("vehicle-graphics", "left"), ("road-signage", "right")],
    13: [("exhibition-booth", "left"), ("event-management", "right")],
    15: [("offset-printing", "left"), ("digital-printing", "right")],
    16: [("silk-screen", "left"), ("uv-hot-stamping", "right")],
    17: [("continuous-forms", "left"), ("binding-finishing", "right")],
    19: [("packaging-custom", "left"), ("packaging-innovative", "right")],
    20: [("packaging-versatile", "left"), ("packaging-flexible", "right")],
    21: [("packaging-specialty", "left"), ("packaging-sustainable", "right")],
    23: [("giveaways", "left"), ("trophies", "right")],
    24: [("lanyards", "left"), ("uniforms", "right")],
    25: [("safety-wears", "left")],
}

# Main photo only — above the brochure's red title band.
BOXES = {
    "left": (0.055, 0.04, 0.445, 0.40),
    "right": (0.555, 0.04, 0.945, 0.40),
}

print("=== full / hero ===")
# Journey spread: use the cinematic road on the right, skip the text panel.
p2 = Image.open(next(SRC.glob("img-*-p02-*.jpeg")))
save_web(crop_frac(p2, 0.38, 0.0, 1.0, 1.0), OUT / "hero-journey.jpg", max_w=2200)

for page, name in full_uses.items():
    if page == 2:
        continue
    src = next(SRC.glob(f"img-*-p{page:02d}-*.jpeg"))
    im = Image.open(src)
    save_web(crop_frac(im, 0.0, 0.08, 1.0, 0.92), OUT / name, max_w=2200)

print("=== works ===")
for page, items in services.items():
    src = next(SRC.glob(f"img-*-p{page:02d}-*.jpeg"))
    im = Image.open(src)
    for slug, side in items:
        save_web(crop_frac(im, *BOXES[side]), OUT / "works" / f"{slug}.jpg")

# Extra supporting crops for Experience page (press / process)
print("=== experience extras ===")
p15 = Image.open(next(SRC.glob("img-*-p15-*.jpeg")))
save_web(crop_frac(p15, 0.03, 0.62, 0.32, 0.96), OUT / "experience-press.jpg")
p16 = Image.open(next(SRC.glob("img-*-p16-*.jpeg")))
save_web(crop_frac(p16, 0.03, 0.05, 0.47, 0.52), OUT / "experience-screenprint.jpg")
p9 = Image.open(next(SRC.glob("img-*-p09-*.jpeg")))
save_web(crop_frac(p9, 0.03, 0.04, 0.47, 0.52), OUT / "experience-signage.jpg")

print("DONE")
