// src/hooks/useFicha.js
// Estado global del formulario con persistencia en localStorage

import { useState, useCallback, useEffect, useMemo } from "react"

const STORAGE_KEY = "unamba_ficha_2025"

const ESTADO_INICIAL = {
  personal: {
    apellido_paterno:   "",
    apellido_materno:   "",
    nombres:            "",
    dni:                "",
    libreta_militar:    "",
    sexo:               "",
    fecha_nacimiento:   "",
    estado_civil:       "",
    nac_pais:           "Perú",
    nac_departamento:   "",
    nac_provincia:      "",
    nac_distrito:       "",
    telefono_fijo:      "",
    celular:            "",
    email_personal_1:   "",
    email_personal_2:   "",
    dom_tipo_via:       "",
    dom_direccion:      "",
    dom_referencia:     "",
    tipo_vivienda:      "",
    tipo_vivienda_otro: "",
    ruc:                "",
    licencia_conducir:  "",
    afiliacion_essalud: "",
    grupo_sanguineo:    "",
    donador_organos:    false,
    banco:              "",
    cuenta_numero:      "",
    cuenta_cci:         "",
    denominacion_prof:  "",
    abreviatura_prof:   "",
    colegio_prof_nombre: "",
    colegio_prof_numero: "",
    colegio_prof_fecha:  "",
    sistema_pension:    "",
    afp_nombre:         "",
    codigo_afiliacion:  "",
    fecha_afiliacion:   "",
    tiene_discapacidad: false,
    conadis_registro:   "",
    realizo_serv_militar:      false,
    serv_militar_rama:         "",
    serv_militar_cargo:        "",
    serv_militar_fecha_inicio: "",
    serv_militar_fecha_fin:    "",
    idiomas_nativos: [],
    ofimatica:       [],
  },
  datos_laborales: {
    dependencia:         "",
    cargo:               "",
    fecha_ingreso:       "",
    email_institucional: "",
    condicion:           "",
    tipo_personal:       "",
    categoria_regimen:   "",
    regimen_dl276:       "",
    regimen_cas:         "",
    regimen_ordinario:   "",
    regimen_contratado:  "",
    regimen_otros:       "",
    nivel_remunerativo:  "",
    dedicacion:          "",
    horas_semanales:     null,
    es_renacyt:          false,
    renacyt_codigo:      "",
    renacyt_nivel:       "",
    renacyt_activo:      true,
  },
  familiares:          [],
  formacion_academica: [
    { nivel: "Primaria",   estado: "", centro_estudios: "",
      grado_obtenido: "", mencion: "", fecha_inicio: "",
      fecha_conclusion: "", documento_acredita: "", orden: 1 },
    { nivel: "Secundaria", estado: "", centro_estudios: "",
      grado_obtenido: "", mencion: "", fecha_inicio: "",
      fecha_conclusion: "", documento_acredita: "", orden: 1 },
  ],
  otros_estudios:      [],
  experiencia_laboral: [],
  experiencia_docente: [],
  otras_instituciones: {
    labora_otra_inst: false,
    tipo_personal:    "",
    nombre_entidad:   "",
    dia_lunes:        false,
    dia_martes:       false,
    dia_miercoles:    false,
    dia_jueves:       false,
    dia_viernes:      false,
    horas_diarias:    null,
  },
  reconocimientos: [],
}

// ── Leer desde localStorage ────────────────────────────────
const EBR_INICIAL = [
  { nivel: "Primaria",   estado: "", centro_estudios: "",
    grado_obtenido: "", mencion: "", fecha_inicio: "",
    fecha_conclusion: "", documento_acredita: "", orden: 1 },
  { nivel: "Secundaria", estado: "", centro_estudios: "",
    grado_obtenido: "", mencion: "", fecha_inicio: "",
    fecha_conclusion: "", documento_acredita: "", orden: 1 },
]

