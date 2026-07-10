import { createClient } from '@/lib/supabase/client'
import type { Protocol } from '@/lib/types'

const TABLE = 'protocols'

// Forma de la fila tal como vive en Supabase (no se modifica el schema).
interface ProtocolRow {
  id: string
  user_id: string
  title: string | null
  data: unknown
  created_at: string
  updated_at: string
}

// La columna `data` es jsonb y guardamos JSON.stringify(protocol). Al leer puede
// volver como string (escalar JSON) o como objeto; soportamos ambos.
function parseData(raw: unknown): Partial<Protocol> {
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw) as Partial<Protocol>
    } catch {
      return {}
    }
  }
  if (raw && typeof raw === 'object') {
    return raw as Partial<Protocol>
  }
  return {}
}

// Fila de Supabase → Protocol
function fromRow(row: ProtocolRow): Protocol {
  const parsed = parseData(row.data)
  return {
    ...parsed,
    id: row.id,
    _supabaseId: row.id,
    name: row.title ?? parsed.name ?? 'Sin título',
    type: parsed.type ?? 'complete',
    protoStatus: parsed.protoStatus ?? 'draft',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

// Protocol → fila para Supabase (data serializado como JSON string).
// `empId` (equipo del usuario, de UiX Lingo) es opcional: si el usuario no
// tiene equipo, la columna queda sin setear (null).
function toRow(
  protocol: Protocol,
  userId: string,
  empId?: string
): { title: string; data: string; user_id: string; emp_id?: string } {
  return {
    title: protocol.name,
    data: JSON.stringify(protocol),
    user_id: userId,
    ...(empId ? { emp_id: empId } : {}),
  }
}

export async function loadUserProtocols(userId: string): Promise<Protocol[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data as ProtocolRow[]).map(fromRow)
}

export async function createProtocol(
  protocol: Protocol,
  userId: string,
  empId?: string
): Promise<Protocol> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from(TABLE)
    .insert(toRow(protocol, userId, empId))
    .select()
    .single()

  if (error) throw new Error(error.message)
  return fromRow(data as ProtocolRow)
}

export async function updateProtocol(protocol: Protocol): Promise<Protocol> {
  const supabase = createClient()
  if (!protocol._supabaseId) {
    throw new Error('updateProtocol: falta _supabaseId')
  }
  const { data, error } = await supabase
    .from(TABLE)
    .update({ title: protocol.name, data: JSON.stringify(protocol) })
    .eq('id', protocol._supabaseId)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return fromRow(data as ProtocolRow)
}

export async function deleteProtocol(supabaseId: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from(TABLE).delete().eq('id', supabaseId)
  if (error) throw new Error(error.message)
}

export async function duplicateProtocol(
  protocol: Protocol,
  userId: string,
  empId?: string
): Promise<Protocol> {
  // Nuevo registro con nombre "Copia de [nombre]"; se descarta el id/_supabaseId
  // original para que Supabase genere uno nuevo.
  const copy: Protocol = {
    ...protocol,
    id: protocol.id,
    _supabaseId: undefined,
    name: `Copia de ${protocol.name}`,
  }
  return createProtocol(copy, userId, empId)
}
