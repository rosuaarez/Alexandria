# Alexandría — Next.js

Plataforma de investigación UX para equipos de producto.
Migrada del HTML monolítico original.

## Stack
- Next.js 16 + React 19
- TypeScript
- Zustand (estado global)
- Supabase (base de datos + auth)
- Gemini AI (generación de protocolos)
- CSS Modules + CSS Variables (design system)

## Estructura
```
web/
  app/
    (auth)/login/          ← Pantalla de login
    (app)/
      dashboard/           ← Dashboard principal
      protocols/           ← Lista y editor de protocolos
      library/             ← Biblioteca de recursos
      capsulas/            ← Cápsulas de conocimiento
      team/                ← Gestión del equipo
    api/
      gemini/              ← Generación con IA
      health/              ← Health check
  components/              ← Componentes organizados por dominio
  lib/
    auth/                  ← Adapters de autenticación
    supabase/              ← Clientes de Supabase
    stores/                ← Stores de Zustand
    types/                 ← Tipos TypeScript
    data/                  ← Mock data y templates
    config/                ← Feature flags
  styles/
    globals.css            ← Design system (variables CSS)
```

## Setup local

1. Clonar el repo y entrar a web/
```bash
cd web
npm install
```

2. Copiar variables de entorno
```bash
cp .env.example .env.local
```

3. Llenar las variables en .env.local (ver .env.example)

4. Correr en desarrollo
```bash
npm run dev
```

## Feature Flags
La app tiene 3 integraciones que se activan independientemente:

| Flag | false (default) | true |
|------|----------------|------|
| USE_REAL_AUTH | Usuario mock | SSO con Supabase externo |
| USE_REAL_SUPABASE | Datos en memoria | Supabase real |
| USE_REAL_GEMINI | Respuesta mock (1.5s) | Gemini 2.0 Flash |

Activar en orden: SUPABASE → AUTH → GEMINI

## Deploy
Ver [DEPLOY_CHECKLIST.md](./DEPLOY_CHECKLIST.md) y [CUTOVER_PLAN.md](./CUTOVER_PLAN.md)
