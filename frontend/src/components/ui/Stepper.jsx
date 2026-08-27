// Stepper con efecto Zeigarnik: muestra siempre lo que falta completar

import { Check } from "lucide-react"
import { PASOS_FICHA } from "../../utils/constants"

export default function Stepper({ pasoActual, onIrAlPaso }) {
  const totalPasos   = PASOS_FICHA.length
  const porcentaje   = Math.round(((pasoActual - 1) / (totalPasos - 1)) * 100)

  return (
    <div className="w-full">

      {/* ── Barra de progreso con Zeigarnik ──────────────────
          Siempre visible, siempre mostrando lo que falta.
          El cerebro no puede ignorar una tarea incompleta.     */}
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-xs font-semibold text-primary-600">
          Paso {pasoActual} de {totalPasos}
        </span>
        <span className="text-xs font-semibold text-slate-500">
          {porcentaje}% completado
        </span>
      </div>

      {/* Barra de progreso */}
      <div className="w-full h-1.5 bg-slate-200 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary-500 to-primary-600
                     rounded-full transition-all duration-500 ease-out"
          style={{ width: `${porcentaje}%` }}
        />
      </div>

      {/* ── Indicadores de pasos ─────────────────────────────
          Completados: verde con check (satisfacción por logro)
          Actual: azul pulsante (foco de atención)
          Pendientes: grises (Zeigarnik: tareas sin terminar)  */}
      <div className="flex items-start justify-between relative">

        {/* Línea conectora de fondo */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-200 z-0" />

        {/* Línea de progreso sobre la conectora */}
        <div
          className="absolute top-4 left-0 h-0.5 bg-primary-500 z-0
                     transition-all duration-500 ease-out"
          style={{
            width: `${((pasoActual - 1) / (totalPasos - 1)) * 100}%`,
          }}
        />

        {PASOS_FICHA.map((paso) => {
          const completado = paso.id < pasoActual
          const activo     = paso.id === pasoActual
          const pendiente  = paso.id > pasoActual

          return (
            <div
              key={paso.id}
              className="flex flex-col items-center gap-1.5 z-10"
              style={{ minWidth: 0, flex: 1 }}
            >
              {/* Círculo del paso */}
              <button
                onClick={() => completado && onIrAlPaso(paso.id)}
                disabled={pendiente || activo}
                title={completado ? `Volver al paso ${paso.id}` : paso.label}
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  text-xs font-bold transition-all duration-300 border-2
                  ${completado
                    ? "bg-green-500 border-green-500 text-white cursor-pointer hover:bg-green-600 hover:scale-110"
                    : activo
                    ? "bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-200 scale-110"
                    : "bg-white border-slate-300 text-slate-400 cursor-default"
                  }
                `}
              >
                {completado
                  ? <Check size={14} strokeWidth={3} />
                  : paso.id
                }
              </button>

              {/* Etiqueta del paso */}
              <span
                className={`text-center leading-tight transition-all duration-300
                  hidden sm:block
                  ${activo     ? "text-primary-700 font-semibold text-xs" :
                    completado ? "text-green-600 font-medium text-xs"     :
                                 "text-slate-400 text-xs"                 }
                `}
                style={{ fontSize: "0.65rem", maxWidth: "64px" }}
              >
                {paso.shortLabel}
              </span>

              {/* Etiqueta móvil: solo paso actual */}
              {activo && (
                <span className="sm:hidden text-primary-700 font-semibold text-xs text-center"
                  style={{ fontSize: "0.65rem" }}>
                  {paso.shortLabel}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}