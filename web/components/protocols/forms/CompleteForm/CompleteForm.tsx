'use client'

import { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import type { Question } from '@/lib/types'
import { QuestionList } from '@/components/protocols/QuestionList'
import { FieldCommentIndicator } from '@/components/protocols/FieldCommentIndicator'
import { useUIStore } from '@/lib/stores/useUIStore'
import { useFolderStore } from '@/lib/stores/useFolderStore'
import type { FormProps } from '@/components/protocols/forms/types'
import { asArray, asQuestions, asString } from '@/components/protocols/forms/utils'

// Opciones fieles a los <select> del formulario completo del original.
const METODO_OPTIONS = [
  'Prueba de Usabilidad',
  'Entrevistas',
  'Card Sorting',
  'Tree Testing',
  'A/B Testing',
  'Encuestas',
  'Eye Tracking',
  'Think Aloud',
]
const ROL_INVESTIGACION_OPTIONS = [
  'Investigador principal',
  'Investigador de apoyo',
  'Facilitador',
  'Observador',
  'Note-taker',
]
const ROL_PDU_OPTIONS = [
  'Líder de producto',
  'Diseñador',
  'Desarrollador',
  'Stakeholder',
  'QA',
]
const ENTREGABLE_OPTIONS = [
  'Reporte de hallazgos',
  'Grabaciones de sesiones',
  'Highlight reel',
  'Mapa de experiencia',
  'Recomendaciones priorizadas',
  'Presentación ejecutiva',
]
const ENFOQUE_OPTIONS = ['Cualitativo', 'Cuantitativo', 'Mixto (cualitativo/cuantitativo)']
const DURACION_OPTIONS = ['1 hr', '45 min', '30 min', '20 min', '10 min', '5 min']
const DIGITAL_OPTIONS = ['Indiferente', 'Básico', 'Intermedio', 'Avanzado', 'Experto']
const EDAD_OPTIONS = ['18-30 años', '31-45 años', '46-60 años', '61+ años', 'Indiferente']
const GENERO_OPTIONS = ['Mixto', 'Masculino', 'Femenino', 'No binario', 'Indiferente']
const NSE_OPTIONS = ['Indiferente', 'A/B', 'C+', 'C', 'C-', 'D+', 'D', 'E']
const OCUPACION_OPTIONS = [
  'Indiferente',
  'Estudiante',
  'Empleado',
  'Trabajador independiente',
  'Empresario / Dueño de negocio',
  'Profesional independiente',
  'Dedicado al hogar',
  'Pensionado / Jubilado',
  'Desempleado',
]
const PAIS_OPTIONS = [
  'México',
  'Colombia',
  'Perú',
  'Chile',
  'Argentina',
  'España',
  'Estados Unidos',
]
// Filas de cuota por campo del perfil (fieles al original).
const EDAD_CUOTA_ROWS = ['18–30 años', '31–45 años', '46–60 años', '61+ años']
const GENERO_CUOTA_ROWS = ['Masculino', 'Femenino', 'No binario']
const NSE_CUOTA_ROWS = ['AB', 'C+', 'C', 'C-', 'D+', 'D, D-']
const OCUPACION_CUOTA_ROWS = [
  'Estudiante',
  'Empleado',
  'Trabajador Independiente',
  'Dedicado al hogar',
  'Pensionado',
]

// Checkbox "Agregar cuota" que expande una tabla de cuotas con controles − N +.
function CuotaField({ rows, defaultOpen = false }: { rows: string[]; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  const [values, setValues] = useState<number[]>(() => rows.map(() => 0))

  const setAt = (i: number, n: number) =>
    setValues((v) => v.map((x, idx) => (idx === i ? Math.max(0, n) : x)))

  return (
    <>
      <label className="cuota-toggle">
        <input
          type="checkbox"
          checked={open}
          onChange={(e) => setOpen(e.target.checked)}
        />{' '}
        <span>Agregar cuota</span>
      </label>
      {open && (
        <div className="cuota-panel">
          {rows.map((r, i) => (
            <div className="cuota-row" key={r}>
              <span>{r}</span>
              <div className="cuota-ctrl">
                <button type="button" onClick={() => setAt(i, values[i] - 1)}>
                  −
                </button>
                <input
                  className="cuota-num"
                  type="number"
                  min={0}
                  value={values[i]}
                  onChange={(e) => setAt(i, parseInt(e.target.value, 10) || 0)}
                />
                <button type="button" onClick={() => setAt(i, values[i] + 1)}>
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

// Muestra sugerida por método (mock del botón "✦ Corregir con IA").
function suggestSampleFor(metodo: string): { range: string; lower: number } {
  const m = metodo.toLowerCase()
  if (/usab|first-click|think/.test(m)) return { range: '5-8', lower: 5 }
  if (/entrevist/.test(m)) return { range: '8-12', lower: 8 }
  if (/encuest|nps|survey/.test(m)) return { range: '30+', lower: 30 }
  if (/card|tree/.test(m)) return { range: '15-20', lower: 15 }
  if (/a\/b|ab test/.test(m)) return { range: '100+', lower: 100 }
  return { range: '8-12', lower: 8 }
}

interface TeamMember {
  name: string
  rolInvestigacion: string
  rolPdu: string
}
interface DocItem {
  nombre: string
  link: string
}
interface TextItem {
  value: string
}

interface CompleteValues {
  // 1. Datos del proyecto
  proyecto: string
  cliente: string
  tema: string
  folderId: string
  // 2. Team
  team: TeamMember[]
  // 3. Propósito
  objetivoGeneral: string
  objetivos: TextItem[]
  // 4. Hipótesis
  hipotesis: string
  // 5. KPIs
  kpis: TextItem[]
  // 6. Fechas
  fechaInicio: string
  fechaResultados: string
  // 8. Documentación (7. Entregables se maneja como chips en estado local)
  docs: DocItem[]
  // 9. Metodología
  metodo: string
  enfoque: string
  duracion: string
  fechasAplicacionInicio: string
  fechasAplicacionFin: string
  muestra: string
  razonMuestra: string
  // 10. Perfil del usuario
  caracteristica: string
  nivelDigital: string
  edad: string
  genero: string
  nse: string
  ocupacion: string
  pais: string
  contexto: string
  linkProtoPersona: string
  linkUserPersona: string
  // 11. Preguntas
  intro: string
  cierre: string
  testUrl: string
  herramientaPrueba: string
}

export function CompleteForm({ initialData, onChange }: FormProps) {
  const showToast = useUIStore((s) => s.showToast)
  const folders = useFolderStore((s) => s.folders)

  // El template 'usabilidad' pre-selecciona método/herramientas y expande cuotas.
  const isUsabilidad = asString(initialData.template) === 'usabilidad'

  const { register, watch, getValues, setValue, control } = useForm<CompleteValues>({
    defaultValues: {
      proyecto: asString(initialData.proyecto),
      cliente: asString(initialData.cliente),
      tema: asString(initialData.tema),
      folderId: asString(initialData.folderId),
      // Al menos una fila de team por defecto (con placeholders); si el
      // protocolo ya trae miembros, se usan esos.
      team: (() => {
        const t = asArray<TeamMember>(initialData.team)
        return t.length > 0 ? t : [{ name: '', rolInvestigacion: '', rolPdu: '' }]
      })(),
      objetivoGeneral: asString(initialData.objetivoGeneral),
      objetivos: asArray<TextItem>(initialData.objetivos),
      hipotesis: asString(initialData.hipotesis),
      kpis: asArray<TextItem>(initialData.kpis),
      fechaInicio: asString(initialData.fechaInicio),
      fechaResultados: asString(initialData.fechaResultados),
      // Al menos una fila de documentación por defecto (con placeholders).
      docs: (() => {
        const d = asArray<DocItem>(initialData.docs)
        return d.length > 0 ? d : [{ nombre: '', link: '' }]
      })(),
      metodo: asString(initialData.metodo) || (isUsabilidad ? 'Prueba de Usabilidad' : ''),
      enfoque: asString(initialData.enfoque),
      duracion: asString(initialData.duracion),
      fechasAplicacionInicio: asString(initialData.fechasAplicacionInicio),
      fechasAplicacionFin: asString(initialData.fechasAplicacionFin),
      muestra: asString(initialData.muestra),
      razonMuestra: asString(initialData.razonMuestra),
      caracteristica: asString(initialData.caracteristica),
      nivelDigital: asString(initialData.nivelDigital),
      edad: asString(initialData.edad),
      genero: asString(initialData.genero),
      nse: asString(initialData.nse),
      ocupacion: asString(initialData.ocupacion),
      pais: asString(initialData.pais),
      contexto: asString(initialData.contexto),
      linkProtoPersona: asString(initialData.linkProtoPersona),
      linkUserPersona: asString(initialData.linkUserPersona),
      intro: asString(initialData.intro),
      cierre: asString(initialData.cierre),
      testUrl: asString(initialData.testUrl),
      herramientaPrueba: asString(initialData.herramientaPrueba),
    },
  })

  const team = useFieldArray({ control, name: 'team' })
  const objetivos = useFieldArray({ control, name: 'objetivos' })
  const kpis = useFieldArray({ control, name: 'kpis' })
  const docs = useFieldArray({ control, name: 'docs' })

  // Herramientas y entregables como chips removibles (estado local en el payload).
  // El template 'usabilidad' pre-carga Maze y Figma si no hay herramientas.
  const [herramientas, setHerramientas] = useState<string[]>(() => {
    const h = asArray<string>(initialData.herramientas)
    return h.length > 0 ? h : isUsabilidad ? ['Maze', 'Figma'] : []
  })
  const [herramientaInput, setHerramientaInput] = useState('')
  const [entregables, setEntregables] = useState<string[]>(
    asArray<string>(initialData.entregables)
  )

  const [questions, setQuestions] = useState<Question[]>(
    asQuestions(initialData.questions)
  )

  // Emite el estado combinado (RHF + listas locales) al padre.
  const emit = (over?: Record<string, unknown>) => {
    onChange({ ...getValues(), questions, herramientas, entregables, ...over })
  }

  useEffect(() => {
    const sub = watch((values, { name }) => {
      if (name) onChange({ ...values, questions, herramientas, entregables })
    })
    return () => sub.unsubscribe()
  }, [watch, onChange, questions, herramientas, entregables])

  const handleQuestions = (next: Question[]) => {
    setQuestions(next)
    onChange({ ...getValues(), questions: next, herramientas, entregables })
  }

  const addHerramienta = (value: string) => {
    const v = value.trim()
    if (!v || herramientas.includes(v)) return
    const next = [...herramientas, v]
    setHerramientas(next)
    setHerramientaInput('')
    onChange({ ...getValues(), questions, herramientas: next, entregables })
  }

  const removeHerramienta = (value: string) => {
    const next = herramientas.filter((h) => h !== value)
    setHerramientas(next)
    onChange({ ...getValues(), questions, herramientas: next, entregables })
  }

  const addEntregable = (value: string) => {
    const v = value.trim()
    if (!v || entregables.includes(v)) return
    const next = [...entregables, v]
    setEntregables(next)
    onChange({ ...getValues(), questions, herramientas, entregables: next })
  }

  const removeEntregable = (value: string) => {
    const next = entregables.filter((e) => e !== value)
    setEntregables(next)
    onChange({ ...getValues(), questions, herramientas, entregables: next })
  }

  const handleSuggestSample = () => {
    const metodo = getValues('metodo')
    const { range, lower } = suggestSampleFor(metodo)
    setValue('muestra', String(lower))
    emit({ muestra: String(lower) })
    showToast(
      `Muestra sugerida: ${range} participantes basado en ${metodo || 'el método'}`,
      'success'
    )
  }

  return (
    <div>
      {/* 1. DATOS DEL PROYECTO */}
      <div className="card" id="s-datos-proyecto">
        <div className="card-header">
          <div className="card-icon">📋</div>
          <div>
            <div className="card-title">Datos del proyecto</div>
            <div className="card-subtitle">Información general del proyecto</div>
          </div>
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label>Proyecto</label>
            <input type="text" placeholder="Nombre del proyecto" {...register('proyecto')} />
          </div>
          <div className="form-group">
            <label>Cliente</label>
            <input
              type="text"
              placeholder="Nombre del cliente o empresa"
              {...register('cliente')}
            />
          </div>
          <div className="form-group">
            <label>Tema</label>
            <input type="text" placeholder="Tema o área de investigación..." {...register('tema')} />
          </div>
          <div className="form-group">
            <label>Carpeta del proyecto</label>
            <select {...register('folderId')}>
              <option value="">Sin carpeta</option>
              {folders.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.emoji} {f.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. TEAM Y STAKEHOLDERS */}
      <div className="card" id="s-team">
        <div className="card-header">
          <div className="card-icon">👥</div>
          <div>
            <div className="card-title">Team y stakeholders</div>
            <div className="card-subtitle">Equipo involucrado en el estudio</div>
          </div>
        </div>
        <div className="list-container">
          {team.fields.map((f, i) => (
            <div key={f.id} className="list-item">
              <input placeholder="Ej. Ana García" {...register(`team.${i}.name` as const)} />
              <select {...register(`team.${i}.rolInvestigacion` as const)}>
                <option value="">Seleccionar...</option>
                {ROL_INVESTIGACION_OPTIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <select {...register(`team.${i}.rolPdu` as const)}>
                <option value="">Seleccionar...</option>
                {ROL_PDU_OPTIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <button type="button" onClick={() => team.remove(i)} aria-label="Quitar miembro">
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="add-btn"
          onClick={() => team.append({ name: '', rolInvestigacion: '', rolPdu: '' })}
        >
          ＋ Agregar miembro
        </button>
      </div>

      {/* 3. PROPÓSITO DEL ESTUDIO */}
      <div className="card" id="s-proposito">
        <div className="card-header">
          <div className="card-icon">🎯</div>
          <div>
            <div className="card-title">Propósito del estudio</div>
            <div className="card-subtitle">Objetivos generales y específicos</div>
          </div>
        </div>
        <div className="form-group" style={{ marginBottom: 14 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            Objetivo general
            <FieldCommentIndicator fieldKey="objetivo" fieldLabel="Objetivo del protocolo" />
          </label>
          <textarea
            placeholder="Describir el objetivo principal del estudio..."
            {...register('objetivoGeneral')}
          />
        </div>
        <div className="divider" />
        <span className="label-sm">Objetivos específicos</span>
        <div className="list-container">
          {objetivos.fields.map((f, i) => (
            <div key={f.id} className="list-item">
              <input
                placeholder="Objetivo específico..."
                {...register(`objetivos.${i}.value` as const)}
              />
              <button type="button" onClick={() => objetivos.remove(i)} aria-label="Quitar">
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="add-btn"
          onClick={() => objetivos.append({ value: '' })}
        >
          ＋ Agregar objetivo específico
        </button>
      </div>

      {/* 4. HIPÓTESIS */}
      <div className="card" id="s-hipotesis">
        <div className="card-header">
          <div className="card-icon">🧪</div>
          <div>
            <div className="card-title">Hipótesis</div>
            <div className="card-subtitle">Supuesto que guía la investigación</div>
          </div>
        </div>
        <div className="form-group">
          <label>Hipótesis</label>
          <textarea
            placeholder="Creemos que... para... lo que resultará en..."
            {...register('hipotesis')}
          />
        </div>
      </div>

      {/* 5. KPIs */}
      <div className="card" id="s-kpis">
        <div className="card-header">
          <div className="card-icon">📊</div>
          <div>
            <div className="card-title">KPIs</div>
            <div className="card-subtitle">Indicadores clave de desempeño</div>
          </div>
        </div>
        <div className="list-container">
          {kpis.fields.map((f, i) => (
            <div key={f.id} className="list-item">
              <input placeholder="KPI..." {...register(`kpis.${i}.value` as const)} />
              <button type="button" onClick={() => kpis.remove(i)} aria-label="Quitar">
                ✕
              </button>
            </div>
          ))}
        </div>
        <button type="button" className="add-btn" onClick={() => kpis.append({ value: '' })}>
          ＋ Agregar KPI
        </button>
      </div>

      {/* 6. FECHAS */}
      <div className="card" id="s-fechas">
        <div className="card-header">
          <div className="card-icon">📅</div>
          <div>
            <div className="card-title">Fechas de implementación y entrega</div>
            <div className="card-subtitle">Plazos del estudio</div>
          </div>
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label>Fecha de inicio de la investigación</label>
            <input type="date" {...register('fechaInicio')} />
          </div>
          <div className="form-group">
            <label>Presentación de resultados</label>
            <input type="date" {...register('fechaResultados')} />
          </div>
        </div>
      </div>

      {/* 7. ENTREGABLES */}
      <div className="card" id="s-entregables">
        <div className="card-header">
          <div className="card-icon">📦</div>
          <div>
            <div className="card-title">Entregables esperados</div>
            <div className="card-subtitle">Output del estudio</div>
          </div>
        </div>
        <div className="form-group">
          <label>Entregable</label>
          <select
            value=""
            onChange={(e) => {
              if (e.target.value) addEntregable(e.target.value)
            }}
          >
            <option value="">+ Agregar entregable</option>
            {ENTREGABLE_OPTIONS.filter((o) => !entregables.includes(o)).map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
        {entregables.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
            {entregables.map((e) => (
              <span
                key={e}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  background: 'var(--accent-lt)',
                  color: 'var(--accent)',
                  borderRadius: 999,
                  padding: '3px 10px',
                  fontSize: 12.5,
                  fontWeight: 600,
                }}
              >
                {e}
                <button
                  type="button"
                  onClick={() => removeEntregable(e)}
                  aria-label={`Quitar ${e}`}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    color: 'inherit',
                    fontSize: 13,
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 8. DOCUMENTACIÓN */}
      <div className="card" id="s-documentacion">
        <div className="card-header">
          <div className="card-icon">📎</div>
          <div>
            <div className="card-title">Documentación adicional</div>
            <div className="card-subtitle">Documentos y enlaces de referencia</div>
          </div>
        </div>
        <div className="list-container">
          {docs.fields.map((f, i) => (
            <div key={f.id} className="list-item">
              <input placeholder="Ej. Research plan" {...register(`docs.${i}.nombre` as const)} />
              <input placeholder="https://..." {...register(`docs.${i}.link` as const)} />
              <button type="button" onClick={() => docs.remove(i)} aria-label="Quitar">
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="add-btn"
          onClick={() => docs.append({ nombre: '', link: '' })}
        >
          ＋ Agregar documento
        </button>
      </div>

      {/* 9. METODOLOGÍA */}
      <div className="card" id="s-metodologia">
        <div className="card-header">
          <div className="card-icon">⚗️</div>
          <div>
            <div className="card-title">Metodología</div>
            <div className="card-subtitle">Método y configuración de la prueba</div>
          </div>
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label>Método</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <select style={{ flex: 1 }} {...register('metodo')}>
                <option value="">Seleccionar...</option>
                {METODO_OPTIONS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ fontSize: 12, flexShrink: 0 }}
                onClick={() => showToast('Edición de metodologías próximamente', 'info')}
              >
                Editar
              </button>
            </div>
          </div>
          <div className="form-group">
            <label>Enfoque</label>
            <select {...register('enfoque')}>
              <option value="">Seleccionar...</option>
              {ENFOQUE_OPTIONS.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Herramientas</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
              {herramientas.map((h) => (
                <span
                  key={h}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    background: 'var(--accent-lt)',
                    color: 'var(--accent)',
                    borderRadius: 999,
                    padding: '3px 10px',
                    fontSize: 12.5,
                    fontWeight: 600,
                  }}
                >
                  {h}
                  <button
                    type="button"
                    onClick={() => removeHerramienta(h)}
                    aria-label={`Quitar ${h}`}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      color: 'inherit',
                      fontSize: 13,
                      lineHeight: 1,
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder="+ Agregar herramienta"
                value={herramientaInput}
                onChange={(e) => setHerramientaInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addHerramienta(herramientaInput)
                  }
                }}
                style={{ flex: 1, minWidth: 140 }}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Duración por sesión</label>
            <select {...register('duracion')}>
              <option value="">Seleccionar...</option>
              {DURACION_OPTIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group full" style={{ padding: 0, border: 'none', background: 'none' }}>
            <div className="form-grid cols-3" style={{ gap: 14 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Fechas de aplicación — inicio</label>
                <input type="date" {...register('fechasAplicacionInicio')} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Fechas de aplicación — fin</label>
                <input type="date" {...register('fechasAplicacionFin')} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Muestra esperada</label>
                <input type="number" min={1} placeholder="8" {...register('muestra')} />
              </div>
            </div>
          </div>

          <div className="form-group full">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 6,
              }}
            >
              <label style={{ marginBottom: 0 }}>Razón del tamaño de la muestra</label>
              <button
                type="button"
                onClick={handleSuggestSample}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--accent)',
                  background: 'var(--accent-lt)',
                  border: '1px solid transparent',
                  borderRadius: 'var(--radius-sm)',
                  padding: '5px 10px',
                  cursor: 'pointer',
                }}
              >
                ✦ Corregir con IA
              </button>
            </div>
            <textarea
              placeholder="Justificación del número de participantes..."
              {...register('razonMuestra')}
            />
          </div>
        </div>
      </div>

      {/* 10. PERFIL DEL USUARIO */}
      <div className="card" id="s-perfil-usuario">
        <div className="card-header">
          <div className="card-icon">👤</div>
          <div>
            <div className="card-title">Perfil del usuario</div>
            <div className="card-subtitle">Características del participante objetivo</div>
          </div>
        </div>
        <div className="form-grid">
          <div className="form-group full">
            <label>Características específicas</label>
            <textarea
              placeholder="Usuario activo de apps de finanzas..."
              {...register('caracteristica')}
            />
          </div>
          <div className="form-group">
            <label>Digitalización de usuario</label>
            <select {...register('nivelDigital')}>
              <option value="">Seleccionar...</option>
              {DIGITAL_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Edad</label>
            <select {...register('edad')}>
              <option value="">Seleccionar...</option>
              {EDAD_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
            <CuotaField rows={EDAD_CUOTA_ROWS} defaultOpen={isUsabilidad} />
          </div>
          <div className="form-group">
            <label>Género</label>
            <select {...register('genero')}>
              <option value="">Seleccionar...</option>
              {GENERO_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
            <CuotaField rows={GENERO_CUOTA_ROWS} defaultOpen={isUsabilidad} />
          </div>
          <div className="form-group">
            <label>NSE</label>
            <select {...register('nse')}>
              <option value="">Seleccionar...</option>
              {NSE_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
            <CuotaField rows={NSE_CUOTA_ROWS} defaultOpen={isUsabilidad} />
          </div>
          <div className="form-group">
            <label>Ocupación</label>
            <select {...register('ocupacion')}>
              <option value="">Seleccionar...</option>
              {OCUPACION_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
            <CuotaField rows={OCUPACION_CUOTA_ROWS} defaultOpen={isUsabilidad} />
          </div>
          <div className="form-group">
            <label>País</label>
            <select {...register('pais')}>
              <option value="">Seleccionar...</option>
              {PAIS_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group full">
            <label>Contexto</label>
            <textarea
              placeholder="Contexto de uso, momento del día, dispositivo..."
              {...register('contexto')}
            />
          </div>
          <div className="form-group">
            <label>Link Proto Persona</label>
            <input type="text" placeholder="https://..." {...register('linkProtoPersona')} />
          </div>
          <div className="form-group">
            <label>Link User Persona</label>
            <input type="text" placeholder="https://..." {...register('linkUserPersona')} />
          </div>
        </div>
      </div>

      {/* 11. PREGUNTAS DE LA PRUEBA */}
      <div className="card" id="s-preguntas">
        <div className="card-header">
          <div className="card-icon">❓</div>
          <div>
            <div className="card-title">Preguntas de la prueba</div>
            <div className="card-subtitle">Maze — tipos de preguntas UX</div>
          </div>
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label>Introducción</label>
            <textarea
              placeholder="Guión de introducción para el participante..."
              {...register('intro')}
            />
          </div>
          <div className="form-group">
            <label>Cierre</label>
            <textarea
              placeholder="Guión de cierre al finalizar la prueba..."
              {...register('cierre')}
            />
          </div>
        </div>
        <div className="divider" />
        <span className="label-sm" style={{ marginBottom: 8, display: 'block' }}>
          Preguntas del test
        </span>
        <QuestionList questions={questions} onChange={handleQuestions} />
        <div className="divider" />
        <div className="form-grid">
          <div className="form-group">
            <label>Link de la prueba (url)</label>
            <input type="text" placeholder="https://..." {...register('testUrl')} />
          </div>
          <div className="form-group">
            <label>Herramienta</label>
            <input
              type="text"
              placeholder="Ej. Maze, Lookback, UserZoom..."
              {...register('herramientaPrueba')}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
