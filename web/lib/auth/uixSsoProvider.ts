import type { Session, User } from '@supabase/supabase-js'
import { createAuthClient } from '@/lib/supabase/authClient'
import { consumeSsoHandoff, fetchUiXProfile } from '@/lib/supabase/uixLingo'
import type { UiXProfile } from '@/lib/supabase/uixLingo'
import { initialsFromName } from '@/lib/utils/avatar'
import type { AlexandriaUser } from '@/lib/types'
import type { AuthProvider, AuthSession } from './types'

// ─────────────────────────────────────────────────────────────────────────
// Proveedor de Auth para el SSO de UiX Lingo (Escenario B1).
//
// Reutiliza el contrato AuthProvider existente, así que los stores y las vistas
// no cambian. El `id` del usuario es el auth.uid() de UiX Lingo (único
// identificador; AUTH y DATOS son proyectos SEPARADOS y no se unifican).
//
// ROLE: por decisión de producto, TODO usuario que llega por UiX Lingo entra
// como 'researcher'. La tabla ranking_user no tiene concepto de rol; la
// autorización (promover a 'leader') se gestionará dentro de Alexandria más
// adelante.
// ─────────────────────────────────────────────────────────────────────────

function toUser(id: string, profile: UiXProfile): AlexandriaUser {
  const name = profile.nombre || profile.email || 'Usuario'
  return {
    id,
    email: profile.email,
    name,
    role: 'researcher',
    initials: initialsFromName(name),
    emp_id: profile.emp_id || undefined,
    proyectos: profile.proyectos.length > 0 ? profile.proyectos : undefined,
  }
}

async function toSession(session: Session): Promise<AuthSession> {
  const email = session.user.email ?? ''
  const profile = await fetchUiXProfile(email)
  if (typeof window !== 'undefined' && profile.emp_id) {
    sessionStorage.setItem('uix_emp_id', profile.emp_id)
  }
  // Persistencia best-effort en el proyecto de DATOS (user_profiles + emp_id).
  // No bloquea el login si falla (p. ej. tablas aún no creadas o modo mock).
  if (typeof window !== 'undefined') {
    void fetch('/api/auth/sync-profile', { method: 'POST' }).catch(() => {})
  }
  return { user: toUser(session.user.id, profile), accessToken: session.access_token }
}

export function createUixSsoProvider(): AuthProvider {
  const supabase = createAuthClient()

  return {
    async getSession() {
      // 1) Canjea el handoff de un solo uso si UiX Lingo dejó tokens (escribe
      //    cookie). Idempotente: si ya no hay tokens, no hace nada.
      if (typeof window !== 'undefined') {
        await consumeSsoHandoff()
      }
      // 2) Lee la sesión ya materializada en cookie.
      const { data } = await supabase.auth.getSession()
      const session = data.session
      console.log('[SSO-DEBUG] getSession() → sesión en cookie:', {
        hasSession: !!session,
        user: session?.user?.email ?? null,
      })
      if (!session?.user) return null
      return toSession(session)
    },

    async signIn() {
      // El acceso a Alexandria es exclusivamente vía SSO de UiX Lingo: no hay
      // login con credenciales locales en modo real.
      throw new Error('El acceso es vía SSO de UiX Lingo, no con credenciales.')
    },

    async signOut() {
      await supabase.auth.signOut()
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('uix_email')
        sessionStorage.removeItem('uix_emp_id')
        const loginUrl = process.env.NEXT_PUBLIC_EXTERNAL_LOGIN_URL
        window.location.href = loginUrl || '/login'
      }
    },

    onAuthChange(callback) {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!session?.user) {
          callback(null)
          return
        }
        void toSession(session as Session).then(callback)
      })
      return () => data.subscription.unsubscribe()
    },
  }
}

// Reexport de tipo para conveniencia de quien mapea el usuario.
export type { User }
