import json
import os
import time
from google import genai
from google.genai import types

def get_api_key():
    config_path = os.path.expanduser('~/.planificacl/config.json')
    if os.path.exists(config_path):
        with open(config_path, 'r', encoding='utf-8') as f:
            return json.load(f).get('api_key')
    return None

api_key = get_api_key()
if not api_key:
    print("API Key not found.")
    exit(1)

client = genai.Client(api_key=api_key)

pdf_path = r'C:\Users\Oscar\.gemini\antigravity\brain\3b2fd6e0-2571-4dd8-b930-b5caeb9b507c\media__1782263938671.pdf'

print("Uploading file to Gemini...")
uploaded_file = client.files.upload(file=pdf_path)

print("Waiting for file processing...")
while True:
    f = client.files.get(name=uploaded_file.name)
    if f.state == "ACTIVE":
        break
    elif f.state == "FAILED":
        print("File processing failed.")
        exit(1)
    time.sleep(2)

print("Generating content...")
prompt = """
Extract all the "Objetivos de Aprendizaje" (OA) from the provided curriculum PDF for grades 1 to 6 ("Primero Básico" to "Sexto Básico").
The subjects are:
- lenguaje (Lenguaje y Comunicación)
- matematica (Matemática)
- ciencias (Ciencias Naturales)
- historia (Historia, Geografía y Ciencias Sociales)
- ingles (Idioma Extranjero Inglés)
- educacion_fisica (Educación Física y Salud)
- artes (Artes Visuales)
- musica (Música)
- tecnologia (Tecnología)
- orientacion (Orientación)

Return a single JSON object where the keys are the courses (e.g., "1_basico", "2_basico", "3_basico", "4_basico", "5_basico", "6_basico").
Inside each course, the keys should be the subjects (e.g., "lenguaje", "matematica", etc.).
Inside each subject, there should be a list of objects, each with "id" and "description".
Example:
{
  "1_basico": {
    "artes": [
      {
        "id": "OA 1",
        "description": "Expresar y crear trabajos de arte a partir de la observación del: entorno natural..."
      },
      ...
    ]
  }
}

Important: The OA number corresponds to the number in the list. Format the id as "OA <number>". Combine all bullets of an OA into a single description string. Do NOT include Markdown formatting like ```json in the output, just raw JSON.
"""

response = client.models.generate_content(
    model='gemini-1.5-flash',
    contents=[uploaded_file, prompt],
    config=types.GenerateContentConfig(
        response_mime_type="application/json",
        temperature=0.1
    )
)

print("Saving to oas_extracted.json...")
with open("oas_extracted.json", "w", encoding="utf-8") as out_f:
    out_f.write(response.text)

print("Done!")
