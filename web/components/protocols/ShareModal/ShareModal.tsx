'use client'

import { useEffect, useMemo, useState } from 'react'
import type { Protocol, SharedUser, TeamMember } from '@/lib/types'
import { useTeamStore } from '@/lib/stores/useTeamStore'
import { useProtocolStore } from '@/lib/stores/useProtocolStore'
import { useUIStore } from '@/lib/stores/useUIStore'
import { useFocusTrap } from '@/lib/hooks/useFocusTrap'
import styles from './ShareModal.module.css'

interface ShareModalProps {
  protocol: Protocol
  isOpen: boolean
  onClose: () => void
}

function userKey(u: { id?: string; email: string }): string {
  return u.id || u.email
}

export function ShareModal({ protocol, isOpen, onClose }: ShareModalProps) {
  const members = useTeamStore((s) => s.members)
  const loadTeam = useTeamStore((s) => s.loadTeam)
  const updateProtocol = useProtocolStore((s) => s.updateProtocol)
  const showToast = useUIStore((s) => s.showToast)
  const trapRef = useFocusTrap<HTMLDivElement>(isOpen)

  const [selected, setSelected] = useState<SharedUser[]>(protocol.sharedWith ?? [])
  const [query, setQuery] = useState('')
  const [link, setLink] = useState('')

  // Al abrir: cargar equipo (si hace falta) y sincronizar la selección actual.
  useEffect(() => {
    if (!isOpen) return
    void loadTeam()
    setSelected(protocol.sharedWith ?? [])
    setQuery('')
  }, [isOpen, protocol.sharedWith, loadTeam])

  // El enlace se compone en cliente para no leer window en render (SSR-safe).
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setLink(`${window.location.origin}/protocols/${protocol.id}`)
    }
  }, [protocol.id])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  // Autocompletado: miembros que coinciden y aún no están seleccionados.
  const suggestions = useMemo<TeamMember[]>(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    const selectedKeys = new Set(selected.map(userKey))
    return members
      .filter((m) => !selectedKeys.has(m.id) && !selectedKeys.has(m.email))
      .filter(
        (m) =>
          m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)
      )
      .slice(0, 6)
  }, [query, members, selected])

  if (!isOpen) return null

  const addMember = (m: TeamMember) => {
    setSelected((prev) => [
      ...prev,
      { id: m.id, name: m.name, email: m.email, role: m.role },
    ])
    setQuery('')
  }

  const removeMember = (key: string) => {
    setSelected((prev) => prev.filter((s) => userKey(s) !== key))
  }

  const copyLink = () => {
    navigator.clipboard
      .writeText(link)
      .then(() => showToast('Enlace copiado ✓', 'success'))
      .catch(() => showToast('No se pudo copiar el enlace', 'error'))
  }

  const handleConfirm = () => {
    void updateProtocol({ ...protocol, sharedWith: selected })
    showToast('Protocolo compartido ✓', 'success')
    onClose()
  }

  // stopPropagation evita que el click llegue a la card que abre el editor.
  const stop = (e: React.MouseEvent) => e.stopPropagation()

  return (
    <div
      className={styles.overlay}
      onClick={(e) => {
        e.stopPropagation()
        onClose()
      }}
    >
      <div
        ref={trapRef}
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label="Compartir protocolo"
        onClick={stop}
      >
        <header className={styles.header}>
          <div className={styles.headerInfo}>
            <h3>Compartir protocolo</h3>
            <p>{protocol.name}</p>
          </div>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Cerrar"
          >
            ×
          </button>
        </header>

        <div className={styles.body}>
          <label className={styles.fieldLabel}>Invitar personas</label>
          <div className={styles.autocomplete}>
            <input
              className={styles.input}
              value={query}
              autoFocus
              placeholder="Busca por nombre o email…"
              onChange={(e) => setQuery(e.target.value)}
            />
            {suggestions.length > 0 && (
              <ul className={styles.suggestions} role="listbox">
                {suggestions.map((m) => (
                  <li key={m.id}>
                    <button
                      type="button"
                      className={styles.suggestion}
                      onClick={() => addMember(m)}
                    >
                      <span
                        className={styles.suggestionAvatar}
                        style={{ background: m.avatarColor }}
                      >
                        {m.initials}
                      </span>
                      <span className={styles.suggestionText}>
                        <span className={styles.suggestionName}>{m.name}</span>
                        <span className={styles.suggestionEmail}>{m.email}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={styles.chips}>
            {selected.length === 0 && (
              <span className={styles.chipsEmpty}>Aún no has compartido con nadie</span>
            )}
            {selected.map((u) => (
              <span key={userKey(u)} className={styles.chip}>
                {u.name}
                <button
                  type="button"
                  className={styles.chipRemove}
                  onClick={() => removeMember(userKey(u))}
                  aria-label={`Quitar a ${u.name}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <label className={styles.fieldLabel}>Enlace del protocolo</label>
          <div className={styles.linkBox}>
            <span className={styles.linkText}>{link}</span>
            <button type="button" className={styles.copyBtn} onClick={copyLink}>
              ⎘ Copiar
            </button>
          </div>
        </div>

        <footer className={styles.footer}>
          <button type="button" className={styles.cancel} onClick={onClose}>
            Cancelar
          </button>
          <button type="button" className={styles.confirm} onClick={handleConfirm}>
            Guardar
          </button>
        </footer>
      </div>
    </div>
  )
}
