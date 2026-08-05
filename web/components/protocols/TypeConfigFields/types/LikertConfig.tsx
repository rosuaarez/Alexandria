'use client'

import styles from '../TypeConfigFields.module.css'
import { Field, Select, TextInput, type ConfigProps } from '../shared'

const SCALES = ['1 – 5', '1 – 7', '1 – 10', '1 – 3']

export function LikertConfig({ config, patch }: ConfigProps) {
  return (
    <>
      <div className={styles.grid2}>
        <Field label="Escala">
          <Select
            value={config.scale ?? SCALES[0]}
            options={SCALES}
            onChange={(scale) => patch({ scale })}
          />
        </Field>
      </div>
      <div className={styles.grid2}>
        <Field label="Label inicio">
          <TextInput
            value={config.startLabel ?? ''}
            placeholder="Ej. Muy en desacuerdo"
            onChange={(startLabel) => patch({ startLabel })}
          />
        </Field>
        <Field label="Label fin">
          <TextInput
            value={config.endLabel ?? ''}
            placeholder="Ej. Muy de acuerdo"
            onChange={(endLabel) => patch({ endLabel })}
          />
        </Field>
      </div>
    </>
  )
}
