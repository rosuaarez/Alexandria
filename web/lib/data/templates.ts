import type { Question } from '@/lib/types'

export interface ProtocolTemplate {
  name: string
  objetivo: string
  questions: Question[]
  // Datos iniciales del formulario completo (claves = campos del CompleteForm).
  initialData?: Record<string, unknown>
}

export const PROTOCOL_TEMPLATES: Record<string, ProtocolTemplate> = {
  usabilidad: {
    name: 'Test de Usabilidad',
    objetivo: 'Evaluar la facilidad de uso de [producto] con usuarios reales.',
    // Pre-llenado del CompleteForm para el template de usabilidad.
    initialData: {
      team: [{ name: 'Ana García', rolInvestigacion: '', rolPdu: '' }],
      docs: [{ nombre: 'Research plan', link: '' }],
      metodo: 'Prueba de Usabilidad',
      herramientas: ['Maze', 'Figma'],
    },
    questions: [
      { id: '1', text: '¿Pudiste completar la tarea sin dificultad?', type: 'scale5' },
      { id: '2', text: '¿Qué fue lo más confuso del proceso?', type: 'open' },
      { id: '3', text: '¿Qué tan probable es que uses este producto?', type: 'nps' },
    ],
  },
  entrevistas: {
    name: 'Guía de Entrevista',
    objetivo: 'Explorar comportamientos y motivaciones de [perfil de usuario].',
    questions: [
      { id: '1', text: 'Cuéntame sobre tu experiencia con [tema]', type: 'open' },
      { id: '2', text: '¿Cuál es tu mayor frustración con [proceso]?', type: 'open' },
      { id: '3', text: '¿Cómo resuelves actualmente [problema]?', type: 'open' },
    ],
  },
  ab: {
    name: 'Test A/B',
    objetivo:
      'Comparar dos versiones de [elemento] para determinar cuál performa mejor.',
    questions: [
      { id: '1', text: '¿Cuál versión prefieres?', type: 'closed' },
      { id: '2', text: '¿Por qué elegiste esa versión?', type: 'open' },
    ],
  },
  cardsorting: {
    name: 'Card Sorting',
    objetivo: 'Entender cómo los usuarios organizan y categorizan la información.',
    questions: [
      { id: '1', text: '¿Por qué agrupaste estas tarjetas juntas?', type: 'open' },
      { id: '2', text: '¿Qué nombre le darías a este grupo?', type: 'open' },
    ],
  },
  treetesting: {
    name: 'Tree Testing',
    objetivo: 'Evaluar la arquitectura de información y navegabilidad.',
    questions: [
      { id: '1', text: '¿Encontraste fácilmente lo que buscabas?', type: 'scale5' },
      { id: '2', text: '¿Qué término usarías para buscar [contenido]?', type: 'open' },
    ],
  },
  encuestas: {
    name: 'Encuesta de Satisfacción',
    objetivo:
      'Medir el nivel de satisfacción de los usuarios con [producto/servicio].',
    questions: [
      { id: '1', text: '¿Qué tan satisfecho estás con [producto]?', type: 'scale5' },
      { id: '2', text: '¿Qué mejorarías?', type: 'open' },
      { id: '3', text: '¿Lo recomendarías a otros?', type: 'nps' },
    ],
  },
}
