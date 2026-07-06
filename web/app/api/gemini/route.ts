import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Protocol } from '@/lib/types'
import { buildPrompt, type GeminiAction } from '@/lib/gemini/prompts'
import { FLAGS } from '@/lib/config/flags'
import {
  getMockGeminiResponse,
  getMockSuggestAnswer,
} from '@/lib/gemini/mockResponses'

export const runtime = 'nodejs'

// Simula la latencia del modelo en modo mock.
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

interface GeminiRequestBody {
  protocol: Protocol
  action: GeminiAction
  question?: string
}

interface GeminiApiResponse {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> }
  }>
  error?: { message?: string }
}

const MODEL = 'gemini-2.0-flash'
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`

function buildSuggestPrompt(protocol: Protocol, question: string): string {
  return `Eres un copiloto experto en investigación UX. Estás ayudando a mejorar un protocolo.

CONTEXTO DEL PROTOCOLO:
- Nombre: ${protocol.name}
- Tipo: ${protocol.type}
- Datos del formulario: ${JSON.stringify(protocol.data ?? {})}

PREGUNTA DEL INVESTIGADOR:
${question}

Responde en español, de forma concisa y práctica (máximo 4-5 párrafos cortos o una lista).
Devuelve SOLO texto plano (sin JSON, sin markdown de bloques de código).`
}

export async function POST(req: NextRequest) {
  let body: GeminiRequestBody
  try {
    body = (await req.json()) as GeminiRequestBody
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { protocol, action, question } = body
  if (!protocol || !action) {
    return NextResponse.json(
      { error: 'Missing "protocol" or "action"' },
      { status: 400 }
    )
  }

  const isSuggest = action === 'suggest'

  // Modo mock: no se contacta a Gemini ni se consume cuota. Devuelve datos
  // realistas tras una latencia simulada. Activar la integración real con
  // NEXT_PUBLIC_USE_REAL_GEMINI=true (requiere una API key con cuota).
  if (!FLAGS.USE_REAL_GEMINI) {
    await delay(1500)
    if (isSuggest) {
      return NextResponse.json({
        answer: getMockSuggestAnswer(protocol, question ?? ''),
      })
    }
    return NextResponse.json({ result: getMockGeminiResponse(protocol) })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey || apiKey === 'your_gemini_key_here') {
    return NextResponse.json(
      { error: 'Gemini API key not configured' },
      { status: 500 }
    )
  }

  const prompt = isSuggest
    ? buildSuggestPrompt(protocol, question ?? '')
    : buildPrompt(protocol, action)

  let geminiRes: Response
  try {
    geminiRes = await fetch(`${ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192,
        },
      }),
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Network error'
    return NextResponse.json(
      { error: `No se pudo contactar a Gemini: ${message}` },
      { status: 502 }
    )
  }

  const data = (await geminiRes.json()) as GeminiApiResponse

  if (!geminiRes.ok) {
    return NextResponse.json(
      { error: data.error?.message ?? 'Gemini request failed' },
      { status: geminiRes.status }
    )
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

  // Para 'suggest' devolvemos texto plano (respuesta del copiloto).
  if (isSuggest) {
    return NextResponse.json({ answer: text.trim() })
  }

  // Gemini suele devolver el JSON dentro de un bloque ```json ... ```.
  const clean = text
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim()

  try {
    const result = JSON.parse(clean) as Record<string, unknown>
    return NextResponse.json({ result })
  } catch {
    return NextResponse.json(
      { error: 'Failed to parse Gemini response', raw: text },
      { status: 500 }
    )
  }
}
