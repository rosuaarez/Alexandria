import Link from 'next/link'

export default function NotFound() {
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
      <div style={{ fontSize: '48px' }}>📭</div>
      <h2 style={{ color: 'var(--text-1)', fontFamily: 'var(--font-display)' }}>
        Página no encontrada
      </h2>
      <Link
        href="/dashboard"
        style={{ color: 'var(--accent)', fontSize: '14px' }}
      >
        Volver al Dashboard →
      </Link>
    </div>
  )
}
