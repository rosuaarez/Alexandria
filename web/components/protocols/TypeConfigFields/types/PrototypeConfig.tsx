'use client'

import styles from '../TypeConfigFields.module.css'
import { Field, Select, TextArea, TextInput, type ConfigProps } from '../shared'

const TOOLS = ['Figma', 'Adobe XD', 'Sketch', 'InVision', 'ProtoPie', 'Otro']
const FIDELITIES = ['Lo-fi', 'Mid-fi', 'Hi-fi']
const METRICS = [
  'Task completion rate',
  'Time on task',
  'Error rate',
  'Misclick rate',
  'Satisfacción',
]

export function PrototypeConfig({ config, patch }: ConfigProps) {
  return (
    <>
      <div className={styles.grid2}>
        <Field label="Herramienta">
          <Select
            value={config.tool ?? TOOLS[0]}
            options={TOOLS}
            onChange={(tool) => patch({ tool })}
          />
        </Field>
        <Field label="Fidelidad">
          <Select
            value={config.fidelity ?? FIDELITIES[0]}
            options={FIDELITIES}
            onChange={(fidelity) => patch({ fidelity })}
          />
        </Field>
      </div>
      <Field label="Tarea / escenario">
        <TextArea
          value={config.task ?? ''}
          placeholder="Ej. Imagina que quieres comprar..."
          onChange={(task) => patch({ task })}
        />
      </Field>
      <div className={styles.grid2}>
        <Field label="Métrica principal">
          <Select
            value={config.metric ?? METRICS[0]}
            options={METRICS}
            onChange={(metric) => patch({ metric })}
          />
        </Field>
        <Field label="URL prototipo (opcional)">
          <TextInput
            value={config.prototypeUrl ?? ''}
            placeholder="https://figma.com/..."
            onChange={(prototypeUrl) => patch({ prototypeUrl })}
          />
        </Field>
      </div>
    </>
  )
}
