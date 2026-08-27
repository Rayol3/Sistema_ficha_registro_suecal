import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { authService } from "../../services/adminApi"
import { Lock, User, LogIn, AlertCircle } from "lucide-react"
import PantallaEstado from "../../components/ui/PantallaEstado"

export default function LoginAdmin() {
  const [usuario,    setUsuario]    = useState("")
  const [contrasena, setContrasena] = useState("")
  const [error,      setError]      = useState("")
  const [cargando,   setCargando]   = useState(false)
  const navigate = useNavigate()
  const [pantalla, setPantalla] = useState({ visible: false })

  useEffect(() => {
    if (localStorage.getItem("admin_token")) {
      navigate("/admin", { replace: true })
    }
  }, [navigate])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setCargando(true)
    try {
      const res = await authService.login(usuario, contrasena)
      localStorage.setItem("admin_token", res.data.access_token)
      localStorage.setItem("admin_nombre", res.data.nombre)
      setPantalla({ visible: true })
      setTimeout(() => navigate("/admin", { replace: true }), 2200)
    } catch {
      setError("Usuario o contraseña incorrectos")
    } finally {
      setCargando(false)
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
              <h2 className="text-lg font-black text-slate-800">
                Panel de Administración
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Ingrese sus credenciales para acceder al sistema
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-3 px-4 py-3
                              bg-red-50 border border-red-100 rounded-2xl">
                <AlertCircle size={14} className="text-red-400 shrink-0" />
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}

            {/* Formulario */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500
                                  uppercase tracking-widest">
                  Usuario
                </label>
                <div className="relative">
                  <User size={14} className="absolute left-4 top-1/2
                                             -translate-y-1/2 text-slate-300" />
                  <input
                    type="text"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    placeholder="usuario"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2
                               border-slate-200 text-slate-800 text-sm
                               placeholder:text-slate-300
                               focus:outline-none focus:border-primary-400
                               focus:ring-4 focus:ring-primary-50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500
                                  uppercase tracking-widest">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock size={14} className="absolute left-4 top-1/2
                                             -translate-y-1/2 text-slate-300" />
                  <input
                    type="password"
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2
                               border-slate-200 text-slate-800 text-sm
                               placeholder:text-slate-300
                               focus:outline-none focus:border-primary-400
                               focus:ring-4 focus:ring-primary-50 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={cargando}
                className="w-full py-3 rounded-2xl bg-primary-600
                           hover:bg-primary-700 disabled:bg-slate-100
                           disabled:cursor-not-allowed text-white font-bold
                           text-sm flex items-center justify-center gap-2
                           shadow-md shadow-primary-200 transition-all
                           active:scale-[0.98]">
                {cargando
                  ? <><span className="animate-spin text-base">⏳</span> Verificando...</>
                  : <><LogIn size={15} /> Ingresar al sistema</>
                }
              </button>
            </form>

            {/* Link volver */}
            <div className="pt-2 border-t border-slate-100 text-center">
              <a href="/"
                className="text-xs text-slate-300 hover:text-primary-500
                           transition-colors">
                ← Volver al formulario de registro
              </a>
            </div>
          </div>
        </div>

        <p className="text-center text-white/20 text-xs mt-4">
          Resolución N° 021-2020-SUNEDU/CD
        </p>
      </div>
      <PantallaEstado
        tipo="bienvenida"
        titulo="¡Bienvenida!"
        subtitulo={`Oficina de RR.HH. — Sub Oficina de Escalafón`}
        visible={pantalla.visible}
        duracion={2000}
        onTerminar={() => navigate("/admin", { replace: true })}
      />
    </div> 
  )
  
}