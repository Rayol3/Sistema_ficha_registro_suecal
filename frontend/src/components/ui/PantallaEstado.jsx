// Cubre: cargando, éxito, error, bienvenida
import { useEffect, useState } from "react"
import {
  CheckCircle2, XCircle, Loader2, Sparkles,
  Shield, Clock,
} from "lucide-react"

// ── Animaciones CSS inline ────────────────────────────────
const estilos = `
  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.92); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse-ring {
    0%   { transform: scale(0.8); opacity: 0.8; }
    50%  { transform: scale(1.1); opacity: 0.3; }
    100% { transform: scale(0.8); opacity: 0.8; }
  }
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  .anim-fade  { animation: fadeIn  0.35s ease-out forwards; }
  .anim-up    { animation: slideUp 0.4s ease-out forwards; }
  .anim-pulse { animation: pulse-ring 1.8s ease-in-out infinite; }
  .anim-spin  { animation: spin-slow 1.2s linear infinite; }
`

// ── Tipos de estado ───────────────────────────────────────
const CONFIGS = {
  cargando: {
    bg:      "from-slate-800 to-slate-900",
    icono:   null, // usa spinner
    color:   "text-white",
    subtitleColor: "text-slate-400",
  },
  exito: {
    bg:      "from-emerald-600 to-emerald-700",
    icono:   CheckCircle2,
    color:   "text-white",
    subtitleColor: "text-emerald-200",
    ringColor: "bg-emerald-400",
  },
  error: {
    bg:      "from-red-600 to-red-700",
    icono:   XCircle,
    color:   "text-white",
    subtitleColor: "text-red-200",
    ringColor: "bg-red-400",
  },
  bienvenida: {
    bg:      "from-primary-700 to-unamba-blue",
    icono:   Sparkles,
    color:   "text-white",
    subtitleColor: "text-blue-200",
    ringColor: "bg-blue-400",
  },
  solicitud: {
    bg:      "from-amber-600 to-amber-700",
    icono:   Clock,
    color:   "text-white",
    subtitleColor: "text-amber-200",
    ringColor: "bg-amber-400",
  },
}

export default function PantallaEstado({
  tipo = "cargando",   // "cargando" | "exito" | "error" | "bienvenida" | "solicitud"
  titulo,
  subtitulo,
  visible = true,
  duracion = null,     // ms — si se pasa, se oculta automáticamente
  onTerminar = null,   // callback cuando termina o se oculta
}) {
  const [mostrar, setMostrar] = useState(visible)
  const [saliendo, setSaliendo] = useState(false)

  useEffect(() => {
    setMostrar(visible)
    setSaliendo(false)
  }, [visible])

  useEffect(() => {
    if (!visible || !duracion) return
    const t = setTimeout(() => {
      setSaliendo(true)
      setTimeout(() => {
        setMostrar(false)
        onTerminar?.()
      }, 300)
    }, duracion)
    return () => clearTimeout(t)
  }, [visible, duracion, onTerminar])

  if (!mostrar) return null

  const cfg = CONFIGS[tipo] || CONFIGS.cargando
  const Icono = cfg.icono

  return (
    <>
      <style>{estilos}</style>
      <div
        className={`fixed inset-0 z-[100] flex items-center justify-center
                    bg-gradient-to-br ${cfg.bg}
                    transition-opacity duration-300
                    ${saliendo ? "opacity-0" : "opacity-100"}`}
      >
        {/* Círculos decorativos de fondo */}
        <div className="absolute top-[-80px] right-[-80px] w-72 h-72
                        rounded-full opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, white, transparent)" }} />
        <div className="absolute bottom-[-60px] left-[-60px] w-56 h-56
                        rounded-full opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, white, transparent)" }} />

        {/* Contenido central */}
        <div className="anim-fade text-center px-8 max-w-sm w-full relative z-10">

          {/* Ícono o spinner */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            {tipo === "cargando" ? (
              <>
                {/* Ring exterior pulsante */}
                <div className="absolute inset-0 rounded-full bg-white/10
                                anim-pulse" />
                {/* Spinner */}
                <div className="absolute inset-2 rounded-full border-4
                                border-white/20 border-t-white anim-spin" />
                {/* Logo UNAMBA centrado */}
                <div className="absolute inset-4 rounded-full bg-white/10
                                flex items-center justify-center">
                  <img src="/logo-unamba.png" alt=""
                    className="w-8 h-8 object-contain opacity-80" />
                </div>
              </>
            ) : (
              <>
                {/* Ring pulsante de color */}
                {cfg.ringColor && (
                  <div className={`absolute inset-0 rounded-full
                                  ${cfg.ringColor} opacity-20 anim-pulse`} />
                )}
                {/* Círculo del ícono */}
                <div className="absolute inset-2 rounded-full bg-white/15
                                flex items-center justify-center">
                  {Icono && (
                    <Icono size={36} className="text-white anim-fade" />
                  )}
                </div>
              </>
            )}
          </div>

          {/* Textos */}
          {titulo && (
            <h2 className={`text-xl font-black leading-tight mb-2
                            ${cfg.color} anim-up`}
              style={{ animationDelay: "0.1s", opacity: 0 }}>
              {titulo}
            </h2>
          )}
          {subtitulo && (
            <p className={`text-sm leading-relaxed anim-up
                           ${cfg.subtitleColor}`}
              style={{ animationDelay: "0.2s", opacity: 0 }}>
              {subtitulo}
            </p>
          )}

          {/* Puntos animados para cargando */}
          {tipo === "cargando" && (
            <div className="flex items-center justify-center gap-1.5 mt-4">
              {[0, 1, 2].map((i) => (
                <div key={i}
                  className="w-1.5 h-1.5 rounded-full bg-white/50"
                  style={{
                    animation: `pulse-ring 1.2s ease-in-out ${i * 0.2}s infinite`
                  }} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}