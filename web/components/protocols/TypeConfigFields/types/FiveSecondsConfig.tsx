'use client'

import styles from '../TypeConfigFields.module.css'
import { Field, Select, TextArea, TextInput, type ConfigProps } from '../shared'

const DURATIONS = ['3 seg', '5 seg', '8 seg', '10 seg']
const STIMULI = ['Pantalla / UI', 'Logo / Marca', 'Landing page', 'Anuncio', 'Imagen']

export function FiveSecondsConfig({ config, patch }: ConfigProps) {
  return (
    <>
      <div className={styles.grid2}>
        <Field label="Duración">
          <Select
            value={config.duration ?? DURATIONS[1]}
            options={DURATIONS}
            onChange={(duration) => patch({ duration })}
          />
        </Field>
        <Field label="Tipo de estímulo">
          <Select
            value={config.stimulusType ?? STIMULI[0]}
            options={STIMULI}
            onChange={(stimulusType) => patch({ stimulusType })}
          />
        </Field>
      </div>
      <Field label="¿Qué quieres medir?">
        <TextInput
          value={config.measure ?? ''}
          placeholder="Ej. Primer impacto visual, claridad del mensaje..."
          onChange={(measure) => patch({ measure })}
        />
      </Field>
      <Field label="Instrucción para el usuario">
        <TextArea
          value={config.instruction ?? ''}
          placeholder="Ej. Observa la pantalla durante 5 segundos..."
          onChange={(instruction) => patch({ instruction })}
        />
      </Field>
    </>
  )
}
