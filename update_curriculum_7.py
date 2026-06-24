import json
import os

curriculum_path = r'C:\Users\Oscar\.gemini\antigravity\scratch\PlanificadorDocente\curriculum.json'

with open(curriculum_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Data for 7th grade
data['7_basico'] = {
  "lenguaje": [
    {"id": "OA 1", "description": "Leer habitualmente para aprender y recrearse, y seleccionar textos de acuerdo con sus preferencias y propósitos."},
    {"id": "OA 2", "description": "Reflexionar sobre las diferentes dimensiones de la experiencia humana, propia y ajena, a partir de la lectura de obras literarias y otros textos."},
    {"id": "OA 3", "description": "Analizar las narraciones leídas para enriquecer su comprensión, considerando el conflicto, los personajes, la relación de fragmentos con el total, el narrador, entre otros."},
    {"id": "OA 4", "description": "Analizar los poemas leídos para enriquecer su comprensión, considerando el lenguaje poético, significado del lenguaje figurado, ritmo y sonoridad."},
    {"id": "OA 5", "description": "Leer y comprender romances y obras de la poesía popular, considerando sus características y el contexto en el que se enmarcan."},
    {"id": "OA 6", "description": "Leer y comprender relatos mitológicos, considerando sus características y el contexto en el que se enmarcan."},
    {"id": "OA 7", "description": "Formular una interpretación de los textos literarios, considerando su experiencia personal, un dilema presentado y la relación de la obra con la visión de mundo."},
    {"id": "OA 8", "description": "Analizar y evaluar textos con finalidad argumentativa, considerando la postura del autor, la diferencia entre hecho y opinión y su postura personal."},
    {"id": "OA 9", "description": "Analizar y evaluar textos de los medios de comunicación, considerando los propósitos, hechos y opiniones, estereotipos y el análisis de imágenes."},
    {"id": "OA 10", "description": "Leer y comprender textos no literarios para contextualizar y complementar las lecturas literarias realizadas en clases."},
    {"id": "OA 11", "description": "Aplicar estrategias de comprensión de acuerdo con sus propósitos de lectura: resumir, formular preguntas, analizar relaciones texto-imagen."},
    {"id": "OA 12", "description": "Expresarse en forma creativa por medio de la escritura de textos de diversos géneros escogiendo libremente el tema, el género y el destinatario."},
    {"id": "OA 13", "description": "Escribir, con el propósito de explicar un tema, textos de diversos géneros caracterizados por una presentación clara y una progresión temática."},
    {"id": "OA 14", "description": "Escribir, con el propósito de persuadir, textos breves de diversos géneros caracterizados por la presentación de una afirmación y evidencias pertinentes."},
    {"id": "OA 15", "description": "Planificar, escribir, revisar, reescribir y editar sus textos en función del contexto, el destinatario y el propósito."},
    {"id": "OA 16", "description": "Aplicar los conceptos de oración, sujeto y predicado con el fin de revisar y mejorar sus textos."},
    {"id": "OA 17", "description": "Usar en sus textos recursos de correferencia léxica: empleando adecuadamente la sustitución léxica, la sinonimia y la hiperonimia."},
    {"id": "OA 18", "description": "Utilizar adecuadamente, al narrar, los tiempos verbales del indicativo, manteniendo una adecuada secuencia de tiempos verbales."},
    {"id": "OA 19", "description": "Escribir correctamente para facilitar la comprensión al lector aplicando reglas de ortografía literal, acentual y puntual."},
    {"id": "OA 20", "description": "Comprender, comparar y evaluar textos orales y audiovisuales considerando su postura personal, temas principales, hechos y opiniones y distintos puntos de vista."},
    {"id": "OA 21", "description": "Dialogar constructivamente para debatir o explorar ideas manteniendo el foco, demostrando comprensión y fundamentando su postura."},
    {"id": "OA 22", "description": "Expresarse frente a una audiencia de manera clara y adecuada a la situación, para comunicar temas de su interés presentando información fidedigna."},
    {"id": "OA 23", "description": "Usar conscientemente los elementos que influyen y configuran los textos orales comparando textos orales y escritos, demostrando dominio de registros y usando volumen, velocidad y dicción adecuados."},
    {"id": "OA 24", "description": "Realizar investigaciones sobre diversos temas para complementar sus lecturas o responder interrogantes relacionadas con el lenguaje y la literatura."},
    {"id": "OA 25", "description": "Sintetizar, registrar y ordenar las ideas principales de textos escuchados o leídos para satisfacer propósitos como estudiar, hacer una investigación, recordar detalles, etc."}
  ],
  "matematica": [
    {"id": "OA 1", "description": "Mostrar que comprenden la adición y la sustracción de números enteros representándolos en la recta numérica y resolviendo problemas en contextos cotidianos."},
    {"id": "OA 2", "description": "Explicar la multiplicación y la división de fracciones positivas utilizando representaciones y relacionándolas con números decimales."},
    {"id": "OA 3", "description": "Resolver problemas que involucren la multiplicación y la división de fracciones y de decimales positivos."},
    {"id": "OA 4", "description": "Mostrar que comprenden el concepto de porcentaje representándolo, calculándolo de varias maneras y aplicándolo a situaciones sencillas."},
    {"id": "OA 5", "description": "Utilizar potencias de base 10 con exponente natural usando los términos potencia, base, exponente y expresando números naturales en notación científica."},
    {"id": "OA 6", "description": "Utilizar el lenguaje algebraico para generalizar relaciones entre números, para establecer y formular reglas y propiedades y construir ecuaciones."},
    {"id": "OA 7", "description": "Reducir expresiones algebraicas, reuniendo términos semejantes para obtener expresiones de la forma ax + by + cz."},
    {"id": "OA 8", "description": "Mostrar que comprenden las proporciones directas e inversas realizando tablas de valores, graficando y resolviendo problemas de la vida diaria."},
    {"id": "OA 9", "description": "Modelar y resolver problemas diversos de la vida diaria y de otras asignaturas que involucran ecuaciones e inecuaciones lineales."},
    {"id": "OA 10", "description": "Descubrir relaciones que involucran ángulos exteriores o interiores de diferentes polígonos."},
    {"id": "OA 11", "description": "Mostrar que comprenden el círculo describiendo las relaciones entre el radio, el diámetro y el perímetro, y estimando el perímetro y área."},
    {"id": "OA 12", "description": "Construir objetos geométricos de manera manual y/o con software educativo como líneas, perpendiculares, paralelas, bisectrices y alturas."},
    {"id": "OA 13", "description": "Desarrollar y aplicar la fórmula del área de triángulos, paralelogramos y trapecios."},
    {"id": "OA 14", "description": "Identificar puntos en el plano cartesiano, usando pares ordenados y vectores de forma concreta y pictórica."},
    {"id": "OA 15", "description": "Estimar el porcentaje de algunas características de una población desconocida por medio del muestreo."},
    {"id": "OA 16", "description": "Representar datos obtenidos en una muestra mediante tablas de frecuencias absolutas y relativas, utilizando gráficos apropiados."},
    {"id": "OA 17", "description": "Mostrar que comprenden las medidas de tendencia central y el rango determinándolos para realizar inferencias sobre la población."},
    {"id": "OA 18", "description": "Explicar las probabilidades de eventos obtenidos por medio de experimentos estimándolas de manera intuitiva y relacionándolas con razones o porcentajes."},
    {"id": "OA 19", "description": "Comparar las frecuencias relativas de un evento obtenidas al repetir un experimento con la probabilidad obtenida de manera teórica."}
  ],
  "ciencias": [
    {"id": "OA 1", "description": "Explicar los aspectos biológicos, afectivos y sociales que se integran en la sexualidad, considerando los cambios físicos, la relación afectiva y la responsabilidad individual."},
    {"id": "OA 2", "description": "Explicar la formación de un nuevo individuo, considerando el ciclo menstrual, la participación de espermatozoides y ovocitos, métodos anticonceptivos y maternidad/paternidad responsable."},
    {"id": "OA 3", "description": "Describir las características de infecciones de transmisión sexual (ITS), como sida y herpes, considerando sus mecanismos de transmisión, medidas de prevención y síntomas."},
    {"id": "OA 4", "description": "Desarrollar modelos que expliquen las barreras defensivas (primaria, secundaria y terciaria) del cuerpo humano."},
    {"id": "OA 5", "description": "Comparar microorganismos como virus, bacterias y hongos en relación con características estructurales, comunes y efectos sobre la salud humana."},
    {"id": "OA 6", "description": "Investigar y explicar el rol de microorganismos (bacterias y hongos) en la biotecnología, como en descontaminación y producción de alimentos."},
    {"id": "OA 7", "description": "Planificar y conducir una investigación experimental para proveer evidencias que expliquen los efectos de las fuerzas gravitacional, de roce y elástica."},
    {"id": "OA 8", "description": "Explorar y describir cualitativamente la presión, considerando sus efectos en sólidos, líquidos y gases."},
    {"id": "OA 9", "description": "Explicar, con el modelo de la tectónica de placas, los patrones de distribución de la actividad geológica (volcanes y sismos)."},
    {"id": "OA 10", "description": "Explicar la actividad volcánica y sus consecuencias en la naturaleza y la sociedad."},
    {"id": "OA 11", "description": "Crear modelos que expliquen el ciclo de las rocas, la formación y modificación de las rocas ígneas, metamórficas y sedimentarias."},
    {"id": "OA 12", "description": "Demostrar que comprenden que el clima en la Tierra es dinámico y se produce por la interacción de múltiples variables."},
    {"id": "OA 13", "description": "Investigar experimentalmente y explicar el comportamiento de gases ideales en situaciones cotidianas."},
    {"id": "OA 14", "description": "Investigar experimentalmente y explicar la clasificación de la materia en sustancias puras y mezclas, y los procedimientos de separación de mezclas."},
    {"id": "OA 15", "description": "Investigar experimentalmente los cambios de la materia y argumentar con evidencia empírica que estos pueden ser físicos o químicos."}
  ],
  "historia": [
    {"id": "OA 1", "description": "Explicar el proceso de hominización, reconociendo las principales etapas de la evolución de la especie humana y la influencia de factores geográficos."},
    {"id": "OA 2", "description": "Explicar que el surgimiento de la agricultura, la domesticación de animales y la sedentarización fueron procesos de larga duración que revolucionaron la forma en que los seres humanos se relacionaron con el espacio."},
    {"id": "OA 3", "description": "Explicar que en las primeras civilizaciones la formación de estados organizados estuvo marcada por la centralización de la administración, la estratificación social y el desarrollo de sistemas religiosos y escritura."},
    {"id": "OA 4", "description": "Caracterizar el surgimiento de las primeras civilizaciones (sumeria, egipcia, china, india, etc.) reconociendo que procesos similares se desarrollaron en distintos lugares."},
    {"id": "OA 5", "description": "Caracterizar el mar Mediterráneo como ecúmene y como espacio de circulación e intercambio, e inferir cómo sus características geográficas influyeron en Grecia y Roma."},
    {"id": "OA 6", "description": "Analizar las principales características de la democracia en Atenas y su importancia para el desarrollo de la vida política actual."},
    {"id": "OA 7", "description": "Relacionar las principales características de la civilización romana con la extensión territorial de su imperio y el proceso de romanización."},
    {"id": "OA 8", "description": "Analizar el canon cultural que se constituyó en la Antigüedad clásica, considerando la centralidad del ser humano y su influencia en el presente."},
    {"id": "OA 9", "description": "Explicar que la civilización europea se conforma a partir de la fragmentación de la unidad imperial de Occidente y la confluencia de las tradiciones grecorromana, judeocristiana y germana."},
    {"id": "OA 10", "description": "Caracterizar algunos rasgos distintivos de la sociedad medieval, como la visión cristiana del mundo, el orden estamental y las relaciones de fidelidad."},
    {"id": "OA 11", "description": "Analizar ejemplos de relaciones de influencia, convivencia y conflicto entre el mundo europeo, el bizantino y el islámico durante la Edad Media."},
    {"id": "OA 12", "description": "Analizar las transformaciones que se producen en Europa a partir del siglo XII, considerando el renacimiento de la vida urbana, desarrollo comercial y surgimiento de universidades."},
    {"id": "OA 13", "description": "Identificar las principales características de las civilizaciones maya y azteca, considerando las tecnologías utilizadas para transformar el territorio."},
    {"id": "OA 14", "description": "Caracterizar el Imperio inca y analizar los factores que posibilitaron la dominación y unidad del imperio."},
    {"id": "OA 15", "description": "Describir las principales características culturales de las civilizaciones maya, azteca e inca e identificar elementos que persisten hasta el presente."},
    {"id": "OA 16", "description": "Reconocer en expresiones culturales latinoamericanas del presente la confluencia del legado de múltiples civilizaciones."},
    {"id": "OA 17", "description": "Identificar los principios, mecanismos e instituciones que permitieron que en Atenas y en Roma se limitara el ejercicio del poder y se respetaran los derechos ciudadanos."},
    {"id": "OA 18", "description": "Comparar los conceptos de ciudadanía, democracia, derecho, república, municipio y gremio del mundo clásico y medieval con la sociedad contemporánea."},
    {"id": "OA 19", "description": "Reconocer el valor de la diversidad como una forma de enriquecer culturalmente a las sociedades, identificando los aportes de distintas culturas en el mundo antiguo y medieval."},
    {"id": "OA 20", "description": "Reconocer distintas formas de convivencia y conflicto entre culturas en las civilizaciones estudiadas y debatir sobre la importancia del respeto y la tolerancia."},
    {"id": "OA 21", "description": "Reconocer procesos de adaptación y transformación que se derivan de la relación entre el ser humano y el medio, e identificar factores que inciden en el asentamiento."},
    {"id": "OA 22", "description": "Reconocer y explicar formas en que la acción humana genera impactos en el medio y formas en que el medio afecta a la población."},
    {"id": "OA 23", "description": "Investigar sobre problemáticas medioambientales relacionadas con fenómenos como el calentamiento global, los recursos energéticos, la sobrepoblación, entre otros."}
  ],
  "ingles": [
    {"id": "OA 1", "description": "Demostrar comprensión de ideas generales e información explícita en textos orales adaptados y auténticos simples, literarios y no literarios."},
    {"id": "OA 2", "description": "Identificar palabras y frases clave, expresiones de uso frecuente, vocabulario temático, conectores y sonidos en textos orales y conversaciones."},
    {"id": "OA 3", "description": "Identificar en los textos escuchados tema, ideas generales, información específica y detalles relevantes asociados a personas, lugares y tiempo."},
    {"id": "OA 4", "description": "Identificar y usar estrategias para apoyar la comprensión de los textos escuchados, como hacer predicciones, escuchar con propósito y usar conocimientos previos."},
    {"id": "OA 5", "description": "Presentar información en forma oral usando recursos multimodales acerca de temas variados, demostrando conocimiento del contenido y uso apropiado del lenguaje."},
    {"id": "OA 6", "description": "Participar en interacciones y exposiciones recurriendo a estrategias como practicar presentación, usar gestos y registrar errores para expresarse con claridad."},
    {"id": "OA 7", "description": "Reaccionar a los textos leídos o escuchados por medio de exposiciones orales o discusiones haciendo conexiones con otras asignaturas o experiencias."},
    {"id": "OA 8", "description": "Demostrar conocimiento y uso del lenguaje en conversaciones y exposiciones por medio de funciones como expresar cantidades, gustos, y describir estado de ánimo."},
    {"id": "OA 9", "description": "Demostrar comprensión de ideas generales e información explícita en textos adaptados y auténticos simples, en formato impreso o digital."},
    {"id": "OA 10", "description": "Demostrar comprensión de textos no literarios identificando propósito, idea principal, información específica y palabras clave."},
    {"id": "OA 11", "description": "Demostrar comprensión de textos literarios identificando tema, personajes, entorno y trama."},
    {"id": "OA 12", "description": "Identificar y usar estrategias para apoyar la comprensión de los textos leídos, como lectura rápida, lectura focalizada y uso de conocimientos previos."},
    {"id": "OA 13", "description": "Escribir historias e información relevante usando recursos multimodales sobre experiencias personales, contenidos interdisciplinarios y temas globales."},
    {"id": "OA 14", "description": "Escribir una variedad de textos breves como cuentos, correos electrónicos, folletos y descripciones, utilizando los pasos del proceso de escritura."},
    {"id": "OA 15", "description": "Escribir para informar, expresar opiniones y narrar, usando palabras y estructuras aprendidas, conectores y correcta ortografía."},
    {"id": "OA 16", "description": "Demostrar conocimiento y uso del lenguaje en textos escritos por medio de funciones como expresar cantidades, describir objetos y señalar tiempo y secuencia."}
  ],
  "educacion_fisica": [
    {"id": "OA 1", "description": "Aplicar, combinar y ajustar las habilidades motrices específicas de locomoción, manipulación y estabilidad en deportes individuales, de oposición y colaboración."},
    {"id": "OA 2", "description": "Seleccionar y aplicar estrategias y tácticas específicas para la resolución de problemas durante la práctica de juegos o deportes."},
    {"id": "OA 3", "description": "Desarrollar la resistencia cardiovascular, la fuerza muscular, la velocidad y la flexibilidad para alcanzar una condición física saludable."},
    {"id": "OA 4", "description": "Practicar regularmente una variedad de actividades físicas alternativas y/o deportivas, aplicando conductas de autocuidado y seguridad."},
    {"id": "OA 5", "description": "Participar y promover una variedad de actividades físicas y/o deportivas de su interés que se desarrollan en su comunidad escolar y/o entorno."}
  ],
  "musica": [
    {"id": "OA 1", "description": "Reconocer sentimientos, sensaciones e ideas al escuchar manifestaciones y obras musicales de Chile y el mundo presentes en la tradición oral, escrita y popular."},
    {"id": "OA 2", "description": "Identificar conscientemente los elementos del lenguaje musical y los procedimientos compositivos evidentes en la música escuchada, interpretada y creada."},
    {"id": "OA 3", "description": "Cantar y tocar repertorio diverso, desarrollando habilidades como precisión rítmica y melódica, expresividad y fortaleciendo el interés por el hacer musical."},
    {"id": "OA 4", "description": "Interpretar a una y más voces repertorio diverso, incorporando como apoyo el uso de medios de registro y transmisión."},
    {"id": "OA 5", "description": "Improvisar y crear música dando énfasis a ambientaciones sonoras libres y acompañamientos rítmicos, melódicos o armónicos simples."},
    {"id": "OA 6", "description": "Reconocer fortalezas y áreas de crecimiento personal en la audición, interpretación, creación y reflexión."},
    {"id": "OA 7", "description": "Reconocer el rol de la música en la sociedad, considerando sus propias experiencias musicales, contextos en que surge y las personas que la cultivan."}
  ],
  "artes": [
    {"id": "OA 1", "description": "Crear trabajos visuales basados en percepciones, sentimientos e ideas generadas a partir de la observación de manifestaciones estéticas referidas a diversidad cultural y género."},
    {"id": "OA 2", "description": "Crear trabajos visuales a partir de intereses personales, experimentando con materiales sustentables en dibujo, pintura y escultura."},
    {"id": "OA 3", "description": "Crear trabajos visuales a partir de la imaginación, experimentando con medios digitales de expresión contemporáneos como fotografía y edición de imágenes."},
    {"id": "OA 4", "description": "Interpretar manifestaciones visuales patrimoniales y contemporáneas atendiendo a criterios como el medio de expresión, materialidad y lenguaje visual."},
    {"id": "OA 5", "description": "Interpretar relaciones entre el propósito expresivo del trabajo artístico personal y de sus pares y la utilización del lenguaje visual."},
    {"id": "OA 6", "description": "Caracterizar y apreciar espacios de difusión de las artes visuales contemplando los medios de expresión presentes, el espacio, el montaje y el público."}
  ],
  "orientacion": [
    {"id": "OA 1", "description": "Construir en forma individual y colectiva representaciones positivas de sí mismos, incorporando sus características, motivaciones e intereses y considerando la pubertad."},
    {"id": "OA 2", "description": "Analizar la importancia que tiene para el desarrollo personal la integración de las distintas dimensiones de la sexualidad, el cuidado del cuerpo y la intimidad."},
    {"id": "OA 3", "description": "Identificar situaciones que puedan exponer a los adolescentes al consumo de sustancias nocivas, conductas sexuales riesgosas y conductas violentas."},
    {"id": "OA 4", "description": "Integrar a su vida cotidiana acciones que favorezcan el bienestar y la vida saludable en el plano personal y en la comunidad escolar."},
    {"id": "OA 5", "description": "Analizar sus relaciones, presenciales o virtuales por medio de las redes sociales, y las de su entorno inmediato atendiendo a los derechos de las personas involucradas."},
    {"id": "OA 6", "description": "Resolver conflictos y desacuerdos mediante el diálogo, la escucha empática y la búsqueda de soluciones en forma respetuosa y sin violencia."},
    {"id": "OA 7", "description": "Reconocer intereses, inquietudes, problemas o necesidades compartidas con sus grupos de pertenencia y colaborar para alcanzar metas comunes."},
    {"id": "OA 8", "description": "Elaborar acuerdos orientados al logro de fines compartidos por el curso utilizando los espacios de participación disponibles, como Consejo de curso y asambleas."},
    {"id": "OA 9", "description": "Reconocer sus intereses, motivaciones, necesidades y capacidades, comprendiendo la relevancia del aprendizaje escolar sistemático."},
    {"id": "OA 10", "description": "Gestionar de manera autónoma sus propios procesos de aprendizaje escolar por medio del establecimiento de metas progresivas de aprendizaje."}
  ],
  "tecnologia": [
    {"id": "OA 1", "description": "Identificar necesidades personales o grupales del entorno cercano que impliquen soluciones de reparación, adaptación o mejora."},
    {"id": "OA 2", "description": "Diseñar e implementar soluciones que respondan a las necesidades de reparación, adaptación o mejora de objetos o entornos, haciendo uso eficiente de recursos."},
    {"id": "OA 3", "description": "Evaluar soluciones implementadas como respuesta a las necesidades de reparación, adaptación o mejora de objetos o entornos, aplicando criterios propios y técnicos."},
    {"id": "OA 4", "description": "Comunicar el diseño, la planificación u otros procesos de la resolución de necesidades de reparación, adaptación o mejora utilizando herramientas TIC."},
    {"id": "OA 5", "description": "Contrastar soluciones tecnológicas existentes de reparación, adaptación o mejora, identificando las necesidades a las que respondieron y el contexto."},
    {"id": "OA 6", "description": "Caracterizar algunos de los efectos que han tenido las soluciones tecnológicas existentes de reparación, adaptación o mejora, considerando aspectos sociales y ambientales."}
  ]
}

with open(curriculum_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("7th grade updated.")
