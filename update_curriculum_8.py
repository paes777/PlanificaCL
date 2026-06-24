import json
import os

curriculum_path = r'C:\Users\Oscar\.gemini\antigravity\scratch\PlanificadorDocente\curriculum.json'

with open(curriculum_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Data for 8th grade
data['8_basico'] = {
  "lenguaje": [
    {"id": "OA 1", "description": "Leer habitualmente para aprender y recrearse, y seleccionar textos de acuerdo con sus preferencias y propósitos."},
    {"id": "OA 2", "description": "Reflexionar sobre las diferentes dimensiones de la experiencia humana, propia y ajena, a partir de la lectura de obras literarias y otros textos."},
    {"id": "OA 3", "description": "Analizar las narraciones leídas para enriquecer su comprensión, considerando el conflicto, los personajes, la relación con el total y el narrador."},
    {"id": "OA 4", "description": "Analizar los poemas leídos para enriquecer su comprensión, considerando el lenguaje poético, significado del lenguaje figurado, y repeticiones."},
    {"id": "OA 5", "description": "Analizar los textos dramáticos leídos o vistos, para enriquecer su comprensión, considerando el conflicto, los personajes principales, y prejuicios."},
    {"id": "OA 6", "description": "Leer y comprender fragmentos de epopeya, considerando sus características y el contexto en el que se enmarcan."},
    {"id": "OA 7", "description": "Leer y comprender comedias teatrales, considerando sus características y el contexto en el que se enmarcan."},
    {"id": "OA 8", "description": "Formular una interpretación de los textos literarios leídos o vistos, que sea coherente con su análisis y su experiencia personal."},
    {"id": "OA 9", "description": "Analizar y evaluar textos con finalidad argumentativa como columnas de opinión, cartas y discursos, considerando la postura del autor y los argumentos."},
    {"id": "OA 10", "description": "Analizar y evaluar textos de los medios de comunicación, considerando los propósitos, estrategias de persuasión y veracidad."},
    {"id": "OA 11", "description": "Leer y comprender textos no literarios para contextualizar y complementar las lecturas literarias realizadas en clases."},
    {"id": "OA 12", "description": "Aplicar flexiblemente y creativamente las habilidades de escritura adquiridas en clases como medio de expresión personal."},
    {"id": "OA 13", "description": "Escribir, con el propósito de explicar un tema, textos de diversos géneros caracterizados por una presentación clara y organización propia."},
    {"id": "OA 14", "description": "Escribir, con el propósito de persuadir, textos de diversos géneros caracterizados por la presentación de una hipótesis y evidencias."},
    {"id": "OA 15", "description": "Planificar, escribir, revisar, reescribir y editar sus textos en función del contexto, el destinatario y el propósito."},
    {"id": "OA 16", "description": "Usar consistentemente el estilo directo y el indirecto en textos escritos y orales empleando tiempos verbales adecuados."},
    {"id": "OA 17", "description": "Usar en sus textos recursos de correferencia léxica compleja, empleando adecuadamente la metáfora y la metonimia."},
    {"id": "OA 18", "description": "Escribir correctamente para facilitar la comprensión al lector aplicando reglas de ortografía literal, acentual y puntual."},
    {"id": "OA 19", "description": "Comprender, comparar y evaluar textos orales y audiovisuales, considerando su postura personal, temas principales y ordenación de la información."},
    {"id": "OA 20", "description": "Evaluar el punto de vista de un emisor, su razonamiento y uso de recursos retóricos."},
    {"id": "OA 21", "description": "Dialogar constructivamente para debatir o explorar ideas manteniendo el foco, demostrando comprensión y fundamentando su postura."},
    {"id": "OA 22", "description": "Expresarse frente a una audiencia de manera clara y adecuada a la situación, para comunicar temas de su interés con información fidedigna."},
    {"id": "OA 23", "description": "Analizar los posibles efectos de los elementos lingüísticos, paralingüísticos y no lingüísticos que usa un hablante en una situación determinada."},
    {"id": "OA 24", "description": "Realizar investigaciones sobre diversos temas para complementar sus lecturas o responder interrogantes, delimitando el tema y descartando fuentes inútiles."},
    {"id": "OA 25", "description": "Sintetizar, registrar y ordenar las ideas principales de textos escuchados o leídos para satisfacer propósitos como estudiar o investigar."}
  ],
  "matematica": [
    {"id": "OA 1", "description": "Mostrar que comprenden la multiplicación y la división de números enteros representándolas y aplicando la regla de los signos."},
    {"id": "OA 2", "description": "Utilizar las operaciones de multiplicación y división con los números racionales en el contexto de la resolución de problemas."},
    {"id": "OA 3", "description": "Explicar la multiplicación y la división de potencias de base natural y exponente natural hasta 3."},
    {"id": "OA 4", "description": "Mostrar que comprenden las raíces cuadradas de números naturales estimándolas y representándolas de manera concreta, pictórica y simbólica."},
    {"id": "OA 5", "description": "Resolver problemas que involucran variaciones porcentuales en contextos diversos, usando representaciones pictóricas."},
    {"id": "OA 6", "description": "Mostrar que comprenden la operatoria de expresiones algebraicas representándolas y relacionándolas con el área de cuadrados y volúmenes."},
    {"id": "OA 7", "description": "Mostrar que comprenden la noción de función por medio de un cambio lineal utilizando tablas y metáforas de máquinas."},
    {"id": "OA 8", "description": "Modelar situaciones de la vida diaria y de otras asignaturas, usando ecuaciones lineales de distintas formas."},
    {"id": "OA 9", "description": "Resolver inecuaciones lineales con coeficientes racionales en el contexto de la resolución de problemas."},
    {"id": "OA 10", "description": "Mostrar que comprenden la función afín generalizándola como la suma de una constante con una función lineal."},
    {"id": "OA 11", "description": "Desarrollar las fórmulas para encontrar el área de superficies y el volumen de prismas rectos con diferentes bases y cilindros."},
    {"id": "OA 12", "description": "Explicar, de manera concreta, pictórica y simbólica, la validez del teorema de Pitágoras y aplicar a la resolución de problemas."},
    {"id": "OA 13", "description": "Describir la posición y el movimiento (traslaciones, rotaciones y reflexiones) de figuras 2D, utilizando vectores y ejes del plano."},
    {"id": "OA 14", "description": "Componer rotaciones, traslaciones y reflexiones en el plano cartesiano y en el espacio y aplicar a la simetría de polígonos."},
    {"id": "OA 15", "description": "Mostrar que comprenden las medidas de posición, percentiles y cuartiles representándolas con diagramas y comparando poblaciones."},
    {"id": "OA 16", "description": "Evaluar la forma en que los datos están presentados comparando gráficos para determinar fortalezas y debilidades de cada uno."},
    {"id": "OA 17", "description": "Explicar el principio combinatorio multiplicativo a partir de situaciones concretas y usándolo para calcular la probabilidad de un evento compuesto."}
  ],
  "ciencias": [
    {"id": "OA 1", "description": "Explicar cómo el sistema nervioso coordina las acciones del organismo para adaptarse a estímulos del ambiente y comunicar sus cuidados."},
    {"id": "OA 2", "description": "Crear modelos que expliquen la regulación de la glicemia y de los caracteres sexuales y reproductivos por medio del control hormonal."},
    {"id": "OA 3", "description": "Explicar que la sexualidad humana y la reproducción son aspectos fundamentales considerando aspectos biológicos, sociales, afectivos y psicológicos."},
    {"id": "OA 4", "description": "Describir la fecundación, la implantación y el desarrollo del embrión, y analizar la responsabilidad en la nutrición prenatal y la lactancia."},
    {"id": "OA 5", "description": "Explicar y evaluar los métodos de regulación de la fertilidad e identificar los elementos de paternidad y maternidad responsables."},
    {"id": "OA 6", "description": "Investigar y argumentar que el material genético se transmite de generación en generación considerando la mitosis, meiosis y anomalías."},
    {"id": "OA 7", "description": "Desarrollar una explicación científica sobre los procesos de herencia genética aplicando los principios básicos de Mendel."},
    {"id": "OA 8", "description": "Investigar y explicar las aplicaciones de la manipulación genética y evaluar sus implicancias éticas y sociales."},
    {"id": "OA 9", "description": "Analizar, sobre la base de la experimentación, el movimiento rectilíneo uniforme y acelerado de un objeto respecto de un sistema de referencia."},
    {"id": "OA 10", "description": "Explicar los efectos que tiene una fuerza neta sobre un objeto, utilizando las leyes de Newton y el diagrama de cuerpo libre."},
    {"id": "OA 11", "description": "Describir el movimiento de un objeto usando la ley de conservación de la energía mecánica, el trabajo y potencia mecánica."},
    {"id": "OA 12", "description": "Analizar e interpretar datos de investigaciones sobre colisiones entre objetos, considerando el momentum y su conservación."},
    {"id": "OA 13", "description": "Demostrar que comprenden que el conocimiento del Universo cambia usando modelos como el geocéntrico y el heliocéntrico, y el Big-Bang."},
    {"id": "OA 14", "description": "Explicar cualitativamente por medio de las leyes de Kepler y la de gravitación universal de Newton el origen de las mareas y formación de estructuras cósmicas."},
    {"id": "OA 15", "description": "Explicar, por medio de modelos y la experimentación, las propiedades de las soluciones en ejemplos cercanos considerando estado, componentes y concentración."},
    {"id": "OA 16", "description": "Planificar y conducir una investigación experimental para proveer evidencias que expliquen las propiedades coligativas de las soluciones."},
    {"id": "OA 17", "description": "Crear modelos del carbono y explicar sus propiedades como base para la formación de moléculas útiles para los seres vivos y el entorno."},
    {"id": "OA 18", "description": "Desarrollar modelos que expliquen la estereoquímica e isomería de compuestos orgánicos como la glucosa, identificando sus propiedades."}
  ],
  "historia": [
    {"id": "OA 1", "description": "Analizar, apoyándose en diversas fuentes, la centralidad del ser humano y su capacidad de transformar el mundo en el humanismo y el Renacimiento."},
    {"id": "OA 2", "description": "Comparar la sociedad medieval y moderna, considerando la ruptura de la unidad religiosa, el Estado centralizado, la imprenta y la revolución científica."},
    {"id": "OA 3", "description": "Caracterizar el Estado moderno considerando la concentración del poder en el rey, la burocracia, la expansión territorial y ejércitos profesionales."},
    {"id": "OA 4", "description": "Caracterizar la economía mercantilista del siglo XVI, considerando la acumulación de metales preciosos y la ampliación de rutas comerciales."},
    {"id": "OA 5", "description": "Argumentar por qué la llegada de los europeos a América implicó un enfrentamiento entre culturas, considerando las diferencias culturales."},
    {"id": "OA 6", "description": "Analizar los factores que explican la rapidez de la conquista y la caída de los grandes imperios americanos y la catástrofe demográfica."},
    {"id": "OA 7", "description": "Analizar y evaluar el impacto de la conquista de América en la cultura europea, considerando la ampliación del mundo conocido y los debates morales."},
    {"id": "OA 8", "description": "Analizar el rol de la ciudad en la administración del territorio del Imperio español, considerando las instituciones y el monopolio del comercio."},
    {"id": "OA 9", "description": "Caracterizar el Barroco a través de distintas expresiones culturales de la sociedad colonial, como el arte, la arquitectura, la música y el teatro."},
    {"id": "OA 10", "description": "Explicar la importancia de los mercados americanos en el comercio atlántico considerando el monopolio comercial y la exportación de materias primas."},
    {"id": "OA 11", "description": "Analizar el proceso de formación de la sociedad colonial americana considerando elementos como la evangelización, la esclavitud, y el mestizaje."},
    {"id": "OA 12", "description": "Analizar y evaluar las formas de convivencia y los tipos de conflicto entre españoles, mestizos y mapuches como resultado de la conquista de Arauco."},
    {"id": "OA 13", "description": "Analizar el rol de la hacienda en la conformación de los principales rasgos del Chile colonial, el inquilinaje y la elite terrateniente."},
    {"id": "OA 14", "description": "Caracterizar la Ilustración como corriente de pensamiento basada en la razón, la separación de poderes y los principios de libertad, igualdad y soberanía."},
    {"id": "OA 15", "description": "Analizar cómo las ideas ilustradas se manifestaron en los procesos revolucionarios de fines del siglo XVIII y comienzos del siglo XIX."},
    {"id": "OA 16", "description": "Explicar la independencia de las colonias hispanoamericanas como un proceso continental marcado por la crisis del sistema colonial y las ideas ilustradas."},
    {"id": "OA 17", "description": "Contrastar las distintas posturas que surgieron en el debate sobre la legitimidad de la conquista y la concepción de los derechos humanos."},
    {"id": "OA 18", "description": "Explicar el concepto de Derechos del Hombre y del Ciudadano difundido en el marco de la Ilustración y la Revolución francesa."},
    {"id": "OA 19", "description": "Evaluar las principales transformaciones y desafíos que generó la independencia de Chile, como la conformación de un orden republicano y soberanía popular."},
    {"id": "OA 20", "description": "Explicar los criterios que definen a una región, considerando factores físicos y humanos y dar ejemplos de distintos tipos de regiones."},
    {"id": "OA 21", "description": "Analizar y evaluar problemáticas asociadas a la región en Chile como los grados de conexión, aislamiento, migración y su impacto en diversos ámbitos."},
    {"id": "OA 22", "description": "Aplicar el concepto de desarrollo para analizar diversos aspectos de las regiones en Chile considerando el índice de desarrollo humano y ventajas comparativas."}
  ],
  "ingles": [
    {"id": "OA 1", "description": "Demostrar comprensión de ideas generales e información explícita en textos orales adaptados y auténticos simples acerca de temas variados."},
    {"id": "OA 2", "description": "Identificar palabras y frases clave, expresiones de uso frecuente, vocabulario temático y combinaciones frecuentes en textos orales y conversaciones."},
    {"id": "OA 3", "description": "Identificar en los textos escuchados propósito, ideas generales, información específica y pasos en instrucciones o secuencias de eventos."},
    {"id": "OA 4", "description": "Seleccionar y usar estrategias para apoyar la comprensión de los textos escuchados, como hacer predicciones y focalizar la atención."},
    {"id": "OA 5", "description": "Presentar información en forma oral usando recursos multimodales que refuercen el mensaje en forma creativa demostrando conocimiento del contenido."},
    {"id": "OA 6", "description": "Participar en interacciones y exposiciones, recurriendo a estrategias como organizar información en diagramas, parafrasear y registrar errores."},
    {"id": "OA 7", "description": "Reaccionar a textos leídos o escuchados por medio de exposiciones orales o discusiones haciendo conexiones con otras asignaturas y la vida cotidiana."},
    {"id": "OA 8", "description": "Demostrar conocimiento y uso del lenguaje en conversaciones y exposiciones por medio de funciones como expresar cantidades, gustos, y hacer comparaciones."},
    {"id": "OA 9", "description": "Demostrar comprensión de ideas generales e información explícita en textos adaptados y auténticos simples, en formato impreso o digital."},
    {"id": "OA 10", "description": "Demostrar comprensión de textos no literarios identificando propósito, idea principal, información específica y palabras clave."},
    {"id": "OA 11", "description": "Demostrar comprensión de textos literarios identificando tema, personajes, entorno, trama y problema-solución."},
    {"id": "OA 12", "description": "Identificar y usar estrategias para apoyar la comprensión de los textos leídos: leer con propósito, lectura rápida y focalizada y confirmar predicciones."},
    {"id": "OA 13", "description": "Escribir historias e información relevante usando diversos recursos multimodales en textos variados acerca de experiencias y contenidos interdisciplinarios."},
    {"id": "OA 14", "description": "Escribir una variedad de textos como cuentos, correos electrónicos y artículos utilizando los pasos del proceso de escritura."},
    {"id": "OA 15", "description": "Escribir para explicar, expresar opiniones y narrar, usando variedad de palabras y conectores con correcta ortografía y puntuación."},
    {"id": "OA 16", "description": "Demostrar conocimiento y uso del lenguaje en sus textos escritos por medio de funciones como expresar cantidades, describir lugares y señalar frecuencia."}
  ],
  "educacion_fisica": [
    {"id": "OA 1", "description": "Perfeccionar y aplicar controladamente las habilidades motrices específicas de locomoción, manipulación y estabilidad en deportes individuales, de oposición y colaboración."},
    {"id": "OA 2", "description": "Modificar, evaluar y aplicar las estrategias y tácticas específicas utilizadas para la resolución de problemas durante la práctica de juegos o deportes."},
    {"id": "OA 3", "description": "Diseñar y aplicar un plan de entrenamiento personal para alcanzar una condición física saludable, considerando frecuencia, intensidad y progresión."},
    {"id": "OA 4", "description": "Practicar regularmente una variedad de actividades físicas alternativas y/o deportivas aplicando conductas de autocuidado, seguridad y primeros auxilios."},
    {"id": "OA 5", "description": "Participar y promover una variedad de actividades físicas y/o deportivas de su interés que se desarrollen en su comunidad escolar y entorno."}
  ],
  "musica": [
    {"id": "OA 1", "description": "Comunicar sentimientos, sensaciones e ideas al escuchar manifestaciones y obras musicales de Chile y el mundo presentes en la tradición oral, escrita y popular."},
    {"id": "OA 2", "description": "Describir analíticamente los elementos del lenguaje musical y los procedimientos compositivos evidentes en la música escuchada, interpretada y creada."},
    {"id": "OA 3", "description": "Cantar y tocar repertorio relacionado con la música escuchada, desarrollando comprensión rítmica, melódica, conciencia de textura y expresividad."},
    {"id": "OA 4", "description": "Interpretar repertorio diverso a una y más voces, con precisión rítmica y melódica, incorporando el uso de medios de registro y transmisión."},
    {"id": "OA 5", "description": "Improvisar y crear música aplicando experiencias y conocimientos basándose en indicaciones determinadas, dando énfasis a acompañamientos y variaciones."},
    {"id": "OA 6", "description": "Explicar fortalezas y áreas de crecimiento personal en la audición, interpretación, creación y reflexión, y su influencia en el trabajo musical."},
    {"id": "OA 7", "description": "Apreciar el rol de la música en la sociedad sobre la base del repertorio trabajado, respetando la diversidad y riqueza de los contextos socioculturales."}
  ],
  "artes": [
    {"id": "OA 1", "description": "Crear trabajos visuales basados en la apreciación y el análisis de manifestaciones estéticas referidas a la relación entre personas, naturaleza y medioambiente."},
    {"id": "OA 2", "description": "Crear trabajos visuales a partir de diferentes desafíos creativos, experimentando con materiales sustentables en técnicas de impresión, papeles y textiles."},
    {"id": "OA 3", "description": "Crear trabajos visuales a partir de diferentes desafíos creativos, usando medios de expresión contemporáneos como la instalación."},
    {"id": "OA 4", "description": "Analizar manifestaciones visuales patrimoniales y contemporáneas contemplando criterios como el contexto, la materialidad, el lenguaje visual y el propósito expresivo."},
    {"id": "OA 5", "description": "Evaluar trabajos visuales personales y de sus pares considerando criterios como la materialidad, el lenguaje visual y el propósito expresivo."},
    {"id": "OA 6", "description": "Comparar y valorar espacios de difusión de las artes visuales considerando los medios de expresión presentes, el espacio, el montaje, el público y el aporte a la comunidad."}
  ],
  "orientacion": [
    {"id": "OA 1", "description": "Construir en forma individual y colectiva representaciones positivas de sí mismos, incorporando sus características y considerando las experiencias de cambio asociadas a la pubertad."},
    {"id": "OA 2", "description": "Analizar, considerando sus experiencias e inquietudes, la importancia que tiene para el desarrollo personal la integración de las distintas dimensiones de la sexualidad, el cuidado del cuerpo y la intimidad."},
    {"id": "OA 3", "description": "Identificar situaciones que puedan exponer a los adolescentes al consumo de sustancias nocivas, conductas sexuales riesgosas y conductas violentas, desarrollando estrategias para enfrentarlas."},
    {"id": "OA 4", "description": "Integrar a su vida cotidiana acciones que favorezcan el bienestar y la vida saludable en el plano personal y en la comunidad escolar, optando por una alimentación saludable y descanso."},
    {"id": "OA 5", "description": "Analizar sus relaciones, presenciales o virtuales por medio de las redes sociales, y las de su entorno inmediato atendiendo a los derechos de las personas involucradas."},
    {"id": "OA 6", "description": "Resolver conflictos y desacuerdos mediante el diálogo, la escucha empática y la búsqueda de soluciones en forma respetuosa y sin violencia."},
    {"id": "OA 7", "description": "Reconocer intereses, inquietudes, problemas o necesidades compartidas con sus grupos de pertenencia y colaborar para alcanzar metas comunes."},
    {"id": "OA 8", "description": "Elaborar acuerdos orientados al logro de fines compartidos por el curso utilizando los espacios de participación disponibles, como Consejo de curso, asambleas, etc."},
    {"id": "OA 9", "description": "Reconocer sus intereses, motivaciones, necesidades y capacidades, comprendiendo la relevancia del aprendizaje escolar sistemático para su desarrollo."},
    {"id": "OA 10", "description": "Gestionar de manera autónoma sus propios procesos de aprendizaje escolar por medio del establecimiento de metas progresivas de aprendizaje y monitoreo de logros."}
  ],
  "tecnologia": [
    {"id": "OA 1", "description": "Identificar oportunidades o necesidades personales, grupales o locales que impliquen la creación de un producto tecnológico, reflexionando acerca de sus posibles aportes."},
    {"id": "OA 2", "description": "Diseñar y crear un producto tecnológico que atienda a la oportunidad o necesidad establecida, respetando criterios de eficiencia y sustentabilidad."},
    {"id": "OA 3", "description": "Evaluar el producto tecnológico creado, aplicando criterios propios y técnicos, y proponer mejoras asociadas tanto a los procesos como al producto final."},
    {"id": "OA 4", "description": "Comunicar el diseño, la planificación u otros procesos de la creación de productos tecnológicos, utilizando herramientas TIC y considerando diferentes audiencias."},
    {"id": "OA 5", "description": "Examinar soluciones tecnológicas existentes que respondan a las oportunidades o necesidades establecidas, considerando los destinatarios y aspectos técnicos."},
    {"id": "OA 6", "description": "Establecer impactos positivos o negativos de las soluciones tecnológicas analizadas, considerando aspectos éticos, ambientales y sociales."}
  ]
}

with open(curriculum_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("8th grade updated.")
