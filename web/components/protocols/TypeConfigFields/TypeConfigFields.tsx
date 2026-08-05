'use client'

import type { QuestionConfig, QuestionType } from '@/lib/types'
import styles from './TypeConfigFields.module.css'
import type { ConfigProps } from './shared'
import { LikertConfig } from './types/LikertConfig'
import { MultipleConfig } from './types/MultipleConfig'
import { ABTestConfig } from './types/ABTestConfig'
import { FiveSecondsConfig } from './types/FiveSecondsConfig'
import { PrototypeConfig } from './types/PrototypeConfig'
import { ContextScreenConfig } from './types/ContextScreenConfig'
import { TreeTestConfig } from './types/TreeTestConfig'
import { CardSortConfig } from './types/CardSortConfig'

interface TypeEntry {
  icon: string
  title: string // encabezado en mayúsculas
  Fields: (props: ConfigProps) => React.ReactElement
}

// Registro tipo → { ícono, encabezado, subcomponente }.
// Los tipos sin entrada (Abierta, Sí / No) no muestran bloque de configuración.
const REGISTRY: Partial<Record<QuestionType, TypeEntry>> = {
  likert: { icon: '⚖️', title: 'Configuración Likert', Fields: LikertConfig },
  multiple: { icon: '☑️', title: 'Opción múltiple', Fields: MultipleConfig },
  abtest: { icon: '🧪', title: 'A/B Test', Fields: ABTestConfig },
  'five-second': { icon: '⏱️', title: '5 Seconds Test', Fields: FiveSecondsConfig },
  prototype: { icon: '🔗', title: 'Prototype Test', Fields: PrototypeConfig },
  'context-screen': { icon: '🖼️', title: 'Context Screen', Fields: ContextScreenConfig },
  'tree-test': { icon: '🌳', title: 'Tree Test', Fields: TreeTestConfig },
  'card-sort': { icon: '🗂️', title: 'Card Sort', Fields: CardSortConfig },
}

// Tipos que muestran un bloque de configuración debajo de la pregunta.
export function hasConfig(type: QuestionType): boolean {
  return type in REGISTRY
}

export function TypeConfigFields({
  type,
  config,
  onChange,
}: {
  type: QuestionType
  config: QuestionConfig
  onChange: (config: QuestionConfig) => void
}) {
  const entry = REGISTRY[type]
  if (!entry) return null
  const { icon, title, Fields } = entry
  const patch = (p: Partial<QuestionConfig>) => onChange({ ...config, ...p })

  return (
    <div className={styles.block}>
      <div className={styles.header}>
        <span className={styles.headerIcon} aria-hidden>
          {icon}
        </span>
        {title.toUpperCase()}
      </div>
      <Fields config={config} patch={patch} />
    </div>
  )
}
