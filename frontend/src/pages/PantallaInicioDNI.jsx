import { useState } from "react"
import {
  Search, AlertCircle, CheckCircle2,
  RefreshCw, Clock, XCircle,
  ArrowRight, Edit3,
} from "lucide-react"
import { solicitudService } from "../services/adminApi"
import PantallaEstado from "../components/ui/PantallaEstado"

export default function PantallaInicioDNI({ onNuevoRegistro, onEditarRegistro }) {
  const [dni, setDni] = useState("")
  const [estado, setEstado] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState("")
  const [motivo, setMotivo] = useState("")
  const [enviando, setEnviando] = useState(false)
  const [solEnviada, setSolEnviada] = useState(false)

  const [pantalla, setPantalla] = useState({ visible: false, tipo: "cargando", titulo: "", subtitulo: "" })

  const handleBuscar = async () => {
    if (!/^\d{8}$/.test(dni)) {
      setError("Ingrese un DNI válido de 8 dígitos")
      return
    }
    setError(""); setCargando(true); setEstado(null); setSolEnviada(false)
    setPantalla({ visible: true, tipo: "cargando", titulo: "Verificando DNI...", subtitulo: "Consultando registros en el sistema" })
    try {
      const res = await solicitudService.consultarDNI(dni)
      setEstado(res.data)
      setPantalla({ visible: false })
    } catch {
      setError("Error al consultar. Intente nuevamente.")
      setPantalla({ visible: false })
    } finally {
      setCargando(false)
    }
  }

  const handleSolicitarActualizacion = async () => {
    setEnviando(true)
    setPantalla({ visible: true, tipo: "cargando", titulo: "Enviando solicitud...", subtitulo: "Registrando su solicitud de actualización" })
    try {
      await solicitudService.crear(estado.personal_id, motivo)
      setSolEnviada(true)
      const res = await solicitudService.consultarDNI(dni)
      setEstado(res.data)
      setPantalla({ visible: true, tipo: "solicitud", titulo: "¡Solicitud enviada!", subtitulo: "La Oficina de RR.HH. revisará su solicitud y le notificará la respuesta", duracion: 2500 })
    } catch (err) {
      setError(err.response?.data?.detail || "Error al enviar la solicitud")
      setPantalla({ visible: false })
    } finally {
      setEnviando(false)
    }
  }

  const handleContinuar = () => {
    if (estado?.puede_editar) {
      setPantalla({ visible: true, tipo: "cargando", titulo: "Cargando sus datos...", subtitulo: "Preparando el formulario con su información actual" })
      onEditarRegistro(estado.personal_id, dni)
    } else {
      onNuevoRegistro(dni)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(160deg, #0f172a 0%, #1e3a8a 60%, #1d4ed8 100%)"
      }}>

      {/* Círculos decorativos */}
      <div className="fixed top-[-120px] right-[-120px] w-96 h-96
                      rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(96,165,250,0.15), transparent)" }} />
      <div className="fixed bottom-[-80px] left-[-80px] w-72 h-72
                      rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(147,197,253,0.1), transparent)" }} />

      <div className="w-full max-w-sm relative z-10">

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Franja de color */}
          <div className="h-1 bg-gradient-to-r from-primary-500
                          via-blue-400 to-primary-600" />

          <div className="px-7 py-7 space-y-5">

            {/* Encabezado institucional */}
            <div className="text-center pb-4 border-b border-slate-100">
              <div className="w-16 h-16 bg-white rounded-2xl p-1.5 shadow-md
                              mx-auto mb-3 flex items-center justify-center
                              ring-4 ring-slate-100">
                <img src="/logo-unamba.png" alt="UNAMBA"
                  className="w-full h-full object-contain" />
              </div>
              <h1 className="text-sm font-black text-slate-800 leading-tight">
                Universidad Nacional Micaela Bastidas
              </h1>
              <p className="text-primary-600 text-xs mt-0.5 font-semibold">
                Oficina de RR.HH. — Sub Oficina de Escalafón
              </p>
            </div>

            {/* Título */}
            <div className="center text-center space-y-1.5">
              <h2 className="text-lg font-black text-slate-800 leading-tight">
                Ficha de Registro de Datos
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Ingrese su DNI para verificar si ya tiene un registro previo
              </p>
            </div>

            {/* Input DNI */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500
                                uppercase tracking-widest">
                Número de DNI
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={dni}
                  onChange={(e) => {
                    setDni(e.target.value.replace(/\D/g, "").slice(0, 8))
                    setEstado(null); setError(""); setSolEnviada(false)
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
                  placeholder="12345678"
                  maxLength={8}
                  className="flex-1 min-w-0 px-4 py-3 rounded-xl border-2
                             border-slate-200 text-center text-lg font-black
                             tracking-[0.2em] text-slate-800
                             placeholder:text-slate-300 placeholder:font-normal
                             placeholder:tracking-normal focus:outline-none
                             focus:border-primary-400 focus:ring-4
                             focus:ring-primary-50 transition-all"
                />
                <button
                  onClick={handleBuscar}
                  disabled={cargando || dni.length !== 8}
                  className="px-4 rounded-xl bg-primary-600
                             hover:bg-primary-700 disabled:opacity-40
                             disabled:cursor-not-allowed text-white
                             flex items-center justify-center self-stretch
                             shadow-md shadow-primary-200
                             transition-all active:scale-95">
                  {cargando
                    ? <RefreshCw size={16} className="animate-spin" />
                    : <Search size={16} />
                  }
                </button>
              </div>

              {error && (
                <div className="flex items-center gap-2 px-3 py-2
                                bg-red-50 border border-red-100 rounded-xl">
                  <AlertCircle size={12} className="text-red-400 shrink-0" />
                  <p className="text-xs text-red-500">{error}</p>
                </div>
              )}
            </div>

            {/* DNI no existe → nuevo registro */}
            {estado && !estado.existe && (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-4 py-3
                                bg-emerald-50 border border-emerald-200 rounded-2xl">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-emerald-800">
                      DNI disponible
                    </p>
                    <p className="text-xs text-emerald-600">
                      No encontramos registros previos
                    </p>
                  </div>
                </div>
                <button onClick={handleContinuar}
                  className="w-full py-3 rounded-2xl bg-primary-600
                             hover:bg-primary-700 text-white font-bold text-sm
                             flex items-center justify-center gap-2
                             shadow-md shadow-primary-200 transition-all
                             active:scale-[0.98]">
                  Completar mi ficha <ArrowRight size={15} />
                </button>
              </div>
            )}

            {/* DNI existe */}
            {estado && estado.existe && (
              <div className="space-y-3">

                {/* Info trabajador */}
                <div className="flex items-center gap-3 p-3
                                bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="w-10 h-12 rounded-xl overflow-hidden
                                  bg-slate-200 shrink-0">
                    {estado.foto_url
                      ? <img src={estado.foto_url} alt=""
                        className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center
                                        justify-center text-slate-400 text-xs
                                        text-center font-medium p-1">
                        Sin foto
                      </div>
                    }
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">
                      {estado.nombre}
                    </p>
                    <p className="text-xs text-slate-400 font-mono">
                      DNI: {dni}
                    </p>
                  </div>
                </div>

                {/* Sin solicitud previa */}
                {!estado.solicitud && !solEnviada && (
                  <div className="space-y-3">
                    <div className="px-3 py-2.5 bg-amber-50 border
                                    border-amber-200 rounded-xl">
                      <p className="text-xs text-amber-700 leading-relaxed">
                        Ya tiene una ficha registrada. Solicite autorización
                        a RR.HH. para actualizar sus datos.
                      </p>
                    </div>
                    <textarea
                      value={motivo}
                      onChange={(e) => setMotivo(e.target.value)}
                      placeholder="Motivo de actualización..."
                      rows={2}
                      className="w-full px-3 py-2.5 rounded-xl border-2
                                 border-slate-200 text-sm resize-none
                                 focus:outline-none focus:border-primary-400
                                 focus:ring-4 focus:ring-primary-50 transition-all"
                    />
                    <button onClick={handleSolicitarActualizacion}
                      disabled={enviando}
                      className="w-full py-3 rounded-2xl bg-amber-500
                                 hover:bg-amber-600 disabled:bg-slate-100
                                 text-white font-bold text-sm
                                 flex items-center justify-center gap-2
                                 transition-all active:scale-[0.98]">
                      {enviando
                        ? <RefreshCw size={14} className="animate-spin" />
                        : <Edit3 size={14} />
                      }
                      {enviando ? "Enviando..." : "Solicitar actualización"}
                    </button>
                  </div>
                )}

                {/* Pendiente */}
                {estado.solicitud?.estado === "pendiente" && (
                  <div className="flex items-start gap-3 px-4 py-3
                                  bg-blue-50 border border-blue-200 rounded-2xl">
                    <Clock size={15} className="text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-blue-800">
                        Solicitud en revisión
                      </p>
                      <p className="text-xs text-blue-600 mt-0.5">
                        La Oficina de RR.HH. está revisando su solicitud.
                      </p>
                    </div>
                  </div>
                )}

                {/* Aprobada */}
                {estado.solicitud?.estado === "aprobada" && (
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 px-4 py-3
                                    bg-emerald-50 border border-emerald-200
                                    rounded-2xl">
                      <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-emerald-800">
                          Actualización aprobada
                        </p>
                        <p className="text-xs text-emerald-600 mt-0.5">
                          Puede actualizar sus datos ahora.
                        </p>
                      </div>
                    </div>
                    <button onClick={handleContinuar}
                      className="w-full py-3 rounded-2xl bg-primary-600
                                 hover:bg-primary-700 text-white font-bold text-sm
                                 flex items-center justify-center gap-2
                                 shadow-md shadow-primary-200 transition-all
                                 active:scale-[0.98]">
                      <Edit3 size={14} /> Actualizar mis datos
                    </button>
                  </div>
                )}

                {/* Rechazada */}
                {estado.solicitud?.estado === "rechazada" && !solEnviada && (
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 px-4 py-3
                                    bg-red-50 border border-red-200 rounded-2xl">
                      <XCircle size={15} className="text-red-400 shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-red-700">
                          Solicitud rechazada
                        </p>
                        <p className="text-xs text-red-500 mt-0.5">
                          Puede enviar una nueva solicitud.
                        </p>
                      </div>
                    </div>
                    <textarea
                      value={motivo}
                      onChange={(e) => setMotivo(e.target.value)}
                      placeholder="Explique el motivo de la actualización..."
                      rows={2}
                      className="w-full px-3 py-2.5 rounded-xl border-2
                                 border-slate-200 text-sm resize-none
                                 focus:outline-none focus:border-primary-400
                                 focus:ring-4 focus:ring-primary-50 transition-all"
                    />
                    <button onClick={handleSolicitarActualizacion}
                      disabled={enviando}
                      className="w-full py-3 rounded-2xl bg-primary-600
                                 hover:bg-primary-700 text-white font-bold text-sm
                                 flex items-center justify-center gap-2
                                 transition-all active:scale-[0.98]">
                      {enviando
                        ? <RefreshCw size={14} className="animate-spin" />
                        : <Edit3 size={14} />
                      }
                      {enviando ? "Enviando..." : "Enviar nueva solicitud"}
                    </button>
                  </div>
                )}

                {/* Solicitud enviada exitosamente */}
                {solEnviada && estado.solicitud?.estado === "pendiente" && (
                  <div className="flex items-start gap-3 px-4 py-3
                                  bg-emerald-50 border border-emerald-200
                                  rounded-2xl">
                    <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-emerald-800">
                        Solicitud enviada
                      </p>
                      <p className="text-xs text-emerald-600 mt-0.5">
                        La Oficina de RR.HH. le notificará la respuesta.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Link volver */}
          <div className="pt-2 border-t border-slate-100 text-center">
            <a href="/admin"
              className="text-xs text-slate-300 hover:text-primary-500
                           transition-colors">
              → Ingresar como Admin
            </a>
          </div>
          <br />
        </div>

        <p className="text-center text-white/20 text-xs mt-4">
          Resolución N° 021-2020-SUNEDU/CD
        </p>
      </div>
      <PantallaEstado
        tipo={pantalla.tipo}
        titulo={pantalla.titulo}
        subtitulo={pantalla.subtitulo}
        visible={pantalla.visible}
        duracion={pantalla.duracion}
        onTerminar={() => setPantalla({ visible: false })}
      />
    </div>
  )
}
