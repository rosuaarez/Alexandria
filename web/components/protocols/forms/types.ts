export type FormData = Record<string, unknown>

export interface FormProps {
  initialData: FormData
  onChange: (data: FormData) => void
}
