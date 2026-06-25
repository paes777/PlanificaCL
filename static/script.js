document.addEventListener('DOMContentLoaded', () => {
    // Referencias del DOM
    const courseSelect = document.getElementById('course-select');
    const subjectSelect = document.getElementById('subject-select');
    const oaSelect = document.getElementById('oa-select');
    const oaContainer = document.getElementById('oa-checkbox-container');
    const customOaGroup = document.getElementById('custom-oa-group');
    const customOaDesc = document.getElementById('custom-oa-desc');
    const planTypeSelect = document.getElementById('plan-type-select');
    const classesCountGroup = document.getElementById('classes-count-group');
    const classesCountInput = document.getElementById('classes-count');
    const counterDec = document.getElementById('counter-dec');
    const counterInc = document.getElementById('counter-inc');
    const planningForm = document.getElementById('planning-form');
    
    // Screens
    const welcomeScreen = document.getElementById('welcome-screen');
    const loadingScreen = document.getElementById('loading-screen');
    const documentViewer = document.getElementById('document-viewer');
    const documentPaper = document.getElementById('document-paper');
    const documentBadge = document.getElementById('document-badge');
    const loadingTitle = document.getElementById('loading-title');
    const loadingDesc = document.getElementById('loading-desc');
    
    // Modales y Configuración (Eliminado)
    
    // Botones de acción del documento
    const copyBtn = document.getElementById('copy-btn');
    const saveLocalBtn = document.getElementById('save-local-btn');
    const printBtn = document.getElementById('print-btn');
    
    // Estado de la aplicación
    let curriculumData = {};
    let generatedMarkdown = '';
    // Inicialización: Cargar currículum
    loadCurriculumData();

    // Control del contador de clases
    counterDec.addEventListener('click', () => {
        let val = parseInt(classesCountInput.value);
        if (val > 1) classesCountInput.value = val - 1;
    });

    counterInc.addEventListener('click', () => {
        let val = parseInt(classesCountInput.value);
        if (val < 10) classesCountInput.value = val + 1;
    });

    // Control de visibilidad del contador de clases según tipo de plan
    planTypeSelect.addEventListener('change', () => {
        if (planTypeSelect.value === 'clase_a_clase') {
            classesCountGroup.style.display = 'block';
        } else {
            classesCountGroup.style.display = 'none';
        }
    });

    // Dinámica del Currículum Nacional
    courseSelect.addEventListener('change', () => {
        const selectedCourse = courseSelect.value;
        subjectSelect.disabled = false;
        subjectSelect.innerHTML = '<option value="" disabled selected>Selecciona una asignatura</option>';
        
        // Agregar asignaturas comunes
        const subjects = [
            { val: 'lenguaje', name: 'Lenguaje y Comunicación' },
            { val: 'matematica', name: 'Matemática' },
            { val: 'ciencias', name: 'Ciencias Naturales' },
            { val: 'historia', name: 'Historia, Geografía y Ciencias Sociales' },
            { val: 'ingles', name: 'Idioma Extranjero: Inglés' },
            { val: 'artes', name: 'Artes Visuales' },
            { val: 'musica', name: 'Música' },
            { val: 'tecnologia', name: 'Tecnología' },
            { val: 'educacion_fisica', name: 'Educación Física y Salud' },
            { val: 'orientacion', name: 'Orientación' },
            { val: 'mapudungun', name: 'Mapudungun' }
        ];

        subjects.forEach(sub => {
            const opt = document.createElement('option');
            opt.value = sub.val;
            opt.textContent = sub.name;
            subjectSelect.appendChild(opt);
        });

        oaSelect.innerHTML = '';
        oaContainer.innerHTML = '<p class="oa-placeholder">Selecciona una asignatura primero</p>';
        customOaGroup.style.display = 'none';
    });

    subjectSelect.addEventListener('change', () => {
        const course = courseSelect.value;
        const subject = subjectSelect.value;
        oaSelect.innerHTML = '';
        oaContainer.innerHTML = '';

        // Verificar si existen OAs en nuestra base de datos local
        const oasList = (curriculumData[course] && curriculumData[course][subject]) || [];

        oasList.forEach(oa => {
            // Create checkbox item
            const item = document.createElement('label');
            item.className = 'oa-checkbox-item';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = oa.id;
            checkbox.dataset.desc = oa.description;
            
            const label = document.createElement('span');
            label.className = 'oa-label';
            label.innerHTML = `<span class="oa-id">${oa.id}:</span> ${oa.description}`;
            
            checkbox.addEventListener('change', () => {
                item.classList.toggle('selected', checkbox.checked);
                syncHiddenSelect();
            });
            
            item.appendChild(checkbox);
            item.appendChild(label);
            oaContainer.appendChild(item);

            // Also populate hidden select for compatibility
            const opt = document.createElement('option');
            opt.value = oa.id;
            opt.textContent = `${oa.id}: ${oa.description.substring(0, 60)}...`;
            opt.dataset.desc = oa.description;
            oaSelect.appendChild(opt);
        });

        // Mostrar siempre el grupo de OA personalizado de forma opcional
        customOaGroup.style.display = 'block';
        customOaDesc.required = false;
    });

    // Sync hidden select from checkboxes
    function syncHiddenSelect() {
        const checkboxes = oaContainer.querySelectorAll('input[type="checkbox"]:checked');
        Array.from(oaSelect.options).forEach(opt => opt.selected = false);
        checkboxes.forEach(cb => {
            const opt = oaSelect.querySelector(`option[value="${cb.value}"]`);
            if (opt) opt.selected = true;
        });
    }

    // Envío del Formulario de Planificación
    planningForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // No se requiere API Key

        // Obtener datos
        const course = courseSelect.value;
        const subjectName = subjectSelect.options[subjectSelect.selectedIndex].textContent;
        const planType = planTypeSelect.value;
        
        // Leer OAs seleccionados desde los checkboxes y el campo personalizado
        const checkedBoxes = oaContainer.querySelectorAll('input[type="checkbox"]:checked');
        const customOaValue = customOaDesc.value.trim();
        
        if (checkedBoxes.length === 0 && customOaValue.length === 0) {
            alert('⚠️ Debes seleccionar al menos un Objetivo de Aprendizaje (OA) de la lista o ingresar uno en el campo personalizado.');
            return;
        }

        const oaIds = [];
        let oaDescriptions = [];
        
        checkedBoxes.forEach(cb => {
            oaIds.push(cb.value);
            oaDescriptions.push(cb.dataset.desc);
        });

        if (customOaValue.length > 0) {
            oaIds.push('OA Personalizado / Adicional');
            oaDescriptions.push(customOaValue);
        }
        
        const oaId = oaIds.join(', ');
        const oaDescription = oaDescriptions.join('\n--- \n');
        
        const numClasses = parseInt(classesCountInput.value);
        const additionalInstructions = document.getElementById('additional-instructions').value;

        // UI de carga
        welcomeScreen.style.display = 'none';
        documentViewer.style.display = 'none';
        loadingScreen.style.display = 'flex';
        resetLoadingSteps();

        // Efectos dinámicos de texto en la carga
        const stepTimeouts = [];
        const steps = ['step-1', 'step-2', 'step-3', 'step-4'];
        
        loadingTitle.textContent = "Planificando a Nivel Experto...";
        loadingDesc.textContent = "Alineando con el Marco para la Buena Enseñanza chileno...";

        steps.forEach((stepId, index) => {
            const t = setTimeout(() => {
                const prevEl = document.getElementById(steps[index - 1]);
                if (prevEl) {
                    prevEl.classList.remove('active');
                    prevEl.classList.add('completed');
                }
                const curEl = document.getElementById(stepId);
                if (curEl) {
                    curEl.classList.add('active');
                }
                if (index === 1) loadingDesc.textContent = "Estructurando momentos de inicio, desarrollo y cierre...";
                if (index === 2) loadingDesc.textContent = "Añadiendo adecuaciones DUA (Decreto 83) de representación y expresión...";
                if (index === 3) loadingDesc.textContent = "Construyendo tickets de salida y rúbricas formativas...";
            }, (index + 1) * 3500);
            stepTimeouts.push(t);
        });

        let prompt = "";
        let instrucciones_extra = additionalInstructions ? `\nINSTRUCCIONES ADICIONALES DEL DOCENTE:\n${additionalInstructions}\n(Asegúrate de incorporar estas especificaciones en tu propuesta.)\n` : "";
        
        if (planType === 'clase_a_clase') {
            prompt = `Actúa como un diseñador instruccional y evaluador docente experto en el sistema educativo de Chile (Marco para la Buena Enseñanza, Portafolio Docente).
Tu tarea es generar una planificación didáctica de NIVEL EXPERTO / DESTACADO para la asignatura de ${subjectName} en ${course.replace('_', ' ')}.

CURRÍCULUM:
- Objetivo de Aprendizaje (OA): ${oaId}: ${oaDescription}
- Duración: Esta planificación debe distribuirse y detallarse en exactamente ${numClasses} clases de 90 minutos cada una.
${instrucciones_extra}
REQUISITOS PEDAGÓGICOS DEL PORTAFOLIO DOCENTE (Nivel Experto):
1. COHERENCIA CURRICULAR: Cada clase debe estar directamente alineada al OA. Las actividades y la evaluación deben medir exactamente el nivel taxonómico del OA.
2. SECUENCIA DIDÁCTICA DE CADA CLASE: Para cada una de las ${numClasses} clases, detalla detalladamente:
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

Formatea tu respuesta de forma sumamente profesional usando Markdown estricto. Utiliza títulos, tablas para las actividades o rúbricas, y listas para facilitar la lectura. No uses explicaciones superfluas, ve directo al grano con contenido pedagógico real, creativo y original (las clases deben ser didácticas y entretenidas, no monótonas).`;
        } else if (planType === 'unidad') {
            prompt = `Actúa como un diseñador instruccional y evaluador docente experto en Chile.
Genera una planificación de UNIDAD didáctica de NIVEL EXPERTO para la asignatura de ${subjectName} en ${course.replace('_', ' ')}.

CURRÍCULUM:
- Objetivo de Aprendizaje Principal (OA): ${oaId}: ${oaDescription}
- Duración estimada: 4 a 6 semanas.
${instrucciones_extra}
REQUISITOS PEDAGÓGICOS (Nivel Experto):
1. NOMBRE DE LA UNIDAD: Creativo y motivador.
2. PROPÓSITO DE LA UNIDAD: Justificación pedagógica de por qué es importante esta unidad y cómo conecta con la vida real del estudiante.
3. OBJETIVOS DE APRENDIZAJE TRANSVERSALES (OAT): Selecciona al menos 2 enfocados en lo socioafectivo y ético.
4. SECUENCIA TEMÁTICA DE CLASES: Un esquema o tabla que resuma de 4 a 6 clases clave de la unidad (indicando Objetivo de cada una, Concepto Clave y actividad general).
5. ESTRATEGIA DE EVALUACIÓN DE LA UNIDAD: Evaluación diagnóstica, formativa (procesual) y sumativa final (ej. Diseño de un proyecto ABP o evaluación escrita coherente con rúbrica).
6. ADECUACIONES CURRICULARES (DUA/PIE): Estrategias generales para la unidad.
7. RECURSOS Y MATERIALES DE APOYO: Listado detallado.

Formatea tu respuesta en Markdown profesional con tablas y listas.`;
        } else if (planType === 'evaluacion') {
            prompt = `Actúa como un diseñador instruccional y evaluador docente experto en el sistema educativo de Chile, especialista en el Decreto 67 de evaluación formativa y sumativa.
Tu tarea es generar un INSTRUMENTO DE EVALUACIÓN de NIVEL EXPERTO para la asignatura de ${subjectName} en ${course.replace('_', ' ')}.

CURRÍCULUM:
- Objetivos de Aprendizaje (OA) evaluados: ${oaId}:
${oaDescription}
${instrucciones_extra}
REQUISITOS PEDAGÓGICOS DEL PORTAFOLIO DOCENTE (Nivel Experto):
1. TABLA DE ESPECIFICACIONES: Diseña una tabla que relacione los OA con indicadores de evaluación y la taxonomía de Bloom o Anderson (Habilidades cognitivas).
2. DISEÑO DEL INSTRUMENTO: Crea la evaluación completa. Si es una prueba escrita, incluye ítems de selección múltiple, de desarrollo y de aplicación (mínimo 5 preguntas de alta demanda cognitiva). Si es un proyecto/desempeño, describe las instrucciones claras para el estudiante.
3. RÚBRICA DE EVALUACIÓN: Crea una rúbrica analítica muy detallada con 4 niveles de desempeño (Excelente, Bueno, Suficiente, Insuficiente) y descriptores claros para evaluar el instrumento o proyecto.
4. RETROALIMENTACIÓN (Decreto 67): Sugiere 3 estrategias concretas para retroalimentar a los estudiantes a partir de los resultados de esta evaluación.

Formatea tu respuesta de forma sumamente profesional usando Markdown estricto. Utiliza títulos, tablas y listas para facilitar la lectura. No uses explicaciones superfluas, ve directo al contenido pedagógico.`;
        } else {
            prompt = `Actúa como un diseñador instruccional y evaluador docente experto en Chile.
Genera una planificación ANUAL de NIVEL EXPERTO para la asignatura de ${subjectName} en ${course.replace('_', ' ')}.

CURRÍCULUM:
- OA de referencia inicial: ${oaId}: ${oaDescription} (Úsalo como punto de partida, pero incluye el diseño para todo el año).
${instrucciones_extra}
REQUISITOS PEDAGÓGICOS (Nivel Experto):
1. PRESENTACIÓN Y ENFOQUE DE LA ASIGNATURA: Explicación de la didáctica de la asignatura según las bases curriculares.
2. DISTRIBUCIÓN DEL AÑO EN 4 UNIDADES (Semestres 1 y 2):
   - Detalla Nombre, Duración (en semanas), OAs prioritarios sugeridos para cada unidad, y Tipo de Evaluación Final de cada una.
3. ORIENTACIONES METODOLÓGICAS GENERALES: Enfoque de enseñanza activa, aprendizaje profundo y DUA.
4. PLAN DE EVALUACIÓN ANUAL: Descripción de cómo se aplicará el Decreto 67 en el aula (evaluación formativa y calificación).

Formatea tu respuesta en Markdown profesional con tablas estructuradas por unidades.`;
        }

        // Inyectar semilla de aleatoriedad para garantizar originalidad del diseño y evitar respuestas repetidas
        const randomSalt = Math.random().toString(36).substring(2, 10);
        prompt += `\n\n[Semilla de variación única: ${randomSalt} - Genera un diseño pedagógico original y diferente a versiones previas.]`;

        try {
        // Lista de modelos a intentar en orden
        const modelsToTry = ['openai', 'mistral', 'command-r-plus'];
        let resultText = null;
        let lastError = null;

        for (const model of modelsToTry) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 min timeout

                const randomSeedValue = Math.floor(Math.random() * 1000000000);
                const response = await fetch('https://text.pollinations.ai/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        messages: [{role: "user", content: prompt}],
                        model: model,
                        seed: randomSeedValue,
                        temperature: 0.85
                    }),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    lastError = `Modelo ${model}: Error ${response.status}`;
                    continue; // Intentar siguiente modelo
                }

                resultText = await response.text();
                if (resultText && resultText.trim().length > 50) {
                    break; // Éxito, salir del loop
                } else {
                    lastError = `Modelo ${model}: Respuesta vacía o muy corta`;
                    resultText = null;
                    continue;
                }
            } catch (e) {
                lastError = e.name === 'AbortError' 
                    ? `Modelo ${model}: Tiempo de espera agotado (2 min)` 
                    : `Modelo ${model}: ${e.message}`;
                continue;
            }
        }

        // Limpiar timeouts de la animación de carga
        stepTimeouts.forEach(clearTimeout);

        if (!resultText) {
            throw new Error(`No se pudo conectar con la IA después de ${modelsToTry.length} intentos. Último error: ${lastError}. Por favor intenta de nuevo en unos segundos.`);
        }

        generatedMarkdown = resultText;

            // Renderizar Markdown a HTML en el papel
            documentPaper.innerHTML = marked.parse(generatedMarkdown);
            
            // Actualizar etiqueta del visor
            let typeLabel = 'Plan Clase a Clase';
            if (planType === 'unidad') typeLabel = 'Planificación por Unidad';
            if (planType === 'anual') typeLabel = 'Planificación Anual';
            if (planType === 'evaluacion') typeLabel = 'Evaluación y Rúbrica';
            
            documentBadge.textContent = typeLabel;

            // Mostrar el visor de documentos
            loadingScreen.style.display = 'none';
            documentViewer.style.display = 'flex';
            documentViewer.scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            console.error(error);
            alert(`Error al generar la planificación: ${error.message}`);
            loadingScreen.style.display = 'none';
            welcomeScreen.style.display = 'flex';
        }
    });

    // Acciones del Documento
    copyBtn.addEventListener('click', () => {
        if (!generatedMarkdown) return;
        navigator.clipboard.writeText(generatedMarkdown).then(() => {
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                ¡Copiado!
            `;
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
            }, 2000);
        }).catch(err => {
            alert('No se pudo copiar el texto: ' + err);
        });
    });

    saveLocalBtn.addEventListener('click', async () => {
        if (!generatedMarkdown) return;
        
        const course = courseSelect.value;
        const subject = subjectSelect.value;
        const planType = planTypeSelect.value;
        const defaultFilename = `Planificacion_${subject}_${course}_${planType}.md`;
        
        const filename = prompt('Ingresa el nombre del archivo para guardar localmente:', defaultFilename);
        if (!filename) return; // Cancelado

        try {
            const response = await fetch('/api/save_plan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    filename: filename,
                    content: generatedMarkdown
                })
            });

            const result = await response.json();
            if (result.error) throw new Error(result.error);

            alert(result.message);
        } catch (error) {
            alert('Error al guardar el archivo: ' + error.message);
        }
    });

    printBtn.addEventListener('click', () => {
        window.print();
    });

    // Funciones Auxiliares
    async function loadCurriculumData() {
        // Intentar cargar curriculum.json (funciona en GitHub Pages y localmente)
        const urls = ['curriculum.json', '/api/curriculum'];
        for (const url of urls) {
            try {
                const response = await fetch(url);
                if (response.ok) {
                    const contentType = response.headers.get('content-type') || '';
                    if (contentType.includes('json') || url.endsWith('.json')) {
                        const data = await response.json();
                        if (data && Object.keys(data).length > 0) {
                            curriculumData = data;
                            console.log('Currículum cargado desde:', url, '- Cursos:', Object.keys(data).length);
                            return;
                        }
                    }
                }
            } catch (e) {
                console.warn('No se pudo cargar desde', url, ':', e.message);
            }
        }
        console.error('ERROR: No se pudo cargar la base curricular desde ninguna fuente.');
    }

    function resetLoadingSteps() {
        const steps = ['step-1', 'step-2', 'step-3', 'step-4'];
        steps.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.className = 'step-line';
            }
        });
        document.getElementById('step-1').classList.add('active');
    }
});
