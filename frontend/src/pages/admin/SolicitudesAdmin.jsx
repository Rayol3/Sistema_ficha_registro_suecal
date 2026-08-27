import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowLeft, Clock, CheckCircle2, XCircle,
  RefreshCw, AlertCircle, User, FileText,
  Filter, ChevronRight, MessageSquare,
} from "lucide-react"
import { solicitudService, adminService } from "../../services/adminApi"
import { generarFicha } from "../../utils/generarFicha"

// ── Badge de estado ───────────────────────────────────────
function BadgeEstado({ estado }) {
  const estilos = {
    pendiente: "bg-amber-100 text-amber-700 border-amber-200",
    aprobada:  "bg-emerald-100 text-emerald-700 border-emerald-200",
    rechazada: "bg-red-100 text-red-600 border-red-200",
  }
  const iconos = {
    pendiente: <Clock size={11} />,
    aprobada:  <CheckCircle2 size={11} />,
    rechazada: <XCircle size={11} />,
  }
  const labels = {
    pendiente: "Pendiente",
    aprobada:  "Aprobada",
    rechazada: "Rechazada",
  }
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5
                      rounded-full text-xs font-semibold border
                      ${estilos[estado] || "bg-slate-100 text-slate-600"}`}>
      {iconos[estado]}
      {labels[estado] || estado}
    </span>
  )
}

// ── Modal de resolución ───────────────────────────────────
function ModalResolver({ solicitud, onResolver, onCancelar, resolviendo }) {
  const [motivo, setMotivo] = useState("")
  const [accion, setAccion] = useState(null) // "aprobada" | "rechazada"

  if (!solicitud) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={() => !resolviendo && onCancelar()} />
      <div className="relative bg-white rounded-2xl shadow-2xl
                      w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-primary-700 to-primary-600
                        px-5 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/15 flex items-center
                          justify-center shrink-0">
            <MessageSquare size={16} className="text-white" />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm">
              Resolver solicitud
            </h3>
            <p className="text-blue-200 text-xs mt-0.5">
              Aprobar o rechazar la solicitud de actualización
            </p>
          </div>
        </div>

        <div className="p-5 space-y-4">

          {/* Info trabajador */}
          <div className="flex items-center gap-3 p-3
                          bg-slate-50 border border-slate-200 rounded-xl">
            <div className="w-10 h-12 rounded-xl overflow-hidden
                            bg-slate-200 shrink-0">
              {solicitud.foto_url
                ? <img src={solicitud.foto_url} alt=""
                    className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center
                                  justify-center">
                    <User size={16} className="text-slate-400" />
                  </div>
              }
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate">
                {solicitud.apellido_paterno} {solicitud.apellido_materno},
                {" "}{solicitud.nombres}
              </p>
              <p className="text-xs text-slate-400">
                DNI: {solicitud.dni}
              </p>
              {solicitud.motivo && (
                <p className="text-xs text-slate-500 mt-1 italic">
                  "{solicitud.motivo}"
                </p>
              )}
            </div>
          </div>

          {/* Selección de acción */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setAccion("aprobada")}
              className={`flex items-center justify-center gap-2 py-3
                          rounded-xl border-2 font-semibold text-sm
                          transition-all
                ${accion === "aprobada"
                  ? "bg-emerald-500 border-emerald-500 text-white shadow-md"
                  : "border-slate-200 text-slate-600 hover:border-emerald-300 hover:bg-emerald-50"
                }`}>
              <CheckCircle2 size={15} />
              Aprobar
            </button>
            <button
              onClick={() => setAccion("rechazada")}
              className={`flex items-center justify-center gap-2 py-3
                          rounded-xl border-2 font-semibold text-sm
                          transition-all
                ${accion === "rechazada"
                  ? "bg-red-500 border-red-500 text-white shadow-md"
                  : "border-slate-200 text-slate-600 hover:border-red-300 hover:bg-red-50"
                }`}>
              <XCircle size={15} />
              Rechazar
            </button>
          </div>

          {/* Motivo opcional */}
          <div>
            <label className="text-xs font-semibold text-slate-500
                              uppercase tracking-wide mb-1.5 block">
              Comentario para el trabajador
              <span className="text-slate-300 font-normal ml-1">(opcional)</span>
            </label>
            <textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder={
                accion === "rechazada"
                  ? "Explique el motivo del rechazo..."
                  : "Mensaje adicional para el trabajador..."
              }
              rows={2}
              className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-200
                         text-sm resize-none focus:outline-none
                         focus:border-primary-400 focus:ring-4
                         focus:ring-primary-50 transition-all"
            />
          </div>

          {/* Botones */}
          <div className="flex gap-2">
            <button onClick={onCancelar} disabled={resolviendo}
              className="btn-secondary flex-1 justify-center">
              Cancelar
            </button>
            <button
              onClick={() => onResolver(solicitud.id, accion, motivo)}
              disabled={!accion || resolviendo}
              className={`flex-1 justify-center btn-primary transition-all
                ${!accion ? "opacity-40 cursor-not-allowed" : ""}
                ${accion === "rechazada"
                  ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                  : ""
                }`}>
              {resolviendo
                ? <RefreshCw size={14} className="animate-spin" />
                : accion === "aprobada"
                  ? <CheckCircle2 size={14} />
                  : accion === "rechazada"
                  ? <XCircle size={14} />
                  : null
              }
              {resolviendo
                ? "Guardando..."
                : accion === "aprobada"
                  ? "Confirmar aprobación"
                  : accion === "rechazada"
                  ? "Confirmar rechazo"
                  : "Seleccione una acción"
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Componente principal ───────────────────────────────────
export default function SolicitudesAdmin() {
  const navigate    = useNavigate()
  const [solicitudes,  setSolicitudes]  = useState([])
  const [cargando,     setCargando]     = useState(true)
  const [error,        setError]        = useState("")
  const [filtroEstado, setFiltroEstado] = useState("pendiente")
  const [modalSol,     setModalSol]     = useState(null)
  const [resolviendo,  setResolviendo]  = useState(false)
  const [toastMsg,     setToastMsg]     = useState(null)

  // ── Toast ─────────────────────────────────────────────
  const mostrarToast = (msg, tipo = "ok") => {
    setToastMsg({ msg, tipo })
    setTimeout(() => setToastMsg(null), 3500)
  }

  // ── Cargar solicitudes ─────────────────────────────────
  const cargar = useCallback(async () => {
    setCargando(true)
    setError("")
    try {
      const res = await solicitudService.listar(filtroEstado)
      setSolicitudes(res.data)
    } catch {
      setError("Error al cargar las solicitudes")
    } finally {
      setCargando(false)
    }
  }, [filtroEstado])

  useEffect(() => { cargar() }, [cargar])

  // ── Resolver solicitud ─────────────────────────────────
  const handleResolver = async (id, estado, motivo) => {
    if (!estado) return
    setResolviendo(true)
    try {
      await solicitudService.resolver(id, estado, motivo)
      setSolicitudes((prev) => prev.filter((s) => s.id !== id))
      setModalSol(null)
      mostrarToast(
        estado === "aprobada"
          ? "Solicitud aprobada correctamente"
          : "Solicitud rechazada",
        estado === "aprobada" ? "ok" : "error"
      )
    } catch {
      mostrarToast("Error al resolver la solicitud", "error")
    } finally {
      setResolviendo(false)
    }
  }

  // ── Generar ficha ──────────────────────────────────────
  const handleGenerarFicha = async (personalId) => {
    try {
      mostrarToast("Generando ficha...", "info")
      const res = await adminService.obtenerFicha(personalId)
      const data = res.data
      generarFicha({
        personal:            data.personal,
        datos_laborales:     data.datos_laborales     || {},
        familiares:          data.familiares           || [],
        formacion_academica: data.formacion_academica || [],
        otros_estudios:      data.otros_estudios      || [],
        experiencia_laboral: data.experiencia_laboral || [],
        experiencia_docente: data.experiencia_docente || [],
        otras_instituciones: data.otras_instituciones || {},
        reconocimientos:     data.reconocimientos     || [],
      }, personalId)
      mostrarToast("Ficha generada correctamente", "ok")
    } catch {
      mostrarToast("Error al generar la ficha", "error")
    }
  }

  const pendientes  = solicitudes.filter((s) => s.estado === "pendiente").length
  const aprobadas   = solicitudes.filter((s) => s.estado === "aprobada").length
  const rechazadas  = solicitudes.filter((s) => s.estado === "rechazada").length

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Header ──────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-unamba-blue to-primary-600
                      shadow-lg sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-3
                        flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/admin")}
              className="text-white/70 hover:text-white transition-colors
                         p-1.5 rounded-lg hover:bg-white/10 shrink-0">
              <ArrowLeft size={18} />
            </button>
            <div>
              <p className="text-white font-bold text-sm leading-tight">
                Solicitudes de Actualización
              </p>
              <p className="text-blue-200 text-xs">
                Gestión de solicitudes del personal
              </p>
            </div>
          </div>
          <button onClick={cargar}
            className="p-2 text-white/70 hover:text-white
                       hover:bg-white/10 rounded-lg transition-colors">
            <RefreshCw size={16} className={cargando ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">

        {/* ── Stats ─────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Pendientes",  valor: pendientes, color: "from-amber-500 to-amber-600",   filtro: "pendiente" },
            { label: "Aprobadas",   valor: aprobadas,  color: "from-emerald-500 to-emerald-600", filtro: "aprobada"  },
            { label: "Rechazadas",  valor: rechazadas, color: "from-red-500 to-red-600",        filtro: "rechazada" },
          ].map(({ label, valor, color, filtro }) => (
            <button key={label}
              onClick={() => setFiltroEstado(filtro)}
              className={`bg-gradient-to-br ${color} rounded-xl p-4
                          text-white shadow-sm text-left transition-all
                          ${filtroEstado === filtro
                            ? "ring-2 ring-white/50 scale-[1.02]"
                            : "opacity-80 hover:opacity-100"
                          }`}>
              <p className="text-2xl font-black leading-none">{valor}</p>
              <p className="text-xs opacity-80 mt-1">{label}</p>
            </button>
          ))}
        </div>

        {/* ── Filtro ────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-slate-200
                        shadow-sm px-4 py-3 flex items-center gap-3">
          <Filter size={14} className="text-slate-400 shrink-0" />
          <span className="text-xs font-semibold text-slate-500
                           uppercase tracking-wide">
            Mostrando:
          </span>
          <div className="flex gap-2 flex-wrap">
            {[
              { label: "Pendientes",  value: "pendiente" },
              { label: "Aprobadas",   value: "aprobada"  },
              { label: "Rechazadas",  value: "rechazada" },
              { label: "Todas",       value: ""          },
            ].map(({ label, value }) => (
              <button key={value}
                onClick={() => setFiltroEstado(value)}
                className={`text-xs px-3 py-1 rounded-full font-semibold
                            transition-colors border
                  ${filtroEstado === value
                    ? "bg-primary-600 text-white border-primary-600"
                    : "border-slate-200 text-slate-500 hover:border-slate-300"
                  }`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Lista de solicitudes ──────────────────────── */}
        <div className="bg-white rounded-xl border border-slate-200
                        shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100
                          flex items-center justify-between bg-slate-50">
            <span className="text-sm font-semibold text-slate-700">
              {solicitudes.length} solicitud{solicitudes.length !== 1 ? "es" : ""}
            </span>
          </div>

          {/* Cargando */}
          {cargando && (
            <div className="text-center py-12">
              <RefreshCw size={24} className="animate-spin mx-auto mb-2
                                              text-primary-400" />
              <p className="text-sm text-slate-400">Cargando solicitudes...</p>
            </div>
          )}

          {/* Error */}
          {error && !cargando && (
            <div className="flex items-center gap-3 mx-4 my-4 px-4 py-3
                            bg-red-50 border border-red-200 rounded-xl">
              <AlertCircle size={15} className="text-red-500 shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Vacío */}
          {!cargando && !error && solicitudes.length === 0 && (
            <div className="text-center py-16 space-y-2">
              <CheckCircle2 size={32} className="text-slate-200 mx-auto" />
              <p className="text-sm font-medium text-slate-500">
                No hay solicitudes{filtroEstado ? ` ${filtroEstado}s` : ""}
              </p>
              <p className="text-xs text-slate-400">
                {filtroEstado === "pendiente"
                  ? "Todo al día — no hay solicitudes por revisar"
                  : "Sin registros en esta categoría"
                }
              </p>
            </div>
          )}

          {/* Filas */}
          {!cargando && solicitudes.length > 0 && (
            <div className="divide-y divide-slate-100">
              {solicitudes.map((s) => (
                <div key={s.id}
                  className="flex items-center gap-3 px-4 py-3
                             hover:bg-slate-50 transition-colors">

                  {/* Foto */}
                  <div className="w-10 h-12 rounded-xl overflow-hidden
                                  bg-slate-100 shrink-0 border border-slate-200">
                    {s.foto_url
                      ? <img src={s.foto_url} alt=""
                          className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center
                                        justify-center">
                          <User size={14} className="text-slate-300" />
                        </div>
                    }
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {s.apellido_paterno} {s.apellido_materno},{" "}
                        {s.nombres}
                      </p>
                      <BadgeEstado estado={s.estado} />
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      DNI: {s.dni}
                      {s.cargo && ` · ${s.cargo}`}
                    </p>
                    {s.motivo && (
                      <p className="text-xs text-slate-500 mt-0.5 italic truncate">
                        "{s.motivo}"
                      </p>
                    )}
                    <p className="text-xs text-slate-300 mt-0.5">
                      Solicitado: {new Date(s.creado_en).toLocaleDateString("es-PE", {
                        day: "2-digit", month: "short", year: "numeric",
                        hour: "2-digit", minute: "2-digit"
                      })}
                    </p>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center gap-1 shrink-0">
                    {s.estado === "pendiente" && (
                      <button
                        onClick={() => setModalSol(s)}
                        className="px-3 py-1.5 rounded-lg bg-primary-600
                                   hover:bg-primary-700 text-white text-xs
                                   font-semibold transition-colors">
                        Resolver
                      </button>
                    )}
                    <button
                      onClick={() => handleGenerarFicha(s.personal_id)}
                      title="Generar ficha"
                      className="p-1.5 text-slate-400 hover:text-primary-600
                                 hover:bg-primary-50 rounded-lg transition-colors">
                      <FileText size={14} />
                    </button>
                    <button
                      onClick={() => navigate(`/admin/ficha/${s.personal_id}`)}
                      title="Ver detalle"
                      className="p-1.5 text-slate-400 hover:text-slate-700
                                 hover:bg-slate-100 rounded-lg transition-colors">
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Modal de resolución ───────────────────────── */}
      <ModalResolver
        solicitud={modalSol}
        onResolver={handleResolver}
        onCancelar={() => setModalSol(null)}
        resolviendo={resolviendo}
      />

      {/* ── Toast ─────────────────────────────────────── */}
      {toastMsg && (
        <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-3
                         px-4 py-3 rounded-xl shadow-xl border text-sm
                         font-medium animate-in slide-in-from-right-2
                         duration-300
          ${toastMsg.tipo === "ok"
            ? "bg-green-50 border-green-200 text-green-800"
            : toastMsg.tipo === "error"
            ? "bg-red-50 border-red-200 text-red-800"
            : "bg-blue-50 border-blue-200 text-blue-800"
          }`}>
          {toastMsg.tipo === "ok"
            ? <CheckCircle2 size={15} className="text-green-500 shrink-0" />
            : toastMsg.tipo === "error"
            ? <AlertCircle size={15} className="text-red-400 shrink-0" />
            : <RefreshCw size={15} className="text-blue-400 shrink-0" />
          }
          {toastMsg.msg}
        </div>
      )}
    </div>
  )
}