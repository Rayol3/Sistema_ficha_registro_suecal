import { useRef, useState, useMemo, useCallback, useEffect } from "react"
import { Toaster, toast } from "react-hot-toast"
import { useFicha } from "../hooks/useFicha"
import { personalService, fotosService, iniciarKeepAlive, detenerKeepAlive } from "../services/api"
import { adminService, solicitudService } from "../services/adminApi"
import { useModalBienvenida } from "../hooks/useModal"
import ModalBienvenida from "../components/ui/ModalBienvenida"
import { PASOS_FICHA } from "../utils/constants"
import BarraProgreso from "../components/ui/BarraProgreso"
import NavButtons from "../components/ui/NavButtons"
import Step1Personal from "../components/steps/Step1Personal"
import Step2Laboral from "../components/steps/Step2Laboral"
import Step3Familiares from "../components/steps/Step3Familiares"
import Step4Formacion from "../components/steps/Step4Formacion"
import Step5Experiencia from "../components/steps/Step5Experiencia"
import Step6Otros from "../components/steps/Step6Otros"
import Step7Revision from "../components/steps/Step7Revision"
import ModalConfirmacion from "../components/ui/ModalConfirmacion"
import PantallaInicioDNI from "./PantallaInicioDNI"
import {
  validarPaso1, validarPaso2, validarPaso3,
  validarPaso4, validarPaso5, validarPaso6,
} from "../utils/validators"
import { mostrarErroresPaso } from "../components/ui/ToastErrores"
import { generarConstancia } from "../utils/generarConstancia"
import { generarFicha }      from "../utils/generarFicha"
import PantallaEstado from "../components/ui/PantallaEstado"

// ── Fases del flujo ───────────────────────────────────────
// "dni"       → pantalla inicial de verificación de DNI
// "formulario" → formulario multi-paso (nuevo registro)
// "edicion"   → formulario con datos precargados (actualización aprobada)

