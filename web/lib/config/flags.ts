// Feature flags para alternar entre mocks y servicios reales durante la
// integración (Sprint 8). Se leen de variables NEXT_PUBLIC_* para que el mismo
// valor esté disponible en cliente y servidor.
//
// Activar de a uno conforme se prueba cada integración:
//   1. USE_REAL_SUPABASE  2. USE_REAL_AUTH  3. USE_REAL_GEMINI
export const FLAGS = {
  // Cambiar a true cuando la integración esté lista y probada.
  USE_REAL_AUTH: process.env.NEXT_PUBLIC_USE_REAL_AUTH === 'true',
  USE_REAL_SUPABASE: process.env.NEXT_PUBLIC_USE_REAL_SUPABASE === 'true',
  USE_REAL_GEMINI: process.env.NEXT_PUBLIC_USE_REAL_GEMINI === 'true',
} as const

export type FeatureFlag = keyof typeof FLAGS

// Flag temporal para ocultar/bloquear "💡 Cápsulas de Conocimiento" sin borrar
// el código ni la ruta. Controla a la vez:
//   - el item del sidebar (components/layout/Sidebar/Sidebar.tsx)
//   - el acceso por URL directa (app/(app)/capsulas/layout.tsx -> notFound())
// Poner en `true` para volver a mostrar y habilitar la sección.
export const SHOW_CAPSULAS = false
