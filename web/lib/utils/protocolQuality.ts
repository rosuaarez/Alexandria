import type { Protocol } from '@/lib/types'

// Evaluador de calidad del protocolo según los lineamientos UX. Calcula un score
// 0-100 en 10 dimensiones. Lee los campos reales del CompleteForm (con fallbacks
// a nombres alternativos), para que la evaluación refleje datos verdaderos.

export interface QualityDimension {
  label: string
  score: number // 0-10
  maxScore: number // siempre 10
  passed: boolean
  issues: string[]
}

export interface QualityResult {
  totalScore: number // 0-100
  badge: 'Alto' | 'Medio' | 'Bajo'
  dimensions: {
    datosProyecto: QualityDimension
    team: QualityDimension
    proposito: QualityDimension
    hipotesis: QualityDimension
    kpis: QualityDimension
    fechas: QualityDimension
    entregables: QualityDimension
    metodologia: QualityDimension
    perfil: QualityDimension
    preguntas: QualityDimension
  }
  analysisText: string
}

type Rec = Record<string, unknown>

function str(v: unknown): string {
  if (typeof v === 'string') return v
  if (typeof v === 'number') return String(v)
  return ''
}

function arr(v: unknown): unknown[] {
  return Array.isArray(v) ? v : []
}

// Convierte una lista de {value} o de strings a string[].
function textItems(v: unknown): string[] {
  return arr(v).map((x) => {
    if (typeof x === 'string') return x
    if (x && typeof x === 'object' && 'value' in (x as Rec)) return str((x as Rec).value)
    return ''
  })
}

