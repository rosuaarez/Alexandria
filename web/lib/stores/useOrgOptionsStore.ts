import { create } from 'zustand'

// Lista compartida de opciones para "Cliente" y "Proyecto" en el modal de
// creación. Se puede ampliar desde la UI ("+ Agregar") y queda disponible para
// futuros protocolos durante la sesión.
const SEED_OPTIONS = [
  'Afiliación',
  'Botón de Pago',
  'Cobranza',
  'Compensalia',
  'Ecosistema LDC',
  'Edyen',
  'GS Motos',
  'Originación Única',
  'OPS',
  'Presta Prenda',
  'Reclutalia',
  'RPI',
  'SIDI',
  'TORRAX',
  'SWAT',
  'Zeus',
]

interface OrgOptionsState {
  options: string[]
  addOption: (name: string) => void
}

export const useOrgOptionsStore = create<OrgOptionsState>((set) => ({
  options: SEED_OPTIONS,
  addOption: (name) =>
    set((s) => {
      const n = name.trim()
      if (!n || s.options.some((o) => o.toLowerCase() === n.toLowerCase())) {
        return s
      }
      return { options: [...s.options, n] }
    }),
}))
