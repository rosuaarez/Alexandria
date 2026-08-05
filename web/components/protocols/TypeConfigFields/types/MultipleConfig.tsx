'use client'

import { Field, EditableList, type ConfigProps } from '../shared'

export function MultipleConfig({ config, patch }: ConfigProps) {
  const options = config.options ?? ['', '']
  return (
    <Field label="Opciones">
      <EditableList
        items={options}
        onChange={(next) => patch({ options: next })}
        placeholder={(i) => `Opción ${i + 1}`}
        addLabel="Agregar opción"
      />
    </Field>
  )
}
