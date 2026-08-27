import { useState, useEffect } from "react"
import {
    Clock, FileText, Shield, ChevronRight,
    CheckCircle2, AlertCircle, Users,
} from "lucide-react"
import logoUnamba from "../../assets/logo-unamba.png"

export default function ModalBienvenida({ onComenzar }) {
    const [visible, setVisible] = useState(false)

    // Animar entrada con pequeño delay
    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 100)
        return () => clearTimeout(t)
    }, [])

    const handleComenzar = () => {
        setVisible(false)
        setTimeout(onComenzar, 300)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Fondo con gradiente institucional */}
            <div className="absolute inset-0 bg-slate-200" />

            {/* Panel principal */}
            <div className={`
            relative bg-white rounded-2xl shadow-2xl w-full max-w-lg
            overflow-hidden transition-all duration-300
            ${visible
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-4 scale-95"
            }`}>

                {/* ── Cabecera institucional ─────────────────────── */}
                <div className="bg-gradient-to-r from-unamba-blue to-primary-700 px-6 py-5">
                    <div className="flex items-center gap-5">
                        {/* Logo — sin bordes, más grande */}
                        <div className="bg-white rounded-lg p-2 shadow-lg">
                            <img
                                src={logoUnamba}
                                alt="Logo UNAMBA"
                                className="w-20 h-20 object-contain rounded-none"
                            />
                        </div>
                        <div className="flex-1">
                            <p className="text-blue-200 text-xs font-medium uppercase tracking-widest mb-0.5">
                                Universidad Nacional Micaela Bastidas de Apurímac
                            </p>
                            <h1 className="text-white font-bold text-base leading-tight">
                                Ficha de Registro de Datos del Personal
                            </h1>
                            <p className="text-blue-300 text-xs mt-0.5">
                                Oficina de RR.HH. · Sub Oficina de Escalafón y Asuntos Laborales
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── Cuerpo informativo ─────────────────────────── */}
                <div className="px-6 py-5 space-y-5">

                    {/* Descripción */}
                    <p className="text-sm text-slate-600 leading-relaxed">
                        Este formulario digitaliza la <strong>Ficha de Registro de Datos
                            del Personal Docente y No Docente</strong> de la UNAMBA para
                        centralizar su información administrativa, de planillas y
                        beneficios sociales.
                    </p>

                    {/* Información del proceso */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="text-center p-3 bg-primary-50 rounded-xl
                            border border-primary-100">
                            <FileText size={20} className="text-primary-600 mx-auto mb-1" />
                            <p className="text-lg font-black text-primary-700">7</p>
                            <p className="text-xs text-slate-500">Secciones</p>
                        </div>
                        <div className="text-center p-3 bg-amber-50 rounded-xl
                            border border-amber-100">
                            <Clock size={20} className="text-amber-500 mx-auto mb-1" />
                            <p className="text-lg font-black text-amber-600">15–20</p>
                            <p className="text-xs text-slate-500">Minutos aprox.</p>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-xl
                            border border-green-100">
                            <Shield size={20} className="text-green-500 mx-auto mb-1" />
                            <p className="text-lg font-black text-green-600">100%</p>
                            <p className="text-xs text-slate-500">Seguro</p>
                        </div>
                    </div>

                    {/* Qué necesita tener */}
                    <div className="space-y-2">
                        <p className="text-xs font-semibold text-slate-600 uppercase
                          tracking-wide">
                            Tenga a la mano antes de comenzar
                        </p>
                        <div className="space-y-1.5">
                            {[
                                "DNI y libreta militar (si aplica)",
                                "Número de cuenta bancaria y CCI",
                                "Documentos de formación académica (títulos, diplomas)",
                                "Foto de perfil en formato JPG o PNG",
                                "Código RENACYT (si es investigador)",
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-2">
                                    <CheckCircle2 size={13}
                                        className="text-green-500 shrink-0 mt-0.5" />
                                    <p className="text-xs text-slate-600">{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Aviso importante */}
                    <div className="flex items-start gap-2.5 px-3 py-3 bg-amber-50
                          border border-amber-200 rounded-xl">
                        <AlertCircle size={14}
                            className="text-amber-500 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <p className="text-xs font-semibold text-amber-700">
                                Importante
                            </p>
                            <p className="text-xs text-amber-600 leading-relaxed">
                                Al finalizar, sus datos
                                quedarán registrados bajo <strong>declaración jurada</strong>{" "}
                                conforme a la Ley N° 27444.
                            </p>
                        </div>
                    </div>

                </div>

                {/* ── Footer con botón ───────────────────────────── */}
                <div className="px-6 pb-6">
                    <button
                        type="button"
                        onClick={handleComenzar}
                        className="btn-primary w-full justify-center text-sm py-3
                       bg-unamba-blue hover:bg-primary-800
                       focus:ring-unamba-blue"
                    >
                        Comenzar registro
                        <ChevronRight size={16} />
                    </button>
                    <p className="text-center text-xs text-slate-400 mt-3">
                        Resolución N° 021-2020-SUNEDU/CD · UNAMBA Licenciada
                    </p>
                </div>

            </div>
        </div>
    )
}