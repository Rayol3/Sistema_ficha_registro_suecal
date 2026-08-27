import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import {
  Users, Search, LogOut, FileText, Trash2,
  Filter, ChevronRight, AlertCircle, RefreshCw,
  User, ChevronLeft, ChevronRight as ChevronR,
  CheckCircle2, X, TrendingUp, Award, Briefcase,
  Clock, Download,
} from "lucide-react"
import { adminService, authService, solicitudService } from "../../services/adminApi"
import { generarFicha }    from "../../utils/generarFicha"
import PantallaEstado      from "../../components/ui/PantallaEstado"

const POR_PAGINA = 10

// ── Toast interno del admin ───────────────────────────────
function AdminToast({ toasts, onClose }) {
  if (toasts.length === 0) return null
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((t) => (
        <div key={t.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl
                      border text-sm font-medium min-w-64 animate-in
                      slide-in-from-right-2 duration-300
            ${t.tipo === "ok"
              ? "bg-green-50 border-green-200 text-green-800"
              : t.tipo === "error"
              ? "bg-red-50 border-red-200 text-red-800"
              : "bg-blue-50 border-blue-200 text-blue-800"}`}>
          {t.tipo === "ok"
            ? <CheckCircle2 size={16} className="text-green-500 shrink-0" />
            : t.tipo === "error"
            ? <AlertCircle size={16} className="text-red-500 shrink-0" />
            : <TrendingUp size={16} className="text-blue-500 shrink-0" />
          }
          <span className="flex-1">{t.mensaje}</span>
          <button onClick={() => onClose(t.id)}
            className="text-current opacity-50 hover:opacity-100 shrink-0">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}

// ── Gráfico de dona simple con SVG ────────────────────────
function GraficaDona({ titulo, datos, total }) {
  if (total === 0) return (
    <div className="flex flex-col items-center justify-center h-full py-4">
      <p className="text-xs text-slate-400 italic">Sin datos</p>
    </div>
  )
  const colores = ["#1d4ed8", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"]
  let acumulado = 0
  const radio = 40
  const cx = 60; const cy = 60
  const circunferencia = 2 * Math.PI * radio

  const segmentos = datos.map((d, i) => {
    const porcentaje = d.valor / total
    const offset = circunferencia * (1 - acumulado)
    const largo  = circunferencia * porcentaje
    acumulado += porcentaje
    return { ...d, offset, largo, color: colores[i % colores.length] }
  })

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
        {titulo}
      </p>
      <div className="relative">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle cx={cx} cy={cy} r={radio}
            fill="none" stroke="#f1f5f9" strokeWidth="16" />
          {segmentos.map((s, i) => (
            <circle key={i} cx={cx} cy={cy} r={radio}
              fill="none"
              stroke={s.color}
              strokeWidth="16"
              strokeDasharray={`${s.largo} ${circunferencia - s.largo}`}
              strokeDashoffset={s.offset}
              strokeLinecap="butt"
              transform={`rotate(-90 ${cx} ${cy})`}
            />
          ))}
          <text x={cx} y={cy} textAnchor="middle"
            dominantBaseline="middle"
            className="fill-slate-700 font-black"
            style={{ fontSize: "18px", fontWeight: 900 }}>
            {total}
          </text>
        </svg>
      </div>
      <div className="space-y-1 w-full">
        {segmentos.map((s, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: s.color }} />
              <span className="text-slate-600">{s.label}</span>
            </div>
            <span className="font-semibold text-slate-700">
              {s.valor}
              <span className="text-slate-400 font-normal ml-1">
                ({Math.round(s.valor / total * 100)}%)
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function FechaHora() {
  const [ahora, setAhora] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setAhora(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const fecha = ahora.toLocaleDateString("es-PE", {
    weekday: "short", day: "2-digit", month: "short", year: "numeric"
  })
  const hora = ahora.toLocaleTimeString("es-PE", {
    hour: "2-digit", minute: "2-digit"
  })

  return (
    <>
      <p className="leading-tight" style={{
        fontSize: "10px", margin: 0,
        color: "rgba(147,197,253,0.7)",
        textTransform: "capitalize"
      }}>
        {fecha}
      </p>
      <p className="font-semibold leading-tight" style={{
        fontSize: "11px", margin: 0,
        color: "rgba(255,255,255,0.9)"
      }}>
        {hora}
      </p>
    </>
  )
}

// Badge que muestra el conteo de solicitudes pendientes
function BadgeSolicitudes() {
  const [conteo, setConteo] = useState(0)

  useEffect(() => {
    solicitudService.conteo()
      .then((res) => setConteo(res.data.pendiente || 0))
      .catch(() => {})
  }, [])

  if (conteo === 0) return null
  return (
    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full
                     bg-red-500 text-white text-[10px] font-black
                     flex items-center justify-center leading-none">
      {conteo > 9 ? "9+" : conteo}
    </span>
  )
}

// ── Componente principal ───────────────────────────────────
export default function DashboardAdmin() {
  const navigate = useNavigate()
  const nombre   = localStorage.getItem("admin_nombre") || "Administrador"

  const [personal,        setPersonal]        = useState([])
  const [cargando,        setCargando]        = useState(true)
  const [error,           setError]           = useState("")
  const [busqueda,        setBusqueda]        = useState("")
  const [filtroTipo,      setFiltroTipo]      = useState("")
  const [filtroCondicion, setFiltroCondicion] = useState("")
  const [pagina,          setPagina]          = useState(1)
  const [modalEliminar,   setModalEliminar]   = useState(null)
  const [eliminando,      setEliminando]      = useState(false)
  const [toasts,          setToasts]          = useState([])
  const [pantalla,        setPantalla]        = useState({ visible: false })

  // ── Sistema de toasts ──────────────────────────────────
  const mostrarToast = useCallback((mensaje, tipo = "ok") => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, mensaje, tipo }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const cerrarToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  // ── Cargar lista ───────────────────────────────────────
  const cargarPersonal = useCallback(async () => {
    setCargando(true)
    setError("")
    try {
      const params = {}
      if (busqueda)        params.busqueda      = busqueda
      if (filtroTipo)      params.tipo_personal = filtroTipo
      if (filtroCondicion) params.condicion     = filtroCondicion
      const res = await adminService.listarPersonal(params)
      setPersonal(res.data)
      setPagina(1)
    } catch {
      setError("Error al cargar los registros")
    } finally {
      setCargando(false)
    }
  }, [busqueda, filtroTipo, filtroCondicion])

  useEffect(() => {
    const timer = setTimeout(cargarPersonal, 300)
    return () => clearTimeout(timer)
  }, [cargarPersonal])

  // ── Paginación ─────────────────────────────────────────
  const totalPaginas  = Math.ceil(personal.length / POR_PAGINA)
  const inicio        = (pagina - 1) * POR_PAGINA
  const paginaActual  = personal.slice(inicio, inicio + POR_PAGINA)

  // ── Estadísticas para gráficas ─────────────────────────
  const docentes       = personal.filter((p) => p.tipo_personal === "Docente").length
  const administrativos = personal.filter((p) => p.tipo_personal === "Administrativo").length
  const nombrados      = personal.filter((p) => p.condicion === "Nombrado").length
  const contratados    = personal.filter((p) => p.condicion === "Contratado").length

  // ── Acciones ───────────────────────────────────────────
  const handleGenerarFicha = async (p) => {
    setPantalla({
      visible: true, tipo: "cargando",
      titulo: "Cargando datos...",
      subtitulo: `${p.apellido_paterno} ${p.apellido_materno}, ${p.nombres}`
    })
    try {
      const res = await adminService.obtenerFicha(p.id)
      const data = res.data
      // Cerrar pantalla ANTES de generar para no bloquear
      setPantalla({ visible: false })
      // Pequeña pausa para que React actualice el DOM
      await new Promise((r) => setTimeout(r, 100))
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
      }, p.id)
      mostrarToast(`Ficha generada: ${p.apellido_paterno} ${p.nombres}`, "ok")
    } catch (err) {
      setPantalla({ visible: false })
      console.error("Error generando ficha:", err)
      mostrarToast("Error al cargar los datos", "error")
    }
  }

  const handleEliminar = async () => {
    if (!modalEliminar) return
    setEliminando(true)
    try {
      await adminService.eliminarPersonal(modalEliminar.id)
      setPersonal((prev) => prev.filter((p) => p.id !== modalEliminar.id))
      mostrarToast(
        `Registro eliminado: ${modalEliminar.apellido_paterno} ${modalEliminar.nombres}`,
        "ok"
      )
      setModalEliminar(null)
      // Ajustar página si la actual queda vacía
      if (paginaActual.length === 1 && pagina > 1) setPagina(pagina - 1)
    } catch {
      mostrarToast("Error al eliminar el registro", "error")
    } finally {
      setEliminando(false)
    }
  }

  const handleLogout = () => {
    authService.logout()
    mostrarToast("Sesión cerrada correctamente", "ok")
    setTimeout(() => navigate("/admin/login", { replace: true }), 800)
  }

  const handleExportarExcel = async () => {
    setPantalla({
      visible: true, tipo: "cargando",
      titulo: "Generando Excel...",
      subtitulo: "Preparando el archivo con todos los datos del personal"
    })
    try {
      const res = await adminService.exportarExcel()
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement("a")
      link.href = url
      const fecha = new Date().toISOString().slice(0, 10).replace(/-/g, "")
      link.setAttribute("download", `personal_unamba_${fecha}.xlsx`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      setPantalla({ visible: false })
      mostrarToast("Excel exportado correctamente", "ok")
    } catch {
      setPantalla({ visible: false })
      mostrarToast("Error al exportar el Excel", "error")
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Header ──────────────────────────────────────── */}
      <div className="sticky top-0 z-20 shadow-lg" style={{ background: "#1e3a8a" }}>
        {/* Franja de acento superior */}
        <div style={{
          height: "3px",
          background: "linear-gradient(90deg, #1d4ed8, #60a5fa, #1d4ed8)"
        }} />

        <div className="max-w-7xl mx-auto px-4 flex items-center
                        justify-between gap-3" style={{ height: "68px" }}>

          {/* ── Izquierda: Logo + Nombre ── */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-11 h-11 bg-white rounded-xl p-1 shadow-md
                            flex items-center justify-center shrink-0">
              <img src="/logo-unamba.png" alt="UNAMBA"
                className="w-full h-full object-contain" />
            </div>
            <div className="hidden sm:block"
              style={{ borderLeft: "1px solid rgba(255,255,255,0.15)",
                       paddingLeft: "12px" }}>
              <p className="text-white font-bold text-sm leading-tight">
                Panel de Administración
              </p>
              <p className="text-xs leading-tight"
                style={{ color: "rgba(147,197,253,0.8)" }}>
                UNAMBA — Sub Oficina de Escalafón
              </p>
            </div>
          </div>

          {/* ── Centro: Navegación ── */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => navigate("/admin")}
              className="flex items-center gap-1.5 text-white text-xs
                         font-semibold rounded-lg transition-colors"
              style={{ padding: "6px 14px",
                       background: "rgba(255,255,255,0.15)",
                       border: "none" }}>
              <Users size={13} />
              <span className="hidden sm:inline">Personal</span>
            </button>
            <button
              onClick={() => navigate("/admin/solicitudes")}
              className="relative flex items-center gap-1.5 text-xs
                         font-semibold rounded-lg transition-colors"
              style={{ padding: "6px 14px",
                       background: "transparent",
                       border: "none",
                       color: "rgba(147,197,253,0.9)" }}>
              <Clock size={13} />
              <span className="hidden sm:inline">Solicitudes</span>
              <BadgeSolicitudes />
            </button>
            <button
              onClick={handleExportarExcel}
              className="relative flex items-center gap-1.5 text-xs
                         font-semibold rounded-lg transition-colors"
              style={{ padding: "6px 14px",
                       background: "rgba(255,255,255,0.08)",
                       border: "1px solid rgba(255,255,255,0.15)",
                       color: "rgba(255,255,255,0.9)" }}>
              <Download size={13} />
              <span className="hidden sm:inline">Exportar Excel</span>
            </button>
          </div>

          {/* ── Derecha: Fecha + Usuario + Salir ── */}
          <div className="flex items-center gap-2 shrink-0">

            {/* Fecha y hora */}
            <div className="hidden md:block text-right"
              style={{ paddingRight: "10px",
                       borderRight: "1px solid rgba(255,255,255,0.1)" }}>
              <FechaHora />
            </div>

            {/* Avatar + nombre */}
            <div className="hidden sm:flex items-center gap-2 rounded-xl"
              style={{ padding: "4px 10px",
                       background: "rgba(255,255,255,0.08)",
                       border: "1px solid rgba(255,255,255,0.1)" }}>
              <div className="flex items-center justify-center rounded-lg
                              text-white font-bold shrink-0"
                style={{ width: "28px", height: "28px", fontSize: "11px",
                         background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                         borderRadius: "8px" }}>
                {nombre.slice(0,2).toUpperCase()}
              </div>
              <div>
                <p className="text-white font-semibold leading-tight"
                  style={{ fontSize: "11px", margin: 0 }}>
                  {nombre}
                </p>
                <p className="leading-tight"
                  style={{ fontSize: "10px", margin: 0,
                           color: "rgba(147,197,253,0.7)" }}>
                  Administrador
                </p>
              </div>
            </div>

            {/* Cerrar sesión */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 font-semibold
                         rounded-lg transition-colors"
              style={{ padding: "6px 10px", fontSize: "11px",
                       background: "rgba(239,68,68,0.1)",
                       border: "1px solid rgba(239,68,68,0.2)",
                       color: "rgba(252,165,165,0.9)" }}>
              <LogOut size={13} />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-5">

        {/* ── Stats + Gráficas ──────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Contadores */}
          <div className="lg:col-span-1 grid grid-cols-2 gap-3">
            {[
              {
                label: "Total Personal",
                valor: personal.length,
                color: "from-primary-500 to-primary-700",
                icono: Users,
              },
              {
                label: "Docentes",
                valor: docentes,
                color: "from-blue-500 to-blue-700",
                icono: Briefcase,
              },
              {
                label: "Administrativos",
                valor: administrativos,
                color: "from-amber-500 to-amber-700",
                icono: Award,
              },
              {
                label: "Esta página",
                valor: paginaActual.length,
                color: "from-slate-500 to-slate-700",
                icono: FileText,
              },
            ].map(({ label, valor, color, icono: Icono }) => (
              <div key={label}
                className={`bg-gradient-to-br ${color} rounded-xl p-4
                            text-white shadow-sm`}>
                <Icono size={18} className="opacity-70 mb-2" />
                <p className="text-2xl font-black leading-none">{valor}</p>
                <p className="text-xs opacity-80 mt-1">{label}</p>
              </div>
            ))}
          </div>

          {/* Gráfica tipo de personal */}
          <div className="bg-white rounded-xl border border-slate-200
                          shadow-sm p-4">
            <GraficaDona
              titulo="Tipo de Personal"
              total={personal.length}
              datos={[
                { label: "Docente",        valor: docentes },
                { label: "Administrativo", valor: administrativos },
              ]}
            />
          </div>

          {/* Gráfica condición */}
          <div className="bg-white rounded-xl border border-slate-200
                          shadow-sm p-4">
            <GraficaDona
              titulo="Condición Laboral"
              total={personal.length}
              datos={[
                { label: "Nombrado",   valor: nombrados },
                { label: "Contratado", valor: contratados },
              ]}
            />
          </div>
        </div>

        {/* ── Filtros ───────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-slate-200
                        shadow-sm px-4 py-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2
                                           -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por nombre o DNI..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="input-field pl-8"
              />
            </div>
            <select value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="input-field sm:w-44">
              <option value="">Todos los tipos</option>
              <option value="Docente">Docente</option>
              <option value="Administrativo">Administrativo</option>
            </select>
            <select value={filtroCondicion}
              onChange={(e) => setFiltroCondicion(e.target.value)}
              className="input-field sm:w-44">
              <option value="">Toda condición</option>
              <option value="Nombrado">Nombrado</option>
              <option value="Contratado">Contratado</option>
            </select>
            <button onClick={cargarPersonal}
              className="btn-secondary px-3 shrink-0">
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {/* ── Tabla ─────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-slate-200
                        shadow-sm overflow-hidden">

          {/* Cabecera tabla */}
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50
                          flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users size={15} className="text-primary-600" />
              <span className="text-sm font-semibold text-slate-700">
                Personal registrado
              </span>
            </div>
            <span className="text-xs text-slate-400 bg-slate-200
                             px-2 py-0.5 rounded-full font-medium">
              {personal.length} registro{personal.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Encabezados de columnas */}
          {!cargando && personal.length > 0 && (
            <div className="hidden md:grid grid-cols-12 gap-2
                            px-4 py-2 bg-slate-50/50 border-b border-slate-100">
              <div className="col-span-1"></div>
              <div className="col-span-4 text-xs font-semibold text-slate-400
                              uppercase tracking-wide">Trabajador</div>
              <div className="col-span-2 text-xs font-semibold text-slate-400
                              uppercase tracking-wide">Tipo</div>
              <div className="col-span-2 text-xs font-semibold text-slate-400
                              uppercase tracking-wide">Condición</div>
              <div className="col-span-2 text-xs font-semibold text-slate-400
                              uppercase tracking-wide">Registro</div>
              <div className="col-span-1 text-xs font-semibold text-slate-400
                              uppercase tracking-wide text-right">Acciones</div>
            </div>
          )}

          {/* Cargando */}
          {cargando && (
            <div className="text-center py-16 text-slate-400">
              <RefreshCw size={28} className="animate-spin mx-auto mb-3
                                              text-primary-400" />
              <p className="text-sm">Cargando registros...</p>
            </div>
          )}

          {/* Error */}
          {error && !cargando && (
            <div className="flex items-center gap-3 mx-4 my-4 px-4 py-3
                            bg-red-50 border border-red-200 rounded-xl">
              <AlertCircle size={16} className="text-red-500 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-red-700">
                  Error al cargar
                </p>
                <p className="text-xs text-red-500">{error}</p>
              </div>
              <button onClick={cargarPersonal}
                className="ml-auto btn-secondary text-xs px-2 py-1">
                Reintentar
              </button>
            </div>
          )}

          {/* Sin resultados */}
          {!cargando && !error && personal.length === 0 && (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center
                              justify-center mx-auto">
                <Users size={28} className="text-slate-300" />
              </div>
              <p className="text-sm font-medium text-slate-500">
                No se encontraron registros
              </p>
              {(busqueda || filtroTipo || filtroCondicion) && (
                <button onClick={() => {
                  setBusqueda("")
                  setFiltroTipo("")
                  setFiltroCondicion("")
                }} className="text-xs text-primary-600 hover:underline">
                  Limpiar filtros
                </button>
              )}
            </div>
          )}

          {/* Filas */}
          {!cargando && paginaActual.length > 0 && (
            <div className="divide-y divide-slate-100">
              {paginaActual.map((p, idx) => (
                <div key={p.id}
                  className="grid grid-cols-12 gap-2 items-center
                             px-4 py-3 hover:bg-slate-50/80
                             transition-colors group">

                  {/* N° */}
                  <div className="col-span-1 text-xs text-slate-300
                                  font-mono hidden md:block">
                    {inicio + idx + 1}
                  </div>

                  {/* Foto + nombre */}
                  <div className="col-span-10 md:col-span-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full overflow-hidden
                                    bg-gradient-to-br from-slate-200 to-slate-300
                                    shrink-0 border-2 border-white shadow-sm">
                      {p.foto_url
                        ? <img src={p.foto_url} alt=""
                            className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center
                                          justify-center">
                            <User size={14} className="text-slate-400" />
                          </div>
                      }
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate
                                    leading-tight">
                        {p.apellido_paterno} {p.apellido_materno}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {p.nombres} · <span className="font-mono">{p.dni}</span>
                      </p>
                    </div>
                  </div>

                  {/* Tipo */}
                  <div className="hidden md:block col-span-2">
                    {p.tipo_personal && (
                      <span className={`text-xs px-2 py-1 rounded-full
                                        font-semibold
                        ${p.tipo_personal === "Docente"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-amber-100 text-amber-700"}`}>
                        {p.tipo_personal}
                      </span>
                    )}
                  </div>

                  {/* Condición */}
                  <div className="hidden md:block col-span-2">
                    {p.condicion && (
                      <span className={`text-xs px-2 py-1 rounded-full
                                        font-semibold
                        ${p.condicion === "Nombrado"
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-600"}`}>
                        {p.condicion}
                      </span>
                    )}
                    {p.cargo && (
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {p.cargo}
                      </p>
                    )}
                  </div>

                  {/* Fecha */}
                  <div className="hidden md:block col-span-2">
                    <p className="text-xs text-slate-500">{p.creado_en}</p>
                  </div>

                  {/* Acciones */}
                  <div className="col-span-2 md:col-span-1 flex items-center
                                  justify-end gap-0.5">
                    <button onClick={() => handleGenerarFicha(p)}
                      title="Generar ficha PDF"
                      className="p-1.5 text-primary-400 hover:text-primary-600
                                 hover:bg-primary-50 rounded-lg transition-colors">
                      <FileText size={14} />
                    </button>
                    <button onClick={() => setModalEliminar(p)}
                      title="Eliminar registro"
                      className="p-1.5 text-red-400 hover:text-red-600
                                 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={14} />
                    </button>
                    <button onClick={() => navigate(`/admin/ficha/${p.id}`)}
                      title="Ver detalle completo"
                      className="p-1.5 text-slate-400 hover:text-slate-700
                                 hover:bg-slate-100 rounded-lg transition-colors">
                      <ChevronR size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Paginación ─────────────────────────────── */}
          {totalPaginas > 1 && (
            <div className="px-4 py-3 border-t border-slate-100 bg-slate-50
                            flex items-center justify-between">
              <p className="text-xs text-slate-400">
                Mostrando {inicio + 1}–{Math.min(inicio + POR_PAGINA, personal.length)}{" "}
                de {personal.length} registros
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPagina((p) => Math.max(1, p - 1))}
                  disabled={pagina === 1}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-500
                             hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed
                             transition-colors">
                  <ChevronLeft size={14} />
                </button>

                {/* Números de página */}
                {Array.from({ length: totalPaginas }, (_, i) => i + 1)
                  .filter((n) => {
                    // Mostrar primera, última, actual y adyacentes
                    return n === 1 || n === totalPaginas ||
                      Math.abs(n - pagina) <= 1
                  })
                  .reduce((acc, n, i, arr) => {
                    if (i > 0 && n - arr[i - 1] > 1) acc.push("...")
                    acc.push(n)
                    return acc
                  }, [])
                  .map((n, i) =>
                    n === "..." ? (
                      <span key={`dots-${i}`}
                        className="px-2 text-xs text-slate-400">
                        ...
                      </span>
                    ) : (
                      <button key={n}
                        onClick={() => setPagina(n)}
                        className={`w-8 h-8 rounded-lg text-xs font-semibold
                                    border transition-colors
                          ${pagina === n
                            ? "bg-primary-600 text-white border-primary-600"
                            : "border-slate-200 text-slate-600 hover:bg-white"}`}>
                        {n}
                      </button>
                    )
                  )
                }

                <button
                  onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
                  disabled={pagina === totalPaginas}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-500
                             hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed
                             transition-colors">
                  <ChevronR size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Modal eliminar ─────────────────────────────── */}
      {modalEliminar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => !eliminando && setModalEliminar(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl
                          w-full max-w-sm overflow-hidden">
            <div className="bg-red-500 px-5 py-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center
                              justify-center shrink-0">
                <Trash2 size={16} className="text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">
                  Eliminar registro
                </h3>
                <p className="text-red-200 text-xs">
                  Esta acción no se puede deshacer
                </p>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3 px-3 py-2.5 bg-red-50
                              border border-red-100 rounded-xl">
                <div className="w-9 h-9 rounded-full overflow-hidden
                                bg-slate-200 shrink-0">
                  {modalEliminar.foto_url
                    ? <img src={modalEliminar.foto_url} alt=""
                        className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center">
                        <User size={14} className="text-slate-400" />
                      </div>
                  }
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    {modalEliminar.apellido_paterno} {modalEliminar.apellido_materno}
                  </p>
                  <p className="text-xs text-slate-500">
                    {modalEliminar.nombres} · DNI: {modalEliminar.dni}
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Se eliminarán permanentemente todos los datos de este trabajador
                incluyendo familiares, formación académica, experiencia laboral y foto.
              </p>
              <div className="flex gap-2">
                <button onClick={() => setModalEliminar(null)}
                  disabled={eliminando}
                  className="btn-secondary flex-1 justify-center">
                  Cancelar
                </button>
                <button onClick={handleEliminar}
                  disabled={eliminando}
                  className="flex-1 justify-center btn-primary
                             bg-red-600 hover:bg-red-700 focus:ring-red-500">
                  {eliminando
                    ? <><RefreshCw size={13} className="animate-spin" /> Eliminando...</>
                    : <><Trash2 size={13} /> Sí, eliminar</>
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Toasts ────────────────────────────────────── */}
      <AdminToast toasts={toasts} onClose={cerrarToast} />

      <PantallaEstado
        tipo={pantalla.tipo}
        titulo={pantalla.titulo}
        subtitulo={pantalla.subtitulo}
        visible={pantalla.visible}
        onTerminar={() => setPantalla({ visible: false })}
      />
    </div>
  )
}