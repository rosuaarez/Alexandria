'use client'

import styles from '../TypeConfigFields.module.css'
import {
  EditableList,
  Field,
  Select,
  TextArea,
  type ConfigProps,
} from '../shared'

const SORT_TYPES = ['Abierto', 'Cerrado', 'Híbrido']
const TOOLS = ['Optimal Workshop', 'Maze', 'UserZoom', 'UXtweak', 'Otro']

export function CardSortConfig({ config, patch }: ConfigProps) {
  const cards = config.cards ?? ['']
  return (
    <>
      <div className={styles.grid2}>
        <Field label="Tipo">
          <Select
            value={config.sortType ?? SORT_TYPES[0]}
            options={SORT_TYPES}
            onChange={(sortType) => patch({ sortType })}
          />
        </Field>
        <Field label="Herramienta">
          <Select
            value={config.tool ?? TOOLS[0]}
            options={TOOLS}
            onChange={(tool) => patch({ tool })}
          />
        </Field>
      </div>
      <Field label="Instrucción">
        <TextArea
          value={config.instruction ?? ''}
          placeholder="Ej. Agrupa estas tarjetas en categorías..."
          onChange={(instruction) => patch({ instruction })}
        />
      </Field>
      <Field label="Tarjetas">
        <EditableList
          items={cards}
          onChange={(next) => patch({ cards: next })}
          placeholder={() => 'Ej. Buscar producto · Agregar al carrito'}
          addLabel="Agregar tarjeta"
        />
      </Field>
    </>
  )
}
