// Componente modal genérico reutilizable para formularios de items
import { useEffect } from "react"
import { X, Save, Plus } from "lucide-react"

export default function ModalFormulario({
  visible,
  titulo,
  subtitulo,
  onGuardar,
  onCancelar,
  esEdicion = false,
  children,
}) {
  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [visible])

  // Cerrar con Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onCancelar()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onCancelar])

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancelar()
      }}
    >
      {/* Fondo oscuro */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />

      {/* Panel del modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl
                      w-full max-w-lg max-h-[90vh] flex flex-col
                      animate-in fade-in zoom-in-95 duration-200">

        {/* ── Cabecera ──────────────────────────────────── */}
        <div className="bg-gradient-to-r from-primary-700 to-primary-600
                        px-6 py-4 flex items-start justify-between
                        rounded-t-2xl shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/15 flex items-center
                            justify-center shrink-0">
              {esEdicion
                ? <Save size={16} className="text-white" />
                : <Plus size={16} className="text-white" />
              }
            </div>
            <div>
              <h2 className="text-white font-bold text-sm leading-tight">
                {titulo}
              </h2>
              {subtitulo && (
                <p className="text-blue-200 text-xs mt-0.5">{subtitulo}</p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onCancelar}
            className="text-white/60 hover:text-white transition-colors
                       p-1 rounded-lg hover:bg-white/10 shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Cuerpo scrollable ─────────────────────────── */}
        <div className="overflow-y-auto flex-1 px-6 py-5">
          {children}
        </div>

        {/* ── Footer con botones ────────────────────────── */}
        <div className="px-6 pb-5 pt-3 border-t border-slate-100
                        flex flex-col-reverse sm:flex-row gap-2 shrink-0">
          <button
            type="button"
            onClick={onCancelar}
            className="btn-secondary flex-1 justify-center"
          >
            <X size={14} />
            Cancelar
          </button>
          <button
            type="button"
            onClick={onGuardar}
            className="btn-primary flex-1 justify-center"
          >
            <Save size={14} />
            {esEdicion ? "Guardar cambios" : "Agregar"}
          </button>
        </div>
      </div>
    </div>
  )
}