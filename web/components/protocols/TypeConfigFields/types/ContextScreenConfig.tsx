'use client'

import styles from '../TypeConfigFields.module.css'
import {
  EditableList,
  Field,
  Select,
  TextArea,
  TextInput,
  type ConfigProps,
} from '../shared'

const CONTEXTS = [
  'Primera vez en la app',
  'Usuario recurrente',
  'Bajo presión / apuro',
  'Con conexión lenta',
  'En movimiento',
]

export function ContextScreenConfig({ config, patch }: ConfigProps) {
  const aspects = config.aspects ?? ['']
  return (
    <>
      <div className={styles.grid2}>
        <Field label="Pantalla / flujo">
          <TextInput
            value={config.screen ?? ''}
            placeholder="Ej. Pantalla de checkout"
            onChange={(screen) => patch({ screen })}
          />
        </Field>
        <Field label="Contexto de uso">
          <Select
            value={config.usageContext ?? CONTEXTS[0]}
            options={CONTEXTS}
            onChange={(usageContext) => patch({ usageContext })}
          />
        </Field>
      </div>
      <Field label="Descripción del escenario">
        <TextArea
          value={config.scenario ?? ''}
          placeholder="Ej. El usuario acaba de crear su cuenta..."
          onChange={(scenario) => patch({ scenario })}
        />
      </Field>
      <Field label="Aspectos a observar">
        <EditableList
          items={aspects}
          onChange={(next) => patch({ aspects: next })}
          placeholder={() => 'Ej. Comprensión del contenido, jerarquía visual...'}
          addLabel="Agregar aspecto"
        />
      </Field>
    </>
  )
}
