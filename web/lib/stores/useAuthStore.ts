import { create } from 'zustand'
import type { AlexandriaUser } from '@/lib/types'
import { FLAGS } from '@/lib/config/flags'
import { createSupabaseAuthProvider } from '@/lib/auth/supabaseAdapter'
import type { AuthProvider } from '@/lib/auth/types'

// Usuario mockeado para construir toda la estructura visual sin Auth real.
// Se usa solo cuando FLAGS.USE_REAL_AUTH es false.
// El UUID mantiene formato válido para que las queries por user_id no fallen
// por tipo cuando se conecte la BD real.
export const MOCK_USER: AlexandriaUser = {
  id: '00000000-0000-4000-8000-000000000001',
  email: 'researcher@alexandria.app',
  name: 'Rolando Suárez',
  role: 'researcher',
  initials: 'RS',
}

// Proveedor de Auth real (lazy): solo se instancia si el flag está activo.
let authProvider: AuthProvider | null = null
function getProvider(): AuthProvider {
  if (!authProvider) authProvider = createSupabaseAuthProvider()
  return authProvider
}

interface AuthState {
  currentUser: AlexandriaUser | null
  loading: boolean
  setUser: (user: AlexandriaUser | null) => void
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  // Inicializa la sesión. Devuelve una función de limpieza (desuscripción).
  initAuth: () => () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: null,
  loading: false,
  setUser: (currentUser) => set({ currentUser }),

  signIn: async (email, password) => {
    if (!FLAGS.USE_REAL_AUTH) {
      // Mock: cualquier credencial entra como el usuario mock.
      set({ currentUser: MOCK_USER })
      return
    }
    const session = await getProvider().signIn(email, password)
    set({ currentUser: session.user })
  },

  signOut: async () => {
    set({ currentUser: null })
    if (FLAGS.USE_REAL_AUTH) {
      // El adapter cierra la sesión externa y redirige al login del otro
      // proyecto (o /login como fallback). No redirigimos aquí para evitar
      // una doble navegación.
      try {
        await getProvider().signOut()
      } catch {
        if (typeof window !== 'undefined') window.location.assign('/login')
      }
      return
    }
    if (typeof window !== 'undefined') {
      window.location.assign('/login')
    }
  },

  initAuth: () => {
    if (!FLAGS.USE_REAL_AUTH) {
      // Mock: sesión inmediata sin red.
      set({ currentUser: MOCK_USER, loading: false })
      return () => {}
    }
    // Real: lee la sesión actual y se suscribe a sus cambios.
    set({ loading: true })
    const provider = getProvider()
    provider.getSession().then((session) => {
      set({ currentUser: session?.user ?? null, loading: false })
    })
    return provider.onAuthChange((session) => {
      set({ currentUser: session?.user ?? null })
    })
  },
}))
