// Guía visual de datos bancarios — Simplificada
import { Info, ArrowLeftRight, Building2 } from "lucide-react"

export default function TarjetaBancaria({ banco, cuenta, cci }) {
  return (
    <div className="space-y-3 w-full max-w-sm mx-auto font-sans">

      {/* Banco seleccionado (opcional) */}
      {banco && (
        <div className="flex items-center justify-between px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-200">
          <span className="text-xs text-slate-500 font-medium">Banco seleccionado:</span>
          <span className="text-xs font-bold text-slate-800 uppercase">{banco}</span>
        </div>
      )}

      {/* 1. Alerta principal (Corta y clara) */}
      <div className="flex items-center gap-2.5 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs">
        <Info size={16} className="text-amber-600 shrink-0" />
        <p>
          Usa los datos de tu <strong>App o Web</strong>. <span className="text-amber-800">No uses los números impresos en tu tarjeta de plástico.</span>
        </p>
      </div>

      {/* 2. N° de Cuenta */}
      <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold tracking-wide uppercase text-slate-400">
            N° de Cuenta
          </span>
          <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md border border-blue-100">
            Para el mismo banco
          </span>
        </div>

        <p className="font-mono text-base font-bold text-slate-800 tracking-wider">
          {cuenta || "191-20012345678"}
        </p>

        <p className="text-[11px] text-slate-500">
          Varía entre 10 y 20 dígitos según tu banco.
        </p>
      </div>

      {/* 3. CCI */}
      <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold tracking-wide uppercase text-slate-400">
            CCI (Interbancario)
          </span>
          <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-100">
            Para otros bancos
          </span>
        </div>

        <p className="font-mono text-base font-bold text-slate-800 tracking-wider">
          {cci || "002-191-00012345678-01"}
        </p>

        <p className="text-[11px] text-slate-500">
          Siempre tiene exactamente 20 dígitos.
        </p>
      </div>
    </div>
  )
}