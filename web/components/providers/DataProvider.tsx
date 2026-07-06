'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/lib/stores/useAuthStore'
import { useProtocolStore } from '@/lib/stores/useProtocolStore'
import { useLibraryStore } from '@/lib/stores/useLibraryStore'
import { useFolderStore } from '@/lib/stores/useFolderStore'
import { useTeamStore } from '@/lib/stores/useTeamStore'

export function DataProvider({ children }: { children: React.ReactNode }) {
  // userId real: viene de la sesión (MOCK_USER si USE_REAL_AUTH=false, o el
  // usuario del Supabase externo si está activo). Lo provee AuthProvider/initAuth.
  const userId = useAuthStore((s) => s.currentUser?.id)
  const loadProtocols = useProtocolStore((s) => s.loadProtocols)
  const loadLibrary = useLibraryStore((s) => s.loadLibrary)
  const loadCapsulas = useLibraryStore((s) => s.loadCapsulas)
  const loadFolders = useFolderStore((s) => s.loadFolders)
  const loadTeam = useTeamStore((s) => s.loadTeam)

  useEffect(() => {
    // Sin sesión todavía: no cargamos datos (se reintenta cuando llegue userId).
    if (!userId) return
    loadProtocols(userId)
    loadLibrary()
    loadFolders()
    loadCapsulas()
    loadTeam()
  }, [userId, loadProtocols, loadLibrary, loadFolders, loadCapsulas, loadTeam])

  return <>{children}</>
}
