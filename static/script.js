document.addEventListener('DOMContentLoaded', () => {
    // Referencias del DOM
    const courseSelect = document.getElementById('course-select');
    const subjectSelect = document.getElementById('subject-select');
    const oaSelect = document.getElementById('oa-select');
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

        oaSelect.innerHTML = '<option value="" disabled>Selecciona una asignatura primero</option>';
        oaSelect.disabled = true;
        customOaGroup.style.display = 'none';
    });

    subjectSelect.addEventListener('change', () => {
        const course = courseSelect.value;
        const subject = subjectSelect.value;
        oaSelect.disabled = false;
        oaSelect.innerHTML = '<option value="" disabled>Selecciona uno o más Objetivos (OA)</option>';

        // Verificar si existen OAs en nuestra base de datos local
        const oasList = (curriculumData[course] && curriculumData[course][subject]) || [];

        oasList.forEach(oa => {
            const opt = document.createElement('option');
            opt.value = oa.id;
            opt.textContent = `${oa.id}: ${oa.description.substring(0, 60)}...`;
            // Guardar descripción en atributo de datos
            opt.dataset.desc = oa.description;
            oaSelect.appendChild(opt);
        });

        // Opción manual para OAs no cargados o asignaturas secundarias
        const customOpt = document.createElement('option');
        customOpt.value = 'custom';
        customOpt.textContent = '✏️ Ingresar OA personalizado manualmente...';
        oaSelect.appendChild(customOpt);
    });

    oaSelect.addEventListener('change', () => {
        const selectedValues = Array.from(oaSelect.selectedOptions).map(opt => opt.value);
        if (selectedValues.includes('custom')) {
            customOaGroup.style.display = 'block';
            customOaDesc.required = true;
            if(!customOaDesc.value) customOaDesc.focus();
        } else {
            customOaGroup.style.display = 'none';
            customOaDesc.required = false;
        }
    });

    // Envío del Formulario de Planificación
    planningForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // No se requiere API Key

        // Obtener datos
        const course = courseSelect.value;
        const subjectName = subjectSelect.options[subjectSelect.selectedIndex].textContent;
        const planType = planTypeSelect.value;
        
        const selectedOaOptions = Array.from(oaSelect.selectedOptions);
        if (selectedOaOptions.length === 0 || (selectedOaOptions.length === 1 && selectedOaOptions[0].value === '')) {
            alert('⚠️ Debes seleccionar al menos un Objetivo de Aprendizaje (OA).');
            return;
        }

        const oaId = selectedOaOptions.map(opt => opt.value === 'custom' ? 'OA Personalizado' : opt.value).join(', ');
        
        let oaDescriptions = [];
        selectedOaOptions.forEach(opt => {
            if (opt.value === 'custom') {
                oaDescriptions.push(customOaDesc.value);
            } else {
                oaDescriptions.push(opt.dataset.desc);
            }
        });
        const oaDescription = oaDescriptions.join('\\n--- \\n');
        
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

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    course: course,
                    subject: subjectName,
                    plan_type: planType,
                    oa_id: oaId,
                    oa_desc: oaDescription,
                    num_classes: numClasses,
                    additional_instructions: additionalInstructions
                })
            });

            // Limpiar timeouts por si la API es más rápida o falla antes
            stepTimeouts.forEach(clearTimeout);

            const result = await response.json();

            if (result.error) {
                if (result.fallback_query) {
                    const searchUrl = "https://www.google.com/search?q=" + encodeURIComponent(result.fallback_query);
                    loadingScreen.style.display = 'none';
                    welcomeScreen.style.display = 'flex';
                    
                    const existingError = welcomeScreen.querySelector('.api-error-msg');
                    if (existingError) existingError.remove();
                    
                    const errorContainer = document.createElement('div');
                    errorContainer.className = 'api-error-msg';
                    errorContainer.innerHTML = `
                        <div style="background-color: #fee2e2; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #f87171; text-align: left;">
                            <h4 style="color: #b91c1c; margin-top:0; display:flex; align-items:center; gap:8px;">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                                Problema con la Inteligencia Artificial
                            </h4>
                            <p style="color: #7f1d1d; font-size: 14px; margin-bottom: 15px;">Tu API Key ha sido bloqueada o tiene problemas de cuota. El sistema no pudo conectarse con Gemini.</p>
                            <p style="color: #7f1d1d; font-size: 14px; font-weight: 500;">💡 Solución alternativa: Buscar en Internet</p>
                            <p style="color: #7f1d1d; font-size: 13px;">Hemos preparado una búsqueda automática en Google con los parámetros exactos de tu planificación para que encuentres material listo.</p>
                            <a href="${searchUrl}" target="_blank" class="btn btn-primary" style="display: inline-flex; align-items: center; margin-top: 10px; background-color: #2563eb; color:white; text-decoration:none;">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:8px;"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                                Buscar esta planificación en Google
                            </a>
                            <details style="margin-top: 15px; cursor: pointer;">
                                <summary style="color: #b91c1c; font-size: 12px;">Ver detalles del error técnico</summary>
                                <p style="font-size: 11px; color: #991b1b; margin-top: 5px; font-family: monospace;">${result.error}</p>
                            </details>
                        </div>
                    `;
                    welcomeScreen.insertBefore(errorContainer, welcomeScreen.firstChild);
                    return;
                }
                throw new Error(result.error);
            }

            // Guardar markdown generado
            generatedMarkdown = result.plan_markdown;

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
        try {
            const response = await fetch('/api/curriculum');
            curriculumData = await response.json();
        } catch (error) {
            console.error('Error cargando base curricular:', error);
        }
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
