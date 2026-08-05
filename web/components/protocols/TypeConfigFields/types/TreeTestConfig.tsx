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

const TOOLS = ['Optimal Workshop', 'Maze', 'UserZoom', 'UXtweak', 'Otro']
const DEPTHS = ['1 nivel', '2 niveles', '3 niveles', '4+ niveles']

export function TreeTestConfig({ config, patch }: ConfigProps) {
  const nodes = config.nodes ?? ['']
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
        <Field label="Profundidad">
          <Select
            value={config.depth ?? DEPTHS[1]}
            options={DEPTHS}
            onChange={(depth) => patch({ depth })}
          />
        </Field>
      </div>
      <Field label="Tarea de navegación">
        <TextArea
          value={config.navTask ?? ''}
          placeholder="Ej. ¿En qué sección buscarías...?"
          onChange={(navTask) => patch({ navTask })}
        />
      </Field>
      <Field label="Respuesta esperada">
        <TextInput
          value={config.expectedAnswer ?? ''}
          placeholder="Ej. Configuración > Seguridad > Contraseña"
          onChange={(expectedAnswer) => patch({ expectedAnswer })}
        />
      </Field>
      <Field label="Nodos del árbol">
        <EditableList
          items={nodes}
          onChange={(next) => patch({ nodes: next })}
          placeholder={() => 'Ej. Inicio · Mi cuenta > Perfil / Seguridad'}
          addLabel="Agregar nodo"
        />
      </Field>
    </>
  )
}
