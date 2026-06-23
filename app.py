import os
import sys
import json
import webbrowser
import threading
import time
from flask import Flask, request, jsonify, send_from_directory
import google.generativeai as genai

def get_resource_path(relative_path):
    if hasattr(sys, '_MEIPASS'):
        return os.path.join(sys._MEIPASS, relative_path)
    return os.path.join(os.path.abspath("."), relative_path)

template_dir = get_resource_path('templates')
static_dir = get_resource_path('static')
app = Flask(__name__, static_folder=static_dir, template_folder=template_dir)

PORT = 5000

def get_config_path():
    home = os.path.expanduser('~')
    config_dir = os.path.join(home, '.planificacl')
    os.makedirs(config_dir, exist_ok=True)
    return os.path.join(config_dir, 'config.json')

CONFIG_FILE = get_config_path()
CURRICULUM_FILE = get_resource_path('curriculum.json')

def load_config():
    if os.path.exists(CONFIG_FILE):
        try:
            with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            return {}
    return {}

def save_config(config):
    with open(CONFIG_FILE, 'w', encoding='utf-8') as f:
        json.dump(config, f, indent=2, ensure_ascii=False)

def load_curriculum():
    if os.path.exists(CURRICULUM_FILE):
        try:
            with open(CURRICULUM_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error cargando currículum: {e}")
            return {}
    return {}

@app.route('/')
def index():
    return send_from_directory(app.template_folder, 'index.html')

@app.route('/api/curriculum', methods=['GET'])
def get_curriculum():
    return jsonify(load_curriculum())

@app.route('/api/config', methods=['GET', 'POST'])
def handle_config():
    if request.method == 'GET':
        config = load_config()
        # Ocultar parcialmente la API key por seguridad en la UI si se desea
        api_key = config.get('api_key', '')
        masked_key = api_key[:6] + '*' * (len(api_key) - 10) + api_key[-4:] if len(api_key) > 10 else api_key
        return jsonify({
            'has_key': bool(api_key),
            'masked_key': masked_key
        })
    elif request.method == 'POST':
        data = request.json or {}
        api_key = data.get('api_key', '').strip()
        if not api_key:
            return jsonify({'error': 'La API Key no puede estar vacía.'}), 400
        
        # Guardar configuración
        config = {'api_key': api_key}
        save_config(config)
        return jsonify({'success': True, 'message': 'Configuración guardada correctamente.'})

@app.route('/api/generate', methods=['POST'])
def generate_plan():
    config = load_config()
    api_key = config.get('api_key')
    if not api_key:
        return jsonify({'error': 'No se ha configurado la API Key de Gemini. Por favor configúrala primero.'}), 400

    data = request.json or {}
    course = data.get('course')
    subject = data.get('subject')
    plan_type = data.get('plan_type') # 'clase_a_clase', 'unidad', 'anual'
    oa_id = data.get('oa_id', 'OA Personalizado')
    oa_desc = data.get('oa_desc', '')
    num_classes = data.get('num_classes', 1)

    if not course or not subject or not plan_type or not oa_desc:
        return jsonify({'error': 'Faltan parámetros requeridos para generar la planificación.'}), 400

    # Configurar API de Gemini
    genai.configure(api_key=api_key)
    # Usando el modelo recomendado más rápido y potente para texto interactivo
    model = genai.GenerativeModel('gemini-1.5-flash')

    prompt = ""
    if plan_type == 'clase_a_clase':
        prompt = f"""
Actúa como un diseñador instruccional y evaluador docente experto en el sistema educativo de Chile (Marco para la Buena Enseñanza, Portafolio Docente).
Tu tarea es generar una planificación didáctica de NIVEL EXPERTO / DESTACADO para la asignatura de {subject} en {course.replace('_', ' ')}.

CURRÍCULUM:
- Objetivo de Aprendizaje (OA): {oa_id}: {oa_desc}
- Duración: Esta planificación debe distribuirse y detallarse en exactamente {num_classes} clases de 90 minutos cada una.

REQUISITOS PEDAGÓGICOS DEL PORTAFOLIO DOCENTE (Nivel Experto):
1. COHERENCIA CURRICULAR: Cada clase debe estar directamente alineada al OA. Las actividades y la evaluación deben medir exactamente el nivel taxonómico del OA.
2. SECUENCIA DIDÁCTICA DE CADA CLASE: Para cada una de las {num_classes} clases, detalla detalladamente:
   - Nombre de la Clase y Objetivo Específico.
   - INICIO (15 minutos): Activación de aprendizajes previos usando una estrategia interactiva, planteamiento de un Conflicto Cognitivo (pregunta desafiante de alta demanda), explicitación clara del objetivo de la sesión y los criterios de evaluación.
   - DESARROLLO (60 minutos): Modelamiento claro por parte del docente (paso a paso), Diálogo instruccional con al menos 3 preguntas de alta demanda cognitiva (meta-comprensión), andamiaje diferenciado, y actividad práctica activa (individual o colaborativa) de los estudiantes.
   - CIERRE (15 minutos): Metacognición guiada (preguntas reflexivas para los estudiantes), síntesis del aprendizaje formulada por los estudiantes, y una Evaluación Formativa explícita (ej. Ticket de Salida con sus respectivas preguntas).
3. DISEÑO UNIVERSAL PARA EL APRENDIZAJE (DUA): Describe detalladamente cómo se abordan en la planificación:
   - Principio 1 (Múltiples formas de Representación): Materiales visuales, auditivos y táctiles.
   - Principio 2 (Múltiples formas de Acción y Expresión): Opciones para que los alumnos demuestren lo aprendido.
   - Principio 3 (Múltiples formas de Compromiso): Opciones para motivar e involucrar a los estudiantes.
4. RECURSOS EDUCATIVOS: Crea una sección con los recursos necesarios (guías de trabajo detalladas, textos, presentaciones, enlaces a fichas interactivas estilo Twinkl).
5. INSTRUMENTO DE EVALUACIÓN: Diseña una rúbrica o escala de apreciación con criterios y niveles para evaluar el logro del OA al término de las sesiones.

Formatea tu respuesta de forma sumamente profesional usando Markdown estricto. Utiliza títulos, tablas para las actividades o rúbricas, y listas para facilitar la lectura. No uses explicaciones superfluas, ve directo al grano con contenido pedagógico real, creativo y original (las clases deben ser didácticas y entretenidas, no monótonas).
"""
    elif plan_type == 'unidad':
        prompt = f"""
Actúa como un diseñador instruccional y evaluador docente experto en Chile.
Genera una planificación de UNIDAD didáctica de NIVEL EXPERTO para la asignatura de {subject} en {course.replace('_', ' ')}.

CURRÍCULUM:
- Objetivo de Aprendizaje Principal (OA): {oa_id}: {oa_desc}
- Duración estimada: 4 a 6 semanas.

REQUISITOS PEDAGÓGICOS (Nivel Experto):
1. NOMBRE DE LA UNIDAD: Creativo y motivador.
2. PROPÓSITO DE LA UNIDAD: Justificación pedagógica de por qué es importante esta unidad y cómo conecta con la vida real del estudiante.
3. OBJETIVOS DE APRENDIZAJE TRANSVERSALES (OAT): Selecciona al menos 2 enfocados en lo socioafectivo y ético.
4. SECUENCIA TEMÁTICA DE CLASES: Un esquema o tabla que resuma de 4 a 6 clases clave de la unidad (indicando Objetivo de cada una, Concepto Clave y actividad general).
5. ESTRATEGIA DE EVALUACIÓN DE LA UNIDAD: Evaluación diagnóstica, formativa (procesual) y sumativa final (ej. Diseño de un proyecto ABP o evaluación escrita coherente con rúbrica).
6. ADECUACIONES CURRICULARES (DUA/PIE): Estrategias generales para la unidad.
7. RECURSOS Y MATERIALES DE APOYO: Listado detallado.

Formatea tu respuesta en Markdown profesional con tablas y listas.
"""
    else: # anual
        prompt = f"""
Actúa como un diseñador instruccional y evaluador docente experto en Chile.
Genera una planificación ANUAL de NIVEL EXPERTO para la asignatura de {subject} en {course.replace('_', ' ')}.

CURRÍCULUM:
- OA de referencia inicial: {oa_id}: {oa_desc} (Úsalo como punto de partida, pero incluye el diseño para todo el año).

REQUISITOS PEDAGÓGICOS (Nivel Experto):
1. PRESENTACIÓN Y ENFOQUE DE LA ASIGNATURA: Explicación de la didáctica de la asignatura según las bases curriculares.
2. DISTRIBUCIÓN DEL AÑO EN 4 UNIDADES (Semestres 1 y 2):
   - Detalla Nombre, Duración (en semanas), OAs prioritarios sugeridos para cada unidad, y Tipo de Evaluación Final de cada una.
3. ORIENTACIONES METODOLÓGICAS GENERALES: Enfoque de enseñanza activa, aprendizaje profundo y DUA.
4. PLAN DE EVALUACIÓN ANUAL: Descripción de cómo se aplicará el Decreto 67 en el aula (evaluación formativa y calificación).

Formatea tu respuesta en Markdown profesional con tablas estructuradas por unidades.
"""

    try:
        response = model.generate_content(prompt)
        return jsonify({
            'success': True,
            'plan_markdown': response.text
        })
    except Exception as e:
        return jsonify({'error': f"Error al generar la planificación con Gemini: {str(e)}"}), 500

@app.route('/api/save_plan', methods=['POST'])
def save_plan_locally():
    data = request.json or {}
    filename = data.get('filename', 'Planificacion.md')
    content = data.get('content', '')
    
    if not content:
        return jsonify({'error': 'El contenido está vacío.'}), 400

    # Asegurarnos de limpiar el nombre del archivo
    filename = "".join([c for c in filename if c.isalpha() or c.isdigit() or c in (' ', '.', '_', '-')]).strip()
    if not filename.endswith('.md') and not filename.endswith('.txt') and not filename.endswith('.html'):
        filename += '.md'
        
    try:
        export_dir = 'Planificaciones_Guardadas'
        os.makedirs(export_dir, exist_ok=True)
        filepath = os.path.join(export_dir, filename)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
            
        return jsonify({
            'success': True,
            'message': f'Planificación guardada con éxito en {filepath}',
            'filepath': os.path.abspath(filepath)
        })
    except Exception as e:
        return jsonify({'error': f'Error al guardar el archivo: {str(e)}'}), 500

def open_browser():
    # Esperar un momento a que el servidor Flask inicie
    time.sleep(1.5)
    webbrowser.open(f"http://127.0.0.1:{PORT}")

if __name__ == '__main__':
    # Lanzar el navegador en un hilo separado
    threading.Thread(target=open_browser, daemon=True).start()
    print(f"Iniciando servidor local en http://127.0.0.1:{PORT}...")
    app.run(port=PORT, debug=False)
