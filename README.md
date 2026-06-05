# Alexandría — UX Research Protocol Tool

Plataforma para crear, gestionar y analizar protocolos de investigación UX.  
Autenticación y persistencia con **Supabase** · IA con **Gemini 2.5 Flash**.

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
