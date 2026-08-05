'use client'

import type { ABVariant } from '@/lib/types'
import styles from '../TypeConfigFields.module.css'
import { Field, TextInput, type ConfigProps } from '../shared'

function makeVariant(): ABVariant {
  return { id: crypto.randomUUID(), desc: '', link: '', imageUrl: '' }
}

// Etiqueta de la variante por índice: A, B, C, ...
const variantLabel = (i: number) => String.fromCharCode(65 + i)

export function ABTestConfig({ config, patch }: ConfigProps) {
  const variants =
    config.variants && config.variants.length >= 2
      ? config.variants
      : [makeVariant(), makeVariant()]

  const patchVariant = (id: string, p: Partial<ABVariant>) =>
    patch({
      variants: variants.map((v) => (v.id === id ? { ...v, ...p } : v)),
    })
  const removeVariant = (id: string) =>
    patch({ variants: variants.filter((v) => v.id !== id) })
  const addVariant = () => patch({ variants: [...variants, makeVariant()] })

  return (
    <>
      <Field label="Criterio de comparación">
        <TextInput
          value={config.criterio ?? ''}
          placeholder="Ej. Tasa de clic, comprensión, preferencia visual..."
          onChange={(criterio) => patch({ criterio })}
        />
      </Field>

      {variants.map((v, i) => (
        <div key={v.id} className={styles.variant}>
          <div className={styles.variantTitle}>
            <span>Variante {variantLabel(i)}</span>
            {variants.length > 2 && (
              <button
                type="button"
                className={styles.listDelete}
                aria-label="Eliminar variante"
                onClick={() => removeVariant(v.id)}
              >
                ×
              </button>
            )}
          </div>
          <Field label="Descripción">
            <TextInput
              value={v.desc}
              placeholder={`Describe la variante ${variantLabel(i)}...`}
              onChange={(desc) => patchVariant(v.id, { desc })}
            />
          </Field>
          <Field label="Link (Figma, prototipo...)">
            <TextInput
              value={v.link}
              placeholder="https://..."
              onChange={(link) => patchVariant(v.id, { link })}
            />
          </Field>
          <Field label="URL de imagen (opcional)">
            <TextInput
              value={v.imageUrl ?? ''}
              placeholder="https://..."
              onChange={(imageUrl) => patchVariant(v.id, { imageUrl })}
            />
          </Field>
        </div>
      ))}

      <button type="button" className={styles.addBtn} onClick={addVariant}>
        + Agregar variante
      </button>
    </>
  )
}
