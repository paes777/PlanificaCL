import json
import re
import os

transcript_path = r'C:\Users\Oscar\.gemini\antigravity\brain\3b2fd6e0-2571-4dd8-b930-b5caeb9b507c\.system_generated\logs\transcript_full.jsonl'
with open(transcript_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

pdf_text = ""
for line in reversed(lines):
    data = json.loads(line)
    if '==Start of PDF==' in data.get('content', ''):
        pdf_text = data['content']
        break

with open('pdf_text.txt', 'w', encoding='utf-8') as f:
    f.write(pdf_text)

print("PDF text extracted, length:", len(pdf_text))
