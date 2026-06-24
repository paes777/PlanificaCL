import re
import json

text = open('pdf_extracted_mupdf.txt', 'r', encoding='utf-8').read()
pages = text.split('=== PAGE ')

subjects_map = {
    'Artes Visuales': 'artes',
    'Ciencias Naturales': 'ciencias',
    'Educación Física y Salud': 'educacion_fisica',
    'Historia, Geografía y Ciencias Sociales': 'historia',
    'Tecnología': 'tecnologia',
    'Matemática': 'matematica',
    'Idioma Extranjero Inglés': 'ingles',
    'Idioma extranjero Inglés': 'ingles',
    'Lenguaje y Comunicación': 'lenguaje',
    'Música': 'musica',
    'Orientación': 'orientacion'
}

grades_map = {
    '1º básico': '1_basico',
    '1º Básico': '1_basico',
    '2º básico': '2_basico',
    '2º Básico': '2_basico',
    '3º básico': '3_basico',
    '3º Básico': '3_basico',
    '4º básico': '4_basico',
    '4º Básico': '4_basico',
    '5º básico': '5_basico',
    '5º Básico': '5_basico',
    '6º básico': '6_basico',
    '6º Básico': '6_basico',
}

curriculum = {g: {s: [] for s in set(subjects_map.values())} for g in set(grades_map.values())}

for page in pages:
    if 'Objetivos de Aprendizaje' not in page:
        continue
        
    curr_subj = None
    for s_key, s_val in subjects_map.items():
        if s_key in page or s_key.upper() in page:
            curr_subj = s_val
            break
            
    curr_grade = None
    for g_key, g_val in grades_map.items():
        if g_key in page or g_key.lower() in page.lower():
            curr_grade = g_val
            break
            
    if not curr_subj or not curr_grade:
        continue
        
    lines = page.split('\n')
    current_oa = None
    oa_text = []
    
    for i, line in enumerate(lines):
        line = line.strip()
        if not line:
            continue
            
        match = re.match(r'^(\d+)\s*$', line)
        if not match:
            match = re.match(r'^(\d+)\s+(.+)$', line)
            
        if match:
            num = match.group(1)
            # Verify if num is a valid OA number (1 to 40)
            if int(num) > 40:
                continue
                
            if current_oa is not None:
                curriculum[curr_grade][curr_subj].append({
                    "id": f"OA {current_oa}",
                    "description": " ".join(oa_text).strip()
                })
            
            current_oa = num
            oa_text = []
            if len(match.groups()) > 1:
                oa_text.append(match.group(2))
        elif current_oa is not None:
            if line in ['Ejes', 'Objetivos de Aprendizaje', curr_grade, 'Habilidades', 'Los estudiantes serán capaces de:', '===']:
                pass
            elif line in subjects_map.keys() or line.lower() in [g.lower() for g in grades_map.keys()]:
                pass
            else:
                if line.startswith('•') or line.startswith('-') or line.startswith('ú') or line.startswith('a '):
                    # For bullet points
                    if line.startswith('ú '):
                        oa_text.append('\n- ' + line[2:].strip())
                    else:
                        oa_text.append('\n- ' + line[1:].strip())
                else:
                    oa_text.append(line)
                    
    if current_oa is not None:
        curriculum[curr_grade][curr_subj].append({
            "id": f"OA {current_oa}",
            "description": " ".join(oa_text).strip()
        })

for g in curriculum:
    for s in curriculum[g]:
        unique_oas = {}
        for oa in curriculum[g][s]:
            unique_oas[oa['id']] = oa
        curriculum[g][s] = list(unique_oas.values())
        
        for oa in curriculum[g][s]:
            desc = oa['description']
            desc = desc.replace(' \n', '\n').replace('\n ', '\n').replace('-  ', '- ')
            desc = re.sub(r'\s+\d+$', '', desc)
            oa['description'] = desc

with open('curriculum.json', 'r', encoding='utf-8') as f:
    existing_curriculum = json.load(f)

# Merge the new 1-6 grades into the existing curriculum
for g in curriculum:
    existing_curriculum[g] = curriculum[g]

with open('curriculum.json', 'w', encoding='utf-8') as f:
    json.dump(existing_curriculum, f, indent=2, ensure_ascii=False)

print("Parsed successfully and updated curriculum.json!")
