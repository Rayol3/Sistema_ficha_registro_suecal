// Modal de confirmación antes de enviar la ficha
import { useEffect, useState } from "react"
import {
    AlertTriangle, X, Send, Loader2,
    User, Briefcase, CheckCircle2
} from "lucide-react"

export default function ModalConfirmacion({
    visible,
    onConfirmar,
    onCancelar,
    cargando,
    ficha,
}) {
    const [declaracion, setDeclaracion] = useState(false)

    // Resetear checkbox al abrir el modal
    useEffect(() => {
        if (visible) setDeclaracion(false)
    }, [visible])

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
            if (e.key === "Escape" && !cargando) onCancelar()
        }
        window.addEventListener("keydown", handler)
        return () => window.removeEventListener("keydown", handler)
    }, [cargando, onCancelar])

    if (!visible) return null

    const p = ficha?.personal || {}
    const l = ficha?.datos_laborales || {}

    const nombreCompleto = [
        p.apellido_paterno,
        p.apellido_materno + ",",
        p.nombres,
    ].filter(Boolean).join(" ")

    return (
        // ── Overlay ───────────────────────────────────────────
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget && !cargando) onCancelar()
            }}
        >
            {/* Fondo oscuro */}
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />

            {/* Panel del modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl
                      w-full max-w-md overflow-hidden
                      animate-in fade-in zoom-in-95 duration-200">

                {/* ── Cabecera ────────────────────────────────── */}
                <div className="bg-gradient-to-r from-primary-700 to-primary-600
                        px-6 py-5 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/15 flex items-center
                            justify-center shrink-0">
                            <Send size={18} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-white font-bold text-base">
                                Confirmar envío de ficha
                            </h2>
                            <p className="text-blue-200 text-xs mt-0.5">
                                Verifique los datos antes de continuar
                            </p>
                        </div>
                    </div>
                    {!cargando && (
                        <button
                            type="button"
                            onClick={onCancelar}
                            className="text-white/60 hover:text-white transition-colors
                         p-1 rounded-lg hover:bg-white/10"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>

                {/* ── Cuerpo ──────────────────────────────────── */}
                <div className="px-6 py-5 space-y-4">

                    {/* Aviso */}
                    <div className="flex items-start gap-3 px-3 py-3 bg-amber-50
                          border border-amber-200 rounded-xl">
                        <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-700 leading-relaxed">
                            Una vez enviada la ficha, los datos quedarán registrados en el
                            sistema de la Oficina de RR.HH. Asegúrese de que la información
                            sea correcta antes de confirmar.
                        </p>
                    </div>

                    {/* Resumen de datos clave */}
                    <div className="space-y-2">
                        <p className="text-xs font-semibold text-slate-500 uppercase
                          tracking-wide">
                            Resumen del registro
                        </p>

                        {/* Datos personales */}
                        <div className="flex items-start gap-3 p-3 bg-slate-50
                            rounded-xl border border-slate-200">
                            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center
                              justify-center shrink-0 mt-0.5">
                                <User size={14} className="text-primary-600" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs text-slate-400 mb-0.5">Trabajador</p>
                                <p className="text-sm font-bold text-slate-800 truncate">
                                    {nombreCompleto || "Sin nombre"}
                                </p>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-xs text-slate-500">
                                        DNI: <strong>{p.dni || "—"}</strong>
                                    </span>
                                    <span className="text-xs text-slate-500">
                                        {p.sexo || "—"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Datos laborales */}
                        <div className="flex items-start gap-3 p-3 bg-slate-50
                            rounded-xl border border-slate-200">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center
                              justify-center shrink-0 mt-0.5">
                                <Briefcase size={14} className="text-green-600" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs text-slate-400 mb-0.5">Cargo en UNAMBA</p>
                                <p className="text-sm font-bold text-slate-800 truncate">
                                    {l.cargo || "Sin cargo"}
                                </p>
                                <p className="text-xs text-slate-500 mt-0.5 truncate">
                                    {l.dependencia || "Sin dependencia"}
                                </p>
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                    {l.condicion && (
                                        <span className="text-xs px-1.5 py-0.5 rounded-full
                                     bg-blue-100 text-blue-700 font-medium">
                                            {l.condicion}
                                        </span>
                                    )}
                                    {l.tipo_personal && (
                                        <span className="text-xs px-1.5 py-0.5 rounded-full
                                     bg-purple-100 text-purple-700 font-medium">
                                            {l.tipo_personal}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Conteo de secciones */}
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                {
                                    label: "Familiares",
                                    valor: ficha?.familiares?.length || 0,
                                },
                                {
                                    label: "Formación",
                                    valor: (ficha?.formacion_academica?.length || 0) +
                                        (ficha?.otros_estudios?.length || 0),
                                },
                                {
                                    label: "Experiencia",
                                    valor: (ficha?.experiencia_laboral?.length || 0) +
                                        (ficha?.experiencia_docente?.length || 0),
                                },
                            ].map(({ label, valor }) => (
                                <div key={label}
                                    className="text-center p-2 bg-slate-50 rounded-lg
                             border border-slate-200">
                                    <p className="text-lg font-black text-primary-600">{valor}</p>
                                    <p className="text-xs text-slate-400">{label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Declaración jurada — checkbox obligatorio */}
                    <label className={`flex items-start gap-3 px-3 py-3 rounded-xl
                                      border cursor-pointer transition-colors
                        ${declaracion
                            ? "bg-green-50 border-green-300"
                            : "bg-amber-50 border-amber-200 hover:border-amber-300"
                        }`}>
                        <input
                            type="checkbox"
                            checked={declaracion}
                            onChange={(e) => setDeclaracion(e.target.checked)}
                            className="mt-0.5 w-4 h-4 rounded border-slate-300
                                       text-primary-600 focus:ring-primary-500
                                       focus:ring-offset-0 cursor-pointer shrink-0"
                        />
                        <p className="text-xs leading-relaxed select-none
                                      ${declaracion ? 'text-green-700' : 'text-amber-700'}">
                            Declaro bajo juramento que la presente información expresa
                            la verdad, de conformidad con la{" "}
                            <strong>Ley N° 27444 — Ley de Procedimiento
                            Administrativo General</strong>.
                        </p>
                    </label>
                </div>

                {/* ── Footer con botones ───────────────────────── */}
                <div className="px-6 pb-6 flex flex-col-reverse sm:flex-row
                        gap-2 sm:gap-3">
                    <button
                        type="button"
                        onClick={onCancelar}
                        disabled={cargando}
                        className="btn-secondary flex-1 justify-center"
                    >
                        <X size={15} />
                        Revisar datos
                    </button>
                    <button
                        type="button"
                        onClick={onConfirmar}
                        disabled={cargando || !declaracion}
                        className={`btn-primary flex-1 justify-center transition-all
                            ${!declaracion
                                ? "opacity-50 cursor-not-allowed bg-slate-400 hover:bg-slate-400"
                                : "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                            }`}
                    >
                        {cargando
                            ? <><Loader2 size={15} className="animate-spin" /> Enviando...</>
                            : <><Send size={15} /> Confirmar envío</>
                        }
                    </button>
                </div>

            </div>
        </div>
    )
}