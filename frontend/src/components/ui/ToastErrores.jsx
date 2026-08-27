import { toast } from "react-hot-toast"
import { AlertCircle, X } from "lucide-react"

export function mostrarErroresPaso(errores, tituloPaso) {
  if (errores.length === 0) return

  toast.custom(
    (t) => (
      <div
        className={`
          bg-white rounded-2xl shadow-2xl border border-red-100
          w-[340px] overflow-hidden
          transition-all duration-300
          ${t.visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}
        `}
      >
        {/* Franja superior roja */}
        <div className="bg-gradient-to-r from-red-500 to-red-600
                        px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center
                            justify-center shrink-0">
              <AlertCircle size={15} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">
                Campos incompletos
              </p>
              <p className="text-red-200 text-xs mt-0.5">
                {tituloPaso}
              </p>
            </div>
          </div>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="text-white/60 hover:text-white transition-colors
                       p-1 rounded-lg hover:bg-white/10"
          >
            <X size={15} />
          </button>
        </div>

        {/* Lista de errores */}
        <div className="px-4 py-3 space-y-1.5">
          {errores.slice(0, 5).map((error, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400
                              shrink-0 mt-1.5" />
              <p className="text-xs text-slate-600 leading-relaxed">
                {error}
              </p>
            </div>
          ))}
          {errores.length > 5 && (
            <p className="text-xs text-slate-400 pl-3.5">
              +{errores.length - 5} campo{errores.length - 5 !== 1 ? "s" : ""} más por completar
            </p>
          )}
        </div>

        {/* Barra de progreso del toast */}
        <div className="h-1 bg-red-100">
          <div
            className="h-full bg-red-400 rounded-full
                       animate-[shrink_5s_linear_forwards]"
            style={{
              animation: "shrink 5s linear forwards",
            }}
          />
        </div>
      </div>
    ),
    {
      duration: 5000,
      position: "top-center",
    }
  )
}