function cargarEstado() {
  try {
    const guardado = localStorage.getItem(STORAGE_KEY)
    if (!guardado) return null
    const parsed = JSON.parse(guardado)
    if (!parsed.ficha || !parsed.pasoActual) return null

    // Garantizar que Primaria y Secundaria siempre existan
    const fa = parsed.ficha.formacion_academica || []
    const tienePrimaria   = fa.some((f) => f.nivel === "Primaria")
    const tieneSecundaria = fa.some((f) => f.nivel === "Secundaria")
    if (!tienePrimaria || !tieneSecundaria) {
      parsed.ficha.formacion_academica = [
        ...EBR_INICIAL.filter((e) =>
          (e.nivel === "Primaria"   && !tienePrimaria) ||
          (e.nivel === "Secundaria" && !tieneSecundaria)
        ),
        ...fa,
      ]
    }
    return parsed
  } catch {
    return null
  }
}

// ── Guardar en localStorage ────────────────────────────────
function guardarEstado(ficha, pasoActual, tocados) {
  try {
    // No guardar el archivo de foto (no serializable)
    const fichaLimpia = {
      ...ficha,
      personal: {
        ...ficha.personal,
        _foto_archivo: undefined,
      },
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ficha:      fichaLimpia,
      pasoActual,
      tocados,
      timestamp:  Date.now(),
    }))
  } catch {
    // localStorage lleno u otro error — ignorar silenciosamente
  }
}