export default function FormularioPage() {
  const [fase, setFaseState] = useState(
    () => sessionStorage.getItem("unamba_fase") || "dni"
  )
  const [personalIdEdicion, setPersonalIdEdicion] = useState(
    () => {
      const id = sessionStorage.getItem("unamba_edicion_id")
      return id ? parseInt(id) : null
    }
  )
  const [dniVerificado, setDniVerificadoState] = useState(
    () => sessionStorage.getItem("unamba_dni_verificado") || ""
  )

  // Wrappers que persisten en sessionStorage
  const setFase = (valor) => {
    sessionStorage.setItem("unamba_fase", valor)
    setFaseState(valor)
  }
  const setDniVerificado = (valor) => {
    sessionStorage.setItem("unamba_dni_verificado", valor)
    setDniVerificadoState(valor)
  }
  const setPersonalIdEdicionPersistido = (valor) => {
    if (valor) sessionStorage.setItem("unamba_edicion_id", valor)
    else sessionStorage.removeItem("unamba_edicion_id")
    setPersonalIdEdicion(valor)
  }

  const {
    ficha, pasoActual, cargando, completado,
    setCargando, setPersonalId, setCompletado,
    actualizarSeccion, irAlPaso,
    siguientePaso, pasoAnterior,
    prepararPayload, resetFicha,
    actualizarCampo, tocados, personalId,
    getCamposObligatoriosPaso,
  } = useFicha()

  const fotoPreviewRef = useRef(null)
  const topRef         = useRef(null)
  const { mostrar: mostrarBienvenida, cerrar: cerrarBienvenida } =
    useModalBienvenida()

  const progresoPaso = useMemo(() => {
    const totalPasos = 7
    const pasosCompletados = getCamposObligatoriosPaso(pasoActual).length
    return Math.round(((pasosCompletados + 1) / totalPasos) * 100)
  }, [getCamposObligatoriosPaso, pasoActual])

  const estadoGuardado = !!localStorage.getItem("unamba_ficha_2025")
  const scrollTop = () =>
    topRef.current?.scrollIntoView({ behavior: "smooth" })

  const [modalVisible,   setModalVisible]   = useState(false)
  const [modalCancelar,  setModalCancelar]  = useState(false)
  const [pantalla, setPantalla] = useState({ visible: false, tipo: "cargando", titulo: "", subtitulo: "" })

  // ── Keep-alive: mantiene el servidor despierto ────────
  useEffect(() => {
    iniciarKeepAlive()
    return () => detenerKeepAlive() // limpia al desmontar
  }, [])
  // ── Handlers de PantallaInicioDNI ────────────────────────

  // Nuevo registro — simplemente pasar al formulario
  const handleNuevoRegistro = useCallback((dni) => {
    // Pre-llenar el DNI verificado en el estado global
    actualizarCampo("personal", "dni", dni)
    setDniVerificado(dni)
    setFase("formulario")
  }, [actualizarCampo])

  // Edición aprobada — cargar datos existentes y pasar al formulario
  const handleEditarRegistro = useCallback(async (pId, dniTrabajador) => {
    try {
      const data = await personalService.obtenerPorDni(dniTrabajador)

      // Precargar todos los datos en el estado global del formulario
      actualizarSeccion("personal",            data.personal            || {})
      actualizarSeccion("datos_laborales",     data.datos_laborales     || {})
      actualizarSeccion("familiares",          data.familiares          || [])
      actualizarSeccion("formacion_academica", data.formacion_academica || [])
      actualizarSeccion("otros_estudios",      data.otros_estudios      || [])
      actualizarSeccion("experiencia_laboral", data.experiencia_laboral || [])
      actualizarSeccion("experiencia_docente", data.experiencia_docente || [])
      actualizarSeccion("otras_instituciones", data.otras_instituciones || {})
      actualizarSeccion("reconocimientos",     data.reconocimientos     || [])

      // Si tiene foto_url, persistirla en el ref para que Step1 la muestre
      if (data.personal?.foto_url) {
        fotoPreviewRef.current = data.personal.foto_url
      }
      setPersonalIdEdicionPersistido(pId)
      setFase("edicion")
    } catch {
      toast.error("Error al cargar los datos. Intente nuevamente.")
    }
  }, [actualizarSeccion])

  // ── Navegación con validación por paso ───────────────────
  const handleSiguiente = () => {
    let errores = []
    switch (pasoActual) {
      case 1:
        errores = validarPaso1(ficha.personal)
        if (errores.length > 0) {
          mostrarErroresPaso(errores, "Datos Personales")
          scrollTop(); return
        }
        break
      case 2:
        errores = validarPaso2(ficha.datos_laborales)
        if (errores.length > 0) {
          mostrarErroresPaso(errores, "Datos Laborales")
          scrollTop(); return
        }
        break
      case 3:
        errores = validarPaso3(ficha.familiares)
        if (errores.length > 0) {
          mostrarErroresPaso(errores, "Familiares")
          scrollTop(); return
        }
        break
      case 4:
        errores = validarPaso4(ficha.formacion_academica, ficha.otros_estudios)
        if (errores.length > 0) {
          mostrarErroresPaso(errores, "Formación Académica")
          scrollTop(); return
        }
        break
      case 5:
        errores = validarPaso5(ficha.experiencia_laboral, ficha.experiencia_docente)
        if (errores.length > 0) {
          mostrarErroresPaso(errores, "Experiencia Laboral")
          scrollTop(); return
        }
        break
      case 6:
        errores = validarPaso6(ficha.otras_instituciones, ficha.reconocimientos)
        if (errores.length > 0) {
          mostrarErroresPaso(errores, "Otros e Instituciones")
          scrollTop(); return
        }
        break
      default: break
    }
    siguientePaso()
    scrollTop()
  }

  const handleAnterior = () => { pasoAnterior(); scrollTop() }

  const handleIrAlPaso = (paso) => {
    if (paso < pasoActual) { irAlPaso(paso); scrollTop() }
  }

  // ── Envío final ───────────────────────────────────────────
  const handleEnviar = () => {
    const p = ficha.personal
    if (!p.dni || !p.nombres || !p.apellido_paterno ||
        !p.celular || !p.email_personal_1 || !p.dom_direccion) {
      toast.error("Complete los campos obligatorios del Paso 1 antes de enviar")
      return
    }
    const l = ficha.datos_laborales
    if (!l.dependencia || !l.cargo || !l.email_institucional ||
        !l.condicion || !l.tipo_personal) {
      toast.error("Complete los campos obligatorios del Paso 2 antes de enviar")
      return
    }
    setModalVisible(true)
  }

  // ── Confirmar envío (nuevo o actualización) ───────────────
  const handleConfirmar = async () => {
    setCargando(true)
    setModalVisible(false)
    setPantalla({
      visible: true, tipo: "cargando",
      titulo: fase === "edicion" ? "Actualizando datos..." : "Registrando ficha...",
      subtitulo: "Por favor espere, esto puede tomar unos segundos"
    })
    try {
      const payload = prepararPayload()
      let nuevoId

      if (fase === "edicion" && personalIdEdicion) {
        await personalService.actualizar(personalIdEdicion, payload)
        nuevoId = personalIdEdicion
        try {
          await solicitudService.cerrar(personalIdEdicion)
        } catch { }
        toast.success("¡Ficha actualizada correctamente!")
      } else {
        const respuesta = await personalService.crear(payload)
        nuevoId = respuesta.personal.id
        }

      setPantalla({
        visible: true, tipo: "exito",
        titulo: fase === "edicion" ? "¡Datos actualizados!" : "¡Ficha registrada!",
        subtitulo: "Sus datos han sido guardados correctamente en el sistema",
        duracion: 2000
      })
      setTimeout(() => {
        setPantalla({ visible: false })
        setPersonalId(nuevoId)
        setCompletado(true)
      }, 2000)

      // Subir foto en segundo plano (no bloquea la pantalla de éxito)
      const archivoFoto = ficha.personal._foto_archivo
      if (archivoFoto && nuevoId) {
        fotosService.subir(nuevoId, archivoFoto)
          .then(() => {
            toast.success("Foto subida correctamente", { duration: 3000 })
          })
          .catch(() => {
            toast("La foto no pudo subirse. Puede actualizarla después.",
              { icon: "⚠️", duration: 6000 })
          })
      }

    } catch (error) {
      setPantalla({ visible: false })
      if (error.message?.includes("DNI")) {
        toast.error(`DNI ya registrado: ${ficha.personal.dni}`)
        setModalVisible(false)
        irAlPaso(1)
      } else {
        setPantalla({
          visible: true, tipo: "error",
          titulo: "Error al guardar",
          subtitulo: error.message || "Ocurrió un error. Intente nuevamente.",
          duracion: 3000
        })
      }
    } finally {
      setCargando(false)
    }
  }

  const handleCancelar = () => setModalCancelar(true)

  const confirmarCancelar = () => {
    // Limpiar todo y volver al inicio
    resetFicha()
    setFase("dni")
    setDniVerificado("")
    setPersonalIdEdicionPersistido(null)
    sessionStorage.removeItem("unamba_fase")
    sessionStorage.removeItem("unamba_dni_verificado")
    sessionStorage.removeItem("unamba_edicion_id")
    localStorage.removeItem("unamba_ficha_2025")
    setModalCancelar(false)
  }
  // ── Pantalla de éxito ─────────────────────────────────────
  if (completado) {
    return (
      <div className="min-h-screen bg-unamba-light flex items-center
                      justify-center p-4">
        <div className="form-card max-w-md w-full text-center space-y-5">

          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center
                          justify-center mx-auto">
            <svg className="w-10 h-10 text-green-500" fill="none"
              viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {fase === "edicion"
                ? "¡Ficha actualizada con éxito!"
                : "¡Ficha registrada con éxito!"
              }
            </h2>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              Sus datos han sido guardados correctamente en el sistema
              de la Oficina de Recursos Humanos de la UNAMBA.
            </p>
          </div>

          {personalId && (
            <div className="bg-primary-50 border border-primary-200
                            rounded-lg p-4 space-y-1">
              <p className="text-xs text-primary-600 font-semibold
                            uppercase tracking-wide">
                Número de Registro
              </p>
              <p className="text-3xl font-black text-primary-700">
                #{String(personalId).padStart(5, "0")}
              </p>
              <p className="text-xs text-slate-400">
                Guarde este número para futuras consultas
              </p>
            </div>
          )}

          <div className="bg-slate-50 rounded-lg p-3 text-left space-y-1.5">
            <p className="text-xs font-semibold text-slate-500
                          uppercase tracking-wide mb-2">
              Datos registrados
            </p>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Nombre</span>
              <span className="font-medium text-slate-700">
                {ficha.personal.apellido_paterno} {ficha.personal.apellido_materno},{" "}
                {ficha.personal.nombres}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">DNI</span>
              <span className="font-medium text-slate-700">
                {ficha.personal.dni}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Cargo</span>
              <span className="font-medium text-slate-700">
                {ficha.datos_laborales.cargo || "—"}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Dependencia</span>
              <span className="font-medium text-slate-700 text-right max-w-[200px]">
                {ficha.datos_laborales.dependencia || "—"}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-400 italic leading-relaxed">
            Información registrada bajo juramento conforme a la
            Ley N° 27444 — Ley de Procedimiento Administrativo General.
          </p>

          <div className="flex flex-col gap-2 pt-1">
            <button
              onClick={() => generarFicha(ficha, personalId)}
              className="btn-primary w-full justify-center gap-2">
              📄 Descargar Ficha Completa
            </button>
            <button
              onClick={() => generarConstancia(ficha, personalId)}
              className="btn-secondary w-full justify-center gap-2">
              🖨️ Imprimir Constancia de Registro
            </button>
            <button
              onClick={() => {
                resetFicha()
                setFase("dni")
                setDniVerificado("")
                setPersonalIdEdicionPersistido(null)
                sessionStorage.removeItem("unamba_fase")
                sessionStorage.removeItem("unamba_dni_verificado")
                sessionStorage.removeItem("unamba_edicion_id")
              }}
              className="w-full justify-center text-xs text-slate-400
                         hover:text-slate-600 transition-colors py-1">
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Pantalla inicial de DNI ───────────────────────────────
  if (fase === "dni") {
    return (
      <PantallaInicioDNI
        onNuevoRegistro={handleNuevoRegistro}
        onEditarRegistro={handleEditarRegistro}
      />
    )
  }

  // ── Formulario multi-paso ─────────────────────────────────
  const renderPaso = () => {
    switch (pasoActual) {
      case 1: return (
        <Step1Personal
          datos={ficha.personal}
          onChange={actualizarCampo}
          tocados={tocados}
          fotoPreviewPersistida={fotoPreviewRef.current}
          onFotoCargada={(url) => { fotoPreviewRef.current = url }}
          dniVerificado={dniVerificado}
        />
      )
      case 2: return (
        <Step2Laboral
          datos={ficha.datos_laborales}
          onChange={actualizarCampo}
          tocados={tocados}
        />
      )
      case 3: return (
        <Step3Familiares
          datos={ficha.familiares}
          onChange={(seccion, campo, valor) =>
            actualizarSeccion("familiares", valor)
          }
        />
      )
      case 4: return (
        <Step4Formacion
          formacion={ficha.formacion_academica}
          otrosEstudios={ficha.otros_estudios}
          onChangeFormacion={(lista) =>
            actualizarSeccion("formacion_academica", lista)
          }
          onChangeOtros={(lista) =>
            actualizarSeccion("otros_estudios", lista)
          }
        />
      )
      case 5: return (
        <Step5Experiencia
          expLaboral={ficha.experiencia_laboral}
          expDocente={ficha.experiencia_docente}
          tipoPersonal={ficha.datos_laborales.tipo_personal}
          onChangeLaboral={(lista) =>
            actualizarSeccion("experiencia_laboral", lista)
          }
          onChangeDocente={(lista) =>
            actualizarSeccion("experiencia_docente", lista)
          }
        />
      )
      case 6: return (
        <Step6Otros
          otrasInstituciones={ficha.otras_instituciones}
          reconocimientos={ficha.reconocimientos}
          onChangeInstituciones={(datos) =>
            actualizarSeccion("otras_instituciones", datos)
          }
          onChangeReconocimientos={(lista) =>
            actualizarSeccion("reconocimientos", lista)
          }
        />
      )
      case 7: return (
        <Step7Revision
          ficha={ficha}
          onIrAlPaso={handleIrAlPaso}
        />
      )
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-unamba-light">
      <Toaster position="top-right" />

      {mostrarBienvenida && (
        <ModalBienvenida onComenzar={cerrarBienvenida} />
      )}

      {/* Banner de modo edición */}
      {fase === "edicion" && (
        <div className="sticky top-0 z-50 bg-amber-500
                        text-white text-center text-xs font-semibold py-1.5">
          Modo actualización — Modifique los datos necesarios y envíe
        </div>
      )}
      <BarraProgreso
        pasoActual={pasoActual}
        onIrAlPaso={handleIrAlPaso}
        progresoPaso={progresoPaso}
        offsetTop={fase === "edicion" ? 28 : 0}
        onCancelar={handleCancelar}
      />
      <main className="max-w-3xl mx-auto px-4 pb-6 space-y-5"
        style={{ paddingTop: "148px" }}>

        <div ref={topRef} />

        {estadoGuardado && pasoActual > 1 && fase === "formulario" && (
          <div className="flex items-center justify-between px-4 py-2.5
                          bg-blue-50 border border-blue-200 rounded-form
                          text-xs">
            <div className="flex items-center gap-2 text-blue-700">
              <span>💾</span>
              <span>Borrador guardado automáticamente</span>
            </div>
            <button type="button" onClick={() => {
              resetFicha()
              setFase("dni")
              setDniVerificado("")
              sessionStorage.removeItem("unamba_fase")
              sessionStorage.removeItem("unamba_dni_verificado")
            }}
              className="text-blue-500 hover:text-blue-700 font-medium
                         underline underline-offset-2 transition-colors">
              Limpiar y empezar de nuevo
            </button>
          </div>
        )}

        <div className="flex items-center gap-2 px-1">
          <span className="text-xs font-semibold text-primary-600
                           uppercase tracking-widest">
            Paso {pasoActual}
          </span>
          <span className="text-slate-300">·</span>
          <span className="text-sm font-semibold text-slate-700">
            {PASOS_FICHA[pasoActual - 1].label}
          </span>
        </div>

        {renderPaso()}

        <NavButtons
          pasoActual={pasoActual}
          totalPasos={PASOS_FICHA.length}
          onAnterior={handleAnterior}
          onSiguiente={handleSiguiente}
          onEnviar={handleEnviar}
          cargando={cargando}
        />
      </main>

      <ModalConfirmacion
        visible={modalVisible}
        onConfirmar={handleConfirmar}
        onCancelar={() => !cargando && setModalVisible(false)}
        cargando={cargando}
        ficha={ficha}
      />
      <PantallaEstado
        tipo={pantalla.tipo}
        titulo={pantalla.titulo}
        subtitulo={pantalla.subtitulo}
        visible={pantalla.visible}
        duracion={pantalla.duracion}
        onTerminar={() => setPantalla({ visible: false })}
      />
      {/* Modal de confirmación de cancelación */}
      {modalCancelar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setModalCancelar(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl
                          w-full max-w-sm overflow-hidden">
            <div className="bg-red-500 px-5 py-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center
                              justify-center shrink-0 text-white text-lg">
                ✕
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">
                  ¿Cancelar el registro?
                </h3>
                <p className="text-red-200 text-xs mt-0.5">
                  Se perderán todos los datos ingresados
                </p>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-sm text-slate-600 leading-relaxed">
                {fase === "edicion"
                  ? "Se cancelará la actualización y volverá a la pantalla de inicio. Los datos actuales de su ficha no serán modificados."
                  : "Se cancelará el registro y volverá a la pantalla de inicio. Tendrá que ingresar su DNI nuevamente para continuar."
                }
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setModalCancelar(false)}
                  className="btn-secondary flex-1 justify-center">
                  Continuar llenando
                </button>
                <button
                  onClick={confirmarCancelar}
                  className="btn-primary flex-1 justify-center
                             bg-red-600 hover:bg-red-700 focus:ring-red-500">
                  Sí, cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}