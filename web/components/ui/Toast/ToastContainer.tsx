'use client'

import { useUIStore } from '@/lib/stores/useUIStore'
import styles from './Toast.module.css'

export function ToastContainer() {
  const toasts = useUIStore((s) => s.toasts)
  const removeToast = useUIStore((s) => s.removeToast)

  // Máximo 3 visibles.
  const visible = toasts.slice(-3)

  if (visible.length === 0) return null

  return (
    <div className={styles.container} role="region" aria-live="polite">
      {visible.map((toast) => (
        <button
          key={toast.id}
          type="button"
          className={`${styles.toast} ${styles[toast.type]}`}
          onClick={() => removeToast(toast.id)}
        >
          {toast.message}
        </button>
      ))}
    </div>
  )
}
