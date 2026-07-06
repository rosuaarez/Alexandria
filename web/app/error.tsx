'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: '16px',
        background: 'var(--bg)',
        fontFamily: 'var(--font)',
      }}
    >
      <div style={{ fontSize: '48px' }}>⚠️</div>
      <h2 style={{ color: 'var(--text-1)', fontFamily: 'var(--font-display)' }}>
        Algo salió mal
      </h2>
      <p style={{ color: 'var(--text-3)', fontSize: '14px' }}>{error.message}</p>
      <button
        onClick={reset}
        style={{
          background: 'var(--accent)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          padding: '10px 20px',
          cursor: 'pointer',
        }}
      >
        Intentar de nuevo
      </button>
    </div>
  )
}
