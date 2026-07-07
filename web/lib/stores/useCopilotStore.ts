import { create } from 'zustand'
import type { GeneratedProtocolData, Protocol } from '@/lib/types'
import { useProtocolStore } from '@/lib/stores/useProtocolStore'

export interface CopilotMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

interface CopilotState {
  isOpen: boolean
  isGenerating: boolean
  messages: CopilotMessage[]
  currentProtocolId: string | null

  setOpen: (isOpen: boolean) => void
  toggleCopilot: () => void
  setGenerating: (v: boolean) => void
  addMessage: (role: 'user' | 'assistant', content: string) => void
  clearMessages: () => void
  setCurrentProtocol: (id: string | null) => void

  generateProtocol: (protocol: Protocol) => Promise<GeneratedProtocolData | null>
  askCopilot: (question: string, protocol: Protocol) => Promise<string>
}

function errorMessage(e: unknown): string {
  return e instanceof Error ? e.message : 'Error desconocido'
}

// El estado del copiloto es la única fuente de verdad. La clase body.acp-open
// (que estrecha .main y controla el bloque del topbar) la sincroniza AppShell
// desde este estado, evitando desincronizaciones imperativas.

async function postGemini(body: unknown): Promise<Record<string, unknown>> {
  const res = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const json = (await res.json()) as Record<string, unknown>
  if (!res.ok) {
    throw new Error((json.error as string) ?? `Error ${res.status}`)
  }
  return json
}

export const useCopilotStore = create<CopilotState>((set, get) => ({
  isOpen: false,
  isGenerating: false,
  messages: [],
  currentProtocolId: null,

  setOpen: (isOpen) => set({ isOpen }),
  toggleCopilot: () => set((s) => ({ isOpen: !s.isOpen })),
  setGenerating: (v) => set({ isGenerating: v }),

  addMessage: (role, content) =>
    set((s) => ({
      messages: [
        ...s.messages,
        {
          id: crypto.randomUUID(),
          role,
          content,
          timestamp: new Date().toISOString(),
        },
      ],
    })),

  clearMessages: () => set({ messages: [] }),
  setCurrentProtocol: (currentProtocolId) => set({ currentProtocolId }),

  generateProtocol: async (protocol) => {
    set({ isGenerating: true })
    get().addMessage('assistant', 'Generando protocolo con IA…')
    try {
      const json = await postGemini({ protocol, action: 'generate' })
      const result = json.result as GeneratedProtocolData | undefined
      if (!result) throw new Error('Respuesta vacía de la IA')

      // Guarda el output en el store de protocolos (en memoria).
      useProtocolStore.getState().setGeneratedData(protocol.id, result)

      get().addMessage('assistant', '✓ Protocolo generado exitosamente')
      set({ isGenerating: false })
      return result
    } catch (e) {
      const message = errorMessage(e)
      get().addMessage('assistant', `⚠ No se pudo generar: ${message}`)
      set({ isGenerating: false })
      return null
    }
  },

  askCopilot: async (question, protocol) => {
    get().addMessage('user', question)
    set({ isGenerating: true })
    try {
      const json = await postGemini({ protocol, action: 'suggest', question })
      const answer = (json.answer as string) ?? ''
      get().addMessage('assistant', answer || 'No obtuve respuesta.')
      set({ isGenerating: false })
      return answer
    } catch (e) {
      const message = `⚠ ${errorMessage(e)}`
      get().addMessage('assistant', message)
      set({ isGenerating: false })
      return message
    }
  },
}))
