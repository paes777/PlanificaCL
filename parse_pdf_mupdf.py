import fitz
import json
import re

pdf_path = r'C:\Users\Oscar\.gemini\antigravity\brain\3b2fd6e0-2571-4dd8-b930-b5caeb9b507c\media__1782263938671.pdf'

doc = fitz.open(pdf_path)
text_by_page = []
for i in range(len(doc)):
    page = doc.load_page(i)
    text_by_page.append(page.get_text())

with open("pdf_extracted_mupdf.txt", "w", encoding="utf-8") as f:
    for i, text in enumerate(text_by_page):
        f.write(f"=== PAGE {i+1} ===\n{text}\n")

print("PDF text extracted and saved to pdf_extracted_mupdf.txt")
