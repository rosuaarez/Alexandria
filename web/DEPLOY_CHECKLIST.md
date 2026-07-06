# Deploy Checklist — Alexandría (Vercel)

## Variables de entorno requeridas en Vercel

### Producción (Production)

- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `NEXT_PUBLIC_AUTH_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_AUTH_SUPABASE_ANON_KEY`
- [ ] `NEXT_PUBLIC_EXTERNAL_LOGIN_URL`
- [ ] `GEMINI_API_KEY`
- [ ] `NEXT_PUBLIC_APP_URL=https://[tu-dominio].vercel.app`

### Feature flags para producción

- [ ] `NEXT_PUBLIC_USE_REAL_AUTH=true`
- [ ] `NEXT_PUBLIC_USE_REAL_SUPABASE=true`
- [ ] `NEXT_PUBLIC_USE_REAL_GEMINI=false`  ← activar cuando haya key con cuota

### Preview / Development

Los mismos, pero con `NEXT_PUBLIC_USE_REAL_AUTH=false` para testing seguro.

## Pasos del deploy

- [ ] Conectar repo en vercel.com → New Project
- [ ] Seleccionar "Alexandria-main" como repositorio
- [ ] En "Root Directory" → seleccionar **`web`**
- [ ] Framework Preset: Next.js (auto-detectado)
- [ ] Agregar todas las variables de entorno
- [ ] Deploy
- [ ] Verificar `/api/health` en producción
- [ ] Probar SSO con el otro proyecto
- [ ] Confirmar que todos los feature flags funcionan
