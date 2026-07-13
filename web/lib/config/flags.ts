// Feature flags para alternar entre mocks y servicios reales durante la
// integración (Sprint 8). Se leen de variables NEXT_PUBLIC_* para que el mismo
// valor esté disponible en cliente y servidor.
//
// Activar de a uno conforme se prueba cada integración:
//   1. USE_REAL_SUPABASE  2. USE_REAL_AUTH  3. USE_REAL_GEMINI
export const FLAGS = {
  // [SSO-DEBUG] TEMPORAL: forzado a true para diagnosticar el handoff SSO en
  // prod sin depender de la env var de Vercel. REVERTIR a:
  //   USE_REAL_AUTH: process.env.NEXT_PUBLIC_USE_REAL_AUTH === 'true',
  USE_REAL_AUTH: true as boolean,
  USE_REAL_SUPABASE: process.env.NEXT_PUBLIC_USE_REAL_SUPABASE === 'true',
  USE_REAL_GEMINI: process.env.NEXT_PUBLIC_USE_REAL_GEMINI === 'true',
} as const

export type FeatureFlag = keyof typeof FLAGS
