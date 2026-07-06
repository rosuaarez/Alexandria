import { create } from 'zustand'

const DARK_MODE_KEY = 'alexandria-dark-mode'

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

interface UIState {
  darkMode: boolean
  toggleDarkMode: () => void
  initTheme: () => void
  toasts: Toast[]
  showToast: (message: string, type?: Toast['type']) => void
  removeToast: (id: string) => void
  // Sidebar como overlay en mobile (< 768px).
  mobileSidebarOpen: boolean
  toggleMobileSidebar: () => void
  closeMobileSidebar: () => void
}

function applyDarkClass(enabled: boolean) {
  if (typeof document === 'undefined' || !document.body) return
  // El HTML original aplica la clase en <body> (body.dark-mode), no en <html>.
  document.body.classList.toggle('dark-mode', enabled)
}

export const useUIStore = create<UIState>((set, get) => ({
  // Estado inicial false para que SSR y el primer render del cliente coincidan.
  // initTheme() sincroniza desde localStorage tras el montaje (el script inline
  // del root layout ya aplica la clase antes del paint para evitar FOUC).
  darkMode: false,

  initTheme: () => {
    if (typeof window === 'undefined') return
    let enabled = false
    try {
      enabled = window.localStorage.getItem(DARK_MODE_KEY) === 'true'
    } catch {}
    applyDarkClass(enabled)
    set({ darkMode: enabled })
  },

  toggleDarkMode: () => {
    const next = !get().darkMode
    applyDarkClass(next)
    try {
      window.localStorage.setItem(DARK_MODE_KEY, String(next))
    } catch {}
    set({ darkMode: next })
  },

  toasts: [],

  showToast: (message, type = 'info') => {
    const id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `toast-${get().toasts.length}-${message.length}`
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }))
    // Auto-dismiss a los 3000ms (manejado por el store).
    if (typeof window !== 'undefined') {
      window.setTimeout(() => get().removeToast(id), 3000)
    }
  },

  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
  },

  mobileSidebarOpen: false,
  toggleMobileSidebar: () =>
    set((state) => ({ mobileSidebarOpen: !state.mobileSidebarOpen })),
  closeMobileSidebar: () => set({ mobileSidebarOpen: false }),
}))
