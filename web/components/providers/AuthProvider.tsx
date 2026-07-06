'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/lib/stores/useAuthStore'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initAuth = useAuthStore((s) => s.initAuth)

  useEffect(() => {
    // initAuth devuelve la función de limpieza (desuscripción en modo real).
    const cleanup = initAuth()
    return cleanup
  }, [initAuth])

  return <>{children}</>
}
