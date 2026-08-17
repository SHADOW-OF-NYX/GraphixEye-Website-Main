from pathlib import Path
from PIL import Image

src = Path(r"C:\Users\gauth\.cursor\projects\d-GraphixEye-Website-Main\assets\c__Users_gauth_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_GraphixEye_Remove_BG-2b50dc05-b1cd-4953-b290-d43f34a3ec37.png")
out = Path(r"d:\GraphixEye Website Main\public\logo.png")

im = Image.open(src).convert("RGBA")
pixels = im.load()
w, h = im.size

for y in range(h):
    for x in range(w):
        r, g, b, a = pixels[x, y]
        luma = 0.2126 * r + 0.7152 * g + 0.0722 * b
        blue_bias = b - r
        if luma < 18 and blue_bias < 12:
            pixels[x, y] = (r, g, b, 0)
        elif luma < 40 and blue_bias < 20 and a > 0:
            pixels[x, y] = (r, g, b, int(a * 0.15))

bbox = im.getbbox()
if bbox:
    pad = 12
    left, top, right, bottom = bbox
    im = im.crop((max(0, left - pad), max(0, top - pad), min(w, right + pad), min(h, bottom + pad)))

im.save(out, optimize=True)
print("saved", out, im.size)
