// Datos portados 1:1 del HTML original (public/index.html: _metodologias + caps-grid).
// 65 metodologías organizadas por fase de Design Thinking.

export interface Metodologia {
  id: string
  num: string
  title: string
  tag: string
  fase: string
  faseLabel: string
  tipo: string[]
  accent: string
  pills: string[]
  sample: string
  body: string
  cuando: string
  usuarios: string
  para: string
  pasos: string[]
  conclusiones: string
  tools: string[]
}

export const METODOLOGIAS: Metodologia[] = [
  {
    "id": "m01",
    "num": "#01 · Fase: Empatizar",
    "title": "Entrevistas en Profundidad",
    "tag": "① EMPATIZAR · METODOLOGÍA",
    "fase": "empatizar",
    "tipo": [
      "generativa",
      "moderada",
      "presencial"
    ],
    "accent": "linear-gradient(90deg,#6D28C7,#8C59FE)",
    "pills": [
      "Generativa",
      "Moderada",
      "Presencial"
    ],
    "sample": "5–8 por segmento",
    "body": "Comprender motivaciones, actitudes, comportamientos y contextos de uso a través de sesiones individuales de 45–90 min con técnicas de silencio y probes.",
    "cuando": "Al inicio de un proyecto o ante cambios de mercado significativos.",
    "usuarios": "5–8 por segmento. Producto nuevo: 5 por arquetipo. Producto maduro: hasta saturación ~12.",
    "para": "Comprender motivaciones, actitudes, comportamientos y contextos de uso.",
    "pasos": [
      "Diseñar guía semiestructurada de 45–90 min con preguntas abiertas.",
      "Reclutar perfil representativo (screener + incentivo).",
      "Conducir sesiones individuales con técnica de silencio estratégico y probes.",
      "Transcribir y codificar con affinity mapping o thematic analysis.",
      "Sintetizar en insight statements accionables."
    ],
    "conclusiones": "Modelos mentales, motivaciones latentes, puntos de dolor, citas textuales para storytelling.",
    "tools": [
      "Zoom / Google Meet",
      "Dovetail",
      "Lookback.io",
      "Otter.ai",
      "Notion"
    ],
    "faseLabel": "Empatizar"
  },
  {
    "id": "m02",
    "num": "#02 · Fase: Empatizar",
    "title": "5 Whys (5 Por Qués)",
    "tag": "① EMPATIZAR · METODOLOGÍA",
    "fase": "empatizar",
    "tipo": [
      "generativa",
      "moderada",
      "presencial"
    ],
    "accent": "linear-gradient(90deg,#0369A1,#0EA5E9)",
    "pills": [
      "Generativa",
      "Moderada",
      "Presencial"
    ],
    "sample": "No aplica; se usa con el equipo o en entrevistas",
    "body": "Descubrir la causa real detrás de un problema aparente preguntando \"¿Por qué?\" cinco veces consecutivas para evitar soluciones superficiales.",
    "cuando": "Cuando el problema ya está identificado y se necesita encontrar la causa raíz antes de idear soluciones.",
    "usuarios": "No aplica. Se usa con el equipo o en entrevistas.",
    "para": "Descubrir la causa real detrás de un problema aparente evitando soluciones superficiales.",
    "pasos": [
      "Formular el problema en una oración en el pizarrón.",
      "Preguntar \"¿Por qué?\" y escribir la respuesta como oración completa.",
      "Convertir la respuesta anterior en la siguiente pregunta \"¿Por qué?\".",
      "Repetir 5 veces (o hasta llegar al pain point real).",
      "Documentar la cadena de causas para compartir con el equipo."
    ],
    "conclusiones": "Causa raíz del problema, cadena causal documentada, punto de intervención de diseño más efectivo.",
    "tools": [
      "Whiteboard / FigJam",
      "Miro",
      "Papel y plumón"
    ],
    "faseLabel": "Empatizar"
  },
  {
    "id": "m03",
    "num": "#03 · Fase: Empatizar",
    "title": "Shadowing (Sombra)",
    "tag": "① EMPATIZAR · METODOLOGÍA",
    "fase": "empatizar",
    "tipo": [
      "generativa",
      "moderada",
      "presencial"
    ],
    "accent": "linear-gradient(90deg,#047857,#10B981)",
    "pills": [
      "Generativa",
      "Moderada",
      "Presencial"
    ],
    "sample": "5–10 usuarios observados en su contexto",
    "body": "Observar el comportamiento natural del usuario siguiéndolo de forma discreta en su entorno real para capturar comportamientos imposibles de auto-reportar.",
    "cuando": "Cuando no se puede replicar el contexto en laboratorio. Ideal para productos físico-digitales.",
    "usuarios": "5–10 usuarios observados en su contexto. Producto nuevo: 5 sesiones de 1–2h. Producto maduro: 8–10 para diversidad de contextos.",
    "para": "Observar el comportamiento natural del usuario siguiéndolo de forma discreta en su entorno real.",
    "pasos": [
      "Obtener consentimiento del usuario para ser acompañado.",
      "Seguir al usuario sin intervenir durante su actividad normal.",
      "Registrar acciones, decisiones, workarounds y emociones.",
      "Tomar fotos/notas del entorno y artefactos utilizados.",
      "Realizar entrevista breve al finalizar para clarificar lo observado."
    ],
    "conclusiones": "Comportamientos reales vs. reportados, artefactos de workaround, contexto físico de uso, fricciones no articuladas.",
    "tools": [
      "Cámara de video / GoPro",
      "Notas de campo",
      "Dovetail"
    ],
    "faseLabel": "Empatizar"
  },
  {
    "id": "m04",
    "num": "#04 · Fase: Empatizar",
    "title": "Empathy Map",
    "tag": "① EMPATIZAR · METODOLOGÍA",
    "fase": "empatizar",
    "tipo": [
      "generativa",
      "moderada",
      "presencial"
    ],
    "accent": "linear-gradient(90deg,#B45309,#F59E0B)",
    "pills": [
      "Generativa",
      "Moderada",
      "Presencial"
    ],
    "sample": "Actividad de equipo basada en investigación de 5–10 usuarios",
    "body": "Crear un cuadro empático del usuario (Says / Thinks / Does / Feels) que alinee al equipo en su perspectiva antes de definir y diseñar.",
    "cuando": "Después de investigación inicial para sintetizar y comunicar quién es el usuario al equipo.",
    "usuarios": "Actividad de equipo basada en investigación de 5–10 usuarios.",
    "para": "Crear un cuadro empático del usuario que alinee al equipo en su perspectiva antes de definir y diseñar.",
    "pasos": [
      "Dibujar el mapa en 4 cuadrantes: Says, Thinks, Does, Feels.",
      "Rellenar cada cuadrante con citas y observaciones de investigación.",
      "Identificar las tensiones entre lo que dice y lo que hace.",
      "Agregar sección de Pains y Gains en la parte inferior.",
      "Priorizar los insights más sorprendentes o accionables."
    ],
    "conclusiones": "Cuadro holístico del usuario, tensiones entre discurso y comportamiento, puntos de dolor y aspiraciones.",
    "tools": [
      "Miro",
      "FigJam",
      "Papel de estraza + post-its"
    ],
    "faseLabel": "Empatizar"
  },
  {
    "id": "m05",
    "num": "#05 · Fase: Empatizar",
    "title": "Método 6W (Who / What / Where / When / Why / How)",
    "tag": "① EMPATIZAR · METODOLOGÍA",
    "fase": "empatizar",
    "tipo": [
      "generativa",
      "moderada",
      "presencial"
    ],
    "accent": "linear-gradient(90deg,#9D174D,#EC4899)",
    "pills": [
      "Generativa",
      "Moderada",
      "Presencial"
    ],
    "sample": "Actividad de equipo; no requiere usuarios directos",
    "body": "Enmarcar el problema de investigación desde múltiples perspectivas respondiendo Who, What, Where, When, Why y How para identificar gaps de investigación.",
    "cuando": "Al inicio de un proyecto para enmarcar el problema de investigación desde múltiples perspectivas.",
    "usuarios": "Actividad de equipo; no requiere usuarios directos.",
    "para": "Obtener una comprensión fundamental del problema respondiendo las 6 preguntas base del periodismo aplicadas al diseño.",
    "pasos": [
      "Escribir el tema de investigación en el centro.",
      "Responder en equipo: Who (usuarios), What (problema), Where (contexto), When (momento), Why (motivación), How (comportamiento).",
      "Identificar las preguntas sin respuesta = gaps de investigación.",
      "Priorizar qué preguntas necesitan investigación directa con usuarios.",
      "Convertir los gaps en objetivos de research concretos."
    ],
    "conclusiones": "Mapa de lo conocido vs. desconocido, objetivos de investigación priorizados, plan de research inicial.",
    "tools": [
      "Whiteboard",
      "Miro",
      "FigJam",
      "Papel"
    ],
    "faseLabel": "Empatizar"
  },
  {
    "id": "m06",
    "num": "#06 · Fase: Empatizar",
    "title": "POEMS Framework",
    "tag": "① EMPATIZAR · METODOLOGÍA",
    "fase": "empatizar",
    "tipo": [
      "generativa",
      "moderada",
      "presencial"
    ],
    "accent": "linear-gradient(90deg,#1D4ED8,#3B82F6)",
    "pills": [
      "Generativa",
      "Moderada",
      "Presencial"
    ],
    "sample": "5–8 sesiones de observación",
    "body": "Capturar de forma estructurada todos los elementos del contexto de uso: Personas, Objects, Environments, Messages y Services en entornos físicos complejos.",
    "cuando": "Al observar comportamientos en entornos físicos o servicios complejos (hospitales, transporte, retail).",
    "usuarios": "5–8 sesiones de observación. Producto nuevo: mínimo 5. Producto maduro: 8–10 contextos variados.",
    "para": "Capturar de forma estructurada todos los elementos del contexto de uso: Personas, Objetos, Entornos, Mensajes y Servicios.",
    "pasos": [
      "Visitar el contexto de uso real con guía POEMS.",
      "Observar y documentar: People (quiénes están), Objects (artefactos), Environments (espacio físico), Messages (señalética, comunicación), Services (servicios presentes).",
      "Fotografiar y anotar cada categoría.",
      "Sintetizar patrones entre categorías.",
      "Identificar oportunidades de diseño en las intersecciones."
    ],
    "conclusiones": "Mapa contextual completo del entorno de uso, artefactos existentes, comportamientos sistémicos, oportunidades de diseño contextual.",
    "tools": [
      "Ficha de observación POEMS",
      "Cámara",
      "Dovetail"
    ],
    "faseLabel": "Empatizar"
  },
  {
    "id": "m07",
    "num": "#07 · Fase: Empatizar",
    "title": "Netnografía (Netnography)",
    "tag": "① EMPATIZAR · METODOLOGÍA",
    "fase": "empatizar",
    "tipo": [
      "generativa",
      "no-moderada",
      "remota"
    ],
    "accent": "linear-gradient(90deg,#5B21B6,#7C3AED)",
    "pills": [
      "Generativa",
      "No moderada",
      "Remota"
    ],
    "sample": "No aplica; se analiza comportamiento en comunidades online",
    "body": "Estudiar etnográficamente comunidades virtuales (Reddit, foros, Discord) para extraer insights sobre necesidades, lenguaje y comportamientos no mediados por el investigador.",
    "cuando": "Para entender comportamientos y discursos del usuario en comunidades online sin presencia del investigador.",
    "usuarios": "No aplica. Se analiza comportamiento en comunidades online. Producto nuevo: 3–5 comunidades durante 2–4 semanas. Producto maduro: monitoreo continuo + análisis mensual.",
    "para": "Estudiar etnográficamente comunidades virtuales para extraer insights sobre necesidades, lenguaje y comportamientos no mediados.",
    "pasos": [
      "Identificar comunidades online relevantes (Reddit, foros, Slack, Discord).",
      "Definir protocolo ético de observación (no participante o participante transparente).",
      "Observar y documentar durante 2–4 semanas los patrones de discusión.",
      "Codificar temáticamente los posts y comentarios más relevantes.",
      "Sintetizar vocabulario del usuario, patrones de necesidad y tensiones."
    ],
    "conclusiones": "Vocabulario real del usuario, patrones de necesidad sin filtros, tensiones de comunidad, inputs para hipótesis de producto.",
    "tools": [
      "Reddit",
      "Facebook Groups",
      "Brandwatch",
      "Audiense",
      "Dovetail"
    ],
    "faseLabel": "Empatizar"
  },
  {
    "id": "m08",
    "num": "#08 · Fase: Empatizar",
    "title": "Product Love Letters & Hate Letters",
    "tag": "① EMPATIZAR · METODOLOGÍA",
    "fase": "empatizar",
    "tipo": [
      "generativa",
      "no-moderada",
      "remota"
    ],
    "accent": "linear-gradient(90deg,#BE123C,#F43F5E)",
    "pills": [
      "Generativa",
      "No moderada",
      "Remota"
    ],
    "sample": "20–50 participantes",
    "body": "Obtener expresiones emocionales no filtradas sobre el producto invitando a los usuarios a escribir una carta de amor o de odio para revelar lo que realmente valoran o detestan.",
    "cuando": "Para entender las emociones más intensas que genera el producto, tanto positivas como negativas.",
    "usuarios": "20–50 participantes. Producto nuevo: 20 mínimo. Producto maduro: 50 para diversidad de perspectivas.",
    "para": "Obtener expresiones emocionales no filtradas sobre el producto que revelan lo que los usuarios realmente valoran o detestan.",
    "pasos": [
      "Invitar a usuarios a escribir una carta de amor o una carta de odio al producto (2 grupos separados o elección libre).",
      "Analizar las cartas con codificación temática emocional.",
      "Identificar atributos más valorados vs. más criticados.",
      "Extraer metáforas y vocabulario emocional del usuario.",
      "Presentar selección de cartas a stakeholders para crear empatía."
    ],
    "conclusiones": "Atributos emocionales del producto, vocabulario de amor/odio, jerarquía de lo que más importa al usuario, insights para branding y roadmap.",
    "tools": [
      "Typeform",
      "Google Forms",
      "Dovetail"
    ],
    "faseLabel": "Empatizar"
  },
  {
    "id": "m09",
    "num": "#09 · Fase: Definir",
    "title": "Customer Journey Mapping",
    "tag": "② DEFINIR · METODOLOGÍA",
    "fase": "definir",
    "tipo": [
      "generativa",
      "moderada",
      "presencial"
    ],
    "accent": "linear-gradient(90deg,#0F766E,#14B8A6)",
    "pills": [
      "Generativa",
      "Moderada",
      "Presencial"
    ],
    "sample": "Basado en 5–15 entrevistas como insumo",
    "body": "Visualizar la experiencia completa del usuario a lo largo del tiempo con emociones, touchpoints y puntos de dolor para comunicar oportunidades end-to-end a stakeholders.",
    "cuando": "Para comunicar la experiencia actual del usuario a stakeholders e identificar oportunidades end-to-end.",
    "usuarios": "Basado en 5–15 entrevistas como insumo. Producto nuevo: requiere investigación base previa. Producto maduro: validar con 5–8 usuarios representativos.",
    "para": "Visualizar la experiencia completa del usuario a lo largo del tiempo con emociones, touchpoints y puntos de dolor.",
    "pasos": [
      "Definir el scope: ¿qué journey se mapea y qué persona lo protagoniza?",
      "Mapear fases cronológicas de la experiencia.",
      "Para cada fase: acciones del usuario, pensamientos, emociones, touchpoints, responsable interno.",
      "Identificar picos emocionales negativos como prioridades de diseño.",
      "Validar el mapa con usuarios reales antes de presentarlo como definitivo."
    ],
    "conclusiones": "Momentos críticos, puntos de dolor prioritarios, oportunidades por fase, mapa de responsabilidades internas.",
    "tools": [
      "Miro",
      "FigJam",
      "Smaply",
      "UXPressia"
    ],
    "faseLabel": "Definir"
  },
  {
    "id": "m10",
    "num": "#10 · Fase: Definir",
    "title": "Mental Models Mapping",
    "tag": "② DEFINIR · METODOLOGÍA",
    "fase": "definir",
    "tipo": [
      "generativa",
      "moderada",
      "presencial"
    ],
    "accent": "linear-gradient(90deg,#92400E,#D97706)",
    "pills": [
      "Generativa",
      "Moderada",
      "Presencial"
    ],
    "sample": "10–15 entrevistas para identificar patrones",
    "body": "Mapear cómo los usuarios organizan mentalmente un dominio extrayendo \"tareas mentales\" de las entrevistas para alinear el diseño con sus modelos e identificar gaps de producto.",
    "cuando": "Al rediseñar productos complejos para entender cómo piensan los usuarios sobre el dominio.",
    "usuarios": "10–15 entrevistas para identificar patrones. Producto nuevo: 8–10 entrevistas base. Producto maduro: 15+ para diversidad de modelos.",
    "para": "Mapear cómo los usuarios organizan mentalmente un dominio para alinear el diseño con esos modelos.",
    "pasos": [
      "Analizar transcripciones extrayendo \"tareas mentales\" del usuario.",
      "Agrupar tareas en clústeres de comportamiento similares.",
      "Construir el diagrama con torres de modelos mentales de arriba hacia abajo.",
      "Alinear las features actuales del producto con el modelo del usuario.",
      "Identificar gaps: qué hace el usuario que el producto no contempla."
    ],
    "conclusiones": "Diagrama de modelos mentales, gaps entre modelo del usuario y modelo del sistema, oportunidades de diseño.",
    "tools": [
      "Miro",
      "Mental Model Diagrams (Indi Young)",
      "Dovetail"
    ],
    "faseLabel": "Definir"
  },
  {
    "id": "m11",
    "num": "#11 · Fase: Definir",
    "title": "User Personas (Evidence-Based)",
    "tag": "② DEFINIR · METODOLOGÍA",
    "fase": "definir",
    "tipo": [
      "generativa",
      "moderada",
      "presencial"
    ],
    "accent": "linear-gradient(90deg,#1D4ED8,#3B82F6)",
    "pills": [
      "Generativa",
      "Moderada",
      "Presencial"
    ],
    "sample": "Basado en 15–30 entrevistas + datos cuantitativos",
    "body": "Sintetizar perfiles de usuario representativos y basados en evidencia (15–30 entrevistas + datos cuantitativos) para guiar decisiones de diseño y alinear al equipo.",
    "cuando": "Después de investigación generativa inicial, para comunicar quién es el usuario real al equipo.",
    "usuarios": "Basado en 15–30 entrevistas + datos cuantitativos. Producto nuevo: 15 entrevistas mínimo. Producto maduro: cruzar con analytics y CRM.",
    "para": "Sintetizar perfiles de usuario representativos y basados en evidencia para guiar decisiones de diseño.",
    "pasos": [
      "Identificar clusters de comportamiento en los datos de investigación.",
      "Crear 2–4 personas con: nombre, foto (ilustración), cita representativa, goals, frustraciones, comportamientos y contexto.",
      "Validar las personas con datos cuantitativos de analytics.",
      "Asegurarse de que cada persona tiene una need statement accionable.",
      "Publicar y mantener vivas (actualizar trimestral o semestralmente)."
    ],
    "conclusiones": "2–4 perfiles accionables, definición de usuario primario, inputs para features y priorización.",
    "tools": [
      "Figma",
      "Notion",
      "HubSpot",
      "Dovetail",
      "Miro"
    ],
    "faseLabel": "Definir"
  },
  {
    "id": "m12",
    "num": "#12 · Fase: Definir",
    "title": "Jobs-to-be-Done (JTBD)",
    "tag": "② DEFINIR · METODOLOGÍA",
    "fase": "definir",
    "tipo": [
      "generativa",
      "moderada",
      "presencial"
    ],
    "accent": "linear-gradient(90deg,#065F46,#10B981)",
    "pills": [
      "Generativa",
      "Moderada",
      "Presencial"
    ],
    "sample": "10–15 entrevistas hasta saturación de jobs",
    "body": "Entender el progreso funcional, emocional y social que el usuario busca al \"contratar\" un producto, usando el Switch Interview para mapear fuerzas de empuje y jalón.",
    "cuando": "Al definir estrategia de producto, roadmap o propuesta de valor.",
    "usuarios": "10–15 entrevistas hasta saturación de jobs. Producto nuevo: 8–10 por segmento. Producto maduro: 15 para cobertura de variantes.",
    "para": "Entender el progreso funcional, emocional y social que el usuario busca al contratar un producto.",
    "pasos": [
      "Reclutar usuarios que recientemente tomaron la decisión de adoptar o cambiar de solución.",
      "Usar protocolo Switch Interview: ¿Cuándo decidiste cambiar? ¿Qué pasó ese día?",
      "Mapear fuerzas de empuje (push) del producto viejo y fuerzas de jalón (pull) del nuevo.",
      "Identificar jobs principales y colaterales con sus criterios de éxito.",
      "Sintetizar los hallazgos en un JTBD Canvas para el equipo."
    ],
    "conclusiones": "Jobs principales y colaterales, fuerzas de atracción/fricción, criterios de éxito del usuario, inputs para value proposition.",
    "tools": [
      "Grain",
      "Dovetail",
      "Otter.ai",
      "Miro (JTBD canvas)"
    ],
    "faseLabel": "Definir"
  },
  {
    "id": "m13",
    "num": "#13 · Fase: Definir",
    "title": "How Might We (HMW)",
    "tag": "② DEFINIR · METODOLOGÍA",
    "fase": "definir",
    "tipo": [
      "generativa",
      "moderada",
      "presencial"
    ],
    "accent": "linear-gradient(90deg,#92400E,#F59E0B)",
    "pills": [
      "Generativa",
      "Moderada",
      "Presencial"
    ],
    "sample": "Actividad de equipo (5–8 participantes)",
    "body": "Convertir los problemas del usuario en preguntas de diseño accionables (\"¿Cómo podríamos…?\") que estimulen la generación de ideas en la fase de ideación.",
    "cuando": "Después de investigación, al pasar de insights a preguntas que inspiren ideación.",
    "usuarios": "Actividad de equipo (5–8 participantes). Producto nuevo: parte del ritual de kick-off de diseño. Producto maduro: integrado al sprint planning.",
    "para": "Convertir los problemas del usuario en preguntas de diseño accionables que estimulen la generación de ideas.",
    "pasos": [
      "Compartir los insights más importantes de investigación.",
      "Para cada insight, generar 3–5 preguntas HMW que lo reformulen como oportunidad.",
      "Escribir cada HMW en un post-it independiente.",
      "Agrupar HMWs por tema y eliminar duplicados.",
      "Votar los HMWs más prometedores para llevar a la fase de ideación."
    ],
    "conclusiones": "Set de preguntas HMW priorizadas que guían la fase de ideación con foco en el usuario.",
    "tools": [
      "Post-its",
      "Miro",
      "FigJam",
      "Whiteboard"
    ],
    "faseLabel": "Definir"
  },
  {
    "id": "m14",
    "num": "#14 · Fase: Definir",
    "title": "Stakeholder Map",
    "tag": "② DEFINIR · METODOLOGÍA",
    "fase": "definir",
    "tipo": [
      "generativa",
      "moderada",
      "presencial"
    ],
    "accent": "linear-gradient(90deg,#6D28C7,#A78BFA)",
    "pills": [
      "Generativa",
      "Moderada",
      "Presencial"
    ],
    "sample": "Mapear a todos los stakeholders del ecosistema del producto",
    "body": "Visualizar el ecosistema de stakeholders en una matriz Influencia/Interés para planificar la comunicación, identificar aliados y anticipar riesgos políticos del proyecto.",
    "cuando": "Al inicio de un proyecto para identificar a todos los involucrados y sus niveles de influencia e interés.",
    "usuarios": "Mapear a todos los stakeholders del ecosistema del producto. Producto nuevo: primer paso en proyectos nuevos. Producto maduro: actualizar trimestral o en cada hito.",
    "para": "Visualizar el ecosistema de stakeholders para planificar la comunicación y gestión del cambio de forma estratégica.",
    "pasos": [
      "Hacer lluvia de ideas de todos los posibles stakeholders.",
      "Ubicarlos en una matriz 2x2 de Influencia (alta/baja) vs. Interés (alto/bajo).",
      "Definir estrategia de comunicación para cada cuadrante.",
      "Identificar stakeholders que pueden bloquear o acelerar el proyecto.",
      "Planificar entrevistas con los más críticos."
    ],
    "conclusiones": "Mapa visual de stakeholders, estrategia de comunicación diferenciada, identificación de aliados y riesgos políticos.",
    "tools": [
      "Miro",
      "FigJam",
      "Figma",
      "Excel"
    ],
    "faseLabel": "Definir"
  },
  {
    "id": "m15",
    "num": "#15 · Fase: Idear",
    "title": "Crazy 8s",
    "tag": "③ IDEAR · METODOLOGÍA",
    "fase": "idear",
    "tipo": [
      "generativa",
      "moderada",
      "presencial"
    ],
    "accent": "linear-gradient(90deg,#BE185D,#EC4899)",
    "pills": [
      "Generativa",
      "Moderada",
      "Presencial"
    ],
    "sample": "Actividad de equipo (4–8 participantes)",
    "body": "Generar 8 bocetos de soluciones distintas en 8 minutos para forzar creatividad, evitar la primera idea obvia y producir un banco visual diverso listo para votación.",
    "cuando": "Al inicio de la fase de ideación para generar volumen de ideas rápidamente antes de profundizar.",
    "usuarios": "Actividad de equipo (4–8 participantes). Producto nuevo: excelente para equipos sin práctica de ideación. Producto maduro: integrado en talleres de sprint o design studios.",
    "para": "Generar 8 bocetos de soluciones distintas en 8 minutos para forzar creatividad y evitar la primera idea obvia.",
    "pasos": [
      "Doblar la hoja A4 en 8 partes iguales.",
      "Poner el timer en 8 minutos (1 min por cuadro).",
      "Cada participante dibuja 8 ideas distintas para el HMW elegido.",
      "Sin juzgar: cantidad sobre calidad.",
      "Compartir y votar las ideas más prometedoras con dot voting."
    ],
    "conclusiones": "Banco de ideas visual diverso, ideas inesperadas para prototipar, inputs para el Design Studio o sketching formal.",
    "tools": [
      "Papel doblado en 8",
      "Cronómetro",
      "FigJam (versión digital)",
      "Sharpies"
    ],
    "faseLabel": "Idear"
  },
  {
    "id": "m16",
    "num": "#16 · Fase: Idear",
    "title": "Bodystorming",
    "tag": "③ IDEAR · METODOLOGÍA",
    "fase": "idear",
    "tipo": [
      "generativa",
      "moderada",
      "presencial"
    ],
    "accent": "linear-gradient(90deg,#0F766E,#2DD4BF)",
    "pills": [
      "Generativa",
      "Moderada",
      "Presencial"
    ],
    "sample": "5–10 participantes del equipo + potenciales usuarios si es posible",
    "body": "Experimentar físicamente el contexto de uso actuando el escenario completo para descubrir fricciones e insights que no emergen en abstracciones sobre papel.",
    "cuando": "Para diseñar servicios, experiencias físicas o flujos de onboarding que impliquen interacciones con el cuerpo y el espacio.",
    "usuarios": "5–10 participantes del equipo + potenciales usuarios si es posible. Producto nuevo: mínimo 4 participantes. Producto maduro: con usuarios reales como participantes.",
    "para": "Experimentar el contexto de uso físicamente para descubrir insights que no emergen en abstracciones en papel.",
    "pasos": [
      "Configurar el espacio físico para simular el contexto de uso.",
      "Asignar roles: usuario, sistema, servicio, observadores.",
      "Actuar el escenario de uso completo como si fuera real.",
      "Pausar cuando surgen fricciones y explorar soluciones en el momento.",
      "Documentar en video y debriefear con el equipo inmediatamente después."
    ],
    "conclusiones": "Fricciones físicas del servicio, soluciones emergentes de la experiencia corporal, requisitos de diseño espacial/secuencial.",
    "tools": [
      "Espacio físico configurable",
      "Props / artefactos del servicio",
      "Cámara de video",
      "Post-its"
    ],
    "faseLabel": "Idear"
  },
  {
    "id": "m17",
    "num": "#17 · Fase: Idear",
    "title": "Service Blueprint",
    "tag": "③ IDEAR · METODOLOGÍA",
    "fase": "idear",
    "tipo": [
      "generativa",
      "moderada",
      "presencial"
    ],
    "accent": "linear-gradient(90deg,#1E3A5F,#2D6A9F)",
    "pills": [
      "Generativa",
      "Moderada",
      "Presencial"
    ],
    "sample": "Actividad de equipo multidisciplinario; validar con 5–8 usuarios",
    "body": "Visualizar la arquitectura completa del servicio: acciones del cliente, frontstage, backstage y sistemas de soporte, para revelar ineficiencias y puntos de fallo operativos.",
    "cuando": "Al diseñar o rediseñar servicios complejos con múltiples touchpoints y responsabilidades internas.",
    "usuarios": "Actividad de equipo multidisciplinario; validar con 5–8 usuarios. Producto nuevo: con investigación previa de journey map. Producto maduro: mantener actualizado con cada cambio de servicio.",
    "para": "Visualizar la arquitectura completa del servicio incluyendo acciones del usuario, frontstage, backstage y sistemas de soporte.",
    "pasos": [
      "Definir el escenario de servicio a mapear.",
      "Construir las 5 filas: Evidencia física, Acciones del cliente, Acciones frontstage (visibles), Acciones backstage (invisibles), Sistemas de soporte.",
      "Identificar líneas de interacción, visibilidad e interacción interna.",
      "Marcar momentos de verdad y puntos de fallo potencial.",
      "Priorizar mejoras por impacto en usuario vs. esfuerzo operativo."
    ],
    "conclusiones": "Mapa completo del servicio, responsabilidades internas clarificadas, puntos de fallo detectados, oportunidades de automatización o simplificación.",
    "tools": [
      "Miro",
      "Smaply",
      "FigJam",
      "Confluence"
    ],
    "faseLabel": "Idear"
  },
  {
    "id": "m18",
    "num": "#18 · Fase: Idear",
    "title": "Walt Disney Method",
    "tag": "③ IDEAR · METODOLOGÍA",
    "fase": "idear",
    "tipo": [
      "generativa",
      "moderada",
      "presencial"
    ],
    "accent": "linear-gradient(90deg,#7C2D12,#EA580C)",
    "pills": [
      "Generativa",
      "Moderada",
      "Presencial"
    ],
    "sample": "Actividad de equipo (5–10 participantes)",
    "body": "Examinar un problema desde tres perspectivas en rondas separadas: el Soñador (posibilidades sin límite), el Realista (implementación) y el Crítico (riesgos y filtro).",
    "cuando": "Cuando el equipo necesita generar ideas ambiciosas y luego evaluarlas de forma estructurada.",
    "usuarios": "Actividad de equipo (5–10 participantes). Producto nuevo: excelente para equipos que tienden a autocensurarse. Producto maduro: para desbloquear ideación estratégica con stakeholders.",
    "para": "Examinar un problema desde tres perspectivas distintas: el soñador (posibilidades sin límite), el realista (implementación) y el crítico (riesgos).",
    "pasos": [
      "Ronda 1 – El Soñador: generar ideas sin restricciones, todo es posible.",
      "Ronda 2 – El Realista: ¿cómo se podría implementar cada idea? ¿qué recursos necesita?",
      "Ronda 3 – El Crítico: ¿qué podría fallar? ¿qué riesgos existen?",
      "Integrar el feedback del Crítico para mejorar las ideas del Soñador.",
      "Seleccionar las ideas más robustas para prototipar."
    ],
    "conclusiones": "Ideas ambiciosas refinadas con criterio de viabilidad y riesgo, propuestas de prototipado priorizadas.",
    "tools": [
      "Miro",
      "FigJam",
      "3 espacios físicos o zonas del lienzo"
    ],
    "faseLabel": "Idear"
  },
  {
    "id": "m19",
    "num": "#19 · Fase: Prototipar",
    "title": "Wizard of Oz Prototype",
    "tag": "④ PROTOTIPAR · METODOLOGÍA",
    "fase": "prototipar",
    "tipo": [
      "evaluativa",
      "moderada",
      "presencial"
    ],
    "accent": "linear-gradient(90deg,#312E81,#6366F1)",
    "pills": [
      "Evaluativa",
      "Moderada",
      "Presencial"
    ],
    "sample": "5–8 usuarios por ronda de prueba",
    "body": "Simular una funcionalidad no implementada (IA, chatbots, recomendaciones) con intervención humana en tiempo real para obtener feedback genuino antes de construirla.",
    "cuando": "Para probar funcionalidades que no existen aún, especialmente IA, chatbots, sistemas de recomendación.",
    "usuarios": "5–8 usuarios por ronda de prueba. Producto nuevo: 5 usuarios mínimo por iteración. Producto maduro: 8 para detectar variaciones de comportamiento.",
    "para": "Simular una funcionalidad no implementada con intervención humana en tiempo real para obtener feedback genuino del usuario.",
    "pasos": [
      "Definir qué funcionalidad se va a simular.",
      "Diseñar cómo el \"mago\" (humano en backstage) simulará la respuesta del sistema.",
      "Entrenar al mago con protocolo de respuestas consistentes.",
      "Correr la sesión: el usuario interactúa creyendo que es el sistema real.",
      "Observar comportamientos y reacciones; al finalizar, revelar el método y hacer debrief."
    ],
    "conclusiones": "Validación de la propuesta de valor antes de construcción, comportamientos naturales con la funcionalidad, requerimientos técnicos emergentes, decisión de continuar/pivotar.",
    "tools": [
      "Figma / PowerPoint (pantallas)",
      "Slack / WhatsApp (simulación de respuestas)",
      "Cámara de grabación",
      "Tablet para el usuario"
    ],
    "faseLabel": "Prototipar"
  },
  {
    "id": "m20",
    "num": "#20 · Fase: Prototipar",
    "title": "Dark Horse Prototype",
    "tag": "④ PROTOTIPAR · METODOLOGÍA",
    "fase": "prototipar",
    "tipo": [
      "generativa",
      "moderada",
      "presencial"
    ],
    "accent": "linear-gradient(90deg,#1F2937,#4B5563)",
    "pills": [
      "Generativa",
      "Moderada",
      "Presencial"
    ],
    "sample": "5 usuarios para prueba rápida del concepto más arriesgado",
    "body": "Prototipar deliberadamente la solución más arriesgada o inesperada para descubrir aprendizajes imposibles con ideas convencionales y evitar enamorarse de la primera solución.",
    "cuando": "Cuando el equipo tiende a la solución obvia. Para forzar la exploración de la idea más radical con mayor potencial.",
    "usuarios": "5 usuarios para prueba rápida del concepto más arriesgado. Producto nuevo: mínimo 3 usuarios antes de descartar. Producto maduro: 5 para validar antes de comprometerse con una dirección.",
    "para": "Prototipar deliberadamente la solución más arriesgada o inesperada para descubrir aprendizajes imposibles con las ideas convencionales.",
    "pasos": [
      "Identificar la idea más radical o arriesgada del banco de ideas.",
      "Construir un prototipo rápido de esa idea (sin pulirla).",
      "Probarla con 3–5 usuarios con script mínimo.",
      "Documentar los aprendizajes sorprendentes.",
      "Decidir qué elementos incorporar a la solución principal."
    ],
    "conclusiones": "Aprendizajes no convencionales, atributos valiosos de la idea radical para integrar, evidencia para tomar riesgos calculados.",
    "tools": [
      "Materiales físicos",
      "Figma (lo-fi)",
      "Marvel App"
    ],
    "faseLabel": "Prototipar"
  },
  {
    "id": "m21",
    "num": "#21 · Fase: Prototipar",
    "title": "Prototipado en Papel",
    "tag": "④ PROTOTIPAR · METODOLOGÍA",
    "fase": "prototipar",
    "tipo": [
      "evaluativa",
      "moderada",
      "presencial"
    ],
    "accent": "linear-gradient(90deg,#1F2937,#4B5563)",
    "pills": [
      "Evaluativa",
      "Moderada",
      "Presencial"
    ],
    "sample": "3–5 usuarios para feedback rápido",
    "body": "Crear y probar prototipos en papel para validar flujos de navegación e ideas de interfaz de forma rápida y económica antes de invertir en Figma.",
    "cuando": "En fases tempranas de diseño para probar flujos y conceptos sin invertir en Figma.",
    "usuarios": "3–5 usuarios para feedback rápido. Producto nuevo: 3 usuarios por iteración. Producto maduro: 5 para validar decisiones de flujo.",
    "para": "Crear y probar prototipos en papel para validar flujos de navegación e ideas de interfaz de forma rápida y económica.",
    "pasos": [
      "Dibujar cada pantalla del flujo en papel A4.",
      "Añadir elementos interactivos recortables (dropdowns, modales).",
      "Ejecutar prueba: un equipo simula el sistema moviendo los papeles mientras el usuario \"hace clic\".",
      "Observar dónde el usuario se pierde o titubea.",
      "Iterar el papel en el momento si el problema es claro."
    ],
    "conclusiones": "Flujos de navegación validados o invalidados, problemas de organización de pantallas, decisiones de diseño rápidas para pasar a Figma.",
    "tools": [
      "Papel, lápiz, tijeras",
      "Cámara para documentar",
      "Lookback.io (para grabación remota si se escanea)"
    ],
    "faseLabel": "Prototipar"
  },
  {
    "id": "m50",
    "num": "#50 · Fase: Medir",
    "title": "NPS + Follow-up Cualitativo",
    "tag": "⑥ MEDIR · METODOLOGÍA",
    "fase": "medir",
    "tipo": [
      "evaluativa",
      "no-moderada",
      "remota"
    ],
    "accent": "linear-gradient(90deg,#1E3A5F,#1E40AF)",
    "pills": [
      "Evaluativa",
      "No moderada",
      "Remota"
    ],
    "sample": "200 respuestas NPS; 8–15 entrevistas de follow-up con detractores",
    "body": "Complementar el score NPS cuantitativo con entrevistas a detractores para entender las causas del descontento y priorizar las mejoras que convierten detractores en promotores.",
    "cuando": "Como práctica mensual continua; especialmente al detectar caída en el score NPS.",
    "usuarios": "200 respuestas NPS; 8–15 entrevistas de follow-up con detractores. Producto nuevo: 150+ NPS; 8 entrevistas. Producto maduro: continuo NPS + entrevistas mensuales con detractores. Ideal con MAU >500.",
    "para": "Complementar el score NPS cuantitativo con entrevistas cualitativas a detractores para entender las causas del descontento.",
    "pasos": [
      "Correr NPS de forma continua (transaccional o relacional).",
      "Identificar a los detractores (0–6) que dejaron comentario cualitativo.",
      "Contactar a detractores para entrevistas de 30 min: \"¿Qué te haría cambiar a promotor?\"",
      "Codificar los temas más frecuentes entre detractores.",
      "Priorizar las mejoras que convertirían más detractores en promotores."
    ],
    "conclusiones": "Score NPS + causas cualitativas del descontento, top 3–5 temas de mejora accionables, ROI estimado de reducir churn.",
    "tools": [
      "Delighted",
      "Typeform",
      "Dovetail",
      "Zoom"
    ],
    "faseLabel": "Medir"
  },
  {
    "id": "m49",
    "num": "#49 · Fase: Medir",
    "title": "Análisis de Heatmaps y Session Recordings",
    "tag": "⑥ MEDIR · METODOLOGÍA",
    "fase": "medir",
    "tipo": [
      "evaluativa",
      "no-moderada",
      "remota"
    ],
    "accent": "linear-gradient(90deg,#7F1D1D,#B91C1C)",
    "pills": [
      "Evaluativa",
      "No moderada",
      "Remota"
    ],
    "sample": "Mín. 100 sesiones para heatmaps representativos",
    "body": "Visualizar patrones reales de clics, scroll y movimiento del cursor en páginas críticas para detectar dead clicks, elementos ignorados y problemas de affordance sin interrumpir al usuario.",
    "cuando": "Para entender cómo interactúan los usuarios con páginas específicas.",
    "usuarios": "Mín. 100 sesiones para heatmaps representativos. Producto nuevo: 500+ para primeros patrones. Producto maduro: 1000+ sesiones para análisis segmentado. Ideal con DAU >200.",
    "para": "Visualizar patrones de interacción real: clics, scroll, movimiento de cursor.",
    "pasos": [
      "Instalar el tracker con consentimiento (GDPR/CCPA).",
      "Definir las páginas críticas a monitorear.",
      "Acumular sesiones durante 2–4 semanas.",
      "Analizar heatmaps de clic, movimiento y scroll por segmento.",
      "Revisar grabaciones específicas de rage clicks y funnels abandonados."
    ],
    "conclusiones": "Áreas de alto y bajo engagement, dead clicks, elementos ignorados, problemas de affordance.",
    "tools": [
      "Hotjar",
      "FullStory",
      "Microsoft Clarity (gratis)",
      "Heap",
      "LogRocket"
    ],
    "faseLabel": "Medir"
  },
  {
    "id": "m48",
    "num": "#48 · Fase: Definir",
    "title": "Benchmarking Competitivo de UX",
    "tag": "② DEFINIR · METODOLOGÍA",
    "fase": "definir",
    "tipo": [
      "evaluativa",
      "moderada",
      "remota"
    ],
    "accent": "linear-gradient(90deg,#0F172A,#334155)",
    "pills": [
      "Evaluativa",
      "Moderada",
      "Remota"
    ],
    "sample": "No aplica (análisis de productos competidores)",
    "body": "Entender el estado del arte de la experiencia en el mercado evaluando 3–10 competidores con una rúbrica definida para identificar oportunidades de diferenciación y gaps del propio producto.",
    "cuando": "Al inicio de un proyecto, antes de rediseños estratégicos, o trimestralmente.",
    "usuarios": "No aplica (análisis de productos competidores). Producto nuevo: evaluar 3–5 competidores. Producto maduro: tracker continuo de 5–10 competidores.",
    "para": "Entender el estado del arte de la experiencia en el mercado e identificar oportunidades de diferenciación.",
    "pasos": [
      "Seleccionar 3–10 competidores con criterios explícitos.",
      "Definir la rúbrica de evaluación (heurísticas + funcionalidades + flujos críticos).",
      "Completar el flujo completo como usuario de cada competidor.",
      "Capturar pantallas clave y anotar con criterios definidos.",
      "Crear la matriz comparativa e identificar gaps del propio producto."
    ],
    "conclusiones": "Mapa de posicionamiento UX, mejores prácticas del sector, oportunidades de diferenciación, gaps de funcionalidad.",
    "tools": [
      "Figma (capturas anotadas)",
      "Notion / Confluence",
      "Heuristic Evaluation templates",
      "BuiltWith"
    ],
    "faseLabel": "Definir"
  },
  {
    "id": "m47",
    "num": "#47 · Fase: Testear",
    "title": "Eye Tracking",
    "tag": "⑤ TESTEAR · METODOLOGÍA",
    "fase": "testear",
    "tipo": [
      "evaluativa",
      "moderada",
      "presencial"
    ],
    "accent": "linear-gradient(90deg,#1E1B4B,#3730A3)",
    "pills": [
      "Evaluativa",
      "Moderada",
      "Presencial"
    ],
    "sample": "15–30 participantes para heatmaps confiables",
    "body": "Medir con precisión dónde miran los usuarios en un diseño usando heatmaps y gaze plots para optimizar jerarquía visual, atención y posicionamiento de CTAs en layouts de alta densidad.",
    "cuando": "Para optimizar layouts de alta densidad informativa (ecommerce, dashboards, landing pages).",
    "usuarios": "15–39 participantes para heatmaps confiables. Producto nuevo: 15 mínimo. Producto maduro: 30–40 para análisis AOI.",
    "para": "Medir con precisión dónde miran los usuarios en un diseño para optimizar jerarquía visual y atención.",
    "pasos": [
      "Calibrar el eye tracker para cada participante.",
      "Los participantes realizan tareas o escanean diseños libremente.",
      "Generar gaze plots, heatmaps de fijación y AOIs.",
      "Analizar trayectoria visual típica y tiempo de primera fijación en elementos críticos.",
      "Correlacionar patrones de atención con tasa de éxito en las tareas."
    ],
    "conclusiones": "Heatmaps de atención, trayectorias visuales, elementos ignorados, tiempo hasta fijación en CTA, recomendaciones de jerarquía.",
    "tools": [
      "Tobii Pro (hardware)",
      "iMotions",
      "GazeRecorder (webcam)",
      "Figma (estímulos)"
    ],
    "faseLabel": "Testear"
  },
  {
    "id": "m46",
    "num": "#46 · Fase: Testear",
    "title": "Investigación de Onboarding",
    "tag": "⑤ TESTEAR · METODOLOGÍA",
    "fase": "testear",
    "tipo": [
      "evaluativa",
      "moderada",
      "remota"
    ],
    "accent": "linear-gradient(90deg,#134E4A,#0F766E)",
    "pills": [
      "Evaluativa",
      "Moderada",
      "Remota"
    ],
    "sample": "8–15 usuarios nuevos (primera vez en el producto)",
    "body": "Optimizar la primera experiencia del usuario para maximizar activación y retención temprana, identificando el aha moment y los puntos de abandono en el flujo de onboarding.",
    "cuando": "Al lanzar el producto, al detectar drop-offs en onboarding, o al cambiar el flujo de activación.",
    "usuarios": "8–15 usuarios nuevos (primera vez en el producto). Producto nuevo: crítico desde el primer usuario. Producto maduro: monitorear continuamente con analytics + pruebas periódicas. Alta prioridad si retención D1 <40%.",
    "para": "Optimizar la primera experiencia del usuario para maximizar la activación y retención temprana.",
    "pasos": [
      "Analizar el funnel de onboarding con analytics: ¿dónde se pierden los usuarios?",
      "Reclutar usuarios completamente nuevos para sesiones moderadas.",
      "Observar el onboarding completo sin intervenir; registrar momentos de confusión.",
      "Identificar el \"aha moment\": ¿cuándo el usuario percibe el valor por primera vez?",
      "Proponer simplificaciones e iterar con A/B tests."
    ],
    "conclusiones": "Completion rate del onboarding, puntos de abandono, tiempo hasta activación, aha moment identificado, recomendaciones de simplificación.",
    "tools": [
      "Fullstory",
      "Hotjar",
      "UserTesting",
      "Maze",
      "Amplitude (cohortes)"
    ],
    "faseLabel": "Testear"
  },
  {
    "id": "m45",
    "num": "#45 · Fase: Medir",
    "title": "SUS (System Usability Scale)",
    "tag": "⑥ MEDIR · METODOLOGÍA",
    "fase": "medir",
    "tipo": [
      "evaluativa",
      "no-moderada",
      "remota"
    ],
    "accent": "linear-gradient(90deg,#1F2937,#374151)",
    "pills": [
      "Evaluativa",
      "No moderada",
      "Remota"
    ],
    "sample": "12–14 participantes para confiabilidad mínima",
    "body": "Obtener un score de usabilidad percibida (0–100) con 10 ítems estandarizados para comparar iteraciones, benchmark contra la industria y correlacionar con hallazgos cualitativos.",
    "cuando": "Al final de una prueba de usabilidad para obtener un score estandarizado y comparable.",
    "usuarios": "12–14 participantes para confiabilidad mínima. Producto nuevo: 5 en pruebas exploratorias. Producto maduro: 30+ para benchmarks comparativos.",
    "para": "Obtener un score de usabilidad percibida (0–100) comparable con benchmarks de la industria.",
    "pasos": [
      "Administrar los 10 ítems alternos positivos/negativos al finalizar las pruebas.",
      "Calcular: (suma positivos − 5) + (25 − suma negativos) × 2.5.",
      "Clasificar: >80 Excellent, >68 Good, 51–67 OK, <51 Poor.",
      "Comparar con iteraciones anteriores o con competidores si hay datos.",
      "Correlacionar el SUS con los problemas cualitativos identificados."
    ],
    "conclusiones": "Score SUS con categoría, comparativa con iteraciones anteriores o competidores, correlación con problemas cualitativos.",
    "tools": [
      "Typeform",
      "Google Forms",
      "Qualtrics",
      "Maze (integrado)"
    ],
    "faseLabel": "Medir"
  },
  {
    "id": "m44",
    "num": "#44 · Fase: Testear",
    "title": "Five-Second Test",
    "tag": "⑤ TESTEAR · METODOLOGÍA",
    "fase": "testear",
    "tipo": [
      "evaluativa",
      "no-moderada",
      "remota"
    ],
    "accent": "linear-gradient(90deg,#7C2D12,#EA580C)",
    "pills": [
      "Evaluativa",
      "No moderada",
      "Remota"
    ],
    "sample": "20–50 participantes",
    "body": "Medir la primera impresión y claridad de comunicación de un diseño mostrándolo 5 segundos y preguntando qué recuerda el usuario para validar si la propuesta de valor es inmediatamente legible.",
    "cuando": "Para evaluar si un diseño comunica su propuesta de valor en los primeros segundos.",
    "usuarios": "20–50 participantes. Producto nuevo: 20 mínimo. Producto maduro: 30–50.",
    "para": "Medir la primera impresión y la claridad de comunicación de un diseño en muy poco tiempo.",
    "pasos": [
      "Mostrar el diseño por exactamente 5 segundos.",
      "Retirar la imagen y preguntar: \"¿De qué trata esto?\" \"¿Qué recuerdas?\" \"¿Qué harías después?\"",
      "Analizar respuestas con frecuencia de palabras.",
      "Si la propuesta de valor no aparece en las respuestas, el diseño necesita revisión.",
      "Iterar y volver a testar hasta que el mensaje sea claro para >70% de participantes."
    ],
    "conclusiones": "Información retenida en 5 segundos, claridad de propuesta de valor, elementos visuales más llamativos.",
    "tools": [
      "Lyssna",
      "Maze",
      "UXtweak"
    ],
    "faseLabel": "Testear"
  },
  {
    "id": "m43",
    "num": "#43 · Fase: Testear",
    "title": "First Click Testing",
    "tag": "⑤ TESTEAR · METODOLOGÍA",
    "fase": "testear",
    "tipo": [
      "evaluativa",
      "no-moderada",
      "remota"
    ],
    "accent": "linear-gradient(90deg,#701A75,#C026D3)",
    "pills": [
      "Evaluativa",
      "No moderada",
      "Remota"
    ],
    "sample": "20–50 participantes",
    "body": "Evaluar la intuitividad del diseño midiendo dónde hace clic el usuario primero al ver una pantalla estática, generando heatmaps y tasas de éxito para optimizar jerarquía visual.",
    "cuando": "Para validar si el primer punto de clic en un diseño es el correcto, especialmente en navegación y CTAs.",
    "usuarios": "20–50 participantes. Producto nuevo: 20 mínimo. Producto maduro: 50 para análisis por segmento.",
    "para": "Evaluar la intuitividad del diseño midiendo dónde hace clic el usuario primero para completar una tarea.",
    "pasos": [
      "Mostrar una pantalla estática (sin interactividad).",
      "El usuario hace clic donde cree que debe ir para completar la tarea.",
      "Registrar área de clic, tiempo hasta primer clic y tasa de éxito.",
      "Generar heatmap de clics para visualizar patrones.",
      "Optimizar el diseño si la tasa de éxito es <80%."
    ],
    "conclusiones": "Tasa de éxito del primer clic (>80% = buen diseño), mapa de calor, áreas de confusión, recomendaciones de jerarquía visual.",
    "tools": [
      "Optimal Workshop (Chalkmark)",
      "Maze",
      "Lyssna",
      "UXtweak"
    ],
    "faseLabel": "Testear"
  },
  {
    "id": "m42",
    "num": "#42 · Fase: Empatizar",
    "title": "Focus Groups",
    "tag": "① EMPATIZAR · METODOLOGÍA",
    "fase": "empatizar",
    "tipo": [
      "generativa",
      "moderada",
      "presencial"
    ],
    "accent": "linear-gradient(90deg,#78350F,#F59E0B)",
    "pills": [
      "Generativa",
      "Moderada",
      "Presencial"
    ],
    "sample": "6–10 participantes por sesión; 2–3 sesiones mínimo",
    "body": "Explorar opiniones, actitudes y percepciones compartidas sobre un tema o concepto. Ideal para actitudes grupales y vocabulario del usuario; nunca para probar usabilidad.",
    "cuando": "Para explorar actitudes grupales y reacciones a conceptos nuevos. NUNCA para probar usabilidad.",
    "usuarios": "6–10 participantes por sesión; 2–3 sesiones mínimo. Producto nuevo: 2 grupos de 6–8. Producto maduro: 3–4 grupos para segmentación.",
    "para": "Explorar opiniones, actitudes y percepciones compartidas sobre un tema, producto o concepto.",
    "pasos": [
      "Diseñar guía de moderación con preguntas progresivas (general → específico).",
      "Reclutar homogéneamente dentro de cada grupo para facilitar la conversación.",
      "Usar actividades proyectivas (mood boards, metáforas) para desbloquear opiniones.",
      "Tener un observador separado documentando dinámica grupal.",
      "Analizar con codificación temática priorizando lo que apareció en múltiples grupos."
    ],
    "conclusiones": "Actitudes compartidas, vocabulario del usuario, percepciones de marca, tensiones grupales, hipótesis para investigación posterior.",
    "tools": [
      "Zoom (remoto)",
      "Dovetail",
      "Otter.ai",
      "Miro"
    ],
    "faseLabel": "Empatizar"
  },
  {
    "id": "m41",
    "num": "#41 · Fase: Empatizar",
    "title": "Diarios de Usuario (Diary Studies)",
    "tag": "① EMPATIZAR · METODOLOGÍA",
    "fase": "empatizar",
    "tipo": [
      "generativa",
      "no-moderada",
      "remota"
    ],
    "accent": "linear-gradient(90deg,#1E3A5F,#2563EB)",
    "pills": [
      "Generativa",
      "No moderada",
      "Remota"
    ],
    "sample": "15–20 participantes durante 1–4 semanas",
    "body": "Capturar comportamientos, emociones y contextos de uso tal como ocurren en la vida real a lo largo del tiempo con entradas periódicas y entrevistas de cierre.",
    "cuando": "Para entender comportamientos en contexto real durante períodos extendidos.",
    "usuarios": "15–20 participantes durante 1–4 semanas. Producto nuevo: 10 mínimo por 2 semanas. Producto maduro: 20 para variedad de contextos.",
    "para": "Capturar comportamientos, emociones y contextos de uso tal como ocurren en la vida real a lo largo del tiempo.",
    "pasos": [
      "Reclutar participantes y entregar guía de qué registrar (fotos, texto, video).",
      "Realizar onboarding del método con demo de la herramienta.",
      "Los participantes hacen entradas periódicas (diarias o por evento trigger).",
      "Check-ins semanales del investigador para mantener la motivación y calidad.",
      "Al final, entrevistas de cierre para profundizar en las entradas más interesantes."
    ],
    "conclusiones": "Patrones longitudinales de uso, triggers de comportamiento, emociones en contexto, frecuencia y ritmo de uso.",
    "tools": [
      "dscout",
      "Dovetail",
      "Qualtrics",
      "WhatsApp (informal)"
    ],
    "faseLabel": "Empatizar"
  },
  {
    "id": "m40",
    "num": "#40 · Fase: Medir",
    "title": "Encuestas / Surveys",
    "tag": "⑥ MEDIR · METODOLOGÍA",
    "fase": "medir",
    "tipo": [
      "evaluativa",
      "no-moderada",
      "remota"
    ],
    "accent": "linear-gradient(90deg,#4C1D95,#8B5CF6)",
    "pills": [
      "Evaluativa",
      "No moderada",
      "Remota"
    ],
    "sample": "Mín. 100 para inferencia básica; 400+ para segmentación",
    "body": "Obtener datos cuantitativos sobre percepciones, necesidades y satisfacción a gran escala para benchmarks, segmentación y correlaciones con bajo costo y alto volumen.",
    "cuando": "Para cuantificar actitudes, satisfacción o comportamientos a escala.",
    "usuarios": "Mín. 100 para inferencia básica; 400+ para segmentación. Producto nuevo: 150–200. Producto maduro: 300–500+ según MAU. Ideal con MAU >10k.",
    "para": "Obtener datos cuantitativos sobre percepciones, necesidades y satisfacción a gran escala.",
    "pasos": [
      "Definir las preguntas de investigación que se quieren responder.",
      "Diseñar el cuestionario (máx. 10 preguntas para evitar fatiga).",
      "Pilotear con 5 personas antes de lanzar.",
      "Distribuir por email, in-app o panel.",
      "Analizar con estadística descriptiva e inferencial."
    ],
    "conclusiones": "Distribuciones de respuesta, correlaciones, segmentación por perfil, benchmarks de satisfacción.",
    "tools": [
      "Google Forms",
      "Typeform",
      "SurveyMonkey",
      "Qualtrics",
      "Maze Surveys"
    ],
    "faseLabel": "Medir"
  },
  {
    "id": "m39",
    "num": "#39 · Fase: Testear",
    "title": "Tree Testing",
    "tag": "⑤ TESTEAR · METODOLOGÍA",
    "fase": "testear",
    "tipo": [
      "evaluativa",
      "no-moderada",
      "remota"
    ],
    "accent": "linear-gradient(90deg,#14532D,#16A34A)",
    "pills": [
      "Evaluativa",
      "No moderada",
      "Remota"
    ],
    "sample": "50–100 participantes",
    "body": "Evaluar la findability de contenidos dentro de una arquitectura de navegación en texto plano, sin distractores de diseño, para detectar nodos problemáticos antes de wireframing.",
    "cuando": "Después de card sorting, antes de wireframing, para validar la IA en texto plano.",
    "usuarios": "50–100 participantes. Producto nuevo: 30 mínimo. Producto maduro: 100 para análisis por segmento.",
    "para": "Evaluar la findability de contenidos dentro de una arquitectura de navegación sin distractores de diseño.",
    "pasos": [
      "Construir el árbol de navegación exactamente como se tiene planeado.",
      "Redactar tareas que el usuario debe resolver navegando el árbol.",
      "Lanzar el estudio con 50+ participantes.",
      "Analizar tasa de éxito por tarea, rutas más tomadas y nodos de abandono.",
      "Iterar la arquitectura hasta lograr >80% de éxito en tareas críticas."
    ],
    "conclusiones": "Tasa de éxito por tarea, rutas seguidas, nodos problemáticos, recomendaciones de reorganización.",
    "tools": [
      "Optimal Workshop (Treejack)",
      "UXtweak",
      "Maze"
    ],
    "faseLabel": "Testear"
  },
  {
    "id": "m38",
    "num": "#38 · Fase: Idear",
    "title": "Card Sorting (Abierto)",
    "tag": "③ IDEAR · METODOLOGÍA",
    "fase": "idear",
    "tipo": [
      "generativa",
      "no-moderada",
      "remota"
    ],
    "accent": "linear-gradient(90deg,#0C4A6E,#0EA5E9)",
    "pills": [
      "Generativa",
      "No moderada",
      "Remota"
    ],
    "sample": "15–30 participantes para dendrograma confiable",
    "body": "Descubrir cómo los usuarios agrupan y nombran conceptos para estructurar la navegación y taxonomía del producto usando dendrogramas y matrices de similitud.",
    "cuando": "Al diseñar la arquitectura de información de un producto nuevo o rediseñar la navegación.",
    "usuarios": "15–30 participantes para dendrograma confiable. Producto nuevo: 20 mínimo. Producto maduro: 30 para matrices de similitud estables.",
    "para": "Descubrir cómo los usuarios agrupan y nombran conceptos para estructurar la navegación y taxonomía.",
    "pasos": [
      "Seleccionar 30–100 ítems de contenido o funcionalidades a categorizar.",
      "Lanzar el estudio en línea con instrucciones claras.",
      "Los usuarios agrupan las tarjetas como quieren y nombran sus grupos.",
      "Analizar el dendrograma y la matriz de similitud.",
      "Identificar los grupos más frecuentes y los ítems ambiguos (los que aparecen en múltiples grupos)."
    ],
    "conclusiones": "Propuesta de IA basada en modelos mentales reales, etiquetas preferidas, ítems ambiguos para decisión adicional.",
    "tools": [
      "Optimal Workshop (OptimalSort)",
      "UXtweak",
      "Maze Card Sort",
      "Miro"
    ],
    "faseLabel": "Idear"
  },
  {
    "id": "m37",
    "num": "#37 · Fase: Testear",
    "title": "Pruebas de Usabilidad No Moderadas",
    "tag": "⑤ TESTEAR · METODOLOGÍA",
    "fase": "testear",
    "tipo": [
      "evaluativa",
      "no-moderada",
      "remota"
    ],
    "accent": "linear-gradient(90deg,#064E3B,#10B981)",
    "pills": [
      "Evaluativa",
      "No moderada",
      "Remota"
    ],
    "sample": "15–30 usuarios",
    "body": "Evaluar usabilidad a escala sin moderador para obtener datos de comportamiento real y métricas cuantitativas con rapidez, bajo costo y alcance geográfico ilimitado.",
    "cuando": "Cuando se necesita validar rápidamente, con presupuesto limitado o público geográficamente disperso.",
    "usuarios": "15–30 usuarios. Producto nuevo: 20 mínimo. Producto maduro: 30+ para segmentación. Ideal cuando DAU >50k.",
    "para": "Evaluar usabilidad a escala sin moderador obteniendo datos de comportamiento real y métricas cuantitativas.",
    "pasos": [
      "Configurar el estudio en la plataforma con tareas autoexplicativas.",
      "Redactar cada tarea con contexto completo (el usuario no puede preguntar).",
      "Lanzar a panel reclutado con screener riguroso.",
      "Analizar grabaciones, heatmaps y funnel de completitud.",
      "Triangular con métricas cuantitativas (tiempo en tarea, SUS) para priorizar hallazgos."
    ],
    "conclusiones": "Tasas de éxito, tiempo en tarea, mapas de calor, puntos de abandono, comparativas entre segmentos.",
    "tools": [
      "Maze",
      "UserTesting",
      "Lyssna",
      "Lookback Unmoderated",
      "dscout"
    ],
    "faseLabel": "Testear"
  },
  {
    "id": "m36",
    "num": "#36 · Fase: Testear",
    "title": "Error Message Testing (Test de Mensajes de Error)",
    "tag": "⑤ TESTEAR · METODOLOGÍA",
    "fase": "testear",
    "tipo": [
      "evaluativa",
      "moderada",
      "remota",
      "content"
    ],
    "accent": "linear-gradient(90deg,#7F1D1D,#DC2626)",
    "pills": [
      "Evaluativa",
      "Moderada",
      "Remota",
      "Content"
    ],
    "sample": "8–12 participantes",
    "body": "Evaluar si los mensajes de error del producto ayudan al usuario a entender qué salió mal y cómo solucionarlo, con criterios de claridad, empatía y accionabilidad.",
    "cuando": "Al auditar formularios, flujos transaccionales o cualquier pantalla con alta tasa de error del usuario.",
    "usuarios": "8–12 participantes. Producto nuevo: 8 mínimo. Producto maduro: 12 con variedad de perfiles de expertise. Prioritario si los errores de formulario son causa de churn.",
    "para": "Evaluar si los mensajes de error del producto ayudan al usuario a entender qué salió mal y cómo solucionarlo.",
    "pasos": [
      "Exponer al usuario a escenarios que generan errores en el prototipo.",
      "Observar su reacción inmediata al mensaje de error: ¿Lo lee? ¿Lo entiende? ¿Sabe qué hacer?",
      "Preguntar: \"¿Qué entiendes que pasó? ¿Qué harías ahora?\"",
      "Evaluar con criterios: Claro / Específico / Empático / Accionable / No culpabilizante.",
      "Proponer mensajes mejorados y volver a testear."
    ],
    "conclusiones": "Tasa de comprensión y acción correcta por mensaje de error, mensajes problemáticos identificados, propuestas de copy mejorado.",
    "tools": [
      "Maze",
      "Typeform",
      "UserTesting",
      "Figma (prototipo con errores)"
    ],
    "faseLabel": "Testear"
  },
  {
    "id": "m35",
    "num": "#35 · Fase: Empatizar",
    "title": "Terminology Testing (Test de Vocabulario)",
    "tag": "① EMPATIZAR · METODOLOGÍA",
    "fase": "empatizar",
    "tipo": [
      "generativa",
      "no-moderada",
      "remota",
      "content"
    ],
    "accent": "linear-gradient(90deg,#312E81,#6366F1)",
    "pills": [
      "Generativa",
      "No moderada",
      "Remota",
      "Content"
    ],
    "sample": "15–30 participantes",
    "body": "Identificar qué términos comprenden y prefieren los usuarios para nombrar conceptos clave del producto, reduciendo fricción cognitiva en navegación y features de alto impacto.",
    "cuando": "Al nombrar features, secciones de navegación o cualquier etiqueta de alto impacto.",
    "usuarios": "15–30 participantes. Producto nuevo: 15 mínimo. Producto maduro: 30 para análisis por perfil de expertise.",
    "para": "Identificar qué términos comprenden y prefieren los usuarios para nombrar conceptos clave del producto.",
    "pasos": [
      "Seleccionar 5–10 términos internos del producto que se quiere validar.",
      "Preguntar al usuario: \"¿Qué esperas encontrar detrás de este término?\" y \"¿Cuál de estas opciones te parece más clara?\"",
      "Analizar la tasa de comprensión correcta por término.",
      "Identificar los términos con <70% de comprensión como candidatos a cambio.",
      "Proponer alternativas y volver a testear."
    ],
    "conclusiones": "Términos con alta/baja comprensión, vocabulario preferido por el usuario, recomendaciones de nomenclatura para navegación y features.",
    "tools": [
      "Optimal Workshop",
      "Typeform",
      "Google Forms",
      "Maze"
    ],
    "faseLabel": "Empatizar"
  },
  {
    "id": "m34",
    "num": "#34 · Fase: Testear",
    "title": "Comprehension Testing (Test de Comprensión de Contenido)",
    "tag": "⑤ TESTEAR · METODOLOGÍA",
    "fase": "testear",
    "tipo": [
      "evaluativa",
      "moderada",
      "remota",
      "content"
    ],
    "accent": "linear-gradient(90deg,#1E3A5F,#1D4ED8)",
    "pills": [
      "Evaluativa",
      "Moderada",
      "Remota",
      "Content"
    ],
    "sample": "8–12 participantes del perfil objetivo",
    "body": "Verificar que el usuario interpreta el contenido de la interfaz tal como fue intencionado, identificando palabras problemáticas e iterando el copy hasta alcanzar 80%+ de comprensión correcta.",
    "cuando": "Para validar si el usuario comprende correctamente instrucciones críticas, mensajes de error o textos legales simplificados.",
    "usuarios": "8–12 participantes del perfil objetivo. Producto nuevo: 8 mínimo. Producto maduro: 12 para análisis por segmento. Prioritario si hay drop-off en pantallas con mucho texto.",
    "para": "Verificar que el usuario interpreta el contenido de la interfaz tal como fue intencionado por el equipo.",
    "pasos": [
      "Mostrar el texto o fragmento al usuario sin contexto adicional.",
      "Hacer preguntas de comprensión: \"¿Qué entiendes que tienes que hacer?\" \"¿Qué significa para ti este mensaje?\"",
      "Registrar si la interpretación coincide con la intención del copy.",
      "Anotar las palabras o frases que generan confusión.",
      "Iterar el copy y volver a testear hasta que el 80%+ de usuarios comprenda correctamente."
    ],
    "conclusiones": "Tasa de comprensión correcta por fragmento, palabras problemáticas, propuestas de copy más claro, validación del lenguaje simplificado.",
    "tools": [
      "Maze",
      "UserTesting",
      "Typeform",
      "Lookback.io"
    ],
    "faseLabel": "Testear"
  },
  {
    "id": "m33",
    "num": "#33 · Fase: Definir",
    "title": "Content Audit (Auditoría de Contenido)",
    "tag": "② DEFINIR · METODOLOGÍA",
    "fase": "definir",
    "tipo": [
      "evaluativa",
      "moderada",
      "remota",
      "content"
    ],
    "accent": "linear-gradient(90deg,#92400E,#D97706)",
    "pills": [
      "Evaluativa",
      "Moderada",
      "Remota",
      "Content"
    ],
    "sample": "3–5 evaluadores expertos + validación con 5 usuarios",
    "body": "Evaluar la calidad, claridad y coherencia del microcopy en la interfaz haciendo inventario de CTAs, errores, onboarding y tooltips para proponer mejoras basadas en evidencia.",
    "cuando": "Antes de lanzar, al detectar confusión de usuarios con el lenguaje, o al crear la guía de voz.",
    "usuarios": "3–5 evaluadores expertos + validación con 5 usuarios. Producto nuevo: 3 expertos mínimo + 5 usuarios para validación. Producto maduro: auditoría continua por área de producto.",
    "para": "Evaluar la calidad, claridad y coherencia del contenido en la interfaz desde la perspectiva del usuario.",
    "pasos": [
      "Hacer inventario completo de microcopy: CTAs, errores, vacíos, onboarding, tooltips.",
      "Evaluar cada fragmento contra criterios: ¿Es claro? ¿Es consistente? ¿Usa el vocabulario del usuario? ¿Es del tono correcto?",
      "Categorizar los problemas por tipo: confuso, inconsistente, corporativo, condescendiente, etc.",
      "Priorizar los fragmentos por impacto (pantallas con mayor tráfico primero).",
      "Proponer copy mejorado y validar con usuarios con Cloze o Highlighter Test."
    ],
    "conclusiones": "Inventario de contenido con problemas categorizados, copy mejorado propuesto, guía de voz y tono si no existe.",
    "tools": [
      "Notion / Confluence (inventario)",
      "Figma (anotaciones de copy)",
      "Hemingway App",
      "LanguageTool",
      "Spreadsheet"
    ],
    "faseLabel": "Definir"
  },
  {
    "id": "m32",
    "num": "#32 · Fase: Testear",
    "title": "Highlighter Test (Test de Resaltado)",
    "tag": "⑤ TESTEAR · METODOLOGÍA",
    "fase": "testear",
    "tipo": [
      "evaluativa",
      "no-moderada",
      "remota",
      "content"
    ],
    "accent": "linear-gradient(90deg,#14532D,#15803D)",
    "pills": [
      "Evaluativa",
      "No moderada",
      "Remota",
      "Content"
    ],
    "sample": "15–25 participantes",
    "body": "Evaluar el tono y la claridad del contenido pidiendo a los usuarios que marquen en verde lo que genera confianza y en rojo lo que genera duda o incomodidad.",
    "cuando": "Para identificar fragmentos de texto que generan desconfianza, confusión o ansiedad en el usuario.",
    "usuarios": "15–25 participantes. Producto nuevo: 15 mínimo. Producto maduro: 25 para análisis de tono por segmento.",
    "para": "Evaluar el tono y la claridad del contenido pidiendo a los usuarios que resalten lo que les genera confianza vs. lo que les genera duda.",
    "pasos": [
      "Presentar el texto de la pantalla o flujo a evaluar.",
      "Pedir al usuario que resalte en verde: \"lo que te da confianza o te agrada\".",
      "Pedir al usuario que resalte en rojo: \"lo que te genera duda, incomodidad o confusión\".",
      "Analizar los patrones de resaltado entre participantes.",
      "Priorizar las áreas en rojo que aparecen en más del 30% de los participantes."
    ],
    "conclusiones": "Mapa de zonas de confianza vs. ansiedad del texto, fragmentos problemáticos de tono, recomendaciones de reescritura.",
    "tools": [
      "PDF interactivo",
      "Google Docs con comentarios habilitados",
      "Maze",
      "Typeform con instrucciones de resaltado"
    ],
    "faseLabel": "Testear"
  },
  {
    "id": "m31",
    "num": "#31 · Fase: Testear",
    "title": "Cloze Test (Test de Completitud)",
    "tag": "⑤ TESTEAR · METODOLOGÍA",
    "fase": "testear",
    "tipo": [
      "evaluativa",
      "no-moderada",
      "remota",
      "content"
    ],
    "accent": "linear-gradient(90deg,#4A1D96,#7C3AED)",
    "pills": [
      "Evaluativa",
      "No moderada",
      "Remota",
      "Content"
    ],
    "sample": "20–30 participantes",
    "body": "Evaluar la predictibilidad y claridad del lenguaje de la interfaz eliminando palabras clave del microcopy y pidiendo al usuario que complete los espacios en blanco.",
    "cuando": "Para validar si el microcopy del producto es predecible y claro para el usuario objetivo.",
    "usuarios": "20–30 participantes. Producto nuevo: 15 mínimo para patrones estadísticos. Producto maduro: 30 para análisis de variantes de copy.",
    "para": "Evaluar qué tan predecible y claro es el lenguaje de la interfaz eliminando palabras clave del texto y pidiendo al usuario que las complete.",
    "pasos": [
      "Seleccionar fragmentos críticos de microcopy del producto (instrucciones, mensajes de error, CTAs).",
      "Eliminar palabras clave estratégicas del texto.",
      "Pedir a los usuarios que completen los espacios en blanco con la primera palabra que se les ocurra.",
      "Analizar: ¿las palabras elegidas coinciden con el copy original?",
      "Si el porcentaje de coincidencia es <60%, el copy necesita revisión."
    ],
    "conclusiones": "Índice de predictibilidad del lenguaje (Cloze Score), palabras más confusas, alternativas de vocabulario que el usuario utilizaría naturalmente.",
    "tools": [
      "Google Forms",
      "Typeform",
      "Qualtrics",
      "Maze"
    ],
    "faseLabel": "Testear"
  },
  {
    "id": "m30",
    "num": "#30 · Fase: Medir",
    "title": "Análisis de Analytics / Datos de Uso",
    "tag": "⑥ MEDIR · METODOLOGÍA",
    "fase": "medir",
    "tipo": [
      "evaluativa",
      "no-moderada",
      "remota"
    ],
    "accent": "linear-gradient(90deg,#1C1917,#57534E)",
    "pills": [
      "Evaluativa",
      "No moderada",
      "Remota"
    ],
    "sample": "No aplica; se analizan todos los usuarios activos",
    "body": "Entender qué hace el usuario en el producto a escala para identificar fricciones y oportunidades, analizando funnels, cohortes y drop-offs con datos objetivos de comportamiento real.",
    "cuando": "Siempre, como práctica continua. Especialmente al detectar caídas en conversión, retención o engagement.",
    "usuarios": "No aplica: se analizan todos los usuarios activos. Producto nuevo: mínimo 4–6 semanas de datos. Producto maduro: cuanto mayor MAU/DAU, más confiables los patrones. Fundamental con DAU >500; imprescindible con MAU >5k.",
    "para": "Entender qué hace el usuario en el producto a escala para identificar fricciones y oportunidades.",
    "pasos": [
      "Definir eventos críticos a trackear (clics, pantallas, conversiones).",
      "Instrumentar el código con un Data Layer bien diseñado.",
      "Configurar funnels, cohortes y segmentaciones en la plataforma.",
      "Analizar semanalmente y correlacionar con datos cualitativos.",
      "Generar hipótesis de mejora basadas en anomalías o drop-offs."
    ],
    "conclusiones": "Funnels de conversión, tasas de abandono, flujos más frecuentes, segmentos de alto/bajo engagement, anomalías.",
    "tools": [
      "Google Analytics 4",
      "Mixpanel",
      "Amplitude",
      "Hotjar",
      "FullStory",
      "Heap"
    ],
    "faseLabel": "Medir"
  },
  {
    "id": "m29",
    "num": "#29 · Fase: Medir",
    "title": "NPS (Net Promoter Score)",
    "tag": "⑥ MEDIR · METODOLOGÍA",
    "fase": "medir",
    "tipo": [
      "evaluativa",
      "no-moderada",
      "remota"
    ],
    "accent": "linear-gradient(90deg,#1E3A5F,#0369A1)",
    "pills": [
      "Evaluativa",
      "No moderada",
      "Remota"
    ],
    "sample": "Mín. 200 respuestas para benchmark confiable",
    "body": "Medir la probabilidad de recomendación como indicador de lealtad y experiencia general del producto, segmentando promotores, neutros y detractores para actuar sobre el churn.",
    "cuando": "De forma continua para monitorear lealtad y detectar detractores en riesgo de churn.",
    "usuarios": "Mín. 200 respuestas para benchmark confiable. Producto nuevo: 150+ respuestas. Producto maduro: monitoreo continuo con segmentación por cohorte. Ideal con MAU >500.",
    "para": "Medir la probabilidad de recomendación como indicador de lealtad y experiencia general del producto.",
    "pasos": [
      "Enviar pregunta \"¿Qué tan probable es que recomiendes [producto]?\" (escala 0–10).",
      "Clasificar respuestas: Promotores (9–10), Neutros (7–8), Detractores (0–6).",
      "Calcular: NPS = %Promotores − %Detractores.",
      "Analizar comentarios cualitativos del follow-up abierto.",
      "Segmentar por cohorte, plan y perfil; actuar sobre detractores en riesgo de churn."
    ],
    "conclusiones": "Score NPS (-100 a +100), segmentación de promotores/detractores, temas de insatisfacción, tendencias temporales.",
    "tools": [
      "Delighted",
      "Promoter.io",
      "Typeform",
      "Qualtrics"
    ],
    "faseLabel": "Medir"
  },
  {
    "id": "m28",
    "num": "#28 · Fase: Medir",
    "title": "HEART Framework (Google)",
    "tag": "⑥ MEDIR · METODOLOGÍA",
    "fase": "medir",
    "tipo": [
      "evaluativa",
      "no-moderada",
      "remota"
    ],
    "accent": "linear-gradient(90deg,#134E4A,#0D9488)",
    "pills": [
      "Evaluativa",
      "No moderada",
      "Remota"
    ],
    "sample": "No aplica; se usan métricas de todos los usuarios activos",
    "body": "Establecer un sistema de medición holístico de la experiencia del usuario alineado con objetivos de negocio, usando 5 dimensiones: Happiness, Engagement, Adoption, Retention y Task Success.",
    "cuando": "Para establecer un sistema de medición holístico de la experiencia del usuario alineado con objetivos de negocio.",
    "usuarios": "No aplica: se usan métricas de todos los usuarios activos. Fundamental con DAU >500.",
    "para": "Medir la calidad de la experiencia del usuario usando 5 dimensiones: Happiness, Engagement, Adoption, Retention, Task Success.",
    "pasos": [
      "Completar el framework: definir metas (Goals) por dimensión HEART.",
      "Para cada meta, definir señales (Signals) observables.",
      "Convertir señales en métricas (Metrics) medibles.",
      "Instrumentar los eventos necesarios en el producto.",
      "Revisar el dashboard HEART mensualmente y ajustar los OKRs de experiencia."
    ],
    "conclusiones": "Sistema de métricas de UX alineado con negocio, baseline de experiencia, detección temprana de degradación en cualquier dimensión.",
    "tools": [
      "Amplitude",
      "Mixpanel",
      "Google Analytics 4",
      "Looker / Tableau",
      "Notion (definición de métricas)"
    ],
    "faseLabel": "Medir"
  },
  {
    "id": "m53",
    "num": "#53 · Fase: Idear",
    "title": "Participatory Design / Co-Design",
    "tag": "③ IDEAR · METODOLOGÍA",
    "fase": "idear",
    "tipo": [
      "generativa",
      "moderada",
      "presencial"
    ],
    "accent": "linear-gradient(90deg,#065F46,#10B981)",
    "pills": [
      "Generativa",
      "Moderada",
      "Presencial"
    ],
    "sample": "6–12 participantes por sesión",
    "body": "Involucrar a usuarios como co-diseñadores activos para generar soluciones que reflejen su conocimiento, especialmente en poblaciones específicas como salud, educación o gobierno.",
    "cuando": "Para diseñar con poblaciones específicas (salud, educación, gobierno), o con usuarios expertos en su dominio.",
    "usuarios": "6–12 participantes por sesión. Producto nuevo: 2–3 sesiones de 6–8 usuarios. Producto maduro: sesiones iterativas con usuarios seleccionados.",
    "para": "Involucrar a usuarios como co-diseñadores activos para generar soluciones que reflejen su conocimiento.",
    "pasos": [
      "Diseñar actividades donde el usuario proponga y dibuje, no solo reaccione.",
      "Proveer kits de diseño accesibles (tarjetas, piezas modulares, plantillas).",
      "Facilitar sin imponer dirección; el investigador actúa como documentador.",
      "Sintetizar los outputs en propuestas de diseño formales.",
      "Presentar los resultados a los co-diseñadores para validar la interpretación."
    ],
    "conclusiones": "Ideas generadas por usuarios, validación implícita de conceptos, empoderamiento de stakeholders, prototipos conceptuales.",
    "tools": [
      "Miro",
      "FigJam",
      "Materiales físicos (papel, post-its)",
      "Figma (validación posterior)"
    ],
    "faseLabel": "Idear"
  },
  {
    "id": "m59",
    "num": "#59 · Fase: Definir",
    "title": "Análisis de Soporte y Feedback Existente",
    "tag": "② DEFINIR · METODOLOGÍA",
    "fase": "definir",
    "tipo": [
      "evaluativa",
      "no-moderada",
      "remota"
    ],
    "accent": "linear-gradient(90deg,#1E3A5F,#2563EB)",
    "pills": [
      "Evaluativa",
      "No moderada",
      "Remota"
    ],
    "sample": "No aplica; se analizan todos los tickets/feedback",
    "body": "Extraer insights de comportamiento y necesidades a partir de tickets, reviews y comentarios existentes, sin costo de reclutamiento, para identificar los 10 problemas más frecuentes y priorizarlos en el roadmap.",
    "cuando": "Mensualmente. Especialmente antes de roadmap planning o al detectar incremento en tickets.",
    "usuarios": "No aplica: se analizan todos los tickets/feedback existentes. Producto nuevo: desde el primer ticket. Producto maduro: análisis mensual de todos los canales. Alto ROI: datos sin costo de reclutamiento. Cuanto mayor MAU, más datos para análisis de patrones.",
    "para": "Extraer insights de comportamiento y necesidades a partir de datos de soporte y feedback existentes.",
    "pasos": [
      "Exportar tickets, reviews y comentarios de los últimos 30–90 días.",
      "Categorizar por tipo: bug, feature request, confusión de UX, dolor de usuario.",
      "Cuantificar por frecuencia e impacto (productos/funcionalidades afectadas).",
      "Identificar los 10 problemas más frecuentes.",
      "Priorizar en el roadmap con evidencia de frecuencia × impacto."
    ],
    "conclusiones": "Top 10 problemas reportados, categorías de feedback, features solicitados, insights de retención.",
    "tools": [
      "Dovetail",
      "Intercom",
      "Zendesk",
      "Notion",
      "Claude / ChatGPT (categorización)"
    ],
    "faseLabel": "Definir"
  },
  {
    "id": "m58",
    "num": "#58 · Fase: Testear",
    "title": "Investigación de Accesibilidad (A11y)",
    "tag": "⑤ TESTEAR · METODOLOGÍA",
    "fase": "testear",
    "tipo": [
      "evaluativa",
      "moderada",
      "presencial"
    ],
    "accent": "linear-gradient(90deg,#064E3B,#10B981)",
    "pills": [
      "Evaluativa",
      "Moderada",
      "Presencial"
    ],
    "sample": "6–12 usuarios con diversas discapacidades",
    "body": "Asegurar que el producto es usable por personas con discapacidades visuales, motoras, cognitivas y auditivas, combinando auditoría automática WCAG 2.1 AA con pruebas reales con tecnologías asistivas.",
    "cuando": "Durante el desarrollo y antes del lanzamiento; revisión continua al agregar funcionalidades.",
    "usuarios": "6–12 usuarios con diversas discapacidades. Producto nuevo: al menos 2 por tipo de discapacidad. Producto maduro: 8–12 con tecnologías asistivas variadas. Muy alto ROI: reduce riesgo legal y amplía mercado. Independiente del MAU (normativa WCAG).",
    "para": "Asegurar que el producto es usable por personas con discapacidades visuales, motoras, cognitivas y auditivas.",
    "pasos": [
      "Combinar auditoría experta (axe DevTools automático) con evaluación manual de WCAG 2.1 AA.",
      "Probar con usuarios reales usando screen readers (NVDA, JAWS), navegación por teclado y Switch Access.",
      "Documentar cada violación: qué criterio WCAG viola, dónde ocurre, severidad, impacto.",
      "Priorizar con el equipo de desarrollo por impacto × frecuencia de uso.",
      "Re-testear después de las correcciones."
    ],
    "conclusiones": "Lista de violaciones WCAG con nivel, impacto en usuarios, plan de remediación priorizado, score de accesibilidad.",
    "tools": [
      "NVDA / JAWS",
      "axe DevTools",
      "WAVE",
      "Figma A11y Annotations",
      "Color Contrast Analyzer"
    ],
    "faseLabel": "Testear"
  },
  {
    "id": "m57",
    "num": "#57 · Fase: Testear",
    "title": "Investigación de Formularios (Form Usability)",
    "tag": "⑤ TESTEAR · METODOLOGÍA",
    "fase": "testear",
    "tipo": [
      "evaluativa",
      "moderada",
      "remota"
    ],
    "accent": "linear-gradient(90deg,#1E40AF,#3B82F6)",
    "pills": [
      "Evaluativa",
      "Moderada",
      "Remota"
    ],
    "sample": "5–10 participantes",
    "body": "Identificar problemas en formularios de registro, checkout o flujos con alta tasa de abandono observando el llenado real, registrando hesitaciones y evaluando cada campo contra best practices de Baymard.",
    "cuando": "Al diseñar formularios de registro, checkout o cualquier flujo con alta tasa de abandono.",
    "usuarios": "5–10 participantes. Producto nuevo: 5 siempre suficientes para formas cortas. Producto maduro: 10 para formularios complejos. Muy alto ROI: formularios son el mayor punto de abandono en conversión. Priorizar si hay drop-off medido en formularios clave.",
    "para": "Identificar problemas en formularios que causan abandono, confusión o errores en el llenado.",
    "pasos": [
      "Analizar field-level analytics: ¿qué campo tiene más abandono o tiempo excesivo?",
      "Reclutar usuarios para observar el llenado completo del formulario.",
      "Registrar hesitaciones, correcciones y errores por campo.",
      "Evaluar cada campo contra checklist de best practices de Baymard.",
      "Proponer simplificaciones: eliminar campos opcionales, mejorar etiquetas y mensajes de error."
    ],
    "conclusiones": "Campos problemáticos, mensajes de error mejorados, orden óptimo de campos, recomendaciones de simplificación.",
    "tools": [
      "Maze",
      "Baymard (benchmarks de checkout)",
      "Hotjar (form analytics)",
      "UserTesting"
    ],
    "faseLabel": "Testear"
  },
  {
    "id": "m56",
    "num": "#56 · Fase: Medir",
    "title": "CES (Customer Effort Score)",
    "tag": "⑥ MEDIR · METODOLOGÍA",
    "fase": "medir",
    "tipo": [
      "evaluativa",
      "no-moderada",
      "remota"
    ],
    "accent": "linear-gradient(90deg,#1E3A5F,#0EA5E9)",
    "pills": [
      "Evaluativa",
      "No moderada",
      "Remota"
    ],
    "sample": "100+ respuestas por flujo evaluado",
    "body": "Medir el esfuerzo percibido para completar una tarea o flujo transaccional. Predice churn mejor que CSAT en productos transaccionales al identificar los pasos de mayor fricción.",
    "cuando": "Después de flujos transaccionales (checkout, soporte, registro) para medir fricción percibida.",
    "usuarios": "100+ respuestas por flujo evaluado. Producto nuevo: 50+ respuestas. Producto maduro: monitoreo continuo por flujo crítico. Ideal con DAU relevante.",
    "para": "Medir el esfuerzo que percibe el usuario para completar una tarea o interacción.",
    "pasos": [
      "Identificar los flujos transaccionales críticos a evaluar (checkout, registro, soporte).",
      "Disparar automáticamente la pregunta CES al finalizar el flujo: \"¿Qué tan fácil fue completar esta tarea?\" (escala 1–7).",
      "Recopilar comentario abierto opcional para contextualizar el score.",
      "Analizar la distribución de respuestas e identificar los pasos de mayor fricción reportada.",
      "Correlacionar el score con tasas de abandono y datos de churn para estimar el ROI de las mejoras."
    ],
    "conclusiones": "Score de esfuerzo por flujo, pasos de mayor fricción, ROI estimado de mejoras de UX.",
    "tools": [
      "Nicereply",
      "Delighted",
      "Typeform",
      "Qualtrics"
    ],
    "faseLabel": "Medir"
  },
  {
    "id": "m55",
    "num": "#55 · Fase: Medir",
    "title": "CSAT (Customer Satisfaction Score)",
    "tag": "⑥ MEDIR · METODOLOGÍA",
    "fase": "medir",
    "tipo": [
      "evaluativa",
      "no-moderada",
      "remota"
    ],
    "accent": "linear-gradient(90deg,#065F46,#059669)",
    "pills": [
      "Evaluativa",
      "No moderada",
      "Remota"
    ],
    "sample": "100–300 respuestas por interacción evaluada",
    "body": "Medir la satisfacción del usuario con una interacción específica en tiempo real, disparando automáticamente después de touchpoints clave para detectar degradaciones y correlacionar con retención.",
    "cuando": "Después de interacciones clave: soporte, onboarding, compra, uso de feature nuevo.",
    "usuarios": "100–300 respuestas por interacción evaluada. Producto nuevo: 50+ respuestas. Producto maduro: monitoreo continuo por touchpoint. Útil con cualquier volumen de transacciones.",
    "para": "Medir la satisfacción del usuario con una interacción específica en tiempo real.",
    "pasos": [
      "Disparar automáticamente después de la interacción clave.",
      "El usuario califica en escala 1–5 o emojis.",
      "Recopilar comentario abierto opcional.",
      "Monitorear el promedio por touchpoint y detectar degradaciones.",
      "Correlacionar con datos de retención y churn."
    ],
    "conclusiones": "Score de satisfacción por touchpoint, variaciones temporales, correlación con retención y churn.",
    "tools": [
      "Intercom",
      "Zendesk",
      "Delighted",
      "SurveyMonkey",
      "Typeform"
    ],
    "faseLabel": "Medir"
  },
  {
    "id": "m54",
    "num": "#54 · Fase: Testear",
    "title": "Desirability Testing",
    "tag": "⑤ TESTEAR · METODOLOGÍA",
    "fase": "testear",
    "tipo": [
      "evaluativa",
      "no-moderada",
      "remota"
    ],
    "accent": "linear-gradient(90deg,#6D28C7,#A855F7)",
    "pills": [
      "Evaluativa",
      "No moderada",
      "Remota"
    ],
    "sample": "20–50 participantes",
    "body": "Evaluar si las reacciones emocionales que genera el diseño visual coinciden con los atributos de marca deseados, usando un conjunto de 118 adjetivos para detectar gaps de identidad visual.",
    "cuando": "Al evaluar nuevas propuestas de marca o rediseños visuales.",
    "usuarios": "20–50 participantes. Producto nuevo: 20 mínimo. Producto maduro: 50 para análisis por segmento.",
    "para": "Evaluar si las reacciones emocionales que genera el diseño visual coinciden con los atributos de marca deseados.",
    "pasos": [
      "Mostrar el diseño al participante.",
      "Pedir que seleccione 5 palabras de las 118 adjetivos que describen cómo lo hace sentir.",
      "Preguntar por qué eligió 2–3 de esas palabras.",
      "Comparar las palabras elegidas con los atributos de marca objetivo.",
      "Si los atributos no coinciden, identificar qué elementos visuales generan la percepción incorrecta."
    ],
    "conclusiones": "Atributos percibidos vs. deseados, gaps de identidad visual, dirección para ajustes de diseño.",
    "tools": [
      "Lyssna",
      "Maze",
      "Microsoft Product Reaction Cards",
      "Google Forms"
    ],
    "faseLabel": "Testear"
  },
  {
    "id": "m52",
    "num": "#52 · Fase: Testear",
    "title": "Concept Testing",
    "tag": "⑤ TESTEAR · METODOLOGÍA",
    "fase": "testear",
    "tipo": [
      "evaluativa",
      "moderada",
      "remota"
    ],
    "accent": "linear-gradient(90deg,#3B0764,#7C3AED)",
    "pills": [
      "Evaluativa",
      "Moderada",
      "Remota"
    ],
    "sample": "10–20 participantes del segmento objetivo",
    "body": "Evaluar si un concepto resuena con los usuarios antes de desarrollarlo completamente, validando comprensión, relevancia y diferenciación antes de invertir en diseño hi-fi.",
    "cuando": "Antes de invertir en diseño hi-fi, al evaluar múltiples direcciones de producto.",
    "usuarios": "10–20 participantes del segmento objetivo. Producto nuevo: 10 mínimo por concepto. Producto maduro: 20 para comparar conceptos.",
    "para": "Evaluar si un concepto resuena con los usuarios antes de desarrollarlo completamente.",
    "pasos": [
      "Presentar el concepto con nivel mínimo de fidelidad para provocar feedback real (no de ejecución).",
      "Evaluar comprensión: '¿Qué entiendes que hace este producto?'",
      "Evaluar relevancia: '¿Resolvería un problema que tienes?'",
      "Evaluar diferenciación: '¿En qué se diferencia de lo que usas hoy?'",
      "Si hay múltiples conceptos, comparar en sesiones balanceadas (A-B o secuenciales)."
    ],
    "conclusiones": "Concepto preferido con justificación, gaps de comprensión, atributos más valorados, dirección de diseño validada.",
    "tools": [
      "Maze",
      "UserTesting",
      "Typeform + Figma",
      "Lyssna"
    ],
    "faseLabel": "Testear"
  },
  {
    "id": "m26",
    "num": "#26 · Fase: Testear",
    "title": "A/B Testing",
    "tag": "⑤ TESTEAR · METODOLOGÍA",
    "fase": "testear",
    "tipo": [
      "evaluativa",
      "no-moderada",
      "remota"
    ],
    "accent": "linear-gradient(90deg,#1E1B4B,#4338CA)",
    "pills": [
      "Evaluativa",
      "No moderada",
      "Remota"
    ],
    "sample": "Calculado por poder estadístico (80%+); mín. cientos por variante",
    "body": "Comparar el desempeño de dos variantes de diseño con evidencia estadística para tomar decisiones basadas en datos sobre conversión, retención u otras métricas clave.",
    "cuando": "Cuando existe tráfico suficiente y una hipótesis específica de mejora con métrica medible.",
    "usuarios": "Calculado por poder estadístico (80%+); mín. cientos por variante. Producto nuevo: no recomendado sin baseline de tráfico. Producto maduro: con DAU >1000; calcula muestra con calculadora estadística. Requiere MAU >10k para resultados confiables.",
    "para": "Comparar el desempeño de dos variantes de diseño con evidencia estadística para tomar decisiones basadas en datos.",
    "pasos": [
      "Formular hipótesis: \"Si cambiamos X, esperamos Y porque Z\".",
      "Calcular tamaño de muestra necesario (mín. 80% poder estadístico).",
      "Dividir el tráfico aleatoriamente entre variante A y B.",
      "Correr el experimento el tiempo suficiente sin hacer cambios intermedios.",
      "Analizar con prueba estadística (chi-cuadrado, t-test); declarar ganador solo si p<0.05."
    ],
    "conclusiones": "Variante ganadora con nivel de confianza estadística, impacto en KPI principal, aprendizajes para futuras iteraciones.",
    "tools": [
      "Optimizely",
      "VWO",
      "Split.io",
      "LaunchDarkly",
      "Google Optimize (legado)"
    ],
    "faseLabel": "Testear"
  },
  {
    "id": "m64",
    "num": "#64 · Fase: Medir",
    "title": "Investigación de Retención y Churn",
    "tag": "⑥ MEDIR · METODOLOGÍA",
    "fase": "medir",
    "tipo": [
      "evaluativa",
      "no-moderada",
      "remota"
    ],
    "accent": "linear-gradient(90deg,#1E3A5F,#0EA5E9)",
    "pills": [
      "Evaluativa",
      "No moderada",
      "Remota"
    ],
    "sample": "Análisis de cohortes de todos los usuarios activos e inactivos",
    "body": "Entender cuándo y por qué los usuarios abandonan el producto para diseñar intervenciones de retención, analizando cohortes y correlacionando eventos de activación con retención a largo plazo.",
    "cuando": "Al detectar tasas de churn altas o antes de inversiones en adquisición.",
    "usuarios": "Análisis de cohortes de todos los usuarios activos e inactivos. Producto nuevo: desde que haya 4+ semanas de datos. Producto maduro: análisis segmentado por cohorte, plan y comportamiento.",
    "para": "Entender cuándo y por qué los usuarios abandonan el producto para diseñar intervenciones de retención.",
    "pasos": [
      "Segmentar usuarios por cohorte de registro.",
      "Analizar retención D1, D7, D30, D90.",
      "Identificar el \"Activation Event\" correlacionado con retención a largo plazo.",
      "Entrevistar a usuarios churned para entender las razones cualitativas.",
      "Diseñar intervenciones (email, in-app, cambio de producto) y medir su impacto."
    ],
    "conclusiones": "Curvas de retención por cohorte, comportamientos predictores de churn, triggers de abandono, intervenciones recomendadas.",
    "tools": [
      "Amplitude",
      "Mixpanel",
      "Braze (intervenciones)",
      "SQL / BigQuery",
      "Looker"
    ],
    "faseLabel": "Medir"
  },
  {
    "id": "m63",
    "num": "#63 · Fase: Testear",
    "title": "Guerrilla Testing",
    "tag": "⑤ TESTEAR · METODOLOGÍA",
    "fase": "testear",
    "tipo": [
      "evaluativa",
      "moderada",
      "presencial"
    ],
    "accent": "linear-gradient(90deg,#78350F,#D97706)",
    "pills": [
      "Evaluativa",
      "Moderada",
      "Presencial"
    ],
    "sample": "5–10 usuarios reclutados en campo",
    "body": "Obtener feedback rápido de usuarios reales con mínimo planeamiento en espacios públicos, reclutando a personas en campo para validar prototipos en fases tempranas con bajo presupuesto y alta velocidad.",
    "cuando": "En fases de prototipado rápido cuando el tiempo y presupuesto son limitados.",
    "usuarios": "5–10 usuarios reclutados en campo. Producto nuevo: 5 por iteración. Producto maduro: 8–10 para cobertura rápida.",
    "para": "Obtener feedback rápido de usuarios reales con mínimo planeamiento en espacios públicos.",
    "pasos": [
      "Identificar un espacio donde esté el perfil objetivo (café, campus, plaza).",
      "Abordar a personas: \"Estoy investigando una app y busco 10 min de tu tiempo\".",
      "Dar el dispositivo con el prototipo y observar 3–5 tareas básicas.",
      "Tomar notas rápidas del comportamiento y comentarios.",
      "Analizar en el mismo día mientras los hallazgos están frescos."
    ],
    "conclusiones": "Problemas graves de usabilidad detectados, validación de supuestos básicos, dirección de próxima iteración.",
    "tools": [
      "Smartphone para grabación",
      "Figma / Marvel (prototipo móvil)",
      "Notepad"
    ],
    "faseLabel": "Testear"
  },
  {
    "id": "m25",
    "num": "#25 · Fase: Testear",
    "title": "Análisis Heurístico (Nielsen)",
    "tag": "⑤ TESTEAR · METODOLOGÍA",
    "fase": "testear",
    "tipo": [
      "evaluativa",
      "moderada",
      "presencial"
    ],
    "accent": "linear-gradient(90deg,#7C2D12,#C2410C)",
    "pills": [
      "Evaluativa",
      "Moderada",
      "Presencial"
    ],
    "sample": "3–5 evaluadores expertos (no usuarios finales)",
    "body": "Identificar violaciones a principios de usabilidad establecidos de forma rápida y sin usuarios reales, auditando el producto con las 10 heurísticas de Nielsen.",
    "cuando": "Al auditar un producto existente o antes de pruebas con usuarios para eliminar problemas obvios.",
    "usuarios": "3–5 evaluadores expertos (no usuarios finales). Producto nuevo: 3 mínimo. Producto maduro: 5 para cobertura completa.",
    "para": "Identificar violaciones a principios de usabilidad establecidos de forma rápida y sin usuarios reales.",
    "pasos": [
      "Cada evaluador inspecciona el producto de forma independiente con las 10 heurísticas de Nielsen.",
      "Registrar cada problema con: heurística violada, descripción, severidad (0–4).",
      "Consolidar la lista eliminando duplicados.",
      "Calcular frecuencia (cuántos evaluadores detectaron el mismo problema).",
      "Priorizar por severidad × frecuencia y presentar reporte."
    ],
    "conclusiones": "Lista de violaciones heurísticas con severidad, frecuencia e impacto estimado, recomendaciones de diseño.",
    "tools": [
      "Figma (anotaciones)",
      "Notion / Confluence",
      "Checklist WCAG",
      "Miro"
    ],
    "faseLabel": "Testear"
  },
  {
    "id": "m24",
    "num": "#24 · Fase: Testear",
    "title": "Pluralistic Walkthrough",
    "tag": "⑤ TESTEAR · METODOLOGÍA",
    "fase": "testear",
    "tipo": [
      "evaluativa",
      "moderada",
      "presencial"
    ],
    "accent": "linear-gradient(90deg,#1E3A5F,#2D6A9F)",
    "pills": [
      "Evaluativa",
      "Moderada",
      "Presencial"
    ],
    "sample": "3–5 usuarios + 3–5 evaluadores del equipo en simultáneo",
    "body": "Evaluar un prototipo con usuarios y el equipo al mismo tiempo en una sesión estructurada para detectar problemas desde múltiples perspectivas simultáneas.",
    "cuando": "Para obtener múltiples perspectivas simultáneas (usuario, diseñador, desarrollador) sobre un flujo en poco tiempo.",
    "usuarios": "3–5 usuarios + 3–5 evaluadores del equipo en simultáneo. Producto nuevo: mínimo 3 de cada grupo. Producto maduro: 5 de cada grupo para cobertura completa.",
    "para": "Evaluar un prototipo con usuarios y el equipo al mismo tiempo en una sesión estructurada para detectar problemas desde múltiples perspectivas.",
    "pasos": [
      "Reunir usuarios y evaluadores del equipo en la misma sesión.",
      "Dar a todos el mismo escenario de tarea.",
      "Pedir a usuarios y evaluadores que evalúen por escrito qué harían en cada paso antes de discutir.",
      "Comparar las respuestas del usuario vs. las asunciones del equipo.",
      "Debriefear los gaps y tomar decisiones de diseño en grupo."
    ],
    "conclusiones": "Gaps entre la expectativa del equipo y el comportamiento real del usuario, problemas de usabilidad, alineación del equipo.",
    "tools": [
      "Prototipo impreso o pantallas compartidas",
      "Fichas de evaluación",
      "Sala de reunión o videollamada grupal"
    ],
    "faseLabel": "Testear"
  },
  {
    "id": "m23b",
    "num": "#23 · Fase: Testear",
    "title": "Pruebas de Usabilidad Moderadas",
    "tag": "",
    "fase": "",
    "tipo": [
      "evaluativa",
      "moderada",
      "presencial"
    ],
    "accent": "linear-gradient(90deg,#6D28C7,#8C59FE)",
    "pills": [
      "Evaluativa",
      "Moderada",
      "Presencial"
    ],
    "sample": "5 usuarios detectan ~85% de problemas (Nielsen). Producto nuevo: 5–8 por ronda. Producto maduro: 3–5 por iteración. Útil con DAU <10k para validar flujos críticos.",
    "body": "Identificar problemas de usabilidad observando a usuarios realizar tareas reales con el producto.",
    "cuando": "Antes de desarrollar, al iterar un flujo o tras detectar métricas de abandono elevadas.",
    "usuarios": "5 usuarios detectan ~85% de problemas (Nielsen). Producto nuevo: 5–8 por ronda. Producto maduro: 3–5 por iteración. Útil con DAU <10k para validar flujos críticos.",
    "para": "Identificar problemas de usabilidad observando a usuarios realizar tareas reales con el producto.",
    "pasos": [
      "Definir tareas realistas con escenarios de la vida real.",
      "Reclutar 5–8 usuarios del perfil objetivo.",
      "Conducir sesiones con think-aloud: escuchar sin interferir.",
      "Registrar hesitaciones, errores y comentarios verbales.",
      "Analizar con severity rating; priorizar con equipo en sesión de síntesis."
    ],
    "conclusiones": "Lista priorizada de problemas de usabilidad, tasa de éxito por tarea, SUS score, recomendaciones accionables.",
    "tools": [
      "UserZoom",
      "Lookback.io",
      "Maze",
      "Optimal Workshop",
      "Lyssna"
    ],
    "faseLabel": ""
  },
  {
    "id": "m23",
    "num": "#23 · Fase: Testear",
    "title": "Test Capture Grid",
    "tag": "⑤ TESTEAR · METODOLOGÍA",
    "fase": "testear",
    "tipo": [
      "evaluativa",
      "moderada",
      "presencial"
    ],
    "accent": "linear-gradient(90deg,#064E3B,#065F46)",
    "pills": [
      "Evaluativa",
      "Moderada",
      "Presencial"
    ],
    "sample": "Actividad del equipo post-testing (no de usuarios directos)",
    "body": "Sintetizar y priorizar hallazgos de pruebas de usuario de forma colaborativa usando una grilla de 4 cuadrantes: lo que funcionó, lo que necesita mejorar, preguntas e ideas.",
    "cuando": "Inmediatamente después de una sesión de pruebas de usuario para capturar y agrupar hallazgos mientras están frescos.",
    "usuarios": "Actividad del equipo post-testing (no de usuarios directos). Producto nuevo: usar después de cada ronda de pruebas. Producto maduro: parte del ritual de síntesis post-sprint.",
    "para": "Sintetizar y priorizar los hallazgos de pruebas de usuario de forma colaborativa usando una grilla de 4 cuadrantes.",
    "pasos": [
      "Abrir el lienzo inmediatamente después de las pruebas (mismo día).",
      "Cada observador anota sus observaciones en post-its por cuadrante.",
      "Cuadrante 1 – Lo que funcionó: comportamientos positivos.",
      "Cuadrante 2 – Lo que necesita mejorar: problemas observados.",
      "Cuadrante 3 – Preguntas: qué no queda claro.",
      "Cuadrante 4 – Ideas: soluciones que surgieron durante la observación.",
      "Agrupar y votar las observaciones más frecuentes e impactantes."
    ],
    "conclusiones": "Lista priorizada de hallazgos, ideas de solución emergentes del equipo, preguntas para la próxima ronda de investigación.",
    "tools": [
      "Miro",
      "FigJam",
      "Post-its físicos",
      "Whiteboard"
    ],
    "faseLabel": "Testear"
  },
  {
    "id": "m65",
    "num": "#65 · Fase: Prototipar",
    "title": "Design Sprint (GV)",
    "tag": "④ PROTOTIPAR · METODOLOGÍA",
    "fase": "prototipar",
    "tipo": [
      "evaluativa",
      "moderada",
      "presencial"
    ],
    "accent": "linear-gradient(90deg,#1E3A5F,#0EA5E9)",
    "pills": [
      "Evaluativa",
      "Moderada",
      "Presencial"
    ],
    "sample": "5 usuarios en sesiones de prueba el Día 5",
    "body": "Responder preguntas críticas de diseño y negocio con un prototipo testeable en 5 días: mapear, esbozar, decidir, prototipar y testar con 5 usuarios reales el día final.",
    "cuando": "Ante retos complejos, decisiones de pivote o necesidad de alinear al equipo en 5 días.",
    "usuarios": "5 usuarios en sesiones de prueba el Día 5. Producto nuevo: 5 usuarios bien reclutados. Producto maduro: 5 por iteración del sprint.",
    "para": "Responder preguntas críticas de diseño y negocio con un prototipo testeable en una semana.",
    "pasos": [
      "Día 1 – Mapear: entender el problema y elegir el target del sprint.",
      "Día 2 – Esbozar: generar soluciones individuales con Crazy 8s y sketching detallado.",
      "Día 3 – Decidir: votar soluciones y planear el prototipo con storyboard.",
      "Día 4 – Prototipar: construir un prototipo realista en 1 día (solo lo que se va a testar).",
      "Día 5 – Testar: 5 sesiones de 60 min con usuarios; sintetizar en grupo al final del día."
    ],
    "conclusiones": "Validación/invalidación de hipótesis, prototipo con feedback real, decisión de continuar/pivotar/stop.",
    "tools": [
      "Figma / Marvel / InVision",
      "Miro",
      "Google Meet (Day 5 remoto)",
      "Timer de pomodoro"
    ],
    "faseLabel": "Prototipar"
  },
  {
    "id": "m51",
    "num": "#51 · Fase: Definir",
    "title": "Análisis de Tareas (HTA)",
    "tag": "② DEFINIR · METODOLOGÍA",
    "fase": "definir",
    "tipo": [
      "evaluativa",
      "moderada",
      "presencial"
    ],
    "accent": "linear-gradient(90deg,#1E3A5F,#2563EB)",
    "pills": [
      "Evaluativa",
      "Moderada",
      "Presencial"
    ],
    "sample": "5–10 usuarios expertos en la tarea",
    "body": "Descomponer tareas complejas en subtareas jerárquicas para identificar pasos, decisiones y puntos de fallo en flujos críticos, enterprise o sistemas con alta carga cognitiva.",
    "cuando": "Al diseñar o rediseñar sistemas complejos, herramientas enterprise o flujos críticos.",
    "usuarios": "5–10 usuarios expertos en la tarea. Producto nuevo: 5 expertos mínimo para mapear el flujo ideal. Producto maduro: 8–10 usuarios con distintos perfiles de experiencia.",
    "para": "Descomponer tareas complejas en subtareas jerárquicas para identificar pasos críticos, decisiones, puntos de fallo y carga cognitiva en flujos de alta complejidad.",
    "pasos": [
      "Definir la tarea de alto nivel a analizar (ej: \"completar una transferencia bancaria\").",
      "Identificar los objetivos principales que componen la tarea.",
      "Descomponer cada objetivo en subtareas más pequeñas de forma jerárquica.",
      "Continuar la descomposición hasta llegar a acciones atómicas realizables.",
      "Documentar planes: condiciones bajo las cuales se realiza cada subtarea.",
      "Validar el HTA con usuarios expertos y ajustar según su feedback.",
      "Identificar puntos de fallo, decisiones críticas y oportunidades de mejora."
    ],
    "conclusiones": "Mapa jerárquico de tareas, identificación de puntos de fallo y fricción, requerimientos funcionales priorizados, oportunidades de simplificación de flujos.",
    "tools": [
      "Miro",
      "FigJam",
      "Lucidchart",
      "Spreadsheet de análisis"
    ],
    "faseLabel": "Definir"
  },
  {
    "id": "m61",
    "num": "#61 · Fase: Testear",
    "title": "Cognitive Walkthrough",
    "tag": "⑤ TESTEAR · METODOLOGÍA",
    "fase": "testear",
    "tipo": [
      "evaluativa",
      "moderada",
      "presencial"
    ],
    "accent": "linear-gradient(90deg,#312E81,#7C3AED)",
    "pills": [
      "Evaluativa",
      "Moderada",
      "Presencial"
    ],
    "sample": "2–4 evaluadores expertos",
    "body": "Evaluar paso a paso si un usuario nuevo puede completar una tarea sin entrenamiento previo, respondiendo las 4 preguntas de Polson & Lewis para detectar fallos de learnability.",
    "cuando": "Para evaluar la facilidad de aprendizaje de un flujo nuevo, especialmente con usuarios poco experimentados.",
    "usuarios": "2–4 evaluadores expertos. Producto nuevo: 2 expertos mínimo. Producto maduro: 3–4 con diferentes perspectivas.",
    "para": "Evaluar paso a paso si un usuario nuevo puede completar una tarea sin entrenamiento previo, respondiendo las 4 preguntas de Polson & Lewis.",
    "pasos": [
      "Definir la tarea a evaluar y el perfil del usuario objetivo (sin experiencia previa).",
      "Para cada paso de la tarea, responder las 4 preguntas de Polson & Lewis:",
      "1. ¿El usuario intentará la acción correcta?",
      "2. ¿Notará el control correcto disponible en la interfaz?",
      "3. ¿Asociará la acción correcta con el resultado esperado?",
      "4. ¿Entenderá el feedback que recibe tras realizar la acción?",
      "Documentar fallos en cada criterio y proponer soluciones de diseño concretas."
    ],
    "conclusiones": "Problemas específicos de learnability por paso, recomendaciones para primeros usuarios, flujos que requieren onboarding adicional.",
    "tools": [
      "Figma",
      "Miro",
      "Spreadsheet de evaluación"
    ],
    "faseLabel": "Testear"
  },
  {
    "id": "m62",
    "num": "#62 · Fase: Testear",
    "title": "Think Aloud Protocol",
    "tag": "⑤ TESTEAR · METODOLOGÍA",
    "fase": "testear",
    "tipo": [
      "evaluativa",
      "moderada",
      "presencial"
    ],
    "accent": "linear-gradient(90deg,#78350F,#D97706)",
    "pills": [
      "Evaluativa",
      "Moderada",
      "Presencial"
    ],
    "sample": "5–8 participantes",
    "body": "Capturar el proceso mental del usuario mientras interactúa con el producto para entender el 'por qué' detrás de los comportamientos, triangulando verbalizaciones con comportamiento observable.",
    "cuando": "Durante pruebas de usabilidad para enriquecer los datos con el razonamiento del usuario.",
    "usuarios": "5–8 participantes. Producto nuevo: 5 mínimo. Producto maduro: 8 para saturación de verbalizaciones. Muy alto ROI: revela el modelo mental mientras el usuario actúa. No aplica umbral de MAU/DAU.",
    "para": "Capturar el proceso mental del usuario mientras interactúa para entender el \"por qué\" detrás de los comportamientos.",
    "pasos": [
      "Instruir al participante: \"Piensa en voz alta mientras usas el producto; no hay respuestas correctas o incorrectas\".",
      "Dar tiempo al usuario de practicar el método con una tarea de calentamiento.",
      "Durante las tareas principales, escuchar sin intervenir.",
      "Si el usuario guarda silencio por más de 15 segundos, usar probe neutro: \"¿Qué estás pensando?\".",
      "Analizar las verbalizaciones junto con el comportamiento para triangular los insights."
    ],
    "conclusiones": "Modelo mental del usuario durante la tarea, puntos de confusión articulados, expectativas rotas, vocabulario del usuario.",
    "tools": [
      "Lookback.io",
      "Zoom",
      "Grabadora",
      "Nota de campo"
    ],
    "faseLabel": "Testear"
  },
  {
    "id": "m60",
    "num": "#60 · Fase: Medir",
    "title": "Funnel Analysis (Análisis de Conversión)",
    "tag": "⑥ MEDIR · METODOLOGÍA",
    "fase": "medir",
    "tipo": [
      "evaluativa",
      "no-moderada",
      "remota"
    ],
    "accent": "linear-gradient(90deg,#1E3A5F,#0EA5E9)",
    "pills": [
      "Evaluativa",
      "No moderada",
      "Remota"
    ],
    "sample": "No aplica; todos los usuarios activos",
    "body": "Identificar en qué paso exacto del flujo se pierden usuarios y cuantificar el impacto. Medir el drop-off entre cada paso, segmentar por fuente, dispositivo y cohorte, y proponer intervenciones A/B en los puntos de mayor abandono.",
    "cuando": "Continuamente; especialmente al detectar caídas en conversión o al lanzar cambios en flujos críticos.",
    "usuarios": "No aplica: todos los usuarios activos. Producto nuevo: desde los primeros 100 usuarios en el funnel. Producto maduro: análisis segmentado por fuente, dispositivo y cohorte. Muy alto ROI: impacto directo en revenue y activación. Fundamental con MAU >1k.",
    "para": "Identificar en qué paso exacto del flujo se pierden usuarios y cuantificar el impacto.",
    "pasos": [
      "Definir el funnel crítico con cada paso como evento instrumentado.",
      "Medir el drop-off entre cada paso como porcentaje.",
      "Segmentar por fuente de tráfico, dispositivo, cohorte y perfil de usuario.",
      "Complementar con grabaciones de sesiones de los puntos de mayor abandono.",
      "Proponer intervenciones A/B en los pasos con mayor drop-off."
    ],
    "conclusiones": "Drop-off por paso, segmentos con mejor/peor conversión, etapa más crítica, impacto estimado de mejoras.",
    "tools": [
      "Amplitude",
      "Mixpanel",
      "Google Analytics 4",
      "Heap",
      "Looker / Tableau"
    ],
    "faseLabel": "Medir"
  },
  {
    "id": "m22",
    "num": "#22 · Fase: Prototipar",
    "title": "Role Playing / Juego de Roles",
    "tag": "④ PROTOTIPAR · METODOLOGÍA",
    "fase": "prototipar",
    "tipo": [
      "generativa",
      "moderada",
      "presencial"
    ],
    "accent": "linear-gradient(90deg,#1F2937,#4B5563)",
    "pills": [
      "Generativa",
      "Moderada",
      "Presencial"
    ],
    "sample": "5–10 participantes del equipo + opcionalmente usuarios reales",
    "body": "Experimentar y refinar interacciones de servicio actuando los roles del usuario y del sistema para detectar fricciones en flujos conversacionales y de atención.",
    "cuando": "Para prototipar servicios conversacionales, flujos de atención al cliente o interacciones complejas persona-sistema.",
    "usuarios": "5–10 participantes del equipo + opcionalmente usuarios reales. Producto nuevo: mínimo 4 participantes. Producto maduro: con usuarios reales como co-protagonistas.",
    "para": "Experimentar y refinar interacciones de servicio actuando los roles del usuario y del sistema para detectar fricciones.",
    "pasos": [
      "Escribir el escenario con roles definidos.",
      "Asignar roles: usuario, agente/sistema, observadores.",
      "Actuar el escenario como si fuera real, sin parar.",
      "Pausar y rehacer las secuencias problemáticas.",
      "Debrief: ¿Qué se sintió incómodo? ¿Qué funcionó bien?"
    ],
    "conclusiones": "Fricciones conversacionales, momentos de quiebre en el servicio, vocabulario natural de interacción, requerimientos para el guion del sistema.",
    "tools": [
      "Espacio físico",
      "Props",
      "Grabación de video"
    ],
    "faseLabel": "Prototipar"
  }
]
