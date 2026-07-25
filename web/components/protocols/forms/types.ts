export type FormData = Record<string, unknown>

export interface FormProps {
  initialData: FormData
  onChange: (data: FormData) => void
  // Opcional: dispara la generación del protocolo (lo provee la página de
  // edición). Cuando no se pasa, el botón in-card no se renderiza.
  onGenerate?: () => void
}
