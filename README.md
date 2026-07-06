# Alexandría — UX Research Protocol Tool

Plataforma para crear, gestionar y analizar protocolos de investigación UX.  
Autenticación y persistencia con **Supabase** · IA con **Gemini 2.5 Flash**.

> **Nota:** la app vive en `web/` (Next.js 16). La sección de abajo describe la
> versión actual. El resto del README documenta la versión HTML monolítica previa.

---

## Configuración (app Next.js — `web/`)

### 1. Instalar dependencias

```bash
cd web
npm install
```

### 2. Variables de entorno

Copia `web/.env.example` a `web/.env.local` y rellena los valores.
`.env.local` está en `.gitignore` y **nunca se commitea**.

| Variable | Descripción | Dónde obtenerla |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL de Supabase | Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon/public key de Supabase | Dashboard → Settings → API |
| `GEMINI_API_KEY` | API Key de Gemini (solo server-side, nunca se expone al cliente) | [aistudio.google.com](https://aistudio.google.com/app/apikey) |
| `NEXT_PUBLIC_APP_URL` | URL base de la app (`http://localhost:3000` en local) | — |

### 3. Feature flags

Permiten alternar entre **mocks** y **servicios reales** sin tocar código.
Empiezan en `false` (la app funciona 100% con datos mock). Activar de a uno,
probar, y avanzar al siguiente:

| Flag | `false` (default) | `true` |
|---|---|---|
| `NEXT_PUBLIC_USE_REAL_SUPABASE` | Protocolos en memoria (mock) | CRUD real contra Supabase |
| `NEXT_PUBLIC_USE_REAL_AUTH` | Usuario mock, rutas abiertas | Supabase Auth + middleware protegido |
| `NEXT_PUBLIC_USE_REAL_GEMINI` | Respuestas mock realistas | Generación real con Gemini (requiere cuota) |

> Tras cambiar un flag o cualquier `.env.local`, reinicia el servidor de dev.

### 4. Base de datos (Supabase)

La tabla `protocols` ya existe. Los scripts de las tablas nuevas (biblioteca,
equipo) y las políticas RLS están en `web/lib/supabase/migrations/`.
**No se ejecutan automáticamente**: revísalos y córrelos manualmente en el SQL
Editor de Supabase, en orden, solo cuando vayas a activar esas integraciones.

```
001_library.sql   → biblioteca + cápsulas + favoritos
002_team.sql      → miembros del equipo + comentarios
003_rls.sql       → Row Level Security (correr después de 001 y 002)
```

### 5. Desarrollo

```bash
cd web
npm run dev          # http://localhost:3000
```

Health check de servicios: `GET /api/health` devuelve el estado de Supabase y
Gemini (`connected` / `disconnected` / `mock`) y el valor de los flags. En el
dashboard, el rol `leader` ve un indicador con el estado de cada servicio.

---

## Estructura del proyecto

```
alexandria-project/
├── public/
│   ├── index.html          # App completa (HTML + CSS + JS)
│   └── config.example.js   # Plantilla de config (copia y rellena)
├── api/
│   └── env.js              # Serverless function: inyecta env vars en runtime
├── vercel.json             # Configuración de Vercel (rewrites + headers)
├── .gitignore              # Excluye config.js y .env*
└── README.md
```

---

## Variables de entorno requeridas

| Variable           | Descripción                                  | Dónde obtenerla |
|--------------------|----------------------------------------------|-----------------|
| `SUPABASE_URL`     | Project URL de tu proyecto Supabase          | Dashboard → Settings → API |
| `SUPABASE_ANON_KEY`| anon/public key de Supabase                  | Dashboard → Settings → API |
| `GEMINI_API_KEY`   | API Key de Google AI Studio (Gemini)         | [aistudio.google.com](https://aistudio.google.com/app/apikey) |

---

## Desarrollo local

```bash
# 1. Clona el repositorio
git clone https://github.com/TU-ORG/alexandria.git
cd alexandria

# 2. Crea tu config local con las claves reales
cp public/config.example.js public/config.js
# → Edita public/config.js y rellena SUPABASE_URL, SUPABASE_ANON_KEY y GEMINI_API_KEY

# 3. Sirve la carpeta public con cualquier servidor estático
npx serve public
# o
python3 -m http.server 3000 --directory public
```

Abre `http://localhost:3000` en tu navegador.

> ⚠️ `public/config.js` está en `.gitignore`. **Nunca lo subas a GitHub.**

---

## Deploy en Vercel

### 1. Importa el repositorio en Vercel
Ve a [vercel.com/new](https://vercel.com/new) e importa tu repositorio de GitHub.

### 2. Configura las variables de entorno en Vercel Dashboard
```
Settings → Environment Variables → Add:

SUPABASE_URL        = https://TU-PROYECTO.supabase.co
SUPABASE_ANON_KEY   = eyJhbGciO...  (tu anon key)
GEMINI_API_KEY      = AIzaSy...     (tu Gemini key)
```

### 3. Deploy
Vercel detecta automáticamente `vercel.json` y enruta `/config.js → /api/env`,
que inyecta las variables en `window.__ENV` en tiempo de ejecución.

**No se necesita build step.** El `outputDirectory` apunta directamente a `public/`.

---

## Cómo funciona la inyección de variables

```
Navegador                    Vercel
─────────────────────────────────────────────────────
GET /config.js          →    Rewrite → /api/env
                        ←    window.__ENV = { SUPABASE_URL, ... }
GET /index.html         →    public/index.html
  lee window.__ENV      →    usa las claves en runtime
```

`api/env.js` lee `process.env.*` (sólo en servidor) y devuelve un JS con las
variables públicas. Las claves **nunca se escriben en archivos estáticos**.

---

## Tabla SQL requerida en Supabase

```sql
create table protocols (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  title      text not null default 'Sin título',
  data       jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Row Level Security: cada usuario solo ve sus protocolos
alter table protocols enable row level security;

create policy "Usuarios ven sus protocolos"
  on protocols for select using (auth.uid() = user_id);

create policy "Usuarios crean sus protocolos"
  on protocols for insert with check (auth.uid() = user_id);

create policy "Usuarios editan sus protocolos"
  on protocols for update using (auth.uid() = user_id);

create policy "Usuarios eliminan sus protocolos"
  on protocols for delete using (auth.uid() = user_id);
```

---

## Seguridad

- ✅ Ninguna clave API está embebida en el código fuente
- ✅ `public/config.js` está en `.gitignore`
- ✅ `api/env.js` sólo expone variables públicas (anon key, no service_role)
- ✅ Row Level Security activo en Supabase (`auth.uid() = user_id`)
- ✅ Headers de seguridad configurados en `vercel.json`
