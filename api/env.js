/**
 * api/env.js — Vercel Serverless Function
 *
 * Expone las variables de entorno de Vercel como un script JS
 * que el navegador carga antes que el resto de la app.
 *
 * Cómo funciona:
 *   1. El navegador carga /api/env → recibe un <script> con window.__ENV
 *   2. index.html carga /config.js que Vercel reescribe a /api/env (ver vercel.json)
 *   3. La app lee window.__ENV.SUPABASE_URL, etc.
 *
 * Variables de entorno requeridas en Vercel Dashboard:
 *   SUPABASE_URL        → Project URL de Supabase
 *   SUPABASE_ANON_KEY   → anon/public key de Supabase
 *   GEMINI_API_KEY      → API Key de Google AI Studio
 */

export default function handler(req, res) {
  // Solo variables seguras para exponer al cliente
  // NUNCA expongas aquí variables de servidor (service_role, secrets privados, etc.)
  const env = {
    SUPABASE_URL:      process.env.SUPABASE_URL      || '',
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || '',
    GEMINI_API_KEY:    process.env.GEMINI_API_KEY    || '',
  };

  // Validar que las variables críticas estén presentes
  const missing = Object.entries(env)
    .filter(([, v]) => !v)
    .map(([k]) => k);

  if (missing.length > 0) {
    console.warn('[Alexandria] Variables de entorno faltantes:', missing.join(', '));
  }

  // Cache corto: las variables de entorno no cambian frecuentemente
  res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');

  res.status(200).send(
    `/* Alexandria — Runtime Config (generado por Vercel) */\nwindow.__ENV = ${JSON.stringify(env, null, 2)};\n`
  );
}
