/**
 * config.example.js — Plantilla de configuración para Alexandria
 *
 * INSTRUCCIONES DE USO:
 *   1. Copia este archivo: cp public/config.example.js public/config.js
 *   2. Rellena tus claves reales en public/config.js
 *   3. NUNCA subas config.js a Git (ya está en .gitignore)
 *
 * En producción (Vercel) las variables se inyectan automáticamente
 * mediante api/env.js — no necesitas config.js en el servidor.
 */

window.__ENV = {
  // ── Supabase ────────────────────────────────────────────────
  // Obtén estos valores en: https://supabase.com/dashboard → Settings → API
  SUPABASE_URL:      'https://TU-PROYECTO.supabase.co',
  SUPABASE_ANON_KEY: 'TU_SUPABASE_ANON_KEY',

  // ── Gemini (Google AI) ──────────────────────────────────────
  // Obtén tu clave en: https://aistudio.google.com/app/apikey
  GEMINI_API_KEY: 'TU_GEMINI_API_KEY',
};
