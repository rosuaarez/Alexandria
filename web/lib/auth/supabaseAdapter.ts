import type { Session, User } from '@supabase/supabase-js'
import { createAuthClient } from '@/lib/supabase/authClient'
import { initialsFromName } from '@/lib/utils/avatar'
import type { AlexandriaUser } from '@/lib/types'
import type { AuthProvider, AuthSession } from './types'

// Mapea un usuario de Supabase Auth (proyecto externo) al modelo de la app.
// El nombre se lee de user_metadata.full_name | name | email; el rol de
// user_metadata.role (lo asigna el sistema de Auth), por defecto 'researcher'.
function toUser(u: User): AlexandriaUser {
  const metadata = u.user_metadata ?? {}
  const name =
    (typeof metadata.full_name === 'string' && metadata.full_name) ||
    (typeof metadata.name === 'string' && metadata.name) ||
    u.email ||
    'Usuario'
  const role = metadata.role === 'leader' ? 'leader' : 'researcher'
  return {
    id: u.id,
    email: u.email ?? '',
    name,
    role,
    initials: initialsFromName(name),
  }
}

function toSession(s: Session): AuthSession {
  return { user: toUser(s.user), accessToken: s.access_token }
}

// Implementación de AuthProvider sobre el Supabase Auth externo.
export function createSupabaseAuthProvider(): AuthProvider {
  const supabase = createAuthClient()

  return {
    async getSession() {
      const { data } = await supabase.auth.getSession()
      return data.session ? toSession(data.session) : null
    },

    async signIn(email, password) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw new Error(error.message)
      if (!data.session) throw new Error('No se pudo iniciar sesión')
      return toSession(data.session)
    },

    async signOut() {
      await supabase.auth.signOut()
      // SSO: tras cerrar sesión, volver al login del proyecto externo.
      // Fallback a /login local si no se configuró la URL externa.
      if (typeof window !== 'undefined') {
        const loginUrl = process.env.NEXT_PUBLIC_EXTERNAL_LOGIN_URL
        window.location.href = loginUrl || '/login'
      }
    },

    onAuthChange(callback) {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        callback(session ? toSession(session) : null)
      })
      return () => data.subscription.unsubscribe()
    },
  }
}
