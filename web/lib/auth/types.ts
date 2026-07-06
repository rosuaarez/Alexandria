import type { AlexandriaUser } from '@/lib/types'

// Sesión normalizada e independiente del proveedor de Auth. El resto de la app
// solo conoce esta forma; el adaptador concreto (Supabase, u otro Auth externo)
// la produce a partir de su propia sesión.
export interface AuthSession {
  user: AlexandriaUser
  accessToken: string
}

// Contrato que debe cumplir cualquier proveedor de Auth. Permite cambiar de
// Supabase a un sistema de Auth externo sin tocar los stores ni las vistas.
export interface AuthProvider {
  // Sesión actual (si la hay) al arrancar la app.
  getSession(): Promise<AuthSession | null>
  // Login con credenciales. Lanza Error con mensaje legible si falla.
  signIn(email: string, password: string): Promise<AuthSession>
  // Cierra la sesión en el proveedor.
  signOut(): Promise<void>
  // Suscribe a cambios de sesión (login/logout/refresh).
  // Devuelve una función para desuscribirse.
  onAuthChange(callback: (session: AuthSession | null) => void): () => void
}
