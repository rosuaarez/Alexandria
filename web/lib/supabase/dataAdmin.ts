import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// ─────────────────────────────────────────────────────────────────────────
// Cliente ADMIN del proyecto de DATOS de Alexandria (service_role).
//
// ⚠️ SOLO SERVIDOR. La service_role key ignora RLS por diseño, así que este
// cliente NUNCA debe importarse desde código de cliente ni exponerse al
// navegador. Se lee de SUPABASE_DATA_SERVICE_ROLE_KEY (sin prefijo
// NEXT_PUBLIC_, por lo que Next no la inyecta en el bundle del cliente).
//
// Uso previsto: escrituras privilegiadas puntuales desde route handlers que
// PRIMERO autentican al usuario (p. ej. sync de user_profiles tras validar la
// sesión SSO). La URL del proyecto sí es pública (NEXT_PUBLIC_SUPABASE_URL);
// lo secreto es únicamente la key.
// ─────────────────────────────────────────────────────────────────────────

export function createDataAdminClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_DATA_SERVICE_ROLE_KEY

  if (!url) {
    throw new Error('Falta NEXT_PUBLIC_SUPABASE_URL')
  }
  if (!serviceRoleKey) {
    throw new Error('Falta SUPABASE_DATA_SERVICE_ROLE_KEY (secreta, server-only)')
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      // Cliente sin sesión/cookies: es una identidad de servicio, no un usuario.
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}
