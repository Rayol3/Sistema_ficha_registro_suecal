// Botones de navegación fijos — Ley de Fitts: grandes y accesibles
import { ChevronLeft, ChevronRight, Send, Loader2 } from "lucide-react"

export default function NavButtons({
  pasoActual,
  totalPasos,
  onAnterior,
  onSiguiente,
  onEnviar,
  cargando       = false,
  textoSiguiente = "Siguiente",
}) {
  const esPrimerPaso = pasoActual === 1
  const esUltimoPaso = pasoActual === totalPasos

  return (
    /* Barra fija en la parte inferior — siempre visible (Ley de Fitts) */
    <div className="sticky bottom-0 left-0 right-0 z-20 mt-6">
      <div className="bg-white border-t border-slate-100 shadow-lg px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">

          {/* ── Botón Anterior ──────────────────────────────── */}
          <button
            type="button"
            onClick={onAnterior}
            disabled={esPrimerPaso || cargando}
            className="btn-secondary min-w-[110px] justify-center"
          >
            <ChevronLeft size={16} />
            Anterior
          </button>

          {/* ── Indicador central de paso ───────────────────── */}
          <span className="text-xs text-slate-400 font-medium hidden sm:block">
            {pasoActual} / {totalPasos}
          </span>

          {/* ── Botón Siguiente / Enviar ────────────────────── */}
          {esUltimoPaso ? (
            <button
              type="button"
              onClick={onEnviar}
              disabled={cargando}
              className="btn-primary min-w-[160px] justify-center bg-green-600
                         hover:bg-green-700 focus:ring-green-500"
            >
              {cargando
                ? <><Loader2 size={16} className="animate-spin" /> Enviando...</>
                : <><Send size={16} /> Enviar Ficha</>
              }
            </button>
          ) : (
            <button
              type="button"
              onClick={onSiguiente}
              disabled={cargando}
              className="btn-primary min-w-[110px] justify-center"
            >
              {textoSiguiente}
              <ChevronRight size={16} />
            </button>
          )}

        </div>
      </div>
    </div>
  )
}