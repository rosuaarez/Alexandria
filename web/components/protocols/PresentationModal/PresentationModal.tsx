'use client'

import { useEffect, useState } from 'react'
import type { PresentationTemplate } from '@/lib/presentation/constants'
import { PRESENTATION_COLORS } from '@/lib/presentation/constants'
import styles from './PresentationModal.module.css'

export interface PresentationModalProps {
  isOpen: boolean
  onClose: () => void
  onGenerate: (template: PresentationTemplate, color: string) => void
  initialTemplate?: PresentationTemplate
  initialColor?: string
}

interface TemplateOption {
  value: PresentationTemplate
  name: string
  desc: string
}

const TEMPLATES: TemplateOption[] = [
  { value: 'minimal', name: 'Minimal', desc: 'Fondo claro, tipografía limpia' },
  { value: 'gradient', name: 'Gradient', desc: 'Degradado del color del proyecto' },
]

const COLOR_LABELS = Object.keys(PRESENTATION_COLORS)

export function PresentationModal({
  isOpen,
  onClose,
  onGenerate,
  initialTemplate = 'minimal',
  initialColor,
}: PresentationModalProps) {
  const [template, setTemplate] = useState<PresentationTemplate>(initialTemplate)
  const [color, setColor] = useState<string>(initialColor ?? COLOR_LABELS[0])

  // Al abrir, refleja los ajustes guardados (si los hay).
  useEffect(() => {
    if (!isOpen) return
    setTemplate(initialTemplate)
    if (initialColor) setColor(initialColor)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onClose, initialTemplate, initialColor])

  if (!isOpen) return null

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Convertir en presentación"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <h3 className={styles.title}>Convertir en presentación</h3>
            <p className={styles.subtitle}>
              Elige una plantilla y el color del proyecto.
            </p>
          </div>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className={styles.body}>
          <span className={styles.groupLabel}>Plantilla</span>
          <div className={styles.templates}>
            {TEMPLATES.map((t) => (
              <button
                key={t.value}
                type="button"
                className={`${styles.templateCard} ${
                  template === t.value ? styles.templateCardOn : ''
                }`}
                onClick={() => setTemplate(t.value)}
                aria-pressed={template === t.value}
              >
                <span
                  className={`${styles.preview} ${
                    t.value === 'gradient'
                      ? styles.previewGradient
                      : styles.previewMinimal
                  }`}
                  aria-hidden
                />
                <span className={styles.templateName}>{t.name}</span>
                <span className={styles.templateDesc}>{t.desc}</span>
              </button>
            ))}
          </div>

          <label className={styles.field}>
            <span className={styles.groupLabel}>Color del proyecto</span>
            <select
              className={styles.select}
              value={color}
              onChange={(e) => setColor(e.target.value)}
            >
              {COLOR_LABELS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className={styles.footer}>
          <button type="button" className={styles.btnGhost} onClick={onClose}>
            Cancelar
          </button>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={() => onGenerate(template, color)}
          >
            Generar presentación →
          </button>
        </div>
      </div>
    </div>
  )
}
