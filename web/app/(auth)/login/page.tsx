'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '@/lib/stores/useAuthStore'
import { FLAGS } from '@/lib/config/flags'
import styles from './login.module.css'

interface LoginForm {
  email: string
  password: string
}

function BookIllustration() {
  return (
    <svg
      className={styles.book}
      width="96"
      height="96"
      viewBox="0 0 96 96"
      fill="none"
      aria-hidden="true"
    >
      {/* Páginas (fondo claro del acento) */}
      <path
        d="M48 24c-8-5-18-6-28-4v52c10-2 20-1 28 4 8-5 18-6 28-4V20c-10-2-20-1-28 4z"
        fill="var(--accent-lt)"
        stroke="var(--accent)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Lomo central */}
      <path d="M48 24v52" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" />
      {/* Líneas de texto */}
      <path
        d="M26 38h14M26 48h14M26 58h10M56 38h14M56 48h14M56 58h10"
        stroke="var(--accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues: { email: '', password: '' },
  })

  const signIn = useAuthStore((s) => s.signIn)
  const currentUser = useAuthStore((s) => s.currentUser)
  const authLoading = useAuthStore((s) => s.loading)
  const [formError, setFormError] = useState<string | null>(null)

  // SSO UiX Lingo (Escenario B1): el handoff y la resolución de sesión los hace
  // initAuth (root AuthProvider) sobre el store. Aquí solo reaccionamos al
  // resultado para no consumir dos veces los tokens de un solo uso.
  //   - loading → seguimos "Verificando sesión…"
  //   - con usuario → dashboard
  //   - sin usuario → login del proyecto externo (UiX Lingo)
  useEffect(() => {
    if (!FLAGS.USE_REAL_AUTH) return
    if (authLoading) return
    if (currentUser) {
      router.push('/dashboard')
      return
    }
    const loginUrl = process.env.NEXT_PUBLIC_EXTERNAL_LOGIN_URL
    if (loginUrl) window.location.href = loginUrl
  }, [currentUser, authLoading, router])

  const onSubmit = async (data: LoginForm) => {
    setLoading(true)
    setFormError(null)
    if (!FLAGS.USE_REAL_AUTH) {
      // Mock: mantiene el comportamiento de Sprint 7 (redirige sin validar).
      setTimeout(() => {
        router.push('/dashboard')
      }, 300)
      return
    }
    try {
      await signIn(data.email, data.password)
      router.push('/dashboard')
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'No se pudo iniciar sesión')
      setLoading(false)
    }
  }

  // Modo real (SSO): no se muestra formulario; se verifica/redirige la sesión.
  if (FLAGS.USE_REAL_AUTH) {
    return (
      <div className={styles.page}>
        <div className={styles.verifying}>
          <span className={styles.verifyingIcon} aria-hidden="true">
            📖
          </span>
          <p className={styles.verifyingText}>Verificando sesión…</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.logo}>
          <span className={styles.logoText}>Alexandría</span>
          <span className={styles.badge}>UIX</span>
        </div>

        <BookIllustration />

        <h1 className={styles.title}>Bienvenido a Alexandría</h1>
        <p className={styles.subtitle}>Tu biblioteca de investigación UX</p>

        <form className={styles.card} onSubmit={handleSubmit(onSubmit)} noValidate>
          <label className={styles.field}>
            <span className={styles.label}>Email</span>
            <input
              type="email"
              className={styles.input}
              placeholder="researcher@alexandria.app"
              autoComplete="email"
              {...register('email', { required: true })}
            />
            {errors.email && <span className={styles.error}>Ingresa tu email</span>}
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Contraseña</span>
            <input
              type="password"
              className={styles.input}
              placeholder="••••••••"
              autoComplete="current-password"
              {...register('password', { required: true })}
            />
            {errors.password && (
              <span className={styles.error}>Ingresa tu contraseña</span>
            )}
          </label>

          {formError && <span className={styles.error}>{formError}</span>}

          <button type="submit" className={styles.submit} disabled={loading}>
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
