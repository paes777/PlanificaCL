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
    
    // Modales y Configuración
    const statusBadge = document.getElementById('status-badge');
    const openConfigBtn = document.getElementById('open-config-btn');
    const configModal = document.getElementById('config-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const cancelModalBtn = document.getElementById('cancel-modal-btn');
    const saveKeyBtn = document.getElementById('save-key-btn');
    const apiKeyInput = document.getElementById('api-key-input');
    const modalFeedback = document.getElementById('modal-feedback');
    const connectionCard = document.getElementById('connection-card');
    const detectKeyBtn = document.getElementById('detect-key-btn');
    
    // Botones de acción del documento
    const copyBtn = document.getElementById('copy-btn');
    const saveLocalBtn = document.getElementById('save-local-btn');
    const printBtn = document.getElementById('print-btn');
    
    // Estado de la aplicación
    let curriculumData = {};
    let generatedMarkdown = '';
    let hasApiKey = false;

    // Inicialización: Cargar configuración y currículum
    checkApiConnection();
    loadCurriculumData();

    // Eventos de Conexión y Modal
    openConfigBtn.addEventListener('click', openModal);
    connectionCard.addEventListener('click', (e) => {
        if (e.target.id !== 'open-config-btn') openModal();
    });
    closeModalBtn.addEventListener('click', closeModal);
    cancelModalBtn.addEventListener('click', closeModal);
    saveKeyBtn.addEventListener('click', saveApiKey);
    detectKeyBtn.addEventListener('click', detectAndSaveKey);
    
    // Cerrar modal al hacer clic fuera del contenido
    window.addEventListener('click', (e) => {
        if (e.target === configModal) closeModal();
    });

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
            { val: 'mapudungun', name: 'Mapudungun' }
        ];

        subjects.forEach(sub => {
            const opt = document.createElement('option');
            opt.value = sub.val;
            opt.textContent = sub.name;
            subjectSelect.appendChild(opt);
        });

        oaSelect.innerHTML = '<option value="" disabled selected>Selecciona una asignatura primero</option>';
        oaSelect.disabled = true;
        customOaGroup.style.display = 'none';
    });

    subjectSelect.addEventListener('change', () => {
        const course = courseSelect.value;
        const subject = subjectSelect.value;
        oaSelect.disabled = false;
        oaSelect.innerHTML = '<option value="" disabled selected>Selecciona un Objetivo (OA)</option>';

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
        if (oaSelect.value === 'custom') {
            customOaGroup.style.display = 'block';
            customOaDesc.value = '';
            customOaDesc.required = true;
            customOaDesc.focus();
        } else {
            customOaGroup.style.display = 'none';
            customOaDesc.required = false;
            // Cargar la descripción del OA seleccionado
            const selectedOpt = oaSelect.options[oaSelect.selectedIndex];
            customOaDesc.value = selectedOpt.dataset.desc || '';
        }
    });

    // Envío del Formulario de Planificación
    planningForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!hasApiKey) {
            alert('Por favor, configura tu API Key de Gemini primero para poder conectar con la Inteligencia Artificial.');
            openModal();
            return;
        }

        // Obtener datos
        const course = courseSelect.value;
        const subjectName = subjectSelect.options[subjectSelect.selectedIndex].textContent;
        const planType = planTypeSelect.value;
        const oaId = oaSelect.value === 'custom' ? 'OA Personalizado' : oaSelect.value;
        const oaDescription = customOaDesc.value;
        const numClasses = parseInt(classesCountInput.value);

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
                    num_classes: numClasses
                })
            });

            // Limpiar timeouts por si la API es más rápida o falla antes
            stepTimeouts.forEach(clearTimeout);

            const result = await response.json();

            if (result.error) {
                throw new Error(result.error);
            }

            // Guardar markdown generado
            generatedMarkdown = result.plan_markdown;

            // Renderizar Markdown a HTML en el papel
            documentPaper.innerHTML = marked.parse(generatedMarkdown);
            
            // Actualizar etiqueta del visor
            const typeLabel = planType === 'clase_a_clase' ? 'Plan Clase a Clase' :
                              planType === 'unidad' ? 'Planificación por Unidad' : 'Planificación Anual';
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

    // Funciones Auxiliares de Carga y Conexión
    async function checkApiConnection() {
        try {
            const response = await fetch('/api/config');
            const data = await response.json();
            
            if (data.has_key) {
                statusBadge.className = 'status-indicator connected';
                statusBadge.querySelector('.status-text').textContent = 'Sesión Iniciada';
                hasApiKey = true;
            } else {
                statusBadge.className = 'status-indicator disconnected';
                statusBadge.querySelector('.status-text').textContent = 'Sin iniciar sesión';
                hasApiKey = false;
            }
        } catch (error) {
            console.error('Error verificando conexión API:', error);
        }
    }

    async function detectAndSaveKey() {
        try {
            // Solicitar permisos del portapapeles y leer
            const text = await navigator.clipboard.readText();
            const cleanKey = text.trim();
            if (cleanKey.startsWith("AIzaSy")) {
                apiKeyInput.value = cleanKey;
                showModalFeedback('⚡ ¡Clave detectada en el portapapeles! Conectando...', 'success');
                setTimeout(() => {
                    saveApiKey();
                }, 800);
            } else {
                showModalFeedback('No se detectó una API Key de Gemini válida en tu portapapeles. Asegúrate de iniciar sesión en Google AI Studio (Paso 1) y presionar "Copy".', 'error');
            }
        } catch (err) {
            console.error("No se pudo leer el portapapeles: ", err);
            showModalFeedback('El navegador bloqueó la lectura automática. Por favor, pega la clave (Ctrl+V) manualmente en la casilla de abajo y presiona Conectar.', 'error');
        }
    }

    async function loadCurriculumData() {
        try {
            const response = await fetch('/api/curriculum');
            curriculumData = await response.json();
        } catch (error) {
            console.error('Error cargando base curricular:', error);
        }
    }

    function openModal() {
        configModal.style.display = 'flex';
        apiKeyInput.value = '';
        modalFeedback.style.display = 'none';
        apiKeyInput.focus();
    }

    function closeModal() {
        configModal.style.display = 'none';
    }

    async function saveApiKey() {
        const key = apiKeyInput.value.trim();
        if (!key) {
            showModalFeedback('La API Key no puede estar vacía.', 'error');
            return;
        }

        try {
            const response = await fetch('/api/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ api_key: key })
            });

            const result = await response.json();

            if (result.error) {
                showModalFeedback(result.error, 'error');
            } else {
                showModalFeedback('¡Clave guardada con éxito!', 'success');
                setTimeout(() => {
                    closeModal();
                    checkApiConnection();
                }, 1000);
            }
        } catch (error) {
            showModalFeedback('Error al comunicarse con el servidor.', 'error');
        }
    }

    function showModalFeedback(msg, type) {
        modalFeedback.textContent = msg;
        modalFeedback.className = `feedback-msg ${type}`;
        modalFeedback.style.display = 'block';
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
