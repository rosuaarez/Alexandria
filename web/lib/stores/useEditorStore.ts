import { create } from 'zustand'
import type { GeneratedProtocolData } from '@/lib/types'

type EditorType = 'express' | 'complete' | 'presentation' | null
type EditorPlatform = 'maze' | 'forms' | null

interface EditorState {
  currentType: EditorType
  currentPlatform: EditorPlatform
  editingProtocolId: string | null
  generatedProtocolData: GeneratedProtocolData | null
  isDirty: boolean
  isSaving: boolean

  setType: (type: EditorType) => void
  setPlatform: (platform: EditorPlatform) => void
  setEditingProtocol: (id: string | null) => void
  setGeneratedData: (data: GeneratedProtocolData | null) => void
  setDirty: (dirty: boolean) => void
  setSaving: (saving: boolean) => void
  resetEditor: () => void
}

const initial = {
  currentType: null as EditorType,
  currentPlatform: null as EditorPlatform,
  editingProtocolId: null as string | null,
  generatedProtocolData: null as GeneratedProtocolData | null,
  isDirty: false,
  isSaving: false,
}

export const useEditorStore = create<EditorState>((set) => ({
  ...initial,

  setType: (currentType) => set({ currentType }),
  setPlatform: (currentPlatform) => set({ currentPlatform }),
  setEditingProtocol: (editingProtocolId) => set({ editingProtocolId }),
  setGeneratedData: (generatedProtocolData) => set({ generatedProtocolData }),
  setDirty: (isDirty) => set({ isDirty }),
  setSaving: (isSaving) => set({ isSaving }),
  resetEditor: () => set({ ...initial }),
}))
