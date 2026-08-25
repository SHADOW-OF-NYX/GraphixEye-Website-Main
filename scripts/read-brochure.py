import fitz
from pathlib import Path

pdf = Path(r"c:\Users\gauth\Downloads\GraphixEye Profile (1).pdf")
doc = fitz.open(pdf)
print("pages", doc.page_count)
for i, page in enumerate(doc):
    text = page.get_text("text").strip()
    if text:
        print(f"\n===== PAGE {i+1} =====")
        print(text[:2000])