export function useFicha() {
  // ── Inicializar desde localStorage si existe ─────────────
  const estadoGuardado = cargarEstado()

  const [ficha, setFicha] = useState(
    estadoGuardado?.ficha || ESTADO_INICIAL
  )
  const [pasoActual, setPasoActual] = useState(
    estadoGuardado?.pasoActual || 1
  )
  // Estado de campos tocados persistido globalmente
  const [tocados, setTocados] = useState(
    estadoGuardado?.tocados || {}
  )
  const [cargando,   setCargando]   = useState(false)
  const [personalId, setPersonalId] = useState(null)
  const [completado, setCompletado] = useState(false)

  // ── Persistir en localStorage cada vez que cambia el estado
  useEffect(() => {
    if (!completado) {
      guardarEstado(ficha, pasoActual, tocados)
    }
  }, [ficha, pasoActual, tocados, completado])

  // ── Marcar campos como tocados (persiste entre pasos) ─────
  const marcarTocado = useCallback((campo) => {
    setTocados((prev) => ({ ...prev, [campo]: true }))
  }, [])

  const marcarTocados = useCallback((campos) => {
    setTocados((prev) => {
      const nuevo = { ...prev }
      campos.forEach((c) => { nuevo[c] = true })
      return nuevo
    })
  }, [])

  // ── Actualizar sección completa ───────────────────────────
  const actualizarSeccion = useCallback((seccion, datos) => {
    setFicha((prev) => ({ ...prev, [seccion]: datos }))
  }, [])

  // ── Actualizar campo individual ───────────────────────────
  const actualizarCampo = useCallback((seccion, campo, valor) => {
    setFicha((prev) => ({
      ...prev,
      [seccion]: { ...prev[seccion], [campo]: valor },
    }))
    // Marcar como tocado automáticamente al escribir
    if (campo) marcarTocado(`${seccion}.${campo}`)
  }, [marcarTocado])

  // ── Navegación ────────────────────────────────────────────
  const irAlPaso      = useCallback((paso) => setPasoActual(paso), [])
  const siguientePaso = useCallback(() =>
    setPasoActual((p) => Math.min(p + 1, 7)), [])
  const pasoAnterior  = useCallback(() =>
    setPasoActual((p) => Math.max(p - 1, 1)), [])

  // ── Progreso: pasos completados sobre total ───────────────
  // Retorna el % de pasos ya superados (anteriores al actual).
  // Simple, honesto y nunca confunde al usuario.
  const getCamposObligatoriosPaso = useCallback((paso) => {
    // Devolvemos un array de "ok" por cada paso completado
    // FormularioPage calcula el % sobre PASOS_FICHA.length
    const pasosCompletados = paso - 1
    return Array(pasosCompletados).fill("ok")
  }, [])

  // ── Preparar payload para el backend ─────────────────────
  const prepararPayload = useCallback(() => {
    const limpiar     = (valor) => valor === "" ? null : valor
    const limpiarFecha = (valor) => (!valor || valor === "") ? null : valor

    const personal = { ...ficha.personal }
    delete personal._foto_archivo

    const camposOpcionalesPersonal = [
      "libreta_militar", "telefono_fijo", "email_personal_2",
      "dom_tipo_via", "dom_referencia", "tipo_vivienda", "tipo_vivienda_otro",
      "ruc", "licencia_conducir", "afiliacion_essalud",
      "grupo_sanguineo", "banco", "cuenta_numero", "cuenta_cci",
      "denominacion_prof", "abreviatura_prof", "colegio_prof_nombre",
      "colegio_prof_numero", "sistema_pension", "afp_nombre",
      "conadis_registro", "serv_militar_rama", "serv_militar_cargo",
      "codigo_afiliacion",
    ]
    camposOpcionalesPersonal.forEach((c) => {
      personal[c] = limpiar(personal[c])
    })

    // Limpiar fechas específicamente
    const fechasPersonal = [
      "colegio_prof_fecha",
      "serv_militar_fecha_inicio",
      "serv_militar_fecha_fin",
      "fecha_afiliacion",
    ]
    fechasPersonal.forEach((c) => {
      personal[c] = limpiarFecha(personal[c])
    })

    const laboral = { ...ficha.datos_laborales }
    const camposOpcionalesLaboral = [
      "categoria_regimen", "regimen_dl276", "regimen_cas",
      "regimen_ordinario", "regimen_contratado", "regimen_otros",
      "nivel_remunerativo", "dedicacion",
      "renacyt_codigo", "renacyt_nivel",
    ]
    camposOpcionalesLaboral.forEach((c) => {
      laboral[c] = limpiar(laboral[c])
    })

    // Limpiar fecha de ingreso
    laboral.fecha_ingreso = limpiarFecha(laboral.fecha_ingreso)

    // Si no es RENACYT limpiar campos relacionados
    if (!laboral.es_renacyt) {
      laboral.renacyt_codigo = null
      laboral.renacyt_nivel  = null
    }

    const otraInst = { ...ficha.otras_instituciones }
    if (!otraInst.labora_otra_inst) {
      otraInst.tipo_personal  = null
      otraInst.nombre_entidad = null
      otraInst.horas_diarias  = null
    } else {
      otraInst.tipo_personal = limpiar(otraInst.tipo_personal)
      otraInst.horas_diarias = otraInst.horas_diarias || null
    }

    // Limpiar fechas en listas
    const limpiarFechasItem = (item) => {
      const fechas = [
        "fecha_inicio", "fecha_fin", "fecha_culminacion",
        "fecha_conclusion", "fecha_emision", "fecha_documento",
        "fecha_nacimiento", "colegio_prof_fecha",
      ]
      const limpio = { ...item }
      fechas.forEach((f) => {
        if (f in limpio) limpio[f] = limpiarFecha(limpio[f])
      })
      return limpio
    }

    return {
      personal,
      datos_laborales:     laboral,
      familiares:          ficha.familiares.map(limpiarFechasItem),
      formacion_academica: ficha.formacion_academica.map(limpiarFechasItem),
      otros_estudios:      ficha.otros_estudios.map(limpiarFechasItem),
      experiencia_laboral: ficha.experiencia_laboral.map(limpiarFechasItem),
      experiencia_docente: ficha.experiencia_docente.map(limpiarFechasItem),
      otras_instituciones: otraInst,
      reconocimientos:     ficha.reconocimientos.map(limpiarFechasItem),
    }
  }, [ficha])

  // ── Reset completo ────────────────────────────────────────
  const resetFicha = useCallback(() => {
    setFicha(ESTADO_INICIAL)
    setPasoActual(1)
    setTocados({})
    setPersonalId(null)
    setCompletado(false)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return {
    ficha,
    pasoActual,
    cargando,
    personalId,
    completado,
    tocados,
    getCamposObligatoriosPaso, 
    setCargando,
    setPersonalId,
    setCompletado,
    actualizarSeccion,
    actualizarCampo,
    marcarTocado,
    marcarTocados,
    irAlPaso,
    siguientePaso,
    pasoAnterior,
    prepararPayload,
    resetFicha,
  }
}
export { ESTADO_INICIAL }