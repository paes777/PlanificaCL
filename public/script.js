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
    
    // Modales y Conexión
    const statusBadge = document.getElementById('status-badge');
    const connectionDesc = document.getElementById('connection-desc');
    const googleLoginBtn = document.getElementById('google-login-btn');
    const configModal = document.getElementById('config-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const cancelModalBtn = document.getElementById('cancel-modal-btn');
    const saveKeyBtn = document.getElementById('save-key-btn');
    const detectKeyBtn = document.getElementById('detect-key-btn');
    const apiKeyInput = document.getElementById('api-key-input');
    const modalFeedback = document.getElementById('modal-feedback');
    const connectionCard = document.getElementById('connection-card');
    
    // Botones de acción del documento
    const copyBtn = document.getElementById('copy-btn');
    const saveLocalBtn = document.getElementById('save-local-btn');
    const printBtn = document.getElementById('print-btn');
    
    // Estado de la aplicación
    let curriculumData = {};
    let generatedMarkdown = '';
    let hasApiKey = false;
    let geminiApiKey = '';
    let currentUser = null;

    // Inicializar Firebase
    let db = null;
    let auth = null;

    if (typeof firebase !== 'undefined') {
        try {
            db = firebase.firestore();
            auth = firebase.auth();
            setupFirebaseListeners();
        } catch (e) {
            console.error("Error al inicializar los servicios de Firebase:", e);
            statusBadge.className = 'status-indicator disconnected';
            statusBadge.querySelector('.status-text').textContent = 'Error Firebase';
        }
    } else {
        console.warn("Firebase SDK no cargado. Funcionando en modo local desconectado.");
        statusBadge.className = 'status-indicator disconnected';
        statusBadge.querySelector('.status-text').textContent = 'Sin Firebase';
    }

    // Cargar base curricular
    loadCurriculumData();

    // Eventos de Conexión y Modal
    googleLoginBtn.addEventListener('click', handleGoogleAuthAction);
    closeModalBtn.addEventListener('click', closeModal);
    cancelModalBtn.addEventListener('click', closeModal);
    saveKeyBtn.addEventListener('click', saveApiKeyManual);
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

        const oasList = (curriculumData[course] && curriculumData[course][subject]) || [];

        oasList.forEach(oa => {
            const opt = document.createElement('option');
            opt.value = oa.id;
            opt.textContent = `${oa.id}: ${oa.description.substring(0, 60)}...`;
            opt.dataset.desc = oa.description;
            oaSelect.appendChild(opt);
        });

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
            const selectedOpt = oaSelect.options[oaSelect.selectedIndex];
            customOaDesc.value = selectedOpt.dataset.desc || '';
        }
    });

    // Envío del Formulario de Planificación
    planningForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!currentUser) {
            alert('Por favor, inicia sesión con tu cuenta de Google/Gmail primero.');
            openModal();
            return;
        }

        if (!hasApiKey) {
            alert('No tienes configurada tu API Key de Gemini. Inicia sesión con tu cuenta y configura tu clave de Gemini.');
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
            // Construir el prompt estructurado para Gemini
            const prompt = generateGeminiPrompt(subjectName, course, planType, oaId, oaDescription, numClasses);
            
            // Llamar directamente a la API de Gemini desde el navegador
            const responseText = await callGeminiAPI(prompt);

            // Limpiar timeouts
            stepTimeouts.forEach(clearTimeout);

            generatedMarkdown = responseText;

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

    saveLocalBtn.addEventListener('click', () => {
        if (!generatedMarkdown) return;
        
        const course = courseSelect.value;
        const subject = subjectSelect.value;
        const planType = planTypeSelect.value;
        const defaultFilename = `Planificacion_${subject}_${course}_${planType}.md`;
        
        const filename = prompt('Ingresa el nombre del archivo para guardar localmente:', defaultFilename);
        if (!filename) return; // Cancelado

        // Descargar localmente mediante blob del navegador (sin backend)
        const blob = new Blob([generatedMarkdown], { type: 'text/markdown;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    printBtn.addEventListener('click', () => {
        window.print();
    });

    // INTEGRACIÓN CON FIREBASE AUTH Y FIRESTORE
    function setupFirebaseListeners() {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                currentUser = user;
                statusBadge.className = 'status-indicator connected';
                statusBadge.querySelector('.status-text').textContent = 'Conectado';
                connectionDesc.innerHTML = `Sesión iniciada como:<br><strong>${user.email}</strong>`;
                googleLoginBtn.innerHTML = 'Cerrar Sesión';
                
                // Obtener API Key de Firestore
                await fetchApiKeyFromFirestore(user.uid);
            } else {
                currentUser = null;
                hasApiKey = false;
                geminiApiKey = '';
                statusBadge.className = 'status-indicator disconnected';
                statusBadge.querySelector('.status-text').textContent = 'Sin iniciar sesión';
                connectionDesc.textContent = 'Inicia sesión con tu cuenta de Google (Gmail) para conectar PlanificaCL con la IA de Gemini.';
                googleLoginBtn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" style="margin-right: 6px;"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/></svg>
                    Iniciar Sesión con Google
                `;
            }
        });
    }

    async function handleGoogleAuthAction() {
        if (!auth) {
            alert("El servicio de autenticación de Firebase no está disponible en este momento.");
            return;
        }

        if (currentUser) {
            // Cerrar sesión
            try {
                await auth.signOut();
                alert("Has cerrado sesión correctamente.");
            } catch (error) {
                console.error("Error al cerrar sesión:", error);
            }
        } else {
            // Iniciar sesión con Popup
            const provider = new firebase.auth.GoogleAuthProvider();
            try {
                await auth.signInWithPopup(provider);
            } catch (error) {
                console.error("Error al iniciar sesión con Google:", error);
                alert("Error al iniciar sesión: " + error.message);
            }
        }
    }

    async function fetchApiKeyFromFirestore(uid) {
        if (!db) return;
        try {
            const doc = await db.collection("users").doc(uid).get();
            if (doc.exists && doc.data().api_key) {
                geminiApiKey = doc.data().api_key;
                hasApiKey = true;
                statusBadge.className = 'status-indicator connected';
                statusBadge.querySelector('.status-text').textContent = 'Conectado a Gemini';
            } else {
                hasApiKey = false;
                geminiApiKey = '';
                // Abrir modal de configuración si no tiene clave
                openModal();
            }
        } catch (error) {
            console.error("Error al leer la clave de Firestore:", error);
        }
    }

    async function saveApiKeyToFirestore(key) {
        if (!db || !currentUser) return;
        try {
            await db.collection("users").doc(currentUser.uid).set({
                api_key: key,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
            
            geminiApiKey = key;
            hasApiKey = true;
            statusBadge.className = 'status-indicator connected';
            statusBadge.querySelector('.status-text').textContent = 'Conectado a Gemini';
            return true;
        } catch (error) {
            console.error("Error al guardar clave en Firestore:", error);
            throw error;
        }
    }

    // Funciones de Modal
    function openModal() {
        if (!currentUser) {
            alert("Primero debes iniciar sesión con tu cuenta de Google.");
            handleGoogleAuthAction();
            return;
        }
        configModal.style.display = 'flex';
        apiKeyInput.value = '';
        modalFeedback.style.display = 'none';
        apiKeyInput.focus();
    }

    function closeModal() {
        configModal.style.display = 'none';
    }

    async function saveApiKeyManual() {
        const key = apiKeyInput.value.trim();
        if (!key) {
            showModalFeedback('La API Key no puede estar vacía.', 'error');
            return;
        }

        try {
            await saveApiKeyToFirestore(key);
            showModalFeedback('¡Clave guardada con éxito!', 'success');
            setTimeout(() => {
                closeModal();
            }, 1000);
        } catch (error) {
            showModalFeedback('Error al guardar en Firestore: ' + error.message, 'error');
        }
    }

    async function detectAndSaveKey() {
        try {
            const text = await navigator.clipboard.readText();
            const cleanKey = text.trim();
            if (cleanKey.startsWith("AIzaSy")) {
                apiKeyInput.value = cleanKey;
                showModalFeedback('⚡ ¡Clave detectada en el portapapeles! Conectando...', 'success');
                await saveApiKeyToFirestore(cleanKey);
                setTimeout(() => {
                    closeModal();
                }, 1000);
            } else {
                showModalFeedback('No se detectó una API Key de Gemini válida en tu portapapeles. Copia primero la clave en Google AI Studio (Paso 1).', 'error');
            }
        } catch (err) {
            console.error("No se pudo leer el portapapeles: ", err);
            showModalFeedback('Lectura del portapapeles bloqueada por el navegador. Por favor pega la clave manualmente.', 'error');
        }
    }

    // LLAMADAS DIRECTAS A LA API DE GEMINI (Client Side)
    async function callGeminiAPI(promptText) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: promptText
                    }]
                }]
            })
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error((errData.error && errData.error.message) || 'Error de red en la llamada de Gemini.');
        }

        const data = await response.json();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
            return data.candidates[0].content.parts[0].text;
        } else {
            throw new Error('La respuesta de Gemini no contiene contenido válido.');
        }
    }

    // Auxiliares
    async function loadCurriculumData() {
        try {
            const response = await fetch('curriculum.json');
            curriculumData = await response.json();
        } catch (error) {
            console.error('Error cargando base curricular:', error);
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

    function generateGeminiPrompt(subject, course, planType, oaId, oaDesc, numClasses) {
        if (planType === 'clase_a_clase') {
            return `
Actúa como un diseñador instruccional y evaluador docente experto en el sistema educativo de Chile (Marco para la Buena Enseñanza, Portafolio Docente).
Tu tarea es generar una planificación didáctica de NIVEL EXPERTO / DESTACADO para la asignatura de ${subject} en ${course.replace('_', ' ')}.

CURRÍCULUM:
- Objetivo de Aprendizaje (OA): ${oaId}: ${oaDesc}
- Duración: Esta planificación debe distribuirse y detallarse en exactamente ${numClasses} clases de 90 minutos cada una.

REQUISITOS PEDAGÓGICOS DEL PORTAFOLIO DOCENTE (Nivel Experto):
1. COHERENCIA CURRICULAR: Cada clase debe estar directamente alineada al OA. Las actividades y la evaluación deben medir exactamente el nivel taxonómico del OA.
2. SECUENCIA DIDÁCTICA DE CADA CLASE: Para cada una de las ${numClasses} clases, detalla:
   - Nombre de la Clase y Objetivo Específico.
   - INICIO (15 minutos): Activación de conocimientos previos usando una estrategia interactiva, planteamiento de un Conflicto Cognitivo (pregunta desafiante de alta demanda), explicitación clara del objetivo de la sesión y los criterios de evaluación.
   - DESARROLLO (60 minutos): Modelamiento claro por parte del docente (paso a paso), Diálogo instruccional con al menos 3 preguntas de alta demanda cognitiva (meta-comprensión), andamiaje diferenciado, y actividad práctica activa (individual o colaborativa) de los estudiantes.
   - CIERRE (15 minutos): Metacognición guiada (preguntas reflexivas para los estudiantes), síntesis del aprendizaje formulada por los estudiantes, y una Evaluación Formativa explícita (ej. Ticket de Salida con sus respectivas preguntas).
3. DISEÑO UNIVERSAL PARA EL APRENDIZAJE (DUA): Describe detalladamente cómo se abordan en la planificación:
   - Principio 1 (Múltiples formas de Representación): Materiales visuales, auditivos y táctiles.
   - Principio 2 (Múltiples formas de Acción y Expresión): Opciones para que los alumnos demuestren lo aprendido.
   - Principio 3 (Múltiples formas de Compromiso): Opciones para motivar e involucrar a los estudiantes.
4. RECURSOS EDUCATIVOS: Crea una sección con los recursos necesarios (guías de trabajo detalladas, textos, presentaciones, enlaces a fichas interactivas estilo Twinkl).
5. INSTRUMENTO DE EVALUACIÓN: Diseña una rúbrica o escala de apreciación con criterios y niveles para evaluar el logro del OA al término de las sesiones.

Formatea tu respuesta de forma sumamente profesional usando Markdown estricto. Utiliza títulos, tablas para las actividades o rúbricas, y listas para facilitar la lectura. No uses explicaciones superfluas, ve directo al grano con contenido pedagógico real, creativo y original.
`;
        } else if (planType === 'unidad') {
            return `
Actúa como un diseñador instruccional y evaluador docente experto en Chile.
Genera una planificación de UNIDAD didáctica de NIVEL EXPERTO para la asignatura de ${subject} en ${course.replace('_', ' ')}.

CURRÍCULUM:
- Objetivo de Aprendizaje Principal (OA): ${oaId}: ${oaDesc}
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
`;
        } else {
            return `
Actúa como un diseñador instruccional y evaluador docente experto en Chile.
Genera una planificación ANUAL de NIVEL EXPERTO para la asignatura de ${subject} en ${course.replace('_', ' ')}.

CURRÍCULUM:
- OA de referencia inicial: ${oaId}: ${oaDesc} (Úsalo como punto de partida, pero incluye el diseño para todo el año).

REQUISITOS PEDAGÓGICOS (Nivel Experto):
1. PRESENTACIÓN Y ENFOQUE DE LA ASIGNATURA: Explicación de la didáctica de la asignatura según las bases curriculares.
2. DISTRIBUCIÓN DEL AÑO EN 4 UNIDADES (Semestres 1 y 2):
   - Detalla Nombre, Duración (en semanas), OAs prioritarios sugeridos para cada unidad, y Tipo de Evaluación Final de cada una.
3. ORIENTACIONES METODOLÓGICAS GENERALES: Enfoque de enseñanza activa, aprendizaje profundo y DUA.
4. PLAN DE EVALUACIÓN ANUAL: Descripción de cómo se aplicará el Decreto 67 en el aula (evaluación formativa y calificación).

Formatea tu respuesta en Markdown profesional con tablas estructuradas por unidades.
`;
        }
    }
});