export function evaluateProtocol(protocol: Protocol): QualityResult {
  const data = (protocol.data ?? {}) as Rec

  // 1. DATOS DEL PROYECTO (10 pts)
  const datosIssues: string[] = []
  let datosScore = 0
  if (str(data.proyecto).trim().length > 2) datosScore += 2.5
  else datosIssues.push('Falta el nombre del proyecto')
  if (str(data.cliente).trim().length > 2) datosScore += 2.5
  else datosIssues.push('Falta el cliente')
  if (str(data.tema).trim().length > 2) datosScore += 2.5
  else datosIssues.push('Falta el tema de investigación')
  if (data.folderId || data.carpetaId) datosScore += 2.5
  else datosIssues.push('No hay carpeta asignada')
  const datosProyecto: QualityDimension = {
    label: 'Datos del proyecto',
    score: Math.round(datosScore),
    maxScore: 10,
    passed: datosScore >= 7.5,
    issues: datosIssues,
  }

  // 2. TEAM (10 pts)
  const teamIssues: string[] = []
  let teamScore = 0
  const teamValidos = arr(data.team).filter((m) => {
    const o = (m ?? {}) as Rec
    const nombre = str(o.name) || str(o.nombre)
    const rol = str(o.rolInvestigacion)
    return nombre.trim() !== '' && rol.trim() !== ''
  })
  if (teamValidos.length >= 2) teamScore = 10
  else if (teamValidos.length === 1) {
    teamScore = 5
    teamIssues.push('Se requieren mínimo 2 integrantes')
  } else {
    teamScore = 0
    teamIssues.push('No hay miembros del equipo registrados')
  }
  const team: QualityDimension = {
    label: 'Team y stakeholders',
    score: teamScore,
    maxScore: 10,
    passed: teamScore >= 7,
    issues: teamIssues,
  }

  // 3. PROPÓSITO (10 pts)
  const propIssues: string[] = []
  let propScore = 0
  const objetivo =
    str(data.objetivoGeneral) || str(data.objetivo_general) || str(data.objetivo)
  if (objetivo.trim().length > 20) propScore += 4
  else propIssues.push('El objetivo general está vacío o es muy corto')
  const objetivosRaw =
    arr(data.objetivos).length > 0 ? data.objetivos : data.objetivos_especificos
  const objetivosStrings = textItems(objetivosRaw)
  const objetivosEsp = objetivosStrings.filter(
    (o) => o.trim().length >= 120 && o.trim().length <= 250
  )
  if (objetivosEsp.length >= 3) propScore += 6
  else if (objetivosEsp.length >= 1) {
    propScore += 2
    propIssues.push(
      `Se requieren mínimo 3 objetivos específicos (tienes ${objetivosEsp.length})`
    )
    if (objetivosEsp.length < objetivosStrings.length) {
      propIssues.push('Algunos objetivos no tienen entre 120 y 250 caracteres')
    }
  } else {
    propIssues.push(
      'Faltan los objetivos específicos (mínimo 3, entre 120 y 250 caracteres)'
    )
  }
  const proposito: QualityDimension = {
    label: 'Propósito del estudio',
    score: propScore,
    maxScore: 10,
    passed: propScore >= 7,
    issues: propIssues,
  }

  // 4. HIPÓTESIS (10 pts)
  const hipIssues: string[] = []
  let hipScore = 0
  const hipotesis = str(data.hipotesis)
  const hipLen = hipotesis.trim().length
  if (hipLen >= 60 && hipLen <= 200) hipScore += 5
  else if (hipLen > 0) {
    hipScore += 2
    hipIssues.push(`La hipótesis debe tener entre 60 y 200 caracteres (tiene ${hipLen})`)
  } else {
    hipIssues.push('Falta la hipótesis')
  }
  if (hipotesis && !hipotesis.trim().endsWith('?')) hipScore += 5
  else if (hipotesis) hipIssues.push('La hipótesis debe ser una afirmación, no una pregunta')
  const hipotesisDim: QualityDimension = {
    label: 'Hipótesis',
    score: hipScore,
    maxScore: 10,
    passed: hipScore >= 7,
    issues: hipIssues,
  }

  // 5. KPIs (10 pts)
  const kpiIssues: string[] = []
  let kpiScore = 0
  const kpis = textItems(data.kpis).filter((k) => k.trim().length > 5)
  if (kpis.length >= 2) kpiScore = 10
  else if (kpis.length === 1) {
    kpiScore = 4
    kpiIssues.push('Se requieren mínimo 2 KPIs')
  } else {
    kpiScore = 0
    kpiIssues.push('No hay KPIs definidos (mínimo 2)')
  }
  const kpisDim: QualityDimension = {
    label: 'KPIs',
    score: kpiScore,
    maxScore: 10,
    passed: kpiScore >= 7,
    issues: kpiIssues,
  }

  // 6. FECHAS (10 pts)
  const fechaIssues: string[] = []
  let fechaScore = 0
  if (data.fechaInicio || data.fecha_inicio) fechaScore += 5
  else fechaIssues.push('Falta la fecha de implementación')
  if (data.fechaResultados || data.fecha_entrega || data.presentacion_resultados)
    fechaScore += 5
  else fechaIssues.push('Falta la fecha de entrega/presentación')
  const fechas: QualityDimension = {
    label: 'Fechas',
    score: fechaScore,
    maxScore: 10,
    passed: fechaScore >= 7,
    issues: fechaIssues,
  }

  // 7. ENTREGABLES (10 pts)
  const entIssues: string[] = []
  let entScore = 0
  const entregables = textItems(data.entregables).filter((e) => e.trim().length > 3)
  if (entregables.length >= 1) entScore = 10
  else {
    entScore = 0
    entIssues.push('Define al menos un entregable')
  }
  const entregablesDim: QualityDimension = {
    label: 'Entregables',
    score: entScore,
    maxScore: 10,
    passed: entScore >= 7,
    issues: entIssues,
  }

  // 8. METODOLOGÍA (10 pts)
  const metIssues: string[] = []
  let metScore = 0
  const met = (data.metodologia ?? {}) as Rec
  const herramientas =
    arr(data.herramientas).length > 0 ? arr(data.herramientas) : arr(met.herramientas)
  if (herramientas.length > 0) metScore += 10 / 7
  else metIssues.push('Faltan las herramientas')
  const metCampos: [string, string, string][] = [
    ['metodo', 'metodo', 'Método'],
    ['enfoque', 'enfoque', 'Enfoque'],
    ['duracion', 'duracionSesion', 'Duración por sesión'],
    ['muestra', 'muestraEsperada', 'Muestra esperada'],
    ['razonMuestra', 'razonMuestra', 'Razón de la muestra'],
    ['fechasAplicacionInicio', 'fecha_inicio', 'Fecha de aplicación'],
  ]
  metCampos.forEach(([flat, nested, label]) => {
    const val = str(data[flat]) || str(met[nested])
    if (val.trim()) metScore += 10 / 7
    else metIssues.push(`Falta: ${label}`)
  })
  metScore = Math.min(10, Math.round(metScore))
  const metodologia: QualityDimension = {
    label: 'Metodología',
    score: metScore,
    maxScore: 10,
    passed: metScore >= 7,
    issues: metIssues,
  }

  // 9. PERFIL DEL USUARIO (10 pts)
  const perfilIssues: string[] = []
  let perfilScore = 0
  const perfil = (data.perfil ?? {}) as Rec
  const perfilCampos: [string, string, string][] = [
    ['caracteristica', 'caracteristica_especifica', 'Característica específica'],
    ['nivelDigital', 'digitalizacion', 'Nivel de digitalización'],
    ['edad', 'edad', 'Edad'],
    ['genero', 'genero', 'Género'],
    ['nse', 'nse', 'NSE'],
    ['ocupacion', 'ocupacion', 'Ocupación'],
    ['pais', 'pais', 'País'],
    ['contexto', 'contexto', 'Contexto'],
  ]
  perfilCampos.forEach(([flat, nested, label]) => {
    const val = str(data[flat]) || str(perfil[nested])
    if (val.trim()) perfilScore += 10 / 9
    else perfilIssues.push(`Falta: ${label}`)
  })
  perfilScore = Math.min(10, Math.round(perfilScore))
  const perfilDim: QualityDimension = {
    label: 'Perfil del usuario',
    score: perfilScore,
    maxScore: 10,
    passed: perfilScore >= 7,
    issues: perfilIssues,
  }

  // 10. PREGUNTAS (10 pts)
  const pregIssues: string[] = []
  let pregScore = 0
  const preguntas = arr(data.questions).filter((q) => {
    const o = (q ?? {}) as Rec
    return str(o.text).trim().length > 5 && !!o.type
  })
  const intro = str(data.intro) || str(data.introduccion)
  const cierre = str(data.cierre)
  if (intro.trim().length > 10) pregScore += 2
  else pregIssues.push('Falta la introducción para el participante')
  if (cierre.trim().length > 10) pregScore += 2
  else pregIssues.push('Falta el guión de cierre')
  if (preguntas.length >= 5 && preguntas.length <= 20) pregScore += 6
  else if (preguntas.length > 0) {
    pregScore += 2
    if (preguntas.length < 5)
      pregIssues.push(`Pocas preguntas (${preguntas.length}/5 mínimo)`)
    if (preguntas.length > 20) pregIssues.push('Demasiadas preguntas (máximo 20)')
  } else {
    pregIssues.push('No hay preguntas definidas (mínimo 5)')
  }
  const preguntasDim: QualityDimension = {
    label: 'Preguntas de la prueba',
    score: pregScore,
    maxScore: 10,
    passed: pregScore >= 7,
    issues: pregIssues,
  }

  const dimensions: QualityResult['dimensions'] = {
    datosProyecto,
    team,
    proposito,
    hipotesis: hipotesisDim,
    kpis: kpisDim,
    fechas,
    entregables: entregablesDim,
    metodologia,
    perfil: perfilDim,
    preguntas: preguntasDim,
  }

  // SCORE TOTAL
  const dimValues = Object.values(dimensions)
  const totalScore = Math.round(
    (dimValues.reduce((sum, d) => sum + d.score, 0) / dimValues.length) * 10
  )
  const badge: QualityResult['badge'] =
    totalScore >= 80 ? 'Alto' : totalScore >= 50 ? 'Medio' : 'Bajo'

  // TEXTO DE ANÁLISIS para el chat
  const failedDims = dimValues.filter((d) => !d.passed)
  const allIssues = failedDims.flatMap((d) =>
    d.issues.map((i) => `**${d.label}:** ${i}`)
  )
  const analysisText =
    allIssues.length > 0
      ? `Encontré ${allIssues.length} punto(s) a mejorar:\n\n${allIssues.slice(0, 5).join('\n')}`
      : '¡Excelente! El protocolo cumple con todos los lineamientos de calidad.'

  return { totalScore, badge, dimensions, analysisText }
}
